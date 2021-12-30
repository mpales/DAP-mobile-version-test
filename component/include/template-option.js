import React from 'react';
import {View} from 'react-native';
import {ThemeProvider, Input, Text, CheckBox} from 'react-native-elements';
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
      containerCheckbox: {
        flexDirection: 'column',
         flexGrow:1,
        flexBasis:1,
        justifyContent: 'center',
      },
      checkboxContainer: {
        flexShrink:1,
        borderWidth: 0,
        backgroundColor: 'transparent',
        margin: 0,
        paddingHorizontal: 0,
        justifyContent: 'flex-start',
        alignItems:'flex-start',
      },
      dotLabel: {
        ...Mixins.small1,
        color: '#2D2C2C',
        fontWeight: '500',
        lineHeight: 18,
        paddingHorizontal:9,
      },
};
const theme = {
 
};

const Manifest = React.forwardRef((props, ref) => {
    const [indexOption, setCurrentIndexOption] = React.useState("");
    const handlechangeOption = React.useCallback((val)=>{
        setCurrentIndexOption(val);
    });
    React.useImperativeHandle(ref, () => ({
        getSavedAttr :  () =>{
            if(indexOption === "" && props.required === 1){
                return {"error": "validation error in attributes : " + props.name}
            }
            return indexOption;
        },
      }));
  return (
    <ThemeProvider theme={theme}>
        <View style={[styles.dividerContent,{marginVertical:3}]}>
        <View style={{flexDirection:'row', flexShrink:1, justifyContent:'flex-start',alignItems:'flex-start', paddingTop:10}}>                        
              <Text style={styles.labelPackage}>{props.name}</Text>
              <Text style={styles.dotLabel}>:</Text>
            </View>
            <View style={styles.containerCheckbox}>
            {props.values.map((num,index)=>{
                return(
                    <CheckBox
                    center
                    title={num}
                    containerStyle={styles.checkboxContainer}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={indexOption === index ? true : false}
                    onPress={()=>{
                        handlechangeOption(index);
                    }}
                    />
                );
            })}
                </View>
        </View>
    </ThemeProvider>
  );
});

export default Manifest;