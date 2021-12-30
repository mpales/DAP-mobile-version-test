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
import SelectDropdown from 'react-native-select-dropdown';
// component
import ListItemClientStorage from '../../../../component/extend/ListItem-client-inventory-storage';
import Loading from '../../../../component/loading/loading';
// helper
import {getData} from '../../../../component/helper/network';
// style
import Mixins from '../../../../mixins';
// icon
import ArrowRight from '../../../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

class ClientStorageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: this.props.route.params?.client.name ?? null,
      product: this.props.route.params?.product.name ?? null,
      selectedStatus: '',
      selectedSortBy: null,
      tableStatus: ['On Hand', 'Free', 'Outgoing', 'Incoming', 'Reserved'],
      itemStatusData: {
        onhand: 0,
        free: 0,
        outgoing: 0,
        incoming: 0,
        reserved: 0,
      },
      storageList: null,
      isLoading: true,
      isStorageListLoaded: false,
    };
  }

  async componentDidMount() {
    this.getTableData();
  }

  getTableData = async () => {
    this.getClientInventoryProductStatus('on-hand');
    this.getClientInventoryProductStatus('free');
    this.getClientInventoryProductStatus('outgoing');
    this.getClientInventoryProductStatus('incoming');
    await this.getClientInventoryProductStatus('reserved');
    this.setState({
      isLoading: false,
    });
  };

  getClientInventoryProductStatus = async (status) => {
    const {route} = this.props;
    let clientId = route.params?.client.id ?? null;
    let productId = route.params?.product.id ?? null;
    if (clientId !== null && productId !== null) {
      const result = await getData(
        `/stocks/client-inventories/client/${clientId}/product/${productId}/status/${status}`,
      );
      if (typeof result === 'object' && result.error === undefined) {
        const newItemStatusData = this.state.itemStatusData;
        newItemStatusData[status === 'on-hand' ? 'onhand' : status] =
          result.total;
        this.setState({
          itemStatusData: newItemStatusData,
        });
      }
    }
  };

  getProductListByStatus = async (status) => {
    this.setState({
      storageList: null,
      isStorageListLoaded: false,
    });
    const {route} = this.props;
    let clientId = route.params?.client.id ?? null;
    let productId = route.params?.product.id ?? null;
    if (clientId !== null && productId !== null) {
      const result = await getData(
        `/stocks/client-inventories/client/${clientId}/product/${productId}/status/${status}/products`,
      );
      if (typeof result === 'object' && result.error === undefined) {
        this.setState({
          storageList: result,
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
    this.props.navigation.navigate('ClientStorageDetails', {
      clientName: this.state.client,
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
      selectedStatus,
      selectedSortBy,
      storageList,
      tableStatus,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.text}>Sort By</Text>
            <SelectDropdown
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownButtonText}
              rowTextStyle={[styles.dropdownButtonText, {textAlign: 'center'}]}
              data={['Location', 'Warehouse']}
              defaultValueByIndex={0}
              onSelect={(selectedItem) => {
                this.sortList(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem;
              }}
              rowTextForSelection={(item) => {
                return item;
              }}
              renderDropdownIcon={() => (
                <View style={{marginRight: 10}}>
                  <ArrowDown fill="#2D2C2C" width="20px" height="20px" />
                </View>
              )}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 27,
                      backgroundColor:
                        !!selectedSortBy && item === selectedSortBy
                          ? '#e7e8f2'
                          : 'transparent',
                      paddingVertical: 0,
                      marginVertical: 0,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        ...Mixins.small1,
                        fontWeight: '400',
                        lineHeight: 18,
                        color: '#424141',
                        textAlign: 'center',
                      }}>
                      {item}
                    </Text>
                  </View>
                );
              }}
            />
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
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View style={styles.cardContainer}>
              {isLoading ? (
                <View style={{marginVertical: 10}}>
                  <Loading />
                </View>
              ) : (
                <View
                  style={[
                    styles.tableRow,
                    {paddingHorizontal: 0, marginVertical: 10},
                  ]}>
                  <View style={styles.firstColumn}>
                    <Text style={styles.tableColumnFirst}>Item Status</Text>
                    {tableStatus.map((status, index) => {
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
                          {status}
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
                    {tableStatus.map((status, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            this.getProductListByStatus(
                              status.toLowerCase().replace(/\s/g, '-'),
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
                            {itemStatusData[
                              status.toLowerCase().replace(/\s/g, '')
                            ] ?? '-'}
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
          <View style={styles.lineSeparator} />
          {isStorageListLoaded && (
            <>
              {storageList !== null && storageList.length > 0 ? (
                storageList.map((item, index) => (
                  <ListItemClientStorage
                    key={index}
                    item={item}
                    selectedStatus={selectedStatus}
                    navigate={this.navigateToDetails}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.text}>No Result</Text>
                </View>
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
  dropdownButton: {
    width: 150,
    maxHeight: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ABABAB',
    backgroundColor: 'white',
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  dropdownButtonText: {
    paddingHorizontal: 10,
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#424141',
    textAlign: 'left',
    paddingHorizontal: 0,
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
