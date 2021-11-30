import React from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Divider, Overlay} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import Barcode from '../../../../component/camera/filter-barcode';
//style
import Mixins from '../../../../mixins';
// icon
import XMarkIcon from '../../../../assets/icon/iconmonstr-x-mark-7mobile.svg';

const screen = Dimensions.get('window');

class BarcodeCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowOverlay: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setBarcodeScanner(true);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  renderBarcode = async (barcode) => {
    if (barcode.length > 0 && barcode[0].data !== '') {
      if (this.props.route.params?.relocateTo === true) {
        // need to fetch get barcode data and if failed show modal
        // this.setState({
        //   isShowOverlay: true,
        //   canDetectBarcode: false,
        // });
        this.props.navigation.navigate('RelocationRequestConfirm', {
          barcodeResult: barcode[0].data,
        });
      } else {
        this.props.navigation.navigate('RelocationScanResult', {
          barcodeResult: barcode[0].data,
        });
      }
    }
  };

  handleShowOverlay = () => {
    this.props.setBarcodeScanner(!this.state.isShowOverlay === false);
    this.setState({
      canDetectBarcode: !this.state.isShowOverlay === false ? true : false,
      isShowOverlay: !this.state.isShowOverlay,
    });
  };

  render() {
    const {isShowOverlay, canDetectBarcode} = this.state;
    console.log('asdfafasd', canDetectBarcode);
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Barcode renderBarcode={this.renderBarcode} />
        <Overlay isVisible={isShowOverlay} overlayStyle={{borderRadius: 13}}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <XMarkIcon height="24" width="24" fill="#E03B3B" />
              <Text style={[styles.modalHeaderText, {color: '#E03B3B'}]}>
                Barcode Not Found
              </Text>
            </View>
            <Divider color="#D5D5D5" style={{marginBottom: 20}} />
            <View style={styles.buttonSheetContainer}>
              <View style={styles.buttonSheet}>
                <Button
                  containerStyle={{
                    flex: 1,
                    marginTop: 10,
                    marginRight: 5,
                  }}
                  buttonStyle={styles.cancelButton}
                  titleStyle={styles.backText}
                  onPress={this.handleShowOverlay}
                  title="Try Again"
                />
              </View>
            </View>
          </View>
        </Overlay>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flexShrink: 1,
    backgroundColor: 'white',
    width: (screen.width * 85) / 100,
    borderRadius: 13,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalHeaderText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#17B055',
    marginLeft: 10,
  },
  buttonSheetContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonSheet: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  backText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#FFF',
  },
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BarcodeCamera);
