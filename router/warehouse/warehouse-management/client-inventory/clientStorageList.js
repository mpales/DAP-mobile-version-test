import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
//component
import ListItemClientStorage from '../../../../component/extend/ListItem-client-inventory-storage';
//helper
import {getData} from '../../../../component/helper/network';
import {clientProductStatusEndpoint} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';
// icon
import ArrowRight from '../../../../assets/icon/iconmonstr-arrow-66mobile-6.svg';

class ClientStorageList extends React.Component {
  constructor(props) {
    super(props);
    this.headerColumn = React.createRef([]);
    this.state = {
      client: this.props.route.params?.client.name ?? null,
      product: this.props.route.params?.product.name ?? null,
      selectedStatus: '',
      selectedSortBy: null,
      itemStatusData: null,
      storageList: null,
      isLoading: true,
      isStorageListLoaded: false,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
      itemStatusData: DUMMYTABLEDATA,
    });
    // this.getClientProductQuantity();
  }

  // getClientProductQuantity = async () => {
  //   const {route} = this.props;
  //   let clientId = route.params?.client.id ?? null;
  //   let productId = route.params?.product.id ?? null;
  //   if (clientId !== null && productId !== null) {
  //     const result = await getData(
  //       `/clients/${clientId}/products/${productId}/quantity`,
  //     );
  //     if (typeof result === 'object' && result.error === undefined) {
  //       this.setState({
  //         itemStatusData: result,
  //       });
  //     }
  //     this.setState({
  //       isLoading: false,
  //     });
  //   }
  // };

  getProductListByStatus = async (status) => {
    this.setState({
      storageList: null,
      selectedStatus: status,
      isStorageListLoaded: false,
    });
    const {route} = this.props;
    let clientId = route.params?.client.id ?? null;
    let productId = route.params?.product.id ?? null;
    if (clientId !== null && productId !== null) {
      const result = await getData(
        `/clients/${clientId}/products/${productId}/${status}`,
      );
      if (typeof result === 'object' && result.error === undefined) {
        this.setState({
          storageList: status === 'free' ? result.products : result,
        });
      }
      this.setState({
        isStorageListLoaded: true,
      });
    }
  };

  sortList = (type) => {
    const {storageList} = this.state;
    this.setState({selectedSortBy: type});
    let sortedList = !!storageList ? [...storageList] : [];
    sortedList.sort((a, b) =>
      a[type] > b[type] ? 1 : b[type] > a[type] ? -1 : 0,
    );
    this.setState({storageList: sortedList});
  };

  navigateToDetails = (data) => {
    const {selectedStatus} = this.state;
    this.props.navigation.navigate('ClientStorageDetails', {
      selectedStatus: selectedStatus,
      data: data,
    });
  };

  render() {
    const {
      client,
      isLoading,
      isStorageListLoaded,
      itemStatusData,
      product,
      selectedSortBy,
      selectedStatus,
      storageList,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Sort By</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dialog"
                selectedValue={selectedSortBy}
                onValueChange={(value) => this.sortList(value)}
                itemStyle={{
                  height: 50,
                  borderRadius: 5,
                  marginHorizontal: -10,
                }}
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
                    {marginLeft: 20, marginRight: 20, flexWrap: 'wrap'},
                  ]}>
                  {`${client} ${product}`}
                </Text>
              </View>
            </View>
          </View>
          {!isLoading && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View style={styles.cardContainer}>
                {itemStatusData === null ? (
                  <View
                    style={{
                      flexShrink: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.title}>No Result</Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.tableRow,
                      {paddingHorizontal: 0, marginVertical: 10},
                    ]}>
                    <View style={styles.firstColumn}>
                      <Text style={styles.tableColumnFirst}>Item Status</Text>
                      {itemStatusData.map((data, index) => {
                        return (
                          <Text
                            key={index}
                            style={
                              index % 2 === 0
                                ? [
                                    styles.tableColumnFirst,
                                    {backgroundColor: '#F5F5FB'},
                                  ]
                                : styles.tableColumnFirst
                            }>
                            {data.status}
                          </Text>
                        );
                      })}
                    </View>
                    <View style={styles.verticalLineSeparator} />
                    <View
                      style={{
                        flexDirection: 'column',
                      }}>
                      <View style={styles.tableRow}>
                        <Text style={styles.tableColumnFirst}>Quantity</Text>
                      </View>
                      {itemStatusData.map((data, index) => {
                        return (
                          <TouchableOpacity
                            disabled={true}
                            onPress={() =>
                              this.getProductListByStatus(
                                clientProductStatusEndpoint(data.status),
                              )
                            }
                            style={
                              index % 2 === 0
                                ? [
                                    styles.tableRow,
                                    {
                                      backgroundColor: '#F5F5FB',
                                    },
                                  ]
                                : [styles.tableRow]
                            }>
                            <Text style={styles.tableColumnValue}>
                              {data.quantity}
                            </Text>
                            <ArrowRight fill="#2D2C2C" width="10" height="10" />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
          <View style={styles.lineSeparator} />
          {storageList !== null &&
            isStorageListLoaded &&
            storageList.map((item) => (
              <ListItemClientStorage
                item={item}
                selectedStatus={selectedStatus}
                navigate={this.navigateToDetails}
              />
            ))}
          {storageList === null && isStorageListLoaded && (
            <View style={styles.emptyContainer}>
              <Text style={styles.text}>No Result</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const DUMMYTABLEDATA = [
  {status: 'On Hand', quantity: 21},
  {status: 'Sales Order', quantity: 9},
  {status: 'Free', quantity: 18},
  {status: 'ASN/Transit', quantity: 9},
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
    flexShrink: 1,
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
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  firstColumn: {
    width: 100,
  },
  column: {
    flexDirection: 'column',
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
    paddingHorizontal: 5,
    ...Mixins.small1,
    lineHeight: 18,
    fontWeight: '400',
    paddingVertical: 3,
    textAlign: 'center',
    width: 90,
  },
  lineSeparator: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    marginVertical: 10,
    position: 'absolute',
    left: 100,
  },
  verticalLineSeparator: {
    position: 'absolute',
    height: '115%',
    left: 100,
    zIndex: 2,
    borderRightWidth: 1,
    borderColor: '#D5D5D5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientStorageList);
