import {IS_UNICODE} from './lang';
import {STRUCT, USER, ROUTE} from './default';
const initialState = {
  todos: STRUCT,
  userRole: USER,
  photoProofList: [],
  route: ROUTE,
  filters: {
    status: IS_UNICODE,
    colors: [],
    isPhotoProofSubmitted: false,
    isSignatureSubmitted: false,
    bottomBar : true,
    onStartDelivered : false,
    isDrawer : true,
    isFiltered : 0,
  },
};

// Use the initialState as a default value
export default function appReducer(state = initialState, action) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    case 'todos':
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
    case 'login':
      return {
        ...state,
        userRole: {
          type: action.payload === 'demo' ? 'Warehouse' : 'Delivery',
          id: 0,
          name: 'Nana',
        },
      };
    case 'PhotoProofList': {
      return {
        ...state,
        photoProofList: action.payload,
      };
    }
    case 'PhotoProof':
      return {
        ...state,
        filters: {
          ...state.filters,
          isPhotoProofSubmitted: action.payload,
        },
      };
    case 'Signature':
      return {
        ...state,
        filters: {
          ...state.filters,
          isSignatureSubmitted: action.payload,
        },
      };
    case 'BottomBar':
        return {
          ...state,
          filters: {
            ...state.filters,
            bottomBar: action.payload,
          },
        };
    case 'ToggleDrawer':
          return {
            ...state,
            filters: {
              ...state.filters,
              isDrawer: action.payload,
            },
    };
    case 'filtered_sort':
      return {
        ...state,
        filters: {
          ...state.filters,
          isFiltered: action.payload,
        },
  };
    case 'startDelivered':
      return {
        ...state,
        filters: {
          ...state.filters,
          onStartDelivered: action.payload,
        },
      };
      case 'GeoLocation':
        return {
          ...state,
          userRole: {
            ...state.userRole,
            location:action.payload.position
          },
        };
    case 'Directions':
    return {
        ...state,
        route:{
          ...state.route,
          id: action.payload.uuid, 
          markers: action.payload.markers,
          steps: action.payload.steps,
          orders: action.payload.markers,
          routes : {
            ...state.route.routes,
            [action.payload.uuid]: action.payload.steps,
          },
        }
      };
      case 'RouteStats':
        return {
          ...state,
          route:{
            ...state.route,
            stats : {
              ...state.route.stats,
              [action.payload.uuid]: action.payload.stats,
            },
            stat : action.payload.stats, 
          }
        };
    case 'MarkerOrdered':
        return {
          ...state,
          route:{
            ...state.route,
            id: state.route.routes.hasOwnProperty(action.payload.uuid) ? action.payload.uuid : state.route.id, //might be id of backend markers array
            orders: action.payload.orders,
            steps : state.route.routes.hasOwnProperty(action.payload.uuid) ? state.route.routes[action.payload.uuid] : false, 
            markers : action.payload.orders,
            stat :  state.route.stats.hasOwnProperty(action.payload.uuid) ? state.route.stats[action.payload.uuid] : [],
          }
        };
      // Do something here based on the different types of actions
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}
