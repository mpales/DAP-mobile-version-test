import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Switch,
  NativeModules,
  AppState,
  Platform,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {Input, Avatar} from 'react-native-elements';
import {Text, Button} from 'react-native-elements';
import {
  ProviderPropType,
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE 
} from 'react-native-maps';
import {default as Reanimated, useAnimatedScrollHandler} from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import IconEllipse from '../../../assets/icon/Ellipse 9.svg';
import IconSpeech26 from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import XMarkIcon from '../../../assets/icon/iconmonstr-x-mark-1 1mobile.svg';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import Loading from '../../../component/loading/loading';
import ContactClient from '../../../component/linked/contactClient';
import OfflineMode from '../../../component/linked/offlinemode'
import {
  SafeAreaView,
  SafeAreaInsetsContext,
} from 'react-native-safe-area-context';
import NavigationalMap from '../../../component/map';
import Popup from '../../../component/map/link/components/Popup';
import FormatHelper from '../../../component/helper/format';
const {RNFusedLocation} = NativeModules;
const screen = Dimensions.get('window');
const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = (screen.width - 2 * ITEM_SPACING - 2 * ITEM_PREVIEW) * 0.65;
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;

class AnimatedMarkers extends React.Component {
  _appState = React.createRef();
  locatorID = null;
  static Beacon = null;
    panX = new Reanimated.Value(0);
    indexIndicator = new Reanimated.Value(0);
  callbackNode = new Reanimated.Value(1);
  fadeAnimButton = new Animated.Value(1);
  fadeAnim = new Animated.Value(0);
  constructor(props) {
    super(props);

    this.state = {
      index: null,
      carousel: new Animated.Value(1),
      toggleContainer: false,
      trafficLayer: false,
      trafficButton : false,
      isShowSeeDetails: true,
      isShowPostponeOrder: false,
      isShowCancelOrder: false,
      isLoading: true,
      loadingLayer: false,
      isThirdPartyNavigational: false,
      startForegroundService: false,
      ApplicationNavigational: null,
      _visibleOverlayContact: false,
    };
    this.renderCard.bind(this);
    this.onPressedTraffic.bind(this);
    this.onLihatRincian.bind(this);
    this.onLihatDetail.bind(this);
    this.onCompleteDelivery.bind(this);
    this.toggleOverlayContact.bind(this);
  }
 
  static getDerivedStateFromProps(props,state){
    const {navigation, currentDeliveringAddress, markers, dataPackage, startDelivered, setStartDelivered, setBottomBar} = props;
    const {index, currentCoords, route, updateToRenderMap, region} = state;

    if(index === null && currentDeliveringAddress === null) {
      let params = props.route.params;
      if(params !== undefined && params.index !== undefined) {
        //from list
          //set first camera
        return {...state, index: params.index};
      } else {
        //from drawer
        return {...state, index: 0};
      }
    } else if(currentDeliveringAddress !== null && index === null) {
      // when persistance delivery
      setStartDelivered(true);
      setBottomBar(false);
      return {...state, index:currentDeliveringAddress};
    } else if(currentDeliveringAddress === null && index !== null){
      // when switch between item cards
      return {...state}
    }
   
    return {...state};
  }
 
