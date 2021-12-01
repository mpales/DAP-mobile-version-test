import React from 'react';
import {Text, Button,Image, Input, Divider, Avatar, Overlay} from 'react-native-elements';
import {View, Keyboard, ScrollView, TouchableOpacity, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Mixins from '../../../mixins';
import {putData, getData, postBlob, postData, putBlob} from '../../../component/helper/network';
import Banner from '../../../component/banner/banner';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import IconView from '../../../assets/icon/iconmonstr-picture-1 1mobile.svg';
import IconBarcodeMobile from '../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';
import EmptyIlustrate from '../../../assets/icon/Groupempty.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import UploadTooltip from '../../../component/include/upload-tooltip';
import RNFetchBlob from 'rn-fetch-blob';
const window = Dimensions.get('window');
class Acknowledge extends React.Component {
  unsubscribe = null;
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
      errorsphoto : '',
      labelerror: false,
      submitPhoto: false,
      validPhoto: false,
      _manifest: null,
      keyboardState : 'hide',
    };
    this.submitItem.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList, loadFromGallery} = props;
    const {dataCode, sku} = state;
    if(sku === ''){
      const {routes, index} = navigation.dangerouslyGetState();
       if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined){
         //if multiple sku
        loadFromGallery({gtype: 'receiving',gID : routes[index].params.inputCode });
 
        return {...state, 
          _inputCode : routes[index].params.inputCode,
        };
      }
      return {...state};
    } 
    
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.keyStack !== nextProps.keyStack){
      if(nextProps.keyStack === 'CompleteReceiving' && this.props.keyStack === 'SingleCamera'){ 
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if(routes[index].params !== undefined && routes[index].params.submitPhoto !== undefined  && routes[index].params.submitPhoto === true){
          //if multiple sku
          this.setState({submitPhoto: true});
        }
        return false;
      }
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot){
    const {currentASN, manifestList} = this.props;
   
    if(prevState.submitPhoto !== this.state.submitPhoto && this.state.submitPhoto === true){
      if(this.props.receivingPhotoPostpone !== null){
        this.setState({submitPhoto:false, overlayProgress:true});
        await this.uploadSubmittedPhoto();
      } else {
        this.setState({submitPhoto:false,errorsphoto:'take a Photo Proof before continue process', labelerror: true})
      }

    }
   
  }

  async componentDidMount(){
    const result = await getData('inboundsMobile/'+this.state._inputCode+'/photosIds');
    if(typeof result === 'object' && result.error === undefined){
      for (let index = 0; index < result.inbound_photos.length; index++) {
        const element = result.inbound_photos[index].photoId;
        if(result.inbound_photos[index].status === 4){
          this.setState({validPhoto : true});
          break;
        }
      }
    
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
 
  closeErrorBanner = ()=>{
    this.setState({errors:''});
  }
  submitItem = async ()=>{
    const {manifestList} = this.props;
    const {productID,length,width,height,volweight,weight,_inputCode} = this.state;
    const result = await postData('/inboundsMobile/'+_inputCode+'/complete-receiving')
    console.log(result);
    if(typeof result !== 'object'){
      this.props.navigation.navigate('Completed');
    } else {
      if(result.error !== undefined) this.setState({errors:result.error, });
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
  getPhotoReceivingGoods = async () => {
    const {receivingPhotoPostpone} = this.props;
    let formdata = [];
    for (let index = 0; index < receivingPhotoPostpone.length; index++) {
      let name,filename,path,type ='';
      await RNFetchBlob.fs.stat(receivingPhotoPostpone[index]).then((FSStat)=>{
        name = FSStat.filename.replace('.','-');
        filename= FSStat.filename;
        path = FSStat.path;
        type = FSStat.type;
      });
      if(type === 'file')
      formdata.push({ name : 'photos', filename : filename, type:'image/jpg', data: RNFetchBlob.wrap(path)})
    }
    return formdata;
  }
  listenToProgressUpload = (written, total) => {
    this.setState({progressLinearVal:(1/total)*written});
  }
  uploadSubmittedPhoto = async () => {
    const {attributePhotoPostpone} = this.props;
    const {productID} = this.state;
    const {currentASN} = this.props;
    let FormData = await this.getPhotoReceivingGoods();
    putBlob('/inboundsMobile/'+currentASN+'/complete-receiving', [
      // element with property `filename` will be transformed into `file` in form data
      //{ name : 'receiptNumber', data: this.state.data.inbound_asn !== null ? this.state.data.inbound_asn.reference_id :  this.state.data.inbound_grn !== null ?  this.state.data.inbound_grn.reference_id : this.state.data.inbound_other.reference_id},
      // custom content type
      ...FormData,
    ], this.listenToProgressUpload).then(result=>{
      if(typeof result !== 'object'){
        this.props.addReceivingPostpone( null );
        this.setState({ progressLinearVal:0, errorsphoto:result, labelerror : false,overlayProgress : false,validPhoto : true});         
    } else {       
      if(typeof result === 'object'){
        this.setState({errorsphoto: result.error,progressLinearVal:0, labelerror: true,overlayProgress : false,validPhoto : false});
      }
    }
    });
  };
  render(){
    const {barcode, sku,description, uom, length,width,height,volweight,weight,pcscarton} = this.state;
    return (
      <>
      {this.state.errors !== '' && (<Banner
            title={this.state.errors}
            backgroundColor="#F1811C"
            closeBanner={this.closeErrorBanner}
          />)}
        <ScrollView style={{flex: 1, flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 10,paddingVertical: 25}}>        
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
           <Text style={{...Mixins.h6,lineHeight: 27,fontWeight:'700',color:'#17B055', textAlign:'center'}}>Photo Required</Text>
           </View>
           <Divider color="#D5D5D5"/>
           <View style={{flexDirection:'row', paddingHorizontal:20,marginTop:0,}}>
           <View style={[styles.sheetPackages,{alignItems: 'center',justifyContent: 'center',marginHorizontal: 0, marginTop: 20, flexGrow:1}]}>
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
                  backgroundColor: this.props.receivingProofID !== null && this.props.receivingProofID !== this.state._inputCode ? 'grey' : this.props.receivingPhotoPostpone !== null  
                  ? '#17B055'
                  : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                containerStyle={{   alignSelf:'center'}}
                />
                  <View style={{marginVertical: 5, paddingHorizontal:40}}>
                  <UploadTooltip 
                      overlayLinearProgress={{
                      value:this.state.progressLinearVal, 
                      color:"#F1811C",
                      variant:"determinate", 
                      style:{height:13, backgroundColor:'white', borderRadius:10}
                      }} 
                        value={this.state.progressLinearVal} 
                        color="primary" 
                        style={{width:80}} 
                        variant="determinate"
                        enabled={this.state.overlayProgress}
                      />
                  </View>
                {/* <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/> */}
                <View style={{maxWidth: 200, justifyContent:'center', alignItems:'center', alignSelf:'center'}}>
                <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B', textAlign:'center'}}>Photo Proof Complete
Receiving</Text>
                </View>
                {this.state.errorsphoto !== '' && ( <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '400',color: this.state.labelerror === false ? '#17B055' : 'red'}}>{this.state.errorsphoto}</Text>)}
              </View>
           </View>
         </View>
        {this.state.keyboardState === 'hide' && ( <Button
              containerStyle={{flex:1, marginRight: 0,marginVertical:30}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.toggleOverlay}
              disabled={this.state.validPhoto === true ? false : true}
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
    receivingPhotoPostpone: state.originReducer.receivingPhotoPostpone,
    receivingProofID: state.originReducer.receivingProofID,
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
    addReceivingPostpone: (uri) => dispatch({type: 'receivingPostpone', payload: uri}),
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

