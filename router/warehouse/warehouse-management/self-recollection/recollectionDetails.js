import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import Loading from '../../../../component/loading/loading';
import {TextList, TextListBig} from '../../../../component/extend/Text-list';
// style
import Mixins from '../../../../mixins';
// helper
import Format from '../../../../component/helper/format';
import {cleanKeyString} from '../../../../component/helper/string';

class RecollectionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recollectionDetailList: null,
    };
  }

  componentDidMount() {
    this.setState({
      recollectionDetailList: RECOLLECTIONDETAILS,
    });
  }

  render() {
    const {recollectionDetailList} = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {recollectionDetailList !== null &&
            recollectionDetailList.map((item, index) => {
              return (
                <Card containerStyle={styles.cardContainer} key={index}>
                  <TextList title="Item Code" value={item.product.itemCode} />
                  <TextList
                    title="Description"
                    value={item.product.description}
                  />
                  <TextList
                    title="Barcode"
                    value={item.productBarcode.map((barcode, index) =>
                      index === item.productBarcode.length - 1
                        ? barcode
                        : `${barcode} \n`,
                    )}
                  />
                  <TextList title="Quantity" value={item.quantity} />
                  <TextList title="UOM" value={item.productUom.packaging} />
                  <TextList title="Grade" value={item.grade} />
                  <TextList
                    title="Receipt Date"
                    value={Format.formatDate(item.receiveDate)}
                  />
                  <View style={styles.lineSeparator} />
                  <Text style={styles.titleTextBig}>Attributes</Text>
                  <TextListBig
                    title="Product Category"
                    value={item.product.category}
                    fontSize={14}
                  />
                  {item.attributes !== undefined &&
                    Object.keys(item.attributes).map((key, index) => {
                      return (
                        <TextList
                          key={index}
                          title={cleanKeyString(key)}
                          value={
                            key.includes('date')
                              ? Format.formatDate(item.attributes.expiry_date)
                              : item.attributes[key]
                          }
                        />
                      );
                    })}
                  <TextList title="Batch" value={item.batchNo} />
                </Card>
              );
            })}
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const RECOLLECTIONDETAILS = [
  {
    product: {
      itemCode: '3420350002',
      description: 'ERGOBLOM V2 BLUE DESK',
      category: 'FASHION',
    },
    productBarcode: ['BT-09-123345', 'AT-09-12334'],
    quantity: 30,
    grade: 'BUFFER',
    receiveDate: new Date(),
    batchNo: '01',
    productUom: {packaging: 'PCS'},
    attributes: {
      color: 'Black',
      expiry_date: new Date(),
    },
  },
];

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 23,
    marginHorizontal: 20,
    marginTop: 10,
  },
  titleTextBig: {
    ...Mixins.small1,
    fontSize: 14,
    lineHeight: 21,
    color: '#2D2C2C',
    fontWeight: '500',
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
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecollectionDetails);
