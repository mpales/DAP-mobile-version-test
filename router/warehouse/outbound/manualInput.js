import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Banner from '../../../component/banner/banner';

class ManualInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputCode: '',
      dataCode: null,
      indexData: null,
      bayCode: null,
      error: false,
      inputBayBarcode: this.props.route.params?.inputBayBarcode ?? false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {navigation} = props;
    const {dataCode} = state;
    if (dataCode === null) {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.dataCode !== undefined
      ) {
        return {
          ...state,
          dataCode: routes[index].params.dataCode,
          indexData: routes[index].params.indexData,
        };
      }
    }
    return {...state};
  }

  handleConfirm = () => {
    if (this.state.inputCode !== this.state.dataCode) {
      this.setState({inputCode: '', error: true});
    } else {
      this.props.setBottomBar(false);
      this.props.navigation.navigate({
        name: 'Barcode',
        params: {
          manualCode: this.state.inputCode,
          indexData: this.state.indexData,
          inputBayBarcode: this.state.inputBayBarcode,
        },
      });
    }
  };

  closeNotifBanner = () => {
    this.setState({error: false});
  };

  render() {
    const {inputBayBarcode} = this.state;
    return (
      <View style={styles.container}>
        {this.state.error && (
          <Banner
            title="Invalid input barcode , please try it again"
            backgroundColor="#F1811C"
            closeBanner={this.closeNotifBanner}
          />
        )}
        <View style={{padding: 20}}>
          <Text style={styles.title}>{`Input Manual ${
            inputBayBarcode ? 'Bay' : 'Item'
          } Barcode`}</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(value) => this.setState({inputCode: value})}
            defaultValue=""
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={this.handleConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  submitButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#F07120',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManualInput);
