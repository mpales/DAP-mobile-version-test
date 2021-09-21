import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Card, Button} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//style
import Mixins from '../../../../mixins';
import moment from 'moment';

class RelocationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocationJobId: null,
      relocateFrom: RELOCATEFROM,
      relocateTo: RELOCATETO,
    };
  }

  navigateToConfirmRelocation = () => {
    this.props.navigation.navigate('ConfirmRelocation');
  };

  render() {
    const {relocateFrom, relocateTo} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Relocate From</Text>
          <Card containerStyle={styles.cardContainer}>
            <Text style={styles.cardTitle}>
              Warehouse {relocateFrom.warehouse}
            </Text>
            <TextList
              title="Job Request Date"
              value={relocateFrom.jobRequestDate}
            />
            <TextList title="Client" value={relocateFrom.client} />
            <TextList title="Location" value={relocateFrom.location} />
            <TextList title="Item Code" value={relocateFrom.itemCode} />
            <TextList title="Description" value={relocateFrom.description} />
            <TextList title="Request By" value={relocateFrom.requestBy} />
            <TextList title="Grade" value={relocateFrom.grade} />
            <TextList title="Expiry Date" value={relocateFrom.expiryDate} />
            <TextList title="Batch No" value={relocateFrom.batchNo} />
            <TextList title="Reason Code" value={relocateFrom.reasonCode} />
            <View style={{borderWidth: 1, borderRadius: 5, padding: 10}}>
              <TextListBig title="Quantity" value={relocateFrom.quantity} />
              <TextListBig title="UOM" value={relocateFrom.UOM} />
            </View>
          </Card>
          <View style={styles.blueContainer}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.blueContainerText}>Move Quantity</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.blueContainerText}>
                  {relocateFrom.quantity}
                </Text>
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.blueContainerText}>UOM</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.blueContainerText}>{relocateFrom.UOM}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.title}>Relocate To</Text>
          <Card containerStyle={styles.cardContainer}>
            <Text style={styles.cardTitle}>
              Warehouse {relocateTo.warehouse}
            </Text>
            <TextList title="Location" value={relocateTo.location} />
            <TextList title="Item Code" value={relocateTo.itemCode} />
            <TextList title="Description" value={relocateTo.description} />
            <TextList
              title="Destination Grade"
              value={relocateTo.destinationGrade}
            />
          </Card>
          <Button
            title="Start Relocate"
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            onPress={this.navigateToConfirmRelocation}
          />
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const TextList = ({title, value}) => (
  <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
    <View style={{width: 100}}>
      <Text style={styles.titleText}>{title}</Text>
    </View>
    <Text style={styles.separatorText}>:</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

const TextListBig = ({title, value}) => (
  <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
    <View style={{width: 90}}>
      <Text style={styles.titleTextBig}>{title}</Text>
    </View>
    <Text style={styles.separatorText}>:</Text>
    <Text style={styles.titleTextBig}>{value}</Text>
  </View>
);

const RELOCATEFROM = {
  warehouse: 'KEPPEL',
  jobRequestDate: moment().subtract(1, 'days').unix(),
  client: 'BG5G',
  location: 'JP2 C05-002',
  itemCode: '256000912',
  description: 'ERGOBLOM V2 BLUE DESK',
  requestBy: 'BS5G',
  grade: '01',
  expiryDate: '-',
  batchNo: '01',
  reasonCode: '0990',
  remarks: '-',
  quantity: 30,
  UOM: 'PAIR',
};

const RELOCATETO = {
  warehouse: 'KEPPEL',
  location: 'JP2 C05-002',
  itemCode: '256000912',
  description: 'ERGOBLOM V2 BLUE DESK',
  destinationGrade: '01',
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 23,
    marginHorizontal: 10,
    marginTop: 10,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardTitle: {
    ...Mixins.subtitle1,
    lineHeight: 21,
  },
  titleText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#2D2C2C',
    fontWeight: '500',
  },
  titleTextBig: {
    ...Mixins.subtitle1,
    fontSize: 18,
    lineHeight: 25,
  },
  separatorText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#6C6B6B',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    paddingHorizontal: 8,
  },
  valueText: {
    flex: 1,
    ...Mixins.small1,
    lineHeight: 18,
    color: '#424141',
    fontWeight: '400',
  },
  blueContainer: {
    backgroundColor: '#414993',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  blueContainerText: {
    ...Mixins.subtitle1,
    fontSize: 18,
    lineHeight: 25,
    color: '#FFF',
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
});

function mapStateToProps(state) {
  return {
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelocationDetails);
