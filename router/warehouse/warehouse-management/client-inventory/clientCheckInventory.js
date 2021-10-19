import React from 'react';
import {
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
    };
    this.submitSearch.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.props.setBottomBar(true);
    });
  }

  submitSearch = () => {
    const {client, product} = this.state;
    if (client === '' || product === '') {
      return;
    }
    this.navigateToClientStorageList();
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'client') {
      obj = {client: value.name, clientId: value.id, clientList: null};
    } else if (type === 'product') {
      obj = {product: value.name, productId: value.id, productList: null};
    } else if (type === 'clientList') {
      if (value === '') {
        obj = {client: value, clientList: null, clientId: null, product: ''};
      } else {
        obj = {client: value, clientList: CLIENTLIST};
      }
    } else if (type === 'productList') {
      if (value === '') {
        obj = {product: value, productList: null, productId: null};
      } else {
        obj = {product: value, productList: PRODUCTLIST};
      }
    }
    this.setState(obj);
  };

  resetInput = () => {
    this.setState({
      client: '',
      product: '',
      clientId: null,
      productId: null,
      clientList: null,
      productList: null,
    });
  };

  navigateToClientStorageList = () => {
    const {client, product} = this.state;
    this.props.setBottomBar(false);
    this.props.navigation.navigate('ClientStorageList', {
      client: client,
      product: product,
    });
  };

  renderItem = (item, type) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.inputContainer,
          {justifyContent: 'center', paddingHorizontal: 10},
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
      client,
      clientId,
      product,
      productId,
      clientList,
      productList,
    } = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <View style={styles.body}>
          <View style={styles.searchContainer}>
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
                {productList !== null &&
                  productList.map((product) =>
                    this.renderItem(product, 'product'),
                  )}
              </View>
            </View>
            <Button
              title="Search"
              titleStyle={styles.buttonText}
              buttonStyle={[
                styles.button,
                {marginHorizontal: 0, marginTop: 20},
              ]}
              disabled={client === '' || product === ''}
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
    overflow: 'visible',
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientCheckInventory);
