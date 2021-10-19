import React from 'react';
import {
  ScrollView,
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
import moment from 'moment';
// component
import RelocationResult from '../../../../component/extend/ListItem-relocation-result';
// style
import Mixins from '../../../../mixins';
// icon
import TimesCircle from '../../../../assets/icon/iconmonstr-x-mark-5 1mobile.svg';

class RelocationRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: '',
      itemCode: '',
      clientId: null,
      itemCodeId: null,
      clientList: null,
      itemCodeList: null,
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
      obj = {client: value.name, clientId: value.id, clientList: null};
    } else if (type === 'itemCode') {
      obj = {itemCode: value.name, itemCodeId: value.id, itemCodeList: null};
    } else if (type === 'clientList') {
      if (value === '') {
        obj = {client: value, clientList: null, clientId: null, product: ''};
      } else {
        obj = {client: value, clientList: CLIENTLIST};
      }
    } else if (type === 'itemCodeList') {
      if (value === '') {
        obj = {itemCode: value, itemCodeList: null, itemCodeId: null};
      } else {
        obj = {itemCode: value, itemCodeList: PRODUCTLIST};
      }
    }
    this.setState(obj);
  };

  resetInput = () => {
    this.setState({
      client: '',
      itemCode: '',
      clientId: null,
      itemCodeId: null,
      clientList: null,
      itemCodeList: null,
    });
  };

  navigateToRequestRelocationForm = () => {
    this.props.navigation.navigate('RequestRelocationForm');
  };

  navigateToRequestRelocationBarcode = () => {
    this.props.navigation.navigate('RequestRelocationBarcode');
  };

  renderItem = (item, type) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.inputContainer,
          {
            justifyContent: 'center',
            paddingHorizontal: 10,
          },
        ]}
        onPress={() => this.handleInput(item, type)}>
        <Text style={styles.inputText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  renderTimesIcon = () => {
    return (
      <TouchableOpacity onPress={this.resetInput}>
        <TimesCircle height="20" width="20" fill="#121C78" />
      </TouchableOpacity>
    );
  };

  render() {
    const {
      searchResult,
      client,
      clientId,
      clientList,
      itemCode,
      itemCodeList,
    } = this.state;
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
                rightIcon={clientId === null ? null : this.renderTimesIcon()}
                renderErrorMessage={false}
                onChangeText={(text) => this.handleInput(text, 'clientList')}
              />
              <View style={styles.dropdownContainer}>
                {clientList !== null &&
                  clientList.map((client) => this.renderItem(client, 'client'))}
              </View>
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
                onChangeText={(text) => this.handleInput(text, 'itemCodeList')}
              />
              <View style={styles.dropdownContainer}>
                {itemCodeList !== null &&
                  itemCodeList.map((item) => this.renderItem(item, 'itemCode'))}
              </View>
            </View>
            <Button
              title="Search"
              titleStyle={styles.buttonText}
              buttonStyle={[
                styles.button,
                {marginHorizontal: 0, marginTop: 20},
              ]}
              disabled={client === '' || itemCode === ''}
              disabledStyle={{backgroundColor: '#ABABAB'}}
              disabledTitleStyle={{color: '#FFF'}}
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
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text style={[styles.title, {marginRight: 20}]}>Results</Text>
                  <Text
                    style={[styles.title, styles.textBlue, {flexWrap: 'wrap'}]}>
                    {`${client} ${itemCode}`}
                  </Text>
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

const CLIENTLIST = [
  {
    name: 'Roberto',
    id: '1',
  },
  {
    name: 'Roberto Cheng',
    id: '2',
  },
  {
    name: 'Roberto Van',
    id: '3',
  },
  {
    name: 'Roberto Vien',
    id: '4',
  },
];

const PRODUCTLIST = [
  {
    name: '0911234567',
    id: '0911234567',
  },
  {
    name: '092223346',
    id: '092223346',
  },
  {
    name: '0912234566',
    id: '0912234566',
  },
  {
    name: '0912334567',
    id: '0912334567',
  },
];

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
    overflow: 'visible',
    zIndex: 1,
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
    borderColor: '#D5D5D5',
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
  dropdownContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 70,
    zIndex: 1,
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

export default connect(mapStateToProps, mapDispatchToProps)(RelocationRequest);
