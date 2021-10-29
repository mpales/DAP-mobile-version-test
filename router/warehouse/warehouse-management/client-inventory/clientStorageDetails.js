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
import {cleanKeyString} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';
import moment from 'moment';

class ClientStorageDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storageDetails: this.props.route.params?.data ?? null,
      selectedStatus: this.props.route.params?.selectedStatus,
    };
  }

  render() {
    const {storageDetails, selectedStatus} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {storageDetails !== null && (
            <>
              <Text
                style={
                  styles.title
                }>{`Warehouse ${storageDetails.warehouse_name}`}</Text>
              <Text style={styles.title}>{`${storageDetails.location}`}</Text>
            </>
          )}
          {storageDetails === null ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Empty</Text>
            </View>
          ) : (
            <Card containerStyle={styles.cardContainer}>
              {selectedStatus === 'free' ? (
                <>
                  <TextList title="Client" value={storageDetails.client} />
                  <TextList
                    title="Item Code"
                    value={storageDetails.item_code}
                  />
                  <TextList
                    title="Description"
                    value={storageDetails.description}
                  />
                  <TextList
                    title="Barcode"
                    value={storageDetails.barcode[0].code_number}
                  />
                  <TextList title="Grade" value={storageDetails.grade} />
                  <TextList title="Quantity" value={storageDetails.quantity} />
                  <TextList title="UOM" value={storageDetails.uom.packaging} />
                  <TextList
                    title="Receipt Date"
                    value={Format.formatDate(storageDetails.receive_date)}
                  />
                  <View style={styles.lineSeparator} />
                  <Text>Attributes</Text>
                  <TextListBig
                    title="Product Category"
                    value={storageDetails.category}
                    fontSize={14}
                  />
                  {storageDetails.attributes !== undefined &&
                    Object.keys(storageDetails.attributes).map((key) => {
                      return (
                        <TextList
                          title={cleanKeyString(key)}
                          value={
                            key.includes('date')
                              ? Format.formatDate(
                                  storageDetails.attributes.expiry_date,
                                )
                              : storageDetails.attributes[key]
                          }
                        />
                      );
                    })}
                  <TextList title="Batch" value={storageDetails.batch_no} />
                </>
              ) : selectedStatus === 'salesOrder' ? (
                <>
                  <TextList
                    title="Client"
                    value={storageDetails.sales_order.client_name}
                  />
                  <TextList
                    title="Item Code"
                    value={storageDetails.item_code}
                  />
                  <TextList
                    title="Barcode"
                    value={storageDetails.barcode[0].code_number}
                  />
                  <TextList
                    title="Description"
                    value={storageDetails.description}
                  />
                  <TextList
                    title="Grade"
                    value={storageDetails.additional.grade}
                  />
                  <TextList
                    title="Quantity"
                    value={storageDetails.additional.quantity}
                  />
                  <TextList title="UOM" value={storageDetails.uom} />
                  <TextList
                    title="Receipt Date"
                    value={Format.formatDate(
                      storageDetails.additional.receive_date,
                    )}
                  />
                  <View style={styles.lineSeparator} />
                  <Text>Attributes</Text>
                  <TextListBig
                    title="Product Category"
                    value={storageDetails.category}
                    fontSize={14}
                  />
                  {storageDetails.additional.attributes !== undefined &&
                    Object.keys(storageDetails.additional.attributes).map(
                      (key) => {
                        return (
                          <TextList
                            title={cleanKeyString(key)}
                            value={
                              key.includes('date')
                                ? Format.formatDate(
                                    storageDetails.additional.attributes
                                      .expiry_date,
                                  )
                                : storageDetails.additional.attributes[key]
                            }
                          />
                        );
                      },
                    )}
                  <TextList
                    title="Batch"
                    value={storageDetails.additional.batch_no}
                  />
                </>
              ) : (
                <>
                  <TextList title="Client" value={storageDetails.client} />
                  <TextList
                    title="Item Code"
                    value={storageDetails.item_code}
                  />
                  <TextList
                    title="Barcode"
                    value={storageDetails.barcode[0].code_number}
                  />
                  <TextList
                    title="Description"
                    value={storageDetails.description}
                  />
                  <TextList title="Grade" value={storageDetails.grade} />
                  <TextList title="Quantity" value={storageDetails.quantity} />
                  <TextList title="UOM" value={storageDetails.uom.packaging} />
                  <TextList
                    title="Receipt Date"
                    value={Format.formatDate(storageDetails.receive_date)}
                  />
                  <View style={styles.lineSeparator} />
                  <Text>Attributes</Text>
                  <TextListBig
                    title="Product Category"
                    value={storageDetails.product_category}
                    fontSize={14}
                  />
                  {storageDetails.attributes !== undefined &&
                    Object.keys(storageDetails.attributes).map((key) => {
                      return (
                        <TextList
                          title={cleanKeyString(key)}
                          value={
                            key.includes('date')
                              ? Format.formatDate(
                                  storageDetails.attributes.expiry_date,
                                )
                              : storageDetails.attributes[key]
                          }
                        />
                      );
                    })}
                  <TextList title="Batch" value={storageDetails.batch_no} />
                </>
              )}
            </Card>
          )}
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const STORAGEDETAIL = {
  client: 'ROBERTO',
  itemCode: '09871233456',
  description: 'ERGOBLOM V2 BLUE DESK',
  barcode: 'BT-09-123345',
  grade: '01',
  quantity: 30,
  UOM: 'PCS',
  receiptDate: moment().subtract(1, 'days').unix(),
  attributes: {
    productCategory: 'Fashion',
    color: 'BLACK',
    expiryDate: '-',
    banch: '01',
  },
};

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
  text: {
    ...Mixins.subtitle3,
    fontSize: 14,
    lineHeight: 21,
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
)(ClientStorageDetails);
