import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, CheckBox, SearchBar} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import RecollectionCustomer from '../../../../component/extend/ListItem-self-recollection-customer';
import Loading from '../../../../component/loading/loading';
// style
import Mixins from '../../../../mixins';
// icon
import SearchIcon from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';

class SelectCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredCustomerList: null,
      customerList: null,
      selectedCustomer: [],
      search: '',
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.setState({
      customerList: RECOLLECTIONLIST,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search !== this.state.search) {
      this.filterCustomerlist();
    }
  }

  updateSearch = (search) => {
    this.setState({search});
  };

  filterCustomerlist = () => {
    const {search, customerList} = this.state;
    if (customerList !== null) {
      let filteredCustomerList = [];
      if (search.length > 0) {
        filteredCustomerList = customerList.filter((recollection) => {
          return (
            recollection.poId.toLowerCase().includes(search.toLowerCase()) ||
            recollection.client.name
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        });
      }
      this.setState({filteredCustomerList: filteredCustomerList});
    }
  };

  refreshStockTakeList = async () => {
    this.setState({
      isRefreshing: true,
    });
    // add get recollection list function
    this.setState({
      isRefreshing: false,
    });
  };

  renderItem = (item, key) => {
    return (
      <View key={key} style={styles.itemContainer}>
        <CheckBox
          containerStyle={styles.checkboxContainer}
          checked={this.state.selectedCustomer.includes(item.poId)}
          onPress={() => this.toggleSingleCheckBox(item.poId)}
          checkedIcon={this.checkedIcon()}
          uncheckedIcon={this.uncheckedIcon()}
        />
        <RecollectionCustomer item={item} />
      </View>
    );
  };

  renderEmpty = () => {
    return (
      <View
        style={{
          marginTop: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{...Mixins.subtitle3}}>No Result</Text>
      </View>
    );
  };

  toggleAllCheckbox = async () => {
    const {customerList, filteredCustomerList, search} = this.state;
    let selectedCustomer = [];
    if (!!customerList) {
      if (search.length > 0) {
        if (this.checkingCheckAll()) {
          let currSelectedCustomer = [...this.state.selectedCustomer];
          await filteredCustomerList.forEach((element) => {
            currSelectedCustomer.splice(
              currSelectedCustomer.indexOf(element.poId),
              1,
            );
          });
          selectedCustomer = currSelectedCustomer;
        } else {
          filteredCustomerList.forEach((element) => {
            selectedCustomer.push(element.poId);
          });
        }
      } else {
        if (!this.checkingCheckAll()) {
          customerList.forEach((element) => {
            selectedCustomer.push(element.poId);
          });
        }
      }
    }
    this.setState({selectedCustomer: selectedCustomer});
  };

  checkingCheckAll = () => {
    const {customerList, filteredCustomerList, search, selectedCustomer} =
      this.state;
    if (!!customerList) {
      if (search.length > 0 && !!filteredCustomerList) {
        if (selectedCustomer.length < filteredCustomerList.length) {
          return false;
        } else {
          let allChecked = false;
          for (let i = 0; i < filteredCustomerList.length; i++) {
            if (
              selectedCustomer.find(
                (e) => e === filteredCustomerList[i].poId,
              ) !== undefined
            ) {
              allChecked = true;
            } else {
              allChecked = false;
              break;
            }
          }
          return allChecked;
        }
      } else {
        return customerList.length === selectedCustomer.length;
      }
    }
    return false;
  };

  toggleSingleCheckBox = (id) => {
    let selectedCustomer = [...this.state.selectedCustomer];
    if (selectedCustomer.includes(id)) {
      selectedCustomer.splice(selectedCustomer.indexOf(id), 1);
    } else {
      selectedCustomer.push(id);
    }
    this.setState({selectedCustomer: selectedCustomer});
  };

  uncheckedIcon = () => {
    return <View style={styles.unchecked} />;
  };

  checkedIcon = () => {
    return (
      <View style={styles.checked}>
        <View
          style={{
            backgroundColor: '#2A3386',
            width: 10,
            height: 10,
          }}
        />
      </View>
    );
  };

  navigateToRecollectionForm = () => {
    this.props.navigation.navigate('RecollectionForm');
  };

  render() {
    const {
      customerList,
      filteredCustomerList,
      isRefreshing,
      search,
      selectedCustomer,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <SearchBar
          onChangeText={this.updateSearch}
          value={this.state.search}
          lightTheme={true}
          inputStyle={styles.searchInputText}
          searchIcon={
            null
            // <SearchIcon height="20" width="20" fill="#2D2C2C" />
          }
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          placeholder="Search..."
        />
        <View style={styles.headerContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox
              title="Select All Result"
              textStyle={[styles.text, {color: '#121C78'}]}
              containerStyle={styles.checkboxContainer}
              checked={this.checkingCheckAll()}
              onPress={this.toggleAllCheckbox}
              checkedIcon={this.checkedIcon()}
              uncheckedIcon={this.uncheckedIcon()}
            />
            {selectedCustomer.length > 0 && (
              <>
                <View style={styles.lineVertical} />
                <TouchableOpacity
                  onPress={() => this.setState({selectedCustomer: []})}>
                  <Text style={[styles.text, {color: '#F94242', fontSize: 9}]}>
                    Clear Selected
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text
            style={[
              styles.text,
              {color: '#ABABAB', fontSize: 8, textAlign: 'right'},
            ]}>{`${selectedCustomer.length} Item Selected`}</Text>
        </View>
        <FlatList
          data={search === '' ? customerList : filteredCustomerList}
          renderItem={({item, index}) => this.renderItem(item, index)}
          refreshing={isRefreshing}
          onRefresh={this.refreshStockTakeList}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={this.renderEmpty}
        />
        <Button
          title="Submit"
          titleStyle={styles.buttonText}
          buttonStyle={[styles.button, {marginHorizontal: 0}]}
          onPress={this.navigateToRecollectionForm}
          disabled={selectedCustomer.length === 0}
          disabledStyle={{backgroundColor: '#ABABAB'}}
          disabledTitleStyle={{color: '#FFF'}}
        />
      </SafeAreaProvider>
    );
  }
}

const RECOLLECTIONLIST = [
  {
    date: new Date(),
    poId: 'PO00001234',
    client: {
      name: 'Messi',
    },
    status: 'Waiting',
  },
  {
    date: new Date(),
    poId: 'PO00001235',
    client: {
      name: 'Roberto',
    },
    status: 'Waiting',
  },
  {
    date: new Date(),
    poId: 'PO00001236',
    client: {
      name: 'Li',
    },
    status: 'Waiting',
  },
  {
    date: new Date(),
    poId: 'PO00001237',
    client: {
      name: 'Si',
    },
    status: 'Waiting',
  },
];

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
  },
  searchInputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D5D5D5',
    height: 35,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5FB',
    marginHorizontal: 20,
    paddingRight: 10,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  button: {
    ...Mixins.bgButtonPrimary,
    height: 60,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    color: '#FFF',
  },
  text: {
    ...Mixins.small1,
    fontWeight: '400',
    lineHeight: 19,
  },
  lineVertical: {
    borderRightWidth: 1,
    height: 15,
    marginRight: 8,
    borderColor: '#D5D5D5',
  },
  checkboxContainer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    margin: 0,
    marginRight: 0,
    paddingHorizontal: 0,
    paddingVertical: 5,
  },
  checked: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2A3386',
    padding: 3,
    marginRight: 5,
    marginVertical: 3,
  },
  unchecked: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#6C6B6B',
    padding: 5,
    marginRight: 5,
    marginVertical: 3,
  },
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCustomer);
