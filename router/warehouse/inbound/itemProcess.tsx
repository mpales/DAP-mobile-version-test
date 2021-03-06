import React from 'react';
import {
  Animated,
  StyleSheet,
  Easing,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  PixelRatio,
  Platform,
} from 'react-native';
import {
  Button,
  Input,
  Badge,
  Divider,
  ListItem,
  Avatar,
  LinearProgress,
  Overlay,
} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import {Modalize} from 'react-native-modalize';
import BarCode from '../../../component/camera/filter-barcode';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import CheckmarkIcon from '../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import XMarkIcon from '../../../assets/icon/iconmonstr-x-mark-7mobile.svg';
import Mixins from '../../../mixins';
import moment from 'moment';
import {postData, getData, postBlob} from '../../../component/helper/network';
import {connect} from 'react-redux';
import MultipleSKUList from '../../../component/extend/ListItem-inbound-multiple-sku';
import TemplateOption,{inferTemplateOption} from '../../../component/include/template-option';
import TemplateScale, {inferTemplateScale} from '../../../component/include/template-scale';
import TemplateSelect, {inferTemplateSelect} from '../../../component/include/template-select';
import TemplateText,{inferTemplateText} from '../../../component/include/template-text';
import TemplateMulti, {inferTemplateMulti} from '../../../component/include/template-multi';
import TemplateDate, {inferTemplateDate} from '../../../component/include/template-date';
import Banner from '../../../component/banner/banner';
import RNFetchBlob from 'rn-fetch-blob';
import Incremental from '../../../assets/icon/plus-mobile.svg';
import Decremental from '../../../assets/icon/min-mobile.svg';
const screen = Dimensions.get('screen');
const grade = [
  'Pick',
  'Buffer',
  'Damage',
  'Defective',
  'Short Expiry',
  'Expired',
  'No Stock',
  'Reserve',
];
const pallet = ['PLDAP 0091', 'PLDAP 0092', 'PLDAP 0093', 'PLDAP 0094'];
import {RootState,AppDispatch} from '../../../Store';
import { Dispatch } from 'redux';

class ImageComponent extends React.Component {
  constructor(props: any) {
    super(props);
  }
  render(){
    return (<>
    <IconPhoto5 height="40" width="40" fill="#fff" />
  </>)
  }
}
type Props = StateProps & DispatchProps & OwnProps

