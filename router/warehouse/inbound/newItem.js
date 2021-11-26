import React from 'react';
import {Text, Button,Image, Input, Divider, Avatar, Overlay} from 'react-native-elements';
import {View, Keyboard, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Mixins from '../../../mixins';
import {putData, getData} from '../../../component/helper/network';
import Banner from '../../../component/banner/banner';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import IconView from '../../../assets/icon/iconmonstr-picture-1 1mobile.svg';
import IconBarcodeMobile from '../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';
import EmptyIlustrate from '../../../assets/icon/Groupempty.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
const window = Dimensions.get('window');
class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      _visibleOverlay : false,
      bottomSheet: false,
      _inputCode : null,
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
    const {navigation, manifestList, loadFromGallery} = props;
    const {dataCode, sku} = state;
    if(sku === ''){
      const {routes, index} = navigation.dangerouslyGetState();
       if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined){
         //if multiple sku
        loadFromGallery({gtype: 'attribute',gID : routes[index].params.inputCode });
        let manifest = manifestList.find((element)=>element.pId === routes[index].params.inputCode);
        return {...state, 
          productID: manifest.pId,
          _inputCode : routes[index].params.inputCode,
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
  toggleOverlay =()=> {
    const {_visibleOverlay} = this.state;
    this.setState({_visibleOverlay: !_visibleOverlay})
  }
  handleConfirm = async ({action}) => {
    this.toggleOverlay();
    if(action) {
      // for prototype only
      this.submitItem();
      // end

     // this.props.navigation.navigate('containerDetail');
    }
  }
  render(){
    const {barcode, sku,description, uom, length,width,height,volweight,weight,pcscarton} = this.state;
    return (
      <>
        <ScrollView style={{flex: 1, flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 10,paddingVertical: 25}}>
          {this.state.errors !== '' && (<Banner
            title={this.state.errors}
            backgroundColor="#F1811C"
            closeBanner={this.closeErrorBanner}
          />)}
        {this.state.keyboardState === 'hide' && (
          <View>
        <View style={{
        marginHorizontal:10, marginVertical:10, 
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor:'#2A3386',
        borderRadius:5,
        paddingVertical:20,
        }}> 
         <View style={{flexDirection:'row', flexShrink:1, marginBottom:10}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 120, alignItems: 'flex-start',marginRight: 20}}>
             <Text style={{...Mixins.subtitle3, color:'white', fontWeight:'700'}}>Item Code</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0, marginVertical:0, flexDirection:'row',paddingHorizontal:0, marginHorizontal:0}}
                inputContainerStyle={{borderWidth:0,borderBottomWidth:0, paddingVertical:0, marginVertical:0, alignItems:'flex-start',justifyContent:'flex-start',alignContent:'flex-start', flexDirection:'column-reverse', borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 5, backgroundColor:"#2A3386", flex:1, marginHorizontal:0, paddingHorizontal:0}} 
                inputStyle={{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21, color:'white',borderWidth: 0, backgroundColor:'transparent', alignSelf:'flex-start', textAlign:'left', paddingHorizontal:10, paddingVertical:5, marginHorizontal:0, marginVertical:0}}
                disabledInputStyle={{opacity: 1}}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0,}]}
                value={sku}
                multiline={true}
                disabled={true}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1, marginBottom:10}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 120, alignItems: 'flex-start',marginRight: 20}}>
         <Text style={{...Mixins.subtitle3, color:'white', fontWeight:'700'}}>Description</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0, marginVertical:0, flexDirection:'row',paddingHorizontal:0, marginHorizontal:0}}
                inputContainerStyle={{borderWidth:0,borderBottomWidth:0, paddingVertical:0, marginVertical:0, alignItems:'flex-start',justifyContent:'flex-start',alignContent:'flex-start', flexDirection:'column-reverse', borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 5, backgroundColor:"#2A3386", flex:1, marginHorizontal:0, paddingHorizontal:0}} 
                inputStyle={{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21, color:'white',borderWidth: 0, backgroundColor:'transparent', alignSelf:'flex-start', textAlign:'left', paddingHorizontal:10, paddingVertical:5, marginHorizontal:0, marginVertical:0}}
                disabledInputStyle={{opacity: 1}}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0,}]}
                value={description}
                multiline={true}
                disabled={true}
            />
          
         </View>
         <View style={{flexDirection:'row', flexShrink:1, marginBottom:10}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 120, alignItems: 'flex-start',marginRight: 20}}>
         <Text style={{...Mixins.subtitle3, color:'white', fontWeight:'700'}}>UOM</Text>
             </View>
             <Input 
                containerStyle={{flexShrink: 1,paddingVertical:0, marginVertical:0, flexDirection:'row',paddingHorizontal:0, marginHorizontal:0}}
                inputContainerStyle={{borderWidth:0,borderBottomWidth:0, paddingVertical:0, marginVertical:0, alignItems:'flex-start',justifyContent:'flex-start',alignContent:'flex-start', flexDirection:'column-reverse', borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 5, backgroundColor:"#2A3386", flexShrink:1, marginHorizontal:0, paddingHorizontal:0, maxWidth:70}} 
                inputStyle={{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21, color:'white',borderWidth: 0, backgroundColor:'transparent', alignSelf:'flex-start', textAlign:'left', textAlignVertical:'top', paddingHorizontal:10, paddingVertical:5, marginHorizontal:0, marginVertical:0}}
                disabledInputStyle={{opacity: 1}}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0,}]}
                value={uom}
                multiline={true}
                disabled={true}
            />
            
            <EmptyIlustrate width="70" height="70" style={{marginHorizontal:20}}/>
         </View>
        </View>
          <View style={{
            marginHorizontal:10, marginVertical:10, 
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor:'white',
            borderRadius:5,
            paddingVertical:20,
            }}> 
            <View style={{paddingHorizontal:20, marginBottom:10}}>
            <Text style={{...Mixins.h6,lineHeight: 27,fontWeight:'700',color:'#424141'}}>Barcode</Text>
            </View>
            <Divider color="#D5D5D5"/>
              <View style={{flexDirection:'row', flexShrink:1, marginBottom:10, paddingHorizontal:20,marginTop:20}}>
              <View style={{flexShrink:1, backgroundColor: 'transparent', paddingHorizontal: 0, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 80, alignItems: 'flex-start',marginRight: 20}}>
              <Text style={{...Mixins.subtitle3, color:'black', fontWeight:'700'}}>Barcode</Text>
                  </View>
                  <View style={{flexDirection:'row',flex:1}}>
                  <Input 
                    containerStyle={{flex: 1,paddingVertical:0, marginVertical:0, flexDirection:'row',paddingHorizontal:0, marginHorizontal:0}}
                    inputContainerStyle={{borderWidth:0,borderBottomWidth:0, paddingVertical:0, marginVertical:0, alignItems:'flex-start',justifyContent:'flex-start',alignContent:'flex-start', flexDirection:'column-reverse', borderWidth: 0,
                    borderColor: 'transparent',
                    borderRadius: 5, backgroundColor:"#D5D5D5", flex:1, marginHorizontal:0, paddingHorizontal:0}} 
                    inputStyle={{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21, color:'#424141',borderWidth: 0, backgroundColor:'transparent', alignSelf:'flex-start', textAlign:'left', paddingHorizontal:10, paddingVertical:5, marginHorizontal:0, marginVertical:0}}
                    disabledInputStyle={{opacity: 1}}
                    labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0,}]}
                    value={barcode}
                    multiline={true}
                    disabled={true}
                />
                 <Avatar
                size={40}
                ImageComponent={() => (
                  <IconBarcodeMobile height="20" width="20" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    ...Mixins.buttonAvatarDefaultIconStyle,
                    paddingTop:10,
                    paddingBottom:0,
                    justifyContent:'center',
                  },
                }}
                overlayContainerStyle={styles.barcodeButton}
                onPress={this.registerBarcode}
                activeOpacity={0.7}
                containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
              />
               
                </View>
              </View>
              </View>
          </View>
        )}
        
        <View style={{
          marginHorizontal:10, 
          marginVertical:10, 
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor:'white',
        borderRadius:5,
        paddingVertical:20,
        }}>
               <View style={{paddingHorizontal:20, marginBottom:10}}>
          <Text style={{...Mixins.h6,lineHeight: 27,fontWeight:'700',color:'#424141'}}>Carton Dimensions</Text>
          </View>
          <Divider color="#D5D5D5"/>
          <View style={{flexDirection:'row', flexShrink:1, marginBottom:0, paddingHorizontal:10,marginTop:20}}>
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
          <View style={{flexDirection:'row', flexShrink:1,  paddingHorizontal:10,}}>
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
          <View style={{flexDirection:'row', flexShrink:1,  paddingHorizontal:10,}}>
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
          <View style={{flexDirection:'row', flexShrink:1,  paddingHorizontal:10,}}>
            <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 140, alignItems: 'flex-start',marginRight: 20}}>
            <Text>Vol. Weight ( m3 )</Text>
            </View>
              <Input 
                  containerStyle={{flex: 1,paddingVertical:0, maxHeight:30,marginVertical:5}}
                inputContainerStyle={styles.textInput} 
                  inputStyle={Mixins.containedInputDefaultStyle}
                  labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
                  onChangeText={(text)=>{this.setState({volweight:text})}}
                  value={String(parseFloat(volweight).toFixed(2))}
                  disabled={true}
              />
          </View>
          <View style={{flexDirection:'row', flexShrink:1,  paddingHorizontal:10,}}>
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
          <View style={{flexDirection:'row', flexShrink:1,  paddingHorizontal:10,}}>
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
         </View>
         <View style={{
           marginHorizontal:10, 
           marginVertical:10, 
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor:'white',
        borderRadius:5,
        paddingVertical:20
        }}>
          <View style={{paddingHorizontal:20, marginBottom:10}}>
           <Text style={{...Mixins.h6,lineHeight: 27,fontWeight:'700',color:'#424141'}}>Take Photo</Text>
           </View>
           <Divider color="#D5D5D5"/>
           <View style={{flexDirection:'row', paddingHorizontal:20,marginTop:0}}>
           <View style={[styles.sheetPackages,{alignItems: 'center',justifyContent: 'center',marginHorizontal: 32, marginTop: 20}]}>
              <Avatar
                onPress={()=>{
                  this.props.navigation.navigate('SingleCamera');
                }}
                size={79}
                ImageComponent={() => (
                  <>
                    <IconPhoto5 height="40" width="40" fill="#fff" />
                    {(this.props.attributePhotoPostpone !== null && (this.props.attributeProofID !== null && this.props.attributeProofID === this.state._inputCode)) && (
                      <Checkmark
                        height="20"
                        width="20"
                        fill="#fff"
                        style={styles.checkmarkUpload}
                      />
                    )}
                  </>
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: this.props.attributeProofID !== null && this.props.attributeProofID !== this.state._inputCode ? 'grey' : this.props.attributePhotoPostpone !== null  
                  ? '#17B055'
                  : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}/>

                {/* <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/> */}
                <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B'}}>Take Photo</Text>
              </View>
              <View style={[styles.sheetPackages,{alignItems: 'center',justifyContent: 'center',marginHorizontal: 32, marginTop: 20}]}>
              <Avatar
                onPress={()=>{
                  this.props.navigation.navigate('ViewPhotoAttributes',{number:1});
                }}
                size={79}
                ImageComponent={() => (
                  <>
                    <IconView height="40" width="40" fill="#F07120" />
                  </>
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: '#fff',
                  borderColor:"#424141",
                  borderWidth:1,
                  flex: 2,
                  borderRadius: 5,
                }}/>

                {/* <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/> */}
                <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B'}}>View Photo</Text>
              </View>
           </View>
         </View>
        {this.state.keyboardState === 'hide' && ( <Button
              containerStyle={{flex:1, marginRight: 0,marginVertical:30}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.toggleOverlay}
              disabled={this.state.length !== '' && this.state.weight !== '' & this.state.pcscarton !== '' && this.state.volweight !== '' && this.state.width !== '' && this.state.height !== '' ? false : true}
              title="Confirm"
            />)}
          
        </ScrollView>
        <Overlay fullScreen={false} overlayStyle={styles.overlayContainerStyle} isVisible={this.state._visibleOverlay} onBackdropPress={this.toggleOverlay}>
            <Text style={styles.confirmText}>Are you sure you want Confirm Record  ?</Text>
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity 
                style={[styles.cancelButton, {borderWidth: 1, borderColor: '#ABABAB'}]}
                onPress={() => this.handleConfirm({action: false})}
              >
              <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                onPress={() => this.handleConfirm({action: true})}
              >
                <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Overlay>
        </>
    );
  }
}

const styles = {
  overlayContainerStyle: {
    position:'absolute',
    bottom:0,
    right:0,
    left:0,
    height:window.height * 0.3,
    borderTopRightRadius: 20, 
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cancelButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  confirmText: {
    ...Mixins.h6,
    lineHeight:25,
    textAlign: 'center',
  },
  cancelText: {
    ...Mixins.h6,
    lineHeight:25,
    textAlign: 'center',
  },
  cancelButton: {
    width: '40%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
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
  checkmarkUpload: {
    position: 'absolute', 
    bottom: 5, 
    right: 5
  },
  barcodeButton: {
    ...Mixins.buttonAvatarDefaultOverlayStyle,
    backgroundColor: '#F07120',
    borderRadius: 100,
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
    attributePhotoPostpone: state.originReducer.attributePhotoPostpone,
    attributeProofID: state.originReducer.attributeProofID,
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
    loadFromGallery: (action) => {
      return dispatch({type:'loadFromGallery', payload: action});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

