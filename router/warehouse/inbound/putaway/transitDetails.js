import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, Badge, Avatar, Divider} from 'react-native-elements';
import {connect} from 'react-redux';
import moment from 'moment';
import Mixins from '../../../../mixins';

import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
// component
import DetailList from '../../../../component/extend/Card-detail';
// icon
import IconBarcodeMobile from '../../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';
import IconArrow66Mobile from '../../../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import EmptyIlustrate from '../../../../assets/icon/manifest-empty mobile.svg';
class ConnoteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'Name',
      dataCode: '0',
      _itemDetail: null,
    };
  }
  static getDerivedStateFromProps(props, state) {
    const {navigation, putawayList} = props;
    const {dataCode, _itemDetail} = state;
    if (dataCode === '0') {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.dataCode !== undefined
      ) {
        if (
          putawayList.some(
            (element) => element.id === routes[index].params.dataCode,
          )
        ) {
          let manifest = putawayList.find(
            (element) => element.id === routes[index].params.dataCode,
          );
          return {
            ...state,
            dataCode: routes[index].params.dataCode,
            _itemDetail: manifest,
          };
        }
        return {...state, dataCode: routes[index].params.dataCode};
      }
      return {...state};
    }

    return {...state};
  }

  componentDidMount() {}
  navigateSeeReport = () => {
    this.props.navigation.navigate('ItemReportDetail');
  };


  render() {
    const {_itemDetail} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={[styles.body,{paddingHorizontal:20}]}>
                  <View style={[styles.header, {paddingHorizontal: 10, paddingTop: 20}]}>
                  <Text style={styles.headerTitle}>Pallet Details</Text>
                </View>
                <View style={[styles.headerBody, {flexShrink: 1}]}>
                  <Card
                    containerStyle={[
                      styles.cardContainer,
                      {marginHorizontal: 10, paddingHorizontal: 0},
                    ]}
                    style={styles.card}>
                    <View style={[styles.header, {paddingHorizontal: 15}]}>
                      <View style={{flexDirection: 'column', flex: 1}}>
                            <DetailList title="Container #" value="-" />
                            <DetailList title="No. of Pallet" value="-" />
                            <DetailList title="No. of Carton" value="-" />
                            <DetailList title="CBM" value="-" />
                            <DetailList title="Weight" value="-" />
                  
                      </View>
                      <Badge
                        value='TRANSIT'
                        status="warning"
                        textStyle={{
                          ...Mixins.small3,
                          fontWeight: '700',
                          lineHeight: 15,
                          paddingHorizontal: 20,
                        }}
                        containerStyle={{alignSelf: 'flex-start'}}
                        badgeStyle={{
                          backgroundColor:'#17B055',
                          borderColor: '#ABABAB',
                          borderWidth:0,
                          borderRadius: 5,
                        }}
                      />
                    </View>
                
                        <Divider style={{marginVertical: 10}} />
                        <View
                          style={{
                            paddingHorizontal: 15,
                            paddingTop: 10,
                            paddingBottom: 20,
                          }}>
                          <Text
                            style={{
                              ...Mixins.body1,
                              color: '#424141',
                              lineHeight: 21,
                              fontWeight: '700',
                            }}>
                            Delivery Information
                          </Text>
                          <View style={{paddingVertical: 10}}>
                            <DetailList title="Delivery Type" value="SELF COLLECTION" />
                          </View>
                        </View>
                
                  </Card>
                </View>
          </View>
        </View>
          <SafeAreaInsetsContext.Consumer>
            {(inset) => (
              <>
                <View
                  style={[styles.buttonSticky, {bottom: 15 + inset.bottom}]}>
                  <Avatar
                    size={75}
                    ImageComponent={() => (
                      <IconBarcodeMobile height="40" width="37" fill="#fff" />
                    )}
                    imageProps={{
                      containerStyle: {
                        ...Mixins.buttonAvatarDefaultIconStyle,
                      },
                    }}
                    overlayContainerStyle={styles.barcodeButton}
                    onPress={() => {
                      // not implemented
                      // this.props.setBarcodeScanner(true);
                      // this.props.navigation.navigate({
                      //   name: 'PalletScanner',
                      //   params: {
                      //     inputCode: this.state._itemDetail.id,
                      //   },
                      // });
                    }}
                    activeOpacity={0.7}
                    containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
                  />
                </View>
                <View
                  style={[
                    styles.bottomTabContainer,
                    {height: 42 + inset.bottom},
                  ]}></View>
              </>
            )}
          </SafeAreaInsetsContext.Consumer>
    
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 0,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Mixins.subtitle3,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#424141',
  },
  buttonSticky: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    elevation: 10,
    zIndex: 10,
    elevation: 12,
    backgroundColor: 'transparent',
  },
  barcodeButton: {
    ...Mixins.buttonAvatarDefaultOverlayStyle,
    backgroundColor: '#F07120',
    borderRadius: 100,
  },
  bottomTabContainer: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 1,
    height: 42,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },
  seeReportButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  seeReportText: {
    ...Mixins.subtitle3,
    marginRight: 10,
    color: '#E03B3B',
  },
  body: {
    flex: 1,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  packageCounterText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#2D2C2C',
    fontWeight: '600',
  },
  detail: {
    flexDirection: 'column',
  },
  detailText: {
    ...Mixins.subtitle3,
    color: '#6C6B6B',
  },
  reportSection: {
    flexDirection: 'column',
  },
  reportSectionTitle: {
    ...Mixins.subtitle3,
    color: '#424141',
    fontWeight: '700',
  },
  reportText: {
    ...Mixins.subtitle3,
    color: 'red',
  },
  sortContainer: {
    borderWidth: 1,
    borderColor: '#ADADAD',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  sortIconWrapper: {
    backgroundColor: '#C5C5C5',
    borderRadius: 3,
    padding: 5,
    marginLeft: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    putawayList: state.originReducer.putawayList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteDetails);
