import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  NativeModules,
  AppState,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Avatar} from 'react-native-elements';
import {default as Reanimated, EasingNode} from 'react-native-reanimated';
import {bindActionCreators} from 'redux';
import {getDeliveryDirections} from '../../action/direction';
import {reverseGeoCoding} from '../../action/geolocation';
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'always',
});
const {RNFusedLocation} = NativeModules;
import {
  ProviderPropType,
  Animated as AnimatedMap,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import IconDelivery13 from '../../assets/icon/iconmonstr-delivery-13.svg';
import IconDelivery6 from '../../assets/icon/iconmonstr-delivery-6mobile.svg';
import {connect} from 'react-redux';
import Util from './interface/leafletPolygon';
import Location from './interface/geoCoordinate';
import Distance from './interface/spatialIterative';
import Geojson from './section/GeoJSON';
import Geojsonhistory from './section/GeoJSONHistory';
import Mixins from '../../mixins';
import BackgroundGeolocation from '@darron1217/react-native-background-geolocation';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {showLocation} from './link';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
const ForegroundServiceModule = NativeModules.ForegroundService;
const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class NavigationalMap extends React.Component {
  _appState = React.createRef();
  locatorID = null;
  callbackModeChange = new Reanimated.Value(0);
  static Beacon = null;
  constructor(props) {
    super(props);

    if (!this._appState.current) {
      this._appState.current = AppState.currentState;
    }

    const {data, index} = this.props;

    // route coords are from backend, markers are from google
    const route = Array.from({length: data.length}).map((num, index) => {
      return {
        id: index,
        coordinate: {
          latitude: data[index].coords.lat,
          longitude: data[index].coords.lng,
        },
      };
    });

    const currentCoords = {
      latitude: this.props.currentPositionData.coords.lat,
      longitude: this.props.currentPositionData.coords.lng,
    };

    this.state = {
      route,
      region: new AnimatedRegion({
        latitude: parseFloat(route[index].coordinate.latitude),
        longitude: parseFloat(route[index].coordinate.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      GeoJSON: null,
      trafficLayer: false,
      updateToRenderMap: false,
      currentCoords: currentCoords,
      history_polyline: null,
      camera_option: null,
      panned_view: false,
      foregroundService: false,
      ApplicationNavigational: null,
      loadingLayer: true,
      showLocationOnce : false,
    };
    this.fadeAnimatedMode.bind(this);
    this.toggleCamera.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {
      index,
      markers,
      trafficLayer,
      ApplicationNavigational,
      foregroundService,
    } = props;
    const {currentCoords, route, updateToRenderMap, region} = state;
    const destination = new Location(markers[index][0], markers[index][1]);
    if (NavigationalMap.Beacon instanceof Distance === false) {
      NavigationalMap.Beacon = new Distance(destination);
      props.getDeliveryDirections(route[index].coordinate, currentCoords);
      props.reverseGeoCoding(currentCoords);
      let initialCamera = NavigationalMap.Beacon.camera(
        ASPECT_RATIO,
        currentCoords,
      );
      region.setValue({
        latitudeDelta: initialCamera.latitudeDelta,
        longitudeDelta: initialCamera.longitudeDelta,
        latitude: initialCamera.latitude,
        longitude: initialCamera.longitude,
      });
      return {
        ...state,
        loadingLayer: true,
        region: region,
        trafficLayer: trafficLayer,
        ApplicationNavigational: ApplicationNavigational,
        foregroundService: foregroundService,
        updateToRenderMap: false,
      };
    } else if (
      NavigationalMap.Beacon.checkDestination(destination) === false ||
      updateToRenderMap === true
    ) {
      NavigationalMap.Beacon = new Distance(destination);
      props.getDeliveryDirections(route[index].coordinate, currentCoords);
      props.reverseGeoCoding(currentCoords);
      let initialCamera = NavigationalMap.Beacon.camera(
        ASPECT_RATIO,
        currentCoords,
      );
      region.setValue({
        latitudeDelta: initialCamera.latitudeDelta,
        longitudeDelta: initialCamera.longitudeDelta,
        latitude: initialCamera.latitude,
        longitude: initialCamera.longitude,
      });
      return {
        ...state,
        loadingLayer: true,
        region: region,
        trafficLayer: trafficLayer,
        ApplicationNavigational: ApplicationNavigational,
        foregroundService: foregroundService,
        updateToRenderMap: false,
      };
    }

    return {
      ...state,
      region: region,
      trafficLayer: trafficLayer,
      ApplicationNavigational: ApplicationNavigational,
      foregroundService: foregroundService,
      updateToRenderMap: false,
    };
  }
 
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.destinationid !== prevProps.destinationid) {
      if (this.props.destinationid === null) {
        this.setState({updateToRenderMap: true});
      } else {
        this.getDeliveryDirection();
      }
    }
    if(this.props.startDelivered !== prevProps.startDelivered){
      if(this.props.startDelivered === false && this.state.history_polyline !== null){
        this.setState({history_polyline:null,showLocationOnce:false});
      }
    }
    if(this.props.keyStack !== prevProps.keyStack){
      if(this.props.keyStack === 'Map'){
        this.callbackModeChange.setValue(1);
        if(this.props.startDelivered === true){
          RNFusedLocation.startObserving({
            timeout: 300,
            maximumAge: 50,
            enableHighAccuracy: true,
            useSignificantChanges: false,
            distanceFilter: 0,
          });
        }
      }
    }
    if(this.state.foregroundService !== prevState.foregroundService){
      if(this.state.foregroundService === true){
        this.setState({
          showLocationOnce: true,
        });   
      }
    }
    if (this.props.startDelivered === true && this.props.ApplicationNavigational !== null && this.props.destinationid !== null && this.state.showLocationOnce === false) {
      this.setState({
        showLocationOnce: true,
      });
      showLocation({
        latitude:
          this.props.deliveryDestinationData.steps[
            this.props.deliveryDestinationData.steps.length - 1
          ][0],
        longitude:
        this.props.deliveryDestinationData.steps[
          this.props.deliveryDestinationData.steps.length - 1
          ][1],
        sourceLatitude: -8.0870631, // optionally specify starting location for directions
        sourceLongitude: -34.8941619, // not optional if sourceLatitude is specified
        //title: 'The White House', // optional
        googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
        googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58', // optionally specify the google-place-id
        alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
        dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
        dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
        cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
        appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
        naverCallerName: 'com.example.myapp', // to link into Naver Map You should provide your appname which is the bundle ID in iOS and applicationId in android.
        app: this.props.ApplicationNavigational, // optionally specify specific app to use
      });
    } 
  }
  componentDidMount() {
    this.callbackModeChange.setValue(1);
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
                    camera_option === null ? 'bottom-pad' : camera_option,
                  )
                : NavigationalMap.Beacon.camera(
                    ASPECT_RATIO,
                    latLng,
                    null,
                    'bottom-pad',
                  );
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
    RNFusedLocation.stopObserving()
    Geolocation.clearWatch(this.locatorID);
    BackgroundGeolocation.removeAllListeners();
    BackgroundGeolocation.stop();
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
                importance: 'min',
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
                importance: 'min',
                message:
                  'Your calculated distance to destination is about ' +
                  L.latLng(
                    deliveryDestinationData.steps[
                      deliveryDestinationData.steps.length - 1
                    ][0],
                    deliveryDestinationData.steps[
                      deliveryDestinationData.steps.length - 1
                    ][1],
                  ).distanceTo(
                    L.latLng(location.latitude, location.longitude),
                  ).toFixed(0) +
                  ' metres',
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
                  'Your calculated distance to destination is about ' +
                  L.latLng(
                    deliveryDestinationData.steps[
                      deliveryDestinationData.steps.length - 1
                    ][0],
                    deliveryDestinationData.steps[
                      deliveryDestinationData.steps.length - 1
                    ][1],
                  ).distanceTo(
                    L.latLng(location.latitude, location.longitude),
                  ).toFixed(0) +
                  ' metres',
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
            importance: 'default',
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
              importance: 'default',
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
      markers,
      currentPositionData,
      deliveryDestinationData,
      startDelivered,
      currentDeliveringAddress,
      index,
      ApplicationNavigational,
    } = this.props;
    let LatLngs = [];
    let marker = [];
    let latLng;

    if (startDelivered || currentDeliveringAddress !== null) {
      // push next location marker
      latLng = new Location(
        markers[currentDeliveringAddress][0],
        markers[currentDeliveringAddress][1],
      );
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
    
      this.setState({
        GeoJSON: GeoJSON,
        loadingLayer: false,
      });
  };

  onRegionChange(/* region */) {}
  onPanMapEvent() {
    this.setState({panned_view: true});
  }
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
    this.callbackModeChange.setValue(1);
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
  fadeAnimatedMode = ()=>{
    const {loadingLayer} = this.state;
    if(loadingLayer === false){
      Reanimated.timing(this.callbackModeChange,{
        duration: 5000,
        toValue: 0,
        easing: EasingNode.bezier(0,0,4,0),
      }).start()
    }
  }
  render() {
    const {
      region,
      toggleContainer,
      GeoJSON,
      trafficLayer,
      currentCoords,
    } = this.state;
    const {index} = this.props;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <AnimatedMap
          showsTraffic={trafficLayer}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={[
            {
              featureType: 'poi',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'transit',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
          ]}
          region={region}
          onRegionChange={(regionToAnimate, {isGesture}) => {
            if (isGesture || this.state.panned_view) {
              region.setValue(regionToAnimate);
            }
          }}
          onRegionChangeComplete={(regionToAnimate, {isGesture}) => {
            if (isGesture) {
              region.stopAnimation();
              this.callbackModeChange.setValue(1);
              this.setState({panned_view: true});
            }
            if (!this.props.startDelivered) {
              region.stopAnimation();
            }
          }}
          scrollEnabled={Platform.OS === 'ios' ? true : true}>
          {GeoJSON !== null && (
            <Geojson
              geojson={GeoJSON}
              strokeWidth={3}
              strokeColor={'#2A3386'}
              maptype="delivery"
              markernum={index}
            />
          )}

          {this.state.history_polyline !== null && (
            <Geojsonhistory
              geojson={this.state.history_polyline}
              strokeWidth={6}
              strokeColor={'#F1811C'}
              markernum={index}
            />
          )}
        </AnimatedMap>

        <View
          style={{
            alignSelf: 'flex-end',
            marginHorizontal: 15,
            marginVertical: 10,
            flexDirection:'column'
          }}>
            <View style={{justifyContent:'center',flexDirection:'row',alignItems:'flex-start'}}>
            <Reanimated.Code
                exec={() =>
                  Reanimated.onChange(
                    this.callbackModeChange,
                    Reanimated.block([
                      Reanimated.cond(Reanimated.eq(this.callbackModeChange,1),
                        this.fadeAnimatedMode(),
                        0),
                    ]),
                  )
                }
              />
            <Reanimated.Text style={[{...Mixins.small3,lineHeight:15,fontWeight:'400',color:'#6C6B6B',paddingVertical:13,paddingHorizontal:5},{ transform: [
              { scale: this.callbackModeChange },
            ]}]}>
              {this.state.panned_view ? 'Free Mode' : this.state.camera_option ? 'Driver Mode' : 'Delivering Route Mode'}
            </Reanimated.Text>
            <View style={{flexDirection:'column',alignItems:'center'}}>
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
    bottomBar: state.originReducer.filters.bottomBar,
    startDelivered: state.originReducer.filters.onStartDelivered,
    stat: state.originReducer.route.stat,
    steps: state.originReducer.route.steps,
    currentPositionData: state.originReducer.currentPositionData,
    deliveryDestinationData: state.originReducer.deliveryDestinationData,
    destinationid: state.originReducer.deliveryDestinationData.destinationid,
    currentDeliveringAddress: state.originReducer.currentDeliveringAddress,
    keyStack: state.originReducer.filters.keyStack,
    ApplicationNavigational : state.originReducer.filters.ApplicationNavigational,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators({getDeliveryDirections, reverseGeoCoding}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationalMap);
