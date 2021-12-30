import {self, Thread} from 'react-native-threads';
import crossFetch from 'cross-fetch';
// import RNFetchBlob from 'react-native-blob-util';
import {SERVER_DOMAIN} from '../constant/server';
import fetchDefaults from '../component/helper/network-mixins';
import fetchBlobDefault from '../component/helper/network-blob-util-mixins';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
var assign = require('oolong').assign;

export const applyWorker = () => {
  let subscriptions = [];
  let persist = true;
  let hydrated = false;
  let workerpath =
    process.env.NODE_ENV === 'development'
      ? '../../rnWorker.js'
      : 'rnWorker.js';

  let worker = new Thread(workerpath);

  const applyWatchUploadEnhancher = () => {
    return (createStore) => (reducer, initialState, enhancer) => {
      // // New reducer for workified store
      let replacementReducerOffline = (state, action) => {
        if (action.state) {
          if (persist === true) {
            subscriptions =
              action.state.originReducer.persistUploadSubscriptions;
          } else if (persist === false) {
            action.state.originReducer.persistUploadSubscriptions =
              subscriptions;
          }
          return action.state;
        }
        return state;
      };
      // Create store using new reducer
      let store = createStore(
        replacementReducerOffline,
        reducer({}, {}),
        enhancer,
      );
      // // Store reference of old dispatcher
      let next = store.dispatch;

      // // Replace dispatcher
      store.dispatch = async (action) => {
        if (action.type === 'logout' || action.type === 'DeviceSignature') {
          persist = false;
        } else if (
          action.type === 'persist/REHYDRATE' &&
          persist === false &&
          hydrated === false
        ) {
          // when memory not exhausted during restart apps - need to restart worker

          await worker.terminate();
          worker = await new Thread(workerpath);
          hydrated = true;
          persist = null;
        } else if (
          action.type !== undefined &&
          action.type !== 'persist/PERSIST' &&
          action.type !== 'persist/REHYDRATE' &&
          action.type !== '@@network-connectivity/CONNECTION_CHANGE' &&
          action.type !== 'resetLogin' &&
          action.type !== 'loggedIn' &&
          persist === false &&
          hydrated === true
        ) {
          // setback to false when already skip initial redux
          hydrated = false;
          initFetchFromHydrated();
        }
        return next({
          type: action.type,
          state: reducer(store.getState(), action),
        });
      };

      return store;
    };
  };
  const clearSubs = (watchID) => {
    const sub = subscriptions[watchID];

    if (!sub || sub === null) {
      // Silently exit when the watchID is invalid or already cleared
      // This is consistent with timers
      return;
    }

    for (let i = 0; i <= watchID; i += 1) {
      subscriptions[i] = null;
    }

    let noWatchers = true;

    for (let ii = 0; ii < subscriptions.length; ii += 1) {
      if (subscriptions[ii] || subscriptions[ii] !== null) {
        noWatchers = false; // still valid subscriptions
      }
    }

    if (noWatchers) {
      return;
    }
    return noWatchers;
  };
  const initFetchFromHydrated = async () => {
    const currentPersist = persist;
    const currentSubscriptions = subscriptions;
    const watchID = currentSubscriptions.length;
    for (let index = 0; index < currentSubscriptions.length; index++) {
      if (
        currentSubscriptions[index] !== undefined &&
        currentSubscriptions[index] !== null
      ) {
        currentSubscriptions[index].persist =
          currentPersist === null ? true : currentPersist;
      }
    }

    worker.postMessage(JSON.stringify(currentSubscriptions));
    // Add worker events listener
    worker.onmessage = (e) => {
      if (clearSubs(watchID) === false) {
      } else {
        persist = false;
      }
    };
  };
  const applyBackgroundFetch = async (options = {}) => {
    const currentPersist = persist;
    const currentSubscriptions = subscriptions;
    const watchID = currentSubscriptions.length;
    for (let index = 0; index < currentSubscriptions.length; index++) {
      if (
        currentSubscriptions[index] !== undefined &&
        currentSubscriptions[index] !== null
      ) {
        currentSubscriptions[index].persist =
          currentPersist === null ? true : currentPersist;
      }
    }

    currentSubscriptions.push(options);
    worker.postMessage(JSON.stringify(currentSubscriptions));
    // Add worker events listener
    worker.onmessage = (e) => {
      console.log('after trigger', watchID);

      if (clearSubs(watchID) === false) {
      } else {
        persist = false;
      }
    };
    return watchID;
  };
  return assign(
    worker,
    Object.create({clearSubs, applyBackgroundFetch, applyWatchUploadEnhancher}),
  );
};

