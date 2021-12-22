import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
// helper
import {getData} from '../../../../component/helper/network';
// style
import Mixins from '../../../../mixins';
// icon
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

class SearchInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouseList: null,
      warehouseName: '',
      warehouse: null,
      locationId: '',
      locationList: null,
      filteredLocationList: null,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getWarehouseList();
      this.props.setBottomBar(true);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.warehouse !== this.state.warehouse) {
      this.setState({
        locationId: '',
        locationList: null,
        filteredLocationList: null,
      });
      if (this.state.warehouse !== null) {
        this.getLocationList();
      }
    }
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  submitSearch = () => {
    const {warehouse, locationId} = this.state;
    if (warehouse === null && locationId === '') {
      return;
    }
    this.navigateToSearchInventoryList();
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'warehouse') {
      const {warehouseList} = this.state;
      let selectedWarehouse = warehouseList.find((el) => el.id === value);
      if (selectedWarehouse === undefined) {
        obj = {warehouse: value, warehouseName: ''};
      } else {
        obj = {warehouse: value, warehouseName: selectedWarehouse.name};
      }
    } else if (type === 'locationId') {
      if (value === '') {
        obj = {locationId: value, filteredLocationList: null};
      } else {
        obj = {
          locationId: value,
          filteredLocationList: this.filterLocationList(value),
        };
      }
    }
    this.setState(obj);
  };

  handleSelect = (value, type) => {
    if (type === 'locationId') {
      obj = {
        locationId: value.locationId,
        filteredLocationList: null,
      };
    }
    this.setState(obj);
  };

  getWarehouseList = async () => {
    const result = await getData('/warehouses/names');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        warehouseList: result,
      });
    }
  };

  getLocationList = async () => {
    const {warehouse} = this.state;
    const result = await getData(`/warehouses/${warehouse}/containers`);
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        locationList: result,
      });
    }
  };

  filterLocationList = (value) => {
    const {locationList} = this.state;
    if (locationList !== null) {
      return locationList.filter((location) => {
        if (location.locationId !== null)
          return location.locationId
            .toLowerCase()
            .includes(value.toLowerCase());
      });
    }
    return null;
  };

  renderItem = (item, type) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.inputContainer,
          {justifyContent: 'center', paddingHorizontal: 10},
        ]}
        onPress={() => this.handleSelect(item, type)}>
        <Text style={styles.inputText}>{item.locationId}</Text>
      </TouchableOpacity>
    );
  };

  navigateToSearchInventoryList = () => {
    const {warehouse, locationId, warehouseName} = this.state;
    this.props.setBottomBar(false);
    this.props.navigation.navigate('SearchInventoryList', {
      warehouseName: warehouseName,
      warehouse: warehouse,
      locationId: locationId,
    });
  };

  navigateToSearchInventoryBarcode = () => {
    this.props.setBottomBar(false);
    this.props.navigation.navigate('SearchInventoryBarcode');
  };

  render() {
    const {
      warehouseList,
      warehouse,
      locationId,
      filteredLocationList,
      locationList,
    } = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <View style={styles.body}>
          <View style={styles.searchContainer}>
            <View style={[styles.inputWrapper, {zIndex: 2}]}>
              <Text style={styles.inputTitle}>Warehouse</Text>
              <SelectDropdown
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.dropdownButtonText}
                rowTextStyle={[
                  styles.dropdownButtonText,
                  {textAlign: 'center'},
                ]}
                data={!!warehouseList ? warehouseList : []}
                defaultButtonText="Select Warehouse"
                onSelect={(selectedItem) => {
                  this.handleInput(selectedItem.id, 'warehouse');
                }}
                buttonTextAfterSelection={(selectedItem) => {
                  return selectedItem.name;
                }}
                rowTextForSelection={(item) => {
                  return item.name;
                }}
                renderDropdownIcon={() => (
                  <View style={{marginRight: 10}}>
                    <ArrowDown fill="#2D2C2C" width="20px" height="20px" />
                  </View>
                )}
              />
            </View>
            <View
              style={
                Platform.OS === 'ios'
                  ? [styles.inputWrapper, {zIndex: 1}]
                  : styles.inputWrapper
              }>
              <Text style={styles.inputTitle}>Search Location ID</Text>
              <Input
                placeholder="Search Location ID"
                value={locationId}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                renderErrorMessage={false}
                onChangeText={(text) => this.handleInput(text, 'locationId')}
                onBlur={() => {
                  this.setState({
                    filteredLocationList: null,
                  });
                }}
                disabled={warehouse === null}
                disabledInputStyle={{backgroundColor: '#EFEFEF'}}
              />
              <View style={styles.dropdownContainer}>
                {locationId !== '' &&
                  ((filteredLocationList !== null &&
                    filteredLocationList.length === 0) ||
                    locationList === null) && (
                    <View
                      style={[
                        styles.inputContainer,
                        {justifyContent: 'center', paddingHorizontal: 10},
                      ]}>
                      <Text style={styles.inputText}>No Result</Text>
                    </View>
                  )}
                {filteredLocationList !== null &&
                  filteredLocationList
                    .slice(0, 5)
                    .map((location) => this.renderItem(location, 'locationId'))}
              </View>
            </View>
            <Button
              title="Search"
              titleStyle={styles.buttonText}
              buttonStyle={[
                styles.button,
                {marginHorizontal: 0, marginTop: 20},
              ]}
              onPress={this.submitSearch}
            />
            <Button
              title="Scan By Barcode"
              titleStyle={styles.buttonText}
              buttonStyle={[
                styles.button,
                {marginHorizontal: 0, marginVertical: 20},
              ]}
              onPress={this.navigateToSearchInventoryBarcode}
            />
          </View>
        </View>
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
  searchContainer: {
    flexShrink: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputWrapper: {
    marginTop: 10,
  },
  text: {
    ...Mixins.subtitle3,
    fontSize: 14,
    lineHeight: 21,
  },
  inputTitle: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    marginBottom: 10,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    borderColor: '#D5D5D5',
  },
  inputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    paddingHorizontal: 10,
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginHorizontal: 10,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  dropdownButton: {
    width: '100%',
    maxHeight: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ABABAB',
    backgroundColor: 'white',
    paddingHorizontal: 0,
  },
  dropdownButtonText: {
    paddingHorizontal: 10,
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#424141',
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  dropdownContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 70,
    zIndex: 3,
    backgroundColor: '#FFF',
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchInventory);
