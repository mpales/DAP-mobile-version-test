import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Card, Overlay} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// style
import Mixins from '../../../../mixins';
// icon
import CheckmarkIcon from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';

const window = Dimensions.get('window');

class RelocationConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: CURRENTLOCATION,
      newLocation: NEWLOCATION,
      showOverlay: false,
    };
    this.handleShowOverlay.bind(this);
    this.confirmRelocation.bind(this);
    this.navigateToRelocationJobList.bind(this);
  }

  handleShowOverlay = (value) => {
    this.setState({
      showOverlay: value ?? false,
    });
  };

  confirmRelocation = () => {
    this.handleShowOverlay(true);
  };

  navigateToRelocationJobList = () => {
    this.handleShowOverlay();
    this.props.setBottomBar(true);
    this.props.navigation.navigate('RelocationList');
  };

  render() {
    const {currentLocation, newLocation} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Card containerStyle={styles.cardContainer}>
            <View style={styles.sectionContainer}>
              <Text style={styles.cardTitle}>Current Location</Text>
              <TextList title="Location" value={currentLocation.location} />
              <TextList title="Item Code" value={currentLocation.itemCode} />
              <TextList
                title="Description"
                value={currentLocation.description}
              />
              <TextList
                title="Quantity"
                value={`${currentLocation.quantity}-${currentLocation.locationOpacity}`}
                separateQuantity={true}
              />
              <TextList title="UOM" value={currentLocation.UOM} />
              <TextList title="Grade" value={currentLocation.grade} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.cardTitle}>New Location</Text>
              <TextList title="Location" value={newLocation.location} />
              <TextList title="Item Code" value={newLocation.itemCode} />
              <TextList title="Description" value={newLocation.description} />
              <TextList
                title="Quantity"
                value={`${newLocation.quantity}-${newLocation.locationOpacity}`}
                separateQuantity={true}
              />
              <TextList title="UOM" value={newLocation.UOM} />
              <TextList title="Grade" value={newLocation.grade} />
            </View>
          </Card>
          <Button
            title="Confirm Relocation"
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            onPress={this.confirmRelocation}
          />
        </ScrollView>
        <Overlay
          overlayStyle={{borderRadius: 10, padding: 0}}
          isVisible={this.state.showOverlay}>
          <View
            style={{
              flexShrink: 1,
              width: window.width * 0.9,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#ABABAB',
                paddingVertical: 15,
              }}>
              <CheckmarkIcon height="24" width="24" fill="#17B055" />
              <Text
                style={{
                  ...Mixins.subtitle3,
                  fontSize: 18,
                  lineHeight: 25,
                  marginLeft: 10,
                  color: '#17B055',
                }}>
                Relocation Successful
              </Text>
            </View>
            <View style={{padding: 20}}>
              <Text style={styles.cardTitle}>New Location</Text>
              <TextList title="Location" value={newLocation.location} />
              <TextList title="Item Code" value={newLocation.itemCode} />
              <TextList title="Description" value={newLocation.description} />
              <TextList title="Quantity" value={newLocation.quantity} />
              <TextList title="UOM" value={newLocation.UOM} />
              <TextList title="Grade" value={newLocation.grade} />
              <Button
                title="Back To List"
                titleStyle={styles.buttonText}
                buttonStyle={[
                  styles.button,
                  {marginHorizontal: 0, marginTop: 20},
                ]}
                onPress={this.navigateToRelocationJobList}
              />
            </View>
          </View>
        </Overlay>
      </SafeAreaProvider>
    );
  }
}

const TextList = ({title, value, separateQuantity}) => {
  let quantityArr = [];
  if (separateQuantity) {
    if (typeof value === 'string') {
      quantityArr = value.split('-');
    } else {
      quantityArr = value.toString().split('-');
    }
  }
  return (
    <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
      <View style={{width: 100}}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <Text style={styles.separatorText}>:</Text>
      {separateQuantity ? (
        <>
          <Text style={[styles.valueText, styles.valueTextRedBold, {flex: 0}]}>
            {quantityArr[0]}
          </Text>
          <Text style={[styles.valueText, {flex: 0}]}>{` -> `}</Text>
          <Text style={[styles.valueText, styles.valueTextRedBold, {flex: 0}]}>
            {quantityArr[quantityArr.length - 1]}
          </Text>
        </>
      ) : (
        <Text
          style={
            title === 'Quantity' || (title === 'Grade' && value === 'expired')
              ? [styles.valueText, {color: '#E03B3B', fontWeight: 'bold'}]
              : styles.valueText
          }>
          {title === 'Grade' ? value.toUpperCase() : value}
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 40,
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
    fontSize: 18,
    lineHeight: 25,
    color: '#2A3386',
    marginBottom: 5,
  },
  titleText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#2D2C2C',
    fontWeight: '500',
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
  valueTextRedBold: {
    fontWeight: 'bold',
    color: '#E03B3B',
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

const CURRENTLOCATION = {
  location: 'JP2 C05-002',
  itemCode: '342045002',
  description: 'ERGOBLOM V2 BLUE DESK',
  quantity: 30,
  locationOpacity: 0,
  UOM: 'Pair',
  grade: '01',
};

const NEWLOCATION = {
  location: 'AW-00214',
  itemCode: '342045002',
  description: 'ERGOBLOM V2 BLUE DESK',
  quantity: 30,
  locationOpacity: 60,
  UOM: 'Pair',
  grade: 'expired',
};

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

export default connect(mapStateToProps, mapDispatchToProps)(RelocationConfirm);
