/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Dimensions,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';
import {
  Avatar,
  Card,
  Overlay,
  Button,
  SearchBar,
  Badge,
  Input,
  Tooltip,
} from 'react-native-elements';

import {
  SafeAreaProvider,
  SafeAreaInsetsContext,
} from 'react-native-safe-area-context';
import {connect, Provider} from 'react-redux';
import Mixins from '../../../../mixins';
import InboundSupervisorDetail from '../../../../component/extend/ListItem-inbound-supervisor-detail';
import IconBarcodeMobile from '../../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';
import moment from 'moment';
import IconSearchMobile from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';
import {getData, postData} from '../../../../component/helper/network';
import Banner from '../../../../component/banner/banner';

import BlankList from '../../../../assets/icon/Group 5122blanklist.svg';
import EmptyIlustrate from '../../../../assets/icon/manifest-empty mobile.svg';
import InfoTooltip from '../../../../assets/icon/iconmonstr-info-2 1mobile.svg';
const window = Dimensions.get('window');

class Warehouse extends React.Component {
  _unsubscribe = null;
  constructor(props) {
    super(props);

    this.state = {
      _visibleOverlay: false,
      receivingNumber: null,
      inboundNumber: null,
      companyname: null,
      search: '',
      filtered: 0,
      _manifest: [],
      hasReport : false,
      hasActiveReceipt : false,
      route_to_processor: false,
      updated: false,
      initialRender: false,
      notifbanner: '',
      notifsuccess: false,
      renderRefresh: false,
      renderFiltered : false,
      remark: '',
      remarkHeight: 500,
    };

    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
    this.closeNotifBanner.bind(this);
    this.toggleOverlay.bind(this);
    this.handleConfirm.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {_manifest, receivingNumber} = state;
    const {navigation,currentASN, inboundList} = props;
    const {routes,index} = navigation.dangerouslyGetState();
    let inboundId =   currentASN;   
    if (
      routes[index].params !== undefined &&
      routes[index].params.number !== undefined
    ){
      inboundId =   routes[index].params.number;
    }
    let flagReport = _manifest.some((o)=> o.status === 4);
    if(receivingNumber === null){
      let _baseProduct = inboundList.find((o)=> o.id === inboundId);
      flagReport = _baseProduct !== undefined && _baseProduct.products !== undefined && Array.isArray(_baseProduct.products) && _baseProduct.products.length > 0 ? _baseProduct.products.some((o)=> o.status === 4) : false;
    } 

    return {...state, hasReport: flagReport};
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    const {manifestList} = this.props;
    if (
      this.state.renderRefresh !== prevState.renderRefresh &&
      this.state.renderRefresh === true
    ) {
      const {receivingNumber} = this.state;
      const {currentASN} = this.props;
      let inboundId = receivingNumber === null ? currentASN : receivingNumber;
      const result = await getData('inboundsMobile/' + inboundId);
      if (typeof result === 'object' && result.error === undefined) {
        let filtered =
          (prevState.renderRefresh !== this.state.renderRefresh &&
            this.state.renderRefresh === true) ||
          prevState.filtered !== this.state.filtered ||
          prevState.search !== this.state.search ||
          (prevState.renderFiltered !== this.state.renderFiltered && this.state.renderFiltered === true) ||
          (prevState.updated !== this.state.updated &&
            this.state.updated === false) ||
          (prevState.initialRender !== this.state.initialRender &&
            this.state.initialRender === false)
            ? this.state.filtered
            : null;
        this.props.setManifestList(result.products);
        let active_inbound_flag = null;
        if(result.inbound_receipt !== undefined && Array.isArray(result.inbound_receipt) && result.inbound_receipt.length > 0){
          active_inbound_flag = result.inbound_receipt.some((o)=>o.current_active === true);
        }
        if (filtered === 0) {
          this.setState({
            _manifest: result.products.filter(
              (element) =>
                (element.item_code !== undefined &&
                  String(element.item_code)
                    .toLowerCase()
                    .indexOf(this.state.search.toLowerCase()) > -1) ||
                element.is_transit === 1,
            ),
            route_to_processor : Boolean(result.route_to_processor),
            hasActiveReceipt: active_inbound_flag,
            updated: false,
            renderRefresh: false,
            initialRender: false,
            renderFiltered: false,
          });
        } else if (filtered === 1) {
          this.setState({
            _manifest: result.products
              .filter((element) => element.status === 4)
              .filter(
                (element) =>
                  (element.item_code !== undefined &&
                    String(element.item_code)
                      .toLowerCase()
                      .indexOf(this.state.search.toLowerCase()) > -1) ||
                  element.is_transit === 1,
              ),
              route_to_processor : Boolean(result.route_to_processor),
            hasActiveReceipt: active_inbound_flag, 
            updated: false,
            renderRefresh: false,
            initialRender: false,
            renderFiltered: false,
          });
        } else if (filtered === 2) {
          this.setState({
            _manifest: result.products
              .filter((element) => element.status === 3)
              .filter(
                (element) =>
                  (element.item_code !== undefined &&
                    String(element.item_code)
                      .toLowerCase()
                      .indexOf(this.state.search.toLowerCase()) > -1) ||
                  element.is_transit === 1,
              ),
              route_to_processor : Boolean(result.route_to_processor),
            hasActiveReceipt: active_inbound_flag,
            updated: false,
            renderRefresh: false,
            initialRender: false,
            renderFiltered: false,
          });
        }
      }
    } else if (
      this.state.updated !== prevState.updated &&
      this.state.updated === true
    ) {
      const {receivingNumber} = this.state;
      const {currentASN} = this.props;
      let inboundId = receivingNumber === null ? currentASN : receivingNumber;

      const result = await getData(
        'inboundsMobile/' + inboundId + '/item-status',
      );
      let updatedstatus = Array.from({length: manifestList.length}).map(
        (num, index) => {
          if (result !== undefined && result.products !== undefined) {
            let updateElement = result.products.find(
              (o) => o.pId === manifestList[index].pId,
            );
            return {
              ...manifestList[index],
              ...updateElement,
            };
          } else {
            return {
              ...manifestList[index],
            };
          }
        },
      );
      this.props.setManifestList(updatedstatus);
      let filtered =
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === false) ||
        prevState.filtered !== this.state.filtered ||
        prevState.search !== this.state.search ||
        (prevState.renderFiltered !== this.state.renderFiltered && this.state.renderFiltered === true) ||
        (prevState.updated !== this.state.updated &&
          this.state.updated === true) ||
        (prevState.initialRender !== this.state.initialRender &&
          this.state.initialRender === false)
          ? this.state.filtered
          : null;
      if (filtered === 0) {
        this.setState({
          _manifest: updatedstatus.filter(
            (element) =>
              (element.item_code !== undefined &&
                String(element.item_code)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1) ||
              element.is_transit === 1,
          ),
          updated: false,
          renderRefresh: false,
          initialRender: false,
          renderFiltered: false,
        });
      } else if (filtered === 1) {
        this.setState({
          _manifest: updatedstatus
            .filter((element) => element.status === 4)
            .filter(
              (element) =>
                (element.item_code !== undefined &&
                  String(element.item_code)
                    .toLowerCase()
                    .indexOf(this.state.search.toLowerCase()) > -1) ||
                element.is_transit === 1,
            ),
          updated: false,
          renderRefresh: false,
          initialRender: false,
          renderFiltered: false,
        });
      } else if (filtered === 2) {
        this.setState({
          _manifest: updatedstatus
            .filter((element) => element.status === 3)
            .filter(
              (element) =>
                (element.item_code !== undefined &&
                  String(element.item_code)
                    .toLowerCase()
                    .indexOf(this.state.search.toLowerCase()) > -1) ||
                element.is_transit === 1,
            ),
          updated: false,
          renderRefresh: false,
          initialRender: false,
          renderFiltered: false,
        });
      }
    } else {
      let filtered =
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === false) ||
        prevState.filtered !== this.state.filtered ||
        prevState.search !== this.state.search ||
       ( prevState.renderFiltered !== this.state.renderFiltered && this.state.renderFiltered === true) ||
        (prevState.updated !== this.state.updated &&
          this.state.updated === false) ||
        (prevState.initialRender !== this.state.initialRender &&
          this.state.initialRender === true)
          ? this.state.filtered
          : null;

