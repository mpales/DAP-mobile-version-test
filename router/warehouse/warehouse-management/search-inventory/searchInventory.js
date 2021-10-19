import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
// style
import Mixins from '../../../../mixins';
// icon
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

class SearchInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouseList: WAREHOUSELIST,
      warehouse: null,
      locationId: '',
    };
    this.submitSearch.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.props.setBottomBar(true);
    });
  }

  submitSearch = () => {
    const {warehouse, locationId} = this.state;
    if (warehouse === '' || locationId === '') {
      return;
    }
    this.navigateToSearchInventoryList();
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'warehouse') {
      obj = {warehouse: value};
    } else if (type === 'locationId') {
      obj = {locationId: value};
    }
    this.setState(obj);
  };

  navigateToSearchInventoryList = () => {
    const {warehouse, locationId} = this.state;
    this.props.setBottomBar(false);
    this.props.navigation.navigate('SearchInventoryList', {
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
            <View style={styles.inputWrapper}>
              <Text style={styles.inputTitle}>Warehouse</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={warehouse}
                  onValueChange={(value) =>
                    this.handleInput(value, 'warehouse')
                  }
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
            <View style={styles.inputWrapper}>
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

const WAREHOUSELIST = [
  {
    id: 'warehouse 1',
    name: 'warehouse 1',
  },
  {
    id: 'warehouse 2',
    name: 'warehouse 2',
  },
  {
    id: 'warehouse 3',
    name: 'warehouse 3',
  },
];

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
