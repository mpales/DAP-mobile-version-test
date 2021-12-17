import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {TextList, TextListBig} from '../../../../component/extend/Text-list';
// helper
import Format from '../../../../component/helper/format';
import {
  cleanKeyString,
  productGradeToString,
} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';

class ClientStorageDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientName: this.props.route.params?.clientName ?? '',
      storageDetails: this.props.route.params?.data ?? null,
    };
  }

  render() {
    const {storageDetails, clientName} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {storageDetails !== null && (
            <>
              <Text
                style={
                  styles.title
                }>{`Warehouse ${storageDetails.warehouse.warehouse}`}</Text>
              <Text
                style={
                  styles.title
                }>{`${storageDetails.warehouse.locationId}`}</Text>
              {clientName !== '' && (
                <Text style={styles.title}>{clientName}</Text>
              )}
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
              <TextList
                title="Item Code"
                value={storageDetails.product.item_code}
              />
              <TextList
                title="Description"
                value={storageDetails.product.description}
              />
              <TextList
                title="Barcode"
                value={storageDetails.productBarcodes}
              />
              <TextList
                title="Grade"
                value={productGradeToString(storageDetails.grade)}
              />
              <TextList title="Quantity" value={storageDetails.quantity} />
              <TextList title="UOM" value={storageDetails.uom.packaging} />
              <TextList
                title="Receipt Date"
                value={Format.formatDate(storageDetails.receiptDate)}
              />
              <View style={styles.lineSeparator} />
              <Text>Attributes</Text>
              <TextListBig
                title="Product Category"
                value={storageDetails.product.category}
                fontSize={14}
              />
              {storageDetails.attributes !== undefined &&
                Object.keys(storageDetails.attributes).map((key) => {
                  return (
                    <TextList
                      title={cleanKeyString(key)}
                      value={storageDetails.attributes[key]}
                    />
                  );
                })}
              <TextList title="Batch" value={storageDetails.batchNo} />
            </Card>
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
  lineSeparator: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    marginVertical: 10,
  },
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientStorageDetails);