export const createWorker = () => {
  let worker = new NetworkWorker();
  // ReactNativeForegroundService.register();
  // ReactNativeForegroundService.startService();

  self.onmessage = async (e) => {
    const action = JSON.parse(e);
    await worker.addPendingTask(action);
    await worker.runTask();
    self.postMessage('done');
  };

  return worker;
};

class NetworkWorker {
  pendingTask = [];
  constructor() {
    // Taskrunners
    // Redux-specific variables
    this.runTask.bind(this);
  }
  addPendingTask = async (task) => {
    for (let index = 0; index < task.length; index++) {
      const element = task[index];
      if (this.pendingTask[index] === undefined) {
        this.pendingTask[index] = element;
      } else {
        this.pendingTask[index] = null;
      }
    }
  };

  runTask = async () => {
    let apiFetch = fetchDefaults(
      crossFetch,
      SERVER_DOMAIN,
      async (url, opt) => {
        return {
          headers: {
            'Content-Type': opt.headers['Content-Type'],
            'User-Agent': opt.headers['User-Agent'],
            fingerprint: opt.headers['fingerprint'],
            authToken: opt.headers['authToken'],
          },
        };
      },
    );

    let blobFetch = fetchBlobDefault(
      RNFetchBlob,
      SERVER_DOMAIN,
      async (url, opt, data) => {
        return {
          'Content-Type': opt['Content-Type'],
          'User-Agent': opt['User-Agent'],
          fingerprint: opt['fingerprint'],
          authToken: opt['authToken'],
        };
      },
    );

    const currentTask = this.pendingTask;
    for (let index = 0; index < currentTask.length; index++) {
      if (currentTask[index] !== null) {
        let result = null;
        const {url, ...element} = currentTask[index];
        const {data, ...headers} = element;

        if (
          element !== null &&
          !element === false &&
          element.headers !== undefined
        ) {
          result = await apiFetch(url, {
            ...element,
          });
          if (
            result.status === 200 ||
            result.status === 401 ||
            result.status === 400 ||
            result.status === 403
          ) {
            this.pendingTask[index] = null;
            ReactNativeForegroundService.update({
              id: 155 + index,
              title: 'Upload being sync to server',
              message:
                'Your action has been saved to server by background process',
              importance: 'default',
              mainOnPress: async () => {},
            });
          } else {
            this.pendingTask[index] = null;
            ReactNativeForegroundService.update({
              id: 155 + index,
              title: 'Upload Fail to server',
              message: 'Your action fail to be saved by background process',
              importance: 'default',
              mainOnPress: async () => {},
            });
          }
        } else if (element !== null && !element === false) {
          result = await blobFetch(
            url,
            {
              ...headers,
            },
            data,
            (written, total) => {
              let progressval = ((100 / total) * written).toFixed(0);

              ReactNativeForegroundService.update({
                id: 155 + index,
                title: 'Upload being sync to server',
                message: 'Your action is in progress',
                importance: 'default',
                progress: true,
                ongoing: true,
                progressval: progressval,
                mainOnPress: async () => {},
              });
            },
          );
          if (result.respInfo.status === 200) {
            ReactNativeForegroundService.update({
              id: 155 + index,
              title: 'Upload being sync to server',
              message:
                'Your action has been saved to server by background process',
              importance: 'default',
              progress: false,
              ongoing: false,
              mainOnPress: async () => {},
            });
            this.pendingTask[index] = null;
          } else {
            this.pendingTask[index] = null;
            ReactNativeForegroundService.update({
              id: 155 + index,
              title: 'Upload Fail to server',
              message: 'Your action fail to be saved by background process',
              importance: 'default',
              progress: false,
              ongoing: false,
              mainOnPress: async () => {},
            });
          }
        }
      }
    }
  };
}
