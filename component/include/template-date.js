import React from 'react';
import {View, Platform} from 'react-native';
import {ThemeProvider, Input, Text, Overlay} from 'react-native-elements';
import Mixins from '../../mixins';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
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
      dateInfo: {
        ...Mixins.small1,
        color: '#424141',
        fontWeight: '400',
        lineHeight: 18,
        paddingHorizontal:7,
        textAlignVertical: 'center',
      },
};
const theme = {
 
};

const Manifest = React.forwardRef((props, ref) => {
    const [filterDate, setFilteredDate] = React.useState("");
    const [ISODateString, setISODate] = React.useState(null);
    const [overlayDate, setOverlayDate] = React.useState(false);
    const toggleOverlay = React.useCallback((bool)=>{
      if (bool && ISODateString === null && Platform.OS === 'ios') {
        let stringdate = moment().format('DD/MM/YYYY');
        setFilteredDate(stringdate);
        setISODate(new Date());
      }
      setOverlayDate(bool !== undefined ? bool : false);
    });
    const changedDateTimePicker = React.useCallback((event, selectedDate)=>{
      toggleOverlay(false);
      if (event.type === 'neutralButtonPressed' || event === 'iOSClearDate') {
        setFilteredDate('');
        setISODate(null);
      } else {
        if (selectedDate !== undefined) {
          let stringdate = moment('' + selectedDate).format('DD/MM/YYYY');
          setFilteredDate(stringdate);
          setISODate(selectedDate);
        }
      }
    });
    React.useImperativeHandle(ref, () => ({
        getSavedAttr :  () =>{
            if(filterDate === "" && props.required === 1){
                return {"error": "validation error in attributes : " + props.name}
            }
            return ISODateString;
        },
      }));
  return (
    <ThemeProvider theme={theme}>
      
      {Platform.OS === 'ios' ? (
                          <Overlay
                            isVisible={overlayDate}
                            onBackdropPress={toggleOverlay}
                            overlayStyle={{
                              backgroundColor: 'black',
                              paddingHorizontal: 15,
                              paddingHorizontal: 5,
                              borderWidth: 2,
                              borderRadius: 10,
                              borderColor: 'transparent',
                            }}>
                            <Text
                              style={{
                                ...Mixins.subtitle3,
                                paddingVertical: 20,
                                paddingHorizontal: 15,
                                color: 'white',
                              }}>
                              Pick a Date, please press bellow
                            </Text>
                            <DateTimePicker
                              testID="dateTimePicker"
                              value={
                                ISODateString
                                  ? new Date(ISODateString)
                                  : new Date()
                              }
                              mode="date"
                              is24Hour={true}
                              display="inline"
                              onChange={changedDateTimePicker}
                              style={{backgroundColor: 'black'}}
                            />
                            <TouchableOpacity
                              style={{alignSelf: 'left', alignItems: 'left'}}
                              onPress={() => changedDateTimePicker('iOSClearDate', null)}>
                              <Text
                                style={{
                                  ...Mixins.subtitle3,
                                  paddingHorizontal: 15,
                                  color: 'white',
                                }}>
                                Clear
                              </Text>
                            </TouchableOpacity>
                          </Overlay>
                        ) : (
                          <>
                            {overlayDate && (
                              <DateTimePicker
                                testID="dateTimePicker"
                                value={
                                  ISODateString
                                    ? new Date(ISODateString)
                                    : new Date()
                                }
                                mode="countdown"
                                is24Hour={true}
                                display="default"
                                onChange={changedDateTimePicker}
                                neutralButtonLabel="clear"
                              />
                            )}
                          </>
                        )}
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
                            showSoftInputOnFocus={false}
                            placeholder={filterDate}
                            onPressIn={() => {
                              toggleOverlay(true);
                            }}
                            renderErrorMessage={false}
                        />
                         <Text style={styles.dateInfo}>dd-MM-yy</Text>
        </View>
    </ThemeProvider>
  );
});

export default Manifest;
