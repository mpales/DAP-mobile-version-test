import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import Barcode from '../../../../component/camera/filter-barcode';
//style
import Mixins from '../../../../mixins';

class SearchInventoryBarcode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setBarcodeScanner(true);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  renderBarcode = (barcode) => {
    if (barcode.length > 0 && barcode[0].data !== '') {
      this.props.navigation.navigate('SearchInventoryDetails', {
        barcodeResult: barcode[0].data,
      });
    }
  };

  render() {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Barcode
          renderBarcode={this.renderBarcode}
          barcodeContext={'Scan Location Barcode'}
        />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchInventoryBarcode);