      if (filtered === 0) {
        this.setState({
          _manifest: manifestList.filter(
            (element) =>
              (element.item_code !== undefined &&
                String(element.item_code)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1) ||
              element.is_transit === 1,
          ),
          updated: false,
          renderRefresh: false,
          initialRender: false,
          renderFiltered: false,
        });
      } else if (filtered === 1) {
        this.setState({
          _manifest: manifestList
            .filter((element) => element.status === 4)
            .filter(
              (element) =>
                (element.item_code !== undefined &&
                  String(element.item_code)
                    .toLowerCase()
                    .indexOf(this.state.search.toLowerCase()) > -1) ||
                element.is_transit === 1,
            ),
          updated: false,
          renderRefresh: false,
          initialRender: false,
          renderFiltered: false,
        });
      } else if (filtered === 2) {
        this.setState({
          _manifest: manifestList
            .filter((element) => element.status === 3)
            .filter(
              (element) =>
                (element.item_code !== undefined &&
                  String(element.item_code)
                    .toLowerCase()
                    .indexOf(this.state.search.toLowerCase()) > -1) ||
                element.is_transit === 1,
            ),
          updated: false,
          renderRefresh: false,
          initialRender: false,
          renderFiltered: false,
        });
      }
    }
  }
  async componentDidMount() {
    const {
      navigation,
      manifestList,
      currentASN,
      barcodeScanned,
      ReportedManifest,
    } = this.props;
    const {receivingNumber, _manifest, search} = this.state;
    this._unsubscribe = navigation.addListener('focus', (test) => {
      if (receivingNumber !== null) this.setState({updated: true});
      // do something
    });
    if (receivingNumber === null) {
      const {routes, index} = navigation.dangerouslyGetState();
      // if(manifestList.length === 0 && search === ''){
      //   let manifest = manifestDummy.filter((element)=>element.name.indexOf(search) > -1);
      //   props.setManifestList(manifest);
      //   return {...state, _manifest : manifest};
      // } else
      if (
        routes[index].params !== undefined &&
        routes[index].params.number !== undefined
      ) {
        const result = await getData(
          'inboundsMobile/' + routes[index].params.number,
        );
        if (typeof result === 'object' && result.error === undefined) {
          this.props.setManifestList(result.products);
          let active_inbound_flag = null;
          if(result.inbound_receipt !== undefined && Array.isArray(result.inbound_receipt) && result.inbound_receipt.length > 0){
            active_inbound_flag = result.inbound_receipt.some((o)=>o.current_active === true);
          }
          this.setState({
            route_to_processor : Boolean(result.route_to_processor),
            hasActiveReceipt: active_inbound_flag,
            receivingNumber: routes[index].params.number,
            inboundNumber: result.inbound_number,
            _manifest: result.products,
            companyname: result.client,
            remark: result.remarks,
            initialRender: true,
            renderFiltered: false,
          });
        } else {
          navigation.popToTop();
        }
      } else if (currentASN !== null) {
        const result = await getData('inboundsMobile/' + currentASN);
        if (typeof result === 'object' && result.error === undefined) {
          this.props.setManifestList(result.products);
          let active_inbound_flag = null;
          if(result.inbound_receipt !== undefined && Array.isArray(result.inbound_receipt) && result.inbound_receipt.length > 0){
            active_inbound_flag = result.inbound_receipt.some((o)=>o.current_active === true);
          }
          this.setState({
            route_to_processor : Boolean(result.route_to_processor),
            hasActiveReceipt: active_inbound_flag,
            receivingNumber: routes[index].params.number,
            inboundNumber: result.inbound_number,
            _manifest: result.products,
            companyname: result.client,
            remark: result.remarks,
            initialRender: true,
            renderFiltered: false,
          });
        } else {
          navigation.popToTop();
        }
      } else {
        navigation.popToTop();
      }
    }
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  toggleOverlay = () => {
    const {_visibleOverlay} = this.state;
    this.setState({_visibleOverlay: !_visibleOverlay});
  };

  handleConfirm = async ({action}) => {
    const {receivingNumber, hasReport} = this.state;
    const {currentASN} = this.props;
    this.toggleOverlay();
    if (action && hasReport === false) {
      // for prototype only
      const result = await postData(
        '/inboundsMobile/' + receivingNumber + '/confirm-putaway',
      );
      if (typeof result !== 'object') {
        this.props.navigation.navigate('CompletedSupervisor');
        // this.setState({notifbanner: result, notifsuccess: true});
      } else {
        if (result.error !== undefined)
          this.setState({notifbanner: result.error, notifsuccess: false});
      }
      // this.props.addCompleteASN(currentASN);
      // this.props.completedInboundList.push(this.state.inboundCode);
      // end

      // this.props.navigation.navigate('containerDetail');
    } else if(action && hasReport === true){
      const result = await postData(
        '/inboundsMobile/' + receivingNumber + '/confirm-putaway',
      );
      if (typeof result !== 'object') {
        // this.props.navigation.navigate('CompletedSupervisor');
        this.setState({notifbanner: result, notifsuccess: true});
      } else {
        if (result.error !== undefined)
          this.setState({notifbanner: result.error, notifsuccess: false});
      }
      // this.props.addCompleteASN(currentASN);
      // this.props.completedInboundList.push(this.state.inboundCode);
      // end

      // this.props.navigation.navigate('containerDetail');
    }
  };
  closeNotifBanner = () => {
    this.setState({notifbanner: '', notifsuccess: false});
  };
  setFiltered = (num) => {
    this.setState({filtered: num, updated: true,renderFiltered: true});
  };

  updateSearch = (search) => {
    this.setState({search:search,renderFiltered: true});
  };
  _onRefresh = () => {
    this.setState({renderRefresh: true,renderFiltered: true});
  };
  render() {
    const {_visibleOverlay, _manifest, receivingNumber} = this.state;
    const {inboundList} = this.props;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaProvider>
          {this.state.notifbanner !== '' && (
            <Banner
              title={this.state.notifbanner}
              backgroundColor={
                this.state.notifsuccess === true ? '#17B055' : '#F1811C'
              }
              closeBanner={this.closeNotifBanner}
            />
          )}
          <ScrollView
            refreshControl={
              <RefreshControl
                colors={['#9Bd35A', '#689F38']}
                refreshing={this.state.renderRefresh}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            style={styles.body}>
            <View style={[styles.sectionContent, {marginTop: 20}]}>
              <View
                style={[styles.sectionContentTitle, {flexDirection: 'row'}]}>
                <View
                  style={[
                    styles.titleHead,
                    {
                      flex: 1,
                      paddingRight: 20,
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                    },
                  ]}>
                  <View style={{flex:1, flexDirection:'row', }}>
                  <View style={{flexShrink:1,}}>
                  <Text
                    style={{
                      ...Mixins.subtitle1,
                      lineHeight: 21,
                      color: '#424141',
                    }}>
                     {this.state.inboundNumber}   
                     </Text>
                  </View>
                  <Tooltip
                    withPointer={false}
                    backgroundColor="#FFFFFF"
                    skipAndroidStatusBar={true}
                    popover={
                      <View
                        onLayout={(e) => {
                          if (
                            this.state.remarkHeight >
                              e.nativeEvent.layout.height &&
                            this.state.remarkHeight -
                              e.nativeEvent.layout.height >
                              30
                          ) {
                            this.setState({
                              remarkHeight: e.nativeEvent.layout.height + 30,
                            });
                          }
                        }}>
                        <Text style={[Mixins.body3, {color: 'black'}]}>
                          {this.state.remark}
                        </Text>
                      </View>
                    }
                    width={300}
                    height={this.state.remarkHeight}
                    containerStyle={{
                      left: Dimensions.get('screen').width / 8,
                      top: Dimensions.get('screen').height / 4,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,
                    }}>
                            <View style={{paddingHorizontal:10}}>                   
                     {this.state.remark ? ( 
                     <InfoTooltip fill="#F07120" height="18" width="18"/>
                     ) : (<></>)}
                      </View>


                  </Tooltip>
                  </View>
                 
                  <Text
                    style={{
                      ...Mixins.subtitle1,
                      lineHeight: 21,
                      color: '#424141',
                    }}>
                    {this.state.companyname}
                  </Text>
                </View>
                <View
                  style={[
                    styles.contentHead,
                    {
                      flex: 1,
                      alignSelf: 'flex-start',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                    },
                  ]}>
                  <Button
                    containerStyle={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: 0,
                    }}
                    buttonStyle={[
                      styles.navigationButton,
                      {paddingHorizontal: 0, paddingVertical: 0},
                    ]}
                    titleStyle={[
                      styles.deliveryText,
                      {lineHeight: 36, fontWeight: '400'},
                    ]}
                    onPress={() => {
                      this.props.navigation.navigate('PhotosDraftSPV', {
                        number: this.state.receivingNumber,
                      });
                    }}
                    disabled={(this.state.receivingNumber === null)}
                    title="Inbound Photos"
                  />
                </View>
              </View>
              <SearchBar
                placeholder="Search..."
                onChangeText={this.updateSearch}
                value={this.state.search}
                lightTheme={true}
                inputStyle={{
                  backgroundColor: '#fff',
                  ...Mixins.body1,
                  padding: 0,
                  margin: 0,
                }}
                placeholderTextColor="#2D2C2C"
                searchIcon={() => (
                  <IconSearchMobile height="15" width="15" fill="#2D2C2C" />
                )}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  paddingHorizontal: 0,
                  marginVertical: 5,
                }}
                inputContainerStyle={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: '#D5D5D5',
                }}
                leftIconContainerStyle={{backgroundColor: 'white'}}
              />
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Badge
                  value="All"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(0)}
                  badgeStyle={
                    this.state.filtered === 0
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                  textStyle={
                    this.state.filtered === 0
                      ? styles.badgeActiveTint
                      : styles.badgeInactiveTint
                  }
                />
                <Badge
                  value="Reported"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(1)}
                  badgeStyle={
                    this.state.filtered === 1
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                  textStyle={
                    this.state.filtered === 1
                      ? styles.badgeActiveTint
                      : styles.badgeInactiveTint
                  }
                />
                <Badge
                  value="Processed"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(2)}
                  badgeStyle={
                    this.state.filtered === 2
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                  textStyle={
                    this.state.filtered === 2
                      ? styles.badgeActiveTint
                      : styles.badgeInactiveTint
                  }
                />
              </View>

              <Card containerStyle={styles.cardContainer}>
                {(_manifest.length === 0 || this.state.renderFiltered === true) ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 100,
                    }}>
                    {(this.state.receivingNumber === null || this.state.renderFiltered === true) ? (
                      <ActivityIndicator size={50} color="#121C78" />
                    ) : this.props.manifestType === 2 ? (
                      <BlankList height="185" width="213" />
                    ) : (
                      <>
                        <EmptyIlustrate
                          height="132"
                          width="213"
                          style={{marginBottom: 15}}
                        />
                        <Text style={{...Mixins.subtitle3}}>Empty Product</Text>
                      </>
                    )}
                  </View>
                ) : (
                  _manifest.map((u, i) => (
                    <InboundSupervisorDetail
                      key={i}
                      index={i}
                      item={u}
                      navigation={this.props.navigation}
                      currentManifest={this.props.setCurrentManifest}
                      toReportDetail={() => {
                        this.props.navigation.navigate('ReportDetailsSPV', {
                          number: this.state.receivingNumber,
                          productID: u.pId,
                          isShowBannerSuccess: false,
                          isShowBanner: '',
                        });
                      }}
                      // for prototype only
                      // end
                    />
                  ))
                )}
              </Card>
            </View>
          </ScrollView>
          <Overlay
            fullScreen={false}
            overlayStyle={styles.overlayContainerStyle}
            isVisible={_visibleOverlay}
            onBackdropPress={this.toggleOverlay}>
            <Text style={styles.confirmText}>
            { this.state.hasReport === true ? 'Are you sure you want to Submit ?' : 'Are you sure you want to Confirm ?'}
            </Text>
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {borderWidth: 1, borderColor: '#ABABAB'},
                ]}
                onPress={() => this.handleConfirm({action: false})}>
                <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                onPress={() => this.handleConfirm({action: true})}>
                <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Overlay>
          <SafeAreaInsetsContext.Consumer>
            {(inset) => (
              <View
                style={[
                  styles.bottomTabContainer,
                  {paddingBottom: 10 + inset.bottom},
                ]}>
                <Button
                  containerStyle={{
                    flex: 1,
                    marginRight: 10,
                    height: '100%',
                    flexBasis: 1,
                  }}
                  buttonStyle={[
                    styles.navigationButton,
                    {
                      paddingVertical: 10,
                      backgroundColor: '#121C78',
                      flexGrow: 1,
                    },
                  ]}
                  titleStyle={styles.deliveryText}
                  onPress={() => {
                    this.props.navigation.navigate('IVASListSPV', {
                      number: this.state.receivingNumber,
                    });
                  }}
                  disabled={(this.state.receivingNumber === null || this.state.hasActiveReceipt === null)}
                  title="Shipment VAS"
                />
                <Button
                  containerStyle={{flex: 1, height: '100%', flexBasis: 1}}
                  buttonStyle={[
                    styles.navigationButton,
                    {paddingVertical: 10, flexGrow: 1},
                  ]}
                  titleStyle={styles.deliveryText}
                  onPress={this.toggleOverlay}
                  disabled={( this.state.receivingNumber === null || (( this.state.hasReport === true && (this.state.hasActiveReceipt === null || this.state.route_to_processor === 1)) || (this.state.hasReport === false && (this.state.hasActiveReceipt !== false)))  )}
                  title={this.state.hasReport === true ? "Route to Processor" : "Confirm & Putaway"}
                />
              </View>
            )}
          </SafeAreaInsetsContext.Consumer>
        </SafeAreaProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  badgeSort: {
    marginRight: 5,
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
  code: {
    fontSize: 20,
    color: '#424141',
    marginVertical: 0,
  },
  body: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
  },
  headingCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionContent: {
    marginBottom: 0,
    marginHorizontal: 20,
  },
  buttonSticky: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    elevation: 10,
    zIndex: 10,
  },
  barcodeButton: {
    ...Mixins.buttonAvatarDefaultOverlayStyle,
    backgroundColor: '#F07120',
    borderRadius: 100,
  },
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 20,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0, //default is 1
    shadowRadius: 0, //default is 1
    elevation: 0,
    backgroundColor: '#ffffff',
  },
  alertButton: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  alert: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDivider: {
    flex: 1,
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
    fontSize: PixelRatio.get() > 2.75 ? 12 : 14,
  },
  overlayContainerStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: window.height * 0.3,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cancelButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  confirmText: {
    fontSize: 20,
    textAlign: 'center',
  },
  cancelButton: {
    width: '40%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  bottomTabContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
    paddingTop: 20,
  },
  reportButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ABABAB',
  },
});

