import {IS_UNICODE} from './lang';
import {STRUCT, USER, ROUTE, DESTINATION} from './default';
import { offlineActionTypes } from 'react-native-offline';

const initialState = {
  todos: STRUCT,
  userRole: USER,
  photoProofPostpone: null,
  photoProofList: [],
  route: ROUTE,
  inboundList: [],
  outboundTask: [],
  outboundList: [],
  manifestList: [],
  // for prototype only
  currentPositionData: null,
  completedInboundList: [],
  currentDeliveringAddress: null,
  deliveryDestinationData: DESTINATION,
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
    backgroundlocationPermission: false,
    writeStoragePermission: false,
    isLoading: false,
    isGlobalLoading: false,
    isConnectedSelector: true,
    warehouse_module: '',
    currentASN : null,
    currentManifest : null,
    activeASN : [],
    completeASN :[],
    barcodeScanned: [],
    idScanned: null,
    ReportedASN: [],
    ReportedManifest: null,
    currentTask: null,
    activeTask : [],
    completeTask :[],
    ReportedTask: [],
    ReportedList: null,
    currentList: null,
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
          type: action.payload === 'demo' ? 'Warehouse' : action.payload === 'supervisor' ? 'Warehouse' : 'Delivery',
          id: 0,
          role: action.payload === 'supervisor' ? 'SPV': 'default' ,
          name: 'Nana',
        },
      };
      case 'logout':
        return {
          ...state,
          userRole: {
            ...state.userRole,
            type: false,
          },
        };
        
      case 'warehouseModule':
        return {
          ...state,
          filters: {
            ...state.filters,
            warehouse_module: action.payload,
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
          case 'backgroundlocationPermission':
            return {
              ...state,
              filters: {
                ...state.filters,
                backgroundlocationPermission: action.payload,
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
      case 'PhotoProofPostpone':
        return {
          ...state,
          photoProofPostpone: action.payload,
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
    case 'setASN':
      return {
        ...state,
        filters:{
          ...state.filters,
          currentASN: action.payload,
        },
      }
      case 'setCurrentManifest':
      return {
        ...state,
        filters:{
          ...state.filters,
          currentManifest: action.payload,
        },
      }
    case 'addActiveASN':
      return {
        ...state,
        filters: {
          ...state.filters,
          activeASN : [
            ...state.filters.activeASN,
            action.payload,
          ],
        },
      }
      case 'addCompleteASN':
      return {
        ...state,
        filters: {
          ...state.filters,
          completeASN : [
            ...state.filters.completeASN,
            action.payload,
          ],
        },
      }

      case 'setTask':
        return {
          ...state,
          filters:{
            ...state.filters,
            currentTask: action.payload,
          },
        }
        case 'setCurrentList':
        return {
          ...state,
          filters:{
            ...state.filters,
            currentList: action.payload,
          },
        }
      case 'addActiveTask':
        return {
          ...state,
          filters: {
            ...state.filters,
            activeTask : [
              ...state.filters.activeTask,
              action.payload,
            ],
          },
        }
        case 'addCompleteTask':
        return {
          ...state,
          filters: {
            ...state.filters,
            completeTask : [
              ...state.filters.completeTask,
              action.payload,
            ],
          },
        }
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
          },
          deliveryDestinationData: {
            ...initialState.deliveryDestinationData,
          },
          currentDeliveringAddress: initialState.currentDeliveringAddress,
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
        case 'OutboundTask':
        return {
          ...state,
          outboundTask: action.payload
        }
        case 'OutboundList':
        return {
          ...state,
          outboundList: action.payload
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
          filters: {
            ...state.filters,
            barcodeScanned: action.payload,
          },
        };
        case 'ListIDScanned':
        return {
          ...state,
          filters: {
            ...state.filters,
            idScanned: action.payload,
          },
        };
        case 'ReportedManifest':
          return {
            ...state,
            filters: {
              ...state.filters,
              ReportedManifest: action.payload,
            },
          };
          case 'ReportedASN':
            return {
              ...state,
              filters: {
                ...state.filters,
                ReportedASN: [
                  ...state.filters.ReportedASN,
                  action.payload,
                ],
              },
            };
            case 'ReportedList':
              return {
                ...state,
                filters: {
                  ...state.filters,
                  ReportedList: action.payload,
                },
              };
              case 'ReportedTask':
                return {
                  ...state,
                  filters: {
                    ...state.filters,
                    ReportedTask: [
                      ...state.filters.ReportedTask,
                      action.payload,
                    ],
                  },
                };
        case 'fromBarcode':
          return {
            ...state,
            barcodeScanned: [
              ...state.barcodeScanned,
              action.payload,
            ],
          };
          case 'CurrentPositionData':
            return {
              ...state,
              currentPositionData: action.payload,
            };
          case 'DeliveryDestinationData':
            if (action.payload === null) {
              return {
                ...state,
                deliveryDestinationData: initialState.deliveryDestinationData,
              };
            } else {
              let statIndex = state.route.dataPackage.findIndex(
                (o) =>
                  o.coords.lat === action.payload.destinationCoords.latitude &&
                  o.coords.lng === action.payload.destinationCoords.longitude,
              );
             // state.route.statAPI[statIndex] = action.payload.statAPI;
              return {
                ...state,
                deliveryDestinationData: {
                  ...action.payload,
                },
                route: {
                  ...state.route,
                  steps: {
                    ...state.route.steps,
                  //  [action.payload.destinationid]: action.payload.steps,
                  },
                  statsAPI: {
                    ...state.route.statsAPI,
                    [state.route.id]: {
                      ...state.route.statsAPI[state.route.id],
                     // [statIndex]: action.payload.statAPI,
                    },
                  },
                  //statAPI: [...state.route.statAPI],
                },
              };
            }
          case 'CurrentDeliveringAddress':
            return {
              ...state,
              currentDeliveringAddress: action.payload,
            };
      // end
      // Do something here based on the different types of actions
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}
