import React from 'react';
import {View} from 'react-native';
import {ThemeProvider,ThemeConsumer , Input, Text, CheckBox, LinearProgress, LinearProgressProps, Overlay} from 'react-native-elements';
import Mixins from '../../mixins';

const styles = {
   containerProgress : {
    backgroundColor:'transparent', width:'100%',borderWidth:0, borderColor:'transparent',shadowColor:"transparent",
   },
   wrapper : {
    marginVertical: 5,
   },
   headcontent : {
    marginBottom:10
   },
   headitem : {
    flex:1
   },
   itemtitle : {
    ...Mixins.body1,lineHeight:18, color:'white',
   },
};
const theme = {
 
};
interface Props extends LinearProgressProps {
  progressLinearVal: number;
  enabled : boolean;
}
const UploadProgress: React.FC<Props> = ({
    enabled,
    ...props
  }): React.ReactElement => {
    
  return (
    <ThemeProvider theme={theme}>
         <Overlay isVisible={enabled} fullScreen={false} overlayStyle={styles.containerProgress}>
            <View style={{...styles.wrapper,   flexDirection:'column',}}>
              <View style={{...styles.headcontent, flexDirection:'row'}}>
              <View style={{...styles.headitem, alignItems:'flex-start'}}>
                <Text style={styles.itemtitle}>Uploading</Text>
              </View>
              <View style={{...styles.headitem, alignItems:'flex-end'}}>
{props.value !== undefined && (              <Text style={styles.itemtitle}>{ (props.value * 100).toFixed(0) + '%'}</Text>)}
              </View>
              </View>
                <LinearProgress {...props}/>
            </View>
          </Overlay>
    </ThemeProvider>
  );
};

export default UploadProgress;