import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Card, Button} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {CustomTextList, TextList} from '../../../../component/extend/Text-list';
import Loading from '../../../../component/loading/loading';
import Banner from '../../../../component/banner/banner';
// helper
import {getData, putData} from '../../../../component/helper/network';
import Format from '../../../../component/helper/format';
import {
  productGradeToString,
  reasonCodeToString,
} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';
// icon
import ArrowDown from '../../../../assets/icon/arrow_down_relocation.svg';
import ChevronDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
import ChevronUp from '../../../../assets/icon/iconmonstr-arrow-66mobile-4.svg';

class RelocationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocationId: this.props.route.params?.relocationId ?? null,
      relocationDetails: null,
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

  closeBanner = () => {
    this.setState({
      errorMessage: '',
    });
  };

  startRelocate = async () => {
    this.setState({
      isSubmitting: true,
    });
    const {relocationId} = this.state;
    const result = await putData(
      `/stocks-mobile/stock-relocations/${relocationId}/start-relocate`,
    );
    if (
      result.message === 'Stock relocation started' &&
      result.error === undefined
    ) {
      this.navigateToConfirmRelocation();
    } else if (result.error !== undefined) {
      this.setState({
        errorMessage: result.error,
      });
    }
    this.setState({
      isSubmitting: false,
    });
  };

  handleExpanded = () => {
    this.setState({isExpanded: !this.state.isExpanded});
  };

  navigateToConfirmRelocation = () => {
    this.props.navigation.navigate('ConfirmRelocation', {
      relocationId: this.state.relocationId,
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
      relocationDetails,
      isSubmitting,
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
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Relocate From</Text>
            <TouchableWithoutFeedback
              onPress={
                !(relocationDetails.productStorageFroms.length > 1)
                  ? this.handleExpanded
                  : null
              }>
              <Card containerStyle={[styles.cardContainer, {marginBottom: 0}]}>
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
                    <TextList
                      title="Quantity"
                      value={relocationDetails.productStorageFroms[0].quantity}
                      isBold={true}
                    />
                    <TextList
                      title="UOM"
                      value={
                        relocationDetails.productStorageFroms[0].productUom
                          .packaging
                      }
                      isBold={true}
                    />
                    <TextList
                      title="Grade"
                      value={productGradeToString(
                        relocationDetails.productStorageFroms[0].grade,
                      )}
                      isBold={true}
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
            {relocationDetails.productStorageFroms.length > 1 ? (
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
            ) : (
              <Card containerStyle={styles.cardContainer}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 2}}>
                    <Text style={styles.textBig}>Move Quantity</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBig}>
                      {relocationDetails.quantityTo}
                    </Text>
                  </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{flex: 2}}>
                    <Text style={styles.textBig}>UOM</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.textBig}>
                      {relocationDetails.uomFroms[0]}
                    </Text>
                  </View>
                </View>
              </Card>
            )}
            <View style={{alignItems: 'center', marginTop: 10}}>
              <ArrowDown fill="#121C78" width="40" height="40" />
            </View>
            <Text style={styles.title}>Relocate To</Text>
            <Card containerStyle={styles.cardContainer}>
              <TextList
                title="Warehouse"
                value={relocationDetails.warehouseNameTo}
              />
              <TextList title="Location" value={relocationDetails.locationTo} />
              {!(relocationDetails.productStorageFroms.length > 1) && (
                <>
                  <TextList
                    title="Item Code"
                    value={
                      relocationDetails.productStorageFroms[0].product.item_code
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
              title="Start Relocate"
              titleStyle={styles.buttonText}
              buttonStyle={styles.button}
              disabled={isSubmitting}
              onPress={this.startRelocate}
              disabledStyle={{backgroundColor: '#ABABAB'}}
              disabledTitleStyle={{color: '#FFF'}}
            />
            <Button
              type="clear"
              title="Report"
              containerStyle={styles.reportButton}
              titleStyle={styles.reportButtonText}
              onPress={this.navigateToReportStockTakeCount}
            />
          </ScrollView>
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
  button: {
    ...Mixins.bgButtonPrimary,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  reportButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6C6B6B',
  },
  reportButtonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    color: '#E03B3B',
  },
  textBig: {
    ...Mixins.subtitle1,
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RelocationDetails);
