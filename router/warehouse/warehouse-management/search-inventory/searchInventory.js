import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
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
    };
    this.submitSearch.bind(this);
  }

  componentDidMount() {
    this.getWarehouseList();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setBottomBar(true);
    });
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
      obj = {locationId: value};
    }
    this.setState(obj);
  };

  getWarehouseList = async () => {
    const result = await getData('/warehouses');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        warehouseList: result,
      });
    }
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
    const {warehouseList, warehouse, locationId} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body}>
          <View style={styles.searchContainer}>
            <View style={[styles.inputWrapper, {zIndex: 2}]}>
              <Text style={styles.inputTitle}>Warehouse</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={warehouse}
                  onValueChange={(value) =>
                    this.handleInput(value, 'warehouse')
                  }
                  itemStyle={{
                    height: 50,
                    borderRadius: 5,
                    marginHorizontal: -10,
                  }}
                  style={{height: 50}}>
                  <Picker.Item
                    label="Select Warehouse"
                    value={null}
                    style={styles.text}
                  />
                  {warehouseList !== null &&
                    warehouseList.map((item) => {
                      return (
                        <Picker.Item
                          key={item.id}
                          label={item.name}
                          value={item.id}
                          style={styles.text}
                        />
                      );
                    })}
                </Picker>
              </View>
            </View>
            <View style={[styles.inputWrapper, {zIndex: 1}]}>
              <Text style={styles.inputTitle}>Search Location ID</Text>
              <Input
                placeholder="Search Location ID"
                value={locationId}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                renderErrorMessage={false}
                onChangeText={(text) => this.handleInput(text, 'locationId')}
              />
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
  searchContainer: {
    flexShrink: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  resultContainer: {
    flexShrink: 1,
    padding: 20,
  },
  inputWrapper: {
    marginTop: 10,
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
  inputTitle: {
    ...Mixins.subtitle3,
    lineHeight: 21,
  },
  inputContainer: {
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    marginTop: 5,
    marginBottom: 10,
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
