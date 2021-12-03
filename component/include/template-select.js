import React from 'react';
import {View} from 'react-native';
import {ThemeProvider, Input, Text} from 'react-native-elements';
import Mixins from '../../mixins';
import SelectDropdown from 'react-native-select-dropdown';

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
    const [selectVal, setCurrentValue] = React.useState("");
    const handlechangeText = React.useCallback((val)=>{
        setCurrentValue(val);
    });
    React.useImperativeHandle(ref, () => ({
        getSavedAttr :  () =>{
            if(selectVal === "" && props.required === 1){
                return {"error": "validation error in attributes : " + props.name}
            }
            return selectVal;
        },
      }));
  return (
    <ThemeProvider theme={theme}>
        <View style={[styles.dividerContent,{marginVertical:3}]}>
            <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignItems:'center'}}>                        
              <Text style={styles.labelPackage}>{props.name}</Text>
              <Text style={styles.dotLabel}>:</Text>
            </View>
                    <SelectDropdown
                            buttonStyle={{flexBasis:1, flexGrow:1,maxHeight:25,borderRadius: 5, borderWidth:1, borderColor: '#ABABAB', backgroundColor:'white'}}
                            buttonTextStyle={{...styles.infoPackage,textAlign:'left',}}
                            data={props.values}
                            defaultValue={selectVal}
                            onSelect={(selectedItem, index) => {
                             handlechangeText(selectedItem);
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                              return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item
                            }}
                          />
        </View>
    </ThemeProvider>
  );
});

export default Manifest;