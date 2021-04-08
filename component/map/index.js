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

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
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
    const animations = markers.map((m, i) =>
      getMarkerState(panX, panY, scrollY, i, index),
    );
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
      markers,
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
    };
    this.updateAnimated.bind(this);
    this.onLihatRincian.bind(this);
    this.onLihatDetail.bind(this);
    this.onCompleteDelivery.bind(this);
  }

  componentDidUpdate(nextProps) {}
  componentDidMount() {
    const {region, panX, panY, scrollX, markers} = this.state;

    panX.addListener(this.onPanXChange);
    panY.addListener(this.onPanYChange);
    region.stopAnimation();
    region
      .timing({
        latitude: scrollX.interpolate({
          inputRange: markers.map((m, i) => i * SNAP_WIDTH),
          outputRange: markers.map((m) => m.coordinate.latitude),
        }),
        longitude: scrollX.interpolate({
          inputRange: markers.map((m, i) => i * SNAP_WIDTH),
          outputRange: markers.map((m) => m.coordinate.longitude),
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
    this.props.setStartDelivered(true);
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
    const {panY, markers, index} = this.state;
    const {pageY} = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = screen.height - pageY;
    return topOfTap < screen.height * 0.6 && topOfTap > screen.height * 0.5;
  };

  onMoveShouldSetPanResponder = (e) => {
    const {panY, markers, index} = this.state;
    const {pageY} = e.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = screen.height - pageY;
    return topOfTap < screen.height * 0.6 && topOfTap > screen.height * 0.5;
  };
  updateAnimated = () => {
    const {markers, index, panX, panY, scrollY} = this.state;
    this.setState({
      animations: {
        ...markers.map((m, i) => getMarkerState(panX, panY, scrollY, i, index)),
      },
    });
  };
  onPanXChange = ({value}) => {
    const {index, markers, canMoveVertical, animations} = this.state;
    const {coordinate} = markers[index];
    const newIndex = Math.floor((-1 * value + SNAP_WIDTH / 2) / SNAP_WIDTH);
    if (index !== newIndex && newIndex < markers.length && newIndex >= 0) {
      this.setState({index: newIndex});
      let {translateX, isNotIndex, center, xPos} = animations[newIndex];
      Animated.timing(translateX, {
        toValue: xPos,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      if (newIndex > markers.length || newIndex < 0) {
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
      markers,
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
        const {coordinate} = markers[index];
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
              inputRange: markers.map((m, i) => i * SNAP_WIDTH),
              outputRange: markers.map((m) => m.coordinate.latitude),
            }),
            longitude: scrollX.interpolate({
              inputRange: markers.map((m, i) => i * SNAP_WIDTH),
              outputRange: markers.map((m) => m.coordinate.longitude),
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
    const {markers, index} = this.state;
    let marker = markers[index];
    return (
      <View style={styles.sheetContainer}>
        <View style={styles.sectionSheetDetail}>
          <View style={styles.detailContent}>
            <Text style={styles.orderTitle}>{marker.amount}</Text>
            <Text style={styles.chrono}>Distant Location 8.5 Km</Text>
            <Text style={styles.eta}>ETA : 30 minute</Text>
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
            value={'' + marker.coordinate.latitude}
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
            value={'' + marker.coordinate.longitude}
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
              titleStyle={{color: '#F1811C', fontSize: 14}}
            />

            <Button
              containerStyle={[styles.buttonDivider, {marginLeft: 10}]}
              icon={() => (
                <View style={{marginRight: 6}}>
                  <IconSpeech26 height="15" width="15" fill="#fff" />
                </View>
              )}
              title="Chat Client"
              titleStyle={{color: '#fff', fontSize: 14}}
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
      markers,
      bottomInfo,
      triggerBottom,
      region,
      carousel,
      bottomPan,
      toggleContainer,
    } = this.state;
    return (
      <View style={styles.container}>
        <PanController
          style={styles.container}
          vertical={canMoveVertical}
          horizontal={canMoveHorizontal}
          xMode="snap"
          snapSpacingX={ITEM_WIDTH * 1.47}
          yBounds={[-1 * screen.height, 0]}
          xBounds={[-screen.width * (markers.length - 1), 0]}
          panY={panY}
          panX={panX}
          onStartShouldSetPanResponder={this.onStartShouldSetPanResponder}
          onMoveShouldSetPanResponder={this.onMoveShouldSetPanResponder}>
          <AnimatedMap
            provider={this.props.provider}
            style={styles.map}
            region={region}
            onRegionChange={this.onRegionChange}>
            {markers.map((marker, i) => {
              const {selected, markerOpacity, markerScale} = animations[i];

              return (
                <Marker key={marker.id} coordinate={marker.coordinate}>
                  <PriceMarker
                    style={{
                      opacity: markerOpacity,
                      transform: [{scale: markerScale}],
                    }}
                    amount={marker.amount}
                    selected={selected}
                  />
                </Marker>
              );
            })}
          </AnimatedMap>
          {!toggleContainer && (
            <Animated.View style={[styles.itemContainer, {opacity: carousel}]}>
              <View style={styles.itemContent}>
                <TouchableOpacity style={styles.buttonHistory}>
                  <Text style={styles.buttonText} h5>
                    History
                  </Text>
                </TouchableOpacity>
                <View style={styles.indicator}>
                  {markers.map((marker, i) => {
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
                  <Text style={styles.buttonText} h5>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              {markers.map((marker, i) => {
                const {
                  translateY,
                  translateX,
                  scale,
                  opacity,
                  height,
                } = animations[i];
                return (
                  <Animated.View
                    key={marker.id}
                    style={[
                      styles.item,
                      {
                        transform: [{translateX: translateX}],
                      },
                    ]}>
                    <Animated.View
                      style={[
                        styles.itemHead,
                        i === markers.length - 1
                          ? {opacity: opacity, left: -20}
                          : {opacity: opacity},
                      ]}>
                      <View style={styles.sectionDetail}>
                        <View style={styles.detailContent}>
                          <Text style={styles.orderTitle}>{marker.amount}</Text>
                          <Text style={styles.chrono}>
                            Distant Location 8.5 Km
                          </Text>
                          <Text style={styles.eta}>ETA : 30 minute</Text>
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
                          value={'' + marker.coordinate.latitude}
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
                          value={'' + marker.coordinate.longitude}
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
                    <View style={styles.sectionContentTitle}>
                      <Text style={styles.orderTitle}>#302323402323</Text>
                      <Text style={styles.chrono}>Distant Location 8.5 Km</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <View style={styles.contentList}>
                        <Text style={styles.listLabel}>From</Text>
                        <Text style={styles.listContent}>Test1</Text>
                      </View>
                      <View style={styles.contentList}>
                        <Text style={styles.listLabel}>To</Text>
                        <Text style={styles.listContent}>Test3</Text>
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
                        title="Start delivery"
                      />
                    </View>
                  </Animated.View>
                );
              })}
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
    flexDirection: 'row',
    paddingHorizontal: ITEM_SPACING / 2 + ITEM_PREVIEW,
    position: 'absolute',
    // top: screen.height - ITEM_PREVIEW_HEIGHT - 64,
    paddingTop: screen.height - ITEM_PREVIEW_HEIGHT - 64 - 89,
    // paddingTop: !ANDROID ? 0 : screen.height - ITEM_PREVIEW_HEIGHT - 64,
  },
  itemContent: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: -screen.height * 0.02,
    height: screen.height * 0.3,
    width: screen.width,
    flexDirection: 'row',
    flexShrink: 0,
    paddingVertical: 30,
  },
  buttonHistory: {
    flex: 1,
    marginHorizontal: 10,
    fontWeight: 'bold',
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
    justifyContent: 'space-evenly',
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
  itemHead: {
    position: 'absolute',
    top: -ITEM_PREVIEW_HEIGHT * 1.7,
    width: ITEM_WIDTH * 1.47,
    height: ITEM_PREVIEW_HEIGHT * 1.4,
    backgroundColor: 'white',
    alignSelf: 'center',
    left: 0,
    borderRadius: 5,
    borderColor: '#000',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 9,
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
    fontSize: 10,
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
    fontWeight: '600',
    fontSize: 10,
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
    fontWeight: '600',
    color: '#FEFEFE',
    fontSize: 10,
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
    fontSize: 14,
    fontWeight: '600',
  },
  chrono: {
    fontSize: 10,
    fontWeight: '400',
    color: '#6C6B6B',
  },
  eta: {
    fontSize: 10,
    color: '#424141',
  },
  detail: {
    flexDirection: 'row',
  },
  labelDetail: {
    color: '#6C6B6B',
    fontSize: 10,
    marginRight: 5,
  },
  labelInfo: {
    fontSize: 10,
    color: '#000000',
  },
  leftLabel: {
    flexDirection: 'row',
  },
  leftLabelText: {
    marginHorizontal: 15,
    fontSize: 10,
    fontWeight: '600',
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
    fontWeight: '600',
    color: '#ffffff',
    fontSize: 14,
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
    fontWeight: '700',
    fontSize: 18,
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
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
  },
  infoPackage: {
    fontWeight: '400',
    fontSize: 12,
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

