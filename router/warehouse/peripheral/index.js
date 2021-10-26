import React from 'react';
import {
  Animated,
  StyleSheet,
  Easing,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  FlatList
} from 'react-native';
import {
Button,
Input,
Badge, 
Divider,
ListItem,
Avatar,
LinearProgress
} from 'react-native-elements'
import SelectDropdown from 'react-native-select-dropdown';
import { Modalize } from 'react-native-modalize';
import BarCode from '../../../component/camera/filter-barcode';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import CheckmarkIcon from '../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import XMarkIcon from '../../../assets/icon/iconmonstr-x-mark-7mobile.svg';
import Mixins from '../../../mixins';
import moment from 'moment';
import {postData, getData, postBlob} from '../../../component/helper/network';
import {connect} from 'react-redux';
import MultipleSKUList from '../../../component/extend/ListItem-inbound-multiple-sku';
import TemplateOption from '../../../component/include/template-option';
import TemplateScale from '../../../component/include/template-scale';
import TemplateSelect from '../../../component/include/template-select';
import TemplateText from '../../../component/include/template-text';
import RNFetchBlob from 'rn-fetch-blob';

const screen = Dimensions.get('screen');
const grade = ["Pick", "Buffer", "Damage", "Defective", "Short Expiry", "Expired", "No Stock", "Reserve"];
const pallet = ["PLDAP 0091", "PLDAP 0092", "PLDAP 0093", "PLDAP 0094"];
class Example extends React.Component {
  refAttrArray = React.createRef(null);
  refBatch = React.createRef(null);
  animatedValue = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      qty: 0,
      scanItem: '0',
      dataItem: null,
      multipleSKU : false,
      indexItem: null,
      ItemGrade : null,
      ItemPallet : null,
      PalletArray : null,
      currentPOSM: false,
      enterAttr: false,
      batchNo : null,
      attrData : [],
      errorAttr : '',
      isPOSM : false,
      isConfirm : false,
      uploadPOSM : false,
      filterMultipleSKU : null,
    };
    this.refBatch.current = null;
    this.refAttrArray.current = [];
    this.handleResetAnimation.bind(this);
    this.handleZoomInAnimation.bind(this);
    this.renderBarcode.bind(this);
    this.modalizeRef = React.createRef();
  }

  static getDerivedStateFromProps(props,state){
    const {manifestList, currentASN, navigation, setBarcodeScanner, detectBarcode} = props;
    const {dataCode, dataItem, scanItem} = state;
    const {routes, index} = navigation.dangerouslyGetState();
    if(scanItem === '0'){
      if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined && manifestList.some((element) => element.pId === routes[index].params.inputCode)) {
          setBarcodeScanner(false);
          let elementItem =  manifestList.find((element) => element.pId === routes[index].params.inputCode);
          return {...state, scanItem: routes[index].params.inputCode, dataCode: elementItem.is_transit === 1 ? 'transit' :  elementItem.barcodes[elementItem.barcodes.length -1].code_number };
      } else if(routes[index].params !== undefined && routes[index].params.manualCode !== undefined && manifestList.some((element) => element.barcodes !== undefined && element.barcodes.some((element)=> routes[index].params.manualCode === element.code_number) === true)) {
        setBarcodeScanner(false);
        let elementItem =  manifestList.find((element) => element.barcodes !== undefined && element.barcodes.some((element)=> routes[index].params.manualCode === element.code_number) === true);
        return {...state, scanItem: elementItem.pId, dataCode: routes[index].params.manualCode};
      } else if(dataCode !== '0' && dataCode !== 'transit' && manifestList.some((element) =>  element.barcodes !== undefined && element.barcodes.some((element)=> dataCode === element.code_number) === true)) {
        setBarcodeScanner(false);
        let elementItem =  manifestList.find((element) => element.barcodes !== undefined && element.barcodes.some((element)=> dataCode === element.code_number) === true);
        return {...state, scanItem: elementItem.pId};
      } else if(dataCode === 'transit' && manifestList.some((o)=> o.is_transit === 1)){
        setBarcodeScanner(false);
        let elementItem =  manifestList.find((element) => element.is_transit === 1);
        return {...state, scanItem: elementItem.pId};
      }
      return {...state};
    } 
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.keyStack !== nextProps.keyStack){
      if(nextProps.keyStack === 'Barcode' && this.props.keyStack === 'newItem'){
        if (nextState.scanItem !== '0' && nextState.dataItem === null && nextProps.manifestList.some((element) => element.pId === nextState.scanItem)) {
          let item = nextProps.manifestList.find((element)=>element.pId === nextState.scanItem);
          this.setState({dataItem: item, qty : item.qty_processed});
        }
        return true;
      } else if (nextProps.keyStack === 'Barcode' && this.props.keyStack === 'POSMCameraMulti' && nextState.currentPOSM === true){
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if(routes[index].params !== undefined && routes[index].params.upload === true){
          this.setState({uploadPOSM: true});
          return false;
        }
      } 
    }
    if((this.state.ItemGrade !== nextState.ItemGrade || this.state.ItemPallet !== nextState.ItemPallet) && nextState.dataItem === this.state.dataItem){
      return false;
    } else if(nextState.isPOSM === true && nextState.dataItem === null){
      return false;
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState) {
    const {manifestList,detectBarcode, currentASN, navigation, setBarcodeScanner} = this.props;
    const {dataCode,scanItem, dataItem, isPOSM} = this.state;
    if(prevProps.detectBarcode !== detectBarcode){
      if(detectBarcode) {
        this.handleResetAnimation();
      } else {
        this.handleZoomInAnimation();
      }
    }
    if(prevState.isConfirm !== this.state.isConfirm && this.state.isConfirm === true ){
      let FormData = await this.getPhotoReceivingGoods();
      let gradeIndex = grade.findIndex((o)=> o === this.state.ItemGrade)+1;
      let incrementQty = this.state.qty - this.state.dataItem.qty_processed;
      
      const ProcessItem = await postBlob('inboundsMobile/'+this.props.currentASN+'/'+this.state.scanItem+'/process-item', [
        ...FormData,
        {name: 'palletId', data: String(this.state.ItemPallet)},
        {name: 'batchNo', data: String(this.state.batchNo)},
        {name: 'grade', data: String(gradeIndex)},
        {name: 'qty', data: String(incrementQty)},
        {name: 'attributes', data: JSON.stringify(this.state.attrData)},
      ]).then((result)=>{
        console.log(result);
      });

    }
    if(prevState.uploadPOSM !== this.state.uploadPOSM && this.state.uploadPOSM === true){
      //backend upload api
      this.setState({enterAttr: true});
    }
    let items = manifestList.find((o)=> o.pId === scanItem);
    if(items !== undefined &&  items.is_transit !== 1){
      let arrayBarcodes = Array.from({length:items.barcodes.length}).map((num,index)=>{
        return items.barcodes[index].code_number;
      });
    if (arrayBarcodes.includes(dataCode) && dataCode !== 0 && dataItem === null) {
      if(this.state.indexItem === null && this.state.multipleSKU === false) {
        let foundIndex = manifestList.filter((element) => element.barcodes !== undefined && element.barcodes.some((o)=>o.code_number === dataCode ) === true );
        let indexItem = manifestList.findIndex((element)=> element.pId === scanItem);
        let item = manifestList.find((element)=>element.pId === scanItem);  
        if(foundIndex.length > 1) {
          this.setState({multipleSKU: true, filterMultipleSKU : foundIndex});
        } else {
          const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
         if(result.error !== undefined && this.props.keyStack === 'Barcode'){
          this.props.navigation.goBack();
         } else {
          this.setState({dataItem: item, qty : item.is_transit === 1 ? 0 : item.qty_processed, ItemGrade: "Pick", indexItem: indexItem, currentPOSM: true});
         }
        }
      } else if(this.state.indexItem !== null && this.state.multipleSKU === true){
        let item = manifestList[this.state.indexItem];  
        const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
        if(result.error !== undefined && this.props.keyStack === 'Barcode'){
          this.props.navigation.goBack();
         } else {
          this.setState({dataItem: item, qty :  item.is_transit === 1 ? 0 : item.qty_processed, ItemGrade: "Pick",currentPOSM: true, multipleSKU : false, filterMultipleSKU : null}); 
         }
      }
    } 
  } else {
    if (dataCode === 'transit' && dataCode !== 0 && dataItem === null) {
      console.log('trigger transit');
      let item = manifestList.find((element)=>element.pId === scanItem);  
      let indexItem = manifestList.findIndex((element)=> element.pId === scanItem);
      const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
      this.setState({dataItem: item, qty : item.is_transit === 1 ? 0 : item.qty_processed, ItemGrade: "Pick", indexItem: indexItem, currentPOSM: true});
    }
  }
  }
  componentWillUnmount(){
    this.props.setBarcodeScanner(true);
    this.props.addPOSMPostpone(null);
  }
  async componentDidMount(){
    const {scanItem,dataCode} = this.state;
    const {detectBarcode, manifestList} = this.props;
  
    const resultPallet = await getData('inboundsMobile/'+this.props.currentASN+'/pallet');
    console.log(resultPallet);
    if(resultPallet.length > 0){
      this.setState({PalletArray:resultPallet, ItemPallet: resultPallet[0].palete_id});
    }
    let items = manifestList.find((o)=> o.pId === scanItem);
    if(items !== undefined && items.is_transit !== 1){
      let arrayBarcodes = Array.from({length:items.barcodes.length}).map((num,index)=>{
        return items.barcodes[index].code_number;
      });

    if(arrayBarcodes.includes(dataCode) && detectBarcode === false){
      this.handleZoomInAnimation();
      if(this.state.indexItem === null && this.state.multipleSKU === false) {
        let foundIndex = manifestList.filter((element) => element.barcodes !== undefined && element.barcodes.some((o)=>o.code_number === dataCode ) === true );
        let indexItem = manifestList.findIndex((element)=> element.pId === scanItem);
        let item = manifestList.find((element)=>element.pId === scanItem);  
        if(foundIndex.length > 1) {
          this.setState({multipleSKU: true, filterMultipleSKU : foundIndex});
        } else {
          const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
          if(result.error !== undefined){
            this.props.navigation.goBack();
           } else {
            this.setState({dataItem: item, qty : item.is_transit === 1 ? 0 : item.qty_processed, ItemGrade: "Pick", indexItem: indexItem, currentPOSM: true});
           }
        }
      } else if(this.state.indexItem !== null && this.state.multipleSKU === true){
        let item = manifestList[this.state.indexItem];  
        const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
        if(result.error !== undefined){
          this.props.navigation.goBack();
         } else {
          this.setState({dataItem: item, qty :  item.is_transit === 1 ? 0 : item.qty_processed, ItemGrade: "Pick", currentPOSM: true, filterMultipleSKU :null , multipleSKU: false}); 
         }
      }
    }
  } else {
    if (dataCode === 'transit' && detectBarcode === false) {
      let item = manifestList.find((element)=>element.pId === scanItem);  
      let indexItem = manifestList.findIndex((element)=> element.pId === scanItem);
      this.handleZoomInAnimation();
      this.setState({dataItem: item, qty : item.is_transit === 1 ? 0 : item.qty_processed, ItemGrade: "Pick", indexItem: indexItem, currentPOSM: true});
    }
  }
  }
  getPhotoReceivingGoods = async () => {
    const {POSMPostpone} = this.props;
    let formdata = [];
    for (let index = 0; index < POSMPostpone.length; index++) {
      let name,filename,path,type ='';
      await RNFetchBlob.fs.stat(POSMPostpone[index]).then((FSStat)=>{
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
  handleCancel = async ()=>{
    const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+this.state.scanItem+'/switch-status/1');
    this.props.navigation.goBack();
  }
  handleResetAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 0,
    }).reset();
  };
  handleZoomInAnimation = () => {
    console.log('test 2')
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };
  renderMultipleSKU = (props) => (
    <MultipleSKUList {...props} selectIndex={()=>this.setState({indexItem: this.props.manifestList.findIndex((element)=> element.pId === props.item.pId)})}/>
  )
  renderModal = () => {
    const {dataItem, dataCode, qty, scanItem} = this.state;
    return (
      <View style={styles.modalOverlay}>
        <Animated.View
          style={
           ( dataItem !== null && this.state.enterAttr !== true && this.state.isConfirm !== true && this.state.isPOSM !== true) || (dataItem === null && this.state.multipleSKU === true)
              ? [
                  dataItem !== null && dataItem.is_transit !== 1 ? styles.modalContainerAll : styles.modalContainerAllTransit,
                  {
                    transform: [
                      {
                        scaleX: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        scaleY: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]
              : dataItem !== null && this.state.isConfirm === true ?
              [ dataItem !== null &&  dataItem.is_transit !== 1 ? styles.modalContainerSmallConfirm : styles.modalContainerSmallConfirmTransit,
              {
                transform: [
                  {
                    scaleX: this.animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                  {
                    scaleY: this.animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },] 
              : dataItem !== null && this.state.enterAttr === true ? 
              [styles.modalContainerEnterAttr,
              {
                transform: [
                  {
                    scaleX: this.animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                  {
                    scaleY: this.animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },]
              : [
                  styles.modalContainerSmall,
                  {
                    transform: [
                      {
                        scaleX: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        scaleY: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]
          }>
          <View style={[styles.sectionSheetDetail, {marginHorizontal: 0, marginTop:0}]}>
            <View style={styles.modalHeader}>
              {dataItem === null && this.state.multipleSKU === false ? (
                <XMarkIcon height="24" width="24" fill="#E03B3B" />
              ) : (
                <CheckmarkIcon height="24" width="24" fill="#17B055" />
              )}
              {dataItem !== null ? (
                <Text style={styles.modalHeaderText}>
                  {this.state.isConfirm === true ? ' Item Processed ' : this.state.enterAttr === true ? 'Enter Item Attribute' : this.state.isPOSM === true ? 'Photo Required' : ' Item Found'}                
                </Text>
              ) : dataItem === null && this.state.multipleSKU === true ? (
              <Text style={styles.modalHeaderText}>
                Multiple SKU Found                
                </Text>): (
                <Text style={[styles.modalHeaderText, {color: '#E03B3B'}]}>
                  Item Not Found
                </Text>
              )}
            </View>
            <Divider color="#D5D5D5" />
            {(dataItem !== null && ((this.state.enterAttr === false && this.state.isPOSM === false) || this.state.isConfirm === true )) ? (
              <View style={[styles.sheetPackages,{marginHorizontal: 32, marginTop: 20}]}>
               <View style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                      {dataItem.is_transit !== 1 ? (<><View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>SKU</Text>
                        <Text style={styles.infoPackage}>
                          {dataItem.item_code}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>Barcode</Text>
                        <Text style={styles.infoPackage}>
                          {dataItem.barcodes[dataItem.barcodes.length -1].code_number}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>Descript</Text>
                        <Text style={styles.infoPackage}>
                          {dataItem.description}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>EXP Date</Text>
                        <Text style={styles.infoPackage}>
                        -
                          {/* {moment.unix(dataItem.timestamp).format('DD/MM/YY')} */}
                        </Text>
                      </View></>) : (
                        <>
                        <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>Container # </Text>
                        <Text style={styles.infoPackage}>
                         {dataItem.container_no}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>No. of Pallet</Text>
                        <Text style={styles.infoPackage}>
                          {dataItem.total_pallet}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>No. of Carton</Text>
                        <Text style={styles.infoPackage}>
                          {dataItem.total_carton}
                        </Text>
                      </View>
                        </>
                      )}
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>Pallet ID</Text>
                      { this.state.isConfirm === true ? (  
                      <Text style={styles.infoPackage}>
                        {this.state.PalletArray.find((o)=>o.palete_id === this.state.ItemPallet)['pallet_no']}
                        </Text>) 
                        :(  
                        <View style={styles.infoElement}>
                        <SelectDropdown
                            buttonStyle={{maxHeight:25,borderRadius: 5, borderWidth:1, borderColor: '#ABABAB', backgroundColor:'white'}}
                            buttonTextStyle={{...styles.infoPackage,textAlign:'left',}}
                            data={this.state.PalletArray !== null ?this.state.PalletArray : [] }
                            defaultValueByIndex={0}
                            onSelect={(selectedItem, index) => {
                              this.setState({ItemPallet:selectedItem.palete_id});
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                              return selectedItem.pallet_no
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item.pallet_no
                            }}
                          />
                        </View>)}
                      </View>
                      {dataItem.is_transit !== 1 && (
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>Grade</Text>
                    
                       { this.state.isConfirm === true ? (
                       <Text style={styles.infoPackage}>{this.state.ItemGrade}</Text>
                       ) :(     
                       <View style={styles.infoElement}>
                         <SelectDropdown
                            buttonStyle={{maxHeight:25,borderRadius: 5, borderWidth:1, borderColor: '#ABABAB', backgroundColor:'white'}}
                            buttonTextStyle={{...styles.infoPackage,textAlign:'left',}}
                            data={grade}
                            defaultValue={this.state.ItemGrade}
                            onSelect={(selectedItem, index) => {
                              this.setState({itemGrade:selectedItem});
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                              return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item
                            }}
                          />    
                          </View>
                          )}
                    
                      </View>)}

                      {this.state.isConfirm === true && (    
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>QTY</Text>
                        <Text style={styles.infoPackage}> {this.state.qty} </Text>
                        </View>
                        )}
                    </View>
                    {this.state.isConfirm !== true && (
                        <View style={[styles.sectionDividier,{flexDirection:'row',marginTop:15}]}>
                          <View style={[styles.dividerContent,{marginRight: 35}]}>
                            <Text style={styles.qtyTitle}>Qty</Text>
                          </View>
                          <View style={styles.dividerInput}>
                          <Badge value="+" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: 37}} onPress={()=>{
                            const {qty,dataItem} = this.state;
                            this.setState({qty:  qty < dataItem.qty ? qty+1: qty});
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          />
                          <Input 
                            containerStyle={{flex: 1,paddingVertical:0}}
                            inputContainerStyle={styles.textInput} 
                            inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.h4,fontWeight: '600',lineHeight: 27,color:'#424141'}]}
                            labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                            placeholder={''+this.state.qty}
                            disabled={true}
                            />
                           <Badge value="-" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: 37}} onPress={()=>{
                           const {qty,dataItem} = this.state;
                            this.setState({qty: dataItem.qty_processed < qty && qty > 0 ? qty-1 : qty});
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          />
                          </View>
                        </View>
                      )}
              </View>
            ) :  dataItem === null && this.state.multipleSKU === true ? (
              <View style={[styles.sheetPackages,{marginHorizontal: 0, marginTop: 20, maxHeight: (screen.height * 45) / 100}]}>
            <FlatList
              keyExtractor={ (item, index) => index.toString()}
              horizontal={false}
              data={this.state.filterMultipleSKU}
              renderItem={this.renderMultipleSKU.bind(this)}
            />
             </View>
            ) : dataItem !== null && this.state.enterAttr === true ? (
              <View style={[styles.sheetPackages,{marginHorizontal: 32, marginTop: 20}]}>
               <View
                      style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                      <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{...Mixins.small3, color:'red'}}>
                          {this.state.errorAttr}
                        </Text>
                      </View>
                        <TemplateText required={1} name="Batch#" ref={(ref)=>{
                            if(ref !== null)
                            this.refBatch.current = ref;
                          }}/>
                      {this.state.dataItem.template.attributes.map((element,index)=>{
                        if(element.field_type === 'text'){
                          return <TemplateText {...element} ref={(ref)=>{
                            if(ref !== null)
                            this.refAttrArray.current[index] = ref;
                          }}/>
                        } else if (element.field_type === 'select'){
                          return <TemplateSelect {...element}  ref={(ref)=>{
                            if(ref !== null)
                            this.refAttrArray.current[index] = ref;
                          }}/>
                        } else if(element.field_type === 'options') {
                          return <TemplateOption {...element}  ref={(ref)=>{
                            if(ref !== null)
                            this.refAttrArray.current[index] = ref;
                          }}/>
                        } else if (element.field_type === 'scale') {
                          return <TemplateScale {...element}  ref={(ref)=>{
                            if(ref !== null)
                            this.refAttrArray.current[index] = ref;
                          }}/>
                        }
                      })}
                      {/* <View style={[styles.dividerContent,{marginVertical:3}]}>
                        <Text style={styles.labelPackage}>Batch #</Text>
                        <Input 
                          containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                          inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                            inputStyle={Mixins.containedInputDefaultStyle}
                            labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                      </View>
                      <View style={[styles.dividerContent,{marginVertical:3}]}>
                        <Text style={styles.labelPackage}>Lot #</Text>
                        <Input 
                             containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                             inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                            inputStyle={Mixins.containedInputDefaultStyle}
                            labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                      </View>
                      <View style={[styles.dividerContent,{marginVertical:3,marginRight:10}]}>
                        <Text style={styles.labelPackage}>Exp Date </Text>
                        <Input 
                          containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                          inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                         inputStyle={Mixins.containedInputDefaultStyle}
                         labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                                 <Text style={{...Mixins.body3,lineHeight:18,fontWeight:'400',color:'#424141',paddingVertical:6}}>dd-MM-yy</Text>
                     
                      </View>
                      <View style={[styles.dividerContent,{marginVertical:3, marginRight:10}]}>
                        <Text style={styles.labelPackage}>Mfg Date</Text>
                        <Input 
                           containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                           inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                          inputStyle={Mixins.containedInputDefaultStyle}
                          labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                     
                     <Text style={{...Mixins.body3,lineHeight:18,fontWeight:'400',color:'#424141',paddingVertical:6}}>dd-MM-yy</Text>
         
                      </View>
                      <View style={[styles.dividerContent,{marginVertical:3}]}>
                        <Text style={styles.labelPackage}>Size</Text>
                        <Input 
                            containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                            inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                           inputStyle={Mixins.containedInputDefaultStyle}
                           labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                      </View>
                      <View style={[styles.dividerContent,{marginVertical:3}]}>
                        <Text style={styles.labelPackage}>Color</Text>
                        <Input 
                            containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                            inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                           inputStyle={Mixins.containedInputDefaultStyle}
                           labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                      </View>
                      <View style={[styles.dividerContent,{marginVertical:3}]}>
                        <Text style={styles.labelPackage}>Class</Text>
                        <Input 
                             containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                             inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                            inputStyle={Mixins.containedInputDefaultStyle}
                            labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                      </View>
                      <View style={[styles.dividerContent,{marginVertical:3}]}>
                        <Text style={styles.labelPackage}>Country</Text>
                        <Input 
                           containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                           inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                          inputStyle={Mixins.containedInputDefaultStyle}
                          labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                      </View>
                      <View style={[styles.dividerContent,{marginVertical:3}]}>
                        <Text style={styles.labelPackage}>C. Lot #</Text>
                        <Input 
                           containerStyle={{flexShrink: 1,paddingVertical:0,maxHeight:30}}
                           inputContainerStyle={[styles.textInput,{paddingVertical: 0,maxHeight:30}]} 
                          inputStyle={Mixins.containedInputDefaultStyle}
                          labelStyle={Mixins.containedInputDefaultLabel}
                            placeholder=""
                        />
                      </View> */}
                </View>
              </View>
            ) : this.state.dataItem !== null && this.state.isPOSM === true ? (
              <View style={[styles.sheetPackages,{alignItems: 'center',justifyContent: 'center',marginHorizontal: 32, marginTop: 20}]}>
              <Avatar
                onPress={()=>{
                  this.props.navigation.navigate('POSMPhoto');
                }}
                size={79}
                ImageComponent={() => (
                  <>
                    <IconPhoto5 height="40" width="40" fill="#fff" />
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
                  backgroundColor: '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}/>

                <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/>
                <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B'}}>Take Photo</Text>
              </View>
            ): (
              <View style={[styles.sheetPackages,{marginHorizontal: 32, marginTop: 20}]}>
               <View
                      style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelNotFound}>SKU</Text>
                        <Text style={styles.infoNotFound}>
                          
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelNotFound}>Barcode</Text>
                        <Text style={styles.infoNotFound}>
                          {this.state.dataCode}
                        </Text>
                      </View>
                </View>
              </View>
            )}
            <View style={styles.buttonSheetContainer}>
                <View style={styles.buttonSheet}>
                  {dataItem !== null && this.state.isConfirm === false && this.state.isPOSM === false && this.state.enterAttr === false ? (
                    <Button
                      containerStyle={{flex: 1, marginTop: 10}}
                      buttonStyle={styles.navigationButton}
                      titleStyle={styles.deliveryText}
                      onPress={() => this.onSubmit()}
                      title="Next Step"
                    />
                  ) : dataItem !== null && this.state.enterAttr === true && this.state.isConfirm !== true ? (
                    <Button
                    containerStyle={{flex: 1, marginTop: 10}}
                    buttonStyle={styles.navigationButton}
                    titleStyle={styles.deliveryText}
                    onPress={() => this.onUpdateAttr()}
                    title="Confirm"
                  />
                  ) : dataItem !== null && this.state.isPOSM === true && this.state.isConfirm !== true? (
                    <></>
                  ) : (this.state.dataItem === null && this.state.multipleSKU === false) && ( <Button
                    containerStyle={{flex: 1, marginTop: 10}}
                    buttonStyle={styles.navigationButton}
                    titleStyle={styles.deliveryText}
                    onPress={() => {
                      this.props.setBottomBar(true);
                      this.props.navigation.navigate({
                        name: 'ManualInput',
                        params:{
                          dataCode: this.state.scanItem,
                        },
                      }) 
                    }}
                    title="Input Manual"
                  />)}
                </View>
              <View style={styles.buttonSheet}>
                
                  {dataItem === null && this.state.multipleSKU === true ? (
                    <Button
                    containerStyle={{flex: 1, marginTop: 10, marginRight: 0}}
                    buttonStyle={styles.cancelButton}
                    titleStyle={styles.backText}
                    onPress={()=>this.props.navigation.goBack()}
                    title="Cancel"
                  />
                  ) : (dataItem !== null && this.state.isConfirm === false) || (dataItem === null && this.state.scanItem === '0') ? (
                    <>
                    <Button
                      containerStyle={{flex: 1, marginTop: 10, marginRight: 5}}
                      buttonStyle={styles.cancelButton}
                      titleStyle={styles.reportText}
                      onPress={() => {
                        this.props.setBottomBar(true);
                        this.props.navigation.navigate({
                          name: 'ReportManifest',
                          params: {
                              dataCode: scanItem,
                          }
                        })}}
                      title="Report Item"
                    />
                    <Button
                      containerStyle={{flex: 1, marginTop: 10, marginLeft: 5}}
                      buttonStyle={styles.cancelButton}
                      titleStyle={styles.backText}
                      onPress={this.handleCancel}
                      title="Cancel"
                    />
                    </>
                ) : (
                  <Button
                    containerStyle={{flex: 1, marginTop: 50, marginRight: 5}}
                    buttonStyle={styles.navigationButton}
                    titleStyle={styles.deliverText}
                    onPress={()=>{
                      this.props.setBarcodeScanner(true);
                      this.props.navigation.goBack()
                    }}
                    title="Back To List"
                  />
                )}
              </View>
            </View>
          </View>
        </Animated.View>
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
                  <Text style={styles.infoNotFound}>{ this.state.dataItem !== null ? this.state.dataItem.sku : null}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Barcode</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataCode}</Text>
                </View>
            </View>
            
        </View>
        <View style={[styles.buttonSheet,{marginVertical:40}]}>
        <Button
          containerStyle={{flex:1, marginTop: 10,marginRight: 5,}}
          buttonStyle={styles.cancelButton}
                      titleStyle={styles.reportText}
          onPress={() => {
            this.props.setBottomBar(true);
            this.props.navigation.navigate({
              name: 'ReportManifest',
              params: {
                  dataCode: this.state.scanItem,
              }
            })}}
            disabled={this.state.dataItem !== null ? false : true}
          title="Report Item"
        />
          <Button
          containerStyle={{flex:1, marginTop: 10,marginLeft:5,}}
          buttonStyle={styles.navigationButton}
          titleStyle={styles.deliveryText}
          onPress={() => {
            this.props.setBottomBar(true);
            this.props.navigation.navigate({
              name: 'ManualInput',
              params: {
                dataCode: this.state.scanItem,
              }
            })}}
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

  renderBarcode = (barcode) => {
    if (barcode.length > 0 && barcode[0].data.length > 0) {
      this.setState({dataCode: barcode[0].data});
    }
  };
  makeScannedItem = (dataCode, qty) => {
    return Array.from({length: qty}).map((num, index) => {
      return dataCode;
    });
  };
  onSubmit = () => {
    const {dataCode,qty, scanItem, ItemGrade, dataItem} = this.state;
    //this.props.setBarcodeScanner(true);
    this.setState({
      dataCode: '0',
      enterAttr : false,
      isConfirm: dataItem.is_transit === 1 ? true : false,
      isPOSM: true,
    });
    // for prototype only
    let arr = this.makeScannedItem(scanItem,qty);
    console.log(arr);
    this.props.setItemGrade(ItemGrade);
    this.props.setItemScanned(arr);
    this.props.setBottomBar(false);
    //this.props.navigation.navigate('Manifest');
  }
  onUpdateAttr = ()=>{
    const {dataItem} = this.state;
    let attributes = [];
    let errors = [];
    let batchAttr = this.refBatch.current.getSavedAttr();
    if(batchAttr.error !== undefined){
    errors.push(batchAttr.error);
    } 
    for (let index = 0; index < this.state.dataItem.template.attributes.length; index++) {
      const element = this.state.dataItem.template.attributes[index];
      const refEl = this.refAttrArray.current[index];
      let savedAttr = refEl.getSavedAttr();
      if(savedAttr.error === undefined){
        if(element.field_type === 'options'){
          attributes.push({
            [element.name]: element.values[savedAttr]
          }); 
        } else {
          attributes.push({
            [element.name]: savedAttr
          });
        }
      } else {
        errors.push(savedAttr.error);
      }
    }
    if(errors.length === 0){
      this.setState({
        dataCode: '0',
        isConfirm: true,
        attrData: attributes,
        errorAttr: '',
        batchNo: batchAttr,
      });
    } else {
      this.setState({
        errorAttr: errors.join(', '),
      });
    }
  }

  render() {
    const { dataItem,dataCode } = this.state;
    const {detectBarcode} = this.props;
    return (
      <View style={styles.container}>
        {detectBarcode === false   && (this.state.scanItem === "0" || (this.state.scanItem !== "0" && this.state.dataItem !== null) || (this.state.scanItem !== "0" && this.state.multipleSKU === true)) === true && (
          <this.renderModal/>
        ) }
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
        <TouchableWithoutFeedback onPress={() => {}}>
          <BarCode renderBarcode={this.renderBarcode} navigation={this.props.navigation} useManualMenu={true}/>
        </TouchableWithoutFeedback>
      </View>
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
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  search: {
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
    marginHorizontal: 32,
    marginTop: 20,
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
  },
  infoElement : {
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
    flexShrink: 1,
  },
  buttonSheetContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonSheet: {
    flexGrow: 1,
    flexDirection:'row',
  },
  deliverTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
  },
  qtyTitle : {
    ...Mixins.h3,
    fontWeight: '600',
    lineHeight: 36,
    color: '#424141'
  },
  deliverText: {
    fontSize: 20,
    lineHeight: 40,
  },
  modalContainerEnterAttr: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 70) / 100,
    maxHeight: (screen.height * 70) / 100,
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
    marginVertical: 20,
  },
  modalHeaderText: {
    color: '#17B055',
    marginLeft: 10,
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

function mapStateToProps(state) {
  return {
    ManifestCompleted: state.originReducer.filters.manifestCompleted,
    detectBarcode: state.originReducer.filters.isBarcodeScan,
    // for prototype only
    barcodeScanned: state.originReducer.filters.barcodeScanned,
    // end
    currentASN : state.originReducer.filters.currentASN,
    manifestList: state.originReducer.manifestList,
    keyStack: state.originReducer.filters.keyStack,
    POSMPostpone: state.originReducer.filters.POSMPostpone,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchCompleteManifest: (bool) => {
      return dispatch({type: 'ManifestCompleted', payload: bool});
    },
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    setItemScanned : (item) => {
      return dispatch({type: 'BarcodeScanned', payload: item});
    },
    setItemGrade : (grade)=>{
      return dispatch({type:'BarcodeGrade', payload: grade});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    addPOSMPostpone: (uri) => dispatch({type: 'POSMPostpone', payload: uri}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
