import React from 'react';
import {TextInput, View, Text} from 'react-native';

const Input = ({label, onChangeText, placeholder, onSubmitEditing}) => {
  const {inputStyle, labelStyle, containerStyle} = styles;

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        autoCorrect={false}
        style={inputStyle}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    backgroundColor: '#FFFFFF',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 1,
    borderWidth: 0,
    borderRadius: 15,
    textAlign: 'center',
  },
  labelStyle: {
    fontSize: 18,
    flex: 1,
    lineHeight: 23,
    alignSelf: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: 10,
  },
};

export {Input};
