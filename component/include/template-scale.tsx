import React,{Ref} from 'react';
import {View, StyleSheet} from 'react-native';
import {ThemeProvider, Input, Text} from 'react-native-elements';
import Slider from '@react-native-community/slider';
import Mixins from '../../mixins';

const styles = StyleSheet.create({
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
      dotLabel: {
        ...Mixins.small1,
        color: '#2D2C2C',
        fontWeight: '500',
        lineHeight: 18,
        paddingHorizontal:9,
      },
});
const theme = {
 
};
interface errorObj {
  error : string;
}
export interface inferTemplateScale {
  getSavedAttr : () => number | errorObj ;
}
interface Props  {
  required: number;
  name : string;
  interval?: string;
  lowest? : string;
  highest? : string;
  ref: Ref<inferTemplateScale | null>
}
const Manifest: React.FC<Props>  = React.forwardRef(({
  required,
  name,
  interval,
  lowest,
  highest,
  ...props
}, ref): React.ReactElement => {
    const [scaleVal, setCurrentValue] = React.useState(0);
    const handlechangeScale = React.useCallback((val)=>{
        setCurrentValue(val);
    }, []);
    React.useImperativeHandle(ref, () => ({
        getSavedAttr :  () =>{
            if(scaleVal === 0 && required === 1){
                return {"error": "validation error in attributes : " + name}
            }
            return scaleVal;
        },
      }));
  return (
    <ThemeProvider theme={theme}>
        <View style={[styles.dividerContent,{marginVertical:3}]}>
        <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignItems:'center'}}>                        
              <Text style={styles.labelPackage}>{name}</Text>
              <Text style={styles.dotLabel}>:</Text>
            </View>
            <View style={{ flexGrow: 1,flexBasis:1, alignItems: 'stretch', justifyContent: 'center', flexDirection: 'column' }}>
              <View style={{flexShrink: 1, justifyContent:'center', alignItems: 'center'}}><Text style={{...Mixins.small3, color: '#424141',}}>{scaleVal}</Text></View>
            <Slider
              style={{flexShrink:1}}
              step={interval ? parseInt(interval) : 0}
              minimumValue={lowest ? parseInt(lowest) : 0}
              maximumValue={highest ? parseInt(highest) : 0}
                value={scaleVal}
                onValueChange={(value) =>handlechangeScale(value)}
            />
            </View>
        </View>
    </ThemeProvider>
  );
});

export default Manifest;