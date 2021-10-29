import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Card, Button} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {TextList, TextListBig} from '../../../../component/extend/Text-list';
// helper
import Format from '../../../../component/helper/format';
import {getData} from '../../../../component/helper/network';
import {cleanKeyString} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';

class SearchInventoryDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehousName: this.props.route.params?.warehouseData?.warehouseName ?? '',
      locationId: this.props.route.params?.warehouseData?.locationId ?? '',
      inventoryList:
        this.props.route.params?.warehouseData?.productStorage ?? null,
      barcodeResult: this.props.route.params?.barcodeResult ?? null,
      selectedSortBy: null,
      isLoading: false,
    };
  }

  componentDidMount() {
    if (this.state.barcodeResult !== null) {
      this.searchInventoryListByBarcode();
    }
  }

  searchInventoryListByBarcode = async () => {
    this.setState({isLoading: true});
    const {barcodeResult} = this.state;
    const result = await getData(
      `stocks-mobile/search-inventories/warehouse/0/location-id/${barcodeResult}`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      if (result.length > 0) {
        this.setState({
          warehouseName: result[0].warehouseName,
          locationId: result[0].locationId,
          inventoryList: result[0].productStorage,
        });
      }
    }
    this.setState({isLoading: false});
  };

  render() {
    const {inventoryList, warehousName, locationId, isLoading} = this.state;
    console.log(inventoryList);
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {(warehousName !== '' || locationId !== '') && (
            <>
              <Text style={styles.title}>{`Warehouse ${warehousName}`}</Text>
              <Text style={styles.title}>{locationId}</Text>
            </>
          )}
          {!isLoading && (
            <>
              {inventoryList === null ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    marginTop: '70%',
                  }}>
                  <Text style={styles.text}>Empty</Text>
                </View>
              ) : (
                <>
                  {inventoryList.map((item, index) => (
                    <Card containerStyle={styles.cardContainer} key={index}>
                      <TextList title="Client" value={item.client.name} />
                      <TextList
                        title="Item Code"
                        value={item.product.itemCode}
                      />
                      <TextList
                        title="Description"
                        value={item.product.description}
                      />
                      <TextList
                        title="Barcode"
                        value={item.productBarcode.codeNumber}
                      />
                      <TextList title="Grade" value={item.grade} />
                      <TextList title="Quantity" value={item.quantity} />
                      <TextList title="UOM" value={item.productUom.packaging} />
                      <TextList
                        title="Receipt Date"
                        value={Format.formatDate(item.receiveDate)}
                      />
                      <View style={styles.lineSeparator} />
                      <Text>Attributes</Text>
                      <TextListBig
                        title="Product Category"
                        value={item.product.category}
                        fontSize={14}
                      />
                      {item.attributes !== undefined &&
                        Object.keys(item.attributes).map((key) => {
                          return (
                            <TextList
                              title={cleanKeyString(key)}
                              value={
                                key.includes('date')
                                  ? Format.formatDate(
                                      item.attributes.expiry_date,
                                    )
                                  : item.attributes[key]
                              }
                            />
                          );
                        })}
                      <TextList title="Batch" value={item.batchNo} />
                    </Card>
                  ))}
                </>
              )}
            </>
          )}
        </ScrollView>
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
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    marginBottom: 10,
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
    lineHeight: 21,
  },
  text: {
    ...Mixins.subtitle3,
    fontSize: 14,
    lineHeight: 21,
  },
  pickerContainer: {
    width: 150,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    marginTop: 5,
    marginBottom: 10,
  },
  lineSeparator: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    marginVertical: 10,
  },
});

function mapStateToProps(state) {
  return {
    keyStack: state.originReducer.filters.keyStack,
  };
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
)(SearchInventoryDetails);
