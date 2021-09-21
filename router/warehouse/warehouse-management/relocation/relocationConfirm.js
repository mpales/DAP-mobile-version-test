import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, Input, SearchBar, Badge, Button} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//style
import Mixins from '../../../../mixins';
//icon
import ArrowDown from '../../../assets/icon/arrow-down-mobile.svg';
import moment from 'moment';
import {element} from 'prop-types';
const window = Dimensions.get('window');

class RelocationConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      filtered: 0,
      renderGoBack: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}
  componentDidMount() {}
  render() {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Text
            style={{
              ...Mixins.subtitle1,
              lineHeight: 21,
              color: '#424141',
              paddingHorizontal: 20,
              marginTop: 15,
            }}>
            SKU 00992233441{' '}
          </Text>

          <View style={styles.sectionContent}>
            <Text style={styles.textHeader}>Current Location</Text>
            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Location
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                JP2 C05-002
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Item Code
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                342035002
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Descript
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                ERGOBLOM V2 BLUE DESK (HTH-512W LARGE TABLE/SHELF )
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Quantity
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                30
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  UOM
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                Pair
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Grade
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                01
              </Text>
            </View>

            <View
              style={{
                marginVertical: 10,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <ArrowDown width="20" height="40" fill="#424141" />
            </View>

            <Text style={styles.textHeader}>New Location</Text>
            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Location
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                JP2 C05-002
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Item Code
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                342035002
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Descript
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                ERGOBLOM V2 BLUE DESK (HTH-512W LARGE TABLE/SHELF )
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Quantity
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                30
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  UOM
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                Pair
              </Text>
            </View>

            <View
              style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
              <View style={{width: 60}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 18,
                    color: '#2D2C2C',
                    fontWeight: '500',
                  }}>
                  Grade
                </Text>
              </View>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#6C6B6B',
                  fontWeight: '500',
                  textAlign: 'right',
                  flexShrink: 1,
                  paddingHorizontal: 8,
                }}>
                :
              </Text>
              <Text
                style={{
                  ...Mixins.small1,
                  lineHeight: 18,
                  color: '#424141',
                  fontWeight: '400',
                }}>
                01
              </Text>
            </View>

            <Button
              containerStyle={{flex: 1, marginVertical: 15}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              title="Scan Barcode"
              onPress={() => {
                this.props.navigation.navigate({
                  name: 'Barcode',
                  params: {
                    inputCode: '9780312205195',
                    palletCode: '8993175536820',
                  },
                });
              }}
            />
            <Button
              containerStyle={{flex: 1, marginRight: 0}}
              buttonStyle={[
                styles.navigationButton,
                {
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#6C6B6B',
                  paddingHorizontal: 0,
                },
              ]}
              titleStyle={[styles.deliveryText, {color: '#6C6B6B'}]}
              onPress={() => {
                this.props.navigation.navigate('Location');
              }}
              title="Move Manual"
            />
          </View>
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  textHeader: {
    ...Mixins.h6,
    color: '#2A3386',
    lineHeight: 27,
    fontWeight: '600',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  headingCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  badgeSort: {
    marginRight: 5,
  },
  sectionContent: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 35,
    flexDirection: 'column',
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  headerBeranda: {
    flexDirection: 'column',
    height: window.width * 0.16,
    backgroundColor: '#121C78',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  ccmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  berandaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 30,
  },
  barSection: {
    flex: 1,
  },
  breadcrumb: {
    alignItems: 'flex-start',
  },
  search: {
    alignItems: 'flex-end',
  },
  navSection: {
    flex: 1,
  },
  toggleDrawer: {
    alignItems: 'flex-start',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  navWrapper: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
    marginBottom: 20,
    marginTop: 0,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0, //default is 1
    shadowRadius: 0, //default is 1
    elevation: 0,
    backgroundColor: '#ffffff',
  },
  badgeActive: {
    backgroundColor: '#F1811C',
    borderWidth: 1,
    borderColor: '#F1811C',
    paddingHorizontal: 12,
    height: 20,
  },
  badgeActiveTint: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#ffffff',
  },
  badgeInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121C78',
    paddingHorizontal: 12,
    height: 20,
  },
  badgeInactiveTint: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#121C78',
  },
});
const STOCK = [
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001234',
    timestamp: moment().subtract(1, 'days').unix(),
    transport: 'DSP',
    status: 'progress',
    desc: 'Dead Sea Premier',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001222',
    timestamp: moment().subtract(4, 'days').unix(),
    transport: 'DSP',
    status: 'complete',
    desc: 'Roboto',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001221',
    timestamp: moment().subtract(3, 'days').unix(),
    transport: 'DSP',
    status: 'pending',
    desc: 'Poopie',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001225',
    timestamp: moment().subtract(1, 'days').unix(),
    transport: 'DSP',
    status: 'progress',
    desc: 'Dead Sea Premier',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001223',
    timestamp: moment().unix(),
    transport: 'DSP',
    status: 'pending',
    desc: 'Dead Sea Premier',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001224',
    timestamp: moment().unix(),
    transport: 'DSP',
    status: 'pending',
    desc: 'Dead Sea Premier',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001235',
    timestamp: moment().unix(),
    transport: 'DSP',
    status: 'progress',
    desc: 'Dead Sea Premier',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001236',
    timestamp: moment().unix(),
    transport: 'DSP',
    status: 'pending',
    desc: 'Dead Sea Premier',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001237',
    timestamp: moment().subtract(1, 'days').unix(),
    transport: 'DSP',
    status: 'progress',
    desc: 'Dead Sea Premier',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
  {
    title: 'GCPL STOCK TAKE 20 02 20',
    number: 'PO00001238',
    timestamp: moment().subtract(1, 'days').unix(),
    transport: 'DSP',
    status: 'progress',
    desc: 'Dead Sea Premier',
    rcpt: 'DRC000206959',
    ref: 'BESG20200820A',
  },
];

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
