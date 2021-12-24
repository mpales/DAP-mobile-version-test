import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// helper
import {getData} from '../../../../component/helper/network';
// component
import RelocationBarcodeResult from '../../../../component/extend/ListItem-relocation-barcode-result';
//style
import Mixins from '../../../../mixins';

const window = Dimensions.get('window');

class BarcodeCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scanResult: null,
      barcodeResult: this.props.route.params?.barcodeResult ?? null,
      isLoaded: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.getClientProductStorageList();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setSelectedRequestRelocation(null);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getClientProductStorageList = async () => {
    const {barcodeResult} = this.state;
    const result = await getData(
      `/stocks/product-storage/location-id/${barcodeResult}`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        scanResult: result,
      });
    }
    this.setState({
      isLoaded: true,
    });
  };

  navigateToRequestRelocationForm = (data) => {
    this.props.setSelectedRequestRelocation([data]);
    this.props.setSelectedLocationId(this.state.barcodeResult);
    this.props.navigation.navigate('RequestRelocationForm');
  };

  render() {
    const {barcodeResult, isLoaded, scanResult} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body}>
          {isLoaded && (
            <>
              <View style={styles.titleContainer}>
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text style={[styles.title, {marginRight: 20}]}>Results</Text>
                  <Text
                    style={[styles.title, styles.textBlue, {flexWrap: 'wrap'}]}>
                    {`${barcodeResult}`}
                  </Text>
                </View>
                <Text style={[styles.text, styles.textBlue]}>{`${
                  scanResult === null ? 0 : scanResult.length
                } Result`}</Text>
              </View>
              {scanResult === null ||
              (!!scanResult && scanResult.length === 0) ? (
                <View style={styles.noResultContainer}>
                  <Text style={styles.title}>No result found</Text>
                </View>
              ) : (
                <View style={styles.resultContainer}>
                  {scanResult.map((item, index) => (
                    <RelocationBarcodeResult
                      key={index}
                      item={item}
                      navigate={this.navigateToRequestRelocationForm}
                    />
                  ))}
                </View>
              )}
            </>
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
  resultContainer: {
    flexShrink: 1,
    padding: 20,
  },
  noResultContainer: {
    marginTop: window.height * 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
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
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedRequestRelocation: (data) => {
      return dispatch({type: 'SelectedRequestRelocation', payload: data});
    },
    setSelectedLocationId: (data) => {
      return dispatch({type: 'SelectedLocationId', payload: data});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BarcodeCamera);