class Example extends  React.Component<Props, OwnState>  {
  _unsubscribe: null | VoidFunction = null;
  _unsubscribeLock: null | VoidFunction = null;
  refAttrArray = React.createRef<Array<inferTemplateSelect | inferTemplateText | inferTemplateScale | inferTemplateOption | inferTemplateMulti | inferTemplateDate>>();
  refBatch = React.createRef<null | inferTemplateText>();
  refexpiryDate = React.createRef<null | inferTemplateDate>();
  refproductionDate = React.createRef<null | inferTemplateDate>();
  modalizeRef = React.createRef();
  animatedValue = new Animated.Value(0);
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      dataCode: '0',
      qty: '0',
      scanItem: '0',
      dataItem: null,
      multipleSKU: false,
      indexItem: null,
      ItemGrade: null,
      ItemPallet: null,
      ItemPalletNo : null,
      PalletArray: null,
      currentPOSM: false,
      enterAttr: false,
      batchNo: null,
      attrData: [],
      errorAttr: '',
      isPOSM: false,
      isConfirm: false,
      uploadPOSM: false,
      filterMultipleSKU: null,
      ISODateProductionString: null,
      ISODateExpiryString: null,
    };
    this.handleResetAnimation.bind(this);
    this.handleZoomInAnimation.bind(this);
    this.renderBarcode.bind(this);
  }

  static getDerivedStateFromProps(props : Props, state : OwnState) {
    const {
      manifestList,
      currentASN,
      navigation,
      route,
      setBarcodeScanner,
      detectBarcode,
    } = props;
    const {dataCode, dataItem, scanItem} = state;
    const {routes, index} = navigation.dangerouslyGetState();
    if (scanItem === '0') {
      if (
        route.params !== undefined &&
        route.params.inputCode !== undefined &&
        manifestList.some(
          (element) => element.pId === route.params.inputCode,
        )
      ) {
        setBarcodeScanner(false);
        let elementItem = manifestList.find(
          (element) => element.pId === route.params.inputCode,
        );
        return {
          ...state,
          scanItem: route.params.inputCode,
          dataCode:
            elementItem?.is_transit === 1
              ? 'transit'
              : elementItem?.barcodes !== undefined && Array.isArray(elementItem?.barcodes) && elementItem?.barcodes.length > 0
              ? elementItem?.barcodes[elementItem?.barcodes.length - 1]
                  .code_number
              : 'empty',
        };
      } else {
        navigation.goBack();
      }
      return {...state};
    }
    return {...state};
  }
  shouldComponentUpdate(nextProps:Props, nextState : OwnState) {
    // if((this.state.ItemPallet !== nextState.ItemPallet) && nextState.dataItem === this.state.dataItem && nextState.PalletArray === this.state.PalletArray){
    //   return false;
    // } else if(nextState.isPOSM === true && nextState.dataItem === null){
    //   return false;
    // }
    return true;
  }
  async componentDidUpdate(prevProps : Props, prevState : OwnState) {
    const {
      manifestList,
      detectBarcode,
      currentASN,
      navigation,
      setBarcodeScanner,
    } = this.props;
    const {dataCode, scanItem, dataItem, isPOSM} = this.state;
    if (prevProps.detectBarcode !== detectBarcode) {
      if (detectBarcode) {
        this.handleResetAnimation();
      } else {
        this.handleZoomInAnimation();
      }
    }
    if (
      prevState.isConfirm !== this.state.isConfirm &&
      this.state.isConfirm === true
    ) {
    }
    if (
      prevState.uploadPOSM !== this.state.uploadPOSM &&
      this.state.uploadPOSM === true
    ) {
      //backend upload api
      this.setState({enterAttr: true});
    }
    let items = manifestList.find((o) => o.pId === scanItem);
    if (items !== undefined && items.is_transit !== 1) {
      let arrayBarcodes = Array.from({length: items.barcodes.length}).map(
        (num, index) => {
          return items?.barcodes[index].code_number;
        },
      );
      if (
        ((dataCode !== '0' && arrayBarcodes.includes(dataCode)) ||
          dataCode === 'empty') &&
        dataItem === null
      ) {
        if (this.state.indexItem === null && this.state.multipleSKU === false) {
          let foundIndex = manifestList.filter(
            (element) =>
              (dataCode === 'empty' &&
                element.barcodes !== undefined &&
                (element.barcodes.length === 0 ||
                  element.barcodes.some((o) => o.code_number === dataCode) ===
                    true)) ||
              (dataCode !== 'empty' &&
                element.barcodes !== undefined &&
                element.barcodes.some((o) => o.code_number === dataCode) ===
                  true),
          );
          let indexItem = manifestList.findIndex(
            (element) => element.pId === scanItem,
          );
          let item = manifestList.find((element) => element.pId === scanItem);
          // if(foundIndex.length > 1) {
          //   this.setState({multipleSKU: true, filterMultipleSKU : foundIndex});
          // } else {
          if(item !== undefined){
            const result = await postData(
              'inboundsMobile/' +
                this.props.currentASN +
                '/' +
                item.pId +
                '/switch-status/2',
            );
            if (
              result.error !== undefined &&
              this.props.keyStack === 'ItemProcess'
            ) {
              this.props.setItemError(result.error);
              this.props.navigation.goBack();
            } else {
              this.setState({
                dataItem: item,
                qty: '0',
                ItemGrade: 'Pick',
                indexItem: indexItem,
                currentPOSM: false,
              });
            }
          }
        
          // }
        } else if (
          this.state.indexItem !== null &&
          this.state.multipleSKU === true
        ) {
          let item = manifestList[this.state.indexItem];
          const result = await postData(
            'inboundsMobile/' +
              this.props.currentASN +
              '/' +
              item.pId +
              '/switch-status/2',
          );
          if (
            result.error !== undefined &&
            this.props.keyStack === 'ItemProcess'
          ) {
            this.props.setItemError(result.error);
            this.props.navigation.goBack();
          } else {
            this.setState({
              dataItem: item,
              qty: '0',
              ItemGrade: 'Pick',
              currentPOSM: false,
              multipleSKU: false,
              filterMultipleSKU: null,
            });
          }
        }
      }
    } else {
      if (dataCode === 'transit' && dataItem === null) {
        let item = manifestList.find((element) => element.pId === scanItem);
        let indexItem = manifestList.findIndex(
          (element) => element.pId === scanItem,
        );
        if(item !== undefined){
          const result = await postData(
            'inboundsMobile/' +
              this.props.currentASN +
              '/' +
              item.pId +
              '/switch-status/2',
          );
          this.setState({
            dataItem: item,
            qty: '0',
            ItemGrade: 'Pick',
            indexItem: indexItem,
            currentPOSM: false,
          });
        }
      }
    }
  }
  componentWillUnmount() {
    this.props.setBarcodeScanner(true);
    this.props.addPOSMPostpone(null);
    if(this._unsubscribe !== null && typeof this._unsubscribe === 'function') this._unsubscribe();
    if(this._unsubscribeLock !== null && typeof this._unsubscribeLock === 'function') this._unsubscribeLock();
  }
  async componentDidMount() {
    const {scanItem, dataCode} = this.state;
    const {detectBarcode, manifestList} = this.props;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      if (this.state.currentPOSM === true && this.state.isPOSM === true) {
        const {routes, index} = this.props.navigation.dangerouslyGetState();
        if (
          routes[index].params !== undefined &&
          routes[index].params.upload === true
        ) {
          this.setState({uploadPOSM: true});
        }
      }
    });
    this._unsubscribeLock = this.props.navigation.addListener(
      'state',
      async (test) => {
        // do something
        const {dataItem, isConfirm} = this.state;
        const {currentASN} = this.props;
        if (
          dataItem !== null &&
          isConfirm === false &&
          (test.data.state.routes[test.data.state.index].name === 'Manifest' ||
            test.data.state.routes[test.data.state.index].name ===
              'ReportManifest')
        ) {
          const result = await postData(
            'inboundsMobile/' +
              currentASN +
              '/' +
              dataItem.pId +
              '/switch-status/1',
          );
          console.log(result);
        }
      },
    );
    const resultPallet = await getData(
      'inboundsMobile/' + this.props.currentASN + '/pallet',
    );
    if (
      resultPallet.length > 0 &&
      typeof resultPallet === 'object' &&
      resultPallet.error === undefined
    ) {
      this.setState({
        PalletArray: resultPallet,
      });
    } else {
      if (
        typeof resultPallet === 'object' &&
        resultPallet.error !== undefined
      ) {
        this.props.setItemError(resultPallet.error);
      } else {
        this.props.setItemError('Generate New Pallet ID First');
      }
      this.props.navigation.goBack();
    }
    let items = manifestList.find((o) => o.pId === scanItem);
    if (items !== undefined && items.is_transit !== 1) {
      let arrayBarcodes = Array.from({length: items.barcodes.length}).map(
        (num, index) => {
          return items?.barcodes[index].code_number;
        },
      );

      if (
        (arrayBarcodes.includes(dataCode) || dataCode === 'empty') &&
        detectBarcode === false
      ) {
        this.handleZoomInAnimation();
        if (this.state.indexItem === null && this.state.multipleSKU === false) {
          let foundIndex = manifestList.filter(
            (element) =>
              (dataCode === 'empty' &&
                element.barcodes !== undefined &&
                (element.barcodes.length === 0 ||
                  element.barcodes.some((o) => o.code_number === dataCode) ===
                    true)) ||
              (dataCode !== 'empty' &&
                element.barcodes !== undefined &&
                element.barcodes.some((o) => o.code_number === dataCode) ===
                  true),
          );
          let indexItem = manifestList.findIndex(
            (element) => element.pId === scanItem,
          );
          let item = manifestList.find((element) => element.pId === scanItem);

          // if(foundIndex.length > 1) {
          //   this.setState({multipleSKU: true, filterMultipleSKU : foundIndex});
          // } else {
            if(item !== undefined){
              const result = await postData(
                'inboundsMobile/' +
                  this.props.currentASN +
                  '/' +
                  item.pId +
                  '/switch-status/2',
              );
              if (
                result.error !== undefined &&
                this.props.keyStack === 'ItemProcess'
              ) {
                this.props.setItemError(result.error);
                this.props.navigation.goBack();
              } else {
                this.setState({
                  dataItem: item,
                  qty: '0',
                  ItemGrade: 'Pick',
                  indexItem: indexItem,
                  currentPOSM: false,
                });
              }
            }
         
          // }
        } else if (
          this.state.indexItem !== null &&
          this.state.multipleSKU === true
        ) {
          let item = manifestList[this.state.indexItem];
          const result = await postData(
            'inboundsMobile/' +
              this.props.currentASN +
              '/' +
              item.pId +
              '/switch-status/2',
          );
          if (
            result.error !== undefined &&
            this.props.keyStack === 'ItemProcess'
          ) {
            this.props.setItemError(result.error);
            this.props.navigation.goBack();
          } else {
            this.setState({
              dataItem: item,
              qty: '0',
              ItemGrade: 'Pick',
              currentPOSM: false,
              filterMultipleSKU: null,
              multipleSKU: false,
            });
          }
        }
      }
    } else {
      if (dataCode === 'transit' && detectBarcode === false) {
        let item = manifestList.find((element) => element.pId === scanItem);
        if(item !== undefined){
          let indexItem = manifestList.findIndex(
            (element) => element.pId === scanItem,
          );
          const result = await postData(
            'inboundsMobile/' +
              this.props.currentASN +
              '/' +
              item.pId +
              '/switch-status/2',
          );
          this.handleZoomInAnimation();
          this.setState({
            dataItem: item,
            qty: '0',
            ItemGrade: 'Pick',
            indexItem: indexItem,
            currentPOSM: false,
          });
        }
        
      }
    }
  }
  getPhotoReceivingGoods = async () => {
    const {POSMPostpone} = this.props;
    let formdata = [];
    if (POSMPostpone !== null) {
      for (let index = 0; index < POSMPostpone.length; index++) {
        let name : string = '';
        let filename : string = '';
        let path : string = '';
        let type : string = '';
        await RNFetchBlob.fs
          .stat(
            Platform.OS === 'ios'
              ? POSMPostpone[index].replace('file://', '')
              : POSMPostpone[index],
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
    }
    return formdata;
  };
  // toggleOverlay = (bool : boolean) => {
  //   if (bool && this.state.ISODateString === null && Platform.OS === 'ios') {
  //     let stringdate = moment().format('DD/MM/YYYY');
  //     this.setState({filterDate: stringdate, ISODateString: new Date()});
  //   }
  //   this.setState({overlayDate: bool !== undefined ? bool : false});
  // };

  // changedDateTimePicker = (event, selectedDate) => {
  //   this.toggleOverlay(false);
  //   if (event.type === 'neutralButtonPressed' || event === 'iOSClearDate') {
  //     this.setState({filterDate: '', ISODateString: null});
  //   } else {
  //     if (selectedDate !== undefined) {
  //       let stringdate = moment('' + selectedDate).format('DD/MM/YYYY');
  //       this.setState({filterDate: stringdate, ISODateString: selectedDate});
  //     }
  //   }
  // };
  handleCancel = async () => {
    const result = await postData(
      'inboundsMobile/' +
        this.props.currentASN +
        '/' +
        this.state.scanItem +
        '/switch-status/1',
    );
    this.props.navigation.goBack();
  };
  handleResetAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false
    }).reset();
  };
  handleZoomInAnimation = () => {
    console.log('test 2');
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };
  // renderMultipleSKU = (props : any) => (
  //   <MultipleSKUList
  //     {...props}
  //     selectIndex={() =>
  //       this.setState({
  //         indexItem: this.props.manifestList.findIndex(
  //           (element) => element.pId === props.item.pId,
  //         ),
  //       })
  //     }
  //   />
  // );
  renderModal = () => {
    const {dataItem, dataCode, qty, scanItem} = this.state;
    return (
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.sectionSheetDetail,
            {marginHorizontal: 0, marginTop: 0},
          ]}>
          {(dataItem === null ||
            (dataItem !== null &&
              (this.state.isConfirm !== false ||
                this.state.enterAttr !== false ||
                this.state.isPOSM !== false))) && (
            <View style={styles.modalHeader}>
              {dataItem !== null && this.state.isConfirm === true && (
                <CheckmarkIcon height="24" width="24" fill="#17B055" />
              )}
              {dataItem !== null ? (
                <Text style={styles.modalHeaderText}>
                  {this.state.isConfirm === true
                    ? ' Item Processed '
                    : this.state.enterAttr === true
                    ? 'Enter Item Attribute'
                    : this.state.isPOSM === true
                    ? 'Photo Required'
                    : ' Item Found'}
                </Text>
              ) : dataItem === null && this.state.multipleSKU === true ? (
                <Text style={styles.modalHeaderText}>Multiple SKU Found</Text>
              ) : (
                <Text style={styles.modalHeaderText}>Item Not Found</Text>
              )}
            </View>
          )}
          {dataItem !== null &&
          ((this.state.enterAttr === false && this.state.isPOSM === false) ||
            this.state.isConfirm === true) ? (
            <View style={styles.sheetPackages}>
              <View
                style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                {dataItem.is_transit !== 1 ? (
                  <>
                    <View style={styles.dividerContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexShrink: 1,
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <Text style={styles.labelPackage}>Item Code</Text>
                        <Text style={styles.dotLabel}>:</Text>
                      </View>
                      <Text style={styles.infoPackage}>
                        {dataItem.item_code}
                      </Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexShrink: 1,
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <Text style={styles.labelPackage}>Description</Text>
                        <Text style={styles.dotLabel}>:</Text>
                      </View>
                      <Text style={styles.infoPackage}>
                        {dataItem.description}
                      </Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexShrink: 1,
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <Text style={styles.labelPackage}>Barcode</Text>
                        <Text style={styles.dotLabel}>:</Text>
                      </View>
                      <Text style={styles.infoPackage}>
                        {dataItem.barcodes.length === 0
                          ? 'EMPTY'
                          : dataItem.barcodes[dataItem.barcodes.length - 1]
                              .code_number}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                   {/* before pallet id for transit */}
                  </>
                )}
                <View style={styles.dividerContent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexShrink: 1,
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems:'center',
                          
                    }}>
                    <Text style={styles.labelPackage}>Pallet ID</Text>
                    <Text style={styles.dotLabel}>:</Text>
                  </View>
                  {this.state.isConfirm === true ? (
                  <Text style={styles.infoPackage}>
                    {this.state.ItemPalletNo}    
                    </Text>
                  ) : (
                    <View
                      style={[
                        styles.infoElement,
                        {flex: 1, flexDirection: 'row'},
                      ]}>
                      <SelectDropdown
                        buttonStyle={{
                          width: '100%',
                          maxHeight: 25,
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: '#ABABAB',
                          backgroundColor: 'white',
                        }}
                        buttonTextStyle={{
                          ...styles.infoPackage,
                          textAlign: 'left',
                        }}
                        data={
                          this.state.PalletArray !== null
                            ? this.state.PalletArray
                            : []
                        }
                        onSelect={(selectedItem, index) => {
                          this.setState({ItemPallet: selectedItem.palete_id, ItemPalletNo: selectedItem.pallet_no});
                        }}
                        renderDropdownIcon={() => {
                          return (
                            <IconArrow66Mobile
                              fill="#2D2C2C"
                              height="26"
                              width="26"
                              style={{transform: [{rotate: '90deg'}]}}
                            />
                          );
                        }}
                        dropdownIconPosition="right"
                        buttonTextAfterSelection={(selectedItem, index) => {
                          // text represented after item is selected
                          // if data array is an array of objects then return selectedItem.property to render after item is selected
                          return selectedItem.pallet_no;
                        }}
                        rowTextForSelection={(item, index) => {
                          // text represented for each item in dropdown
                          // if data array is an array of objects then return item.property to represent item in dropdown
                          return item.pallet_no;
                        }}
                        renderCustomizedRowChild={(item, index) => {
                        
                          return (
                            <View
                              style={{
                                flex: 1,
                                paddingHorizontal: 27,
                                backgroundColor:
                                  this.state.ItemPalletNo !== null &&
                                  this.state.ItemPalletNo === item
                                    ? '#e7e8f2'
                                    : 'transparent',
                                paddingVertical: 0,
                                marginVertical: 0,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  ...Mixins.small1,
                                  fontWeight: '400',
                                  lineHeight: 18,
                                  color: '#424141',
                                }}>
                                {item}
                              </Text>
                            </View>
                          );
                        }}
                      />
                    </View>
                  )}
                </View>
                {dataItem.is_transit !== 1 ? (
                  <>
                    <View style={styles.dividerContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexShrink: 1,
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <Text style={styles.labelPackage}>Grade</Text>
                        <Text style={styles.dotLabel}>:</Text>
                      </View>
                      <Text style={styles.infoPackage}>
                        {this.props.ManifestType === 1
                          ? dataItem.rework === 0
                          ? 'SIT -> BUFFER'
                              : 'SIT-> REWORKS -> BUFFER'
                          : dataItem.rework === 0
                          ? 'SIT-> PICK'
                          : 'SIT-> REWORKS -> PICK'}
                      </Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexShrink: 1,
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <Text style={styles.labelPackage}>UOM</Text>
                        <Text style={styles.dotLabel}>:</Text>
                      </View>
                      <Text style={styles.infoPackage}>{dataItem.uom}</Text>
                    </View>
                    {this.state.isConfirm !== true && (
                      <View style={styles.dividerContent}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flexShrink: 1,
                            justifyContent: 'center',
                            alignContent: 'center',
                          }}>
                          <Text style={styles.labelPackage}>
                            Item Classification
                          </Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                          {dataItem.product_class === 1
                            ? 'Normal Stock'
                            : dataItem.product_class === 2
                            ? 'POSM'
                            : dataItem.product_class === 3
                            ? 'Packaging Materials'
                            : dataItem.product_class === 4
                            ? 'Samples'
                            : '-'}
                        </Text>
                      </View>
                    )}
                        {this.state.isConfirm === true && (
                  <View style={styles.dividerContent}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexShrink: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                    
                      }}>
                      <Text style={styles.labelPackage}>QTY</Text>
                      <Text style={styles.dotLabel}>:</Text>
                    </View>
                    <Text style={styles.infoPackage}>{this.state.qty}</Text>
                  </View>
                )}
                  </>
                ) : (
                  <>
             
                    <View style={styles.dividerContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexShrink: 1,
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignItems:'center',

                        }}>
                        <Text style={styles.labelPackage}>No. of Pallet</Text>
                        <Text style={styles.dotLabel}>:</Text>
                      </View>
                      {this.state.isConfirm ? ( 
                        <Text style={styles.infoPackage}>
                          {dataItem.total_pallet}
                        </Text>) : (
                          <Input   
                        containerStyle={ { flex: 1,
                          paddingVertical: 0,
                          maxHeight: 30,
                          flexDirection: 'row',
                        paddingHorizontal:0,
                      marginHorizontal:0,}}
                      keyboardType="number-pad"
                      inputContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 0,
                        flex: 1,
                        flexDirection: 'row',
                      }}
                      inputStyle={{ 
                        flexShrink:1,
                        justifyContent:'center',
                        alignContent:'center',
                        alignItems:'center',
                        height:'auto',
                        maxHeight:'auto',
                        minHeight:'auto',
                        borderWidth: 1,
                        borderColor: '#D5D5D5',
                        borderRadius: 5,}}
                      style={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.h4,
                          fontWeight: '600',
                          lineHeight: 27,
                          color: '#424141',
                          paddingHorizontal:10,
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {...Mixins.subtitle3, marginBottom: 0, marginRight: 0},
                      ]}
                      label=""
                      value={String(dataItem.total_pallet)}
                     
                      />
                        )}
                        
                    </View>
                    <View style={styles.dividerContent}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexShrink: 1,
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignItems:'center',
                          
                        }}>
                        <Text style={styles.labelPackage}>No. of Carton</Text>
                        <Text style={styles.dotLabel}>:</Text>
                      </View>
                     
                      {this.state.isConfirm ? ( 
                        <Text style={styles.infoPackage}>
                          {dataItem.total_carton}
                        </Text>) : (
                          <Input   
                        containerStyle={ { flex: 1,
                          paddingVertical: 0,
                          maxHeight: 30,
                          flexDirection: 'row',
                        paddingHorizontal:0,
                      marginHorizontal:0,}}
                      keyboardType="number-pad"
                      inputContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 0,
                        flex: 1,
                        flexDirection: 'row',
                      }}
                      inputStyle={{ 
                        flexShrink:1,
                        justifyContent:'center',
                        alignContent:'center',
                        alignItems:'center',
                        height:'auto',
                        maxHeight:'auto',
                        minHeight:'auto',
                        borderWidth: 1,
                        borderColor: '#D5D5D5',
                        borderRadius: 5,
                      }}
                      style={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.h4,
                          fontWeight: '600',
                          lineHeight: 27,
                          color: '#424141',
                          paddingHorizontal:10,
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {...Mixins.subtitle3, marginBottom: 0, marginRight: 0},
                      ]}
                      label=""
                      value={String(dataItem.total_carton)}
                     
                      />
                        )}
                    </View>
                    </>
                )}

            
              </View>
              {(this.state.isConfirm !== true && dataItem.is_transit !== 1) && (
                <View
                  style={[
                    styles.sectionDividier,
                    {
                      flexDirection:
                        dataItem.is_transit === 1 ? 'row' : 'column',
                      marginTop: 15,
                    },
                  ]}>
                  <View
                    style={[
                      styles.dividerContent,
                      dataItem.is_transit !== 1
                        ? {
                            marginRight: 35,
                            alignContent: 'flex-start',
                            justifyContent: 'flex-start',
                          }
                        : {marginRight: 35},
                    ]}>
                    <Text style={styles.qtyTitle}>
                      {dataItem.is_transit === 1 ? 'Qty' : 'Enter Qty'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.dividerInput,
                      dataItem.is_transit !== 1
                        ? {
                            justifyContent: 'center',
                            alignContent: 'center',
                            paddingHorizontal: 40,
                            marginVertical: 0,
                          }
                        : null,
                    ]}>
                    <Decremental
                      height="30"
                      width="30"
                      style={{flexShrink: 1, marginVertical: 5}}
                      onPress={() => {
                        const {qty, dataItem} = this.state;
                        let parsedQty = parseInt(qty);
                        this.setState({
                          qty:
                            isNaN(parsedQty) === false && parsedQty > 0
                              ? String(parsedQty - 1)
                              : isNaN(parsedQty) === true && qty === ''
                              ? '0'
                              : qty,
                        });
                      }}
                    />
                    {/* <Badge value="-" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: PixelRatio.get() > 2.75 ? 32 : 37 }} onPress={()=>{
                           const {qty,dataItem} = this.state;
                            this.setState({qty: qty !== '' && qty > 0 ? qty-1 : qty === '' ? 0 : qty});
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          /> */}
                    <Input
                      containerStyle={{flex: 1, paddingVertical: 0}}
                      keyboardType="number-pad"
                      inputContainerStyle={styles.textInput}
                      inputStyle={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.h4,
                          fontWeight: '600',
                          lineHeight: 27,
                          color: '#424141',
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {marginBottom: 5},
                      ]}
                      value={this.state.qty}
                      onChangeText={(val) => {
                        this.setState({qty: val});
                      }}
                      onBlur={(e) =>{
                        const {qty} = this.state;
                        let qty_parsed = parseFloat(qty);
                        this.setState({
                          qty:
                          typeof qty === 'string' && isNaN(qty_parsed) === false
                              ? String(qty_parsed)
                              : '0',
                        })
                      }}
                      onEndEditing={(e) => {
                        let qty_parsed = parseFloat(e.nativeEvent.text);
                        this.setState({
                          qty:
                          typeof this.state.qty === 'string' && isNaN(qty_parsed) === false
                              ? String(qty_parsed)
                              : '0',
                        });
                      }}
                    />
                    <Incremental
                      height="30"
                      width="30"
                      style={{flexShrink: 1, marginVertical: 5}}
                      onPress={() => {
                        const {qty, dataItem} = this.state;
                        let parsedQty = parseInt(qty);
                        this.setState({
                          qty: isNaN(parsedQty) === false ? String(parsedQty + 1) : isNaN(parsedQty) === true && qty === '' ? '1' : qty,
                        });
                      }}
                    />
                    {/* <Badge value="+" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: PixelRatio.get() > 2.75 ? 32 : 37}} onPress={()=>{
                            const {qty,dataItem} = this.state;
                            this.setState({qty:  qty !== '' ? qty+1: qty === '' ?  1 : qty});
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          /> */}
                  </View>
                </View>
              )}
            </View>
          ) : dataItem === null && this.state.multipleSKU === true ? (
            <View style={styles.sheetPackages}>
              {/* <FlatList
                keyExtractor={(item, index) => index.toString()}
                horizontal={false}
                data={this.state.filterMultipleSKU}
                renderItem={this.renderMultipleSKU.bind(this)}
              /> */}
            </View>
          ) : dataItem !== null && this.state.enterAttr === true ? (
            <View style={styles.sheetPackages}>
              <View
                style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                {/* <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{...Mixins.small3, color:'red'}}>
                          {this.state.errorAttr}
                        </Text>
                      </View> */}

                {this.state.dataItem!.specialField.batchTracking === 1 && (
                  <TemplateText
                    required={1}
                    name="Batch #"
                    ref={this.refBatch}
                  />
                )}

                {this.state.dataItem!.specialField.expiryDateTracking === 1 && (
                  <TemplateDate
                    required={
                      this.state.dataItem!.specialField.expiryDateMandatory
                    }
                    name="Exp Date"
                    ref={this.refexpiryDate}
                  />
                )}
                {this.state.dataItem!.specialField.productionDateTracking ===
                  1 && (
                  <TemplateDate
                    required={1}
                    name="Mfg Date"
                    ref={this.refproductionDate}
                  />
                )}

                {this.state.dataItem!.template !== undefined &&
                  this.state.dataItem!.template !== null &&
                  this.state.dataItem!.template.attributes !== undefined &&
                  this.state.dataItem!.template.attributes !== null &&
                  this.state.dataItem!.template.attributes.map(
                    (element, index) => {
                      if (element.field_type === 'text') {
                        return (
                          <TemplateText
                            {...element}
                            ref={(ref) => {
                              if (ref !== null && this.refAttrArray.current !== null)
                                this.refAttrArray!.current[index] = ref;
                            }}
                          />
                        );
                      } else if (element.field_type === 'select') {
                        return (
                          <TemplateSelect
                            {...element}
                            ref={(ref) => {
                              if (ref !== null && this.refAttrArray.current !== null)
                              this.refAttrArray!.current[index] = ref;
                            }}
                          />
                        );
                      } else if (element.field_type === 'multi select') {
                        return (
                          <TemplateMulti
                            {...element}
                            ref={(ref) => {
                              if (ref !== null && this.refAttrArray.current !== null)
                                this.refAttrArray.current[index] = ref;
                            }}
                          />
                        );
                      } else if (element.field_type === 'options') {
                        return (
                          <TemplateOption
                            {...element}
                            ref={(ref) => {
                              if (ref !== null && this.refAttrArray.current !== null)
                                this.refAttrArray!.current[index] = ref;
                            }}
                          />
                        );
                      } else if (element.field_type === 'scale') {
                        return (
                          <TemplateScale
                            {...element}
                            ref={(ref) => {
                              if (ref !== null && this.refAttrArray.current !== null)
                                this.refAttrArray.current[index] = ref;
                            }}
                          />
                        );
                      }
                    },
                  )}
              </View>
            </View>
          ) : this.state.dataItem !== null && this.state.isPOSM === true ? (
            <View
              style={[
                styles.sheetPackages,
                {justifyContent: 'center', alignItems: 'center'},
              ]}>
              <Avatar
                onPress={() => {
                  this.props.navigation.navigate({
                    name :'POSMPhoto',
                    params : {

                    },
                  });
                }}
                size={79}
                ImageComponent={ImageComponent}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: '#F07120',
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
                }}>
                Take Photo
              </Text>
            </View>
          ) : (
            <View style={styles.sheetPackages}>
              <View
                style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                <View style={styles.dividerContent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexShrink: 1,
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <Text style={styles.labelNotFound}>SKU</Text>
                    <Text style={styles.dotLabel}>:</Text>
                  </View>
                  <Text style={styles.infoNotFound}></Text>
                </View>
                <View style={styles.dividerContent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexShrink: 1,
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <Text style={styles.labelNotFound}>Barcode</Text>
                    <Text style={styles.dotLabel}>:</Text>
                  </View>
                  <Text style={styles.infoNotFound}>{this.state.dataCode}</Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={[
              styles.buttonSheetContainer,
              {
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                alignContent: 'flex-end',
                backgroundColor: 'transparent',
                flex: 1,
              },
            ]}>
            <View style={styles.buttonSheet}>
              {dataItem !== null &&
              this.state.isConfirm === false &&
              this.state.isPOSM === false &&
              this.state.enterAttr === false ? (
                <Button
                  containerStyle={{flex: 1, marginTop: 10}}
                  buttonStyle={styles.navigationButton}
                  titleStyle={styles.deliveryText}
                  onPress={() => this.onSubmit()}
                  title="Next Step"
                />
              ) : dataItem !== null &&
                this.state.enterAttr === true &&
                this.state.isConfirm !== true ? (
                <Button
                  containerStyle={{flex: 1, marginTop: 10}}
                  buttonStyle={styles.navigationButton}
                  titleStyle={styles.deliveryText}
                  onPress={() => this.onUpdateAttr()}
                  title="Confirm"
                />
              ) : dataItem !== null &&
                this.state.isPOSM === true &&
                this.state.isConfirm !== true ? (
                <></>
              ) : (
                this.state.dataItem === null &&
                this.state.multipleSKU === false && (
                  <Button
                    containerStyle={{flex: 1, marginTop: 10}}
                    buttonStyle={styles.navigationButton}
                    titleStyle={styles.deliveryText}
                    onPress={() => {
                      this.props.setBottomBar(true);
                      this.props.navigation.navigate({
                        name: 'ManualInput',
                        params: {
                          dataCode: this.state.scanItem,
                        },
                      });
                    }}
                    title="Input Manual"
                  />
                )
              )}
            </View>
            <View style={styles.buttonSheet}>
              {dataItem === null && this.state.multipleSKU === true ? (
                <Button
                  containerStyle={{flex: 1, marginTop: 10, marginRight: 0}}
                  buttonStyle={styles.cancelButton}
                  titleStyle={styles.backText}
                  onPress={() => this.props.navigation.goBack()}
                  title="Cancel"
                />
              ) : (dataItem !== null && this.state.isConfirm === false) ||
                (dataItem === null && this.state.scanItem === '0') ? (
                <>
                  <Button
                    containerStyle={{flex: 1, marginTop: 10, marginRight: 5}}
                    buttonStyle={styles.cancelButton}
                    titleStyle={styles.reportText}
                    onPress={() => {
                      this.props.setBottomBar(false);
                      this.props.navigation.navigate({
                        name: 'ReportManifest',
                        params: {
                          dataCode: scanItem,
                        },
                      });
                    }}
                    title="Report Item"
                  />
                  {/* <Button
                      containerStyle={{flex: 1, marginTop: 10, marginLeft: 5}}
                      buttonStyle={styles.cancelButton}
                      titleStyle={styles.backText}
                      onPress={this.handleCancel}
                      title="Cancel"
                    /> */}
                </>
              ) : (
                <Button
                  containerStyle={{flex: 1, marginTop: 50, marginRight: 5}}
                  buttonStyle={styles.navigationButton}
                  titleStyle={styles.deliverText}
                  onPress={() => {
                    this.props.setBarcodeScanner(true);
                    this.props.navigation.goBack();
                  }}
                  title="Back To List"
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderInner = () => (
    <View style={styles.sheetContainer}>
      <View style={styles.sectionSheetDetail}>
        <View style={styles.sheetPackages}>
          <View style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelNotFound}>SKU</Text>
              <Text style={styles.infoNotFound}>
                {this.state.dataItem !== null ? this.state.dataItem.sku : null}
              </Text>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelNotFound}>Barcode</Text>
              <Text style={styles.infoNotFound}>{this.state.dataCode}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.buttonSheet, {marginVertical: 40}]}>
          <Button
            containerStyle={{flex: 1, marginTop: 10, marginRight: 5}}
            buttonStyle={styles.cancelButton}
            titleStyle={styles.reportText}
            onPress={() => {
              this.props.setBottomBar(false);
              this.props.navigation.navigate({
                name: 'ReportManifest',
                params: {
                  dataCode: this.state.scanItem,
                },
              });
            }}
            disabled={this.state.dataItem !== null ? false : true}
            title="Report Item"
          />
          <Button
            containerStyle={{flex: 1, marginTop: 10, marginLeft: 5}}
            buttonStyle={styles.navigationButton}
            titleStyle={styles.deliveryText}
            onPress={() => {
              this.props.setBottomBar(true);
              this.props.navigation.navigate({
                name: 'ManualInput',
                params: {
                  dataCode: this.state.scanItem,
                },
              });
            }}
            title="Input Manual"
          />
        </View>
      </View>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader} />
    </View>
  );

  renderBarcode = (barcode : any) => {
    if (barcode.length > 0 && barcode[0].data.length > 0) {
      this.setState({dataCode: barcode[0].data});
    }
  };
  // makeScannedItem = (dataCode, qty) => {
  //   return Array.from({length: qty}).map((num, index) => {
  //     return dataCode;
  //   });
  // };
  onSubmit = async () => {
    const {dataCode, qty, scanItem, ItemGrade, dataItem} = this.state;
    //this.props.setBarcodeScanner(true);
    let toEnterAttr = false;
    if (
      dataItem!.specialField !== undefined &&
      dataItem!.specialField !== null &&
      (dataItem!.specialField.batchTracking === 1 ||
        dataItem!.specialField.productionDateTracking === 1 ||
        dataItem!.specialField.expiryDateTracking === 1)
    ) {
      toEnterAttr = true;
    }
    if (
      dataItem!.template !== undefined &&
      dataItem!.template !== null &&
      dataItem!.template.attributes !== undefined &&
      dataItem!.template.attributes !== null &&
      Array.isArray(dataItem!.template.attributes) === true &&
      dataItem!.template.attributes.length > 0
    ) {
      toEnterAttr = true;
    }

    if (isNaN(parseInt(qty)) === false && parseInt(qty) !== parseFloat(qty)) {
      this.setState({
        errorAttr: 'Qty only in integer',
      });
    } else if (this.state.ItemPallet === null) {
      this.setState({
        errorAttr:
          'Please choose item pallet before going to next step',
      });
    } else if (dataItem!.is_transit || toEnterAttr === false) {
      let FormData = await this.getPhotoReceivingGoods();
      let incrementQty = this.state.qty;

      const ProcessItem = await postBlob(
        'inboundsMobile/' +
          this.props.currentASN +
          '/' +
          this.state.scanItem +
          '/process-item',
        [
          ...FormData,
          {name: 'palletId', data: String(this.state.ItemPallet)},
          {name: 'qty', data: String(parseInt(incrementQty))},
        ],
      ).then((result) => {
        if (
          result.error !== undefined &&
          this.props.keyStack === 'ItemProcess'
        ) {
          this.setState({
            errorAttr: result.error,
          });
        } else {
          this.props.navigation.setOptions({headerTitle: 'Item Processed'});
          this.setState({
            dataCode: '0',
            qty: isNaN(parseInt(qty)) === true ? '0' : qty,
            enterAttr: toEnterAttr,
            isConfirm: true,
            isPOSM: false,
            errorAttr: '',
          });
        }
      });
    } else {
      this.props.navigation.setOptions({headerTitle: 'Item Attribute'});
      this.setState({
        dataCode: '0',
        qty: isNaN(parseInt(qty)) === true ? '0' : qty,
        enterAttr: toEnterAttr,
        isConfirm: false,
        isPOSM: false,
        errorAttr: '',
      });
    }
    // for prototype only
    // let arr = this.makeScannedItem(scanItem, qty);
    // console.log(arr);
    // this.props.setItemGrade(ItemGrade);
    // this.props.setItemScanned(arr);
    this.props.setBottomBar(false);
    //this.props.navigation.navigate('Manifest');
  };
  onUpdateAttr = async () => {
    const {dataItem} = this.state;
    let attributes:Array<object> = [];
    let errors = [];
    let batchAttr =
      dataItem!.specialField.batchTracking === 1 && this.refBatch !== null && this.refBatch.current !== null
        ? this.refBatch!.current!.getSavedAttr()
        : null;
    if (batchAttr !== null && typeof batchAttr === 'object' && batchAttr.error !== undefined) {
      errors.push(batchAttr.error);
    }
    let ISOexpiry =
      dataItem!.specialField.expiryDateTracking === 1 && this.refexpiryDate !== null && this.refexpiryDate.current !== null
        ? this.refexpiryDate!.current.getSavedAttr()
        : null;
    if (ISOexpiry !== null && typeof ISOexpiry === 'object' && ISOexpiry.error !== undefined) {
      errors.push(ISOexpiry.error);
    }
    let ISOproduction =
      dataItem!.specialField.productionDateTracking === 1 && this.refproductionDate.current !== null
        ? this.refproductionDate!.current.getSavedAttr()
        : null;
    if (ISOproduction !== null && typeof ISOproduction === 'object' && ISOproduction.error !== undefined) {
      errors.push(ISOproduction.error);
    }
    if (
      this.state.dataItem!.template !== undefined &&
      this.state.dataItem!.template !== null &&
      this.state.dataItem!.template.attributes !== undefined &&
      this.state.dataItem!.template.attributes !== null
    ) {
      for (
        let index = 0;
        index < this.state.dataItem!.template.attributes.length;
        index++
      ) {
        const element = this.state.dataItem!.template.attributes[index];
        const refEl =  this.refAttrArray !== null && this.refAttrArray!.current !== null  ? this.refAttrArray!.current[index] : null;
        let savedAttr = refEl !== null ? refEl.getSavedAttr() : null;
        if (savedAttr instanceof Array || savedAttr === null || typeof savedAttr !== 'object') {
          if(savedAttr !== null){
              if (element.field_type === 'options' && element.values !== undefined && typeof savedAttr === 'number') {
                attributes.push({
                  [element.name]: element.values[savedAttr],
                });
              } else {
                attributes.push({
                  [element.name]: savedAttr,
                });
              }
            }
        } else {
          errors.push(savedAttr.error);
        }
      }
    }
    if (errors.length === 0) {
      let FormData = await this.getPhotoReceivingGoods();
      let incrementQty = this.state.qty;
      let attributeobj = [];
      if (batchAttr !== null) {
        attributeobj.push({name: 'batchNo', data: String(batchAttr)});
      }
      if (ISOexpiry !== null) {
        attributeobj.push({name: 'expiryDate', data: String(ISOexpiry)});
      }
      if (ISOproduction !== null) {
        attributeobj.push({
          name: 'productionDate',
          data: String(ISOproduction),
        });
      }
      const ProcessItem = await postBlob(
        'inboundsMobile/' +
          this.props.currentASN +
          '/' +
          this.state.scanItem +
          '/process-item',
        [
          ...FormData,
          ...attributeobj,
          {name: 'palletId', data: String(this.state.ItemPallet)},
          {name: 'qty', data: String(parseInt(incrementQty))},
          {name: 'attributes', data: JSON.stringify(attributes)},
        ],
      ).then((result) => {
        if (
          result.error !== undefined &&
          this.props.keyStack === 'ItemProcess'
        ) {
          this.setState({
            errorAttr: result.error,
          });
        } else {
          this.props.navigation.setOptions({headerTitle: 'Item Processed'});
          this.setState({
            dataCode: '0',
            isConfirm: true,
            attrData: attributes,
            errorAttr: '',
            batchNo: batchAttr === null || typeof batchAttr === 'string' ? batchAttr: null ,
            ISODateExpiryString: ISOexpiry === null || typeof ISOexpiry === 'string' ? ISOexpiry : null,
            ISODateProductionString: ISOproduction === null || typeof ISOproduction === 'string' ? ISOproduction : null,
          });
        }
      });
    } else {
      this.setState({
        errorAttr: errors.join('\r\n'),
      });
    }
  };
  closeNotifBanner = () => {
    this.setState({errorAttr: ''});
  };
  render() {
    const {dataItem, dataCode} = this.state;
    const {detectBarcode} = this.props;
    return (
      <>
        {this.state.errorAttr !== '' && (
          <Banner
            title={this.state.errorAttr}
            backgroundColor="#F1811C"
            closeBanner={this.closeNotifBanner}
          />
        )}
        <ScrollView style={styles.container}>
          {detectBarcode === false &&
            (this.state.scanItem === '0' ||
              (this.state.scanItem !== '0' && this.state.dataItem !== null) ||
              (this.state.scanItem !== '0' &&
                this.state.multipleSKU === true)) === true && (
              <this.renderModal />
            )}
          {/* (          <Modalize 
          ref={this.modalizeRef}
          handleStyle={{width: '30%', backgroundColor: '#C4C4C4', borderRadius: 0}}
          handlePosition={'inside'}
          disableScrollIfPossible={true}
          modalHeight={200}
          alwaysOpen={200}
          HeaderComponent={<this.renderHeader />}
        >
          <this.renderInner />
        </Modalize>)} */}
        </ScrollView>
      </>
    );
  }
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 40,
  },
  modalOverlay: {
    flexDirection: 'column',
    flexShrink: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  search: {
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: screen.height * 0.6,
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 120,
    height: 7,
    backgroundColor: '#C4C4C4',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  sheetContainer: {
    backgroundColor: 'white',
  },
  sectionSheetDetail: {
    flexGrow: 1,
    flexDirection: 'column',
    width: screen.width - 40,
    borderRadius: 13,
    marginHorizontal: 32,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    backgroundColor: 'white',
  },
  detailContent: {
    flexShrink: 1,
    flexDirection: 'column',
    marginTop: 19,
  },
  barcodeText: {
    ...Mixins.h1,
    lineHeight: 27,
    maxWidth: '80%',
  },
  barcodeDesc: {
    color: '#6C6B6B',
    fontSize: 36,
    maxWidth: '20%',
  },
  sectionDividier: {
    flexDirection: 'column',
  },
  dividerContent: {
    flexDirection: 'row',
    flexShrink: 1,
    marginVertical: 3,
  },
  dividerInput: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 8,
  },

  labelNotFound: {
    minWidth: 110,
    ...Mixins.h6,
    color: '#2D2C2C',
    fontWeight: '500',
    lineHeight: 24,
  },
  infoNotFound: {
    paddingHorizontal: 10,
    ...Mixins.h6,
    fontWeight: '400',
    lineHeight: 24,
    color: '#424141',
  },
  dotLabel: {
    ...Mixins.small1,
    color: '#2D2C2C',
    fontWeight: '500',
    lineHeight: 18,
    paddingHorizontal: 9,
  },
  labelPackage: {
    minWidth: 100,
    ...Mixins.small1,
    color: '#2D2C2C',
    fontWeight: '500',
    lineHeight: 18,
  },
  infoPackage: {
    paddingHorizontal: 10,
    ...Mixins.small1,
    color: '#424141',
    fontWeight: '400',
    lineHeight: 18,
    flex: 1,
  },
  infoElement: {
    paddingHorizontal: 10,
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },

  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  sheetPackages: {
    borderRadius: 13,
    padding: 20,
    flexShrink: 1,
  },
  buttonSheetContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonSheet: {
    flexShrink: 1,
    flexDirection: 'row',
  },
  deliverTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
  },
  qtyTitle: {
    ...Mixins.h3,
    fontWeight: '600',
    lineHeight: 36,
    color: '#424141',
  },
  deliverText: {
    fontSize: 20,
    lineHeight: 40,
  },
  modalContainerEnterAttr: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 80) / 100,
    maxHeight: (screen.height * 80) / 100,
    borderRadius: 10,
  },
  modalContainerAllTransit: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 55) / 100,
    maxHeight: (screen.height * 55) / 100,
    borderRadius: 10,
  },
  modalContainerSmallConfirmTransit: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 45) / 100,
    maxHeight: (screen.height * 45) / 100,
    borderRadius: 10,
  },
  modalContainerAll: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 65) / 100,
    maxHeight: (screen.height * 65) / 100,
    borderRadius: 10,
  },
  modalContainerSmallConfirm: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 55) / 100,
    maxHeight: (screen.height * 55) / 100,
    borderRadius: 10,
  },
  modalContainerSmall: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 36) / 100,
    maxHeight: (screen.height * 36) / 100,
    marginBottom: (screen.height * 8) / 100,
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    marginHorizontal: 0,
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    ...Mixins.h6,
    color: '#17B055',
    fontWeight: '400',
    lineHeight: 27,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#6C6B6B',
    borderRadius: 5,
  },
  cancelText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#6C6B6B',
  },
  reportText: {
    color: '#E03B3B',
  },
  backText: {
    color: '#F1811C',
  },
});

