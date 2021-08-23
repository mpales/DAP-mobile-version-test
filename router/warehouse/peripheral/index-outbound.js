import React from 'react';
import {
  Animated,
  StyleSheet,
  Easing,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import {
Button,
Input,
Badge, 
Divider
} from 'react-native-elements'
import { Modalize } from 'react-native-modalize';
import BarCode from '../../../component/camera/filter-barcode';
import CheckmarkIcon from '../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import XMarkIcon from '../../../assets/icon/iconmonstr-x-mark-7mobile.svg';
import Mixins from '../../../mixins';
import moment from 'moment';
import {connect} from 'react-redux';
const screen = Dimensions.get('screen');

class Example extends React.Component {
  animatedValue = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      qty: 0,
      dataItem: null,
      bayCode : null,
      itemCode : null,
      scanItem: null,
    };
    this.handleResetAnimation.bind(this);
    this.handleZoomInAnimation.bind(this);
    this.renderBarcode.bind(this);
    this.modalizeRef = React.createRef();
  }

  static getDerivedStateFromProps(props,state){
    const {outboundList, currentASN, navigation, setBarcodeScanner, detectBarcode} = props;
    const {dataCode, dataItem, bayCode, itemCode, scanItem} = state;
    const {routes, index} = navigation.dangerouslyGetState();
    if(bayCode === null){
      if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined) {
        //from input code
        setBarcodeScanner(true);
        let item = outboundList.find((element)=>element.barcode === routes[index].params.inputCode && element.location_bay === routes[index].params.bayCode);
        return {...state, bayCode: routes[index].params.bayCode, dataItem: item, qty: item.scanned};
      } else if (routes[index].params !== undefined && routes[index].params.manualCode !== undefined) {
        //from manual code
        setBarcodeScanner(false);
        let item = outboundList.find((element)=>element.barcode === routes[index].params.manualCode && element.location_bay === routes[index].params.bayCode);
        return {...state, dataCode: routes[index].params.bayCode,bayCode: routes[index].params.bayCode, dataItem: item, itemCode : routes[index].params.manualCode, qty: item.scanned};
      }
    } else if(bayCode !== null && scanItem !== null && itemCode === null && routes[index].params !== undefined && routes[index].params.manualCode !== undefined && scanItem === routes[index].params.manualCode) {
      setBarcodeScanner(false);
      let item = outboundList.find((element)=>element.barcode === routes[index].params.manualCode && element.location_bay === routes[index].params.bayCode);
      return {...state, dataCode: routes[index].params.bayCode,bayCode: routes[index].params.bayCode, dataItem: item, itemCode : routes[index].params.manualCode, qty: item.scanned};

    }
    return {...state};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.dataCode !== '0' && nextState.bayCode !== null && nextState.scanItem === null && nextProps.detectBarcode === false){
      if(nextState.dataCode === nextState.bayCode) {
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        this.setState({dataCode: '0', scanItem:  routes[index].params.inputCode});
        return true;
      } else if (nextState.dataCode !== nextState.bayCode){
        nextProps.setBarcodeScanner(true);
        return false;
      }
    }else if(nextState.dataCode !== '0' && nextState.bayCode !== null && nextState.scanItem !== null && nextState.itemCode === null && nextProps.detectBarcode === false){
      if(nextState.dataCode === nextState.scanItem) {
       this.setState({dataCode: '0',itemCode : nextState.scanItem});
       return true;
      } else if (nextState.dataCode !== nextState.itemCode){
        nextProps.setBarcodeScanner(true);
        return false;
      }
    }
 
     return true;
   }
  componentDidUpdate(prevProps, prevState) {
    const {outboundList,detectBarcode, currentASN, navigation, setBarcodeScanner} = this.props;
    const {dataCode, dataItem} = this.state;
    if(prevProps.detectBarcode !== detectBarcode){
      if(detectBarcode) {
        this.handleResetAnimation();
      } else {
        this.handleZoomInAnimation();
      }
    }
    
  }
  handleResetAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 0,
    }).reset();
  };
  handleZoomInAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  renderModal = () => {
    const {dataItem, dataCode, qty, itemCode} = this.state;
    return (
      <View style={styles.modalOverlay}>
        <Animated.View
          style={
            itemCode !== null
              ? [
                  styles.modalContainerAll,
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
            <CheckmarkIcon height="24" width="24" fill="#17B055" />
              {itemCode !== null ? (
                <Text style={styles.modalHeaderText}>
                Success Scan Item                
                </Text>
              ) : (
                <Text style={styles.modalHeaderText}>
                Success Scan Bay           
                </Text>
              )}
            </View>
            <Divider color="#D5D5D5" />
            {itemCode !== null ? (
              <View style={[styles.sheetPackages,{marginHorizontal: 32, marginTop: 20}]}>
               <View style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
               <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>SKU</Text>
                  <Text style={styles.infoNotFound}>{dataItem.sku}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Barcode</Text>
                  <Text style={styles.infoNotFound}>{dataItem.barcode}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Descript</Text>
                  <Text style={styles.infoNotFound}>{dataItem.description}</Text>
                </View>
                <View style={[styles.groupDivider, {flexDirection: 'row'}]}>
                  <View style={[styles.sectionDividier, {flex:1}]}>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>Stock Grade</Text>
                      <Text style={styles.infoNotFound}>{dataItem.grade}</Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>UOM</Text>
                      <Text style={styles.infoNotFound}>{dataItem.UOM}</Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>Packaging</Text>
                      <Text style={styles.infoNotFound}>{dataItem.packaging}</Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>Category</Text>
                      <Text style={styles.infoNotFound}>{dataItem.category}</Text>
                    </View>
                  </View>
                  <View style={styles.sectionDividier, {flex: 1}}>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>Banch Number</Text>
                      <Text style={styles.infoNotFound}>A1</Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>EXP Date</Text>
                      <Text style={styles.infoNotFound}></Text>
                    </View>
                  </View>
                </View>
                     
                    </View>
                    {dataItem.scanned < dataItem.total_qty && (
                        <View style={[styles.sectionDividier,{flexDirection:'row',marginTop:15}]}>
                          <View style={[styles.dividerContent,{marginRight: 35}]}>
                            <Text style={styles.qtyTitle}>Qty</Text>
                          </View>
                          <View style={styles.dividerInput}>
                          <Badge value="+" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: 37}} onPress={()=>{
                         this.setState({qty:  qty < dataItem.total_qty ? qty+1: qty});
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          />
                          <Input 
                            containerStyle={{flex: 1,paddingVertical:0}}
                            inputContainerStyle={styles.textInput} 
                            inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.h4,fontWeight: '600',lineHeight: 27,color:'#424141'}]}
                            labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                            placeholder={''+qty}
                            disabled={true}
                            />
                           <Badge value="-" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: 37}} onPress={()=>{
                           this.setState({qty: dataItem.total_qty >= qty && qty > 0 ? qty-1 : qty});
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          />
                          </View>
                        </View>
                      )}
              </View>
            ) : (
              <View style={[styles.sheetPackages,{marginHorizontal: 32, marginTop: 20}]}>
               <View style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
               <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Location</Text>
                  <Text style={styles.infoNotFound}>{dataItem.location_bay}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}></Text>
                  <Text style={styles.infoNotFound}>{dataItem.location_rack.join(', ')}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>SKU</Text>
                  <Text style={styles.infoNotFound}>{dataItem.sku}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Barcode</Text>
                  <Text style={styles.infoNotFound}>{dataItem.barcode}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Descript</Text>
                  <Text style={styles.infoNotFound}>{dataItem.description}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Category</Text>
                  <Text style={styles.infoNotFound}>{dataItem.category}</Text>
                </View>
                </View>
              </View>
            )}
            <View style={[styles.buttonSheetContainer, {marginTop: 20}]}>
                 <View style={styles.buttonSheet}>
                  {itemCode !== null ? (
                    <Button
                      containerStyle={{flex: 1, marginTop: 10}}
                      buttonStyle={styles.navigationButton}
                      titleStyle={styles.deliveryText}
                      onPress={() => this.onSubmit()}
                      title="Confirm"
                    />
                  ) : ( <Button
                    containerStyle={{flex: 1, marginTop: 10}}
                    buttonStyle={styles.navigationButton}
                    titleStyle={styles.deliveryText}
                    onPress={() => {
                      this.props.setBarcodeScanner(true);
                    }}
                    title="Scan item"
                  />)}
                </View>
              <View style={styles.buttonSheet}>
              <Button
                      containerStyle={{flex: 1, marginTop: 10, marginRight: 5}}
                      buttonStyle={styles.cancelButton}
                      titleStyle={styles.backText}
                      onPress={()=>this.props.navigation.goBack()}
                      title="Back"
                    />
              <Button
                      containerStyle={{flex: 1, marginTop: 10, marginLeft: 5}}
                      buttonStyle={styles.cancelButton}
                      titleStyle={styles.reportText}
                      onPress={() => {
                        this.props.setBottomBar(true);
                        this.props.navigation.navigate({
                          name: 'ReportManifest',
                          params: {
                            dataCode: this.state.dataItem.barcode,
                            bayCode: this.state.dataItem.location_bay
                        }
                        })}}
                      title="Report Item"
                    />
                   
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
                {this.state.scanItem !== null ? (<>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>SKU</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.sku}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Barcode</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.barcode}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Descript</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.description}</Text>
                </View>
                <View style={[styles.groupDivider, {flexDirection: 'row'}]}>
                  <View style={[styles.sectionDividier, {flex:1}]}>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>Stock Grade</Text>
                      <Text style={styles.infoNotFound}>{this.state.dataItem.grade}</Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>UOM</Text>
                      <Text style={styles.infoNotFound}>{this.state.dataItem.UOM}</Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>Packaging</Text>
                      <Text style={styles.infoNotFound}>{this.state.dataItem.packaging}</Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>Category</Text>
                      <Text style={styles.infoNotFound}>{this.state.dataItem.category}</Text>
                    </View>
                  </View>
                  <View style={styles.sectionDividier, {flex: 1}}>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>Banch Number</Text>
                      <Text style={styles.infoNotFound}>A1</Text>
                    </View>
                    <View style={styles.dividerContent}>
                      <Text style={styles.labelNotFound}>EXP Date</Text>
                      <Text style={styles.infoNotFound}></Text>
                    </View>
                  </View>
                </View>

                </>): this.state.dataItem !== null ? (
                <><View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Location</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.location_bay}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}></Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.location_rack.join(', ')}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>SKU</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.sku}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Barcode</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.barcode}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Descript</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.description}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Category</Text>
                  <Text style={styles.infoNotFound}>{this.state.dataItem.category}</Text>
                </View></>) : null}
            </View>
            
        </View>
        <View style={[styles.buttonSheet,{marginVertical:10}]}>
        
        {this.state.scanItem !== null ? (<><Button
          containerStyle={{flex:1, marginTop: 10,marginRight: 5,}}
          buttonStyle={styles.cancelButton}
                      titleStyle={styles.reportText}
          onPress={() => {
            this.props.setBottomBar(true);
            this.props.navigation.navigate({
              name: 'ReportManifest',
              params: {
                dataCode: this.state.dataItem.barcode,
                bayCode: this.state.dataItem.location_bay
            }
            })}}
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
                  dataCode: this.state.dataItem.barcode,
                  bayCode: this.state.dataItem.location_bay
              }
            })}}
          title="Input Manual"
        /></>) : (<Button
          containerStyle={{flex:1, marginTop: 0}}
          buttonStyle={styles.cancelButton}
                      titleStyle={styles.reportText}
          onPress={() => {
            this.props.setBottomBar(true);
            this.props.navigation.navigate({
              name: 'ReportManifest',
              params: {
                dataCode: this.state.dataItem.barcode,
                bayCode: this.state.dataItem.location_bay
            }
            })}}
          title="Report Item"
        />)}
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
    const {dataCode,qty, dataItem} = this.state;
    this.props.setBarcodeScanner(true);
    this.setState({
      dataCode: '0',
    });
    // for prototype only
    let arr = this.makeScannedItem(dataItem.barcode,qty);
    this.props.setItemScanned(arr);
    this.props.setItemIDScanned(dataItem.id);
    this.props.setBottomBar(false);
    this.props.navigation.navigate('List');
  }

  render() {
    const { dataItem,dataCode } = this.state;
    const {detectBarcode} = this.props;
    return (
      <View style={styles.container}>
        {detectBarcode === false ? (
          <this.renderModal/>
        ) : (          <Modalize 
          ref={this.modalizeRef}
          handleStyle={{width: '30%', backgroundColor: '#C4C4C4', borderRadius: 0}}
          handlePosition={'inside'}
          disableScrollIfPossible={true}
          modalHeight={this.state.scanItem !== null ? 320 : 280}
          alwaysOpen={this.state.scanItem !== null ? 320 : 280}
          HeaderComponent={<this.renderHeader />}
        >
          <this.renderInner />
        </Modalize>)}
        <TouchableWithoutFeedback onPress={() => {}}>
          <BarCode renderBarcode={this.renderBarcode} navigation={this.props.navigation} />
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
    minWidth: 100,
    ...Mixins.small1,
    color: '#2D2C2C',
    fontWeight: '500',
    lineHeight: 18,
  },
  infoNotFound: {
    paddingHorizontal: 10,
    ...Mixins.small1,
    color: '#424141',
    fontWeight: '400',
    lineHeight: 18,
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
  modalContainerAll: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 65) / 100,
    maxHeight: (screen.height * 65) / 100,
    borderRadius: 10,
  },
  modalContainerSmall: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 50) / 100,
    maxHeight: (screen.height * 50) / 100,
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
    outboundList: state.originReducer.outboundList,
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    setItemIDScanned : (id) => {
      return dispatch({type: 'ListIDScanned', payload: id});
    },
    setItemScanned : (item) => {
      return dispatch({type: 'BarcodeScanned', payload: item});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
