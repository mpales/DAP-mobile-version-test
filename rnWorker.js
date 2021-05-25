import reducer from './reducers';
import {createWorker} from './middleware/redux-worker';
import {self} from 'react-native-threads';
// Instantiate ReduxWorker
let worker = createWorker();

// Registering your reducer.
worker.registerReducer(reducer);

// Register tasks to be executable on web worker, if needed
worker.registerTask('NQUEEN_TASK', function (a) {
  let n = a.number;
  return +n < 16 ? n.length : 'N is too large...';
});