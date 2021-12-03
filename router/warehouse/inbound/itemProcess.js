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
  ScrollView
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
import TemplateOption from '../../../component/include/template-option';
import TemplateScale from '../../../component/include/template-scale';
import TemplateSelect from '../../../component/include/template-select';
import TemplateText from '../../../component/include/template-text';
import RNFetchBlob from 'rn-fetch-blob';

const screen = Dimensions.get('screen');
const grade = ["Pick", "Buffer", "Damage", "Defective", "Short Expiry", "Expired", "No Stock", "Reserve"];
const pallet = ["PLDAP 0091", "PLDAP 0092", "PLDAP 0093", "PLDAP 0094"];
class Example extends React.Component {
  _unsubscribe = null;
  _unsubscribeLock = null;
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
          return {...state, scanItem: routes[index].params.inputCode, dataCode: elementItem.is_transit === 1 ? 'transit' :  elementItem.barcodes.length > 0 ? elementItem.barcodes[elementItem.barcodes.length -1].code_number : 'empty'  };
      } else {
        navigation.goBack();
      } 
      return {...state};
    } 
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if((this.state.ItemPallet !== nextState.ItemPallet) && nextState.dataItem === this.state.dataItem && nextState.PalletArray === this.state.PalletArray){
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
      let incrementQty = this.state.qty;
      
      const ProcessItem = await postBlob('inboundsMobile/'+this.props.currentASN+'/'+this.state.scanItem+'/process-item', [
        ...FormData,
        {name: 'palletId', data: String(this.state.ItemPallet)},
        {name: 'batchNo', data: String(this.state.batchNo)},
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
    if (((dataCode !== '0' && arrayBarcodes.includes(dataCode)) || dataCode === 'empty' ) && dataItem === null) {
      if(this.state.indexItem === null && this.state.multipleSKU === false) {
        let foundIndex = manifestList.filter((element) => (dataCode === 'empty' &&  element.barcodes !== undefined && (element.barcodes.length === 0 || element.barcodes.some((o)=>o.code_number === dataCode ) === true)) || ( dataCode !== 'empty' && element.barcodes !== undefined && element.barcodes.some((o)=>o.code_number === dataCode ) === true) );
        let indexItem = manifestList.findIndex((element)=> element.pId === scanItem);
        let item = manifestList.find((element)=>element.pId === scanItem);  
        // if(foundIndex.length > 1) {
        //   this.setState({multipleSKU: true, filterMultipleSKU : foundIndex});
        // } else {
          const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
          if(result.error !== undefined && this.props.keyStack === 'ItemProcess'){
          this.props.setItemError(result.error);
          this.props.navigation.goBack();
         } else {
          this.setState({dataItem: item, qty : 0, ItemGrade: "Pick", indexItem: indexItem, currentPOSM: false});
         }
        // }
      } else if(this.state.indexItem !== null && this.state.multipleSKU === true){
        let item = manifestList[this.state.indexItem];  
        const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
        if(result.error !== undefined && this.props.keyStack === 'ItemProcess'){
          this.props.setItemError(result.error);
          this.props.navigation.goBack();
         } else {
          this.setState({dataItem: item, qty : 0, ItemGrade: "Pick",currentPOSM: false, multipleSKU : false, filterMultipleSKU : null}); 
         }
      }
    } 
  } else {
    if (dataCode === 'transit' && dataCode !== 0 && dataItem === null) {
      console.log('trigger transit');
      let item = manifestList.find((element)=>element.pId === scanItem);  
      let indexItem = manifestList.findIndex((element)=> element.pId === scanItem);
      const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
      this.setState({dataItem: item, qty : 0, ItemGrade: "Pick", indexItem: indexItem, currentPOSM: false});
    }
  }
  }
  componentWillUnmount(){
    this.props.setBarcodeScanner(true);
    this.props.addPOSMPostpone(null);
    this._unsubscribe();
    this._unsubscribeLock();
  }
  async componentDidMount(){
    const {scanItem,dataCode} = this.state;
    const {detectBarcode, manifestList} = this.props;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      if(this.state.currentPOSM === true && this.state.isPOSM === true){
        const {routes, index} = this.props.navigation.dangerouslyGetState();
        if(routes[index].params !== undefined && routes[index].params.upload === true){
          this.setState({uploadPOSM: true});
        }
      }
    });
    this._unsubscribeLock = this.props.navigation.addListener('state', async (test) => {
      // do something
      const {dataItem, isConfirm} = this.state;
      const {currentASN} = this.props;
      if(dataItem !== null && isConfirm === false && test.data.state.routes[test.data.state.index].name ==='Manifest'){
        const result = await postData('inboundsMobile/'+currentASN+'/'+dataItem.pId+'/switch-status/1')
        console.log(result);
      }
    });
    const resultPallet = await getData('inboundsMobile/'+this.props.currentASN+'/pallet');
    if(resultPallet.length > 0 && typeof resultPallet === 'object' && resultPallet.error === undefined){
      this.setState({PalletArray:resultPallet, ItemPallet: resultPallet[0].palete_id});
    } else {
      if(typeof resultPallet === 'object' && resultPallet.error !== undefined){
        this.props.setItemError(resultPallet.error);
      } else {
        this.props.setItemError('Generate New Pallet ID First');
      }
      this.props.navigation.goBack();
    }
    let items = manifestList.find((o)=> o.pId === scanItem);
    if(items !== undefined && items.is_transit !== 1){
      let arrayBarcodes = Array.from({length:items.barcodes.length}).map((num,index)=>{
        return items.barcodes[index].code_number;
      });
  
    if((arrayBarcodes.includes(dataCode) || dataCode === 'empty') && detectBarcode === false){

      this.handleZoomInAnimation();
      if(this.state.indexItem === null && this.state.multipleSKU === false) {
        let foundIndex = manifestList.filter((element) => (dataCode === 'empty' &&  element.barcodes !== undefined && (element.barcodes.length === 0 || element.barcodes.some((o)=>o.code_number === dataCode ) === true)) || ( dataCode !== 'empty' && element.barcodes !== undefined && element.barcodes.some((o)=>o.code_number === dataCode ) === true) );
        let indexItem = manifestList.findIndex((element)=> element.pId === scanItem);
        let item = manifestList.find((element)=>element.pId === scanItem);  
       
        // if(foundIndex.length > 1) {
        //   this.setState({multipleSKU: true, filterMultipleSKU : foundIndex});
        // } else {
          const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
          if(result.error !== undefined  && this.props.keyStack === 'ItemProcess'){
            this.props.setItemError(result.error);
            this.props.navigation.goBack();
           } else {
            this.setState({dataItem: item, qty : 0, ItemGrade: "Pick", indexItem: indexItem, currentPOSM: false});
           }
        // }
      } else if(this.state.indexItem !== null && this.state.multipleSKU === true){
        let item = manifestList[this.state.indexItem];  
        const result = await postData('inboundsMobile/'+this.props.currentASN+'/'+item.pId+'/switch-status/2')
        if(result.error !== undefined  && this.props.keyStack === 'ItemProcess'){
          this.props.setItemError(result.error);
          this.props.navigation.goBack();
         } else {
          this.setState({dataItem: item, qty :  0, ItemGrade: "Pick", currentPOSM: false, filterMultipleSKU :null , multipleSKU: false}); 
         }
      }
    }
  } else {
    if (dataCode === 'transit' && detectBarcode === false) {
      let item = manifestList.find((element)=>element.pId === scanItem);  
      let indexItem = manifestList.findIndex((element)=> element.pId === scanItem);
      this.handleZoomInAnimation();
      this.setState({dataItem: item, qty : 0, ItemGrade: "Pick", indexItem: indexItem, currentPOSM: false});
    }
  }
  }
  getPhotoReceivingGoods = async () => {
    const {POSMPostpone} = this.props;
    let formdata = [];
    if(POSMPostpone !== null){
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
          <View style={[styles.sectionSheetDetail, {marginHorizontal: 0, marginTop:0}]}>
            {( dataItem === null || (dataItem !== null && (this.state.isConfirm !== false || this.state.enterAttr !== false || this.state.isPOSM !== false))) && (<View style={styles.modalHeader}>
              {(dataItem !== null && this.state.isConfirm === true ) && (
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
                <Text style={styles.modalHeaderText}>
                  Item Not Found
                </Text>
              )}
            </View>)}
            {(dataItem !== null && ((this.state.enterAttr === false && this.state.isPOSM === false) || this.state.isConfirm === true )) ? (
              <View style={styles.sheetPackages}>
               <View style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                      {dataItem.is_transit !== 1 ? (<><View style={styles.dividerContent}>
                        <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                           <Text style={styles.labelPackage}>Item Code</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                          {dataItem.item_code}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                      <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                          <Text style={styles.labelPackage}>Description</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                          {dataItem.description}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                      <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                        <Text style={styles.labelPackage}>Barcode</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                          {dataItem.barcodes.length === 0 ? 'EMPTY' : dataItem.barcodes[dataItem.barcodes.length -1].code_number}
                        </Text>
                      </View>
                      </>) : (
                        <>
                        <View style={styles.dividerContent}>
                        <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                        <Text style={styles.labelPackage}>Container # </Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                         {dataItem.container_no}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                      <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                      <Text style={styles.labelPackage}>No. of Pallet</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                          {dataItem.total_pallet}
                        </Text>
                      </View>
                      <View style={styles.dividerContent}>
                      <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                      <Text style={styles.labelPackage}>No. of Carton</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                          {dataItem.total_carton}
                        </Text>
                      </View>
                        </>
                      )}
                      <View style={styles.dividerContent}>
                      <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                      <Text style={styles.labelPackage}>Pallet ID</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                      { this.state.isConfirm === true ? (  
                      <Text style={styles.infoPackage}>
                        {this.state.PalletArray.some((o)=>o.palete_id === this.state.ItemPallet) === true ? this.state.PalletArray.find((o)=>o.palete_id === this.state.ItemPallet)['pallet_no'] : null}
                        </Text>) 
                        :(  
                        <View style={[styles.infoElement,{flex:1}]}>
                        <SelectDropdown
                            buttonStyle={{width:'100%',maxHeight:25,borderRadius: 5, borderWidth:1, borderColor: '#ABABAB', backgroundColor:'white'}}
                            buttonTextStyle={{...styles.infoPackage,textAlign:'left',}}
                            data={this.state.PalletArray !== null ?this.state.PalletArray : [] }
                            defaultValueByIndex={0}
                            onSelect={(selectedItem, index) => {
                              this.setState({ItemPallet:selectedItem.palete_id});
                            }}
                            renderDropdownIcon={() => {
                              return (
                                <IconArrow66Mobile fill="#2D2C2C" height="26" width="26" style={{transform:[{rotate:'90deg'}]}} />
                              );
                            }}
                            dropdownIconPosition="right"
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
                        <>
                      <View style={styles.dividerContent}>
                      <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                      <Text style={styles.labelPackage}>Grade</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>{ this.props.ManifestType === 1 ? ( dataItem.rework === 0 ? 'SIT -> Buffer' : 'SIT-> Rework -> Buffer') : (dataItem.rework === 0 ? 'SIT-> Pick' : 'SIT-> Rework -> Pick')}</Text>
                    
                      </View>
                      <View style={styles.dividerContent}>
                      <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                      <Text style={styles.labelPackage}>UOM</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                        {dataItem.uom}
                        </Text>
                      </View>
                      {this.state.isConfirm !== true && (
                      <View style={styles.dividerContent}>
                        <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                          <Text style={styles.labelPackage}>Item Classification</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}>
                        {dataItem.product_class === 1 ? 'Normal Stock' :dataItem.product_class === 2 ? 'POSM' : dataItem.product_class === 3 ? 'Packaging Materials' :dataItem.product_class === 4 ? 'Samples' :'-'}
                        </Text>
                      </View>)}

                      </>)}

                      {this.state.isConfirm === true && (    
                      <View style={styles.dividerContent}>
                        <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignContent:'center'}}>                        
                          <Text style={styles.labelPackage}>QTY</Text>
                          <Text style={styles.dotLabel}>:</Text>
                        </View>
                        <Text style={styles.infoPackage}> {this.state.qty} </Text>
                        </View>
                        )}
                    </View>
                    {this.state.isConfirm !== true && (
                            <View style={[styles.sectionDividier,{flexDirection:dataItem.is_transit === 1 ? 'row' : 'column',marginTop:15,}]}>
                              <View style={[styles.dividerContent,dataItem.is_transit !== 1 ? {marginRight: 35, alignContent:'flex-start', justifyContent:'flex-start'} : {marginRight: 35,}]}>
                            <Text style={styles.qtyTitle}>{dataItem.is_transit === 1 ? 'Qty' : 'Document Qty'}</Text>
                          </View>
                          <View style={[styles.dividerInput,dataItem.is_transit !== 1 ? {justifyContent:'center', alignContent:'center', paddingHorizontal:40, marginVertical:0} : null]}>
                          <Badge value="-" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: 37}} onPress={()=>{
                           const {qty,dataItem} = this.state;
                            this.setState({qty: qty !== '' && qty > 0 ? qty-1 : qty === '' ? 0 : qty});
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          />
                          <Input 
                            containerStyle={{flex: 1,paddingVertical:0}}
                            keyboardType="number-pad"
                            inputContainerStyle={styles.textInput} 
                            inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.h4,fontWeight: '600',lineHeight: 27,color:'#424141'}]}
                            labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                            value={String(this.state.qty)}
                            onChangeText={(val)=>{
                              this.setState({qty:  val});
                            }}
                            />
                          <Badge value="+" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: 37}} onPress={()=>{
                            const {qty,dataItem} = this.state;
                            this.setState({qty:  qty !== '' ? qty+1: qty === '' ?  1 : qty});
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          />
                          </View>
                        </View>
                      )}
              </View>
            ) :  dataItem === null && this.state.multipleSKU === true ? (
              <View style={styles.sheetPackages}>
            <FlatList
              keyExtractor={ (item, index) => index.toString()}
              horizontal={false}
              data={this.state.filterMultipleSKU}
              renderItem={this.renderMultipleSKU.bind(this)}
            />
             </View>
            ) : dataItem !== null && this.state.enterAttr === true ? (
              <View style={styles.sheetPackages}>
              <View style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                      <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{...Mixins.small3, color:'red'}}>
                          {this.state.errorAttr}
                        </Text>
                      </View>
                        <TemplateText required={1} name="Batch#" ref={(ref)=>{
                            if(ref !== null)
                            this.refBatch.current = ref;
                          }}/>
                      {(this.state.dataItem.template !== undefined && this.state.dataItem.template !== null && this.state.dataItem.template.attributes !== undefined && this.state.dataItem.template.attributes !== null ) && this.state.dataItem.template.attributes.map((element,index)=>{
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
                  
                </View>
              </View>
            ) : this.state.dataItem !== null && this.state.isPOSM === true ? (
              <View style={[styles.sheetPackages,{justifyContent:'center',alignItems:'center'}]}>
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

                {/* <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/> */}
                <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B'}}>Take Photo</Text>
              </View>
            ): (
              <View style={styles.sheetPackages}>
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
            <View style={[styles.buttonSheetContainer,{alignItems:'flex-end',justifyContent:'flex-end',alignContent:'flex-end', backgroundColor:'transparent', flex:1}]}>
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
      qty : qty === '' ? 0 : qty,
      enterAttr : true,
      isConfirm: dataItem.is_transit === 1 ? true : false,
      isPOSM: false,
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
    if(this.state.dataItem.template !== undefined && this.state.dataItem.template !== null && this.state.dataItem.template.attributes !== undefined && this.state.dataItem.template.attributes !== null){
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
      <ScrollView style={styles.container}>
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
     
      </ScrollView>
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
    flexDirection:'column',
    flexShrink:1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:20,
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
    flexDirection:'column',
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
    width:screen.width -40,
    borderRadius:13,
    marginHorizontal: 32,
    marginTop: 20,
    marginBottom:20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    
    elevation: 4,
    backgroundColor:'white'
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
    paddingHorizontal:9,
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
    flex:1,
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
    borderRadius:13,
    padding:20,
    flexShrink: 1,
  },
  buttonSheetContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonSheet: {
    flexShrink: 1,
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
    paddingTop:20,
    paddingBottom:10,
    marginHorizontal:0,
    borderBottomColor:'#D5D5D5',
    borderBottomWidth:1,
  },
  modalHeaderText: {
    ...Mixins.h6,
    color: '#17B055',
    fontWeight:'400',
    lineHeight:27,
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
    ManifestType : state.originReducer.filters.currentManifestType,
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
    setItemError : (error)=>{
      return dispatch({type:'ManifestError', payload: error});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    addPOSMPostpone: (uri) => dispatch({type: 'POSMPostpone', payload: uri}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
