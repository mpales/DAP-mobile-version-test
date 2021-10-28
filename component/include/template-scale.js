import React from 'react';
import {View} from 'react-native';
import {ThemeProvider, Input, Text} from 'react-native-elements';
import Slider from '@react-native-community/slider';
import Mixins from '../../mixins';

const styles = {
    dividerContent: {
        flexDirection: 'row',
        flexShrink: 1,
        marginVertical: 3,
      },
      labelPackage: {
        width: 100,
        ...Mixins.small1,
        color: '#2D2C2C',
        fontWeight: '500',
        lineHeight: 18,
        textAlignVertical: "center",
        paddingRight: 5,
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        maxHeight: 40,
      },
      infoPackage: {
        paddingHorizontal: 10,
        ...Mixins.small1,
        color: '#424141',
        fontWeight: '400',
        lineHeight: 18,
      },
};
const theme = {
 
};

const Manifest = React.forwardRef((props, ref) => {
    const [scaleVal, setCurrentValue] = React.useState(0);
    const handlechangeScale = React.useCallback((val)=>{
        setCurrentValue(val);
    });
    React.useImperativeHandle(ref, () => ({
        getSavedAttr :  () =>{
            if(scaleVal === 0 && props.required === 1){
                return {"error": "validation error in attributes : " + props.name}
            }
            return scaleVal;
        },
      }));
  return (
    <ThemeProvider theme={theme}>
        <View style={[styles.dividerContent,{marginVertical:3}]}>
            <Text style={styles.labelPackage}>{props.name}</Text>
            <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', flexDirection: 'column' }}>
              <View style={{flexShrink: 1, justifyContent:'center', alignItems: 'center'}}><Text style={Mixins.small3}>{scaleVal}</Text></View>
            <Slider
              style={{flexShrink:1}}
              step={parseInt(props.interval)}
              minimumValue={parseInt(props.lowest)}
              maximumValue={parseInt(props.highest)}
                value={scaleVal}
                onValueChange={(value) =>handlechangeScale(value)}
            />
            </View>
        </View>
    </ThemeProvider>
  );
});

export default Manifest;