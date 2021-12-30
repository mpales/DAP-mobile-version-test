import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {getData} from '../../../../component/helper/network';
// style
import Mixins from '../../../../mixins';
// icon
import TimesCircle from '../../../../assets/icon/iconmonstr-x-mark-5 1mobile.svg';

class ClientCheckInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: '',
      product: '',
      clientId: null,
      productId: null,
      clientList: null,
      productList: null,
      filteredClientList: null,
      filteredProductList: null,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getClientList();
      this.props.setBottomBar(true);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.clientId !== this.state.clientId) {
      if (this.state.clientId !== null) {
        this.getClientProductList();
      } else {
        this.setState({
          productList: null,
          filteredProductList: null,
        });
      }
    }
  }

  getClientList = async () => {
    const result = await getData('/clients/name');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        clientList: result,
      });
    }
  };

  getClientProductList = async () => {
    const {clientId} = this.state;
    const result = await getData(`/clients/${clientId}/products`);
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        productList: result,
      });
    }
  };

  submitSearch = () => {
    const {client, product} = this.state;
    if (client === '' || product === '') {
      return;
    }
    this.navigateToClientStorageList();
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'clientList') {
      if (value === '') {
        obj = {
          client: value,
          filteredClientList: null,
          clientId: null,
          product: '',
        };
      } else {
        obj = {
          client: value,
          filteredClientList: this.filterClientList(value),
          clientId: null,
          product: '',
          productList: null,
        };
      }
    } else if (type === 'productList') {
      if (value === '') {
        obj = {product: value, filteredProductList: null, productId: null};
      } else {
        obj = {
          product: value,
          filteredProductList: this.filterClientProductList(value),
        };
      }
    }
    this.setState(obj);
  };

  handleSelect = (value, type) => {
    if (type === 'client') {
      obj = {client: value.name, clientId: value.id, filteredClientList: null};
    } else if (type === 'product') {
      obj = {
        product: `${value.item_code}-${value.description}`,
        productId: value._id,
        filteredProductList: null,
      };
    }
    this.setState(obj);
  };

  filterClientList = (value) => {
    const {clientList} = this.state;
    if (clientList !== null) {
      return clientList.filter((client) => {
        if (client.name !== null)
          return client.name.toLowerCase().includes(value.toLowerCase());
      });
    }
    return null;
  };

  filterClientProductList = (value) => {
    const {productList} = this.state;
    if (productList !== null) {
      return productList.filter((product, index) => {
        if (product.description !== null) {
          return (
            product.description.toLowerCase().includes(value.toLowerCase()) ||
            product.item_code.toLowerCase().includes(value.toLowerCase())
          );
        }
      });
    }
    return null;
  };

  resetInput = () => {
    this.setState({
      client: '',
      product: '',
      clientId: null,
      productId: null,
      filteredClientList: null,
      filteredProductList: null,
    });
  };

  navigateToClientStorageList = () => {
    const {client, clientId, product, productId} = this.state;
    this.props.setBottomBar(false);
    this.props.navigation.navigate('ClientStorageList', {
      client: {
        id: clientId,
        name: client,
      },
      product: {
        id: productId,
        name: product,
      },
    });
  };

  renderItem = (item, type) => {
    return (
      <TouchableOpacity
        key={type === 'product' ? item._id : item.id}
        style={[
          styles.inputContainer,
          {justifyContent: 'center', paddingHorizontal: 10},
        ]}
        onPress={() => this.handleSelect(item, type)}>
        {type === 'product' ? (
          <Text style={styles.inputText}>
            {`${item.item_code}-${item.description}`}
          </Text>
        ) : (
          <Text style={styles.inputText}>{item.name}</Text>
        )}
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
      client,
      clientId,
      clientList,
      product,
      productId,
      productList,
      filteredClientList,
      filteredProductList,
    } = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <View style={styles.body}>
          <View style={styles.searchContainer}>
            <View
              style={
                Platform.OS === 'ios'
                  ? [styles.inputWrapper, {zIndex: 1}]
                  : styles.inputWrapper
              }>
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
                  ((filteredClientList !== null &&
                    filteredClientList.length === 0) ||
                    clientList === null) && (
                    <View
                      style={[
                        styles.inputContainer,
                        {justifyContent: 'center', paddingHorizontal: 10},
                      ]}>
                      <Text style={styles.inputText}>No Result</Text>
                    </View>
                  )}
                {filteredClientList !== null &&
                  filteredClientList
                    .slice(0, 5)
                    .map((client) => this.renderItem(client, 'client'))}
              </View>
            </View>
            <View
              style={
                Platform.OS === 'ios'
                  ? [styles.inputWrapper, {zIndex: 1}]
                  : styles.inputWrapper
              }>
              <Text style={styles.inputTitle}>Search Product</Text>
              <Input
                placeholder="Search Product"
                value={product}
                disabled={clientId === null ? true : false}
                disabledInputStyle={{backgroundColor: '#EFEFEF'}}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                renderErrorMessage={false}
                onChangeText={(text) => this.handleInput(text, 'productList')}
              />
              <View style={styles.dropdownContainer}>
                {product !== '' &&
                  productId === null &&
                  ((filteredProductList !== null &&
                    filteredProductList.length === 0) ||
                    productList === null) && (
                    <View
                      style={[
                        styles.inputContainer,
                        {justifyContent: 'center', paddingHorizontal: 10},
                      ]}>
                      <Text style={styles.inputText}>No Result</Text>
                    </View>
                  )}
                {filteredProductList !== null &&
                  filteredProductList
                    .slice(0, 5)
                    .map((product) => this.renderItem(product, 'product'))}
              </View>
            </View>
            <Button
              title="Search"
              titleStyle={styles.buttonText}
              buttonStyle={[
                styles.button,
                {marginHorizontal: 0, marginTop: 20},
              ]}
              disabled={clientId === null || productId === null}
              disabledStyle={{backgroundColor: '#ABABAB'}}
              disabledTitleStyle={{color: '#FFF'}}
              onPress={this.submitSearch}
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
    overflow: 'visible',
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientCheckInventory);
