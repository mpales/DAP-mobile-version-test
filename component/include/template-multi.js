import { keys } from 'mobx';
import React from 'react';
import {View} from 'react-native';
import {ThemeProvider, Input, Text, CheckBox} from 'react-native-elements';
import Mixins from '../../mixins';
import Checkmark from '../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
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
      checked: {
        backgroundColor: '#2A3386',
        padding: 5,
        borderRadius: 2,
        marginRight: 5,
        marginVertical: 3,
      },
      unchecked: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#6C6B6B',
        padding: 5,
        marginRight: 5,
        marginVertical: 3,
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
                    checkedIcon={(
                        <View
                          style={
                            styles.checked
                          }>
                          <Checkmark height="14" width="14" fill="#FFFFFF" />
                        </View>
                      )
                    }
                    uncheckedIcon={<View style={styles.unchecked} />}
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