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
        paddingRight: 5,
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 5,
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
            <Text style={styles.labelPackage}>{props.name}</Text>
                        <Input 
                          containerStyle={{...styles.textInput,flexShrink: 1, maxHeight:30}}
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
