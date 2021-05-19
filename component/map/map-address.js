import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ProviderPropType,
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
  Polyline,
} from 'react-native-maps';
import Location from './interface/geoCoordinate'
import GEO from './interface/geoConditional';
import Geojson from './section/GeoJSON';
import Util from './interface/leafletPolygon';
import {connect} from 'react-redux';

const screen = Dimensions.get('window');

//camera aspect
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.2222;

const LATITUDE = 1.3287109;
const LONGITUDE = 103.8476682;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class AnimatedMarkers extends React.Component {
  
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
          provider={this.props.provider}
          style={styles.map}
          region={region}
          onRegionChange={this.onRegionChange}>
       
        <Geojson geojson={GeoJSON} strokeWidth={3}/>
        </AnimatedMap>
      </View>
    );
  }
}

AnimatedMarkers.propTypes = {
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


export default connect(mapStateToProps, null, null, { pure: true })(AnimatedMarkers);