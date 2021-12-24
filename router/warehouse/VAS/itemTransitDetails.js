import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Card, Divider, Button, Avatar} from 'react-native-elements';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import mixins from '../../../mixins';
// component
import DetailList from '../../../component/extend/Card-detail';
// icon
import ChevronRight from '../../../assets/icon/iconmonstr-arrow-66mobile-2.svg';
import ChevronDown from '../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
import IconBarcodeMobile from '../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';
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
    const {navigation, VASList} = props;
    const {dataCode, _itemDetail} = state;
    if (dataCode === '0') {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.dataCode !== undefined
      ) {
        if (
          VASList.some(
            (element) => element.number === routes[index].params.dataCode,
          )
        ) {
          let manifest = VASList.find(
            (element) => element.number === routes[index].params.dataCode,
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
  componentDidUpdate(prevProps, prevState) {
    if (this.props.VASList !== prevProps.VASList) {
      this.setState({dataCode: '0'});
    }
  }
  componentDidMount() {}
  navigateSeeReport = () => {
    this.props.navigation.navigate('ItemReportDetail');
  };

  renderHeader = () => {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Log</Text>
          <View style={styles.sortContainer}>
            <Text style={{...mixins.subtitle3, fontWeight: '700'}}>
              Sort By Name
            </Text>
            <View style={styles.sortIconWrapper}>
              <ChevronDown width="15" height="15" fill="#6C6B6B" />
            </View>
          </View>
        </View>
        <View style={[styles.header, {marginTop: 10}]}>
          <Text style={styles.detailText}>Date and Time</Text>
          <Text style={styles.detailText}>Name</Text>
          <Text style={styles.detailText}>Activities</Text>
        </View>
      </>
    );
  };

  renderInner = (item) => {
    return (
      <View style={styles.header}>
        <Text style={styles.detailText}>{item.date}</Text>
        <Text style={styles.detailText}>{item.name}</Text>
        <Text style={styles.detailText}>{item.status}</Text>
      </View>
    );
  };

  render() {
    const {_itemDetail} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaInsetsContext.Consumer>
          {(inset) => (
            <View
              style={[
                styles.buttonSticky,
                {height: Dimensions.get('screen').height * 0.06 + inset.bottom},
              ]}>
              <Avatar
                size={75}
                ImageComponent={() => (
                  <IconBarcodeMobile height="40" width="37" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    ...mixins.buttonAvatarDefaultIconStyle,
                  },
                }}
                overlayContainerStyle={styles.barcodeButton}
                onPress={() => {}}
                activeOpacity={0.7}
                containerStyle={{
                  position: 'absolute',
                  left: Dimensions.get('screen').width / 2 - 40,
                  bottom:
                    Dimensions.get('screen').height * 0.025 - 10 + inset.bottom,
                }}
              />
            </View>
          )}
        </SafeAreaInsetsContext.Consumer>
        <ScrollView style={styles.container}>
          <View style={styles.body}>
            <Card containerStyle={styles.cardContainer} style={{}}>
              <View
                style={{
                  ...styles.detail,
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }}>
                <DetailList title="Client" value={_itemDetail.transport} />
                <DetailList title="Warehouse" value={_itemDetail.desc} />
                <DetailList title="Location" value={_itemDetail.ref} />
                <DetailList title="Item Code" value={_itemDetail.number} />
                <DetailList title="Description" value={_itemDetail.rcpt} />
              </View>
              <Divider />
              <View
                style={{
                  ...styles.detail,
                  paddingHorizontal: 20,
                  marginTop: 10,
                }}>
                <DetailList title="Job Type" value="Re-Labeling" />
                <DetailList title="Labeling Required" value="40" />
                <DetailList title="UOM" value="PCS" />
              </View>
            </Card>
            {_itemDetail.status === 'progress' ||
            _itemDetail.status === 'pending' ? (
              <>
                <Button
                  containerStyle={{flexShrink: 1, marginVertical: 10}}
                  buttonStyle={[
                    styles.navigationButton,
                    {paddingHorizontal: 0},
                  ]}
                  titleStyle={styles.deliveryText}
                  onPress={() => {
                    if (_itemDetail.status === 'pending') {
                      this.props.navigation.navigate({
                        name: 'Barcode',
                        params: {
                          inputCode: _itemDetail.number,
                        },
                      });
                    } else {
                      this.props.setCompleteVAS(_itemDetail.number);
                      this.props.navigation.navigate('List');
                    }
                  }}
                  title={
                    _itemDetail.status === 'pending'
                      ? 'Start Job'
                      : 'Complete Job'
                  }
                />
                <Button
                  containerStyle={{flexShrink: 1, marginBottom: 10}}
                  buttonStyle={[styles.reportButton, {paddingHorizontal: 0}]}
                  titleStyle={{...styles.deliveryText, color: '#E03B3B'}}
                  onPress={() => {
                    this.props.navigation.navigate({
                      name: 'ReportManifest',
                      params: {
                        dataCode: _itemDetail.number,
                        submitPhoto: false,
                      },
                    });
                  }}
                  title="Report"
                />
              </>
            ) : (
              <Button
                containerStyle={{flexShrink: 1, marginBottom: 10}}
                buttonStyle={[styles.reportButton, {paddingHorizontal: 0}]}
                titleStyle={{...styles.deliveryText, color: '#E03B3B'}}
                onPress={() => {
                  this.props.navigation.navigate('ItemReportDetail');
                }}
                title="See Report Detail"
              />
            )}

            <View
              style={{
                flexDirection: 'column',
                flexShrink: 1,
                marginVertical: 20,
              }}>
              <Text style={{...mixins.subtitle3, lineHeight: 21}}>Remarks</Text>
              <View style={styles.remark}>
                <Text style={styles.remarkText}>
                  Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                  Lorem ipsum
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  deliveryText: {
    ...mixins.h6,
    lineHeight: 27,
    fontWeight: '600',
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },

  reportButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#424141',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },

  remarkText: {
    ...mixins.body3,
    lineHeight: 18,
    color: 'black',
  },
  remark: {
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginVertical: 15,
    marginHorizontal: 5,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    flexDirection: 'row',
    flexShrink: 1,
    minWidth: 320,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...mixins.subtitle3,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#424141',
  },
  seeReportButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  seeReportText: {
    ...mixins.subtitle3,
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
    paddingHorizontal: 0,
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
    ...mixins.subtitle3,
    fontSize: 30,
    lineHeight: 40,
    color: '#6C6B6B',
  },
  detail: {
    flexDirection: 'column',
  },
  detailText: {
    ...mixins.subtitle3,
    color: '#6C6B6B',
  },
  reportSection: {
    flexDirection: 'column',
  },
  reportSectionTitle: {
    ...mixins.subtitle3,
    color: '#424141',
    fontWeight: '700',
  },
  reportText: {
    ...mixins.subtitle3,
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
  buttonSticky: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    zIndex: 10,
    height: Dimensions.get('screen').height * 0.06,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 14,
  },
  barcodeButton: {
    ...mixins.buttonAvatarDefaultOverlayStyle,
    backgroundColor: '#F07120',
    borderRadius: 100,
  },
});

const mapStateToProps = (state) => {
  return {
    VASList: state.originReducer.VASList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompleteVAS: (data) => {
      return dispatch({type: 'completeVAS', payload: data});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteDetails);
