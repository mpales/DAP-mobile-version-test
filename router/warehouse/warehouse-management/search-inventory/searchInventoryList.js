import React from 'react';
import {FlatList, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
// helper
import {getData} from '../../../../component/helper/network';
//component
import ListItemSearchInventory from '../../../../component/extend/ListItem-search-inventory-result';
import Loading from '../../../../component/loading/loading';
//style
import Mixins from '../../../../mixins';

class SearchInventoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouseName: this.props.route.params?.warehouseName ?? '',
      warehouse: this.props.route.params?.warehouse ?? null,
      locationId: this.props.route.params?.locationId ?? '',
      selectedSortBy: null,
      searchResult: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.searchInventoryList();
  }

  sortList = (type) => {
    this.setState({selectedSortBy: type});
    if (this.state.searchResult !== null) {
      let sortedList = [...this.state.searchResult];
      sortedList.sort((a, b) =>
        a[type] > b[type] ? 1 : b[type] > a[type] ? -1 : 0,
      );
      this.setState({searchResult: sortedList});
    }
  };

  searchInventoryList = async () => {
    const {warehouse, locationId} = this.state;
    const result = await getData(
      `stocks-mobile/search-inventories/warehouse/${
        warehouse === null ? 0 : warehouse
      }/location-id/${
        locationId === null || locationId === '' ? 0 : locationId
      }`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      if (result.length > 0) {
        this.setState({
          searchResult: result,
        });
        this.sortList('location');
      }
    }
    this.setState({
      isLoading: false,
    });
  };

  navigateToDetails = (data) => {
    this.props.navigation.navigate('SearchInventoryDetails', {
      warehouseData: data,
    });
  };

  render() {
    const {
      warehouse,
      warehouseName,
      locationId,
      searchResult,
      selectedSortBy,
      isLoading,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.headerContainer}>
          <Text style={styles.text}>Sort By</Text>
          <View style={styles.pickerContainer}>
            <Picker
              mode="dropdown"
              selectedValue={selectedSortBy}
              onValueChange={(value) => this.sortList(value)}
              style={{maxWidth: 180}}>
              <Picker.Item
                label="Location"
                value="location"
                style={styles.text}
              />
              <Picker.Item
                label="Warehouse"
                value="warehouse"
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
                {`${warehouseName} ${locationId}`}
              </Text>
            </View>
            <Text style={[styles.text, styles.textBlue]}>
              {`${searchResult === null ? 0 : searchResult.length} Result`}
            </Text>
          </View>
        </View>
        {!isLoading ? (
          <>
            {searchResult === null ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.title}>No result</Text>
              </View>
            ) : (
              <FlatList
                data={searchResult}
                renderItem={({item, index}) => (
                  <ListItemSearchInventory
                    item={item}
                    navigate={this.navigateToDetails}
                  />
                )}
                keyExtractor={(item, index) => index}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        ) : (
          <Loading />
        )}
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
    padding: 20,
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
    width: 180,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    marginTop: 5,
    marginBottom: 10,
  },
});
const SEARCHRESULT = [
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L145',
  },
  {
    warehouse: 'JEPPEL',
    location: 'JP4 B-L132',
  },
  {
    warehouse: 'AEPPEL',
    location: 'JP4 B-L175',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L148',
  },
  {
    warehouse: 'BEPPEL',
    location: 'JP4 B-L101',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L110',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L150',
  },
];

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
)(SearchInventoryList);
