import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';
import {Text, Button} from 'react-native-elements';
import PanController from './pan-gesture';

import {
  ProviderPropType,
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
} from 'react-native-maps';

import PriceMarker from './section/AnimatedPriceMarker';

import BottomSheet from 'reanimated-bottom-sheet';
import IconEllipse from '../../assets/icon/Ellipse 9.svg';
import IconSpeech26 from '../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import {connect} from 'react-redux';
import Util from './interface/leafletPolygon';
import Location from './interface/geoCoordinate'
import Geojson from './section/GeoJSON';
import { BaseRouter } from '@react-navigation/native';
import Mixins from '../../mixins';
const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;


const LATITUDE = 1.1037975445392902;
const LONGITUDE = 104.09571858289692;
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

function getMarkerState(panX, panY, scrollY, i, index, marker) {
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
  const selecter = selected.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(90,210,244)', 'rgb(224,82,99)'],
  });
  const translateY = Animated.multiply(isIndex, panY);

  const height = panY.interpolate({
    inputRange: [0, 1],
    outputRange: [ITEM_PREVIEW_HEIGHT, ITEM_PREVIEW_HEIGHT * 1.5], // <-- value that larger than your content's height
  });

  const translateX = panX;
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
    markerOpacity,
    markerScale,
    xPos,
    ratio,
    selecter,
    height,
  };
}

