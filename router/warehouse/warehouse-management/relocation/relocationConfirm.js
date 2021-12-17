import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Card, Overlay} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {TextList, CustomTextList} from '../../../../component/extend/Text-list';
import Banner from '../../../../component/banner/banner';
import Loading from '../../../../component/loading/loading';
// helper
import {getData, putData} from '../../../../component/helper/network';
import Format from '../../../../component/helper/format';
import {
  productGradeToString,
  reasonCodeToString,
} from '../../../../component/helper/string';
// style
import Mixins from '../../../../mixins';
// icon
import CheckmarkIcon from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import ArrowDown from '../../../../assets/icon/arrow_down_relocation.svg';
import ChevronDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
import ChevronUp from '../../../../assets/icon/iconmonstr-arrow-66mobile-4.svg';

const window = Dimensions.get('window');

class RelocationConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocationId: this.props.route.params?.relocationId ?? null,
      relocationDetails: null,
      showOverlay: false,
      errorMessage: '',
      isLoading: true,
      isSubmitting: false,
      isExpanded: false,
    };
  }

  componentDidMount() {
    this.getRelocationJobDetails();
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
      this.handleShowOverlay(true);
    } else if (result.error !== undefined) {
      this.setState({
        errorMessage: result.error,
      });
    } else if (typeof result === 'string') {
      this.setState({
        errorMessage: result,
      });
    }
    this.setState({
      isSubmitting: false,
    });
  };

  handleShowOverlay = (value) => {
    this.setState({
      showOverlay: value ?? false,
    });
  };

  handleExpanded = () => {
    this.setState({isExpanded: !this.state.isExpanded});
  };

  navigateToRelocationJobList = () => {
    this.handleShowOverlay();
    this.props.setBottomBar(true);
    this.props.navigation.navigate('RelocationList');
  };

  closeBanner = () => {
    this.setState({
      errorMessage: '',
    });
  };

  navigateToItemDetails = () => {
    this.props.navigation.navigate('RelocationItemDetails', {
      relocationDetails: this.state.relocationDetails,
    });
  };

  render() {
    const {
      errorMessage,
      isLoading,
      isSubmitting,
      relocationDetails,
      isExpanded,
    } = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {!isLoading && errorMessage !== '' && (
          <Banner
            title={errorMessage}
            backgroundColor="#F07120"
            closeBanner={this.closeBanner}
          />
        )}
        {isLoading && relocationDetails === null ? (
          <Loading />
        ) : (
          <>
            <ScrollView
              style={styles.body}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Relocate From</Text>
              <TouchableWithoutFeedback
                onPress={
                  !(relocationDetails.productStorageFroms.length > 1)
                    ? this.handleExpanded
                    : null
                }>
                <Card
                  containerStyle={[styles.cardContainer, {marginBottom: 0}]}>
                  <View style={styles.spaceBetween}>
                    <TextList
                      title="Warehouse"
                      value={relocationDetails.warehouseNameFroms[0]}
                    />
                    {!(relocationDetails.productStorageFroms.length > 1) && (
                      <>
                        {isExpanded ? (
                          <ChevronUp fill="#2D2C2C" width="20" height="20" />
                        ) : (
                          <ChevronDown fill="#2D2C2C" width="20" height="20" />
                        )}
                      </>
                    )}
                  </View>
                  <TextList
                    title="Job Request Date"
                    value={Format.formatDate(relocationDetails.createdOn)}
                  />
                  <TextList
                    title="Client"
                    value={relocationDetails.clientNameFroms[0]}
                  />
                  {!(relocationDetails.productStorageFroms.length > 1) && (
                    <>
                      <TextList
                        title="Location"
                        value={relocationDetails.locationFroms[0]}
                      />
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
                      <CustomTextList
                        title="Quantity"
                        value={`${
                          relocationDetails.productStorageFroms[0].quantity
                        }-${
                          relocationDetails.productStorageFroms[0].quantity -
                          relocationDetails.quantityTo
                        }`}
                        separateQuantity={true}
                      />
                      <TextList
                        title="UOM"
                        value={
                          relocationDetails.productStorageFroms[0].productUom
                            .packaging
                        }
                        isBold={true}
                      />
                      <CustomTextList
                        title="Grade"
                        value={productGradeToString(
                          relocationDetails.productStorageFroms[0].grade,
                        )}
                      />
                      {isExpanded && (
                        <>
                          <TextList
                            title="Expiry Date"
                            value={
                              relocationDetails.productStorageFroms[0].product
                                .attributes?.expiry_date
                            }
                          />
                          <TextList
                            title="Batch No"
                            value={
                              relocationDetails.productStorageFroms[0].product
                                .batchNo
                            }
                          />
                          <TextList
                            title="Reason Code"
                            value={reasonCodeToString(
                              relocationDetails.reasonCode,
                            )}
                          />
                          <TextList
                            title="Remarks"
                            value={relocationDetails.remark}
                          />
                        </>
                      )}
                    </>
                  )}
                </Card>
              </TouchableWithoutFeedback>
              {relocationDetails.productStorageFroms.length > 1 && (
                <Button
                  title="See All Items"
                  titleStyle={styles.buttonText}
                  buttonStyle={styles.button}
                  containerStyle={{marginTop: 20}}
                  disabled={isSubmitting}
                  onPress={this.navigateToItemDetails}
                  disabledStyle={{backgroundColor: '#ABABAB'}}
                  disabledTitleStyle={{color: '#FFF'}}
                />
              )}
              <View
                style={{alignItems: 'center', marginTop: 15, marginBottom: 5}}>
                <ArrowDown fill="#121C78" width="40" height="40" />
              </View>
              <Text style={styles.title}>Relocate To</Text>
              <Card containerStyle={styles.cardContainer}>
                <TextList
                  title="Warehouse"
                  value={relocationDetails.warehouseNameTo}
                />
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
              </Card>
              <Button
                title="Confirm Relocation"
                titleStyle={styles.buttonText}
                buttonStyle={styles.button}
                onPress={this.confirmRelocation}
                disabled={isSubmitting}
                disabledStyle={{backgroundColor: '#ABABAB'}}
                disabledTitleStyle={{color: '#FFF'}}
              />
            </ScrollView>
            <Overlay
              overlayStyle={{borderRadius: 10, padding: 0}}
              isVisible={this.state.showOverlay}>
              <View
                style={{
                  flexShrink: 1,
                  width: window.width * 0.9,
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
          </>
        )}
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 23,
    marginHorizontal: 20,
    marginTop: 10,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
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
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelocationConfirm);