const manifestDummy = [
  {
    code: '9780312205195',
    total_package: 2,
    name: 'Bear Brand Milk',
    color: 'white',
    category: '[N-BR1B]',
    timestamp: moment().unix(),
    scanned: 1,
    CBM: 20.1,
    weight: 115,
    status: 'onProgress',
    sku: '221314123',
    grade: 'Pick',
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'Lotte Milkis',
    category: '',
    color: 'blue',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 10.1,
    weight: 70,
    sku: '412321412',
    grade: 'Pick',
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'LG TwinWash',
    category: '[A-CCR1]',
    color: 'grey',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 15.1,
    weight: 90,
    sku: '1241231231',
    grade: 'Pick',
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'Midea U Inverter',
    category: '[A-DD1B]',
    color: 'white',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.1,
    weight: 115,
    sku: '12454634545',
    grade: 'Pick',
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'TEODORES',
    category: '[G-CCD1]',
    color: 'white',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 10.1,
    weight: 90,
    sku: '430344390',
    grade: 'Pick',
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'FIXA 7.2V',
    category: '[A-CCR1]',
    color: 'black',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 15.1,
    weight: 70,
    sku: '430958095',
    grade: 'Pick',
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'Hock Stove Gas',
    category: '[D-RR1B]',
    color: 'black',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.1,
    weight: 115,
    sku: '430950345',
    grade: 'Pick',
  },
  {
    code: '9780099582113',
    total_package: 5,
    name: 'Philips Bulb E27',
    category: '[D-BB1B]',
    color: 'white',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.1,
    weight: 115,
    sku: '250345345',
    grade: 'Pick',
  },
  {
    code: '13140026927112',
    total_package: 5,
    name: 'bosch gws 5-100',
    category: '[A-DD1B]',
    color: 'blue',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.1,
    weight: 115,
    sku: '4309583049',
    grade: 'Pick',
  },
  {
    code: '13140026927113',
    total_package: 5,
    name: 'Bosch Xenon H11',
    category: '[D-BR1B]',
    color: 'blue',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.1,
    weight: 115,
    sku: '3405934095',
    grade: 'Pick',
  },
  {
    code: '13140026927114',
    total_package: 5,
    color: 'black',
    name: '4 Way Terminal',
    category: '[D-CC2B]',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.1,
    weight: 115,
    sku: '4059304034',
    grade: 'Pick',
  },
];

