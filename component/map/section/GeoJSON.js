import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MapView from 'react-native-maps';
import 'react-native-get-random-values';
import {v1 as uuidv1} from 'uuid';
import IconDelivery2Mobile from '../../../assets/icon/deliveryMobile.svg';
import AnnotedMobile from '../../../assets/icon/Annoted.svg';
import IconLocation5Mobile from '../../../assets/icon/iconmonstr-location-5mobile.svg';
import {useSelector} from 'react-redux';

export const makeOverlays = (features) => {
  const points = features
    .filter(
      (f) =>
        f.geometry &&
        (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint'),
    )
    .map((feature) =>
      makeCoordinates(feature).map((coordinates) =>
        makeOverlay(coordinates, feature),
      ),
    )
    .reduce(flatten, [])
    .map((overlay, index) => ({...overlay, type: 'point', num: index}));

  const lines = features
    .filter(
      (f) =>
        f.geometry &&
        (f.geometry.type === 'LineString' ||
          f.geometry.type === 'MultiLineString'),
    )
    .map((feature) =>
      makeCoordinates(feature).map((coordinates) =>
        makeOverlay(coordinates, feature),
      ),
    )
    .reduce(flatten, [])
    .map((overlay, index) => ({...overlay, type: 'polyline', num: index}));

  const multipolygons = features
    .filter((f) => f.geometry && f.geometry.type === 'MultiPolygon')
    .map((feature) =>
      makeCoordinates(feature).map((coordinates) =>
        makeOverlay(coordinates, feature),
      ),
    )
    .reduce(flatten, []);

  const polygons = features
    .filter((f) => f.geometry && f.geometry.type === 'Polygon')
    .map((feature) => makeOverlay(makeCoordinates(feature), feature))
    .reduce(flatten, [])
    .concat(multipolygons)
    .map((overlay) => ({...overlay, type: 'polygon'}));

  const overlays = points.concat(lines).concat(polygons);

  return overlays;
};

const flatten = (prev, curr) => prev.concat(curr);

const makeOverlay = (coordinates, feature) => {
  let overlay = {
    feature,
    id: feature.id ? feature.id : uuidv1(),
  };
  if (
    feature.geometry.type === 'Polygon' ||
    feature.geometry.type === 'MultiPolygon'
  ) {
    overlay.coordinates = coordinates[0];
    if (coordinates.length > 1) {
      overlay.holes = coordinates.slice(1);
    }
  } else {
    overlay.coordinates = coordinates;
  }
  return overlay;
};

const makePoint = (c) => ({latitude: c[1], longitude: c[0]});

const makeLine = (l) => l.map(makePoint);

const makeCoordinates = (feature) => {
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
    return g.coordinates.map((p) => p.map(makeLine));
  } else {
    return [];
  }
};

const Geojson = (props) => {
  const overlays = makeOverlays(props.geojson.features);
  const isDeliveryStarted = useSelector(
    (state) => state.originReducer.filters.onStartDelivered,
  );
  const currentDeliveringAddress = useSelector(
    (state) => state.originReducer.currentDeliveringAddress,
  );
  return (
    <>
      {overlays.map((overlay) => {
        if (overlay.type === 'point' && ( props.dataPackage === undefined || (props.dataPackage !== undefined && props.dataPackage[overlay.num].status === 'pending'))) {
          return (
            <MapView.Marker
              key={overlay.id}
              coordinate={overlay.coordinates}
              tracksViewChanges={false}>
                {props.maptype === 'delivery' ? (
                <>{isDeliveryStarted ? (
                  <>{overlay.num === 0 ? (
                    <View style={styles.iconContaner}>
                    <IconLocation5Mobile
                      height="25"
                      width="25"
                      fill={'#2A3386'}
                      style={styles.iconSVG}
                    />
                    <Text style={styles.iconNumeric}>{overlay.num + 1}</Text>
                  </View>
                  ) : (
                    <View style={styles.iconContanerSVG}>
                    <AnnotedMobile height="55" width="39" fill="#00BB87" style={[styles.iconSVG, {transform: [{scaleX: -1}]}]} />
                  </View>
                  )}
       
                </>
                ) : (  
                  <>{overlay.num === 0 ? (
                    <View style={styles.iconContaner}>
                    <IconLocation5Mobile
                      height="25"
                      width="25"
                      fill={'#2A3386'}
                      style={styles.iconSVG}
                    />
                    <Text style={styles.iconNumeric}>{overlay.num + 1}</Text>
                  </View>
                  ) : (
                    <View style={styles.iconContanerSVG}>
                    <IconDelivery2Mobile height="55" width="39" fill="#00BB87" style={[styles.iconSVG, {transform: [{scaleX: -1}]}]} />
                  </View>
                  )}
       
                </>
                )}
                </>
              ) : props.maptype === 'list' ?  (
                <View style={styles.iconContaner}>
                <IconLocation5Mobile
                  height="25"
                  width="25"
                  fill={ overlay.num === currentDeliveringAddress ? '#FF0000': '#2A3386'}
                  style={styles.iconSVG}
                />
                <Text style={styles.iconNumeric}>{overlay.num + 1}</Text>
              </View>
              ) : (
                <View style={styles.iconContaner}>
                    <IconLocation5Mobile
                      height="25"
                      width="25"
                      fill={'#2A3386'}
                      style={styles.iconSVG}
                    />
                    <Text style={styles.iconNumeric}>{overlay.num + 1}</Text>
                  </View>
              )}
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
    </>
  );
};

const styles = StyleSheet.create({
  iconContaner: {
    width: 25,
    height: 25,
  },
  iconContanerSVG: {
    width: 39,
    height: 55,
},
  iconNumeric: {
    height: 13,
    width: 16,
    marginHorizontal: 3,
    borderRadius: 15,
    backgroundColor: 'white',
    textAlign: 'center',
    fontWeight: '800',
    lineHeight: 14,
    fontSize: 10,
    position: 'absolute',
    top: 1,
    left: 1.5,
    elevation: 5,
  },
  iconSVG: {
    elevation: 6,
  },
});
export default Geojson;
