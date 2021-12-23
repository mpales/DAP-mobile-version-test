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
import RelocateItem from '../../../../component/extend/ListItem-relocate-item';
import Loading from '../../../../component/loading/loading';
// helper
import {getData} from '../../../../component/helper/network';
import {productGradeToString} from '../../../../component/helper/string';
// style
import Mixins from '../../../../mixins';

class SelectRelocateItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredProductList: null,
      productList: null,
      selectedProduct: this.props.selectedRequestRelocation,
      search: '',
      isLoading: true,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.getLocationProductList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.search !== this.state.search) {
      this.filterProductList();
    }
  }

  updateSearch = (search) => {
    this.setState({search});
  };

  refreshProductList = async () => {
    this.setState({
      isRefreshing: true,
    });
    this.getLocationProductList();
    this.setState({
      isRefreshing: false,
    });
  };

  getLocationProductList = async () => {
    const {selectedLocationId} = this.props;
    const result = await getData(
      `/stocks/product-storage/location-id/${selectedLocationId}`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        productList: result,
      });
    } else {
      this.handleRequestError(result);
    }
    this.setState({isLoading: false});
  };

  filterProductList = () => {
    const {search, productList} = this.state;
    if (productList !== null) {
      let filteredProductList = [];
      if (search.length > 0) {
        filteredProductList = productList.filter((item) => {
          return (
            item.product.item_code
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            item.client.name.toLowerCase().includes(search.toLowerCase()) ||
            productGradeToString(item.grade)
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        });
      }
      this.setState({filteredProductList: filteredProductList});
    }
  };

  toggleAllCheckbox = async () => {
    const {productList, filteredProductList, search} = this.state;
    let selectedProduct = [];
    if (!!productList) {
      if (search.length > 0) {
        if (this.checkingCheckAll()) {
          let currSelectedProduct = [...this.state.selectedProduct];
          await filteredProductList.forEach((element) => {
            currSelectedProduct.splice(currSelectedProduct.indexOf(element), 1);
          });
          selectedProduct = currSelectedProduct;
        } else {
          filteredProductList.forEach((element) => {
            selectedProduct.push(element);
          });
        }
      } else {
        if (!this.checkingCheckAll()) {
          productList.forEach((element) => {
            selectedProduct.push(element);
          });
        }
      }
    }
    this.setState({selectedProduct: selectedProduct});
  };

  checkingCheckAll = () => {
    const {productList, filteredProductList, search, selectedProduct} =
      this.state;
    if (!!productList) {
      if (search.length > 0 && !!filteredProductList) {
        if (selectedProduct.length < filteredProductList.length) {
          return false;
        } else {
          let allChecked = false;
          for (let i = 0; i < filteredProductList.length; i++) {
            if (
              selectedProduct.find(
                (e) => e.id === filteredProductList[i].id,
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
        return productList.length === selectedProduct.length;
      }
    }
    return false;
  };

  toggleSingleCheckBox = (item) => {
    let selectedProduct = [...this.state.selectedProduct];
    if (this.checkSingleProduct(item)) {
      selectedProduct.splice(selectedProduct.indexOf(item), 1);
    } else {
      selectedProduct.push(item);
    }
    this.setState({selectedProduct: selectedProduct});
  };

  checkSingleProduct = (item) => {
    const {selectedProduct} = this.state;
    let isChecked = selectedProduct.some((element) => element.id === item.id);
    return isChecked;
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

  navigateToRequestRelocationForm = () => {
    this.props.setSelectedRequestRelocation(this.state.selectedProduct);
    this.props.navigation.goBack();
  };

  renderItem = (item, key) => {
    return (
      <View key={key} style={styles.itemContainer}>
        <CheckBox
          containerStyle={styles.checkboxContainer}
          checked={this.checkSingleProduct(item)}
          onPress={() => this.toggleSingleCheckBox(item)}
          checkedIcon={this.checkedIcon()}
          uncheckedIcon={this.uncheckedIcon()}
        />
        <RelocateItem item={item} />
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

  render() {
    const {
      productList,
      filteredProductList,
      isRefreshing,
      isLoading,
      search,
      selectedProduct,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        {isLoading && <Loading />}
        <SearchBar
          onChangeText={this.updateSearch}
          value={this.state.search}
          lightTheme={true}
          inputStyle={styles.searchInputText}
          searchIcon={
            null
            // <SearchIcon height="20" width="20" fill="#2D2C2C" />
          }
          rightIcon={'x'}
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
            {selectedProduct.length > 0 && (
              <>
                <View style={styles.lineVertical} />
                <TouchableOpacity
                  onPress={() => this.setState({selectedProduct: []})}>
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
            ]}>{`${selectedProduct.length} Item Selected`}</Text>
        </View>
        <FlatList
          data={search === '' ? productList : filteredProductList}
          renderItem={({item, index}) => this.renderItem(item, index)}
          refreshing={isRefreshing}
          onRefresh={this.refreshProductList}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={this.renderEmpty}
        />
        <Button
          title="Confirm"
          titleStyle={styles.buttonText}
          buttonStyle={[styles.button, {marginHorizontal: 0}]}
          onPress={this.navigateToRequestRelocationForm}
          disabled={selectedProduct.length === 0}
          disabledStyle={{backgroundColor: '#ABABAB'}}
          disabledTitleStyle={{color: '#FFF'}}
        />
      </SafeAreaProvider>
    );
  }
}

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
    height: 50,
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
  return {
    selectedRequestRelocation:
      state.originReducer.filters.selectedRequestRelocation,
    selectedLocationId: state.originReducer.filters.selectedLocationId,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedRequestRelocation: (data) => {
      return dispatch({type: 'SelectedRequestRelocation', payload: data});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectRelocateItem);
