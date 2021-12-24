import {IS_UNICODE} from './lang';
import {STRUCT, USER, ROUTE, DESTINATION} from './default';
import {offlineActionTypes} from 'react-native-offline';

const initialState = {
  todos: STRUCT,
  userRole: USER,
  photoProofPostpone: null,
  disposalPostpone: null,
  attributePhotoPostpone: null,
  receivingPhotoPostpone: null,
  photoReportPostpone: null,
  photoReportID: null,
  photoProofID: null,
  disposalProofID: null,
  attributeProofID: null,
  receivingProofID: null,
  photoProofList: [],
  stockTakeReportPhotoList: [],
  route: ROUTE,
  inboundList: [],
  gallery: {},
  VASList: [],
  inboundSPVList: [],
  putawayList: [],
  outboundTask: [],
  outboundList: [],
  manifestList: [],
  deviceSignature: null,
  jwtToken: null,
  recollectionPhotoList: [],
  recollectionSignatureData: null,
  recollectionSignatureBase64: '',
  // for prototype only
  currentPositionData: null,
  completedInboundList: [],
  currentDeliveringAddress: null,
  deliveryDestinationData: DESTINATION,
  persistUploadSubscriptions: [],
  // end
  filters: {
    POSMPostpone: null,
    status: IS_UNICODE,
    colors: [],
    isPhotoProofSubmitted: false,
    isStockTakeReportPhotoSubmitted: false,
    isRecollectionPhotoSubmitted: false,
    isSignatureSubmitted: false,
    imageConfirmationData: null,
    bottomBar: true,
    onStartDelivered: false,
    isDrawer: false,
    manifestCompleted: false,
    isFiltered: 0,
    isBarcodeScan: true,
    isTraffic: true,
    indexBottomBar: 0,
    keyBottomBar: '',
    indexStack: 0,
    keyStack: '',
    locationPermission: false,
    cameraPermission: false,
    audioPermission: false,
    readStoragePermission: false,
    backgroundlocationPermission: false,
    writeStoragePermission: false,
    isLoading: false,
    isGlobalLoading: false,
    isConnectedSelector: true,
    warehouse_module: '',
    currentASN: null,
    currentManifestType: null,
    currentManifest: null,
    activeASN: [],
    completeASN: [],
    barcodeScanned: [],
    barcodeGrade: null,
    idScanned: null,
    ReportedASN: [],
    ReportedManifest: null,
    currentTask: null,
    activeTask: [],
    completeTask: [],
    ReportedTask: [],
    ReportedList: null,
    currentList: null,
    currentIVAS: [],
    logged: false,
    activeVAS: [],
    completeVAS: [],
    ReportedVAS: [],
    ApplicationNavigational: null,
    stockTakeId: null,
    manifestError: null,
    taskError: null,
    taskSuccess: null,
    selectedRequestRelocation: null,
    selectedLocationId: null,
  },
};

