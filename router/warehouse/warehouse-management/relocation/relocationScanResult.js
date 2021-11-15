import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// helper
import {getData} from '../../../../component/helper/network';
import moment from 'moment';
// component
import RelocationBarcodeResult from '../../../../component/extend/ListItem-relocation-barcode-result';
//style
import Mixins from '../../../../mixins';

class BarcodeCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouseDetails: null,
      scanResult: null,
      barcodeResult: this.props.route.params?.barcodeResult ?? null,
      isLoaded: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.getClientProductStorageList();
  }

  getClientProductStorageList = async () => {
    const {barcodeResult} = this.state;
    const result = await getData(
      `/stocks-mobile/product-storage/location-id/${barcodeResult}`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        scanResult: result.productStorage,
        warehouseDetails: result.warehouse,
      });
    }
    this.setState({
      isLoaded: true,
    });
  };

  navigateToRequestRelocationForm = (data) => {
    const {barcodeResult, warehouseDetails} = this.state;
    this.props.navigation.navigate('RequestRelocationForm', {
      productStorage: {
        ...data,
        locationId: barcodeResult,
      },
    });
  };

  render() {
    const {barcodeResult, isLoaded, scanResult, warehouseDetails} = this.state;

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
              {scanResult === null ? (
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
    flex: 1,
    flexDirection: 'column',
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
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BarcodeCamera);
