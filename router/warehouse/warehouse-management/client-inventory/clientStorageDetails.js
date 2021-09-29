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
//style
import Mixins from '../../../../mixins';
import moment from 'moment';

class ClientStorageDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storageDetails: STORAGEDETAIL,
    };
  }

  render() {
    const {storageDetails} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Warehouse KEPPEL-GE JP4 B-L145</Text>
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
              <TextList title="Client" value={storageDetails.client} />
              <TextList title="Item Code" value={storageDetails.itemCode} />
              <TextList title="Barcode" value={storageDetails.barcode} />
              <TextList
                title="Description"
                value={storageDetails.description}
              />
              <TextList title="Grade" value={storageDetails.grade} />
              <TextList title="Quantity" value={storageDetails.quantity} />
              <TextList title="UOM" value={storageDetails.UOM} />
              <TextList
                title="Receipt Date"
                value={Format.formatDate(storageDetails.receiptDate)}
              />
              <View style={styles.lineSeparator} />
              <Text>Attributes</Text>
              <TextListBig
                title="Product Category"
                value={storageDetails.attributes.productCategory}
                fontSize={14}
              />
              <TextList title="Color" value={storageDetails.attributes.color} />
              <TextList
                title="EXP Date"
                value={storageDetails.attributes.expiryDate}
              />
              <TextList title="Banch" value={storageDetails.attributes.banch} />
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