// Use the initialState as a default value
export default function appReducer(state = initialState, action) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    case offlineActionTypes.CONNECTION_CHANGE:
      if (action.payload === false) {
        if (Object.keys(state.route.routes).length === 0) {
          return {
            ...state,
            route: {
              ...state.route,
              steps: [
                [0, 0],
                [0, 0],
              ],
              markers: [
                [0, 0],
                [0, 0],
              ],
              orders: [
                [0, 0],
                [0, 0],
              ],
            },
            filters: {
              ...state.filters,
              isConnectedSelector: action.payload,
            },
          };
        } else {
          return {
            ...state,
            route: {
              ...state.route,
              routes: {
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
          type: action.payload.type,
          id: action.payload.id,
          name: action.payload.name,
          role: action.payload.role,
          userRights: action.payload.userRights,
        },
      };
    case 'logout':
      return {
        ...state,
        userRole: initialState.userRole,
        jwtToken: initialState.jwtToken,
        persistUploadSubscriptions: initialState.persistUploadSubscriptions,
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
    case 'audioPermission':
      return {
        ...state,
        filters: {
          ...state.filters,
          audioPermission: action.payload,
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
      console.log('current stack: ' + action.payload);
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
    case 'StockTakeReportPhotoList':
      return {
        ...state,
        stockTakeReportPhotoList: action.payload,
      };
    case 'loadFromGallery':
      if (action.payload.gtype === 'report') {
        return {
          ...state,
          photoReportPostpone:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? state.gallery[action.payload.gID]
              : initialState.photoReportPostpone,
          photoReportID:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? action.payload.gID
              : initialState.photoReportID,
        };
      } else if (action.payload.gtype === 'proof') {
        return {
          ...state,
          photoProofPostpone:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? state.gallery[action.payload.gID]
              : initialState.photoProofPostpone,
          photoProofID:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? action.payload.gID
              : initialState.photoProofID,
        };
      } else if (action.payload.gtype === 'disposal') {
        return {
          ...state,
          disposalPostpone:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? state.gallery[action.payload.gID]
              : initialState.disposalPostpone,
          disposalProofID:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? action.payload.gID
              : initialState.disposalProofID,
        };
      } else if (action.payload.gtype === 'attribute') {
        return {
          ...state,
          attributePhotoPostpone:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? state.gallery[action.payload.gID]
              : initialState.attributePhotoPostpone,
          attributeProofID:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? action.payload.gID
              : initialState.attributeProofID,
        };
      } else if (action.payload.gtype === 'receiving') {
        return {
          ...state,
          receivingPhotoPostpone:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? state.gallery[action.payload.gID]
              : initialState.receivingPhotoPostpone,
          receivingProofID:
            Array.isArray(state.gallery[action.payload.gID]) === true
              ? action.payload.gID
              : initialState.receivingProofID,
        };
      }
    case 'PhotoProofPostpone':
      if (action.payload === null) {
        return {
          ...state,
          gallery:
            state.photoProofID !== null
              ? {
                  ...state.gallery,
                  [state.photoProofID]: initialState.photoProofPostpone,
                }
              : state.gallery,
          photoProofPostpone: initialState.photoProofPostpone,
          photoProofID: initialState.photoProofID,
        };
      } else if (Array.isArray(state.photoProofPostpone)) {
        return {
          ...state,
          photoProofPostpone: [...state.photoProofPostpone, action.payload],
          gallery:
            state.photoProofID !== null
              ? {
                  ...state.gallery,
                  [state.photoProofID]: [
                    ...state.photoProofPostpone,
                    action.payload,
                  ],
                }
              : state.gallery,
        };
      } else {
        return {
          ...state,
          photoProofPostpone: [action.payload],
          gallery:
            state.photoProofID !== null
              ? {
                  ...state.gallery,
                  [state.photoProofID]: [action.payload],
                }
              : state.gallery,
        };
      }
    case 'disposalPostpone':
      if (action.payload === null) {
        return {
          ...state,
          gallery:
            state.disposalProofID !== null
              ? {
                  ...state.gallery,
                  [state.disposalProofID]: initialState.disposalPostpone,
                }
              : state.gallery,
          disposalPostpone: initialState.disposalPostpone,
          disposalProofID: initialState.disposalProofID,
        };
      } else if (Array.isArray(state.disposalPostpone)) {
        return {
          ...state,
          disposalPostpone: [...state.disposalPostpone, action.payload],
          gallery:
            state.disposalProofID !== null
              ? {
                  ...state.gallery,
                  [state.disposalProofID]: [
                    ...state.disposalPostpone,
                    action.payload,
                  ],
                }
              : state.gallery,
        };
      } else {
        return {
          ...state,
          disposalPostpone: [action.payload],
          gallery:
            state.disposalProofID !== null
              ? {
                  ...state.gallery,
                  [state.disposalProofID]: [action.payload],
                }
              : state.gallery,
        };
      }
    case 'attributePostpone':
      if (action.payload === null) {
        return {
          ...state,
          gallery:
            state.attributeProofID !== null
              ? {
                  ...state.gallery,
                  [state.attributeProofID]: initialState.attributePhotoPostpone,
                }
              : state.gallery,
          attributePhotoPostpone: initialState.attributePhotoPostpone,
          attributeProofID: initialState.attributeProofID,
        };
      } else if (Array.isArray(state.attributePhotoPostpone)) {
        return {
          ...state,
          attributePhotoPostpone: [
            ...state.attributePhotoPostpone,
            action.payload,
          ],
          gallery:
            state.attributeProofID !== null
              ? {
                  ...state.gallery,
                  [state.attributeProofID]: [
                    ...state.attributePhotoPostpone,
                    action.payload,
                  ],
                }
              : state.gallery,
        };
      } else {
        return {
          ...state,
          attributePhotoPostpone: [action.payload],
          gallery:
            state.attributeProofID !== null
              ? {
                  ...state.gallery,
                  [state.attributeProofID]: [action.payload],
                }
              : state.gallery,
        };
      }
    case 'receivingPostpone':
      if (action.payload === null) {
        return {
          ...state,
          gallery:
            state.receivingProofID !== null
              ? {
                  ...state.gallery,
                  [state.receivingProofID]: initialState.receivingPhotoPostpone,
                }
              : state.gallery,
          receivingPhotoPostpone: initialState.receivingPhotoPostpone,
          receivingProofID: initialState.receivingProofID,
        };
      } else if (Array.isArray(state.receivingPhotoPostpone)) {
        return {
          ...state,
          receivingPhotoPostpone: [
            ...state.receivingPhotoPostpone,
            action.payload,
          ],
          gallery:
            state.receivingProofID !== null
              ? {
                  ...state.gallery,
                  [state.receivingProofID]: [
                    ...state.receivingPhotoPostpone,
                    action.payload,
                  ],
                }
              : state.gallery,
        };
      } else {
        return {
          ...state,
          receivingPhotoPostpone: [action.payload],
          gallery:
            state.receivingProofID !== null
              ? {
                  ...state.gallery,
                  [state.receivingProofID]: [action.payload],
                }
              : state.gallery,
        };
      }
    case 'PhotoReportPostpone':
      if (action.payload === null) {
        return {
          ...state,
          gallery:
            state.photoReportID !== null
              ? {
                  ...state.gallery,
                  [state.photoReportID]: initialState.photoReportPostpone,
                }
              : state.gallery,
          photoReportPostpone: initialState.photoReportPostpone,
          photoReportID: initialState.photoReportID,
        };
      } else if (Array.isArray(state.photoReportPostpone)) {
        return {
          ...state,
          photoReportPostpone: [...state.photoReportPostpone, action.payload],
          gallery:
            state.photoReportID !== null
              ? {
                  ...state.gallery,
                  [state.photoReportID]: [
                    ...state.photoReportPostpone,
                    action.payload,
                  ],
                }
              : state.gallery,
        };
      } else {
        return {
          ...state,
          photoReportPostpone: [action.payload],
          gallery:
            state.photoReportID !== null
              ? {
                  ...state.gallery,
                  [state.photoReportID]: [action.payload],
                }
              : state.gallery,
        };
      }
    case 'POSMPostpone':
      if (action.payload === null) {
        return {
          ...state,
          filters: {
            ...state.filters,
            POSMPostpone: initialState.filters.POSMPostpone,
          },
        };
      } else if (Array.isArray(state.filters.POSMPostpone)) {
        return {
          ...state,
          filters: {
            ...state.filters,
            POSMPostpone: [...state.filters.POSMPostpone, action.payload],
          },
        };
      } else {
        return {
          ...state,
          filters: {
            ...state.filters,
            POSMPostpone: [action.payload],
          },
        };
      }
    case 'PhotoReportUpdate':
      return {
        ...state,
        photoReportPostpone: action.payload,
        gallery:
          state.photoReportID !== null
            ? {
                ...state.gallery,
                [state.photoReportID]: action.payload,
              }
            : state.gallery,
      };
    case 'PhotoProofUpdate':
      return {
        ...state,
        photoProofPostpone: action.payload,
        gallery:
          state.photoProofID !== null
            ? {
                ...state.gallery,
                [state.photoProofID]: action.payload,
              }
            : state.gallery,
      };
    case 'AttributePhotoUpdate':
      return {
        ...state,
        attributePhotoPostpone: action.payload,
        gallery:
          state.attributeProofID !== null
            ? {
                ...state.gallery,
                [state.attributeProofID]: action.payload,
              }
            : state.gallery,
      };
    case 'ReceivingPhotoUpdate':
      return {
        ...state,
        receivingPhotoPostpone: action.payload,
        gallery:
          state.receivingProofID !== null
            ? {
                ...state.gallery,
                [state.receivingProofID]: action.payload,
              }
            : state.gallery,
      };
    case 'DisposalMediaUpdate':
      return {
        ...state,
        disposalPostpone: action.payload,
        gallery:
          state.disposalProofID !== null
            ? {
                ...state.gallery,
                [state.disposalProofID]: action.payload,
              }
            : state.gallery,
      };
    case 'POSMUpdate':
      return {
        ...state,
        filters: {
          ...state.filters,
          POSMPostpone: action.payload,
        },
      };
    case 'ManifestError':
      return {
        ...state,
        filters: {
          ...state.filters,
          manifestError: action.payload,
        },
      };
    case 'TaskError':
      return {
        ...state,
        filters: {
          ...state.filters,
          taskError: action.payload,
        },
      };
    case 'TaskSuccess':
      return {
        ...state,
        filters: {
          ...state.filters,
          taskSuccess: action.payload,
        },
      };
    case 'addPhotoProofID':
      return {
        ...state,
        photoProofID: action.payload,
      };
    case 'addAttributePhotoID':
      return {
        ...state,
        attributeProofID: action.payload,
      };
    case 'addReceivingPhotoID':
      return {
        ...state,
        receivingProofID: action.payload,
      };
    case 'addDisposalProofID':
      return {
        ...state,
        disposalProofID: action.payload,
      };
    case 'addPhotoReportID':
      return {
        ...state,
        photoReportID: action.payload,
      };
    case 'PhotoProof':
      return {
        ...state,
        filters: {
          ...state.filters,
          isPhotoProofSubmitted: action.payload,
        },
      };
    case 'StockTakeReportPhotoSubmitted':
      return {
        ...state,
        filters: {
          ...state.filters,
          isStockTakeReportPhotoSubmitted: action.payload,
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
        filters: {
          ...state.filters,
          currentASN: action.payload,
          currentIVAS: initialState.filters.currentIVAS,
        },
      };
    case 'setManifestType':
      return {
        ...state,
        filters: {
          ...state.filters,
          currentManifestType: action.payload,
        },
      };
    case 'setCurrentManifest':
      return {
        ...state,
        filters: {
          ...state.filters,
          currentManifest: action.payload,
        },
      };
    case 'addActiveASN':
      return {
        ...state,
        filters: {
          ...state.filters,
          activeASN: [...state.filters.activeASN, action.payload],
        },
      };
    case 'addCompleteASN':
      return {
        ...state,
        filters: {
          ...state.filters,
          completeASN: [...state.filters.completeASN, action.payload],
        },
      };

    case 'setTask':
      return {
        ...state,
        filters: {
          ...state.filters,
          currentTask: action.payload,
        },
      };
    case 'setCurrentList':
      return {
        ...state,
        filters: {
          ...state.filters,
          currentList: action.payload,
        },
      };
    case 'addActiveTask':
      return {
        ...state,
        filters: {
          ...state.filters,
          activeTask: [...state.filters.activeTask, action.payload],
        },
      };
    case 'addCompleteTask':
      return {
        ...state,
        filters: {
          ...state.filters,
          completeTask: [...state.filters.completeTask, action.payload],
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
          location: action.payload.position,
        },
      };
    case 'Directions':
      return {
        ...state,
        route: {
          ...state.route,
          id: action.payload.uuid,
          markers: action.payload.markers,
          steps: action.payload.steps,
          orders: action.payload.markers,
          routes: {
            ...state.route.routes,
            [action.payload.uuid]: action.payload.steps,
          },
        },
      };

    case 'UpdateDirectionsPoint':
      let savedmarkers = [];
      let savedstatsAPI = [];
      let savedstepsuuid = [];
      let savedsteps = {};
      for (let index = 0; index < action.payload.stepsuuid.length; index++) {
        const UUID = action.payload.stepsuuid[index];
        if (UUID === null) {
          let fileteredUUID = action.payload.markers[index];
          let savedstepsUUIDIndex = state.route.stepsuuid.findIndex(
            (o) => o === fileteredUUID,
          );
          savedmarkers[index] = state.route.markers[savedstepsUUIDIndex];
          savedstatsAPI[index] = state.route.statAPI[savedstepsUUIDIndex];
          savedsteps[fileteredUUID] = state.route.steps[fileteredUUID];
          savedstepsuuid[index] = state.route.stepsuuid[savedstepsUUIDIndex];
        } else {
          savedmarkers[index] = action.payload.markers[index];
          savedstatsAPI[index] = action.payload.statsAPI[index];
          savedsteps[UUID] = action.payload.steps[UUID];
          savedstepsuuid[index] = UUID;
        }
      }
      return {
        ...state,
        route: {
          ...state.route,
          id: action.payload.uuid,
          markers: savedmarkers,
          steps: savedsteps,
          stepsuuid: savedstepsuuid,
          orders: savedmarkers,
          routes: {
            ...state.route.routes,
            [action.payload.uuid]: savedsteps,
          },
          statsAPI: {
            ...state.route.statsAPI,
            [action.payload.uuid]: savedstatsAPI,
          },
          statAPI: savedstatsAPI,
        },
        currentDeliveringAddress:
          state.deliveryDestinationData.destinationid !== null &&
          action.payload.stepsuuid.includes(
            state.deliveryDestinationData.destinationid,
          ) &&
          state.currentDeliveringAddress !== null
            ? savedstepsuuid.findIndex(
                (o) => o === state.deliveryDestinationData.destinationid,
              ) === state.currentDeliveringAddress
              ? state.currentDeliveringAddress
              : savedstepsuuid.findIndex(
                  (o) => o === state.deliveryDestinationData.destinationid,
                )
            : state.route.dataPackage.findIndex(
                (o) => o.deliveryStatus === 'On Delivery',
              ) !== -1
            ? state.route.dataPackage.findIndex(
                (o) => o.deliveryStatus === 'On Delivery',
              )
            : initialState.currentDeliveringAddress,
        deliveryDestinationData:
          state.deliveryDestinationData.destinationid !== null &&
          savedstepsuuid.includes(state.deliveryDestinationData.destinationid)
            ? state.deliveryDestinationData
            : initialState.deliveryDestinationData,
        filters: {
          ...state.filters,
          isGetDirectionWithApiLoaded: true,
        },
      };

    case 'DirectionsPoint':
      return {
        ...state,
        route: {
          ...state.route,
          id: action.payload.uuid,
          markers: action.payload.markers,
          steps: action.payload.steps,
          stepsuuid: action.payload.stepsuuid,
          orders: action.payload.markers,
          routes: {
            ...state.route.routes,
            [action.payload.uuid]: action.payload.steps,
          },
          statsAPI: {
            ...state.route.statsAPI,
            [action.payload.uuid]: action.payload.statsAPI,
          },
          statAPI: action.payload.statsAPI,
        },
        currentDeliveringAddress:
          state.deliveryDestinationData.destinationid !== null &&
          action.payload.stepsuuid.includes(
            state.deliveryDestinationData.destinationid,
          ) &&
          state.currentDeliveringAddress !== null
            ? action.payload.stepsuuid.findIndex(
                (o) => o === state.deliveryDestinationData.destinationid,
              ) === state.currentDeliveringAddress
              ? state.currentDeliveringAddress
              : action.payload.stepsuuid.findIndex(
                  (o) => o === state.deliveryDestinationData.destinationid,
                )
            : state.route.dataPackage.findIndex(
                (o) => o.deliveryStatus === 'On Delivery',
              ) !== -1
            ? state.route.dataPackage.findIndex(
                (o) => o.deliveryStatus === 'On Delivery',
              )
            : initialState.currentDeliveringAddress,
        deliveryDestinationData:
          state.deliveryDestinationData.destinationid !== null &&
          action.payload.stepsuuid.includes(
            state.deliveryDestinationData.destinationid,
          )
            ? state.deliveryDestinationData
            : initialState.deliveryDestinationData,
      };
    case 'updateNavigationStats':
      for (let index = 0; index < state.route.dataPackage.length; index++) {
        const element = state.route.dataPackage[index];
        if (
          element.coords.lat ===
            state.deliveryDestinationData.destinationCoords.latitude &&
          element.coords.lng ===
            state.deliveryDestinationData.destinationCoords.longitude
        ) {
          if (
            typeof state.route.statsAPI[state.route.id][index] !== 'undefined'
          ) {
            state.route.statsAPI[state.route.id][index] = {
              ...state.route.statsAPI[state.route.id][index],
              distanceAPI: action.payload.distance,
              durationAPI: action.payload.duration,
            };
          }
          if (typeof state.route.statAPI[index] !== 'undefined') {
            state.route.statAPI[index] = {
              ...state.route.statAPI[index],
              distanceAPI: action.payload.distance,
              durationAPI: action.payload.duration,
            };
          }
        }
      }
    case 'RouteStats':
      return {
        ...state,
        route: {
          ...state.route,
          stats: {
            ...state.route.stats,
            [action.payload.uuid]: action.payload.stats,
          },
          stat: action.payload.stats,
        },
      };
    case 'RouteData':
      return {
        ...state,
        route: {
          ...state.route,
          dataPackage: action.payload,
        },
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
        route: {
          ...state.route,
          id: action.payload.uuid, //might be id of backend markers array
          orders: action.payload.orders,
          markers: action.payload.orders,
          stat: [],
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
        inboundList: action.payload,
      };
    case 'VASList':
      return {
        ...state,
        VASList: action.payload,
      };
    case 'InboundSPVList':
      return {
        ...state,
        inboundSPVList: action.payload,
      };
    case 'PutawayList':
      return {
        ...state,
        putawayList: action.payload,
      };
    case 'OutboundTask':
      return {
        ...state,
        outboundTask: action.payload,
      };
    case 'OutboundList':
      return {
        ...state,
        outboundList: action.payload,
      };
    case 'ManifestList':
      return {
        ...state,
        manifestList: action.payload,
      };
    // for prototype only
    case 'BarcodeScanned':
      return {
        ...state,
        filters: {
          ...state.filters,
          barcodeScanned: action.payload,
        },
      };
    case 'BarcodeGrade':
      return {
        ...state,
        filters: {
          ...state.filters,
          barcodeGrade: action.payload,
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
          ReportedASN: [...state.filters.ReportedASN, action.payload],
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
          ReportedTask: [...state.filters.ReportedTask, action.payload],
        },
      };
    case 'currentIVAS':
      return {
        ...state,
        filters: {
          ...state.filters,
          currentIVAS: [...state.filters.currentIVAS, action.payload],
        },
      };
    case 'activeVAS':
      return {
        ...state,
        filters: {
          ...state.filters,
          activeVAS: [...state.filters.activeVAS, action.payload],
        },
      };
    case 'completeVAS':
      return {
        ...state,
        filters: {
          ...state.filters,
          completeVAS: [...state.filters.completeVAS, action.payload],
        },
      };
    case 'ReportedVAS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ReportedVAS: [...state.filters.ReportedVAS, action.payload],
        },
      };
    case 'fromBarcode':
      return {
        ...state,
        barcodeScanned: [...state.barcodeScanned, action.payload],
      };
    case 'CurrentPositionData':
      return {
        ...state,
        currentPositionData: action.payload,
      };
    case 'CurrentApplicationNavigational':
      return {
        ...state,
        filters: {
          ...state.filters,
          ApplicationNavigational: action.payload,
        },
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
        state.route.statAPI[statIndex] = action.payload.statAPI;
        return {
          ...state,
          deliveryDestinationData: {
            ...action.payload,
          },
          route: {
            ...state.route,
            steps: {
              ...state.route.steps,
              [action.payload.destinationid]: action.payload.steps,
            },
            statsAPI: {
              ...state.route.statsAPI,
              [state.route.id]: {
                ...state.route.statsAPI[state.route.id],
                [statIndex]: action.payload.statAPI,
              },
            },
            statAPI: [...state.route.statAPI],
          },
        };
      }
    case 'CurrentDeliveringAddress':
      return {
        ...state,
        currentDeliveringAddress: action.payload,
      };
    case 'loggedIn':
      return {
        ...state,
        filters: {
          ...state.filters,
          logged: action.payload,
        },
      };
    case 'resetLogin':
      return {
        ...initialState,
        deviceSignature: state.deviceSignature,
      };
    case 'JWTToken':
      return {
        ...state,
        jwtToken: action.payload,
      };
    case 'DeviceSignature':
      return {
        ...state,
        deviceSignature: action.payload,
      };
    case 'RecollectionPhotoList':
      return {
        ...state,
        recollectionPhotoList: action.payload,
      };
    case 'RecollectionSignatureData':
      return {
        ...state,
        recollectionSignatureData: action.payload,
      };
    case 'RecollectionSignatureBase64':
      return {
        ...state,
        recollectionSignatureBase64: action.payload,
      };
    case 'RecollectionPhotoSubmitted':
      return {
        ...state,
        filters: {
          ...state.filters,
          isRecollectionPhotoSubmitted: action.payload,
        },
      };
    case 'StockTakeId':
      return {
        ...state,
        filters: {
          ...state.filters,
          stockTakeId: action.payload,
        },
      };
    case 'SelectedRequestRelocation':
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedRequestRelocation: action.payload,
        },
      };
    case 'SelectedLocationId':
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedLocationId: action.payload,
        },
      };
    // end
    // Do something here based on the different types of actions
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}
