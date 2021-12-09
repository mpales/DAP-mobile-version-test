import { keys } from 'mobx';
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
    const [indexOption, setCurrentIndexOption] = React.useState([...props.values]);
    const toggleChangeMultiSelect = React.useCallback((val)=>{
      let select = Array.from({length: indexOption.length}).map((num,index)=>{
        let bool = (typeof indexOption[index] === 'boolean') ? indexOption[index] : false;
        if(val === index){
          return (!bool);
        }         
        return bool;
      });  
      setCurrentIndexOption(select);
    });
    React.useImperativeHandle(ref, () => ({
        getSavedAttr :  () =>{
            if(indexOption.includes(true) === false && props.required === 1){
                return {"error": "validation error in attributes : " + props.name}
            }

            return Array.from({length:indexOption.length}).map((num, index)=>{
              if(typeof indexOption[index] === 'boolean'){
                if(indexOption[index] === true){
                  return props.values[index];
                } else {
                  return null;
                }
              }
              return null;
            }).filter((o)=> o !== null);
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
                    checked={indexOption[index] === true ? true : false}
                    onPress={()=>{
                      toggleChangeMultiSelect(index);
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