function mapStateToProps(state:ReduxState) {
  return {
    ManifestCompleted: state.originReducer.filters.manifestCompleted,
    detectBarcode: state.originReducer.filters.isBarcodeScan,
    // for prototype only
    barcodeScanned: state.originReducer.filters.barcodeScanned,
    // end
    currentASN: state.originReducer.filters.currentASN,
    manifestList: state.originReducer.manifestList,
    keyStack: state.originReducer.filters.keyStack,
    POSMPostpone: state.originReducer.filters.POSMPostpone,
    ManifestType: state.originReducer.filters.currentManifestType,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<ISetAppView | ISetAppItem | ISetReduxItem>) => {
  return {
    dispatchCompleteManifest: (bool : boolean) => {
      return dispatch({type: 'ManifestCompleted', payload: bool});
    },
    setBarcodeScanner: (toggle : boolean) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    setItemScanned: (item : string) => {
      return dispatch({type: 'BarcodeScanned', payload: item});
    },
    setItemGrade: (grade : string) => {
      return dispatch({type: 'BarcodeGrade', payload: grade});
    },
    setItemError: (error : string) => {
      return dispatch({type: 'ManifestError', payload: error});
    },
    setBottomBar: (toggle : boolean) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    addPOSMPostpone: (uri : string | null) => dispatch({type: 'POSMPostpone', payload: uri}),
  };
};

export default connect<StateProps, DispatchProps, OwnProps,RootState>(mapStateToProps, mapDispatchToProps)(Example);
