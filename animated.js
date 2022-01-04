import React, {useRef, useEffect, forwardRef,
  useImperativeHandle,
  useState,} from 'react';
import {ActivityIndicator, Animated, Easing} from 'react-native';

export default FadeInView =  forwardRef((props, ref) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [indicator, setIndicator] = useState(false);
  const hide = React.useCallback( () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(()=> setIndicator(true));
  }, [fadeAnim]);
 
  const show = React.useCallback( () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(()=> setIndicator(false));
  }, [fadeAnim]);
 
  useImperativeHandle(ref, () => ({
    setOpacity: (val) => {
      if(val === 1){
        show();
      } else {
        hide();
      }
    },
  }));
  return (
    <>
     {indicator === true && (<ActivityIndicator size={50} color="#ffffff" />)}
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}>
      {props.children}
    </Animated.View>
  </>
  );
});
