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
//helper
import {getData} from '../../../../component/helper/network';
import {
  clientProductStatus,
  cleanKeyString,
} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';

class ClientStorageList extends React.Component {
  constructor(props) {
    super(props);
    this.headerColumn = React.createRef([]);
    this.state = {
      client: this.props.route.params?.client.name ?? null,
      product: this.props.route.params?.product.name ?? null,
      selectedSortBy: null,
      itemStatusData: null,
      storageList: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getClientProductQuantity();
  }

  getClientProductQuantity = async () => {
    const {route} = this.props;
    let clientId = route.params?.client.id ?? null;
    let productId = route.params?.product.id ?? null;
    if (clientId !== null && productId !== null) {
      const result = await getData(
        `/clients/${clientId}/products/${productId}/quantity`,
      );
      if (typeof result === 'object' && result.error === undefined) {
        this.setState({
          itemStatusData: result,
        });
      }
      this.setState({
        isLoading: false,
      });
    }
  };

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
      isLoading,
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
            <Card containerStyle={styles.cardContainer}>
              {itemStatusData === null ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.title}>No Result</Text>
                </View>
              ) : (
                <View style={styles.tableRow}>
                  <View style={styles.firstColumn}>
                    <Text style={styles.tableColumnFirst}>Item Status</Text>
                    {itemStatusData.map((value, index) => {
                      return (
                        <Text
                          style={
                            index % 2 === 0
                              ? [
                                  styles.tableColumnFirst,
                                  {backgroundColor: '#F5F5FB'},
                                ]
                              : styles.tableColumnFirst
                          }>
                          {clientProductStatus(value.status)}
                        </Text>
                      );
                    })}
                  </View>
                  <ScrollView horizontal={true}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <View style={styles.tableRow}>
                        {Object.keys(itemStatusData[0]).map((value, index) => {
                          if (value === 'product_id' || value === 'status') {
                            return;
                          }
                          return (
                            <Text style={styles.tableColumnValue}>
                              {cleanKeyString(value)}
                            </Text>
                          );
                        })}
                      </View>
                      {itemStatusData.map((data, index) => {
                        let key = [];
                        Object.keys(data).map((value) => {
                          if (value !== 'product_id' && value !== 'status') {
                            key.push(value);
                          }
                        });
                        return (
                          <TouchableOpacity
                            disabled={
                              clientProductStatus(data.status) ===
                                clientProductStatus(1) ||
                              clientProductStatus(data.status) ===
                                clientProductStatus(3)
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
                            {key.map((keyValue) => {
                              return (
                                <Text style={styles.tableColumnValue}>
                                  {data[keyValue] === null
                                    ? '0'
                                    : data[keyValue]}
                                </Text>
                              );
                            })}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              )}
            </Card>
          )}
          <View style={styles.lineSeparator} />
          {storageList !== null &&
            storageList.map((item) => (
              <ListItemClientStorage
                item={item}
                navigate={this.navigateToDetails}
              />
            ))}
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
    borderRightWidth: 1,
    borderRightColor: '#D5D5D5',
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
