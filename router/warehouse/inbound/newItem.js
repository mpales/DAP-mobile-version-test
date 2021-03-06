import React from 'react';
import {
  Text,
  Button,
  Image,
  Input,
  Divider,
  Avatar,
  Overlay,
} from 'react-native-elements';
import {
  View,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Mixins from '../../../mixins';
import Svg, {
  Path,
  Rect,
} from 'react-native-svg';
import {
  putData,
  getData,
  postBlob,
  postData,
} from '../../../component/helper/network';
import SelectDropdown from 'react-native-select-dropdown';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import Banner from '../../../component/banner/banner';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import IconView from '../../../assets/icon/iconmonstr-picture-1 1mobile.svg';
import IconBarcodeMobile from '../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';
import EmptyIlustrate from '../../../assets/icon/Groupempty.svg';
import EmptyRecord from '../../../assets/icon/manifest-empty mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import UploadTooltip from '../../../component/include/upload-tooltip';
import RNFetchBlob from 'rn-fetch-blob';
const window = Dimensions.get('window');
class Acknowledge extends React.Component {
  unsubscribe = null;
  progressLinear = null;
  dropdownUOM = null;
  ItemScrollView = null
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      _visibleCartonOverlay: false,
      _visiblePhotoOverlay: false,
      bottomSheet: false,
      _inputCode: null,
      overlayProgress: false,
      progressLinearVal:0,
      isShowSignature: false,
      productID: null,
      barcode: '',
      sku: '',
      description: '',
      uom: '',
      uomArray: [],
      uomSingle: '',
      uomID: null,
      length: '',
      width: '',
      height: '',
      volweight: '',
      weight: '',
      pcscarton: '',
      errors: '',
      errorsphoto: '',
      refreshFlag : false,
      labelerror: false,
      submitPhoto: false,
      validPhoto: false,
      recordPhoto: false,
      recordBarcodes: false,
      validDimensions: false,
      _manifest: null,
      keyboardState: 'hide',
      onHandleBlurAttribute : false,
      onHandleLoadingPhoto : false,
    };
    this.registerBarcode.bind(this);
    this.submitItem.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {navigation, manifestList, loadFromGallery} = props;
    const {dataCode, sku} = state;
    if (sku === '') {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.inputCode !== undefined
      ) {
        //if multiple sku
        loadFromGallery({
          gtype: 'attribute',
          gID: routes[index].params.inputCode,
        });
        let manifest = manifestList.find(
          (element) => element.pId === routes[index].params.inputCode,
        );
        console.log(manifest);
        return {
          ...state,
          productID: manifest.pId,
          _inputCode: routes[index].params.inputCode,
          sku: String(manifest.item_code),
          description: String(manifest.description),
          uom: String(manifest.uom),
          _manifest: manifest,
          recordPhoto: !Boolean(manifest.can_take_photos),
          validDimensions: !Boolean(manifest.can_record_attribute),
          recordBarcodes: !Boolean(manifest.can_take_barcodes),
        };
      }
      return {...state};
    }

    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.keyStack !== nextProps.keyStack) {
      if (
        nextProps.keyStack === 'newItem' &&
        this.props.keyStack === 'RegisterBarcode'
      ) {
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if (
          routes[index].params !== undefined &&
          routes[index].params.attrBarcode !== undefined
        ) {
          //if multiple sku
          this.setState({barcode: routes[index].params.attrBarcode});
        }
        return false;
      }
      if (
        nextProps.keyStack === 'newItem' &&
        this.props.keyStack === 'SingleCamera'
      ) {
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if (
          routes[index].params !== undefined &&
          routes[index].params.submitPhoto !== undefined &&
          routes[index].params.submitPhoto === true
        ) {
          //if multiple sku
          this.setState({submitPhoto: true});
        }
        return false;
      } else if(nextProps.keyStack === 'newItem' && this.props.keyStack === 'ViewPhotoAttributes') {
        this.setState({errors: '', errorsphoto: '', labelerror: false,refreshFlag : true});
        return false;       
      } else if (nextProps.keyStack === 'newItem') {
        this.setState({errors: '', errorsphoto: '', labelerror: false});
        return false;
      }
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    const {currentASN, manifestList} = this.props;
    if((prevState.barcode !== this.state.barcode && this.state.barcode !== '') || (prevState.validDimensions !== this.state.validDimensions && this.state.validDimensions === true)){
      if(prevState.validDimensions !== this.state.validDimensions && this.state.validDimensions === true){
        if (this.state.productID !== null) {
          const getAttributes = await getData(
            'inboundsMobile/' +
              currentASN +
              '/' +
              this.state.productID +
              '/product-attributes',
          );
          if(Array.isArray(getAttributes) && getAttributes.length > 0){
            const savedAttributes = [...getAttributes];
            let elementAttribute = savedAttributes.shift();
            this.setState({
              uomArray:getAttributes,
              uomSingle: elementAttribute.packaging,
              uomID: elementAttribute.id,
              length:
              String(elementAttribute.length),
              width:
              String(elementAttribute.width),
              height:
              String(elementAttribute.height),
              volweight:
              String(elementAttribute.volume),
              weight:
              String(elementAttribute.weight),
              pcscarton:
              String(elementAttribute.qty),
            });
          } else if(typeof getAttributes === 'object' && getAttributes.error !== undefined ) {
            this.setState({errors: getAttributes.error, labelerror: true, errorsphoto: ''})
          }
        }
      }
      const result = await getData('inboundsMobile/'+currentASN);
      if(typeof result === 'object' && result.error === undefined){
        this.props.setManifestList(result.products);
        this.setState({sku:''});
     }
    } else if (prevState.recordPhoto !== this.state.recordPhoto && this.state.recordPhoto === true){
      setTimeout(async () => {
        const result = await getData('inboundsMobile/'+currentASN);
        if(typeof result === 'object' && result.error === undefined){
          this.props.setManifestList(result.products);
          this.setState({sku:'', onHandleLoadingPhoto: false});
       }
      }, 8000); 
    }
    if (
      prevState.submitPhoto !== this.state.submitPhoto &&
      this.state.submitPhoto === true
    ) {
      if (this.props.attributePhotoPostpone !== null) {
        this.setState({submitPhoto: false, overlayProgress: true});
        await this.uploadSubmittedPhoto();
      } else {
        this.setState({
          submitPhoto: false,
          errorsphoto: 'take a Photo Proof before continue process',
          labelerror: true,
          errors: '',
        });
      }
    }
    if(prevState.refreshFlag !== this.state.refreshFlag && this.state.refreshFlag === true){
      const result = await getData('/inboundsMobile/'+this.props.currentASN+'/'+this.state.productID+'/product-photos');
      if(typeof result === 'object' && result.error === undefined && Array.isArray(result) && result.length > 0){
        this.setState({validPhoto: true, refreshFlag: false});
      } else {
        this.setState({validPhoto: false, refreshFlag: false});
      }
    }
    if (
      prevState.length !== this.state.length ||
      prevState.width !== this.state.width ||
      prevState.height !== this.state.height
    ) {
      const {length, width, height} = this.state;
      if (length !== '' && width !== '' && height !== '') {
        let volweight =
          parseFloat(length) * parseFloat(width) * parseFloat(height);
        this.setState({
          volweight: '' + volweight,
        });
      }
    }
  }

  async componentDidMount() {
    const {currentASN} = this.props;
    const {productID} = this.state;
    if (productID !== null) {
      const getAttributes = await getData(
        'inboundsMobile/' +
          currentASN +
          '/' +
          productID +
          '/product-attributes',
      );
      if(Array.isArray(getAttributes) && getAttributes.length > 0){
        const savedAttributes = [...getAttributes];
        let elementAttribute = savedAttributes.shift();
        this.setState({
          uomArray:getAttributes,
          uomSingle: elementAttribute.packaging,
          uomID: elementAttribute.id,
          length:
          String(elementAttribute.length),
          width:
          String(elementAttribute.width),
          height:
          String(elementAttribute.height),
          volweight:
          String(elementAttribute.volume),
          weight:
          String(elementAttribute.weight),
          pcscarton:
          String(elementAttribute.qty),
        });
      } else if(typeof getAttributes === 'object' && getAttributes.error !== undefined ) {
        this.setState({errors: getAttributes.error, labelerror: true, errorsphoto: ''})
      }
    }
    if(this.state._manifest.can_take_photos === 1 && this.state.recordPhoto === false ){
      const result = await getData('/inboundsMobile/'+this.props.currentASN+'/'+this.state.productID+'/product-photos');
      if(typeof result === 'object' && result.error === undefined && Array.isArray(result) && result.length > 0){
        this.setState({validPhoto: true});
      } else {
        this.setState({validPhoto: false});
      }
    }

    Keyboard.addListener('keyboardDidShow', this.keyboardDidShowHandle);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHideHandle);
  }
  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this.keyboardDidShowHandle);
    Keyboard.removeListener('keyboardDidHide', this.keyboardDidHideHandle);
  }
  keyboardDidShowHandle = () => {
    this.setState({keyboardState: 'show'});
  };
  keyboardDidHideHandle = () => {
    this.setState({keyboardState: 'hide'});
  };
  registerBarcode = () => {
    const {productID, recordBarcodes} = this.state;
    if (recordBarcodes === false)
      this.props.navigation.navigate({
        name: 'RegisterBarcode',
        params: {
          inputCode: productID,
        },
      });
  };
  closeErrorBanner = () => {
    this.setState({errors: '', errorsphoto: '', labelerror: false});
  };
  submitItem = async () => {
    const {manifestList, currentASN} = this.props;
    const {productID, uomID,length, width, height, volweight, weight, pcscarton} =
      this.state;
    const updateAttr = await putData(
      'inboundsMobile/' + currentASN + '/' + productID + '/product-attributes',
      {
        uomId: String(uomID),
        length: parseFloat(length),
        weight: parseFloat(weight),
        width: parseFloat(width),
        height: parseFloat(height),
        volume: parseFloat(volweight),
        pcs: parseInt(pcscarton),
      },
    );
    if (typeof updateAttr !== 'object') {
      // const updatedManifestAttr = Array.from({length: manifestList.length}).map(
      //   (num, index, arr) => {
      //     if (productID === manifestList[index].pId) {
      //       return {
      //         ...manifestList[index],
      //         basic: {
      //           ...manifestList[index].basic,
      //           length: parseFloat(length),
      //           weight: parseFloat(weight),
      //           width: parseFloat(width),
      //           height: parseFloat(height),
      //           volume: parseFloat(volweight),
      //           carton_pcs: parseInt(pcscarton),
      //         },
      //       };
      //     } else {
      //       return manifestList[index];
      //     }
      //   },
      // );
      Keyboard.removeListener('keyboardDidShow', this.keyboardDidShowHandle);
      Keyboard.removeListener('keyboardDidHide', this.keyboardDidHideHandle);
      //this.props.setManifestList(updatedManifestAttr);
      this.props.setBottomBar(false);
      // this.props.navigation.navigate('Manifest');
      this.setState({validDimensions: true});
    } else {
      if (updateAttr.error !== undefined) {
        this.setState({
          errors: updateAttr.error,
          errorsphoto: '',
          labelerror: false,
        });
      }
    }
  };
  toggleCartonOverlay = () => {
    const {_visibleCartonOverlay} = this.state;
    this.setState({_visibleCartonOverlay: !_visibleCartonOverlay});
  };
  handleCartonConfirm = async ({action}) => {
    this.toggleCartonOverlay();
    if (action) {
      // for prototype only
      // if((this.state._manifest.is_new === 1 || this.state._manifest.record === 1) && this.state._manifest.input_basic_attributes === 1){
      this.submitItem();
      // } else {
      //   this.props.navigation.navigate('Manifest');
      // }
      // end

      // this.props.navigation.navigate('containerDetail');
    }
  };
  togglePhotoOverlay = () => {
    const {_visiblePhotoOverlay} = this.state;
    this.setState({_visiblePhotoOverlay: !_visiblePhotoOverlay});
  };
  handlePhotoConfirm = async ({action}) => {
    this.togglePhotoOverlay();
    if (action) {
      const {currentASN} = this.props;
      const {_inputCode} = this.state;
      const confirmPhotos = await postData(
        '/inboundsMobile/' + currentASN + '/' + _inputCode + '/confirm-photos',
      );
      if (
        typeof confirmPhotos === 'object' &&
        confirmPhotos.error !== undefined
      ) {
        this.setState({
          errors: confirmPhotos.error,
          errorsphoto: '',
          labelerror: false,
        });
      } else {
        this.setState({recordPhoto: true,         onHandleLoadingPhoto: true
        });
      }
      // for prototype only
      // if((this.state._manifest.is_new === 1 || this.state._manifest.record === 1) && this.state._manifest.input_basic_attributes === 1){
      // this.submitItem();
      // } else {
      //   this.props.navigation.navigate('Manifest');
      // }
      // end

      // this.props.navigation.navigate('containerDetail');
    }
  };
  getPhotoReceivingGoods = async () => {
    const {attributePhotoPostpone} = this.props;
    let formdata = [];
    for (let index = 0; index < attributePhotoPostpone.length; index++) {
      let name,
        filename,
        path,
        type = '';
      await RNFetchBlob.fs
        .stat(
          Platform.OS === 'ios'
            ? attributePhotoPostpone[index].replace('file://', '')
            : attributePhotoPostpone[index],
        )
        .then((FSStat) => {
          name = FSStat.filename.replace('.', '-');
          filename = FSStat.filename;
          path = FSStat.path;
          type = FSStat.type;
        });
      if (type === 'file')
        formdata.push({
          name: 'photos',
          filename: filename,
          type: 'image/jpg',
          data: Platform.OS === 'ios' ? path : RNFetchBlob.wrap(path),
        });
    }
    return formdata;
  };
  listenToProgressUpload = (written, total) => {
    this.setState({progressLinearVal: (1 / total) * written});
  };
  uploadSubmittedPhoto = async () => {
    const {attributePhotoPostpone} = this.props;
    const {productID} = this.state;
    const {currentASN} = this.props;
    let FormData = await this.getPhotoReceivingGoods();
    postBlob(
      '/inboundsMobile/' +
        currentASN +
        '/' +
        productID +
        '/record-product-photos',
      [
        // element with property `filename` will be transformed into `file` in form data
        //{ name : 'receiptNumber', data: this.state.data.inbound_asn !== null ? this.state.data.inbound_asn.reference_id :  this.state.data.inbound_grn !== null ?  this.state.data.inbound_grn.reference_id : this.state.data.inbound_other.reference_id},
        // custom content type
        ...FormData,
      ],
      this.listenToProgressUpload,
    ).then((result) => {
      if (typeof result !== 'object') {
        this.props.addAttributePostpone(null);
        this.setState({
          progressLinearVal: 0,
          errorsphoto: result,
          labelerror: false,
          errors: '',
          overlayProgress: false,
          validPhoto: true,
        });
      } else {
        if (typeof result === 'object') {
          this.setState({
            errorsphoto: result.error,
            progressLinearVal: 0,
            labelerror: true,
            errors: '',
            overlayProgress: false,
            validPhoto: false,
          });
        }
      }
    });
  };

  closePhotoErrorBanner = () => {
    this.setState({errorsphoto: '', labelerror: false, errors: ''});
  };
  render() {
    const {
      barcode,
      sku,
      description,
      uom,
      length,
      width,
      height,
      volweight,
      weight,
      pcscarton,
      _manifest,
    } = this.state;
    if (_manifest !== null && _manifest.record === 0)
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          <EmptyRecord height="132" width="213" style={{marginBottom: 15}} />
          <Text style={{...Mixins.subtitle3}}>All Record Successful</Text>
        </View>
      );
    return (
      <>
        {this.state.errors !== '' && (
          <Banner
            title={this.state.errors}
            backgroundColor="#F1811C"
            closeBanner={this.closeErrorBanner}
          />
        )}
        {this.state.errorsphoto !== '' && (
          <Banner
            title={this.state.errorsphoto}
            backgroundColor={
              this.state.labelerror === false ? '#17B055' : '#F1811C'
            }
            closeBanner={this.closePhotoErrorBanner}
          />
        )}
        <ScrollView
        ref={(ref) => this.ItemScrollView = ref}
        onContentSizeChange={(contentWidth,contentHeight)=>{
         
            if(contentHeight > window.height && this.state.onHandleBlurAttribute === true){
              this.ItemScrollView.scrollTo(
                { x: 0, y: (window.height/3), animated: true }
              );
              this.setState({onHandleBlurAttribute: false});
            }
        }}
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'white',
            paddingHorizontal: 10,
            paddingVertical: 0,
          }}>
          {this.state.keyboardState === 'hide' && (
            <View>
              <View
                style={{
                  marginHorizontal: 10,
                  marginVertical: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  backgroundColor: '#2A3386',
                  borderRadius: 5,
                  paddingVertical: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexShrink: 1,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flexShrink: 1,
                      backgroundColor: 'transparent',
                      paddingHorizontal: 15,
                      paddingVertical: 6,
                      marginVertical: 0,
                      borderRadius: 5,
                      minWidth: 120,
                      alignItems: 'flex-start',
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        ...Mixins.subtitle3,
                        color: 'white',
                        fontWeight: '700',
                      }}>
                      Item Code
                    </Text>
                  </View>
                  <Input
                    containerStyle={{
                      flex: 1,
                      paddingVertical: 0,
                      marginVertical: 0,
                      flexDirection: 'row',
                      paddingHorizontal: 0,
                      marginHorizontal: 0,
                    }}
                    inputContainerStyle={{
                      borderWidth: 0,
                      borderBottomWidth: 0,
                      paddingVertical: 0,
                      marginVertical: 0,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                      flexDirection: 'column-reverse',
                      borderWidth: 0,
                      borderColor: 'transparent',
                      borderRadius: 5,
                      backgroundColor: '#2A3386',
                      flex: 1,
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
                    inputStyle={{
                      ...Mixins.subtitle3,
                      fontWeight: '600',
                      lineHeight: 21,
                      color: 'white',
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginHorizontal: 0,
                      marginVertical: 0,
                    }}
                    disabledInputStyle={{opacity: 1}}
                    labelStyle={[
                      Mixins.containedInputDefaultLabel,
                      {marginBottom: 0},
                    ]}
                    value={sku}
                    multiline={true}
                    disabled={true}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexShrink: 1,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flexShrink: 1,
                      backgroundColor: 'transparent',
                      paddingHorizontal: 15,
                      paddingVertical: 6,
                      marginVertical: 0,
                      borderRadius: 5,
                      minWidth: 120,
                      alignItems: 'flex-start',
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        ...Mixins.subtitle3,
                        color: 'white',
                        fontWeight: '700',
                      }}>
                      Description
                    </Text>
                  </View>
                  <Input
                    containerStyle={{
                      flex: 1,
                      paddingVertical: 0,
                      marginVertical: 0,
                      flexDirection: 'row',
                      paddingHorizontal: 0,
                      marginHorizontal: 0,
                    }}
                    inputContainerStyle={{
                      borderWidth: 0,
                      borderBottomWidth: 0,
                      paddingVertical: 0,
                      marginVertical: 0,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                      flexDirection: 'column-reverse',
                      borderWidth: 0,
                      borderColor: 'transparent',
                      borderRadius: 5,
                      backgroundColor: '#2A3386',
                      flex: 1,
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    }}
                    inputStyle={{
                      ...Mixins.subtitle3,
                      fontWeight: '600',
                      lineHeight: 21,
                      color: 'white',
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginHorizontal: 0,
                      marginVertical: 0,
                    }}
                    disabledInputStyle={{opacity: 1}}
                    labelStyle={[
                      Mixins.containedInputDefaultLabel,
                      {marginBottom: 0},
                    ]}
                    value={description}
                    multiline={true}
                    disabled={true}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexShrink: 1,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flexShrink: 1,
                      backgroundColor: 'transparent',
                      paddingHorizontal: 15,
                      paddingVertical: 6,
                      marginVertical: 0,
                      borderRadius: 5,
                      minWidth: 120,
                      alignItems: 'flex-start',
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        ...Mixins.subtitle3,
                        color: 'white',
                        fontWeight: '700',
                      }}>
                      UOM
                    </Text>
                  </View>
                  <Input
                    containerStyle={{
                      flexShrink: 1,
                      paddingVertical: 0,
                      marginVertical: 0,
                      flexDirection: 'row',
                      paddingHorizontal: 0,
                      marginHorizontal: 0,
                    }}
                    inputContainerStyle={{
                      borderWidth: 0,
                      borderBottomWidth: 0,
                      paddingVertical: 0,
                      marginVertical: 0,
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                      flexDirection: 'column-reverse',
                      borderWidth: 0,
                      borderColor: 'transparent',
                      borderRadius: 5,
                      backgroundColor: '#2A3386',
                      flexShrink: 1,
                      marginHorizontal: 0,
                      paddingHorizontal: 0,
                    
                    }}
                    inputStyle={{
                      ...Mixins.subtitle3,
                      fontWeight: '600',
                      lineHeight: 21,
                      color: 'white',
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      textAlignVertical: 'top',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginHorizontal: 0,
                      marginVertical: 0,
                    }}
                    disabledInputStyle={{opacity: 1}}
                    labelStyle={[
                      Mixins.containedInputDefaultLabel,
                      {marginBottom: 0},
                    ]}
                    value={uom}
                    multiline={true}
                    disabled={true}
                  />

                </View>
                <EmptyIlustrate
                    width="70"
                    height="70"
                    style={{marginHorizontal: 20, position:'absolute', bottom:15, right:15}}
                  />
              </View>
              {this.state._manifest.barcode === 1 && (
                <View
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    paddingVertical: 20,
                  }}>
                  <View style={{paddingHorizontal: 20, marginBottom: 10}}>
                    <Text
                      style={{
                        ...Mixins.h6,
                        lineHeight: 27,
                        fontWeight: '700',
                        color: '#424141',
                      }}>
                      Barcode
                    </Text>
                  </View>
                  <Divider color="#D5D5D5" />
                  <View
                    style={{
                      flexDirection: 'row',
                      flexShrink: 1,
                      marginBottom: 10,
                      paddingHorizontal: 20,
                      marginTop: 20,
                    }}>
                    <View
                      style={{
                        flexShrink: 1,
                        backgroundColor: 'transparent',
                        paddingHorizontal: 0,
                        paddingVertical: 6,
                        marginVertical: 0,
                        borderRadius: 5,
                        minWidth: 80,
                        alignItems: 'flex-start',
                        marginRight: 20,
                      }}>
                      <Text
                        style={{
                          ...Mixins.subtitle3,
                          color: 'black',
                          fontWeight: '700',
                        }}>
                        Barcode
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Input
                        containerStyle={{
                          flex: 1,
                          paddingVertical: 0,
                          marginVertical: 0,
                          flexDirection: 'row',
                          paddingHorizontal: 0,
                          marginHorizontal: 0,
                        }}
                        inputContainerStyle={{
                          borderWidth: 0,
                          borderBottomWidth: 0,
                          paddingVertical: 0,
                          marginVertical: 0,
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                          flexDirection: 'column-reverse',
                          borderWidth: 0,
                          borderColor: 'transparent',
                          borderRadius: 5,
                          backgroundColor: '#D5D5D5',
                          flex: 1,
                          marginHorizontal: 0,
                          paddingHorizontal: 0,
                        }}
                        inputStyle={{
                          ...Mixins.subtitle3,
                          fontWeight: '600',
                          lineHeight: 21,
                          color: '#424141',
                          borderWidth: 0,
                          backgroundColor: 'transparent',
                          alignSelf: 'flex-start',
                          textAlign: 'left',
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          marginHorizontal: 0,
                          marginVertical: 0,
                        }}
                        disabledInputStyle={{opacity: 1}}
                        labelStyle={[
                          Mixins.containedInputDefaultLabel,
                          {marginBottom: 0},
                        ]}
                        value={barcode}
                        multiline={true}
                        disabled={true}
                      />
                      <Avatar
                        size={40}
                        ImageComponent={() => (
                          <IconBarcodeMobile
                            height="20"
                            width="20"
                            fill="#fff"
                          />
                        )}
                        imageProps={{
                          containerStyle: {
                            ...Mixins.buttonAvatarDefaultIconStyle,
                            paddingTop: 10,
                            paddingBottom: 0,
                            justifyContent: 'center',
                          },
                        }}
                        overlayContainerStyle={[
                          styles.barcodeButton,
                          {
                            backgroundColor:
                              this.state.recordBarcodes === false
                                ? '#F07120'
                                : '#17B055',
                          },
                        ]}
                        onPress={this.registerBarcode}
                        activeOpacity={0.7}
                        containerStyle={
                          Mixins.buttonAvatarDefaultContainerStyle
                        }
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {this.state._manifest.input_basic_attributes === 1 && (
            <View
              style={{
                marginHorizontal: 10,
                marginVertical:10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor: 'white',
                borderRadius: 5,
                paddingVertical: 20,
              }}>
              <View style={{paddingHorizontal: 20, marginBottom: 10}}>
                <Text
                  style={{
                    ...Mixins.h6,
                    lineHeight: 27,
                    fontWeight: '700',
                    color: '#424141',
                  }}>
                  Update Dimensions
                </Text>
              </View>
              <Divider color="#D5D5D5" />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginBottom: 5,
                  paddingHorizontal: 10,
                  marginTop: 20,
                }}>
                <View
                  style={{
                    backgroundColor:'transparent',
                    flexShrink: 1,
                    paddingHorizontal: 15,
                    paddingVertical: 0,
                    marginVertical: 0,
                    borderRadius: 5,
                    width: 140,
                    alignItems: 'flex-start',
                    justifyContent:'center',
                    marginRight: 0,
                  }}>
                  <Text style={{...Mixins.body1,lineHeight:21, color:'#424141'}}>UOM</Text>
                </View>
            
                <SelectDropdown
                            disabled={this.state.validDimensions}
                            buttonStyle={{flex:1,marginHorizontal:10,height:30,borderRadius: 5, borderWidth:1, borderColor: '#ABABAB',backgroundColor:'white'}}
                            buttonTextStyle={{...Mixins.body1, color:'#2D2C2C', lineHeight:20, fontWeight:'700',textAlign:'left',}}
                            data={this.state.uomArray.length > 0 ? this.state.uomArray : []  }
                            defaultButtonText={this.state.uomSingle}
                            onSelect={(selectedItem, index) => {
                              this.setState({
                                uomSingle: selectedItem.packaging,
                                uomID:selectedItem.id,
                                length:
                                String(selectedItem.length),
                                width:
                                String(selectedItem.width),
                                height:
                                String(selectedItem.height),
                                volweight:
                                String(selectedItem.volume),
                                weight:
                                String(selectedItem.weight),
                                pcscarton:
                                String(selectedItem.qty),
                              })
                              // const {stuffContainer} = this.state;
                              // if(index === stuffContainer) {
                              //   this.setState({
                              //     stuffContainer : index,
                              //   });
                              // } else {
                              //   this.setState({
                              //     stuffContainer: index,
                              //     stuffContainerDot1: false,
                              //     stuffContainerDot2: false,
                              //     stuffContainerCarton: '',
                              //     stuffContainerPallet: '',
                              //   });
                              // }
                            }}
                            renderDropdownIcon={() => {
                              return (
                                <IconArrow66Mobile fill="#ABABAB" height="16" width="16" style={{transform:[{rotate:'90deg'}]}}/>
                              );
                            }}
                            dropdownIconPosition="right"
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                            
                              return selectedItem.packaging;
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item.packaging;
                            }}
            
                            renderCustomizedRowChild={(item, index) => {
                              return (
                                <View style={{flex:1,paddingHorizontal:17, backgroundColor: this.state.uomSingle === item ? '#e7e8f2' : 'transparent',paddingVertical:0,marginVertical:0, justifyContent:'center'}}>
                                  <Text style={{...Mixins.small1,fontWeight:'400',lineHeight:18, color:'#424141'}}>{item}</Text>
                                </View>
                              );
                            }}
                          />
                          </View>
          
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginBottom: 0,
                  paddingHorizontal: 10,
                  marginTop: 0,
                }}>
                <View
                  style={{
                    backgroundColor:'transparent',
                    flexShrink: 1,
                    paddingHorizontal: 15,
                    paddingVertical: 0,
                    marginVertical: 0,
                    borderRadius: 5,
                    width: 140,
                    alignItems: 'flex-start',
                    justifyContent:'center',
                    marginRight: 0,
                  }}>
                  <Text style={{...Mixins.body1,lineHeight:21, color:'#424141'}}>Length ( m )</Text>
                </View>
                <Input
                  containerStyle={{
                    flex: 1,
                    paddingVertical: 0,
                    maxHeight: 30,
                    marginVertical: 5,
                  }}
                  inputContainerStyle={styles.textInput}
                  style={{...Mixins.body3, lineHeight: 18, color: '#424141'}}
                  inputStyle={Mixins.containedInputDefaultStyle}
                  labelStyle={[
                    Mixins.containedInputDefaultLabel,
                    {marginBottom: 0},
                  ]}
                  onChangeText={(text) => {
                    this.setState({length: text});
                  }}
                  keyboardType="number-pad"
                  value={length}
                  onBlur={(e) =>
                    {
                      this.setState({onHandleBlurAttribute : true});
                    }
                  }
                  onEndEditing={(e) => {
                    this.setState({onHandleBlurAttribute : true});
                  }}
                  disabled={this.state.validDimensions}
                />
              </View>
             
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    backgroundColor:'transparent',
                    flexShrink: 1,
                    paddingHorizontal: 15,
                    paddingVertical: 0,
                    marginVertical: 0,
                    borderRadius: 5,
                    width: 140,
                    alignItems: 'flex-start',
                    justifyContent:'center',
                    marginRight: 0,
                  }}>
                  <Text style={{...Mixins.body1,lineHeight:21, color:'#424141'}}>Width ( m )</Text>
                </View>
                <Input
                  containerStyle={{
                    flex: 1,
                    paddingVertical: 0,
                    maxHeight: 30,
                    marginVertical: 5,
                  }}
                  inputContainerStyle={styles.textInput}
                  style={{...Mixins.body3, lineHeight: 18, color: '#424141'}}
                  inputStyle={Mixins.containedInputDefaultStyle}
                  labelStyle={[
                    Mixins.containedInputDefaultLabel,
                    {marginBottom: 0},
                  ]}
                  onChangeText={(text) => {
                    this.setState({width: text});
                  }}
                  keyboardType="number-pad"
                  value={width}
                  onBlur={(e) =>
                    {
                      this.setState({onHandleBlurAttribute : true});
                    }
                  }
                  onEndEditing={(e) => {
                    this.setState({onHandleBlurAttribute : true});
                  }}
                  disabled={this.state.validDimensions}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    backgroundColor:'transparent',
                    flexShrink: 1,
                    paddingHorizontal: 15,
                    paddingVertical: 0,
                    marginVertical: 0,
                    borderRadius: 5,
                    width: 140,
                    alignItems: 'flex-start',
                    justifyContent:'center',
                    marginRight: 0,
                  }}>
                  <Text style={{...Mixins.body1,lineHeight:21, color:'#424141'}}>Height ( m )</Text>
                </View>
                <Input
                  containerStyle={{
                    flex: 1,
                    paddingVertical: 0,
                    maxHeight: 30,
                    marginVertical: 5,
                  }}
                  inputContainerStyle={styles.textInput}
                  style={{...Mixins.body3, lineHeight: 18, color: '#424141'}}
                  inputStyle={Mixins.containedInputDefaultStyle}
                  labelStyle={[
                    Mixins.containedInputDefaultLabel,
                    {marginBottom: 0},
                  ]}
                  onChangeText={(text) => {
                    this.setState({height: text});
                  }}
                  keyboardType="number-pad"
                  value={height}
                  onBlur={(e) =>
                    {
                      this.setState({onHandleBlurAttribute : true});
                    }
                  }
                  onEndEditing={(e) => {
                    this.setState({onHandleBlurAttribute : true});
                  }}
                  disabled={this.state.validDimensions}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    backgroundColor:'transparent',
                    flexShrink: 1,
                    paddingHorizontal: 15,
                    paddingVertical: 0,
                    marginVertical: 0,
                    borderRadius: 5,
                    width: 140,
                    alignItems: 'flex-start',
                    justifyContent:'center',
                    marginRight: 0,
                  }}>
                  <Text style={{...Mixins.body1,lineHeight:21, color:'#424141'}}>Vol. Weight ( m3 )</Text>
                </View>
                <Input
                  containerStyle={{
                    flex: 1,
                    paddingVertical: 0,
                    maxHeight: 30,
                    marginVertical: 5,
                  }}
                  inputContainerStyle={styles.textInput}
                  style={{...Mixins.body3, lineHeight: 18, color: '#424141'}}
                  inputStyle={Mixins.containedInputDefaultStyle}
                  labelStyle={[
                    Mixins.containedInputDefaultLabel,
                    {marginBottom: 0},
                  ]}
                  onChangeText={(text) => {
                    this.setState({volweight: text});
                  }}
                  value={String(parseFloat(volweight).toFixed(2))}
                  disabled={true}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    backgroundColor:'transparent',
                    flexShrink: 1,
                    paddingHorizontal: 15,
                    paddingVertical: 0,
                    marginVertical: 0,
                    borderRadius: 5,
                    width: 140,
                    alignItems: 'flex-start',
                    justifyContent:'center',
                    marginRight: 0,
                  }}>
                  <Text style={{...Mixins.body1,lineHeight:21, color:'#424141'}}>Weight ( Kg )</Text>
                </View>
                <Input
                  containerStyle={{
                    flex: 1,
                    paddingVertical: 0,
                    maxHeight: 30,
                    marginVertical: 5,
                  }}
                  inputContainerStyle={styles.textInput}
                  style={{...Mixins.body3, lineHeight: 18, color: '#424141'}}
                  inputStyle={Mixins.containedInputDefaultStyle}
                  labelStyle={[
                    Mixins.containedInputDefaultLabel,
                    {marginBottom: 0},
                  ]}
                  onChangeText={(text) => {
                    this.setState({weight: text});
                  }}
                  value={weight}
                  onBlur={(e) =>
                    {
                      this.setState({onHandleBlurAttribute : true});
                    }
                  }
                  onEndEditing={(e) => {
                    this.setState({onHandleBlurAttribute : true});
                  }}
                  disabled={this.state.validDimensions}
                  keyboardType="number-pad"
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    backgroundColor:'transparent',
                    flexShrink: 1,
                    paddingHorizontal: 15,
                    paddingVertical: 0,
                    marginVertical: 0,
                    borderRadius: 5,
                    width: 140,
                    alignItems: 'flex-start',
                    justifyContent:'center',
                    marginRight: 0,
                  }}>
                  <Text style={{...Mixins.body1,lineHeight:21, color:'#424141'}}># Pcs per carton</Text>
                </View>
                <Input
                  containerStyle={{
                    flex: 1,
                    paddingVertical: 0,
                    maxHeight: 30,
                    marginVertical: 5,
                  }}
                  inputContainerStyle={styles.textInput}
                  style={{...Mixins.body3, lineHeight: 18, color: '#424141'}}
                  inputStyle={Mixins.containedInputDefaultStyle}
                  labelStyle={[
                    Mixins.containedInputDefaultLabel,
                    {marginBottom: 0},
                  ]}
                  onChangeText={(text) => {
                    this.setState({pcscarton: text});
                  }}
                  value={pcscarton}
                  onBlur={(e) =>
                    {
                      this.setState({onHandleBlurAttribute : true});
                    }
                  }
                  onEndEditing={(e) => {
                    this.setState({onHandleBlurAttribute : true});
                  }}
                  disabled={this.state.validDimensions}
                  keyboardType="number-pad"
                />
              </View>
              <Button
                containerStyle={{
                  flex: 1,
                  marginRight: 0,
                  marginTop: 30,
                  marginBottom: 10,
                  paddingHorizontal: 30,
                }}
                buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
                titleStyle={styles.deliveryText}
                onPress={this.toggleCartonOverlay}
                disabledStyle={
                  this.state.validDimensions === true
                    ? {backgroundColor: '#17B055', opacity: 1, color: 'white'}
                    : null
                }
                disabledTitleStyle={
                  this.state.validDimensions === true ? {color: 'white'} : null
                }
                disabled={
                  this.state._manifest.input_basic_attributes === 1 &&
                  this.state.validDimensions === false &&
                  this.state.length !== '' &&
                  (this.state.weight !== '') & (this.state.pcscarton !== '') &&
                  this.state.volweight !== '' &&
                  this.state.width !== '' &&
                  this.state.height !== ''
                    ? false
                    : true
                }
                title="Update Carton Dimensions"
              />
            </View>
          )}
          {this.state.keyboardState === 'hide' &&
            this.state._manifest.take_photo === 1 && (
              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  marginBottom: 60,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  backgroundColor: 'white',
                  borderRadius: 5,
                  paddingVertical: 20,
                }}>
                <View style={{paddingHorizontal: 20, marginBottom: 10}}>
                  <Text
                    style={{
                      ...Mixins.h6,
                      lineHeight: 27,
                      fontWeight: '700',
                      color: '#424141',
                    }}>
                    Take Photo
                  </Text>
                </View>
                <Divider color="#D5D5D5" />
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    marginTop: 0,
                    justifyContent:'center',
                  }}>
                  <View
                    style={[
                      styles.sheetPackages,
                      {
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        marginHorizontal: 0,
                        marginTop: 20,
                        flex:1,
                      },
                    ]}>
                    <Avatar
                      onPress={() => {
                        if(this.state.overlayProgress === true){
                          this.progressLinear.toggle();
                        } else {
                        if (this.state.recordPhoto === false)
                          this.props.navigation.navigate('SingleCamera');
                        }
                      }}
                      size={79}
                      ImageComponent={() => (
                        <>
                             {this.state.overlayProgress === true ? (
                    <Svg width="79" height="79" viewBox="0 0 79 79" fill="none">
                    <Path transform={"rotate("+(this.state.progressLinearVal * 360 )+" 39 40)"} fill-rule="evenodd" clip-rule="evenodd" d="M12.165 43C13.6574 56.4999 25.1026 67 39.0003 67C53.9119 67 66.0003 54.9117 66.0003 40C66.0003 25.0883 53.9119 13 39.0003 13V16C52.2551 16 63.0003 26.7452 63.0003 40C63.0003 53.2548 52.2551 64 39.0003 64C26.7614 64 16.6622 54.8389 15.1859 43H12.165Z" fill="white"/>
                    <Path d="M44.1818 49.75V52H32.8182V49.75H44.1818ZM44.1818 45.25H32.8182V47.5H44.1818V45.25ZM32.8182 37.375V43H44.1818V37.375H51L38.5 25L26 37.375H32.8182Z" fill="white"/>
                    </Svg>
                 ) : (<IconPhoto5 height="40" width="40" fill="#fff" />)}
                          {this.props.attributePhotoPostpone !== null &&
                            this.props.attributeProofID !== null &&
                            this.props.attributeProofID ===
                              this.state._inputCode && (
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
                          alignItems: this.state.overlayProgress ? 'flex-start' : 'center',
                          paddingTop: this.state.overlayProgress ? 0 : 18,
                          paddingBottom: this.state.overlayProgress ? 0 : 21,
                        },
                      }}
                      overlayContainerStyle={{
                        backgroundColor:
                          this.props.attributeProofID !== null &&
                          this.props.attributeProofID !== this.state._inputCode
                            ? 'grey'
                            : this.props.attributePhotoPostpone !== null ||
                              this.state.recordPhoto === true
                            ? '#17B055'
                            : '#F07120',
                        flex: 2,
                        borderRadius: 5,
                      }}
                      containerStyle={{alignSelf: 'center'}}
                    />
                    <View style={{marginVertical: 5, paddingHorizontal: 40,}}>
                      <UploadTooltip
                          ref={(ref)=>this.progressLinear = ref}
                        overlayLinearProgress={{
                          value: this.state.progressLinearVal,
                          color: '#F1811C',
                          variant: 'determinate',
                          style: {
                            height: 13,
                            backgroundColor: 'white',
                            borderRadius: 10,
                          },
                        }}
                        value={this.state.progressLinearVal}
                        color="primary"
                        style={{width: 80}}
                        variant="determinate"
                        enabled={this.state.overlayProgress}
                      />
                    </View>
                    {/* <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/> */}
                    <View
                      style={{
                        maxWidth: 150,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          ...Mixins.subtitle3,
                          lineHeight: 21,
                          fontWeight: '600',
                          color: '#6C6B6B',
                        }}>
                        Take Photo
                      </Text>
                      {/* {this.state.errorsphoto !== '' && ( <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '400',color: this.state.labelerror === false ? '#17B055' : 'red'}}>{this.state.errorsphoto}</Text>)} */}
                    </View>
                  </View>
                  <View
                    style={[
                      styles.sheetPackages,
                      {
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        flex:1,
                        paddingRight:40,
                        marginTop: 20,
                      },
                    ]}>
                    <Avatar
                      onPress={() => {
                        if(this.state.validPhoto === true){
                          this.props.navigation.navigate('ViewPhotoAttributes', {
                            number: this.state.productID,
                          });
                        }
                      }}
                      size={79}
                      ImageComponent={() => (
                        <>
                          <IconView height="40" width="40" fill={ this.state.validPhoto === false ? '#fff': "#F07120"} />
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
                        backgroundColor: this.state.validPhoto === false ? 'grey' : '#fff',
                        borderColor: '#424141',
                        borderWidth: 1,
                        flex: 2,
                        borderRadius: 5,
                      }}
                    />

                    {/* <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/> */}
                    <Text
                      style={{
                        ...Mixins.subtitle3,
                        lineHeight: 21,
                        fontWeight: '600',
                        color: '#6C6B6B',
                        paddingTop:10,
                      }}>
                      View Photo
                    </Text>
                  </View>
                </View>

                <Button
                  containerStyle={{
                    flex: 1,
                    marginRight: 0,
                    marginTop: 30,
                    marginBottom: 10,
                    paddingHorizontal: 30,
                  }}
                  buttonStyle={[
                    styles.navigationButton,
                    {paddingHorizontal: 0},
                  ]}
                  titleStyle={styles.deliveryText}
                  onPress={this.togglePhotoOverlay}
                  disabledStyle={
                    this.state.recordPhoto === true
                      ? {backgroundColor: '#17B055', opacity: 1, color: 'white'}
                      : null
                  }
                  disabledTitleStyle={
                    this.state.recordPhoto === true ? {color: 'white'} : null
                  }
                  disabled={
                    this.state._manifest.take_photo === 1 &&
                    this.state.validPhoto === true &&
                    this.state.recordPhoto === false
                      ? false
                      : true
                  }
                  icon={()=>   {
                    if(this.state.onHandleLoadingPhoto === true){
                      return (<ActivityIndicator size={30} color="#fff" />);
                    }
                    return (<></>);
                    }}
                  title="Confirm upload photos"
                />
              </View>
            )}
        </ScrollView>
        <Overlay
          fullScreen={false}
          overlayStyle={styles.overlayContainerStyle}
          isVisible={this.state._visibleCartonOverlay}
          onBackdropPress={this.toggleCartonOverlay}>
          <Text style={styles.confirmText}>
            Are you sure you want Confirm Record Carton Dimensions ?
          </Text>
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {borderWidth: 1, borderColor: '#ABABAB'},
              ]}
              onPress={() => this.handleCartonConfirm({action: false})}>
              <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
              onPress={() => this.handleCartonConfirm({action: true})}>
              <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
        <Overlay
          fullScreen={false}
          overlayStyle={styles.overlayContainerStyle}
          isVisible={this.state._visiblePhotoOverlay}
          onBackdropPress={this.togglePhotoOverlay}>
          <Text style={styles.confirmText}>
            Are you sure you want Confirm Record Take Photo ?
          </Text>
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {borderWidth: 1, borderColor: '#ABABAB'},
              ]}
              onPress={() => this.handlePhotoConfirm({action: false})}>
              <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
              onPress={() => this.handlePhotoConfirm({action: true})}>
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
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: window.height * 0.3,
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
    lineHeight: 25,
    textAlign: 'center',
  },
  cancelText: {
    ...Mixins.h6,
    lineHeight: 25,
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
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonText: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight: '600',
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
    right: 16,
  },
  checkmarkUpload: {
    position: 'absolute',
    bottom: 5,
    right: 5,
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
    currentASN: state.originReducer.filters.currentASN,
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
    signatureSubmittedHandler: (signature) =>
      dispatch({type: 'Signature', payload: signature}),
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setStartDelivered: (toggle) => {
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
      return dispatch({type: 'loadFromGallery', payload: action});
    },
    addAttributePostpone: (uri) =>
      dispatch({type: 'attributePostpone', payload: uri}),
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);
