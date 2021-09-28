import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import moment from 'moment';
// component
import RelocationResult from '../../../../component/extend/ListItem-relocation-result';
// style
import Mixins from '../../../../mixins';
// icon
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

class RelocationRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: '',
      itemCode: '',
      searchResult: null,
    };
    this.submitSearch.bind(this);
  }

  submitSearch = () => {
    const {client, itemCode} = this.state;
    if (client === '' || itemCode === '') {
      return;
    }
    this.setState({
      searchResult: SEARCHRESULT,
    });
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'client') {
      obj = {client: value};
    } else if (type === 'itemCode') {
      obj = {itemCode: value};
    }
    this.setState(obj);
  };

  navigateToRequestRelocationForm = () => {
    this.props.navigation.navigate('RequestRelocationForm');
  };

  navigateToRequestRelocationBarcode = () => {
    this.props.navigation.navigate('RequestRelocationBarcode');
  };

  render() {
    const {searchResult, client, itemCode} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body}>
          <View style={styles.searchContainer}>
            <Text style={styles.title}>Request Relocation</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputTitle}>Client</Text>
              <Input
                placeholder="Select Client"
                value={client}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                renderErrorMessage={false}
                rightIcon={<ArrowDown height="20" width="20" fill="#2D2C2C" />}
                rightIconContainerStyle={{marginRight: 10}}
                onChangeText={(text) => this.handleInput(text, 'client')}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputTitle}>Item Code</Text>
              <Input
                placeholder="Enter Item Code"
                value={itemCode}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                renderErrorMessage={false}
                onChangeText={(text) => this.handleInput(text, 'itemCode')}
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
              onPress={this.navigateToRequestRelocationBarcode}
            />
          </View>
          {searchResult !== null && (
            <View style={styles.resultContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.title}>Result</Text>
                  <Text
                    style={[
                      styles.title,
                      styles.textBlue,
                      {marginLeft: 20},
                    ]}>{`${client} ${itemCode}`}</Text>
                </View>
                <Text
                  style={[
                    styles.text,
                    styles.textBlue,
                  ]}>{`${searchResult.length} Result`}</Text>
              </View>
              {searchResult.map((item, index) => (
                <RelocationResult
                  key={index}
                  item={item}
                  navigate={this.navigateToRequestRelocationForm}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const SEARCHRESULT = [
  {
    jobId: 'GCPL STOCK TAKE 20 02 20',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
  },
  {
    jobId: 'GCPL STOCK TAKE 20 02 20',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
  },
  {
    jobId: 'GCPL STOCK TAKE 20 02 20',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
  },
  {
    jobId: 'GCPL STOCK TAKE 20 02 20',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
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
    borderBottomWidth: 1,
    borderBottomColor: '#ABABAB',
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

export default connect(mapStateToProps, mapDispatchToProps)(RelocationRequest);
