import React, { Component, PropTypes } from 'react';
import { View,StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';
import 'react-native-get-random-values'
import {v1 as uuidv1} from 'uuid';
import IconLocation5Mobile from '../../../assets/icon/iconmonstr-location-5mobile.svg';

export const makeOverlays = features => {
  const points = features
    .filter(f => f.geometry && (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint'))
    .map(feature => makeCoordinates(feature).map(coordinates => makeOverlay(coordinates, feature)))
    .reduce(flatten, [])
    .map((overlay,index) => ({ ...overlay, type: 'point', num: index }));

  const lines = features
    .filter(
      f => f.geometry && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString')
    )
    .map(feature => makeCoordinates(feature).map(coordinates => makeOverlay(coordinates, feature)))
    .reduce(flatten, [])
    .map((overlay,index) => ({ ...overlay, type: 'polyline',num:index }));

  const multipolygons = features
    .filter(f => f.geometry && f.geometry.type === 'MultiPolygon')
    .map(feature => makeCoordinates(feature).map(coordinates => makeOverlay(coordinates, feature)))
    .reduce(flatten, []);

  const polygons = features
    .filter(f => f.geometry && f.geometry.type === 'Polygon')
    .map(feature => makeOverlay(makeCoordinates(feature), feature))
    .reduce(flatten, [])
    .concat(multipolygons)
    .map(overlay => ({ ...overlay, type: 'polygon' }));

  const overlays = points.concat(lines).concat(polygons);

  return overlays;
};

const flatten = (prev, curr) => prev.concat(curr);

const makeOverlay = (coordinates, feature) => {
  let overlay = {
    feature,
    id: feature.id ? feature.id : uuidv1(),
  };
  if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
    overlay.coordinates = coordinates[0];
    if (coordinates.length > 1) {
      overlay.holes = coordinates.slice(1);
    }
  } else {
    overlay.coordinates = coordinates;
  }
  return overlay;
};

const makePoint = c => ({ latitude: c[1], longitude: c[0] });

const makeLine = l => l.map(makePoint);

const makeCoordinates = feature => {
  const g = feature.geometry;
  if (g.type === 'Point') {
    return [makePoint(g.coordinates)];
  } else if (g.type === 'MultiPoint') {
    return g.coordinates.map(makePoint);
  } else if (g.type === 'LineString') {
    return [makeLine(g.coordinates)];
  } else if (g.type === 'MultiLineString') {
    return g.coordinates.map(makeLine);
  } else if (g.type === 'Polygon') {
    return g.coordinates.map(makeLine);
  } else if (g.type === 'MultiPolygon') {
    return g.coordinates.map(p => p.map(makeLine));
  } else {
    return [];
  }
};

const Geojson = props => {
  const overlays = makeOverlays(props.geojson.features);
  return (
    <View>
      {overlays.map(overlay => {
        if (overlay.type === 'point') {
          return (
            <MapView.Marker
              key={overlay.id}
              coordinate={overlay.coordinates}
            >
                <View style={styles.iconContaner}>
                    <IconLocation5Mobile height="25" width="25" fill="#000" style={styles.iconSVG} />
                    <Text style={styles.iconNumeric}>{overlay.num}</Text>
                </View>
            </MapView.Marker>
          );
        }
        if (overlay.type === 'polygon') {
          return (
            <MapView.Polygon
              key={overlay.id}
              coordinates={overlay.coordinates}
              holes={overlay.holes}
              strokeColor={props.strokeColor}
              fillColor={props.fillColor}
              strokeWidth={props.strokeWidth}
            />
          );
        }
        if (overlay.type === 'polyline') {
            let color = "rgba(255,0,0,0.3)";
            if(overlay.num === 0){
                color = "rgba(0,255,0,0.3)";
            } else if(overlay.num === 1){
                color = "rgba(0,0,255,0.3)";
            } else if(overlay.num === 2){
                color = "rgba(192,192,192,0.3)";
            } else {
                color = color;
            }
          return (
            <MapView.Polyline
              key={overlay.id}
              coordinates={overlay.coordinates}
              strokeColor={props.strokeColor}
              strokeWidth={props.strokeWidth}
            />
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
    iconContaner: {
        width: 25,
        height: 25,
    },
    iconNumeric: {
        height: 14,
        width: 19,
        marginHorizontal: 3,
        borderRadius: 15,
        backgroundColor: 'white',
        textAlign: 'center',
        fontWeight:'800',
        lineHeight: 16,
        fontSize: 11,
        position:'absolute',
        top:0,
        left:0,
        elevation: 5,
    },
    iconSVG: {
        elevation: 6,
    },
});
export default Geojson;
