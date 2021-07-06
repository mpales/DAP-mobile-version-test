/**
 * @format
 */
//require('node-libs-react-native/globals');
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

if(Platform.OS ==='android'){
    // Register the service
    ReactNativeForegroundService.register();
}
AppRegistry.registerComponent(appName, () => App);
