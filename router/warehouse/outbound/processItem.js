import React from 'react';
import {StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {Card, Button} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
// component
import Banner from '../../../component/banner/banner';
import {TextList} from '../../../component/extend/Text-list';
// helper
import {productGradeToString} from '../../../component/helper/string';
import Format from '../../../component/helper/format';
import {postData} from '../../../component/helper/network';
// icon
import CheckmarkIcon from '../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import Incremental from '../../../assets/icon/plus-mobile.svg';
import Decremental from '../../../assets/icon/min-mobile.svg';

class ProcessItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataItem: this.props.route.params?.dataItem ?? null,
      indexData: this.props.route.params?.indexData ?? null,
      qty: 0,
      errorMessage: '',
      isCompleted: false,
    };
  }

  confirmPickQuantity = async () => {
    const {qty, indexData} = this.state;
    const {currentTask} = this.props;

    const result = await postData(
      '/outboundMobile/pickTask/' +
        currentTask +
        '/product/' +
        indexData +
        '/confirm',
      {quantity: qty},
    );
    if (typeof result === 'object' && result.error !== undefined) {
      this.props.navigation.setOptions({headerShown: false});
      this.setState({
        errorMessage: result.error,
      });
    } else {
      this.setState({isCompleted: true});
      this.props.setItemSuccess(result);
    }
  };

  handleInput = (text) => {
    this.setState({
      qty: isNaN(text)
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
      qty: this.state.qty + 1,
    });
  };

  handleMinus = () => {
    if (this.state.qty > 0) {
      this.setState({
        qty: this.state.qty - 1,
      });
    }
  };

  navigateToList = () => {
    this.props.setBarcodeScanner(true);
    this.props.navigation.navigate('List');
  };

  navigateToReport = () => {
    this.props.setBottomBar(true);
    this.props.navigation.navigate({
      name: 'ReportManifest',
      params: {
        dataCode: this.state.dataItem.pick_task_product_id,
      },
    });
  };

  render() {
    const {dataItem, errorMessage, isCompleted, qty} = this.state;
    return (
      <SafeAreaProvider style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {errorMessage !== '' && (
          <Banner
            title={errorMessage}
            backgroundColor="#F1811C"
            closeBanner={() => {
              this.setState({errorMessage: ''});
            }}
          />
        )}
        {dataItem !== null && (
          <Card containerStyle={styles.cardContainer}>
            {isCompleted && (
              <View style={styles.headerContainer}>
                <CheckmarkIcon width="24" height="24" fill="#17B055" />
                <Text style={styles.headerText}>Item Processed</Text>
              </View>
            )}
            <View style={styles.contentContainer}>
              <TextList title="Pallet" value={dataItem.pallet} />
              <TextList title="Item Code" value={dataItem.product.item_code} />
              <TextList
                title="Description"
                value={dataItem.product.description}
              />
              <TextList title="UOM" value={dataItem.product.uom} />
              <TextList title="Qty to pick" value={dataItem.qtytoPick} />
              <TextList title="Barcode" value={dataItem.product.barcode} />
              <TextList
                title="Stock Grade"
                value={productGradeToString(dataItem.detail[0].grade)}
              />
              <TextList
                title="Packaging"
                value={dataItem.detail[0].packaging}
              />
              <TextList
                title="Category"
                value={dataItem.detail[0].attributes?.category}
              />
              <TextList
                title="Batch Number"
                value={dataItem.detail[0].batch_no}
              />
              <TextList
                title="EXP Date"
                value={
                  dataItem.detail[0].attributes?.expiry_date === undefined
                    ? '-'
                    : Format.formatDateTime(
                        dataItem.detail[0].attributes?.expiry_date,
                      )
                }
              />
              <Text style={styles.qtyTitle}>Enter Qty</Text>
              <View style={styles.quantityContainer}>
                <Decremental
                  height="30"
                  width="30"
                  style={{flexShrink: 1, marginVertical: 5}}
                  onPress={() => {
                    this.handleMinus;
                  }}
                />
                <TextInput
                  value={this.state.qty.toString()}
                  textAlign="center"
                  style={styles.inputStyle}
                  keyboardType="number-pad"
                  onChangeText={(text) => this.handleInput(text)}
                />
                <Incremental
                  height="30"
                  width="30"
                  style={{flexShrink: 1, marginVertical: 5}}
                  onPress={this.handlePlus}
                />
              </View>
              <View style={styles.buttonContainer}>
                {isCompleted ? (
                  <Button
                    containerStyle={{marginTop: 10}}
                    buttonStyle={styles.navigationButton}
                    titleStyle={styles.buttonText}
                    onPress={this.navigateToList}
                    title="Back To List"
                  />
                ) : (
                  <>
                    <Button
                      containerStyle={{marginTop: 10}}
                      buttonStyle={styles.navigationButton}
                      titleStyle={styles.buttonText}
                      onPress={this.confirmPickQuantity}
                      disabled={!(qty > 0)}
                      disabledTitleStyle={{color: '#FFF'}}
                      disabledStyle={{backgroundColor: '#ABABAB'}}
                      title="Confirm"
                    />
                    <Button
                      containerStyle={{marginTop: 10}}
                      buttonStyle={styles.reportButton}
                      titleStyle={styles.reportText}
                      onPress={this.navigateToReport}
                      title="Report Item"
                    />
                  </>
                )}
              </View>
            </View>
          </Card>
        )}
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 0,
    marginTop: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    paddingBottom: 15,
  },
  headerText: {
    ...Mixins.h4,
    fontWeight: '400',
    color: '#17B055',
    lineHeight: 25,
    marginLeft: 10,
  },
  contentContainer: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputStyle: {
    width: 100,
    height: 40,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ABABAB',
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  buttonText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  reportButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#6C6B6B',
    borderRadius: 5,
  },
  reportText: {
    color: '#E03B3B',
  },
  qtyTitle: {
    ...Mixins.h4,
    fontWeight: '500',
    lineHeight: 25,
    marginTop: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    currentTask: state.originReducer.filters.currentTask,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    setItemSuccess: (error) => {
      return dispatch({type: 'TaskSuccess', payload: error});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessItem);
