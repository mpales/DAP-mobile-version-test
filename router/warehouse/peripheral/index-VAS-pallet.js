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
ListItem
} from 'react-native-elements'
import SelectDropdown from 'react-native-select-dropdown';
import { Modalize } from 'react-native-modalize';
import BarCode from '../../../component/camera/filter-barcode';
import CheckmarkIcon from '../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import XMarkIcon from '../../../assets/icon/iconmonstr-x-mark-7mobile.svg';
import Mixins from '../../../mixins';
import moment from 'moment';
import {connect} from 'react-redux';
import MultipleSKUList from '../../../component/extend/ListItem-inbound-multiple-sku';
const screen = Dimensions.get('screen');
const grade = ["Pick", "Buffer", "Damage", "Defective", "Short Expiry", "Expired", "No Stock", "Reserve"];
const pallet = ["PLDAP 0091", "PLDAP 0092", "PLDAP 0093", "PLDAP 0094"];
class Example extends React.Component {
  animatedValue = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      qty: 0,
      scanItem: '0',
      dataItem: null,
      locationItem: null,
      confirmScanned:false,
      detectBarcodeToState: true,
    };
    this.handleResetAnimation.bind(this);
    this.handleZoomInAnimation.bind(this);
    this.renderBarcode.bind(this);
    this.renderInner.bind(this);
    this.onSubmit.bind(this);
    this.onGoToList.bind(this);
    this.modalizeRef = React.createRef();
  }

  static getDerivedStateFromProps(props,state){
    const {VASList, currentASN, navigation, setBarcodeScanner, detectBarcode} = props;
    const {dataCode, dataItem, scanItem} = state;
    const {routes, index} = navigation.dangerouslyGetState();
    if(scanItem === '0'){
      if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined) {
        setBarcodeScanner(true);
        let item = VASList.find((element)=>element.number === routes[index].params.inputCode);  
        return {...state, scanItem: routes[index].params.inputCode, locationItem: item.ref, detectBarcodeToState: true};
      } 
      return {...state, detectBarcodeToState: true};
    } 
    return {...state, detectBarcodeToState: detectBarcode};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.dataCode !== '0' && nextState.scanItem !== null && nextProps.detectBarcode === false && nextState.dataItem === null){
      if(nextState.dataCode === nextState.scanItem) {
        return true;
      } else if (nextState.dataCode !== nextState.scanItem){
        nextProps.setBarcodeScanner(true);
        return false;
      }
    }
     return true;
   }
  componentDidUpdate(prevProps, prevState) {
    const {VASList,detectBarcode, currentASN, navigation, setBarcodeScanner} = this.props;
    const {dataCode,scanItem, dataItem} = this.state;
    if(prevProps.detectBarcode !== detectBarcode){
      if(detectBarcode) {
      
      } else {
        this.props.setItemScanned(scanItem);
        this.props.navigation.navigate(  {
          name: 'ItemVASDetail',
          params: {
            bayScanned : true,
            dataCode : scanItem,
          },
        });
      }
    }
 
    if (dataCode === scanItem && dataCode !== 0 && dataItem === null && VASList.some((element) => element.number === dataCode)) {
        let foundIndex = VASList.filter((element) => element.number === dataCode);
        let indexItem = VASList.findIndex((element)=>element.number === dataCode);
        let item = VASList.find((element)=>element.number === dataCode);  
        this.props.setBarcodeScanner(false);
        this.setState({dataItem: item, indexItem: indexItem});
    }
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
  renderInner = () => (
    <View style={styles.sheetContainer}>
      <View style={styles.sectionSheetDetail}>
        <View style={styles.sheetPackages}>
            <View style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>{this.state.scanItem}</Text>
                </View>
                <View style={styles.dividerContent}>
                  <Text style={styles.labelNotFound}>Location</Text>
                  <Text style={styles.infoNotFound}>{this.state.locationItem}</Text>
                </View>
            </View>
            
        </View>
        <View style={[styles.buttonSheet,{marginVertical:40}]}>
        <Button
          containerStyle={{flex:1, marginTop: 10,marginRight: 5,}}
          buttonStyle={styles.cancelButton}
                      titleStyle={styles.reportText}
          onPress={() => {
            this.props.setBottomBar(false);
            this.props.navigation.navigate({
              name: 'ReportManifest',
              params: {
                  dataCode: this.state.scanItem,
                  submitPhoto: false,
              }
            })}}
          title="Report"
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
  onGoToList = ()=>{
    this.props.setBarcodeScanner(true);
    this.props.navigation.navigate('Manifest');
  }
  onSubmit = () => {
    const {dataCode,qty, scanItem, ItemGrade} = this.state;
    this.setState({confirmScanned : true});
  }

  render() {
    const { dataItem,dataCode, detectBarcodeToState} = this.state;
    const {detectBarcode} = this.props;
    return (
      <View style={styles.container}>
        <Modalize 
          ref={this.modalizeRef}
          handleStyle={{width: '30%', backgroundColor: '#C4C4C4', borderRadius: 0}}
          handlePosition={'inside'}
          disableScrollIfPossible={true}
          modalHeight={200}
          alwaysOpen={200}
          HeaderComponent={<this.renderHeader />}
        >
          <this.renderInner />
        </Modalize>
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
  modalContainerAll: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 40) / 100,
    maxHeight: (screen.height * 40) / 100,
    borderRadius: 10,
  },
  modalContainerSmall: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 40) / 100,
    maxHeight: (screen.height * 40) / 100,
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
    VASList: state.originReducer.VASList,
    keyStack: state.originReducer.filters.keyStack,
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
      return dispatch({type: 'activeVAS', payload: item});
    },
    setItemGrade : (grade)=>{
      return dispatch({type:'BarcodeGrade', payload: grade});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
