import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import {
Button,
Input,
Badge
} from 'react-native-elements'
import { Modalize } from 'react-native-modalize';
import BarCode from '../../../component/camera/filter-barcode';
import Mixins from '../../../mixins';
import {connect} from 'react-redux';
const screen = Dimensions.get('screen');

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
    };
    this.renderBarcode.bind(this);
    this.modalizeRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevStates) {
    if(prevProps.route !== this.props.route) {
      this.setState({
        dataCode: this.props.route.params.inputCode,
      });
    }
  }

  renderInner = () => (
    <View style={styles.sheetContainer}>
      <View style={styles.sectionSheetDetail}>
        <View style={styles.sheetPackages}>
            <View style={styles.sectionDividier}>
              <View style={styles.dividerContent}>
                <Text style={styles.labelPackage}>BARCODE NUMBER</Text>
                <Text style={styles.infoPackage}>EBV 2BL - TL</Text>
              </View>
              <View style={styles.dividerContent}>
                <Text style={styles.labelPackage}>SKU</Text>
                <Text style={styles.infoPackage}>ISO00012345</Text>
              </View>
            </View>
            <View style={styles.sectionDividier}>
              <View style={styles.dividerContent}>
                <Text style={styles.labelPackage}>Description</Text>
                <Text style={styles.infoPackage}>ERGOBLOM V2 BLUE DESK TOP/SHELF</Text>
              </View>
          
            </View>
            <View style={styles.sectionDividier}>
              <View style={styles.dividerContent}>
                <Text style={styles.labelPackage}>Stock Grade</Text>
                <Text style={styles.infoPackage}>01</Text>
              </View>
              <View style={styles.dividerContent}>
                <Text style={styles.labelPackage}>Packaging</Text>
                <Text style={styles.infoPackage}>PC 1 of 6</Text>
              </View>
            </View>
            <View style={styles.sectionDividier}>
              <View style={styles.dividerContent}>
                <Text style={styles.labelPackage}>Quanity to pick</Text>
                <Text style={styles.infoPackage}>1.000</Text>
              </View>
              <View style={styles.dividerContent}>
                <Text style={styles.labelPackage}>Whole Quantity</Text>
                <Text style={styles.infoPackage}>1 Pallet</Text>
              </View>
            </View>
            <View style={styles.sectionDividier}>
              <View style={styles.dividerContent}>
                <Text style={styles.deliverTitle}>Qty</Text>
              </View>
              <View style={styles.dividerInput}>
              <Badge value="+" status="error" containerStyle={{paddingVertical:6}} />
              <Input 
                containerStyle={{flex: 1,paddingVertical:0}}
                inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                placeholder="0"
                />
                <Badge value="-" status="error" containerStyle={{paddingVertical:6}} />
              </View>
            </View>
        </View>
        <View style={styles.buttonSheet}>
        {this.props.barcodeScanned.includes(this.state.dataCode) && this.state.dataCode !== '0' &&
        (<Button
          containerStyle={{flex:1, marginTop: 10,}}
          buttonStyle={styles.navigationButton}
          titleStyle={styles.deliveryText}
          onPress={() => this.onSubmit()}
          title="Confirm"
        />)}
        
        </View>
        <View style={styles.buttonSheet}>
        <Button
          containerStyle={{flex:1, marginTop: 10,marginRight: 5,}}
          buttonStyle={styles.navigationButton}
          titleStyle={styles.deliveryText}
          onPress={() => {
            this.props.setBottomBar(true);
            this.props.navigation.navigate('ReportManifest')}}
          title="Report Item"
        />
          <Button
          containerStyle={{flex:1, marginTop: 10,marginLeft:5,}}
          buttonStyle={styles.navigationButton}
          titleStyle={styles.deliveryText}
          onPress={() => {
            this.props.setBottomBar(true);
            this.props.navigation.navigate('ManualInput')}}
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

  onSubmit = () => {
    this.props.setBarcodeScanner(true);
    this.setState({
      dataCode: '0',
    });
    // for prototype only
    (this.props.barcodeScanned.length > 0)
     ? this.props.barcodeScanned.push(this.props.barcodeScanned[this.props.barcodeScanned.length - 1] + 1)
     : this.props.barcodeScanned.push(0);
    // end
    this.props.setBottomBar(false); 

    this.props.navigation.navigate('List',{
      confirm: true,
    });
  }

  render() {
    const { dataCode } = this.state;
    return (
      <View style={styles.container}>
          <Modalize 
            ref={this.modalizeRef}
            handleStyle={{width: '30%', backgroundColor: '#C4C4C4', borderRadius: 0}}
            handlePosition={'inside'}
            disableScrollIfPossible={true}
            modalHeight={500}
            alwaysOpen={500}
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
    maxHeight: 30,
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
    flexDirection: 'row',
  },
  dividerContent: {
    flexDirection: 'column',
    flex: 1,
    marginVertical: 8,
  },
  dividerInput: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 8,
  },
  
  labelPackage: {
    ...Mixins.subtitle3,
    color: '#000000',
    fontWeight: '700'
  },
  infoPackage: {
    ...Mixins.subtitle3,
    fontWeight: '400',
    lineHeight: 21,
    color: '#ABABAB',
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
  buttonSheet: {
    flexGrow: 1,
    flexDirection:'row',
  },
  deliverTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
  },
  deliverText: {
    fontSize: 20,
    lineHeight: 40,
  },
});

function mapStateToProps(state) {
  return {
    ManifestCompleted: state.originReducer.filters.manifestCompleted,
    detectBarcode: state.originReducer.filters.isBarcodeScan,
    // for prototype only
    barcodeScanned: state.originReducer.barcodeScanned,
    // end
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
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
