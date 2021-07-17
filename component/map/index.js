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
  ActivityIndicator
} from 'react-native';
import {Input, Avatar} from 'react-native-elements';
import {Text, Button} from 'react-native-elements';
import PanController from './pan-controller';
import { bindActionCreators } from 'redux'
import {
  ProviderPropType,
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE 
} from 'react-native-maps';
import {getDeliveryDirections} from '../../action/direction';
import {reverseGeoCoding} from '../../action/geolocation';
import BottomSheet from 'reanimated-bottom-sheet';
import Geolocation from 'react-native-geolocation-service';
import IconDelivery2Mobile from '../../assets/icon/iconmonstr-delivery-2mobile.svg';
import IconEllipse from '../../assets/icon/Ellipse 9.svg';
import IconSpeech26 from '../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconDelivery13 from '../../assets/icon/iconmonstr-delivery-13.svg';
import IconDelivery6 from '../../assets/icon/iconmonstr-delivery-6mobile.svg';
import XMarkIcon from '../../assets/icon/iconmonstr-x-mark-1 1mobile.svg';
import {connect} from 'react-redux';
import Util from './interface/leafletPolygon';
import Location from './interface/geoCoordinate'
import Distance from './interface/spatialIterative';
import Geojsonhistory from './section/GeoJSONHistory';
import Geojson from './section/GeoJSON';
import Mixins from '../../mixins';
import Loading from '../loading/loading';
import {default as Reanimated} from 'react-native-reanimated';
import OfflineMode from '../linked/offlinemode';
import BackgroundGeolocation from '@darron1217/react-native-background-geolocation';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {showLocation} from './link';
import Popup from './link/components/Popup';
import {
  SafeAreaView,
  SafeAreaInsetsContext,
} from 'react-native-safe-area-context';
const {RNFusedLocation} = NativeModules;
const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE = 1.3287109;
const LONGITUDE = 103.8476682;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = (screen.width - 2 * ITEM_SPACING - 2 * ITEM_PREVIEW) * 0.65;
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;
const SCALE_END = screen.width / ITEM_WIDTH;
const BREAKPOINT1 = 246;
const BREAKPOINT2 = 350;
const ONE = new Animated.Value(1);

