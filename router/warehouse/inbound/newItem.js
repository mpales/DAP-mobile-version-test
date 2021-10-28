import React from 'react';
import {Text, Button,Image, Input, Divider} from 'react-native-elements';
import {View, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Mixins from '../../../mixins';
import {putData, getData} from '../../../component/helper/network';
import Banner from '../../../component/banner/banner';
class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      bottomSheet: false,
      isShowSignature: false,
      productID : null,
      barcode : '',
      sku: '',
      description: '',
      uom : '',
      length: '',
      width: '',
      height: '',
      volweight: '',
      weight: '',
      pcscarton: '',
      errors : '',
      keyboardState : 'hide',
    };
    this.registerBarcode.bind(this);
    this.submitItem.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList} = props;
    const {dataCode, sku} = state;
    if(sku === ''){
      const {routes, index} = navigation.dangerouslyGetState();
       if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined){
         //if multiple sku
        let manifest = manifestList.find((element)=>element.pId === routes[index].params.inputCode);
        return {...state, 
          productID: manifest.pId,
          sku : String(manifest.item_code), 
          description: String(manifest.description),
          uom : String(manifest.uom),
          length: manifest.basic.length !== null ? String(manifest.basic.length) : '',
          width: manifest.basic.width !== null ? String(manifest.basic.width) : '',
          height: manifest.basic.height !== null ? String(manifest.basic.height) : '',
          volweight: manifest.basic.volume !== null ? String(manifest.basic.volume) : '',
          weight: manifest.basic.weight !== null ? String(manifest.basic.weight) : '',
          pcscarton: manifest.basic.carton_pcs !== null ? String(manifest.basic.carton_pcs) : '',
        };
      }
      return {...state};
    } 
    
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.keyStack !== nextProps.keyStack){
      if(nextProps.keyStack === 'newItem' && this.props.keyStack ==='RegisterBarcode'){
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if(routes[index].params !== undefined && routes[index].params.attrBarcode !== undefined){
          //if multiple sku
          this.setState({barcode: routes[index].params.attrBarcode});
        }
        return false;
      }
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot){
    const {currentASN, manifestList} = this.props;
    if(prevState.barcode !== this.state.barcode && this.state.barcode !== ''){
      const updatedBarcodes = await getData('inboundsMobile/'+currentASN+'/item-barcode');
      if(updatedBarcodes.error !== undefined){
        this.props.navigation.goBack();
      } else {
        let updatedManifest = [];
        for (let index = 0; index < manifestList.length; index++) {
          const element = manifestList[index];
          let findBarcode = updatedBarcodes.products.find((o)=> o.pId === element.pId);
          if(findBarcode !== undefined){
            updatedManifest[index] = {
              ...manifestList[index],
              barcodes: findBarcode.barcodes,
            }
          } else {
            updatedManifest[index] = manifestList[index];
          }
        }
      this.props.setManifestList(updatedManifest);
      }
    }
    if(prevState.length !== this.state.length || prevState.width !== this.state.width || prevState.height !== this.state.height){
      const {length,width,height} = this.state;
      if(length !== '' && width !== '' && height !== ''){
        let volweight = parseFloat(length) * parseFloat(width) * parseFloat(height);
        this.setState({
          volweight : ''+volweight,
        });
      }
    }
  }

  async componentDidMount(){
    const {currentASN} = this.props;
    const {productID} = this.state;
    if(productID !== null){
      const getAttributes = await getData('inboundsMobile/'+currentASN+'/'+productID+'/product-attributes');
      this.setState({
        length: getAttributes.basic.length !== null ? String(getAttributes.basic.length) : '',
        width: getAttributes.basic.width !== null ? String(getAttributes.basic.width) : '',
        height: getAttributes.basic.height !== null ? String(getAttributes.basic.height) : '',
        volweight: getAttributes.basic.volume !== null ? String(getAttributes.basic.volume) : '',
        weight: getAttributes.basic.weight !== null ? String(getAttributes.basic.weight) : '',
        pcscarton: getAttributes.basic.carton_pcs !== null ? String(getAttributes.basic.carton_pcs) : '',
      });
    }
    Keyboard.addListener("keyboardDidShow", this.keyboardDidShowHandle);
    Keyboard.addListener("keyboardDidHide", this.keyboardDidHideHandle);
  }
  componentWillUnmount(){
    Keyboard.removeListener("keyboardDidShow", this.keyboardDidShowHandle);
    Keyboard.removeListener("keyboardDidHide", this.keyboardDidHideHandle);
  }
  keyboardDidShowHandle = ()=>{
    this.setState({keyboardState:'show'})
  };
  keyboardDidHideHandle = ()=>{
    this.setState({keyboardState:'hide'})
  };
  registerBarcode = () => {
    const {productID} = this.state;
    this.props.navigation.navigate({
      name: 'RegisterBarcode',
      params: {
        inputCode: productID,
      }
    })
  };
  closeErrorBanner = ()=>{
    this.setState({errors:''});
  }
  submitItem = async ()=>{
    const {manifestList,currentASN} = this.props;
    const {productID,length,width,height,volweight,weight,pcscarton} = this.state;
    const updateAttr = await putData('inboundsMobile/'+currentASN+'/'+productID+'/product-attributes',{
      length : parseFloat(length) ,
      weight: parseFloat(weight),
      width: parseFloat(width),
      height: parseFloat(height),
      volume: parseFloat(volweight),
      pcs : parseInt(pcscarton),
    });
    if(typeof updateAttr !== 'object'){

      const updatedManifestAttr = Array.from({length: manifestList.length}).map((num, index, arr) => {
        if(productID === manifestList[index].pId){
          return {
            ...manifestList[index],
            basic: {
              ...manifestList[index].basic,
              length : parseFloat(length) ,
              weight: parseFloat(weight),
              width: parseFloat(width),
              height: parseFloat(height),
              volume: parseFloat(volweight),
              carton_pcs : parseInt(pcscarton),
            }
          };
        } else {
        return manifestList[index];  
        }
      });
      Keyboard.removeListener("keyboardDidShow", this.keyboardDidShowHandle);
      Keyboard.removeListener("keyboardDidHide", this.keyboardDidHideHandle);
      this.props.setManifestList(updatedManifestAttr)
      this.props.setBottomBar(false);
      this.props.navigation.navigate('Manifest');
    
    } else {
      if(updateAttr.error !== undefined){
        this.setState({errors: updateAttr.error});
      }
    }
  }
 
  render(){
    const {barcode, sku,description, uom, length,width,height,volweight,weight,pcscarton} = this.state;
    return (
        <View style={{flex: 1, flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 22,paddingVertical: 25}}>
          {this.state.errors !== '' && (<Banner
            title={this.state.errors}
            backgroundColor="#F1811C"
            closeBanner={this.closeErrorBanner}
          />)}
        {this.state.keyboardState === 'hide' && (
        <> 
        <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
             <Text>Item Code</Text>
             </View>
             <Input 
                            containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
                inputContainerStyle={[Mixins.containedInputDisabledContainer,styles.textInput]} 
                inputStyle={Mixins.containedInputDisabledStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                disabled={true}
                value={sku}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
               <Text>Description</Text>
             </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
              inputContainerStyle={[Mixins.containedInputDisabledContainer,styles.textInput]} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                disabled={true}
                value={description}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
              <Text>Barcode</Text>
             </View>
             <View style={{flexDirection:'column',flex:1}}>
             <Input 
               containerStyle={{flexShrink: 1,marginVertical:5,maxHeight:30}}
               inputContainerStyle={[Mixins.containedInputDisabledContainer,styles.textInput]} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                onChangeText={(text)=>{this.setState({barcode:text})}}
                value={barcode}
                disabled={true}
            />
              <Button
              containerStyle={{flexShrink:1, marginTop: 5,marginBottom:15,paddingHorizontal:10, maxHeight:30}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0, paddingVertical:0}]}
              titleStyle={[styles.buttonText,{lineHeight:27}]}
              onPress={this.registerBarcode}
              title="Register Barcode"
            />
            </View>
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
             <Text>UOM</Text>
             </View>
             <Input 
               containerStyle={{flex: 1,paddingVertical:0}}
               inputContainerStyle={[Mixins.containedInputDisabledContainer,styles.textInput]} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={true}
                value={uom}
            />
         </View>
        <Divider />
        </>
        )}
        <Text style={{...Mixins.h6,lineHeight: 27,fontWeight:'700',color:'#424141'}}>Carton Dimensions</Text>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 140, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Length ( m )</Text>
             </View>
             <Input 
                 containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
                inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                onChangeText={(text)=>{this.setState({length:text})}}
                keyboardType="number-pad"
                value={length}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 140, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Width ( m )</Text>
           </View>
             <Input 
             containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                onChangeText={(text)=>{this.setState({width:text})}}
                keyboardType="number-pad"
                value={width}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 140, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Height ( m )</Text>
           </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                onChangeText={(text)=>{this.setState({height:text})}}
                keyboardType="number-pad"
                value={height}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 140, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Vol. Weight ( m3 )</Text>
           </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                onChangeText={(text)=>{this.setState({volweight:text})}}
                value={volweight}
                disabled={volweight === '' ? true : false}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 140, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Weight ( Kg )</Text>
           </View>
             <Input 
                          containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                onChangeText={(text)=>{this.setState({weight:text})}}
                value={weight}
                keyboardType="number-pad"
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 140, alignItems: 'flex-start',marginRight: 20}}>
          <Text># Pcs per carton</Text>
           </View>
             <Input 
                        containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                onChangeText={(text)=>{this.setState({pcscarton:text})}}
                value={pcscarton}
                keyboardType="number-pad"
            />
         </View>
        {this.state.keyboardState === 'hide' && ( <Button
              containerStyle={{flex:1, marginRight: 0,marginVertical:30}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.submitItem}
              disabled={this.state.length !== '' && this.state.weight !== '' & this.state.pcscarton !== '' && this.state.volweight !== '' && this.state.width !== '' && this.state.height !== '' ? false : true}
              title="Update Attribute"
            />)}
        </View>
    );
  }
}

