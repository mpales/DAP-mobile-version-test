import React from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
//component
import ListItemClientStorage from '../../../../component/extend/ListItem-client-inventory-storage';
//style
import Mixins from '../../../../mixins';
// icon
import ArrowRight from '../../../../assets/icon/iconmonstr-arrow-66mobile-2.svg';
import ArrowLeft from '../../../../assets/icon/iconmonstr-arrow-66mobile-3.svg';

class ClientStorageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: this.props.route.params?.client ?? null,
      product: this.props.route.params?.product ?? null,
      selectedSortBy: null,
      itemStatusData: ITEMSTATUSDATA,
      storageList: STORAGELIST,
    };
  }

  componentDidMount() {
    this.sortList('location');
  }

  sortList = (type) => {
    this.setState({selectedSortBy: type});
    let sortedList = [...this.state.storageList];
    sortedList.sort((a, b) =>
      a[type] > b[type] ? 1 : b[type] > a[type] ? -1 : 0,
    );
    this.setState({storageList: sortedList});
  };

  navigateToDetails = () => {
    this.props.navigation.navigate('ClientStorageDetails');
  };

  render() {
    const {
      client,
      product,
      storageList,
      selectedSortBy,
      itemStatusData,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.headerContainer}>
          <Text style={styles.text}>Sort By</Text>
          <View style={styles.pickerContainer}>
            <Picker
              mode="dialog"
              selectedValue={selectedSortBy}
              onValueChange={(value) => this.sortList(value)}
              style={{maxWidth: 150}}>
              <Picker.Item
                label="Location"
                value="location"
                style={styles.text}
              />
              <Picker.Item
                label="Quantity"
                value="quantity"
                style={styles.text}
              />
            </Picker>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexShrink: 1,
              }}>
              <Text style={styles.text}>Results</Text>
              <Text
                style={[
                  styles.text,
                  styles.textBlue,
                  {marginLeft: 20, flexWrap: 'wrap'},
                ]}>
                {`${client}   ${product}`}
              </Text>
            </View>
          </View>
        </View>
        <Card containerStyle={styles.cardContainer}>
          <View style={styles.tableRow}>
            <View style={styles.firstColumn}>
              <Text style={styles.tableColumnFirst}>Item Status</Text>
              <Text
                style={[styles.tableColumnFirst, {backgroundColor: '#F5F5FB'}]}>
                On Hand
              </Text>
              <Text style={styles.tableColumnFirst}>Free</Text>
              <Text
                style={[styles.tableColumnFirst, {backgroundColor: '#F5F5FB'}]}>
                ASN/Transit
              </Text>
              <Text style={styles.tableColumnFirst}>Sales Order</Text>
            </View>
            <ScrollView horizontal={true}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={styles.tableRow}>
                  {itemStatusData !== null &&
                    Object.keys(itemStatusData[0]).map((value, index) => {
                      if (index === 0) {
                        return;
                      }
                      return (
                        <Text style={styles.tableColumnValue}>{value}</Text>
                      );
                    })}
                </View>
                {itemStatusData !== null &&
                  itemStatusData.map((data, index) => {
                    return (
                      <TouchableOpacity
                        style={
                          index % 2 === 0
                            ? [styles.tableRow, {backgroundColor: '#F5F5FB'}]
                            : styles.tableRow
                        }>
                        <Text style={styles.tableColumnValue}>
                          {data['UOM']}
                        </Text>
                        <Text style={styles.tableColumnValue}>
                          {data['01']}
                        </Text>
                        <Text style={styles.tableColumnValue}>
                          {data['02']}
                        </Text>
                        <Text style={styles.tableColumnValue}>
                          {data['NS']}
                        </Text>
                        <Text style={styles.tableColumnValue}>
                          {data['SIT']}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </ScrollView>
          </View>
        </Card>
        <View style={styles.lineSeparator} />
        {storageList === null ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.title}>No result</Text>
          </View>
        ) : (
          <FlatList
            data={storageList}
            renderItem={({item, index}) => (
              <ListItemClientStorage
                item={item}
                navigate={this.navigateToDetails}
              />
            )}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaProvider>
    );
  }
}

const ITEMSTATUSDATA = [
  {
    itemStatus: 'On Hand',
    UOM: 'PC',
    '01': '21',
    '02': '02',
    NS: '2',
    SIT: '0',
  },
  {
    itemStatus: 'Free',
    UOM: 'PC',
    '01': '18',
    '02': '0',
    NS: '2',
    SIT: '0',
  },
  {
    itemStatus: 'ASN/Transit',
    UOM: 'PC',
    '01': '31',
    '02': '01',
    NS: '2',
    SIT: '0',
  },
  {
    itemStatus: 'Sales Order',
    UOM: 'PC',
    '01': '09',
    '02': '07',
    NS: '2',
    SIT: '0',
  },
];

const STORAGELIST = [
  {
    warehouse: 'KEPPEL',
    location: 'JP2 C05-020',
    itemCode: '09871233456',
    description: 'ERGOBLOM V2 BLUE DESK',
    grade: '01',
    quantity: '10',
    UOM: 'PCS',
  },
  {
    warehouse: 'AEPPEL',
    location: 'JP2 C05-010',
    itemCode: '09871233456',
    description: 'ERGOBLOM V2 BLUE DESK',
    grade: '01',
    quantity: '20',
    UOM: 'PCS',
  },
];

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
    lineHeight: 25,
  },
  text: {
    ...Mixins.subtitle3,
    fontSize: 14,
    lineHeight: 21,
  },
  textBlue: {
    color: '#2A3386',
  },
  pickerContainer: {
    width: 150,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    marginTop: 5,
    marginBottom: 10,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
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
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  firstColumn: {
    width: 100,
  },
  tableColumnFirst: {
    width: 100,
    ...Mixins.small1,
    lineHeight: 18,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  tableColumn: {
    flexShrink: 1,
    ...Mixins.small1,
    lineHeight: 18,
    fontWeight: '600',
    paddingVertical: 3,
  },
  tableColumnValue: {
    width: 50,
    ...Mixins.small1,
    lineHeight: 18,
    fontWeight: '400',
    paddingVertical: 3,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationText: {
    ...Mixins.small1,
    lineHeight: 18,
    fontWeight: '600',
    marginHorizontal: 5,
  },
  paginationTextActive: {
    ...Mixins.small1,
    lineHeight: 18,
    fontWeight: '600',
    color: '#F07120',
    textDecorationLine: 'underline',
    textDecorationColor: '#F07120',
    marginHorizontal: 5,
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientStorageList);
