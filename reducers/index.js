import {IS_UNICODE} from './lang';
import {STRUCT,USER} from './default';
const initialState = {
  todos: STRUCT,
  userRole: USER,
  filters: {
    status: IS_UNICODE,
    colors: [],
  },
};

// Use the initialState as a default value
export default function appReducer(state = initialState, action) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    case 'todos':
      console.log(action);
      return {
        // that has all the existing state data
        ...state,
        // but has a new array for the `todos` field
        todos:
          // with all of the old todos
          // and the new todo object
          {
            // Use an auto-incrementing numeric ID for this example
            id: 1,
            name: action.payload,
            other: 'yes',
          },
      };
    case 'DECREMENT':
      return {
        ...state,
        todos: {
          // Use an auto-incrementing numeric ID for this example
          id: 1,
          name: 'stuff-trigger',
          other: 'yes',
        },
      };
    // Do something here based on the different types of actions
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}
