import React,{Ref}  from 'react';
import {View,StyleSheet} from 'react-native';
import {ThemeProvider, Input, Text} from 'react-native-elements';
import Mixins from '../../mixins';
import SelectDropdown from 'react-native-select-dropdown';

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
export interface inferTemplateSelect {
  getSavedAttr : () => string | errorObj ;
}
interface Props  {
  required: number;
  name : string;
  values?: Array<string>;
  ref: Ref<inferTemplateSelect | null > 
}
const Manifest: React.FC<Props> = React.forwardRef(({
  required,
  name,
  values,
  ...props
}, ref): React.ReactElement => {
    const [selectVal, setCurrentValue] = React.useState("");
    const handlechangeText = React.useCallback((val)=>{
        setCurrentValue(val);
    }, []);
    React.useImperativeHandle(ref, () => ({
        getSavedAttr :  () =>{
            if(selectVal === "" && required === 1){
                return {"error": "validation error in attributes : " + name}
            }
            return selectVal;
        },
      }));
  return (
    <ThemeProvider theme={theme}>
        <View style={[styles.dividerContent,{marginVertical:3}]}>
            <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignItems:'center'}}>                        
              <Text style={styles.labelPackage}>{name}</Text>
              <Text style={styles.dotLabel}>:</Text>
            </View>
                    {values !== undefined && (<SelectDropdown
                            buttonStyle={{flexBasis:1, flexGrow:1,maxHeight:25,borderRadius: 5, borderWidth:1, borderColor: '#ABABAB', backgroundColor:'white'}}
                            buttonTextStyle={{...styles.infoPackage,textAlign:'left',}}
                            data={values}
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
                            renderCustomizedRowChild={(item, index) => {
                              return (
                                <View style={{flex:1,paddingHorizontal:27, backgroundColor:selectVal === item ? '#e7e8f2' : 'transparent',paddingVertical:0,marginVertical:0, justifyContent:'center'}}>
                                  <Text style={{...Mixins.small1,fontWeight:'400',lineHeight:18, color:'#424141'}}>{item}</Text>
                                </View>
                              );
                            }}
                          />)}
        </View>
    </ThemeProvider>
  );
});

export default Manifest;