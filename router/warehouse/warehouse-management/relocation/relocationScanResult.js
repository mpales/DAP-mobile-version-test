import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import moment from 'moment';
// component
import RelocationResult from '../../../../component/extend/ListItem-relocation-result';
//style
import Mixins from '../../../../mixins';

class BarcodeCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scanResult: SCANRESULT,
      barcodeResult: this.props.route.params?.barcodeResult ?? null,
      isLoaded: false,
    };
  }

  navigateToRequestRelocationForm = () => {
    this.props.navigation.navigate('RequestRelocationForm');
  };

  render() {
    const {scanResult} = this.state;

    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {/* need to add this.state.isLoaded for conditional rendering */}
        {scanResult !== null && (
          <ScrollView style={styles.body}>
            <View style={styles.resultContainer}>
              <Text style={styles.title}>Result</Text>
              {scanResult.map((item, index) => (
                <RelocationResult
                  key={index}
                  item={item}
                  navigate={this.navigateToRequestRelocationForm}
                />
              ))}
            </View>
          </ScrollView>
        )}
        {/* need to add !this.state.isLoaded for conditional rendering */}
        {scanResult === null && (
          <View style={styles.noResultContainer}>
            <Text style={styles.title}>No result found</Text>
          </View>
        )}
      </SafeAreaProvider>
    );
  }
}

const SCANRESULT = [
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
  title: {
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

export default connect(mapStateToProps, mapDispatchToProps)(BarcodeCamera);
