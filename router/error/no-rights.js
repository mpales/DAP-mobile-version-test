import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
  Text,
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native';

import Mixins from '../../mixins';
import {checkInternetConnection} from 'react-native-offline'
import {SERVER_DOMAIN} from '../../constant/server'
import {navigationRef} from '../../component/helper/persist-login'
import RNExitApp from 'react-native-exit-app';
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  HandleServerRespond = async ()=>{
    RNExitApp.exitApp();
  }
  render() {
    return (
      <View style={{...StyleSheet.absoluteFill, backgroundColor:'#121C78'}}>
        <View style={{justifyContent:'center', flexDirection:'column', alignItems:'center', flexGrow:1, paddingHorizontal:40}}>
        <Image
            source={require('../../assets/dap_logo_hires1large.png')}
            style={{width: 200, height: 100}}
            resizeMode="contain"
          />
         <Text style={styles.noDeliveryText}>
        Looks like a bug, we are still in Development! 
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={this.HandleServerRespond}>
          <Text style={styles.refreshButtonText}>Close</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  noDeliveryText: {
    ...Mixins.subtitle3,
    color:'white',
    lineHeight: 15,
    marginVertical: 20,
  },
  refreshButton: {
    width: '100%',
    marginHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F07120',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    ...Mixins.subtitle3,
    color: '#FFFFFF',
    fontSize: 20,
  },
})