import React from 'react';
import {View, Dimensions, TouchableOpacity} from 'react-native';
import {ThemeProvider,Tooltip , Input, Text, CheckBox, LinearProgress, LinearProgressProps} from 'react-native-elements';
import Mixins from '../../mixins';

const styles = {
   containerProgress : {
    backgroundColor:'transparent', 
    width:'100%',
    borderWidth:0, 
    borderColor:'transparent',
    shadowColor:"transparent",
   },
   wrapper : {
    width:'100%',
    marginVertical: 0,
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
  overlayLinearProgress : LinearProgressProps
}
const UploadProgress: React.FC<Props> = ({
    enabled,
    overlayLinearProgress,
    ...props
  }): React.ReactElement => {
    const [_stateTooltip, setTooltipContainer] = React.useState<boolean>(false);
    const tooltipRef = React.useRef(null);
    React.useEffect(() => {
      if(enabled === true && _stateTooltip === false){
        tooltipRef.current.toggleTooltip();
      }
    }, [enabled]);
    React.useEffect(() => {
      if(enabled === false && _stateTooltip === true){
        tooltipRef.current.toggleTooltip();
      }
    }, [_stateTooltip,enabled]);
    const toggleHandler = React.useCallback(()=>{
      if(enabled === true){
        tooltipRef.current.toggleTooltip();
      }
    },[enabled,tooltipRef]);
  return (
         <Tooltip 
         ref={tooltipRef}
         withPointer={false} 
         backgroundColor="transparent"
         overlayColor="rgba(175, 175, 175, 0.70)"
         skipAndroidStatusBar ={true}  
         width={(Dimensions.get('screen').width) * 0.90} 
         height={100}
         containerStyle={{
          left: (Dimensions.get('screen').width) * 0.05,
          top: (Dimensions.get('screen').height / 2) -100,
          }}
          onClose={()=>setTooltipContainer(false)}
          onOpen={()=> setTooltipContainer(true)}
          highlightColor="rgba(175, 175, 175, 1)"
          toggleOnPress={false}
         popover={ <View style={{...styles.wrapper,   flexDirection:'column',}}>
         <View style={{...styles.headcontent, flexDirection:'row'}}>
         <View style={{...styles.headitem, alignItems:'flex-start'}}>
           <Text style={styles.itemtitle}>Uploading</Text>
         </View>
         <View style={{...styles.headitem, alignItems:'flex-end'}}>
{props.value !== undefined && (              <Text style={styles.itemtitle}>{ (props.value * 100).toFixed(0) + '%'}</Text>)}
         </View>
         </View>
        
           <LinearProgress {...overlayLinearProgress}/>
       </View>}>
       <TouchableOpacity onPress={toggleHandler}>
       <LinearProgress {...props} color="primary"/>
       </TouchableOpacity>
    </Tooltip>
  );
};

export default UploadProgress;