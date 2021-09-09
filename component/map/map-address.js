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
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Location from './interface/geoCoordinate';
import GEO from './interface/geoConditional';
import Geojson from './section/GeoJSON';
import Util from './interface/leafletPolygon';
import Distance from './interface/spatialIterative';
import {connect} from 'react-redux';
import {geoJSON} from 'leaflet';

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

    const markers = this.props.markers;

    const index = 0;

    let marker = Array.from({length: markers.length}).map((num, index) => {
      let latLng = new Location(markers[index][0], markers[index][1]);
      return latLng.location();
    });

    const Polygon = new Util();
    let LayerGroup = Polygon.setLayersGroup(null, marker);
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
      GeoJSON,
    };
  }
  componentDidMount() {
    const {markers} = this.props;
    const {region} = this.state;
    if (markers.length > 0) {
      console.log(markers);
      const Region = Distance.regionByRoute(ASPECT_RATIO, markers);
      region.setValue({
        latitudeDelta: Region.latitudeDelta,
        longitudeDelta: Region.longitudeDelta,
        latitude: Region.latitude,
        longitude: Region.longitude,
      });
      this.setState({region: region});
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {region} = this.state;
    if (prevProps.route_id !== this.props.route_id) {
      const markers = this.props.markers;
      let marker = Array.from({length: markers.length}).map((num, index) => {
        let latLng = new Location(markers[index][0], markers[index][1]);
        return latLng.location();
      });
      if (markers.length > 0) {
        const Region = Distance.regionByRoute(ASPECT_RATIO, markers);
        region.setValue({
          latitudeDelta: Region.latitudeDelta,
          longitudeDelta: Region.longitudeDelta,
          latitude: Region.latitude,
          longitude: Region.longitude,
        });
      }
      const Polygon = new Util();
      let LayerGroup = Polygon.setLayersGroup(null, marker);
      //console.log(Polygon.setLatLng(this.props.orders));
      // Polygon.translateToOrder(Polygon.setLatLng(this.props.orders));
      const GeoJSON = LayerGroup.toGeoJSON();
      this.setState({
        GeoJSON,
        region: region,
      });
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // use different variable then state polygon
    let Utils = new Util();
    //  if (Utils.compareLatLngs(prevProps.markers,this.props.markers)) {
    //  return true;
    // }
    return null;
  }

  render() {
    const {region, GeoJSON} = this.state;
    return (
      <View style={styles.container}>
        <AnimatedMap
          showsTraffic={this.props.trafficLayer}
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
          onRegionChange={this.onRegionChange}>
          {this.props.dataPackage.length > 0 && (
            <Geojson
              geojson={GeoJSON}
              strokeWidth={3}
              strokeColor={'#121C78'}
              dataPackage={this.props.dataPackage}
              maptype="list"
            />
          )}
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
    orders: state.originReducer.route.orders,
    markers: state.originReducer.route.markers,
    steps: state.originReducer.route.steps,
    route_id: state.originReducer.route.id,
    dataPackage: state.originReducer.route.dataPackage,
  };
}

export default connect(mapStateToProps, null, null, {pure: true})(
  AnimatedMarkers,
);
