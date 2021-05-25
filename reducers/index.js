import {IS_UNICODE} from './lang';
import {STRUCT, USER, ROUTE} from './default';
import { offlineActionTypes } from 'react-native-offline';

const initialState = {
  todos: STRUCT,
  userRole: USER,
  photoProofList: [],
  route: ROUTE,
  inboundList: [],
  manifestList: [],
  // for prototype only
  completedInboundList: [],
  barcodeScanned: [],
  // end
  filters: {
    status: IS_UNICODE,
    colors: [],
    isPhotoProofSubmitted: false,
    isSignatureSubmitted: false,
    imageConfirmationData: null,
    bottomBar : true,
    onStartDelivered : false,
    isDrawer : false,
    manifestCompleted: false,
    isFiltered : 0,
    isBarcodeScan: true,
    isTraffic : true,
    indexBottomBar: 0,
    keyBottomBar: '',
    indexStack: 0,
    keyStack: '',
    locationPermission: false,
    cameraPermission: false,
    readStoragePermission: false,
    writeStoragePermission: false,
    isLoading: false,
    isGlobalLoading: false,
    isConnectedSelector: true,
  },
};

// Use the initialState as a default value
export default function appReducer(state = initialState, action) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    case offlineActionTypes.CONNECTION_CHANGE : 
    if(action.payload === false){
      if(Object.keys(state.route.routes).length === 0){
        return {
          ...state,
          route :{
          ...state.route,
          steps:[[0,0],[0,0]],
          markers:[[0,0],[0,0]],
          orders: [[0,0],[0,0]],
        },
        filters: {
          ...state.filters,
          isConnectedSelector: action.payload,
        },
      };
    } else {
      return {
        ...state,
        route:{
          ...state.route,
          routes : {
            ...state.route.routes,
          },
        },
        filters: {
          ...state.filters,
          isConnectedSelector: action.payload,
        },
      };
    }
    } else {
      return {
        ...state,
        filters: {
          ...state.filters,
          isConnectedSelector: action.payload,
        },
      };
    }
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
      case 'cameraPermission':
        return {
          ...state,
          filters: {
            ...state.filters,
            cameraPermission: action.payload,
          },
        };
        case 'locationPermission':
          return {
            ...state,
            filters: {
              ...state.filters,
              locationPermission: action.payload,
            },
          };
          case 'readStoragePermission':
            return {
              ...state,
              filters: {
                ...state.filters,
                readStoragePermission: action.payload,
              },
            };
            case 'writeStoragePermission':
              return {
                ...state,
                filters: {
                  ...state.filters,
                  writeStoragePermission: action.payload,
                },
              };
      case 'indexBottom':
        return {
          ...state,
          filters: {
            ...state.filters,
            indexBottomBar: action.payload,
          },
        };
        case 'keyBottom':
          return {
            ...state,
            filters: {
              ...state.filters,
              keyBottomBar: action.payload,
            },
          };
          case 'indexStack':
            return {
              ...state,
              filters: {
                ...state.filters,
                indexStack: action.payload,
              },
            };
            case 'keyStack':
              console.log('current stack: '+ action.payload);
              return {
                ...state,
                filters: {
                  ...state.filters,
                  keyStack: action.payload,
                },
              };
    case 'PhotoProofList':
      return {
        ...state,
        photoProofList: action.payload,
      };
    case 'PhotoProof':
      return {
        ...state,
        filters: {
          ...state.filters,
          isPhotoProofSubmitted: action.payload,
        },
      };
    case 'ImageConfirmation': 
      return {
        ...state,
        imageConfirmationData: action.payload,
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
      console.log('bottomBar' + action.payload);
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
    case 'DirectionsPoint':
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
            statsAPI : {
              ...state.route.statsAPI,
              [action.payload.uuid]: action.payload.statsAPI,
            },
            statAPI : action.payload.statsAPI, 
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
      case 'RouteData':
        return {
          ...state,
          route:{
            ...state.route,
            dataPackage : action.payload, 
          }
        };
    case 'ManifestCompleted':
      return {
        ...state,
        filters: {
          ...state.filters,
          manifestCompleted: action.payload,
        },
      };
    case 'ScannerActive':
      return {
        ...state,
        filters: {
          ...state.filters,
          isBarcodeScan: action.payload,
        },
      };
    case 'TrafficToggle':
      return {
        ...state,
        filters: {
          ...state.filters,
          isTraffic: action.payload,
        },
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
      case 'Loading':
        return {
          ...state,
          filters: {
            ...state.filters,
            isLoading: action.payload,
          },
        };
      case 'InboundList':
        return {
          ...state,
          inboundList: action.payload
        }
      case 'ManifestList':
        return {
          ...state,
          manifestList: action.payload,
        }
      // for prototype only
      case 'BarcodeScanned':
        return {
          ...state,
          barcodeScanned: action.payload,
        };
        case 'fromBarcode':
          return {
            ...state,
            barcodeScanned: [
              ...state.barcodeScanned,
              action.payload,
            ],
          };
      // end
      // Do something here based on the different types of actions
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}
