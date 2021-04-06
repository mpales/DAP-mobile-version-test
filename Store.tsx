import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers/index';
// Note: this API requires redux@>=3.1.0
import thunk from 'redux-thunk';
import {applyWorker} from './middleware/redux-worker';
//import {Thread} from 'react-native-threads';


//const thread = new Thread('./rnWorker.js');
/* stop worker */
//worker.terminate();

// Apply worker middleware

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));
export default store;