class AnimatedMarkers extends React.Component {
  constructor(props) {
    super(props);
    const panX = new Animated.Value(0);
    const panY = new Animated.Value(0);
    this.onPanYChange.bind(this);
    this.onPanXChange.bind(this);
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

    const {steps,markers} = this.props;

    let data = [...markers];
    const route = Array.from({length:markers.length}).map((num,index)=>{
        return {id: index, ammount: index*10, coordinate: {latitude:markers[index][0],longitude:markers[index][1]}};
      });

    const index = 0;
    const animations = route.map((m, i) =>
      getMarkerState(panX, panY, scrollY, i, index),
    );
    
    const LatLngs =  Array.from({length: steps.length}).map((num, index) => {
      let latLng = new Location(steps[index][0],steps[index][1]);
      return latLng.location();
    });
    const marker = Array.from({length:markers.length}).map((num,index)=>{
      let latLng = new Location(markers[index][0],markers[index][1]);
    return  latLng.location(); 
    });
    const Polygon = new Util();
    let LayerGroup = Polygon.setLayersGroup(LatLngs,marker);
    //console.log(Polygon.setLatLng(this.props.orders));
   // Polygon.translateToOrder(Polygon.setLatLng(this.props.orders));
    const GeoJSON = LayerGroup.toGeoJSON();
  
    this.state = {
      index: index,
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
      GeoJSON,
      trafficLayer: false,
    };
    this.updateAnimated.bind(this);
    this.onLihatRincian.bind(this);
    this.onLihatDetail.bind(this);
    this.onCompleteDelivery.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot)
  {
    if(prevProps.isTraffic !== this.props.isTraffic){
      if(!this.props.isTraffic){
        this.setState({trafficLayer: false});
      }
    } else {
      if(prevState.index !== this.state.index){
        if(this.props.isTraffic){
          let {duration_in_trafficAPI, durationAPI} = this.props.statAPI[this.state.index];
          let secDiffinTraffic = duration_in_trafficAPI - durationAPI;
          if(secDiffinTraffic > 40){
            this.setState({trafficLayer: true});
          }else {
            this.setState({trafficLayer: false});
          }
        }
      }
    }
  }
  componentDidMount() {
    const {region, panX, panY, scrollX, route} = this.state;
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
  }
  onLihatRincian = () => {
    const {carousel, bottomPan, toggleContainer} = this.state;
    Animated.timing(carousel, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    //this.props.setStartDelivered(true);
    this.setState({toggleContainer: true});
    this.props.setBottomBar(false);
  };
  onLihatDetail = () => {
    this.props.setBottomBar(true);
    this.props.navigation.navigate('Package');
  };
  onCompleteDelivery = () =>{
    this.props.setBottomBar(true);
    this.props.navigation.navigate('Order');
  };
  onStartShouldSetPanResponder = (e) => {
    // we only want to move the view if they are starting the gesture on top
    // of the view, so this calculates that and returns true if so. If we return
    // false, the gesture should get passed to the map view appropriately.
    const {panY, route, index} = this.state;
    const {pageY} = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = screen.height - pageY;
    return topOfTap < screen.height * 0.6 && topOfTap > screen.height * 0.5;
  };

  onMoveShouldSetPanResponder = (e) => {
    const {panY, route, index} = this.state;
    const {pageY} = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = screen.height - pageY;
    return topOfTap < screen.height * 0.6 && topOfTap > screen.height * 0.5;
  };
  updateAnimated = () => {
    const {route, index, panX, panY, scrollY} = this.state;
    this.setState({
      animations: {
        ...route.map((m, i) => getMarkerState(panX, panY, scrollY, i, index)),
      },
    });
  };
  onPanXChange = ({value}) => {
    const {index, route, canMoveVertical, animations} = this.state;
    const {coordinate} = route[index];
    const newIndex = Math.floor((-1 * value + SNAP_WIDTH / 2) / SNAP_WIDTH);
    if (index !== newIndex && newIndex < route.length && newIndex >= 0) {
      this.setState({index: newIndex});
      let {translateX, isNotIndex, center, xPos} = animations[newIndex];
      Animated.timing(translateX, {
        toValue: xPos,
        duration: 200,
        useNativeDriver: false,
      }).start();
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
    console.log(value);
    const shouldBeMovable = value > 2;
    if (shouldBeMovable !== canMoveHorizontal) {
      this.setState({canMoveHorizontal: shouldBeMovable});
      if (!shouldBeMovable) {
        const {coordinate} = route[index];
        region.stopAnimation();
        region
          .timing({
            latitude: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [
                coordinate.latitude,
                coordinate.latitude - LATITUDE_DELTA * 0.5 * 0.375,
              ],
              extrapolate: 'clamp',
            }),
            latitudeDelta: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [LATITUDE_DELTA, LATITUDE_DELTA * 0.5],
              extrapolate: 'clamp',
            }),
            longitudeDelta: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [LONGITUDE_DELTA, LONGITUDE_DELTA * 0.5],
              extrapolate: 'clamp',
            }),
            duration: 0,
          })
          .start();
      } else {
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
      }
    }
  };

  onRegionChange(/* region */) {
    // this.state.region.setValue(region);
  }
  renderInner = () => {
    const {route, index} = this.state;
    let marker = route[index];
    let {distance,to,current,hour,eta} = this.props.stat[index];
    return (
      <View style={styles.sheetContainer}>
        <View style={styles.sectionSheetDetail}>
          <View style={styles.detailContent}>
            <Text style={styles.orderTitle}>{marker.amount}</Text>
            <Text style={styles.chrono}>Distant Location {distance} Km</Text>
            <Text style={styles.eta}>ETA : {eta}</Text>
            <View style={styles.detail}>
              <Text style={styles.labelDetail}>Packages</Text>
              <Text style={styles.labelInfo}>3 box</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonDetail}
            onPress={this.onLihatDetail}>
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
        </View>
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
              buttonStyle={{backgroundColor: '#F07120'}}
            />
          </View>
        </View>
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
      trafficLayer
    } = this.state;

    const {
      opacity,
    } = animations[index];

    const {current,eta,to,distance,hour} = this.props.stat[index];
    return (
      <View style={styles.container}>
        <PanController
          style={styles.container}
          vertical={canMoveVertical}
          horizontal={canMoveHorizontal}
          xMode="snap"
          snapSpacingX={ITEM_WIDTH * 1.47}
          yBounds={[-1 * screen.height, 0]}
          xBounds={[-screen.width * (route.length - 1), 0]}
          panY={panY}
          panX={panX}
          onStartShouldSetPanResponder={this.onStartShouldSetPanResponder}
          onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}>
          <AnimatedMap
            showsTraffic={trafficLayer}
            provider={this.props.provider}
            style={styles.map}
            region={region}
            onRegionChange={this.onRegionChange}
            >
            <Geojson geojson={GeoJSON} strokeWidth={3}/>
          </AnimatedMap>
          {!toggleContainer && (
            <Animated.View style={[styles.itemContainer, {opacity: carousel}]}>
              <View style={styles.itemLegend}>
                <View style={styles.itemDivider} />
                    <Animated.View
                      style={[styles.itemHead,{opacity:opacity}]}>
                      <View style={styles.sectionDetail}>
                        <View style={styles.detailContent}>
                          <Text style={styles.orderTitle}>0</Text>
                          <Text style={styles.chrono}>
                            Distant Location {distance} Km
                          </Text>
                          <Text style={styles.eta}>ETA : {eta}</Text>
                          <View style={styles.detail}>
                            <Text style={styles.labelDetail}>Packages</Text>
                            <Text style={styles.labelInfo}>3 box</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.buttonDetail}
                          onPress={this.onLihatRincian}>
                          <Text style={styles.detailTitle} h6>
                            Delivery Detail
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.sectionCordinate}>
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
                                  fill="#F1811C"
                                />
                                <Text style={styles.leftLabelText}>
                                  Current
                                </Text>
                              </View>
                            );
                          }}
                        />
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
                                  fill="#F1811C"
                                />
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
                        />
                      </View>
                    </Animated.View>
              </View>
              <View style={styles.itemContent}>
                <TouchableOpacity style={styles.buttonHistory}>
                  <Text style={styles.buttonText}>
                    History
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
                <TouchableOpacity style={styles.buttonAll}>
                  <Text style={styles.buttonText}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.itemWrapper}>
              {route.map((marker, i) => {
                const {
                  translateX,
                } = animations[i];
                const {current,eta,to,distance,hour} = this.props.stat[i];
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
                      <Text style={styles.orderTitleItem}>#302323402323</Text>
                      <Text style={styles.chrono}>Distant Location {distance} Km</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <View style={styles.contentList}>
                        <Text style={styles.listLabel}>From</Text>
                        <Text style={styles.listContent}>{current}</Text>
                      </View>
                      <View style={styles.contentList}>
                        <Text style={styles.listLabel}>To</Text>
                        <Text style={styles.listContent}>{to}</Text>
                      </View>
                      <View style={styles.contentList}>
                        <Text style={styles.listLabel}>Package</Text>
                        <Text style={styles.listContent}>{marker.amount}</Text>
                      </View>
                    </View>
                    <View style={styles.sectionContentButton}>
                      <Button
                        buttonStyle={styles.contentButton}
                        onPress={this.onLihatRincian}
                        titleStyle={styles.contentButtonText}
                        title="See details"
                      />
                    </View>
                  </Animated.View>
                );
              })}
              </View>
            </Animated.View>
          )}
          {toggleContainer && (
            <BottomSheet
              ref={this.state.bottomSheet}
              snapPoints={[40, 500, 250]}
              enabledGestureInteraction={true}
              renderContent={this.renderInner}
              renderHeader={this.renderHeader}
              initialSnap={1}
            />
          )}
        </PanController>
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
    backgroundColor: 'white',
    height: 600,
  },
  itemContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    position: 'absolute',
    // top: screen.height - ITEM_PREVIEW_HEIGHT - 64,
    marginTop: screen.height - ITEM_PREVIEW_HEIGHT - 440, // 270
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
    backgroundColor:'white',
    position:'absolute',
    bottom:-1,
    left:0,
  },
  itemHead: {
    width: screen.width - ITEM_SPACING * 4,
    marginHorizontal: (ITEM_SPACING * 4 )/2,
    marginBottom:5,
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
    lineHeight:12,
    color: '#000000',
  },
  header: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 120,
    height: 7,
    backgroundColor: '#C4C4C4',
    marginBottom: 10,
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
});


function mapStateToProps(state) {
  return {
    bottomBar: state.filters.bottomBar,
    startDelivered : state.filters.onStartDelivered,
    markers: state.route.markers,
    stat : state.route.stat,
    statAPI : state.route.statAPI,
    steps: state.route.steps,
    isTraffic: state.filters.isTraffic,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setStartDelivered : (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    }
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AnimatedMarkers);