  componentDidUpdate(prevProps, prevState, snapshot)
  {
    if(this.props.startDelivered !== prevProps.startDelivered){
      if(this.props.startDelivered){
        this.setState({toggleContainer: true});
      } else {
        this.setState({toggleContainer: false});
      }
    }
  
    if(prevState.isLoading !== this.state.isLoading){
      if(this.props.isConnected){
        this.setState({isLoading:false});
      } else {
        this.setState({isLoading:true});
      }
    }
    
    if(prevProps.isTraffic !== this.props.isTraffic){
          this.setState({trafficLayer: this.props.isTraffic});
      }
   
  }
  componentDidMount() {
    const {index} = this.state;
    this.indexIndicator.setValue(index);
  }
  componentWillUnmount() {
    this.props.setStartDelivered(false);
  }
  toggleOverlayContact = () => {
    const {_visibleOverlayContact} = this.state;
    this.setState({_visibleOverlayContact: !_visibleOverlayContact});
  };
  onLihatRincian = ({toggle, bottomBar}) => {
    const {carousel, index} = this.state;
    Animated.timing(carousel, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    this.props.setStartDelivered(true);
    this.fadeAnim.setValue(0);
    this.fadeAnimButton.setValue(1);
    this.props.setCurrentDeliveringAddress(index);
    this.setState({...this.state, toggleContainer: toggle, isThirdPartyNavigational:true});
    this.props.setBottomBar(bottomBar);
  };
  onLihatDetail = () => {
    const {index} = this.state;
    this.props.setBottomBar(true);
    this.props.navigation.navigate({
      name: 'Package',
      params: {
        index: index,
      }
    });
  };
  onCompleteDelivery = () =>{
    const {index} = this.state;
    this.props.setBottomBar(true);
    this.props.navigation.navigate({
      name: 'Order',
      params: {
        index: index,
      }
    });
  };
  onSeeDetails = (bool,indexTo) => {
    const {isShowSeeDetails, index} = this.state;
        if(indexTo !== undefined && indexTo !== index){
          if (indexTo > -1) {
            this.flatListRef.scrollToIndex({animated: true,index:indexTo});
        }
        if(!isShowSeeDetails){
          this.setState({
            ...this.state,
            isShowSeeDetails: bool,
            index: indexTo,
            //canMoveHorizontal: bool ? false : true
          });
        } else {
          this.setState({
            ...this.state,
            index: indexTo,
            //canMoveHorizontal: bool ? false : true
          });
        }
      } else {
        bool
        ? this.setState({
            isShowSeeDetails: bool,
          })
        : this.setState({
            ...this.state,
            isShowSeeDetails: bool,
          });
      
      }
  }
  onPressedTraffic = (value) => {
    this.setState({trafficLayer: value});
  };
  
  onRegionChange = (region) => {
 
  };

  renderCard =({ item, index, separators })=>{
    const {named,packages, Address} = this.props.dataPackage[index];
 
    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => this.onSeeDetails(this.state.isShowSeeDetails, index)}>
        <Animated.View
          style={
            index === this.state.index
              ? [
                  styles.item,
                  {
                    borderWidth: 2.5,
                    borderColor: '#F1811C',
                  },
                ]
              : [styles.item]
          }>
          <View style={styles.sectionContentTitle}>
            <Text style={styles.orderTitleItem}>
              {index + 1 + '. '}
              {named}
            </Text>
            <Text style={styles.chrono}>
              Distance{' '}
              {FormatHelper.calculateDistance(
                this.props.statAPI[index]?.distanceAPI ?? null,
              )}{' '}
              Km
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.contentList}>
              <Text style={[styles.listLabel, {flex: 0.4}]}>To</Text>
              <Text style={styles.listContent}>
                {Address}, 
              </Text>
            </View>
          </View>
          <View style={styles.sectionContentButton}>
            <Button
              buttonStyle={styles.contentButton}
              onPress={() => this.onSeeDetails(true, index)}
              titleStyle={styles.contentButtonText}
              title="Show Deliver"
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
  renderInner = () => {
    const {route, index} = this.state;
    const to = '-';
    const current = '-';
    const durationAPI = this.props.statAPI[index] !== undefined ? this.props.statAPI[index].durationAPI : undefined;
    const distanceAPI = this.props.statAPI[index] !== undefined ? this.props.statAPI[index].distanceAPI : undefined;
    const {named,packages, Address, list} = this.props.dataPackage[index];
    return (
      <View style={styles.sheetContainer}>
          <SafeAreaView edges={['bottom']} style={{backgroundColor: '#fff'}}>
          <View style={styles.trafficButton}>
            <Text style={styles.buttonText}>Traffic</Text>
            <Switch
              onValueChange={(value) => this.onPressedTraffic(value)}
              value={this.state.trafficButton}
            />
          </View>
        <View style={styles.sectionSheetDetail}>
        <Text style={styles.orderTitle}>{named}</Text>
        <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
          <View style={styles.detailContent}>
            <Text style={styles.chrono}>Distant Location {FormatHelper.calculateDistance(distanceAPI)} Km</Text>
            <Text style={styles.eta}>ETA :  {FormatHelper.formatETATime(durationAPI, 0)}</Text>
            <View style={styles.detail}>
              <Text style={styles.labelDetail}>Packages</Text>
              <Text style={styles.labelInfo}>{packages} box</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.buttonDetail}
            onPress={() => this.onLihatDetail()}>
            <Text style={styles.detailTitle} h6>
              Delivery Detail
            </Text>
          </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.sectionSheetCordinate, {maxHeight: 200}]}>
        <Input
              containerStyle={styles.spatialSheetContainer}
              inputContainerStyle={styles.spatialInput}
              inputStyle={styles.spatialInputText}
              value={current}
              disabled={true}
              multiline={true}
              numberOfLines={3}
              leftIconContainerStyle={{
                flex: 0.4,
                alignItems: 'flex-start',
              }}
              leftIcon={() => {
                return (
                  <View style={styles.leftLabel}>
                    <View style={{flexDirection: 'column'}}>
                      <IconEllipse height="13" width="13" fill="#F1811C" />
                      <View
                        style={{
                          height: 40,
                          position: 'absolute',
                          top: 12,
                          right: 0,
                          left: 5,
                          backgroundColor: '#F1811C',
                          width: 2,
                        }}></View>
                    </View>
                    <Text style={styles.leftLabelText}>Current</Text>
                  </View>
                );
              }}
            />
            <Input
              containerStyle={styles.spatialSheetContainer}
              inputContainerStyle={styles.spatialInput}
              inputStyle={styles.spatialInputText}
              value={to}
              multiline={true}
              disabled={true}
              numberOfLines={3}
              leftIconContainerStyle={{
                flex: 0.4,
                alignItems: 'flex-start',
              }}
              leftIcon={() => {
                return (
                  <View style={styles.leftLabel}>
                    <View style={{flexDirection: 'column'}}>
                      <IconEllipse height="13" width="13" fill="#F1811C" />
                      <View
                        style={{
                          height: 40,
                          position: 'absolute',
                          bottom: 12,
                          right: 0,
                          left: 5,
                          backgroundColor: '#F1811C',
                          width: 2,
                        }}></View>
                    </View>
                    <Text style={styles.leftLabelText}>To</Text>
                  </View>
                );
              }}
            />
           <Animated.View
              style={{
                marginHorizontal: 10,
                transform: [{scale: this.fadeAnimButton}],
              }}>
              <Button
                buttonStyle={styles.navigationButton}
                titleStyle={styles.deliveryText}
                onPress={this.onCompleteDelivery}
                title="Complete Delivery"
              />
            </Animated.View>
        </View>
        <Animated.View
            style={{
              borderTopWidth: 1,
              borderTopColor: '#D5D5D5',
              opacity: this.fadeAnim,
              transform: [{scale: this.fadeAnim}],
            }}>
            <View style={styles.sectionPackage}>
          <Text style={styles.titlePackage}>Package Detail</Text>
          <View style={styles.sectionDividier}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Transfer</Text>
              <Text style={styles.infoPackage}>Van</Text>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Commodity</Text>
              <Text style={styles.infoPackage}>Dry Food</Text>
            </View>
          </View>
          <View style={styles.sectionDividierRight}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Packaging type</Text>
              <Text style={styles.infoPackage}>20 pallet</Text>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Weight</Text>
              <Text style={styles.infoPackage}>23.00 Kg</Text>
            </View>
          </View>
        </View>
            <View style={styles.sectionSheetButton}>
              <Button
                buttonStyle={styles.navigationButton}
                titleStyle={styles.deliveryText}
                onPress={this.onCompleteDelivery}
                title="Complete Delivery"
              />
              <View style={[styles.sectionDividier, {marginVertical: 12}]}>
                <Button
                  containerStyle={[styles.buttonDivider, {marginRight: 10}]}
                  title="Cancel"
                  type="outline"
                  titleStyle={{color: '#F1811C', ...Mixins.subtitle3, lineHeight: 21}}
                  onPress={() => {
                    this.handleCancelOrder({showCancel: true});
                  }}
                />

                <Button
                  containerStyle={[styles.buttonDivider, {marginLeft: 10}]}
                  icon={() => (
                    <View style={{marginRight: 6}}>
                      <IconSpeech26 height="15" width="15" fill="#fff" />
                    </View>
                  )}
                  title="Contact Client"
                  titleStyle={{color: '#fff', ...Mixins.subtitle3, lineHeight: 21}}
                                  onPress={this.toggleOverlayContact}
                  buttonStyle={{backgroundColor: '#F07120'}}
                />
              </View>
            </View>
          </Animated.View>
          </SafeAreaView>
      </View>
    );
  };
  
  renderHeader = () => (
    <View style={styles.header}>
    <View style={styles.panelHeader}>
      <View style={styles.panelHandle} />
    </View>
  </View>
  );

  fadeAnimation = (position) => {
    if (position < 0.3) {
      Animated.sequence([
        Animated.timing(this.fadeAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(this.fadeAnimButton, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(this.fadeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(this.fadeAnimButton, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  handleCancelOrder = ({showCancel}) => {
    this.setState({
      isShowCancelOrder: showCancel,
    });
  };
  handleCancelOrderAction = ({action, currentOrderId}) => {
    const {index} = this.state;
    if (action) {
      this.setState({toggleContainer: false});
      this.props.setStartDelivered(false);
      this.props.setCurrentDeliveringAddress(null);
      this.props.resetDeliveryDestinationData();
      this.props.setBottomBar(true);
      this.props.navigation.navigate('List');
    } else {
      this.onLihatRincian({toggle: true, bottomBar: false});
    }
    this.setState({
      isShowCancelOrder: false,
    });
  };
  handlePostponeOrder = ({showPostpone}) => {
    this.setState({
      isShowPostponeOrder: showPostpone,
    });
  };

  handlePostponeOrderAction = ({action, currentOrderId}) => {
    if (action) {
      this.props.navigation.navigate('Cancel');
    } else {
      if (this.props.startDelivered) {
        this.onLihatRincian({toggle: true, bottomBar: false});
      }
    }
    this.setState({
      isShowPostponeOrder: false,
    });
  };

  render() {
    const {
      route,
      toggleContainer,
      index,
      trafficLayer,
    } = this.state;
    const {
      startDelivered,
      currentPositionData,
      destinationid,
    } = this.props;
    
    if(!this.props.isConnected && this.props.isActionQueue.length > 0 ){
      return (
        <View style={styles.container}>
          <OfflineMode/>
         <Loading />
        </View>
      );
    }
    const current = '-';
    const to = '-';
    const durationAPI = this.props.statAPI[index] !== undefined ? this.props.statAPI[index].durationAPI : undefined;
    const distanceAPI = this.props.statAPI[index] !== undefined ? this.props.statAPI[index].distanceAPI : undefined;
    const {named,packages, Address} = this.props.dataPackage[index];
    return (
      <View style={StyleSheet.absoluteFill}>
      <OfflineMode/>
                <NavigationalMap 
                foregroundService={this.state.startForegroundService} 
                index={this.state.index}
                data={this.props.dataPackage}
                markers={this.props.markers}
                trafficLayer={this.state.trafficLayer}
                style={styles.map}
                />
              {startDelivered &&
          currentPositionData !== null &&
          destinationid !== null &&
          this.state.isThirdPartyNavigational &&
          this.props.ApplicationNavigational === null && (
            <Popup
              isVisible={this.state.isThirdPartyNavigational}
              onCancelPressed={() =>
                this.setState({isThirdPartyNavigational: false})
              }
              onAppPressed={(app) => {
                this.setState({
                  isThirdPartyNavigational: false,
                  startForegroundService: true,
                });
                this.props.setCurrentApplicationNavigational(app);
              }}
              onBackButtonPressed={() =>
                this.setState({isThirdPartyNavigational: false, startForegroundService: true})
              }
              modalProps={{
                // you can put all react-native-modal props inside.
                animationIn: 'slideInUp',
              }}
              appsWhiteList={
                [
                  /* Array of apps (apple-maps, google-maps, etc...) that you want
                        to show in the popup, if is undefined or an empty array it will show all supported apps installed on device.*/
                ]
              }
              appTitles={
                {
                  /* Optional: you can override app titles. */
                }
              }
              options={{
                latitude: this.props.dataPackage[index].coords.lat,
                longitude:this.props.dataPackage[index].coords.lng,
                sourceLatitude: -8.0870631, // optionally specify starting location for directions
                sourceLongitude: -34.8941619, // not optional if sourceLatitude is specified
                title: 'The White House', // optional
                googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
                googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58', // optionally specify the google-place-id
                alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                dialogTitle: 'Selected Maps app', // optional (default: 'Open in Maps')
                dialogMessage:
                  'Your location would be tracked on background service', // optional (default: 'What app would you like to use?')
                cancelText: 'Cancel', // optional (default: 'Cancel')
                appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
                naverCallerName: 'com.example.myapp', // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
                // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
                // app: 'uber'  // optionally specify specific app to use
              }}
              style={
                {
                  /* Optional: you can override default style by passing your values. */
                }
              }
            />
          )}
           <ContactClient
          overlayState={this.state._visibleOverlayContact}
          toggleOverlay={this.toggleOverlayContact}
        />
          {toggleContainer &&
          !this.state.isShowCancelOrder &&
          !this.state.isShowPostponeOrder &&
          startDelivered &&
          currentPositionData !== null &&
          destinationid !== null
           && (
              <View
              style={StyleSheet.absoluteFillObject}>
              {() => {}}
              <Reanimated.Code
                exec={() =>
                  Reanimated.onChange(
                    this.callbackNode,
                    Reanimated.block([
                      Reanimated.call([this.callbackNode], ([callback]) =>
                        this.fadeAnimation(callback),
                      ),
                    ]),
                  )
                }
              />
                <SafeAreaInsetsContext.Consumer>
                {(insets) => {
                  let snapArray = [600, 350, 130];

               
                  return (
                    <BottomSheet
                      ref={this.state.bottomSheet}
                      initialSnap={0}
                      snapPoints={snapArray}
                      enabledBottomClamp={true}
                      enabledContentTapInteraction={false}
                      renderContent={this.renderInner}
                      renderHeader={this.renderHeader}
                      callbackNode={this.callbackNode}
                      enabledInnerScrolling={false}
                      enabledBottomInitialAnimation={true}
                    />
                  );
                }}
              </SafeAreaInsetsContext.Consumer>
    
            
            </View>
            ) }
            { !toggleContainer &&
          !this.state.isShowCancelOrder && 
          !this.state.isShowPostponeOrder && (
              <Animated.View style={[styles.itemContainer]}>
                {this.state.isShowSeeDetails && (
              <View
              style={[
                styles.itemLegend,
                {flexDirection: 'row', elevation: 4, zIndex: 4},
              ]}>
                   <Animated.View style={styles.itemHead}>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => this.onSeeDetails(false)}
                      >
                        <XMarkIcon width="15" height="15" fill="#fff" />
                      </TouchableOpacity>
                      <View style={styles.sectionDetail}>
                          <Text style={styles.orderTitle}>{named}</Text>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                          <View style={styles.detailContent}>
                            <Text style={styles.chrono}>
                              Distant Location {FormatHelper.calculateDistance(distanceAPI)} Km
                            </Text>
                            <Text style={styles.eta}>ETA: {FormatHelper.formatETATime(durationAPI, 0)}</Text>
                            <View style={styles.detail}>
                              <Text style={styles.labelDetail}>Packages</Text>
                              <Text style={styles.labelInfo}>{packages} box</Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={styles.buttonDetail}
                            onPress={() => this.onLihatDetail()}>
                            <Text style={styles.detailTitle}>
                              Delivery Detail
                            </Text>
                          </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.sectionCordinate}>
                      <Input
                        disabled={true}
                        containerStyle={styles.spatialContainer}
                        inputContainerStyle={styles.spatialInput}
                        inputStyle={styles.spatialInputText}
                        value={current}
                        multiline={true}
                        numberOfLines={3}
                        disabled={true}
                        disabledInputStyle={{
                          color: 'black',
                          textDecorationColor: '#000',
                        }}
                        leftIconContainerStyle={{
                          flex: 0.4,
                          alignItems: 'flex-start',
                        }}
                        leftIcon={() => {
                          return (
                            <View style={styles.leftLabel}>
                              <View style={{flexDirection: 'column'}}>
                                <IconEllipse
                                  height="13"
                                  width="13"
                                  fill="#F1811C"
                                />
                                <View
                                  style={{
                                    height: 40,
                                    position: 'absolute',
                                    top: 12,
                                    right: 0,
                                    left: 5,
                                    backgroundColor: '#F1811C',
                                    width: 2,
                                  }}
                                />
                              </View>
                              <Text style={styles.leftLabelText}>Current</Text>
                            </View>
                          );
                        }}
                      />
                      <Input
                        disabled={true}
                        containerStyle={styles.spatialContainer}
                        inputContainerStyle={styles.spatialInput}
                        inputStyle={styles.spatialInputText}
                        value={to}
                        multiline={true}
                        numberOfLines={3}
                        // disabled={true}
                        disabledInputStyle={{
                          color: '#000',
                          textDecorationColor: '#000',
                        }}
                        leftIconContainerStyle={{
                          flex: 0.4,
                          alignItems: 'flex-start',
                        }}
                        leftIcon={() => {
                          return (
                            <View style={styles.leftLabel}>
                              <View style={{flexDirection: 'column'}}>
                                <IconEllipse
                                  height="13"
                                  width="13"
                                  fill="#F1811C"
                                />
                                <View
                                  style={{
                                    height: 40,
                                    position: 'absolute',
                                    bottom: 12,
                                    right: 0,
                                    left: 5,
                                    backgroundColor: '#F1811C',
                                    width: 2,
                                  }}
                                />
                              </View>
                              <Text style={styles.leftLabelText}>To</Text>
                            </View>
                          );
                        }}
                      />
                    </View>
                        <View style={styles.sectionButton}>
                          <Button
                            buttonStyle={styles.navigationButton}
                            titleStyle={styles.deliveryText}
                            title="Start delivery"
                            onPress={() => this.onLihatRincian({ toggle: true, bottomBar: false })} />
                              <Button
                        containerStyle={{marginTop: 10}}
                        buttonStyle={styles.buttonPostpone}
                        titleStyle={styles.detailPostpone}
                        onPress={() =>
                          this.handlePostponeOrder({showPostpone: true})
                        }
                        title="Postpone"
                      />
                        </View>
                    </Animated.View>
                    </View>
               )}
                 <View
          style={{
            flexDirection: 'column',
            flexShrink: 1,
            zIndex: 1,
            elevation: 1,
            backgroundColor: 'white',
          }}
          // onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}
          >
                 <View style={styles.itemDivider} />
                <View style={styles.itemContent}>
                  <TouchableOpacity style={styles.buttonHistory}>
                    <Text style={styles.buttonText}>
                      See All
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.indicator}>
                    <Reanimated.Code
                        exec={() =>
                        Reanimated.onChange(
                            this.panX,
                            Reanimated.block([
                            Reanimated.call([this.panX], ([value]) => 
                            this.indexIndicator.setValue(Math.abs(value/ITEM_WIDTH))
                            ),
                            ]),
                        )
                        }
                    />
                    {this.props.dataPackage.map((element, index, arr) => {
                      return (
                        <Reanimated.View
                          key={index}
                          style={styles.indicatorIcon}>
                          <Reanimated.Text
                            style={[styles.indicatorText, {color: Reanimated.interpolateColors(this.indexIndicator,{
                                inputRange: [index-1, index,index+1],
                                outputColorRange: ['#C4C4C4', '#424141','#C4C4C4'],
                              })}]}>
                            ▂
                          </Reanimated.Text>
                        </Reanimated.View>
                      );
                    })}
                  </View>
                  <View style={styles.buttonAll}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.buttonText}>
                      Traffic
                      </Text>
                    
                    <Switch onValueChange={(value) => this.onPressedTraffic(value)}
                      value={trafficLayer}/>
                    </View>
                </View>
                </View>
               
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    horizontal
                    data={this.props.dataPackage}
                    renderItem={this.renderCard}
                    contentContainerStyle={{
                      backgroundColor: 'white',
                      paddingBottom: 10,
                      paddingTop: 5,
                    }}
                    keyExtractor={(item, index) => index}
                    initialScrollIndex={this.state.index}
                    onScroll={(e) => {
                        console.log('test');
                        this.panX.setValue(e.nativeEvent.contentOffset.x);
                      }}
                />
               
                </View>
              </Animated.View>
            )}
        {this.state.isShowCancelOrder &&
         ( <View style={styles.overlayContainer}>
            <View style={styles.cancelOrderSheet}>
              <Text style={styles.cancelText}>
                Are you sure you want to cancel/postpone the deliver?
              </Text>
              <View style={styles.cancelButtonContainer}>
                <TouchableOpacity 
                  style={[styles.cancelButton, {borderWidth: 1, borderColor: '#ABABAB'}]}
                  onPress={() => this.handleCancelOrderAction({action: false})}>
                  <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                  onPress={() =>
                    this.handleCancelOrderAction({
                      action: true,
                      currentOrderId: index,
                    })
                  }>
                  <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>)
        }
          {this.state.isShowPostponeOrder && (
          <View style={styles.overlayContainer}>
            <View style={styles.cancelOrderSheet}>
              <Text style={styles.cancelText}>
                Are you sure you want to postpone the delivery?
              </Text>
              <View style={styles.cancelButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    {borderWidth: 1, borderColor: '#ABABAB'},
                  ]}
                  onPress={() =>
                    this.handlePostponeOrderAction({action: false})
                  }>
                  <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                  onPress={() =>
                    this.handlePostponeOrderAction({
                      action: true,
                      currentOrderId: index,
                    })
                  }>
                  <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

AnimatedMarkers.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  snapContainer: {
    height: ITEM_PREVIEW_HEIGHT,
    backgroundColor: 'transparent',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  itemContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    // top: screen.height - ITEM_PREVIEW_HEIGHT - 64,
    // paddingTop: !ANDROID ? 0 : screen.height - ITEM_PREVIEW_HEIGHT - 64,
  },

  itemContent: {
    backgroundColor: 'white',
    width: screen.width,
    flexDirection: 'row',
    flexShrink: 1,
    paddingTop: 10,
    paddingBottom: 1,
    marginVertical: 0,
  },
  itemLegend: {
    backgroundColor: 'transparent',
    flexShrink: 1,
  },
  buttonHistory: {
    flex: 1,
    fontWeight: 'bold',
    marginHorizontal: 10,
    alignItems: 'flex-start',
  },
  buttonAll: {
    flex: 1,
    marginHorizontal: 10,
    fontWeight: 'bold',
    alignItems: 'flex-end',
  },
  indicator: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  indicatorIcon: {
    flexShrink: 1,
  },
  indicatorText: {
    fontSize: 14,
  },
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
  item: {
    width: ITEM_WIDTH,
    height: screen.height * 0.18,
    backgroundColor: 'white',
    marginHorizontal: ITEM_SPACING,
    marginVertical: 15,
    borderRadius: 3,
    borderColor: '#000',
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    
    elevation: 7,

  },
  itemDivider: {
    height: 30,
    width: screen.width,
    backgroundColor: 'white',
    position: 'absolute',
    top: -30,
    left: 0,
  },
  itemHead: {
    width: screen.width - ITEM_SPACING * 4,
    marginHorizontal: (ITEM_SPACING * 4 )/2,
    marginBottom:10,
    height: (screen.height * 47) / 100,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#000',
    flexDirection: 'column',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  sectionDetail: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    marginHorizontal: 20,
  },
  sectionSheetDetail: {
    flexShrink: 1,
    flexDirection: 'column',
    marginHorizontal: 20,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent:'center',
  },
  buttonDetail: {
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 5,
    backgroundColor: '#F1811C',
    alignItems: 'center',
    height: 35,
  },
  buttonPostpone: {
    flexShrink: 1,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#D5D5D5',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  detailPostpone: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '600',
    color: '#F07120',
  },
  detailTitle: {
...Mixins.small3,
lineHeight: 12,
    fontWeight: '600',
    color: 'white',
  },
 
  sectionCordinate: {
    marginHorizontal: 10,
    flex: 2,
    flexDirection: 'column',
  },
  sectionSheetCordinate: {
    paddingHorizontal: 10,
    marginTop: 15,
    flexShrink: 1,
    flexDirection: 'column',
    alignContent: 'flex-end',
  },
  spatialContainer: {
    flexShrink: 1,
  },
  spatialSheetContainer: {
    flexShrink: 1,
  },
  spatialInput: {
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    paddingHorizontal: 15,
    height: ((screen.height * 47) / 100) / 5,
    borderBottomWidth: 0,
  },
  spatialInputText: {
    ...Mixins.small3,
    lineHeight: 15,
    fontWeight: '400',
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  sectionContentTitle: {
    flex: 1,
  },
  sectionContent: {
    marginTop: 10,
    flex: 2,
    flexDirection: 'column',
  },
  contentList: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  listLabel: {
    flex: 1,
    alignSelf: 'flex-end',
    color: '#C4C4C4',
    fontSize: 10,
    lineHeight: 15,
  },
  listContent: {
    flex: 2,
    fontSize: 10,
    lineHeight: 15,
    color: '#000000',
  },
  sectionContentButton: {
    alignItems: 'stretch',
    flex: 1,
  },
  contentButton: {
    borderRadius: 5,
    paddingVertical: 3,
    backgroundColor: '#121C78',
  },
  contentButtonText: {
    ...Mixins.small3,
    lineHeight: 15,
    color: '#FEFEFE',
    fontSize: 10,
  },
  buttonText: {
    ...Mixins.small3,
    lineHeight:20,
    color: '#000000',
  },
  header: {
    backgroundColor: '#ffffff',
    height: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  panelHandle: {
    width: 120,
    height: 4,
    backgroundColor: '#C4C4C4',
  },
  orderTitle: {
    ...Mixins.subtitle3,
    lineHeight:21,
  },
  orderTitleItem: {
    ...Mixins.body3,
    color : '#000000',
    lineHeight: 18,
  },
  chrono: {
...Mixins.small3,
lineHeight:15,
    fontWeight: '400',
    color: '#6C6B6B',
  },
  eta: {
    ...Mixins.small3,
    lineHeight:15,
        fontWeight: '400',
    color: '#424141',
  },
  detail: {
    flexDirection: 'row',
  },
  labelDetail: {
    color: '#6C6B6B',
    ...Mixins.small3,
    lineHeight:15,
        fontWeight: '400',
    marginRight: 5,
  },
  labelInfo: {
    ...Mixins.small3,
    lineHeight:15,
        fontWeight: '400',
    color: '#000000',
  },
  leftLabel: {
    flexDirection: 'row',
  },
  leftLabelText: {
    marginHorizontal: 15,
    ...Mixins.small3,
    lineHeight: 12,
    color: '#C4C4C4',
  },
  sectionButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionSheetButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#121C78',
    borderRadius: 5,
  },
  sectionPackage: {
    flexDirection: 'column',
    flexShrink: 1,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  titlePackage: {
    ...Mixins.h4,
    lineHeight: 21,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  sectionDividierRight: {
    flexDirection: 'row',
  },
  dividerContent: {
    flexDirection: 'column',
    flex: 1,
    marginVertical: 8,
  },
  labelPackage: {
    ...Mixins.subtitle3,
    color: '#424141',
  },
  infoPackage: {
    ...Mixins.body3,
    fontWeight: '400',
    lineHeight: 18,
  },
  buttonDivider: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F07120',
    width: 40,
    height: 40,
    borderRadius: 40,
    elevation: 10,
    top: -20,
    right: -20,
  },
  overlayContainer: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    bottom: 0, 
    right: 0,
    left: 0,
  },
  cancelOrderSheet: {
    width: '100%',
    backgroundColor: '#fff',
    flex: 0.35,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cancelButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cancelText: {
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
  trafficButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 10,
  },
});


function mapStateToProps(state) {
  return {
    isConnected : state.network.isConnected,
    bottomBar: state.originReducer.filters.bottomBar,
    startDelivered : state.originReducer.filters.onStartDelivered,
    markers: state.originReducer.route.markers,
    stat : state.originReducer.route.stat,
    statAPI : state.originReducer.route.statAPI,
    steps: state.originReducer.route.steps,
    isTraffic: state.originReducer.filters.isTraffic,
    indexStack : state.originReducer.filters.indexStack,
    keyStack : state.originReducer.filters.keyStack,
    isActionQueue : state.network.actionQueue,
    dataPackage: state.originReducer.route.dataPackage,
    currentPositionData: state.originReducer.currentPositionData,
    destinationid : state.originReducer.deliveryDestinationData.destinationid,
    route_id: state.originReducer.route.id,
    currentDeliveringAddress: state.originReducer.currentDeliveringAddress,
    ApplicationNavigational:
    state.originReducer.filters.ApplicationNavigational,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setStartDelivered : (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    },
    setCurrentDeliveringAddress: (data) => {
      return dispatch({type: 'CurrentDeliveringAddress', payload: data});
    },
    setRouteData: (data) => {
      return dispatch({type: 'RouteData', payload: data});
    },
    resetDeliveryDestinationData: () => {
      return dispatch({type: 'DeliveryDestinationData', payload: null});
    },
    setCurrentApplicationNavigational: (data) => {
      return dispatch({type: 'CurrentApplicationNavigational', payload: data});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnimatedMarkers);