function getMarkerState(panX, panY, scrollY, i) {
  const xLeft = -SNAP_WIDTH * i + SNAP_WIDTH;
  const xRight = -SNAP_WIDTH * i - SNAP_WIDTH;
  const xHeadLeft = -SNAP_WIDTH * i + SNAP_WIDTH * 0.95;
  const xHeadRight = -SNAP_WIDTH * i - SNAP_WIDTH * 0.95;
  const xPos = -SNAP_WIDTH * i;

  const isIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const isIndexHead = panX.interpolate({
    inputRange: [xHeadRight - 1, xHeadRight, xHeadLeft, xHeadLeft + 1],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const isNotIndex = panX.interpolate({
    inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
    outputRange: [1, 0, 0, 1],
    extrapolate: 'clamp',
  });

  const isNotHeadIndex = panX.interpolate({
    inputRange: [xHeadRight - 1, xHeadRight, xHeadLeft, xHeadLeft + 1],
    outputRange: [1, 0, 0, 1],
    extrapolate: 'clamp',
  });

  const center = panX.interpolate({
    inputRange: [xPos - 10, xPos, xPos + 10],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const selected = panX.interpolate({
    inputRange: [xRight, xPos, xLeft],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  const selectedHead = panX.interpolate({
    inputRange: [xRight, xHeadRight, xPos,xHeadLeft, xLeft],
    outputRange: [0,1, 1, 1,0],
  });

  const selectedHeadX = panX.interpolate({
    inputRange: [xRight, xHeadRight, xPos,xHeadLeft, xLeft],
    outputRange: [0,1, 1, 1,0],
    extrapolate: 'clamp',
  });
  const ratioHead = panX.interpolate({
    inputRange: [xRight, xHeadRight,xHeadLeft, xLeft],
    outputRange: [0,1, 1,0],
    extrapolate: 'clamp',
  });
  
  const selecter = selected.interpolate({
    inputRange: [0, 1],
    outputRange: ['#C4C4C4', '#424141'],
  });
  const translateY = Animated.multiply(isIndex, panY);

  const height = panY.interpolate({
    inputRange: [0, 1],
    outputRange: [ITEM_PREVIEW_HEIGHT, ITEM_PREVIEW_HEIGHT * 1.5], // <-- value that larger than your content's height
  });
  const scrollX = panX.interpolate({
    inputRange: [-1, 1],
    outputRange: [1, -1],
  });
  const translateX = panX;
  const headtranslateX = Animated.multiply(Animated.add(xPos,xPos * 0.64),selectedHeadX);
  //const translateX =
  //panX.__getValue() >= 0
  //? touchX.__getValue() > -10 && touchX.__getValue < 0
  // ? Animated.add(xPos, Animated.multiply(-SNAP_WIDTH, touchX))
  //: Animated.add(xPos, -SNAP_WIDTH)
  //: touchX.__getValue() < 10 && touchX.__getValue() > 0
  //? Animated.add(xPos, Animated.multiply(SNAP_WIDTH, touchX))
  //: Animated.add(xPos, SNAP_WIDTH);

  const anim = Animated.multiply(
    isIndex,
    scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  );

  const scale = Animated.add(
    ONE,
    Animated.multiply(
      isIndex,
      scrollY.interpolate({
        inputRange: [ITEM_PREVIEW_HEIGHT / 2, BREAKPOINT1],
        outputRange: [5, 15],
        extrapolate: 'spring',
      }),
    ),
  );

  const ratio = Animated.add(
    ONE,
    Animated.multiply(
      isIndex,
      Animated.multiply(-1, panY).interpolate({
        inputRange: [ITEM_PREVIEW_HEIGHT / 2, BREAKPOINT1],
        outputRange: [11, 15],
        extrapolate: 'spring',
      }),
    ),
  );

  // [0 => 1]
  let opacity = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // if i === index: [0 => 0]
  // if i !== index: [0 => 1]
  opacity = Animated.multiply(isNotHeadIndex, opacity);

  // if i === index: [1 => 1]
  // if i !== index: [1 => 0]
  opacity = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  opacity = Animated.multiply(isIndexHead, opacity);

  opacity = Animated.multiply(opacity, scrollY).interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  let markerOpacity = scrollY.interpolate({
    inputRange: [0, BREAKPOINT1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  markerOpacity = Animated.multiply(isNotIndex, markerOpacity).interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const markerScale = selected.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return {
    translateY,
    translateX,
    scale,
    opacity,
    anim,
    center,
    selected,
    selectedHead,
    markerOpacity,
    markerScale,
    xPos,
    xLeft,
    ratio,
    selecter,
    height,
    isIndex,
    isIndexHead,
    isNotHeadIndex,
    scrollX,
    ratioHead,
    headtranslateX
  };
}

class AnimatedMarkers extends React.Component {
  _appState = React.createRef();
  locatorID = null;
  static Beacon = null;
  callbackNode = new Reanimated.Value(1);
  fadeAnimButton = new Animated.Value(1);
  fadeAnim = new Animated.Value(0);
  constructor(props) {
    super(props);
    const panX = new Animated.Value(0);
    const panY = new Animated.Value(0);
    this.onPanYChange.bind(this);
    this.onPanXChange.bind(this);

    this.modalizeRef = React.createRef();

    const scrollY = panY.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scrollX = panX.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scale = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [1, 1.6],
      extrapolate: 'clamp',
    });

    const translateY = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [0, -100],
      extrapolate: 'clamp',
    });
    const {steps, markers, dataPackage} = this.props;

    // route coords are from backend, markers are from google
    const route = Array.from({length: dataPackage.length}).map((num, index) => {
      return {
        id: index,
        ammount: index * 10,
        coordinate: {latitude: dataPackage[index].coords.lat, longitude: dataPackage[index].coords.lng},
      };
    });

   const animations = route.map((m, i) =>
      getMarkerState(panX, panY, scrollY, i),
    );
    const latLng = {
      latitude: this.props.currentPositionData.coords.lat,
      longitude: this.props.currentPositionData.coords.lng,
    };

    this.state = {
      index: null,
      panX,
      panY,
      animations,
      canMoveHorizontal: true,
      canMoveVertical: true,
      scrollY,
      scrollX,
      scale,
      translateY,
      route,
      bottomInfo: false,
      triggerBottom: false,
      region: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      carousel: new Animated.Value(1),
      bottomPan: new Animated.Value(0),
      bottomSheet: React.createRef(),
      toggleContainer: false,
      GeoJSON: null,
      trafficLayer: false,
      trafficButton : false,
      isShowSeeDetails: true,
      isShowCancelOrder: false,
      modalPosition: 'initial',
      fadeAnim: new Animated.Value(0),
      isLoading: true,
      currentCoords: latLng,
      updateAnimated: false,
      updateToRender: false,
      updateToRenderMap: false,
      history_polyline: null,
      camera_option: null,
      panned_view: false,
      isThirdPartyNavigational: false,
      startForegroundService: false,
      ApplicationNavigational: null,
      loadingLayer: false,
    };
    this.onPressedTraffic.bind(this);
    this.updateAnimatedToIndex.bind(this);
    this.onLihatRincian.bind(this);
    this.onLihatDetail.bind(this);
    this.onCompleteDelivery.bind(this);
  }
 
  static getDerivedStateFromProps(props,state){
    const {navigation, currentDeliveringAddress, markers, dataPackage} = props;
    const {index, currentCoords, route, updateToRenderMap, region} = state;

    if(index === null && currentDeliveringAddress === null) {
      let params = props.route.params;
      if(params !== undefined && params.index !== undefined) {
        //from list
        let destination = new Location(markers[params.index][0], markers[params.index][1]);

        if (AnimatedMarkers.Beacon instanceof Distance === false) {
          AnimatedMarkers.Beacon = new Distance(destination);
        } else if (
          AnimatedMarkers.Beacon.checkDestination(destination) === false
        ) {
          AnimatedMarkers.Beacon = new Distance(destination);
        }
        props.getDeliveryDirections(route[params.index].coordinate, currentCoords);
        props.reverseGeoCoding(currentCoords);

          //set first camera
        let initialCamera = AnimatedMarkers.Beacon.camera(ASPECT_RATIO,currentCoords);
        region
        .setValue({
          latitudeDelta: initialCamera.latitudeDelta,
          longitudeDelta: initialCamera.longitudeDelta,
          latitude: initialCamera.latitude,
          longitude: initialCamera.longitude,
        })
        return {...state, index: params.index,  loadingLayer: true, region: region};
      } else {
        //from drawer
        let destination = new Location(markers[0][0], markers[0][1]);

        if (AnimatedMarkers.Beacon instanceof Distance === false) {
          AnimatedMarkers.Beacon = new Distance(destination);
        } else if (
          AnimatedMarkers.Beacon.checkDestination(destination) === false
        ) {
          AnimatedMarkers.Beacon = new Distance(destination);
        }
        props.getDeliveryDirections(route[0].coordinate, currentCoords);
        props.reverseGeoCoding(currentCoords);
        return {...state, index: 0,  loadingLayer: true};
      }
    } else if(currentDeliveringAddress !== null && index === null) {
      // when persistance delivery
      let destination = new Location(markers[currentDeliveringAddress][0], markers[currentDeliveringAddress][1]);

      if (AnimatedMarkers.Beacon instanceof Distance === false) {
        AnimatedMarkers.Beacon = new Distance(destination);
      } else if (
        AnimatedMarkers.Beacon.checkDestination(destination) === false
      ) {
        AnimatedMarkers.Beacon = new Distance(destination);
      }
      props.getDeliveryDirections(route[currentDeliveringAddress].coordinate, currentCoords);
      props.reverseGeoCoding(currentCoords);

         //set first camera
         let initialCamera = AnimatedMarkers.Beacon.camera(ASPECT_RATIO,currentCoords);
         region
         .setValue({
           latitudeDelta: initialCamera.latitudeDelta,
           longitudeDelta: initialCamera.longitudeDelta,
           latitude: initialCamera.latitude,
           longitude: initialCamera.longitude,
         });
      return {...state, index:currentDeliveringAddress,  loadingLayer: true, region: region};
    } else if(currentDeliveringAddress === null && index !== null && updateToRenderMap === true){
      // when switch between item cards
      let destination = new Location(markers[index][0], markers[index][1]);

      if (AnimatedMarkers.Beacon instanceof Distance === false) {
        AnimatedMarkers.Beacon = new Distance(destination);
      } else if (
        AnimatedMarkers.Beacon.checkDestination(destination) === false
      ) {
        AnimatedMarkers.Beacon = new Distance(destination);
      }
      props.getDeliveryDirections(route[index].coordinate, currentCoords);
      props.reverseGeoCoding(currentCoords);
      return {...state,updateToRenderMap: false, route: route, loadingLayer: true}
    }
   
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState){
   
    if( nextState.index !== this.props.index && (
      nextState.isShowSeeDetails === this.state.isShowSeeDetails &&   
      nextState.isShowCancelOrder === this.state.isShowCancelOrder && 
      nextState.toggleContainer === this.state.toggleContainer && 
      nextState.trafficButton === this.state.trafficButton && 
      nextState.trafficLayer === this.state.trafficLayer && 
      nextProps.keyStack === this.props.keyStack && 
      nextState.modalPosition === this.state.modalPosition && 
      nextProps.isActionQueue === this.props.isActionQueue && 
      nextProps.isConnected === this.props.isConnected && 
      nextProps.stat === this.props.stat && 
      nextState.isLoading === this.state.isLoading && 
      nextProps.route.params?.index  === this.props.route.params?.index && 
      nextState.updateAnimated === this.state.updateAnimated && 
      nextState.updateToRender === this.state.updateToRender && 
      nextProps.startDelivered === this.props.startDelivered &&     
      nextState.currentCoords === this.state.currentCoords &&
      nextState.camera_option === this.state.camera_option &&
      nextState.panned_view === this.state.panned_view &&  
      nextProps.destinationid === this.props.destinationid &&
      nextState.updateToRenderMap === this.state.updateToRenderMap && 
      nextState.isThirdPartyNavigational ===
        this.state.isThirdPartyNavigational &&
      nextState.startForegroundService === this.state.startForegroundService &&
      nextState.ApplicationNavigational === this.state.ApplicationNavigational &&
      nextState.loadingLayer === this.state.loadingLayer
   ) ){
      return false;
    }

    return true;
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
    
    if (
      this.props.destinationid !==
      prevProps.destinationid
    ) {
      if(this.props.destinationid === null ){
        this.setState({updateToRenderMap: true});
      } else {
        this.getDeliveryDirection();
      }
    } else {
      if (
        this.state.GeoJSON === null &&
        this.props.currentDeliveringAddress === null &&
        this.props.destinationid !== null
      ) {
        this.getDeliveryDirection();
      } else if (
        this.state.GeoJSON === null &&
        this.props.currentDeliveringAddress !== null &&
        this.props.startDelivered !== true
      ) {
        // persistance
        if (
          this.props.destinationid !== null &&
          this.props.currentDeliveringAddress !== this.state.index
        ) {
          this.props.setStartDelivered(true);
          this.updateAnimatedToIndex(this.props.currentDeliveringAddress);
          this.setState({index: this.props.currentDeliveringAddress});
        } else if (
          this.props.destinationid !== null &&
          this.props.currentDeliveringAddress === this.state.index
        ) {
          this.props.setStartDelivered(true);
        }
        this.getDeliveryDirection();
      }
    }
    
    if(this.props.route.params?.index !== undefined && prevProps.route.params?.index !== this.props.route.params?.index) {
      this.updateAnimatedToIndex(this.props.route.params?.index ?? 0);
      this.setState({index: this.props.route.params?.index ?? 0})
    }
    if(prevState.updateAnimated !== this.state.updateAnimated && this.state.updateAnimated === true){
      this.setState({updateAnimated:false});
    }
    if(prevState.updateToRender !== this.state.updateToRender && this.state.updateToRender === true){
      this.setState({updateToRender:false});
    }
    if(prevState.isLoading !== this.state.isLoading){
      if(this.props.isConnected){
        this.setState({isLoading:false});
      } else {
        this.setState({isLoading:true});
      }
    }
    if(prevProps.isTraffic !== this.props.isTraffic){
      if(!this.props.isTraffic){
        this.setState({trafficLayer: false});
      }
    } else {
      if(prevState.trafficButton !== this.state.trafficButton){
        if(this.props.isTraffic && typeof this.props.statAPI[this.state.index] === 'object'){
          let componentProps = this.props.statAPI[this.state.index];
          let secDiffinTraffic = componentProps.duration_in_trafficAPI - componentProps.durationAPI;
          if(secDiffinTraffic > 0 && this.state.trafficButton){
              this.setState({trafficLayer: true});
            }else {
              this.setState({trafficLayer: false});
            }
        }
      }
    }
  }
  componentDidMount() {
    const {region, panX, panY, scrollX, route,index} = this.state;
    if(this.props.route.params?.index !== undefined && index !== this.props.route.params?.index) {
      this.updateAnimatedToIndex(this.props.route.params?.index ?? 0);
      this.setState({index: this.props.route.params?.index ?? 0})
    }
    panX.addListener(this.onPanXChange);
    panY.addListener(this.onPanYChange);
    region.stopAnimation();
    region
      .timing({
        latitude: scrollX.interpolate({
          inputRange: route.map((m, i) => i * SNAP_WIDTH),
          outputRange: route.map((m) => m.coordinate.latitude),
        }),
        longitude: scrollX.interpolate({
          inputRange: route.map((m, i) => i * SNAP_WIDTH),
          outputRange: route.map((m) => m.coordinate.longitude),
        }),
        duration: 0,
      })
      .start();
      if (this.props.destinationid === null) {
        this.setState({updateToRenderMap: true});
      }
 

      AppState.addEventListener('change', (state) =>
      AnimatedMarkers._handlebackgroundgeolocation(
        state,
        this.props.currentPositionData,
        this.props.deliveryDestinationData,
        this.props.startDelivered,
        this.state.isThirdPartyNavigational,
        this.state.startForegroundService,
      ),
    );

    this.locatorID = Geolocation.watchPosition(
      ({coords}) => {
        const {
          currentPositionData,
          deliveryDestinationData,
          startDelivered,
        } = this.props;
        const {camera_option, panned_view} = this.state;
        let latLng = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        let {markers} = this.props;
        let destination = new Location(markers[index][0], markers[index][1]);

        if (AnimatedMarkers.Beacon instanceof Distance === false) {
          AnimatedMarkers.Beacon = new Distance(destination);
        } else if (
          AnimatedMarkers.Beacon.checkDestination(destination) === false
        ) {
          AnimatedMarkers.Beacon = new Distance(destination);
        }
        if (
          startDelivered &&
          currentPositionData !== null &&
          deliveryDestinationData !== null
        ) {
          AnimatedMarkers.Beacon.locator(latLng);
          let camera =
            this.props.deliveryDestinationData.steps.length > 0
              ? AnimatedMarkers.Beacon.camera(
                  ASPECT_RATIO,
                  latLng,
                  this.props.deliveryDestinationData.steps,
                  camera_option,
                )
              : AnimatedMarkers.Beacon.camera(ASPECT_RATIO, latLng);
          if (panned_view === false) {
            region
              .spring({
                latitudeDelta: camera.latitudeDelta,
                longitudeDelta: camera.longitudeDelta,
                latitude: camera.latitude,
                longitude: camera.longitude,
                useNativeDriver: false,
              })
              .start();
          }
          this.setState({
            history_polyline: AnimatedMarkers.Beacon.view_history(),
          });
        } else {
          if (deliveryDestinationData !== null) {
            let camera =
              this.props.deliveryDestinationData.steps.length > 0
                ? AnimatedMarkers.Beacon.camera(
                    ASPECT_RATIO,
                    latLng,
                    this.props.deliveryDestinationData.steps,
                    camera_option === null ? 'bottom-pad' : camera_option ,
                  )
                : AnimatedMarkers.Beacon.camera(ASPECT_RATIO, latLng,null,'bottom-pad');
            if (panned_view === false) {
              region
                .spring({
                  latitudeDelta: camera.latitudeDelta,
                  longitudeDelta: camera.longitudeDelta,
                  latitude: camera.latitude,
                  longitude: camera.longitude,
                  useNativeDriver: false,
                })
                .start();
            }
          }
          //lloop
          // if(deliveryDestinationData.destinationid !== null && AnimatedMarkers.Beacon.checkDestinationID(this.props.deliveryDestinationData.destinationid, latLng) === false){
          //   this.setState({
          //     updateToRender: true,
          //  });
          // }
        }

        this.setState({
          currentCoords: latLng,
        });
      },
      () => {
        // error
      },
      {
        timeout: 300,
        maximumAge: 50,
        enableHighAccuracy: true,
        useSignificantChanges: false,
        distanceFilter: 0,
      },
    );
  }
  componentWillUnmount() {
    Geolocation.clearWatch(this.locatorID);
    this.props.setStartDelivered(false);
  }
  static _handlebackgroundgeolocation = async (
    nextAppState,
    currentPositionData,
    deliveryDestinationData,
    startDelivered,
    isThirdPartyNavigational,
    startForegroundService,
  ) => {
    if (nextAppState === 'active' && startForegroundService) {
      await RNFusedLocation.stopObserving();
      await RNFusedLocation.startObserving({
        timeout: 300,
        maximumAge: 50,
        enableHighAccuracy: true,
        useSignificantChanges: false,
        distanceFilter: 0,
      });
      if (Platform.OS === 'android') {
        await ReactNativeForegroundService.stopService();
        await ReactNativeForegroundService.stopServiceAll();
        await ReactNativeForegroundService.stop();
      } else {
        PushNotificationIOS.cancelLocalNotifications();
        PushNotificationIOS.removeAllDeliveredNotifications();
      }
      BackgroundGeolocation.removeAllListeners();
      BackgroundGeolocation.stop();
    } else if (
      nextAppState !== 'active' &&
      startDelivered &&
      currentPositionData !== null &&
      deliveryDestinationData !== null &&
      startForegroundService
    ) {
      //disable application location
      await RNFusedLocation.stopObserving();
      BackgroundGeolocation.configure({
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 0,
        distanceFilter: 0,
        startForeground: true,
        notificationTitle: 'Background tracking',
        notificationText: 'enabled',
        debug: false,
        startOnBoot: false,
        stopOnTerminate: true,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 1000,
        fastestInterval: 100,
        activitiesInterval: 100,
        stopOnStillActivity: false,
      });

      BackgroundGeolocation.on('location', async (location) => {
        // handle your locations here
        // to perform long running operation
        // you need to create background task
        BackgroundGeolocation.startTask((taskKey) => {
          // execute long running task
          // IMPORTANT: task has to be ended by endTask
          const L = require('./interface/shim-leaflet');
          let latLng = {
            latitude: location.latitude,
            longitude: location.longitude,
          };
          AnimatedMarkers.Beacon.locator(latLng);
          if (
            L.latLng(
              deliveryDestinationData.steps[
                deliveryDestinationData.steps.length - 1
              ][0],
              deliveryDestinationData.steps[
                deliveryDestinationData.steps.length - 1
              ][1],
            ).distanceTo(L.latLng(location.latitude, location.longitude)) < 1000
          ) {
            if (Platform.OS === 'android') {
              ReactNativeForegroundService.update({
                id: 144,
                title: 'CCM Transport Service',
                message: 'your are arrived !',
                mainOnPress: async () => {
                  await ReactNativeForegroundService.stopService();
                  await ReactNativeForegroundService.stopServiceAll();
                  await ReactNativeForegroundService.stop();
                },
              });
            } else {
              PushNotificationIOS.addNotificationRequest({
                id: new Date().toString(),
                body: 'your are arrived !',
                title: 'CCM Transport Service',
                silent: false,
                category: 'DELIVERY_NOTIFICATION',
                userInfo: {},
              });
            }
          } else {
            if (Platform.OS === 'android') {
              ReactNativeForegroundService.update({
                id: 144,
                title: 'CCM Transport Service',
                message:
                  'your are calculated to distant about ' +
                  L.latLng(
                    deliveryDestinationData.steps[
                      deliveryDestinationData.steps.length - 1
                    ][0],
                    deliveryDestinationData.steps[
                      deliveryDestinationData.steps.length - 1
                    ][1],
                  ).distanceTo(
                    L.latLng(location.latitude, location.longitude),
                  ) +
                  'meters',
                mainOnPress: async () => {
                  await ReactNativeForegroundService.stopService();
                  await ReactNativeForegroundService.stopServiceAll();
                  await ReactNativeForegroundService.stop();
                },
              });
            } else {
              PushNotificationIOS.cancelLocalNotifications();
              PushNotificationIOS.removeAllDeliveredNotifications();
              PushNotificationIOS.addNotificationRequest({
                id: new Date().toString(),
                body:
                  'your are calculated to distant about ' +
                  L.latLng(
                    deliveryDestinationData.steps[
                      deliveryDestinationData.steps.length - 1
                    ][0],
                    deliveryDestinationData.steps[
                      deliveryDestinationData.steps.length - 1
                    ][1],
                  ).distanceTo(
                    L.latLng(location.latitude, location.longitude),
                  ) +
                  'meters',
                title: 'CCM Transport Service',
                silent: true,
                category: 'DELIVERY_NOTIFICATION',
                userInfo: {},
              });
            }
          }
          BackgroundGeolocation.endTask(taskKey);
        });
      });

      BackgroundGeolocation.on('foreground', async () => {
        if (Platform.OS === 'android') {
          ReactNativeForegroundService.update({
            id: 144,
            title: 'CCM Transport Service',
            message: 'your are already in App',
            mainOnPress: async () => {
              await ReactNativeForegroundService.stopService();
              await ReactNativeForegroundService.stopServiceAll();
              await ReactNativeForegroundService.stop();
            },
          });
        } else {
          PushNotificationIOS.cancelLocalNotifications();
          PushNotificationIOS.removeAllDeliveredNotifications();
        }
        BackgroundGeolocation.removeAllListeners();
        BackgroundGeolocation.stop();
      });

      BackgroundGeolocation.checkStatus((status) => {
        // you don't need to check status before start (this is just the example)
        if (!status.isRunning) {
          if (Platform.OS === 'android') {
            ReactNativeForegroundService.start({
              id: 144,
              title: 'CCM Transport Service',
              message: 'you are using navigational maps to destination!',
              mainOnPress: async () => {
                await ReactNativeForegroundService.stopService();
                await ReactNativeForegroundService.stopServiceAll();
                await ReactNativeForegroundService.stop();
              },
            });
          } else {
            PushNotificationIOS.addNotificationRequest({
              id: new Date().toString(),
              body: 'you are using navigational maps to destination!',
              title: 'CCM Transport Service',
              silent: false,
              category: 'DELIVERY_NOTIFICATION',
              userInfo: {},
            });
          }
          BackgroundGeolocation.start(); //triggers start on start event
        }
      });
    }
  };

  getDeliveryDirection = async () => {
    const {
      steps,
      markers,
      currentPositionData,
      deliveryDestinationData,
      currentDeliveringAddress,
      startDelivered,
    } = this.props;
    const {index, ApplicationNavigational} = this.state;
    let LatLngs = [];
    let marker = [];
    let latLng;
    if(startDelivered || currentDeliveringAddress !== null){
    // push next location marker
    latLng = new Location(markers[currentDeliveringAddress][0], markers[currentDeliveringAddress][1]);
    } else {
    // push next location marker
    latLng = new Location(markers[index][0], markers[index][1]);
    }
    marker.push(latLng.location());

    // push current location marker
    latLng = new Location(
      currentPositionData.coords.lat,
      currentPositionData.coords.lng,
    );
    marker.push(latLng.location());

    // push polyline steps
    LatLngs = Array.from({length: deliveryDestinationData.steps.length}).map(
      (num, index) => {
        let latLng = new Location(
          deliveryDestinationData.steps[index][0],
          deliveryDestinationData.steps[index][1],
        );
        return latLng.location();
      },
    );

    const Polygon = new Util();
    let LayerGroup = Polygon.setLayersGroup(LatLngs, marker);
    const GeoJSON = LayerGroup.toGeoJSON();

    if (ApplicationNavigational !== null) {
      showLocation({
        latitude:
          deliveryDestinationData.steps[
            deliveryDestinationData.steps.length - 1
          ][0],
        longitude:
          deliveryDestinationData.steps[
            deliveryDestinationData.steps.length - 1
          ][1],
        sourceLatitude: -8.0870631, // optionally specify starting location for directions
        sourceLongitude: -34.8941619, // not optional if sourceLatitude is specified
        title: 'The White House', // optional
        googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
        googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58', // optionally specify the google-place-id
        alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
        dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
        dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
        cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
        appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
        naverCallerName: 'com.example.myapp', // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
        app: ApplicationNavigational, // optionally specify specific app to use
      });
      this.setState({startForegroundService: true, GeoJSON: GeoJSON, loadingLayer: false});
    } else {
      this.setState({
        GeoJSON: GeoJSON,
        loadingLayer: false,
      });
    }
    
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
    this.setState({...this.state, isThirdPartyNavigational: true, toggleContainer: toggle});
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
    const {route, panX, panY, scrollY, animations, isShowSeeDetails, index} = this.state;
        if(indexTo !== undefined && indexTo !== index){
          const {markers} = this.props;
          if (indexTo > -1) {
            let destination = new Location(
              markers[indexTo][0],
              markers[indexTo][1],
            );
      
            if (AnimatedMarkers.Beacon instanceof Distance === false) {
              AnimatedMarkers.Beacon = new Distance(destination);
            } else if (
              AnimatedMarkers.Beacon.checkDestination(destination) === false
            ) {
              AnimatedMarkers.Beacon = new Distance(destination);
            }
            this.updateAnimatedToIndex(indexTo);
        }
        if(!isShowSeeDetails){
          this.setState({
            ...this.state,
            isShowSeeDetails: bool,
            index: indexTo,
            updateToRender:true,
            updateToRenderMap: true,
            //canMoveHorizontal: bool ? false : true
          });
        } else {
          this.setState({
            ...this.state,
            index: indexTo,
            updateToRender:true,
            updateToRenderMap: true,
            //canMoveHorizontal: bool ? false : true
          });
        }
      } else {
  
        bool
        ? this.setState({
            isShowSeeDetails: bool,
            updateToRender: true,
          })
        : this.setState({
            ...this.state,
            isShowSeeDetails: bool,
            updateToRender: true,
          });
      
      }
  }
  onPressedTraffic = (value) => {
    const {trafficButton,trafficLayer} = this.state;
    if(!trafficButton === false)
    this.setState({trafficLayer: false});
    this.setState({trafficButton: value});
  };
  onStartShouldSetPanResponder = e => {
    // we only want to move the view if they are starting the gesture on top
    // of the view, so this calculates that and returns true if so. If we return
    // false, the gesture should get passed to the map view appropriately.
    const { panY, toggleContainer, canMoveHorizontal } = this.state;
    const { pageY } = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = screen.height - pageY;
    if(toggleContainer) 
       return false;

    return true;
  };

  onMoveShouldSetPanResponder = e => {
    const { panY, toggleContainer, canMoveHorizontal } = this.state;
    const { pageY } = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = screen.height - pageY;
    if(toggleContainer)
        return false;
        
    return true;
  };
  updateAnimatedToIndex = (index) => {
    const {route, panX, panY, scrollY, animations} = this.state;
    const {xPos} = animations[index];
    panX.setValue(xPos);
    this.setState({
      updateAnimated: true,
      animations: {
        ...route.map((m, i) => getMarkerState(panX, panY, scrollY, i)),
      },
    });
  };
  onPanXChange = ({value}) => {
    const {index, route, animations} = this.state;
    const {coordinate} = route[index];
    const newIndex = Math.floor((-1 * value + SNAP_WIDTH / 2) / SNAP_WIDTH);
    if (index !== newIndex && newIndex < route.length && newIndex >= 0) {
    
    } else {
      if (newIndex > route.length || newIndex < 0) {
        let {translateX, isNotIndex, center, xPos} = animations[index];
        Animated.timing(translateX, {
          toValue: xPos,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }
  };
  toggleCamera = () => {
    const {camera_option, panned_view} = this.state;
    if (panned_view === true) {
      this.setState({
        panned_view: false,
      });
    } else {
      this.setState({
        camera_option: camera_option === null ? 'boxer' : null,
      });
    }
    //trigger native module to reset init
    RNFusedLocation.stopObserving();
    RNFusedLocation.startObserving({
      timeout: 300,
      maximumAge: 50,
      enableHighAccuracy: true,
      useSignificantChanges: false,
      distanceFilter: 0,
    });
  };
  onPanYChange = ({value}) => {
    const {
      canMoveHorizontal,
      canMoveVertical,
      scrollY,
      scrollX,
      route,
      index,
      animations,
      bottomInfo,
      region,
    } = this.state;
    const shouldBeMovable = value > 2;
    
  };

  onRegionChange = (region) => {
 
  };
  renderInner = () => {
    const {route, index} = this.state;
    let marker = route[index];
    let {distance,to,current,hour,eta} = this.props.stat[index];
    const {named,packages, Address, list} = this.props.dataPackage[index];
    return (
      <View style={styles.sheetContainer}>
          <SafeAreaView edges={['bottom']} style={{backgroundColor: '#fff'}}>
        <View style={styles.sectionSheetDetail}>
          <View style={styles.detailContent}>
            <Text style={styles.orderTitle}>{named}</Text>
            <Text style={styles.chrono}>Distant Location {distance} Km</Text>
            <Text style={styles.eta}>ETA : {eta}</Text>
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
        <View style={styles.sectionSheetCordinate}>
          <Input
            containerStyle={styles.spatialSheetContainer}
            inputContainerStyle={styles.spatialInput}
            inputStyle={styles.spatialInputText}
            value={'' + current}
            leftIcon={() => {
              return (
                <View style={styles.leftLabel}>
                  <IconEllipse height="13" width="13" fill="#F1811C" />
                  <Text style={styles.leftLabelText}>Current</Text>
                </View>
              );
            }}
          />
          <Input
            containerStyle={styles.spatialSheetContainer}
            inputContainerStyle={styles.spatialInput}
            inputStyle={styles.spatialInputText}
            value={'' + to}
            leftIcon={() => {
              return (
                <View style={styles.leftLabel}>
                  <IconEllipse height="13" width="13" fill="#F1811C" />
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
                  title="Chat Client"
                  titleStyle={{color: '#fff', ...Mixins.subtitle3, lineHeight: 21}}
                                  onPress={()=>{
                  this.props.setBottomBar(false);
                  this.props.navigation.navigate('Notification', { screen: 'Single' })}}
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
      this.props.navigation.navigate('Home', {
        screen: 'List',
      });
    } else {
      this.onLihatRincian({toggle: true, bottomBar: false});
    }
    this.setState({
      isShowCancelOrder: false,
    });
  };
  render() {
    const {
      panX,
      panY,
      animations,
      canMoveHorizontal,
      canMoveVertical,
      route,
      bottomInfo,
      triggerBottom,
      region,
      carousel,
      bottomPan,
      toggleContainer,
      GeoJSON,
      index,
      trafficLayer,
      trafficButton,
      loadingLayer,
    } = this.state;
    const {
      startDelivered,
      currentPositionData,
      deliveryDestinationData,
    } = this.props;
    if(this.props.keyStack === 'Map'){
      if(toggleContainer){
        this.props.setBottomBar(false);
        } else {
        this.props.setBottomBar(true);
        }
    }
    if((!this.props.isConnected && this.props.isActionQueue.length > 0) || (this.props.isConnected && this.props.stat.length === 0) ){
      return (
        <View style={styles.container}>
          <OfflineMode/>
         <Loading />
        </View>
      );
    }
    const {current,eta,to,distance,hour} = this.props.stat[index];
    const {named,packages, Address} = this.props.dataPackage[index];
    return (
      <View style={StyleSheet.absoluteFillObject}>
      <OfflineMode/>
        {this.state.isLoading && <Loading />}
        <AnimatedMap
          showsTraffic={trafficButton}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChange={(regionToAnimate, {isGesture}) => {
            if (isGesture || this.state.panned_view) {
              region.setValue(regionToAnimate);
            }
          }}
          onRegionChangeComplete={(regionToAnimate, {isGesture}) => {
            if (isGesture) {
              region.stopAnimation();
              this.setState({panned_view: true});
            }
            if (!this.props.startDelivered) {
              region.stopAnimation();
            }
          }}
          onMapReady={() => this.setState({isLoading: false})}
          scrollEnabled={Platform.OS === 'ios' ? true : true}>
          {GeoJSON !== null && (
            <Geojson
              geojson={GeoJSON}
              strokeWidth={3}
              strokeColor={'#2A3386'}
              maptype="delivery"
            />
          )}

          {this.state.history_polyline !== null && (
            <Geojsonhistory
              geojson={this.state.history_polyline}
              strokeWidth={6}
              strokeColor={'#F1811C'}
            />
          )}
        </AnimatedMap>

        {startDelivered &&
          currentPositionData !== null &&
          deliveryDestinationData !== null &&
          this.state.isThirdPartyNavigational &&
          this.state.ApplicationNavigational === null && (
            <Popup
              isVisible={this.state.isThirdPartyNavigational}
              onCancelPressed={() =>
                this.setState({isThirdPartyNavigational: false})
              }
              onAppPressed={({app}) =>
                this.setState({
                  isThirdPartyNavigational: false,
                  startForegroundService: true,
                  ApplicationNavigational: app,
                })
              }
              onBackButtonPressed={() =>
                this.setState({isThirdPartyNavigational: false})
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
                latitude:
                  route[
                    this.props.currentDeliveringAddress !== null
                      ? this.props.currentDeliveringAddress
                      : index
                  ].coordinate.latitude,
                longitude:
                  route[
                    this.props.currentDeliveringAddress !== null
                      ? this.props.currentDeliveringAddress
                      : index
                  ].coordinate.longitude,
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
        <View
          style={{
            alignSelf: 'flex-end',
            marginHorizontal: 15,
            marginVertical: 10,
            flexDirection: 'column'
          }}>
          <Avatar
            size={40}
            ImageComponent={() => {
              return this.state.camera_option ? (
                <IconDelivery6
                  height="20"
                  width="20"
                  fill={this.state.panned_view ? '#000' : '#fff'}
                />
              ) : (
                <IconDelivery13
                  height="20"
                  width="20"
                  fill={this.state.panned_view ? '#000' : '#fff'}
                />
              );
            }}
            imageProps={{
              containerStyle: {
                ...Mixins.buttonAvatarDefaultIconStyle,
                paddingTop: 11,
              },
            }}
            overlayContainerStyle={{
              ...Mixins.buttonAvatarDefaultOverlayStyle,
              backgroundColor: this.state.panned_view
                ? '#ffffff'
                : this.state.camera_option
                ? '#121C78'
                : '#cccccc',
              borderRadius: 50,
            }}
            onPress={this.toggleCamera}
            activeOpacity={0.7}
            containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
          />
          {this.state.loadingLayer && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
       
     
          {toggleContainer &&
          !this.state.isShowCancelOrder &&
          startDelivered &&
          currentPositionData !== null &&
          deliveryDestinationData !== null
           && (
              <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                minHeight: 130,
              }}>
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
                  let snapArray = [550, 300, 130];

               
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
          !this.state.isShowCancelOrder && (
              <Animated.View style={[styles.itemContainer]}>
                {this.state.isShowSeeDetails && Object.keys(animations).length > 0 && (
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
                      </TouchableOpacity><View style={styles.sectionDetail}>
                          <View style={styles.detailContent}>
                            <Text style={styles.orderTitle}>{named}</Text>
                            <Text style={styles.chrono}>
                              Distant Location {distance} Km
                            </Text>
                            <Text style={styles.eta}>ETA: {eta}</Text>
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
                        </View><View style={styles.sectionCordinate}>
                          <Input
                            containerStyle={styles.spatialContainer}
                            inputContainerStyle={styles.spatialInput}
                            inputStyle={styles.spatialInputText}
                            value={'' + current}
                            leftIcon={() => {
                              return (
                                <View style={styles.leftLabel}>
                                  <IconEllipse
                                    height="13"
                                    width="13"
                                    fill="#F1811C" />
                                  <Text style={styles.leftLabelText}>
                                    Current
                                  </Text>
                                </View>
                              );
                            } } />
                          <Input
                            containerStyle={styles.spatialContainer}
                            inputContainerStyle={styles.spatialInput}
                            inputStyle={styles.spatialInputText}
                            value={'' + to}
                            leftIcon={() => {
                              return (
                                <View style={styles.leftLabel}>
                                  <IconEllipse
                                    height="13"
                                    width="13"
                                    fill="#F1811C" />
                                  <Text style={styles.leftLabelText}>To</Text>
                                </View>
                              );
                            } } />
                        </View>
                        <View style={styles.sectionButton}>
                          <Button
                            buttonStyle={styles.navigationButton}
                            titleStyle={styles.deliveryText}
                            title="Start delivery"
                            onPress={() => this.onLihatRincian({ toggle: true, bottomBar: false })} />
                        </View>
                    </Animated.View>
                    </View>
               )}
                 <PanController
          style={{
            flexDirection: 'column',
            flexShrink: 1,
            zIndex: 1,
            elevation: 1,
          }}
          vertical={false}
          horizontal={canMoveHorizontal}
          xMode="snap"
          snapSpacingX={ITEM_WIDTH}
          yBounds={[-1 * screen.height, 0]}
          xBounds={[-screen.width * (route.length - 1), 0]}
          panY={panY}
          panX={panX}
          onStartShouldSetPanResponder={this.onStartShouldSetPanResponder}
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
                    {route.map((marker, i) => {
                      const {selecter} = animations[i];
                      return (
                        <Animated.View
                          key={marker.id}
                          style={styles.indicatorIcon}>
                          <Animated.Text
                            style={[styles.indicatorText, {color: selecter}]}>
                            ▂
                          </Animated.Text>
                        </Animated.View>
                      );
                    })}
                  </View>
                  <View style={styles.buttonAll}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.buttonText}>
                      Traffic
                      </Text>
                    
                    <Switch onValueChange={(value) => this.onPressedTraffic(value)}
                      value={trafficButton}/>
                    </View>
                </View>
                </View>
                <View style={styles.itemWrapper}>
                  {route.map((marker, i) => {
                    const {
                      translateX,
                    } = animations[i];
                    const {current,eta,to,distance,hour} = this.props.stat[i];
                    const {named,packages, Address} = this.props.dataPackage[i];
                    return (
                      <Animated.View
                        key={marker.id}
                        style={[
                          styles.item,
                          {
                            transform: [{translateX: translateX}],
                          },
                        ]}>
                        <View style={styles.sectionContentTitle}>
                          <Text style={styles.orderTitleItem}>{named}</Text>
                          <Text style={styles.chrono}>Distant Location {distance} Km</Text>
                        </View>
                        <View style={styles.sectionContent}>
                          <View style={styles.contentList}>
                            <Text style={styles.listLabel}>To</Text>
                            <Text style={styles.listContent}>{Address}</Text>
                          </View>
                          <View style={styles.contentList}>
                            <Text style={styles.listLabel}>Package</Text>
                            <Text style={styles.listContent}>{packages}</Text>
                          </View>
                        </View>
                        <View style={styles.sectionContentButton}>
                          <Button
                            buttonStyle={styles.contentButton}
                            onPress={() => this.onSeeDetails(true,i)}
                            titleStyle={styles.contentButtonText}
                            title="See details"
                          />
                        </View>
                      </Animated.View>
                    );
                  })}
                </View>
                </PanController>
              </Animated.View>
            )}
        {this.state.isShowCancelOrder &&
          <View style={styles.overlayContainer}>
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
          </View>
        }
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
  itemWrapper : {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingBottom: 15,
    paddingTop: 20,
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
    borderRadius: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    height: 220,
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
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  sectionSheetDetail: {
    flexShrink: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 19,
  },
  buttonDetail: {
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 5,
    backgroundColor: '#F1811C',
    alignItems: 'center',
    height: 35,
    marginTop: 23,
  },
  detailTitle: {
...Mixins.small3,
lineHeight: 12,
    fontWeight: '600',
    color: 'white',
  },
  sectionCordinate: {
    marginHorizontal: 10,
    marginTop: 23,
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-end',
  },
  sectionSheetCordinate: {
    marginHorizontal: 10,
    marginTop: 23,
    flexShrink: 1,
    flexDirection: 'column',
    alignContent: 'flex-end',
  },
  spatialContainer: {
    flexShrink: 1,
    marginBottom: 16,
  },
  spatialSheetContainer: {
    flexShrink: 1,
  },
  spatialInput: {
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    paddingHorizontal: 15,
    height: 25,
    borderBottomWidth: 0,
  },
  spatialInputText: {
...Mixins.small3,
lineHeight: 12,
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
    deliveryDestinationData: state.originReducer.deliveryDestinationData,
    destinationid : state.originReducer.deliveryDestinationData.destinationid,
    route_id: state.originReducer.route.id,
    currentDeliveringAddress: state.originReducer.currentDeliveringAddress,
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
    ...bindActionCreators({getDeliveryDirections, reverseGeoCoding}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnimatedMarkers);

