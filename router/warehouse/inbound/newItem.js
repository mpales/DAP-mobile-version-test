import React from 'react';
import {Text, Button,Image, Input, Divider} from 'react-native-elements';
import {View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Mixins from '../../../mixins';

class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      bottomSheet: false,
      isShowSignature: false,
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
      
    };
    this.registerBarcode.bind(this);
    this.submitItem.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList} = props;
    const {dataCode, sku} = state;
    if(sku === ''){
      const {routes, index} = navigation.dangerouslyGetState();
       if(routes[index].params !== undefined && routes[index].params.attrSKU !== undefined){
         //if multiple sku
        let manifest = manifestList.find((element)=>element.sku === routes[index].params.attrSKU);
        return {...state, sku : manifest.sku, description: manifest.name,};
      }
      return {...state};
    } 
    
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.keyStack !== nextProps.keyStack){
      if(nextProps.keyStack === 'newItem' && this.props.keyStack ==='RegisterBarcode'){
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined){
          //if multiple sku
          this.setState({barcode: routes[index].params.inputCode});
        }
        return false;
      }
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    
  }
  registerBarcode = () => {
    const {sku} = this.state;
    this.props.navigation.navigate({
      name: 'RegisterBarcode',
      params: {
        attrSKU: sku,
      }
    })
  };
  submitItem = ()=>{
    const {manifestList} = this.props;
    const {dataCode, barcode, sku, expDate,mfgDate,size,color,classcode,country,height, weight} = this.state;
    let manifest = []
    
      manifest = Array.from({length: manifestList.length}).map((num, index, arr) => {
      if(sku === manifestList[index].sku){
        return {
          ...manifestList[index],
            code: barcode,
            color:color,
            timestamp: moment().unix(),
            scanned: 0,
            weight: weight,
            category: 'test',
        };
      } else {
      return manifestList[index];  
      }
    });

    this.props.setManifestList(manifest)
    this.props.setBottomBar(false);
    this.props.navigation.navigate('Manifest');
  }
 
  render(){
    const {barcode, sku,description, uom, length,width,height,volweight,weight,pcscarton} = this.state;
    return (
        <View style={{flex: 1, flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 22,paddingVertical: 25}}>
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
            />
         </View>
         <Button
              containerStyle={{flex:1, marginRight: 0,marginVertical:30}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.submitItem}
              title="Update Attribute"
            />
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

