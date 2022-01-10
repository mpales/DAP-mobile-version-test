import React from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Divider, Overlay} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
// component
import Barcode from '../../../../component/camera/filter-barcode';
import {TextList, CustomTextList} from '../../../../component/extend/Text-list';
// helper
import {getData, putData} from '../../../../component/helper/network';
import {productGradeToString} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';
// icon
import XMarkIcon from '../../../../assets/icon/iconmonstr-x-mark-7mobile.svg';
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
    this.modalizeRef = React.createRef();
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
    const {relocationDetails} = this.state;
    if (barcode.length > 0 && barcode[0].data !== '') {
      if (barcode[0].data === relocationDetails.locationTo) {
        this.confirmRelocation();
      } else {
        this.setState({
          errorMessage: 'Location Id is not match',
        });
      }
    }
  };

  handleRescan = () => {
    this.props.setBarcodeScanner(true);
    this.setState({
      errorMessage: '',
    });
  };

  handleShowSuccessOverlay = () => {
    const {isShowSuccessOverlay} = this.state;
    this.props.setBarcodeScanner(false);
    this.setState({
      isShowSuccessOverlay: !isShowSuccessOverlay,
    });
  };

  navigateToRelocationJobList = () => {
    this.props.setBottomBar(true);
    this.props.navigation.navigate('RelocationList');
  };

  navigateToManualInput = () => {
    this.props.navigation.navigate('ManualInput', {
      relocationId: this.state.relocationId,
    });
  };

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  renderInner = () => {
    const {relocationDetails} = this.state;
    return (
      <View style={styles.sheetContainer}>
        <View style={styles.sheetDetail}>
          <TextList
            title="Warehouse"
            value={!!relocationDetails ? relocationDetails.warehouseNameTo : ''}
          />
          <TextList
            title="Location"
            value={!!relocationDetails ? relocationDetails.locationTo : ''}
          />
          <CustomTextList
            title="Destination Grade"
            value={
              !!relocationDetails
                ? productGradeToString(relocationDetails.gradeTo)
                : ''
            }
          />
        </View>
        <Button
          title="Manual Input"
          titleStyle={styles.buttonText}
          buttonStyle={styles.button}
          onPress={this.navigateToManualInput}
        />
      </View>
    );
  };

  render() {
    const {errorMessage, isShowSuccessOverlay, isLoading, relocationDetails} =
      this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Barcode renderBarcode={this.renderBarcode} />
        <BottomSheet
          ref={this.modalizeRef}
          initialSnap={1}
          snapPoints={[30, 190]}
          enabledBottomClamp={false}
          enabledContentTapInteraction={false}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          enabledInnerScrolling={false}
          enabledBottomInitialAnimation={false}
        />
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
        <Overlay
          isVisible={errorMessage !== '' && isShowSuccessOverlay === false}
          overlayStyle={{borderRadius: 13}}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <XMarkIcon height="24" width="24" fill="#E03B3B" />
              <Text style={[styles.modalHeaderText, {color: '#E03B3B'}]}>
                Confirm Failed
              </Text>
            </View>
            <Divider color="#D5D5D5" style={{marginBottom: 20}} />
            <View style={{paddingHorizontal: 10}}>
              <Text style={[styles.modalHeaderText, {color: '#E03B3B'}]}>
                {errorMessage}
              </Text>
            </View>
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
                  onPress={this.handleRescan}
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
  header: {
    backgroundColor: 'white',
    height: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0,
    marginBottom: -1,
    borderBottomColor: 'white',
    borderBottomWidth: 0,
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  panelHandle: {
    width: 120,
    height: 7,
    backgroundColor: '#C4C4C4',
  },
  sheetContainer: {
    backgroundColor: 'white',
  },
  sheetDetail: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
