
import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo} from 'react';
import {View,StyleSheet} from 'react-native';
import {useImperativeGetter} from './imperativeGet';
import Animated from 'react-native-reanimated';
import {Image,LinearProgress} from 'react-native-elements';

export default ImageLoading = forwardRef((props, ref) => {
    const value = useMemo(() => new Animated.Value(0), []);
    const getValue = useImperativeGetter(value);
    const [imageURI, setURI] = useState(null);
    const save = React.useCallback(async () => {
        setURI(null);
        const currentValue = await getValue()
        let uri = await props.callbackToFetch();
        setURI(Platform.OS === 'android' ? 'file://' + uri : '' + uri );
        value.setValue(1);
    }, [getValue])
    const [progressLinearVal, setTick] = useState(0);
    const [progressLinearType, setOpt] = useState('indeterminate');
    // To customize the value that the parent will get in their ref.current: 
    // pass the ref object to useImperativeHandle as the first argument. 
    // Then, whatever will be returned from the callback in the second argument, 
    // will be the value of ref.current. 
    // Here I return an object with the toggleColor method on it, for the parent to use:
    useImperativeHandle(ref, () => ({
      refresh: () => {
        value.setValue(0);
        save();
    },
    init : ()=>{
        save();
    },
    initAsync : async () =>{
        await save();
        return true;
    },
    indicatorTick: (val) => {
        if(val > 1){
            setOpt('indeterminate');
        } else {
            setOpt('determinate');
            setTick(val)
        }
    },
    checkPreload: ()=>{
        return imageURI !== null ? false : true;
    },
    }));

    return (
    <View style={{...props.containerStyle}}>
    <Animated.View style={[{...props.style, ...StyleSheet.absoluteFillObject, justifyContent:'center',alignItems:'center'},{transform:[  { scale: value.interpolate( {
    inputRange: [0,1],
    outputRange: [1,0],
    extrapolate: Animated.Extrapolate.CLAMP  })},]}]}>
    <LinearProgress value={progressLinearVal} color="primary" style={{width:'100%'}} variant={progressLinearType}/>
    </Animated.View>
    {imageURI !== null && (
        <Image
        source={{ uri: imageURI }}
        style={{ ...props.imageStyle}}
        containerStyle={{...props.imageContainerStyle}}
        />
    )}
    </View>);
  });