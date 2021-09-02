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
import Geolocation from 'react-native-geolocation-service';
import IconDelivery13 from '../../assets/icon/iconmonstr-delivery-13.svg';
import IconDelivery6 from '../../assets/icon/iconmonstr-delivery-6mobile.svg';
import {connect} from 'react-redux';
import Util from './interface/leafletPolygon';
import Location from './interface/geoCoordinate'
import Distance from './interface/spatialIterative';
import Geojsonhistory from './section/GeoJSONHistory';
import Geojson from './section/GeoJSON';
import Mixins from '../../mixins';
import {default as Reanimated} from 'react-native-reanimated';
import BackgroundGeolocation from '@darron1217/react-native-background-geolocation';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {showLocation} from './link';
const {RNFusedLocation} = NativeModules;
const ForegroundServiceModule = NativeModules.ForegroundService;
const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;



class NavigationalMap extends React.Component {
  _appState = React.createRef();
  locatorID = null;
  static Beacon = null;
 
  constructor(props) {
    super(props);
    if (!this._appState.current) {
      this._appState.current = AppState.currentState;
    }
    const {index, markers, data} = this.props;
    const LATITUDE = 1.3287109;
    const LONGITUDE = 103.8476682;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const currentCoords = {
      latitude: this.props.currentPositionData.coords.lat,
      longitude: this.props.currentPositionData.coords.lng,
    };
    // route coords are from backend, markers are from google
    const route = Array.from({length: data.length}).map((num, index) => {
      return {
        id: index,
        ammount: index * 10,
        coordinate: {latitude: data[index].coords.lat, longitude: data[index].coords.lng},
      };
    });
    
    this.state = {
      route,
      region: new AnimatedRegion({
        latitude: markers[index][0],
        longitude:  markers[index][1],
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      GeoJSON: null,
      trafficLayer: false,
      currentCoords: currentCoords,
      updateToRenderMap: false,
      history_polyline: null,
      camera_option: null,
      panned_view: false,
      foregroundService: false,
      ApplicationNavigational: null,
      loadingLayer: true,
    };
    this.toggleCamera.bind(this)
  }
 
  static getDerivedStateFromProps(props,state){
    const {navigation, index, markers, data, trafficLayer,ApplicationNavigational, foregroundService} = props;
    const {currentCoords, route, updateToRenderMap, region} = state;
    const destination = new Location(markers[index][0], markers[index][1]);
    if (NavigationalMap.Beacon instanceof Distance === false) {
      NavigationalMap.Beacon = new Distance(destination);
      props.getDeliveryDirections(route[index].coordinate, currentCoords);
      props.reverseGeoCoding(currentCoords);
      let initialCamera = NavigationalMap.Beacon.camera(ASPECT_RATIO,currentCoords);
      region
      .setValue({
        latitudeDelta: initialCamera.latitudeDelta,
        longitudeDelta: initialCamera.longitudeDelta,
        latitude: initialCamera.latitude,
        longitude: initialCamera.longitude,
      });
      return {...state, loadingLayer: true,region: region, trafficLayer: trafficLayer,ApplicationNavigational: ApplicationNavigational, foregroundService: foregroundService, updateToRenderMap: false};
    } else if (
      NavigationalMap.Beacon.checkDestination(destination) === false || updateToRenderMap === true
    ) {
      NavigationalMap.Beacon = new Distance(destination);
      props.getDeliveryDirections(route[index].coordinate, currentCoords);
      props.reverseGeoCoding(currentCoords);
      let initialCamera = NavigationalMap.Beacon.camera(ASPECT_RATIO,currentCoords);
      region
      .setValue({
        latitudeDelta: initialCamera.latitudeDelta,
        longitudeDelta: initialCamera.longitudeDelta,
        latitude: initialCamera.latitude,
        longitude: initialCamera.longitude,
      })
      return {...state, loadingLayer: true,region: region, trafficLayer: trafficLayer,ApplicationNavigational: ApplicationNavigational, foregroundService: foregroundService, updateToRenderMap: false};
    }

    return {...state, region: region, trafficLayer: trafficLayer,ApplicationNavigational: ApplicationNavigational, foregroundService: foregroundService, updateToRenderMap: false};
  }
  shouldComponentUpdate(nextProps, nextState){
   
    return true;
  }
  componentDidUpdate(prevProps, prevState, snapshot)
  {
    
    if (
      this.props.destinationid !==
      prevProps.destinationid
    ) {
        if(this.props.destinationid === null ){
          this.setState({updateToRenderMap:true})
        } else {
          this.getDeliveryDirection();
        }
    } 
     
  }
  componentDidMount() {
 
      if (this.props.destinationid !== null) {
        this.getDeliveryDirection();
      }
      
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setNotificationCategories([
          {
            id: 'DELIVERY_NOTIFICATION',
            actions: [
              {id: 'open', title: 'Open', options: {foreground: true}},
              {
                id: 'ignore',
                title: 'Desruptive',
                options: {foreground: true, destructive: true},
              },
              {
                id: 'text',
                title: 'Text Input',
                options: {foreground: true},
                textInput: {buttonTitle: 'Send'},
              },
            ],
          },
        ]);
      }

      AppState.addEventListener('change', (state) =>
      NavigationalMap._handlebackgroundgeolocation(
        state,
        this.props.currentPositionData,
        this.props.deliveryDestinationData,
        this.props.startDelivered,
        this.state.foregroundService,
      ),
    );

    this.locatorID = Geolocation.watchPosition(
      ({coords}) => {
        const {
          currentPositionData,
          deliveryDestinationData,
          startDelivered,
        } = this.props;
        const {camera_option, panned_view, region} = this.state;
        let latLng = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        const {markers, index} = this.props;
        let destination = new Location(markers[index][0], markers[index][1]);

        if (NavigationalMap.Beacon instanceof Distance === false) {
          NavigationalMap.Beacon = new Distance(destination);
        } else if (
          NavigationalMap.Beacon.checkDestination(destination) === false
        ) {
          NavigationalMap.Beacon = new Distance(destination);
        }
        if (
          startDelivered &&
          currentPositionData !== null &&
          deliveryDestinationData !== null
        ) {
          NavigationalMap.Beacon.locator(latLng);
          let camera =
            this.props.deliveryDestinationData.steps.length > 0
              ? NavigationalMap.Beacon.camera(
                  ASPECT_RATIO,
                  latLng,
                  this.props.deliveryDestinationData.steps,
                  camera_option,
                )
              : NavigationalMap.Beacon.camera(ASPECT_RATIO, latLng);
          if (panned_view === false) {
            region.setValue({
              latitudeDelta: camera.latitudeDelta,
              longitudeDelta: camera.longitudeDelta,
              latitude: camera.latitude,
              longitude: camera.longitude,
            });
          }
          this.setState({
            history_polyline: NavigationalMap.Beacon.view_history(),
          });
        } else {
          if (deliveryDestinationData !== null) {
            let camera =
              this.props.deliveryDestinationData.steps.length > 0
                ? NavigationalMap.Beacon.camera(
                    ASPECT_RATIO,
                    latLng,
                    this.props.deliveryDestinationData.steps,
                    camera_option === null ? 'bottom-pad' : camera_option ,
                  )
                : NavigationalMap.Beacon.camera(ASPECT_RATIO, latLng,null,'bottom-pad');
            if (panned_view === false) {
              region.setValue({
                latitudeDelta: camera.latitudeDelta,
                longitudeDelta: camera.longitudeDelta,
                latitude: camera.latitude,
                longitude: camera.longitude,
              });
            }
          }
          //lloop
          // if(deliveryDestinationData.destinationid !== null && NavigationalMap.Beacon.checkDestinationID(this.props.deliveryDestinationData.destinationid, latLng) === false){
          //   this.setState({
          //     updateToRender: true,
          //  });
          // }
        }

        this.setState({
          loadingLayer: false,
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
    if (Platform.OS === 'android') {
      ForegroundServiceModule.stopService();
    } else {
      PushNotificationIOS.cancelLocalNotifications();
      PushNotificationIOS.removeAllDeliveredNotifications();
    }
    Geolocation.clearWatch(this.locatorID);
  }
  static _handlebackgroundgeolocation = async (
    nextAppState,
    currentPositionData,
    deliveryDestinationData,
    startDelivered,
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
          NavigationalMap.Beacon.locator(latLng);
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
                importance: 'high',
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
                  importance: 'min',
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
            importance: 'high',
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
              importance: 'high',
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
      index, ApplicationNavigational
    } = this.props;
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
      this.setState({GeoJSON: GeoJSON,   startForegroundService: true,   loadingLayer: false,});
    } else {
      this.setState({
        GeoJSON: GeoJSON,
        loadingLayer: false,
      });
    }
    
  };
 
  toggleCamera = () => {
    const {camera_option, panned_view} = this.state;
    if (panned_view === true) {
      this.setState({
        panned_view: false,
        loadingLayer: true,
      });
    } else {
      this.setState({
        camera_option: camera_option === null ? 'boxer' : null,
        loadingLayer: true,
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
  
  onRegionChange = (region) => {
 
  };
  
  render() {
    const {
      region,
      GeoJSON,
      index,
      trafficLayer,
      trafficButton,
      loadingLayer,
    } = this.state;
   
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <AnimatedMap
          showsTraffic={trafficLayer}
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
       
     
      </View>
    );
  }
}

NavigationalMap.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
});


function mapStateToProps(state) {
  return {
    isConnected : state.network.isConnected,
    bottomBar: state.originReducer.filters.bottomBar,
    startDelivered : state.originReducer.filters.onStartDelivered,
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

export default connect(mapStateToProps, mapDispatchToProps)(NavigationalMap);

