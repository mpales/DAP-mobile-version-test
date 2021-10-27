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
import {TextList, TextListBig} from '../../../../component/extend/Text-list';
// helper
import Format from '../../../../component/helper/format';
import {stockTakeCountStatus} from '../../../../component/helper/string';
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
    };
    this.handleShowModal.bind(this);
    this.confirmStockTake.bind(this);
    this.handleMinus.bind(this);
    this.handlePlus.bind(this);
    this.handleInput.bind(this);
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

  confirmStockTake = () => {
    this.props.navigation.navigate('StockTakeCountList');
  };

  navigateToReportStockTakeCount = () => {
    this.props.navigation.navigate('ReportStockTakeCount');
  };

  navigateToStockTakeReportDetails = () => {
    this.props.navigation.navigate('StockTakeReportDetails');
  };

  render() {
    const {stockTakeDetails, isShowModal, inputQuantity} = this.state;
    console.log(this.props.route.params);
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
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
                title="Pallet"
                value={stockTakeDetails.product.itemCode}
              />
              <TextList
                title="Description"
                value={stockTakeDetails.product.description}
              />
              <TextList title="Quantity" value={stockTakeDetails.quantity} />
              <TextList
                title="UOM"
                value={stockTakeDetails.productUom.packaging}
              />
              <TextList title="Grade" value={stockTakeDetails.grade} />
              <View style={styles.lineSeparator} />
              <Text>Attributes</Text>
              <TextListBig
                title="Product Category"
                value={stockTakeDetails.product.category}
                fontSize={14}
              />
              <TextList
                title="Color"
                value={stockTakeDetails.attributes.color ?? '-'}
              />
              <TextList
                title="EXP Date"
                value={
                  stockTakeDetails.attributes.expiry_date !== undefined
                    ? Format.formatDate(stockTakeDetails.attributes.expiry_date)
                    : '-'
                }
              />
              <TextList title="Banch" value={stockTakeDetails.batchNo} />
            </Card>
            {stockTakeCountStatus(stockTakeDetails.status) === 'Reported' ? (
              <Button
                type="clear"
                title="See Report Detail"
                containerStyle={styles.reportButton}
                titleStyle={styles.reportButtonText}
                onPress={this.navigateToStockTakeReportDetails}
              />
            ) : (
              <>
                {stockTakeDetails.quantity === 0 ? (
                  <Button
                    title="Set Quantity"
                    titleStyle={styles.buttonText}
                    buttonStyle={styles.button}
                    onPress={this.handleShowModal}
                  />
                ) : (
                  <Button
                    title="Confirm"
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
                    title="+"
                    buttonStyle={styles.roundButton}
                    onPress={this.handlePlus}
                  />
                  <TextInput
                    value={inputQuantity.toString()}
                    textAlign="center"
                    style={styles.inputStyle}
                    keyboardType="number-pad"
                    onChangeText={(text) => this.handleInput(text)}
                  />
                  <Button
                    title="-"
                    buttonStyle={styles.roundButton}
                    onPress={this.handleMinus}
                  />
                </View>
              </View>
              <Button
                title="Confirm"
                titleStyle={styles.buttonText}
                buttonStyle={[styles.button, {marginHorizontal: 0}]}
                onPress={this.confirmStockTake}
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
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockTakeCountDetails);
