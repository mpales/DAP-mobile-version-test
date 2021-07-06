import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
  NativeModules,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ProviderPropType,
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
  Polyline,
  PROVIDER_GOOGLE
} from 'react-native-maps';
import Location from './interface/geoCoordinate'
import GEO from './interface/geoConditional';
import Geojson from './section/GeoJSON';
import Util from './interface/leafletPolygon';
import Distance from './interface/spatialIterative';
import {connect} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
const {RNFusedLocation} = NativeModules;
const screen = Dimensions.get('window');

//camera aspect
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.2222;

const LATITUDE = 1.3287109;
const LONGITUDE = 103.8476682;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class MapAddress extends React.Component {
  static Beacon = null;
  constructor(props) {
    super(props);
    const COORDINATES = this.props.steps;

    const markers = this.props.markers;

      const index = 0;
      let latLng1 = new Location(LATITUDE,LONGITUDE);
      let latLng2 = new Location(LATITUDE -0.004,LONGITUDE - 0.004);
      
      const LatLngs =  Array.from({length: COORDINATES.length}).map((num, index) => {
        let latLng = new Location(COORDINATES[index][0],COORDINATES[index][1]);
        return latLng.location();
      });
      let marker = Array.from({length:markers.length}).map((num,index)=>{
        let latLng = new Location(markers[index][0],markers[index][1]);
      return  latLng.location(); 
      });
    
      const Polygon = new Util;
      let LayerGroup = Polygon.setLayersGroup(LatLngs,marker);
      //console.log(Polygon.setLatLng(this.props.orders));
     // Polygon.translateToOrder(Polygon.setLatLng(this.props.orders));
      const GeoJSON = LayerGroup.toGeoJSON();
    
    //let ChangeOrder = Polygon.translateToOrder([marker[1],marker[2],marker[0]]);
    //console.log(LayerGroup);
    
     this.state = {
      markers,
      index: index,
      region: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      LatLngs: LatLngs,
      GeoJSON,
    };
  }


  componentDidMount() {
    const {region} = this.state;
    const {markers,steps} = this.props;
    if(this.props.route_id !== 0){
      let destination = new Location(markers[0][0], markers[0][1]);
      if (MapAddress.Beacon instanceof Distance === false) {
        MapAddress.Beacon = new Distance(destination);
      } else if (
        MapAddress.Beacon.checkDestination(destination) === false
      ) {
        MapAddress.Beacon = new Distance(destination);
      }
      let watchID = Geolocation.watchPosition(
        ({coords}) => {
    
          let camera = MapAddress.Beacon.bound(ASPECT_RATIO,coords, steps);
          region
          .spring({
            latitudeDelta: camera.latitudeDelta,
            longitudeDelta: camera.longitudeDelta,
            latitude: camera.latitude,
            longitude: camera.longitude,
            useNativeDriver: false,
          })
          .start();
          Geolocation.clearWatch(watchID);
          RNFusedLocation.stopObserving();
        },
        () => {},
        {
          timeout: 300,
          maximumAge: 50,
          enableHighAccuracy: true,
          useSignificantChanges: false,
          distanceFilter: 0,
        },
      );
    }
  

  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.route_id !== this.props.route_id){
      const COORDINATES = this.props.steps;

      const markers = this.props.markers;
  
        const LatLngs =  Array.from({length: COORDINATES.length}).map((num, index) => {
          let latLng = new Location(COORDINATES[index][0],COORDINATES[index][1]);
          return latLng.location();
        });
        let marker = Array.from({length:markers.length}).map((num,index)=>{
          let latLng = new Location(markers[index][0],markers[index][1]);
        return  latLng.location(); 
        });
      
        const Polygon = new Util;
        let LayerGroup = Polygon.setLayersGroup(LatLngs,marker);
        //console.log(Polygon.setLatLng(this.props.orders));
       // Polygon.translateToOrder(Polygon.setLatLng(this.props.orders));
        const GeoJSON = LayerGroup.toGeoJSON();
        let destination = new Location(markers[0][0], markers[0][1]);
        if (MapAddress.Beacon instanceof Distance === false) {
          MapAddress.Beacon = new Distance(destination);
        } else if (
          MapAddress.Beacon.checkDestination(destination) === false
        ) {
          MapAddress.Beacon = new Distance(destination);
        }
        let watchID = Geolocation.watchPosition(
          ({coords}) => {
      
            let camera = MapAddress.Beacon.bound(ASPECT_RATIO,coords, COORDINATES);
            console.log('test');
            this.state.region
            .spring({
              latitudeDelta: camera.latitudeDelta,
              longitudeDelta: camera.longitudeDelta,
              latitude: camera.latitude,
              longitude: camera.longitude,
              useNativeDriver: false,
            })
            .start();
            Geolocation.clearWatch(watchID);
            RNFusedLocation.stopObserving();
          },
          () => {},
          {
            timeout: 300,
            maximumAge: 50,
            enableHighAccuracy: true,
            useSignificantChanges: false,
            distanceFilter: 0,
          },
        );
    
      this.setState({
        GeoJSON
      });
    }
  }
  
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // use different variable then state polygon
    let Utils = new Util;
  //  if (Utils.compareLatLngs(prevProps.markers,this.props.markers)) {
    //  return true;
   // }
    return null;
  }

  render() {
    const {markers, region,LatLngs,GeoJSON} = this.state;

    return (
      <View style={styles.container}>
        <AnimatedMap
        showsTraffic={this.props.trafficLayer}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChange={this.onRegionChange}>
       
        <Geojson geojson={GeoJSON} strokeWidth={3}/>
        </AnimatedMap>
      </View>
    );
  }
}

MapAddress.propTypes = {
  provider: ProviderPropType,
};

const styles = {
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
};

function mapStateToProps(state) {
  return {
    orders : state.originReducer.route.orders,
    markers: state.originReducer.route.markers,
    steps: state.originReducer.route.steps,
    route_id: state.originReducer.route.id,
  };
}


export default connect(mapStateToProps, null, null, { pure: true })(MapAddress);
