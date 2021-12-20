import React from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Divider, Overlay} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import Barcode from '../../../../component/camera/filter-barcode';
import Banner from '../../../../component/banner/banner';
import {TextList, CustomTextList} from '../../../../component/extend/Text-list';
// helper
import {getData, putData} from '../../../../component/helper/network';
import {productGradeToString} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';
// icon
import CheckmarkIcon from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';

const screen = Dimensions.get('window');

class ConfirmRelocationBarcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocationId: this.props.route.params?.relocationId ?? null,
      relocationDetails: null,
      errorMessage: '',
      isLoading: true,
      isShowSuccessOverlay: false,
      isSubmitting: false,
    };
  }

  componentDidMount() {
    this.getRelocationJobDetails();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setBarcodeScanner(true);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getRelocationJobDetails = async () => {
    const {relocationId} = this.state;
    if (relocationId === null) return;
    const result = await getData(
      `/stocks/stock-relocations/${relocationId}/details`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        relocationDetails: result,
      });
    } else if (result.error !== undefined) {
      this.setState({
        errorMessage: result.error,
      });
    }
    this.setState({isLoading: false});
  };

  confirmRelocation = async () => {
    this.setState({
      isSubmitting: true,
    });
    const {relocationId} = this.state;
    const result = await putData(
      `/stocks-mobile/stock-relocations/${relocationId}/confirm-relocation`,
    );
    if (typeof result === 'object' && result.message === 'Relocation Success') {
      this.handleShowSuccessOverlay();
    } else {
      if (result.error !== undefined) {
        this.setState({
          errorMessage: result.error,
        });
      } else if (typeof result === 'string') {
        this.setState({
          errorMessage: result,
        });
      }
    }
    this.setState({
      isSubmitting: false,
    });
  };

  renderBarcode = async (barcode) => {
    if (barcode.length > 0 && barcode[0].data !== '') {
      this.confirmRelocation();
    }
  };

  handleShowSuccessOverlay = () => {
    const {isShowSuccessOverlay} = this.state;
    this.props.setBarcodeScanner(!isShowSuccessOverlay === false);
    this.setState({
      canDetectBarcode: !isShowSuccessOverlay === false ? true : false,
      isShowSuccessOverlay: !isShowSuccessOverlay,
    });
  };

  navigateToRelocationJobList = () => {
    this.props.setBottomBar(true);
    this.props.navigation.navigate('RelocationList');
  };

  closeBanner = () => {
    this.setState({
      errorMessage: '',
    });
    this.props.setBarcodeScanner(true);
  };

  render() {
    const {errorMessage, isShowSuccessOverlay, isLoading, relocationDetails} =
      this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Barcode renderBarcode={this.renderBarcode} />
        {!isLoading && errorMessage !== '' && (
          <View style={{position: 'absolute', top: 50, left: 0, right: 0}}>
            <Banner
              title={errorMessage}
              backgroundColor="#F07120"
              closeBanner={this.closeBanner}
            />
          </View>
        )}
        {!isLoading && (
          <Overlay
            overlayStyle={{borderRadius: 10, padding: 0}}
            isVisible={isShowSuccessOverlay}>
            <View
              style={{
                flexShrink: 1,
                width: screen.width * 0.9,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#ABABAB',
                  paddingVertical: 15,
                }}>
                <CheckmarkIcon height="24" width="24" fill="#17B055" />
                <Text
                  style={{
                    ...Mixins.subtitle3,
                    fontSize: 18,
                    lineHeight: 25,
                    marginLeft: 10,
                    color: '#17B055',
                  }}>
                  Relocation Successful
                </Text>
              </View>
              <View style={{padding: 20}}>
                <Text style={styles.cardTitle}>New Location</Text>
                {relocationDetails.productStorageFroms.length > 1 && (
                  <TextList
                    title="Warehouse"
                    value={relocationDetails.warehouseNameTo}
                  />
                )}
                <TextList
                  title="Location"
                  value={relocationDetails.locationTo}
                />
                {!(relocationDetails.productStorageFroms.length > 1) && (
                  <>
                    <TextList
                      title="Item Code"
                      value={
                        relocationDetails.productStorageFroms[0].product
                          .item_code
                      }
                    />
                    <TextList
                      title="Description"
                      value={
                        relocationDetails.productStorageFroms[0].product
                          .description
                      }
                    />
                    <TextList
                      title="UOM"
                      value={
                        relocationDetails.productStorageFroms[0].productUom
                          .packaging
                      }
                      isBold={true}
                    />
                  </>
                )}
                <CustomTextList
                  title="Destination Grade"
                  value={productGradeToString(relocationDetails.gradeTo)}
                />
                <Button
                  title="Back To List"
                  titleStyle={styles.buttonText}
                  buttonStyle={[
                    styles.button,
                    {marginHorizontal: 0, marginTop: 20},
                  ]}
                  onPress={this.navigateToRelocationJobList}
                />
              </View>
            </View>
          </Overlay>
        )}
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
  cardTitle: {
    ...Mixins.subtitle1,
    fontSize: 18,
    lineHeight: 25,
    color: '#2A3386',
    marginBottom: 5,
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmRelocationBarcode);
