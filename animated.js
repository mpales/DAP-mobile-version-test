import React, {useRef, useEffect} from 'react';
import {Animated, Easing} from 'react-native';

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const windowHeight = useRef(
    new Animated.Value(props.style.flex === 3 ? 0.5 : 1),
  ).current;
  if (props.transition !== undefined) {
    fadeAnim.setValue(props.transition);
    Animated.timing(windowHeight, {
      toValue: props.style.flex === 3 ? 1.05 : 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }
  useEffect(() => {
    if (props.transition === undefined) {
      Animated.timing(windowHeight, {
        toValue: props.style.flex === 3 ? 1.05 : 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, props, windowHeight]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        transform: [
          {
            scaleY: windowHeight.interpolate({
              inputRange: [0, 3],
              outputRange: [0, 3],
            }),
          },
        ],
      }}>
      {props.children}
    </Animated.View>
  );
};

export {FadeInView};
