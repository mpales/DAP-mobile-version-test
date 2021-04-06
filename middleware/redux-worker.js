import {self, Thread} from 'react-native-threads';

const defer = function () {
  let result = {};
  result.promise = new Promise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

export const applyWorker = (worker) => {
  return (createStore) => (reducer, initialState, enhancer) => {
    if (!(worker instanceof Thread)) {
      console.error(
        'Expect input to be a Web Worker. Fall back to normal store.',
      );
      return createStore(reducer, initialState, enhancer);
    }

    // New reducer for workified store
    let replacementReducer = (state, action) => {
      if (action.state) {
        return action.state;
      }
      return state;
    };

    // Start task id;
    let taskId = 0;
    let taskCompleteCallbacks = {};

    // Create store using new reducer
    let store = createStore(reducer, initialState, enhancer);

    // Store reference of old dispatcher
    let next = store.dispatch;

    // Replace dispatcher
    store.dispatch = (action) => {
      if (typeof action.type === 'string') {
        return next(action);
      }

      if (typeof action.task === 'string') {
        let task = Object.assign({}, action, {_taskId: taskId});
        let deferred = defer();

        taskCompleteCallbacks[taskId] = deferred;
        taskId++;
        worker.postMessage(JSON.stringify(task));
        return deferred.promise;
      }
    };

    store.isWorker = true;

    // Add worker events listener
    worker.onmessage = (e) => {
      e = JSON.parse(e);
      let action = e;
      if (typeof action.type === 'string') {
        next(action);
      }

      if (typeof action._taskId === 'number') {
        let wrapped = taskCompleteCallbacks[action._taskId];

        if (wrapped) {
          wrapped.resolve(action);
          delete taskCompleteCallbacks[action._taskId];
        }
      }
    };

    return store;
  };
};

export const createWorker = (reducer) => {
  // Initialize ReduxWorekr
  let worker = new ReduxWorker();
  //worker.pool = workerpool.pool({maxWorkers: 7,workerType: 'auto',maxQueueSize:5});
  //maxQueueSize attribute can be locking technique
  self.onmessage = (e) => {
    e = JSON.parse(e);
    var action = e;

    if (typeof action.type === 'string') {
      if (!worker.reducer || typeof worker.reducer !== 'function') {
        throw new Error(
          'Expect reducer to be function. Have you registerReducer yet?',
        );
      }

      // Set new state
      let state = worker.state;
      state = worker.state = worker.reducer(state, action);
      state = worker.transform(state);

      // Send new state to main thread
      self.postMessage(
        JSON.stringify({
          type: action.type,
          state: state,
          action: action,
        }),
      );

      return;
    }

    if (typeof action.task === 'string' && typeof action._taskId === 'number') {
      let taskRunner = worker.tasks[action.task];

      if (!taskRunner || typeof taskRunner !== 'function') {
        throw new Error(
          'Cannot find runner for task ' +
            action.task +
            '. Have you registerTask yet?',
        );
      }

      // Send new state to main thread
      self.postMessage(
        JSON.stringify({
          _taskId: action._taskId,
          response: taskRunner(action),
        }),
      );
    }
  };

  //worker.destroy = () => {
  //self.removeEventListener('message', messageHandler);
  //};

  return worker;
};

class ReduxWorker {
  constructor() {
    // Taskrunners
    this.tasks = {};

    // Redux-specific variables
    this.state = {};
    this.reducer = null;
    this.transform = function (state) {
      return state;
    };
  }

  registerReducer(reducer, transform) {
    this.reducer = reducer;
    this.state = reducer({}, {});
  }

  registerTask(name, taskFn) {
    this.tasks[name] = taskFn;
  }
}
