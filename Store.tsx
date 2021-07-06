import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import originReducer from './reducers/index';
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
import { reducer as network, createNetworkMiddleware, offlineActionCreators,  checkInternetConnection} from 'react-native-offline';
// Note: this API requires redux@>=3.1.0
import thunk from 'redux-thunk';
import {applyWorker} from './middleware/redux-worker';
import * as Direction from './action/direction';
import * as GeoLocation from './action/geolocation';
import * as ActionIndex from './action/index';
import FilesystemStorage from 'redux-persist-filesystem-storage'
import RNFetchBlob from 'rn-fetch-blob';
import { createFilter, createBlacklistFilter } from 'redux-persist-transform-filter';

import { Platform } from 'react-native';

// These are all the config options, with their default values
FilesystemStorage.config({
     storagePath: `${RNFetchBlob.fs.dirs.DocumentDir}/persistStore`,
     encoding: "utf8",
     toFileName: Platform.select({
      ios : (name:string)=> {
        let arr = name.split('/')
        const dirs = RNFetchBlob.fs.dirs
        let namewithpath = `${dirs.DocumentDir}/persistStore/${arr[arr.length - 1]}`
        return namewithpath.split(":").join("-")},
      android: (name:string)=> name.split(":").join("-"),
    }),
     fromFileName: Platform.select({
      ios : (name:string)=> {
        let arr = name.split('/')
        const dirs = RNFetchBlob.fs.dirs
        let namewithpath = `${dirs.DocumentDir}/persistStore/${arr[arr.length - 1]}`
        return namewithpath.split("-").join(":")},
      android: (name:string)=> name.split("-").join(":"),
    }),
});
//import {Thread} from 'react-native-threads';


//const thread = new Thread('./rnWorker.js');
/* stop worker */
//worker.terminate();

// We have to map our actions to an object for saving to persist in offline mode
const actions = {
    ...Direction,
    ...GeoLocation,
    ...ActionIndex,
  };

// Transform how the persistor reads the network state
const networkTransform = createTransform(
    (inboundState, key) => {
      const actionQueue = [];
  
      inboundState.actionQueue.forEach(action => {
        if (typeof action === 'function') {
          actionQueue.push({
            function: action.meta.name,
            args: action.meta.args,
          });
        } else if (typeof action === 'object') {
          actionQueue.push(action);
        }
      });
  
      return {
        ...inboundState,
        actionQueue,
      };
    },
    (outboundState, key) => {
      const actionQueue = [];
  
      outboundState.actionQueue.forEach(action => {
        if (action.function) {
          const actionFunction = actions[action.function];
          actionQueue.push(actionFunction(...action.args));
        } else {
          actionQueue.push(action);
        }
      });
  
      return { ...outboundState, actionQueue };
    },
    // The 'network' key may change depending on what you
    // named your network reducer.
    { whitelist: ['network'] },
  );

// Apply worker middleware
const networkMiddleware = createNetworkMiddleware({
    actionTypes: ['MarkerOrdered','Directions','RouteStats','DirectionsPoint'],
    queueReleaseThrottle: 200,
  });

const rootPersistConfig  = {
  key: 'originReducer',
  storage: AsyncStorage,
  blacklist: ['filters'],
  }

// you want to remove some keys before you save
const saveSubsetBlacklistFilter = createBlacklistFilter(
  'network',
  ['isConnected']
);

const networkPersistConfig = {
  key: 'network',
  storage: FilesystemStorage,
  toFileName: (name: string) => name.split(":").join("-"),
  fromFileName: (name: string) => name.split("-").join(":"),
  transforms: [networkTransform,saveSubsetBlacklistFilter], 
  blacklist: ['originReducer'],
}


const rootReducer = combineReducers({
  originReducer: persistReducer(rootPersistConfig, originReducer),
  network : network,
});

  
  const persistedReducer = persistReducer(networkPersistConfig, rootReducer)

export default function configureStore(callback) {
    const store = createStore(persistedReducer, applyMiddleware(networkMiddleware,thunk));
    const { connectionChange } = offlineActionCreators;
    // https://github.com/rt2zz/redux-persist#persiststorestore-config-callback
    const persistor = persistStore(store, null, () => {
      // After rehydration completes, we detect initial connection
      checkInternetConnection().then(isConnected => {
        store.dispatch(connectionChange(isConnected));
        callback(); // Notify our root component we are good to go, so that we can render our app
      });
    });
  
    return {store,persistor};
  }