const styles = {
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 30,
},
  sectionSheetButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  deliveryText: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight:'600',
    color: '#ffffff',
  },
  buttonText: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight:'600',
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  buttonDivider: {
    flex: 1,
  },
  sectionInput: {
    flexDirection: 'column',
    borderRadius: 13,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    marginBottom: 30,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  inputHead: {
    marginVertical: 12,
    ...Mixins.h4,
    lineHeight: 27,
  },
  sectionButtonGroup: {
    flexDirection: 'row',
  },
  sectionContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionText: {
    textAlign: 'center',
    width: 83,
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#6C6B6B',
    marginVertical: 12,
  },
  containerInput: {
    borderBottomColor: '#ABABAB',
    borderBottomWidth: 1,
    marginVertical: 0,
    paddingVertical: 0,
  },
  inputStyle: {
    ...Mixins.lineInputDefaultStyle,
    ...Mixins.body1,
    marginHorizontal: 0,
    flexShrink: 1,
    minHeight: 30,
    lineHeight: 21,
    fontWeight: '400',
  },
  labelStyle: {
    ...Mixins.lineInputDefaultLabel,
    ...Mixins.body1,
    lineHeight: 14,
    fontWeight: '400',
  },
  inputErrorStyle: {
    ...Mixins.body2,
    lineHeight: 14,
    marginVertical: 0,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 13,
    elevation: 8,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 0,
  },
  checkmark: {
    position: 'absolute', 
    bottom: 62, 
    right: 16
  },
};
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isPhotoProofSubmitted: state.originReducer.filters.isPhotoProofSubmitted,
    isSignatureSubmitted: state.originReducer.filters.isSignatureSubmitted,
    manifestList: state.originReducer.manifestList,
    keyStack: state.originReducer.filters.keyStack,
    currentASN : state.originReducer.filters.currentASN,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    signatureSubmittedHandler: (signature) => dispatch({type: 'Signature', payload: signature}),
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setStartDelivered : (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    },
    setFromBarcode: (dataCode) => {
      return dispatch({type: 'fromBarcode', payload: dataCode});
    },
    setManifestList: (data) => {
      return dispatch({type: 'ManifestList', payload: data});
    },
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

