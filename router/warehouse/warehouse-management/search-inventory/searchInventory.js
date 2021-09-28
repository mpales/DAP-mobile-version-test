import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import moment from 'moment';
// style
import Mixins from '../../../../mixins';
// icon
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

class SearchInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouse: '',
      locationId: '',
    };
    this.submitSearch.bind(this);
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
    const {warehouse, locationId} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body}>
          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputTitle}>Client</Text>
              <Input
                placeholder="Select Client"
                value={warehouse}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                renderErrorMessage={false}
                rightIcon={<ArrowDown height="20" width="20" fill="#2D2C2C" />}
                rightIconContainerStyle={{marginRight: 10}}
                onChangeText={(text) => this.handleInput(text, 'warehouse')}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputTitle}>Item Code</Text>
              <Input
                placeholder="Enter Item Code"
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
    marginBottom: 10,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
  },
  inputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
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
