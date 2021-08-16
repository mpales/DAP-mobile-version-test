
import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo} from 'react';
import {View,StyleSheet} from 'react-native';
import {useImperativeGetter} from './imperativeGet';
import Animated from 'react-native-reanimated';
import {Image,LinearProgress} from 'react-native-elements';
/**
 * Created on Sun Jul 8 2021
 *
 * Image LazyLoad
 *
 * lazyload image using init as fetch trigger
 * with Reanimated as concept to avoid heavyload in UI Thread (detect Frame Drops when processing are in heavyload)
 * use with useImperativeGetter to detect node trigger in UI Thread
 * also set the fetch initialization inside component 
 * 
 * @param key
 * @return dispatch
 * @throws null
 * @todo 
 * @author Dwinanto Saputra (dwinanto@grip-principle.com)
 */
export default ImageLoading = forwardRef((props, ref) => {
    const value = useMemo(() => new Animated.Value(0), []);
    const getValue = useImperativeGetter(value);
    const [imageURI, setURI] = useState(null);
    const save = React.useCallback(async () => {
        setURI(null);
        const currentValue = await getValue() // when frame drop detected because rn-reanimated use synchronous 
        let uri = await props.callbackToFetch();
        setURI(Platform.OS === 'android' ? 'file://' + uri : '' + uri );
        value.setValue(1); // set different value
    }, [getValue])
    const [progressLinearVal, setTick] = useState(0);
    const [progressLinearType, setOpt] = useState('indeterminate');
  
    useImperativeHandle(ref, () => ({
      refresh: () => {
        value.setValue(0); // reset to default
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