function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    ManifestCompleted: state.originReducer.filters.manifestCompleted,
    manifestList: state.originReducer.manifestList,
    inboundList: state.originReducer.inboundSPVList,
    // for prototype only
    barcodeScanned: state.originReducer.filters.barcodeScanned,
    barcodeGrade: state.originReducer.filters.barcodeGrade,
    completedInboundList: state.originReducer.completedInboundList,
    currentASN: state.originReducer.filters.currentASN,
    ReportedManifest: state.originReducer.filters.ReportedManifest,
    keyStack: state.originReducer.filters.keyStack,
    manifestType: state.originReducer.filters.currentManifestType,
    // end
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    toggleDrawer: (bool) => {
      return dispatch({type: 'ToggleDrawer', payload: bool});
    },
    dispatchCompleteManifest: (bool) => {
      return dispatch({type: 'ManifestCompleted', payload: bool});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    setManifestList: (data) => {
      return dispatch({type: 'ManifestList', payload: data});
    },
    addCompleteASN: (data) => {
      return dispatch({type: 'addCompleteASN', payload: data});
    },
    setItemScanned: (item) => {
      return dispatch({type: 'BarcodeScanned', payload: item});
    },
    setReportedManifest: (data) => {
      return dispatch({type: 'ReportedManifest', payload: data});
    },
    setCurrentManifest: (data) => {
      return dispatch({type: 'setCurrentManifest', payload: data});
    },
    setItemGrade: (grade) => {
      return dispatch({type: 'BarcodeGrade', payload: grade});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);
