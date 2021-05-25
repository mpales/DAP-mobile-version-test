import React from 'react';
import {StyleSheet, Dimensions, Animated} from 'react-native';

import {
  FlingGestureHandler,
  Directions,
  State,
  FlingGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import PanControl from './pan-controller';
const windowWidth = Dimensions.get('window').width;
const circleRadius = 30;

interface IProps {
  panX: Animated.Value;
  panY: Animated.Value;
}

export default class PanGesture extends React.Component<IProps, {}> {
  private touchX: Animated.Value;
  private translateX: Animated.AnimatedAddition;
  private translateY: Animated.Value;
  constructor(props: IProps | Readonly<IProps>) {
    super(props);
    const {panX} = this.props;
    this.touchX = new Animated.Value(windowWidth / 2 - circleRadius);
    this.translateX = Animated.add(panX, new Animated.Value(-circleRadius));
    this.translateY = new Animated.Value(0);
    this.onHorizontalFlingHandlerStateChange.bind(this);
  }

  private onHorizontalFlingHandlerStateChange = (
    {nativeEvent}: FlingGestureHandlerStateChangeEvent,
    offset: number,
  ) => {
    const {panX, horizontal} = this.props;
    if (nativeEvent.oldState === State.ACTIVE && horizontal) {
      if (offset > 0) {
        panX.setValue(panX.__getValue() - nativeEvent.x);
      } else {
        panX.setValue(panX.__getValue() + nativeEvent.x);
      }
    }
  };

  private onVerticalFlingHandlerStateChange = (
    {nativeEvent}: FlingGestureHandlerStateChangeEvent,
    offset: number,
  ) => {
    const {panY, vertical} = this.props;
    if (nativeEvent.oldState === State.ACTIVE && vertical) {
      if (offset > 0) {
        panY.setValue(panY.__getValue() - nativeEvent.y);
      } else {
        panY.setValue(panY.__getValue() + nativeEvent.y);
      }
    }
  };

  render() {
    return (
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={(ev) =>
          this.onHorizontalFlingHandlerStateChange(ev, -10)
        }>
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={(ev) =>
            this.onHorizontalFlingHandlerStateChange(ev, 10)
          }>
              <PanControl {...this.props}>{this.props.children}</PanControl>
        
        </FlingGestureHandler>
      </FlingGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pinchableImage: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {
    flex: 1,
  },
});
