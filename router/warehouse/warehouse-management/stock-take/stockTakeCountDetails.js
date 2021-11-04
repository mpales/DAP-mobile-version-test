import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Button, Card} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {
  TextList,
  TextListBig,
  NavigateTextList,
} from '../../../../component/extend/Text-list';
import Banner from '../../../../component/banner/banner';
// helper
import {putData} from '../../../../component/helper/network';
import Format from '../../../../component/helper/format';
import {
  cleanKeyString,
  productGradeToString,
} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';

const window = Dimensions.get('window');

class StockTakeCountDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockTakeDetails: this.props.route.params?.stockTakeDetails ?? null,
      inputQuantity: 0,
      isShowModal: false,
      error: '',
      isShowBanner: false,
    };
    this.handleShowModal.bind(this);
    this.confirmStockTake.bind(this);
    this.handleMinus.bind(this);
    this.handlePlus.bind(this);
    this.handleInput.bind(this);
  }

  componentDidMount() {
    const {stockTakeDetails} = this.state;
    if (stockTakeDetails !== null && stockTakeDetails.status === 'Waiting') {
      this.lockUnlockProduct(3);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.inputQuantity !== this.state.inputQuantity) {
      if (this.state.inputQuantity < 0) {
        this.setState({
          inputQuantity: 0,
        });
      }
    }
  }

  componentWillUnmount() {
    const {stockTakeDetails} = this.state;
    if (stockTakeDetails !== null && stockTakeDetails.status === 'Waiting') {
      this.lockUnlockProduct(2);
    }
  }

  handleShowModal = () => {
    this.setState({
      isShowModal: !this.state.isShowModal,
      inputQuantity: 0,
    });
  };

  handleInput = (text) => {
    this.setState({
      inputQuantity: isNaN(text)
        ? 0
        : /\s/g.test(text)
        ? ''
        : text === ''
        ? text
        : parseInt(text),
    });
  };

  handlePlus = () => {
    this.setState({
      inputQuantity: this.state.inputQuantity + 1,
    });
  };

  handleMinus = () => {
    if (this.state.inputQuantity > 0) {
      this.setState({
        inputQuantity: this.state.inputQuantity - 1,
      });
    }
  };

  lockUnlockProduct = async (status) => {
    const {stockTakeDetails} = this.state;
    const {stockTakeId} = this.props;
    const result = await putData(
      `/stocks-mobile/stock-counts/${stockTakeId}/products/${stockTakeDetails.id}/status/${status}/lock-unlock`,
    );
    console.log(result);
  };

  confirmStockTake = async () => {
    const {inputQuantity, stockTakeDetails} = this.state;
    const {stockTakeId} = this.props;
    const data = {
      quantity: inputQuantity === 0 ? 'non-blind' : inputQuantity,
    };
    const result = await putData(
      `/stocks-mobile/stock-counts/${stockTakeId}/products/${stockTakeDetails.id}/confirm`,
      data,
    );
    if (result?.message === 'Stock Count successfully confirmed') {
      this.props.navigation.navigate('StockTakeCountList');
    } else {
      if (result.errors !== undefined && typeof result.errors === 'object') {
        let message =
          result.errors?.msg ?? errors[0]?.msg ?? 'Something went wrong';
        this.setState({
          error: message,
          isShowBanner: true,
        });
      }
    }
  };

  navigateToReportStockTakeCount = () => {
    const {stockTakeDetails} = this.state;
    this.props.navigation.navigate('ReportStockTakeCount', {
      productId: stockTakeDetails.id,
    });
  };

  navigateToStockTakeReportDetails = () => {
    const {stockTakeDetails} = this.state;
    if (stockTakeDetails.status !== 'Reported') return;
    this.props.navigation.navigate('StockTakeReportDetails', {
      productId: stockTakeDetails.id,
      productUOM: stockTakeDetails.productUom.packaging,
    });
  };

  closeBanner = () => {
    this.setState({
      isShowBanner: false,
    });
  };

  render() {
    const {
      stockTakeDetails,
      isShowModal,
      inputQuantity,
      isShowBanner,
      error,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        {isShowBanner && error !== '' && (
          <Banner title={error} closeBanner={this.closeBanner} />
        )}
        {stockTakeDetails !== null && (
          <>
            <Card containerStyle={styles.cardContainer}>
              <TextList
                title="Warehouse"
                value={stockTakeDetails.warehouse.warehouse}
              />
              <TextList
                title="Location"
                value={stockTakeDetails.warehouse.locationId}
              />
              <TextList
                title="Item Code"
                value={stockTakeDetails.product.itemCode}
              />
              <TextList
                title="Description"
                value={stockTakeDetails.product.description}
              />
              <TextList
                title="Quantity"
                value={stockTakeDetails.quantity ?? '-'}
              />
              <TextList
                title="UOM"
                value={stockTakeDetails.productUom.packaging}
              />
              <TextList
                title="Grade"
                value={productGradeToString(stockTakeDetails.grade)}
              />
              <View style={styles.lineSeparator} />
              <Text style={Mixins.subtitle3}>Attributes</Text>
              <TextListBig
                title="Product Category"
                value={stockTakeDetails.product.category}
                fontSize={14}
              />
              {stockTakeDetails.attributes !== undefined &&
                Object.keys(stockTakeDetails.attributes).map((key) => {
                  return (
                    <TextList
                      key={key}
                      title={cleanKeyString(key)}
                      value={
                        key.includes('date')
                          ? Format.formatDate(
                              stockTakeDetails.attributes.expiry_date,
                            )
                          : stockTakeDetails.attributes[key]
                      }
                    />
                  );
                })}
              <TextList title="Batch" value={stockTakeDetails.batchNo} />
              <View style={styles.lineSeparator} />
              <Text style={Mixins.subtitle3}>Report</Text>
              <NavigateTextList
                title="Total report"
                value={stockTakeDetails.status === 'Reported' ? '1' : '0'}
                navigate={this.navigateToStockTakeReportDetails}
              />
            </Card>
            {stockTakeDetails.status !== 'Completed' &&
              stockTakeDetails.status !== 'Reported' && (
                <>
                  {stockTakeDetails?.quantity === undefined ||
                  parseInt(stockTakeDetails.quantity) === 0 ? (
                    <Button
                      title="Enter Quantity"
                      titleStyle={styles.buttonText}
                      buttonStyle={styles.button}
                      onPress={this.handleShowModal}
                    />
                  ) : (
                    <Button
                      title="Confirm Quantity"
                      titleStyle={styles.buttonText}
                      buttonStyle={styles.button}
                      onPress={this.confirmStockTake}
                    />
                  )}
                  <Button
                    type="clear"
                    title="Report"
                    containerStyle={styles.reportButton}
                    titleStyle={styles.reportButtonText}
                    onPress={this.navigateToReportStockTakeCount}
                  />
                </>
              )}
          </>
        )}
        {isShowModal && (
          <>
            <View style={styles.overlay} />
            <View style={styles.modal}>
              <Text style={[Mixins.h4, {marginBottom: 10}]}>Set Quantity</Text>
              <View style={styles.counterContainer}>
                <Text style={Mixins.h4}>Qty</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Button
                    title="-"
                    buttonStyle={styles.roundButton}
                    onPress={this.handleMinus}
                  />
                  <TextInput
                    value={inputQuantity.toString()}
                    textAlign="center"
                    style={styles.inputStyle}
                    keyboardType="number-pad"
                    onChangeText={(text) => this.handleInput(text)}
                  />
                  <Button
                    title="+"
                    buttonStyle={styles.roundButton}
                    onPress={this.handlePlus}
                  />
                </View>
              </View>
              <Button
                title="Confirm"
                titleStyle={styles.buttonText}
                buttonStyle={[styles.button, {marginHorizontal: 0}]}
                onPress={this.confirmStockTake}
                disabled={inputQuantity < 1}
                disabledStyle={{backgroundColor: '#ABABAB'}}
                disabledTitleStyle={{color: '#FFF'}}
              />
              <Button
                type="clear"
                title="Back"
                titleStyle={styles.backButtonText}
                buttonStyle={[
                  styles.reportButton,
                  {marginHorizontal: 0, marginBottom: 0},
                ]}
                onPress={this.handleShowModal}
              />
            </View>
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
  lineSeparator: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    marginVertical: 10,
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
    color: '#FFF',
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
  backButtonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    color: '#424141',
  },
  overlay: {
    elevation: 6,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.3,
  },
  modal: {
    elevation: 6,
    flexDirection: 'column',
    position: 'absolute',
    width: window.width,
    height: 300,
    bottom: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 30,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputStyle: {
    width: 150,
    height: 40,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ABABAB',
  },
  roundButton: {
    ...Mixins.bgButtonPrimary,
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});

const STOCKTAKEDETAIL = {
  warehouse: 'KEPPEL',
  location: 'JP2 C05-002',
  pallet: 'JP2 C05-002',
  itemCode: '561961',
  description: 'DAP ITEMS',
  quantity: 0,
  UOM: 'PCS',
  grade: '01',
  attributes: {
    productCategory: 'Fashion',
    color: 'BLACK',
    banch: '01',
  },
};

function mapStateToProps(state) {
  return {
    stockTakeId: state.originReducer.filters.stockTakeId,
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setStockTakeId: (id) => {
      return dispatch({type: 'StockTakeId', payload: id});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockTakeCountDetails);
