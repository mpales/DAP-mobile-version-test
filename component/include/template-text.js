import React from 'react';
import {View} from 'react-native';
import {ThemeProvider, Input, Text} from 'react-native-elements';
import Mixins from '../../mixins';


const styles = {
    dividerContent: {
        flexDirection: 'row',
        flexShrink: 1,
        marginVertical: 3,
      },
      labelPackage: {
        ...Mixins.small1,
        color: '#2D2C2C',
        fontWeight: '500',
        lineHeight: 18,
        width: 100,
        textAlignVertical: "center",
        paddingRight: 0,
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 5,
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
    const [textualVal, setCurrentText] = React.useState("");
    const handlechangeText = React.useCallback((val)=>{
        setCurrentText(val);
    });
    React.useImperativeHandle(ref, () => ({
        getSavedAttr :  () =>{
            if(textualVal === "" && props.required === 1){
                return {"error": "validation error in attributes : " + props.name}
            }
            return textualVal;
        },
      }));
  return (
    <ThemeProvider theme={theme}>
        <View style={[styles.dividerContent,{marginVertical:3}]}>
        <View style={{flexDirection:'row', flexShrink:1, justifyContent:'center',alignItems:'center'}}>                        
              <Text style={styles.labelPackage}>{props.name}</Text>
              <Text style={styles.dotLabel}>:</Text>
        </View>
        
                        <Input 
                          containerStyle={{...styles.textInput,flexGrow: 1, maxHeight:30, flexBasis:1}}
                          inputContainerStyle={{maxHeight:30, padding:0, margin:0, borderBottomColor: 'transparent'}} 
                            inputStyle={{...Mixins.containedInputDefaultStyle,marginHorizontal:0}}
                            labelStyle={Mixins.containedInputDefaultLabel}
                            value={textualVal}
                            onChangeText={handlechangeText}
                        />
        </View>
    </ThemeProvider>
  );
});

export default Manifest;
