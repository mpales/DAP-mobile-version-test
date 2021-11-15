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
import {getData} from '../../../../component/helper/network';
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
      clientList: null,
      searchResult: null,
      filteredClientList: null,
      searchSubmitted: false,
    };
    this.submitSearch.bind(this);
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getClientList();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getClientList = async () => {
    const result = await getData('/clients');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        clientList: result,
      });
    }
  };

  getClientProductList = async () => {
    const {clientId, itemCode} = this.state;
    const result = await getData(
      `/stocks/product-storage/client/${clientId}/item-code/${
        !!itemCode ? itemCode : 0
      }`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        searchResult: result,
      });
    }
    this.setState({searchSubmitted: true});
  };

  submitSearch = () => {
    const {client, itemCode} = this.state;
    if (client === '') {
      return;
    }
    this.getClientProductList();
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'clientList') {
      if (value === '') {
        obj = {
          client: value,
          filteredClientList: null,
          clientId: null,
          itemCode: '',
          searchSubmitted: false,
        };
      } else {
        obj = {
          client: value,
          filteredClientList: this.filterClientList(value),
          searchSubmitted: false,
        };
      }
    } else if (type === 'itemCodeList') {
      obj = {
        itemCode: value,
        searchSubmitted: false,
      };
    }
    this.setState(obj);
  };

  handleSelect = (value, type) => {
    if (type === 'client') {
      obj = {client: value.name, clientId: value.id, filteredClientList: null};
    }
    this.setState(obj);
  };

  filterClientList = (value) => {
    const {clientList} = this.state;
    if (clientList !== null) {
      return clientList.filter((client, index) => {
        if (client.name !== null && index < 5)
          return client.name.toLowerCase().includes(value.toLowerCase());
      });
    }
    return null;
  };

  resetInput = () => {
    this.setState({
      client: '',
      itemCode: '',
      clientId: null,
      filteredClientList: null,
      searchSubmitted: false,
    });
  };

  navigateToRequestRelocationForm = (data) => {
    const {client, clientId} = this.state;
    this.props.navigation.navigate('RequestRelocationForm', {
      productStorage: {...data, client: {id: clientId, name: client}},
    });
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
        onPress={() => this.handleSelect(item, type)}>
        <Text style={styles.inputText}>
          {type === 'client' ? item.name : item.item_code}
        </Text>
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
      filteredClientList,
      itemCode,
      searchSubmitted,
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
                {client !== '' &&
                  clientId === null &&
                  filteredClientList !== null &&
                  filteredClientList.length === 0 && (
                    <View
                      style={[
                        styles.inputContainer,
                        {justifyContent: 'center', paddingHorizontal: 10},
                      ]}>
                      <Text style={styles.inputText}>No Result</Text>
                    </View>
                  )}
                {filteredClientList !== null &&
                  filteredClientList.map((client) =>
                    this.renderItem(client, 'client'),
                  )}
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
                disabled={clientId === null ? true : false}
                disabledInputStyle={{backgroundColor: '#EFEFEF'}}
              />
            </View>
            <Button
              title="Search"
              titleStyle={styles.buttonText}
              buttonStyle={[
                styles.button,
                {marginHorizontal: 0, marginTop: 20},
              ]}
              disabled={clientId === null}
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
          {searchSubmitted && (
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
                <Text style={[styles.text, styles.textBlue]}>{`${
                  searchResult === null ? 0 : searchResult.length
                } Result`}</Text>
              </View>
              {searchResult !== null &&
                searchResult.map((item, index) => (
                  <RelocationResult
                    key={index}
                    item={item}
                    navigate={this.navigateToRequestRelocationForm}
                  />
                ))}
              {searchResult === null && (
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: '40%',
                  }}>
                  <Text style={styles.title}>No Result</Text>
                </View>
              )}
            </View>
          )}
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
