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

const screen = Dimensions.get('window');

//camera aspect
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const COORDINATES = [
  {latitude: 37.8025259, longitude: -122.4351431},
  {latitude: 37.7896386, longitude: -122.421646},
  {latitude: 37.7665248, longitude: -122.4161628},
  {latitude: 37.7734153, longitude: -122.4577787},
  {latitude: 37.7948605, longitude: -122.4596065},
  {latitude: 37.8025259, longitude: -122.4351431},
];

export default class AnimatedMarkers extends React.Component {
  constructor(props) {
    super(props);

    const markers = [
      {
        id: 0,
        amount: 99,
        coordinate: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
      },
      {
        id: 1,
        amount: 199,
        coordinate: {
          latitude: LATITUDE + 0.004,
          longitude: LONGITUDE - 0.004,
        },
      },
      {
        id: 2,
        amount: 285,
        coordinate: {
          latitude: LATITUDE - 0.004,
          longitude: LONGITUDE - 0.004,
        },
      },
    ];
    const index = 0;
    this.state = {
      markers,
      index: index,
      region: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    };
  }
  render() {
    const {markers, region} = this.state;

    return (
      <View style={styles.container}>
        <AnimatedMap
          provider={this.props.provider}
          style={styles.map}
          region={region}
          onRegionChange={this.onRegionChange}>
          {markers.map((marker, i) => {
            return (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                pinColor="#000"
              />
            );
          })}

          <Polyline
            coordinates={COORDINATES}
            strokeColor="#000"
            strokeWidth={6}
          />
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
