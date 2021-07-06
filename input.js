import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements';
// icons
import IconEye4 from './assets/icon/iconmonstr-eye-4 1mobile.svg';
import IconEye8 from './assets/icon/iconmonstr-eye-8 1mobile.svg';
import Mixins from './mixins';

const passwordToggleOnFocus = (initialState = false) => {
  const [show, toggle] = React.useState(initialState);
  
  const eventHandlers = React.useMemo(() => ({
    onPressIn: () => toggle(true),
    onPressOut: () => toggle(false),
  }), []);

  return [show, eventHandlers];
}

const LoginInput = ({
  label,
  onChangeText,
  onSubmitEditing,
  secureTextEntry,
  value,
  placeholder,
}) => {
  const [show, eventHandlers] = passwordToggleOnFocus();
  const [textEntry,setTextToggle] = React.useState((secureTextEntry ?? false));
  React.useLayoutEffect(()=>{
    if((secureTextEntry ?? false) !== false){
      if(show){
        setTextToggle(false);
      } else {
        setTextToggle(true);
      }
    }
  },[show]);
  return (
      <Input
      placeholder={placeholder}
      inputStyle={styles.inputStyle}
      inputContainerStyle={styles.containerInputStyle}
      labelStyle={styles.labelStyle}
      containerStyle={styles.containerStyle}
      rightIconContainerStyle={styles.rightIcon}
      leftIconContainerStyle={Mixins.lineInputDefaultLeftIcon}
        value={value}
        autoCorrect={false}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        secureTextEntry={textEntry}
        label={label}
        rightIcon={() => {
          if((secureTextEntry ?? false) !== false){
            return (
              <TouchableOpacity {...eventHandlers}>
                {show ? <IconEye4 height={25} width={25} fill='#ccc' /> : <IconEye8 height={25} width={25} fill='#ccc' />}
              </TouchableOpacity>

          );
          }
        }}
      />
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    flexShrink:1,
  },
  rightIcon: {
...Mixins.lineInputDefaultRightIcon,
position:'absolute',
right:10,
  },
  containerInputStyle:{
    ...Mixins.lineInputDefaultContainer,
    marginVertical: 0,
    maxHeight: 37,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },
  inputStyle: {
    ...Mixins.body1,
    ...Mixins.lineInputDefaultStyle,
    lineHeight: 21,
    textAlign: 'center',
    fontWeight: '400',
  },
  labelStyle: {
    ...Mixins.body1,
    ...Mixins.lineInputDefaultLabel,
    lineHeight: 23,
    alignSelf: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
    fontWeight: '400',
  },
};

export {LoginInput};
