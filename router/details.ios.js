import React from 'react';
import {connect} from 'react-redux';
import WarehouseInNavigator from './warehouse/inbound/index-inbound';
import WarehouseOutNavigator from './warehouse/outbound/index-outbound';
import WarehouseNavigator from './warehouse/index-warehouse';
import VASNavigator from './warehouse/VAS/index-VAS';
import DeliveryNavigator from './delivery';
import {createStackNavigator} from '@react-navigation/stack';
import {Overlay} from 'react-native-elements';
import {TouchableOpacity, View, Text, AppState} from 'react-native';
import noAccess from './error/no-rights';
import {
  PERMISSIONS,
  request,
  check,
  RESULTS,
  checkNotifications,
  requestNotifications,
  openSettings,
} from 'react-native-permissions';
const Stack = createStackNavigator();

class Details extends React.Component {
  _appState = React.createRef();
  constructor(props) {
    super(props);
    this.requestLocationPermission.bind(this);
    this.requestCameraPermission.bind(this);
    this.requestAudioPermission.bind(this);
    this._requestNotifications.bind(this);
    this.requestReadStoragePermission.bind(this);
    this.requestWriteStoragePermission.bind(this);
    this.setWrapperofStack.bind(this);
    this._appState.current = AppState.currentState;
    this.state = {
      cancel: false,
      overlayString: '',
      visible: false,
      notificationpermission: false,
      role: null,
      navigator: null,
    };
  }
  static getDerivedStateFromProps(props,state){
    const {routes, index} = props.navigation.dangerouslyGetState();
   
    if (  routes[index].params !== undefined &&
      routes[index].params.role !== undefined &&
      routes[index].params !== undefined &&
        routes[index].params.navigator !== undefined
    ){
      
    return {...state, navigator :  routes[index].params.navigator, role:routes[index].params.role};
    }
     
    return {...state};
  }
  setWrapperofStack = (index, key) => {
    const {indexBottomBar} = this.props;
    if (indexBottomBar === 0) {
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  };
  toggleOverlay = () => {
    const {visible} = this.state;
    this.setState({visible: !visible});
  };
  overlayDidUpdate = async (nextAppState) => {
    if (
      this._appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this.state.visible !== false) {
        this.setState({visible: false});
      }
    } else if (
      this._appState.current.match(/active/) &&
      (nextAppState === 'background' || nextAppState === 'inactive')
    ) {
    }
    this._appState.current = nextAppState;
  };
  handleConfirm = (val) => {
    if (val) {
      if (
        this.props.userRole.type === 'Warehouse' &&
        (!this.props.cameraPermission ||
          !this.props.audioPermission ||
          !this.props.readStoragePermission ||
          !this.props.writeStoragePermission)
      ) {
        openSettings();
      } else if (
        this.props.userRole.type === 'Delivery' &&
        (!this.props.locationPermission ||
          !this.props.cameraPermission ||
          !this.state.notificationpermission ||
          !this.props.readStoragePermission ||
          !this.props.writeStoragePermission)
      ) {
        openSettings();
      }
      this.setState({visible: false});
    } else {
      this.setState({visible: false});
      this.setState({cancel: true});
    }
  };
  async requestLocationPermission() {
    let {locationPermission} = this.props;
    if (locationPermission) {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this.setState({cancel: true});
              break;
            case RESULTS.DENIED:
              this.setState({cancel: true});
              this.props.setLocationPermission(false);
              break;
            case RESULTS.LIMITED:
              this.props.setLocationPermission(false);
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              if (!this.state.visible) {
                this.props.setLocationPermission(false);
                this.setState({
                  overlayString:
                    'In-App Delivery requires Location Permission to be granted, Tap `YES` to open App Setings',
                });
                this.setState({visible: true});
              }
              break;
          }
        })
        .catch((error) => {
          // …
        });
    } else {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.setState({cancel: true});
            break;
          case RESULTS.DENIED:
            this.setState({cancel: true});
            break;
          case RESULTS.LIMITED:
            this.props.setLocationPermission(false);
            break;
          case RESULTS.GRANTED:
            this.props.setLocationPermission(true);
            break;
          case RESULTS.BLOCKED:
            if (!this.state.visible) {
              this.props.setLocationPermission(false);
              this.setState({
                overlayString:
                  'In-App Delivery requires Location Permission to be granted, Tap `YES` to open App Setings',
              });
              this.setState({visible: true});
            }
            break;
        }
      });
    }
  }

  _requestNotifications = async () => {
    let {notificationpermission} = this.state;

    if (notificationpermission) {
      checkNotifications()
        .then(({status, settings}) => {
          // …
          switch (status) {
            case RESULTS.UNAVAILABLE:
              this.setState({cancel: true});
              break;
            case RESULTS.DENIED:
              this.setState({cancel: true, notificationpermission: true});
              break;
            case RESULTS.LIMITED:
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              if (!this.state.visible)
                this.setState({
                  overlayString:
                    'In-App Notifications requires Notification Center Settings, Tap `YES` to open App Setings',
                  visible: true,
                  notificationpermission: false,
                });
              break;
          }
        })
        .catch((error) => {
          // …
        });
    } else {
      requestNotifications([
        'alert',
        'sound',
        'provisional',
        'lockScreen',
        'notificationCenter',
      ]).then(({status, settings}) => {
        switch (status) {
          case RESULTS.UNAVAILABLE:
            this.setState({cancel: true});
            break;
          case RESULTS.DENIED:
            this.setState({cancel: true});
            break;
          case RESULTS.LIMITED:
            this.setState({notificationpermission: true});
            break;
          case RESULTS.GRANTED:
            this.setState({notificationpermission: true});
            break;
          case RESULTS.BLOCKED:
            if (!this.state.visible)
              this.setState({
                overlayString:
                  'In-App Notifications requires Notification Center Settings, Tap `YES` to open App Setings',
                visible: true,
                notificationpermission: false,
              });
            break;
        }
      });
    }
  };

  requestCameraPermission = async () => {
    let {cameraPermission} = this.props;

    if (cameraPermission) {
      check(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this.setState({cancel: true});
              break;
            case RESULTS.DENIED:
              this.setState({cancel: true});
              this.props.setCameraPermission(false);
              break;
            case RESULTS.LIMITED:
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              if (!this.state.visible) {
                this.setState({
                  overlayString:
                    'In-App Camera requires Camera Permission to be granted, Tap `YES` to open App Setings',
                });
                this.setState({visible: true});
                this.props.setCameraPermission(false);
              }
              break;
          }
        })
        .catch((error) => {
          // …
        });
    } else {
      request(PERMISSIONS.IOS.CAMERA).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.setState({cancel: true});
            break;
          case RESULTS.DENIED:
            this.setState({cancel: true});
            break;
          case RESULTS.LIMITED:
            this.props.setCameraPermission(true);
            break;
          case RESULTS.GRANTED:
            this.props.setCameraPermission(true);
            break;
          case RESULTS.BLOCKED:
            if (!this.state.visible) {
              this.setState({
                overlayString:
                  'In-App Camera requires Camera Permission to be granted, Tap `YES` to open App Setings',
              });
              this.setState({visible: true});
              this.props.setCameraPermission(false);
            }

            break;
        }
      });
    }
  };
  requestAudioPermission = async () => {
    let {audioPermission} = this.props;

    if (audioPermission) {
      check(PERMISSIONS.IOS.MICROPHONE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this.setState({cancel: true});
              break;
            case RESULTS.DENIED:
              this.setState({cancel: true});
              this.props.setAudioPermission(false);
              break;
            case RESULTS.LIMITED:
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              if (!this.state.visible) {
                this.setState({
                  overlayString:
                    'In-App Camera requires Microphone Permission to be granted, Tap `YES` to open App Setings',
                });
                this.setState({visible: true});
                this.props.setAudioPermission(false);
              }
              break;
          }
        })
        .catch((error) => {
          // …
        });
    } else {
      request(PERMISSIONS.IOS.MICROPHONE).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.setState({cancel: true});
            break;
          case RESULTS.DENIED:
            this.setState({cancel: true});
            break;
          case RESULTS.LIMITED:
            this.props.setAudioPermission(true);
            break;
          case RESULTS.GRANTED:
            this.props.setAudioPermission(true);
            break;
          case RESULTS.BLOCKED:
            if (!this.state.visible) {
              this.setState({
                overlayString:
                  'In-App Camera requires Microphone Permission to be granted, Tap `YES` to open App Setings',
              });
              this.setState({visible: true});
              this.props.setAudioPermission(false);
            }

            break;
        }
      });
    }
  };
  requestReadStoragePermission = async () => {
    let {readStoragePermission} = this.props;

    if (readStoragePermission) {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this.setState({cancel: true});
              break;
            case RESULTS.DENIED:
              this.setState({cancel: true});
              this.props.setReadStoragePermission(false);
              break;
            case RESULTS.LIMITED:
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              if (!this.state.visible) {
                this.setState({
                  overlayString:
                    'In-App Documentation requires Photo Library Permission to be granted, Tap `YES` to open App Setings',
                });
                this.setState({visible: true});

                this.props.setReadStoragePermission(false);
              }
              break;
          }
        })
        .catch((error) => {
          // …
        });
    } else {
      request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.setState({cancel: true});
            break;
          case RESULTS.DENIED:
            this.setState({cancel: true});
            break;
          case RESULTS.LIMITED:
            this.props.setReadStoragePermission(true);
            break;
          case RESULTS.GRANTED:
            this.props.setReadStoragePermission(true);
            break;
          case RESULTS.BLOCKED:
            if (!this.state.visible) {
              this.setState({
                overlayString:
                  'In-App Documentation requires Photo Library Permission to be granted, Tap `YES` to open App Setings',
              });
              this.setState({visible: true});

              this.props.setReadStoragePermission(true);
            }
            break;
        }
      });
    }
  };
  requestWriteStoragePermission = async () => {
    let {writeStoragePermission} = this.props;

    if (writeStoragePermission) {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this.setState({cancel: true});
              break;
            case RESULTS.DENIED:
              this.setState({cancel: true});
              this.props.setWriteStoragePermission(false);
              break;
            case RESULTS.LIMITED:
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              if (!this.state.visible) {
                this.setState({
                  overlayString:
                    'In-App Documentation requires Photo Library Write Permission to be granted, Tap `YES` to open App Setings',
                });
                this.setState({visible: true});

                this.props.setWriteStoragePermission(false);
              }
              break;
          }
        })
        .catch((error) => {
          // …
        });
    } else {
      request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.setState({cancel: true});
            break;
          case RESULTS.DENIED:
            this.setState({cancel: true});
            break;
          case RESULTS.LIMITED:
            this.props.setWriteStoragePermission(true);
            break;
          case RESULTS.GRANTED:
            this.props.setWriteStoragePermission(true);
            break;
          case RESULTS.BLOCKED:
            if (!this.state.visible) {
              this.setState({
                overlayString:
                  'In-App Documentation requires Photo Library Write Permission to be granted, Tap `YES` to open App Setings',
              });
              this.setState({visible: true});

              this.props.setWriteStoragePermission(false);
            }
            break;
        }
      });
    }
  };
  componentDidMount() {
    if (this.props.userRole.type === 'Warehouse') {
      if (this.state.cancel === true) {
        this.props.navigation.navigate('Home');
      } else {
        this.requestCameraPermission();
        this.requestAudioPermission();
        this.requestReadStoragePermission();
        this.requestWriteStoragePermission();
      }
    } else if (this.props.userRole.type === 'Delivery') {
      if (this.state.cancel === true) {
        this.props.navigation.navigate('Home');
      } else {
        this.requestLocationPermission();
        this.requestCameraPermission();
        this._requestNotifications();
        this.requestReadStoragePermission();
        this.requestWriteStoragePermission();
      }
    } else {
      //
    }
    AppState.addEventListener('change', this.overlayDidUpdate);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.overlayDidUpdate);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.userRole.type === 'Warehouse') {
      if (
        prevState.cancel !== this.state.cancel &&
        this.state.cancel === true
      ) {
        this.props.navigation.navigate('Home');
      } else if (!this.props.cameraPermission) {
        this.requestCameraPermission();
      } else if (!this.props.audioPermission) {
        this.requestAudioPermission();
      } else if (!this.props.readStoragePermission) {
        this.requestReadStoragePermission();
      } else if (!this.props.writeStoragePermission) {
        this.requestWriteStoragePermission();
      }
    } else if (this.props.userRole.type === 'Delivery') {
      if (
        prevState.cancel !== this.state.cancel &&
        this.state.cancel === true
      ) {
        this.props.navigation.navigate('Home');
      } else if (!this.props.cameraPermission) {
        this.requestCameraPermission();
      } else if (!this.state.notificationpermission) {
        this._requestNotifications();
      } else if (!this.props.locationPermission) {
        this.requestLocationPermission();
      } else if (!this.props.readStoragePermission) {
        this.requestReadStoragePermission();
      } else if (!this.props.writeStoragePermission) {
        this.requestWriteStoragePermission();
      }
    } else {
      //
    }
  }

  render() {
    let Navigate;
    const {visible} = this.state;
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    if (
     this.state.role === 'Warehouse'
    ) {
      if (
      this.state.navigator === 'INBOUND'
      ) {
        Navigate = (
          <>
            <WarehouseInNavigator />
            <Overlay
              isVisible={visible}
              onBackdropPress={this.toggleOverlay}
              fullScreen={true}
              overlayStyle={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  color: '#000000',
                  marginVertical: 40,
                }}>
                {this.state.overlayString}
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  style={[
                    {
                      width: '40%',
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    },
                    {borderWidth: 1, borderColor: '#ABABAB'},
                  ]}
                  onPress={() => this.handleConfirm(false)}>
                  <Text style={[{color: '#6C6B6B'}]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    {
                      width: '40%',
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    },
                    {backgroundColor: '#F07120'},
                  ]}
                  onPress={() => this.handleConfirm(true)}>
                  <Text style={[{color: '#fff'}]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </Overlay>
          </>
        );
      } else if (
     this.state.navigator === 'OUTBOUND'
      ) {
        Navigate = (
          <>
            <WarehouseOutNavigator />
            <Overlay
              isVisible={visible}
              onBackdropPress={this.toggleOverlay}
              fullScreen={true}
              overlayStyle={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  color: '#000000',
                  marginVertical: 40,
                }}>
                {this.state.overlayString}
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  style={[
                    {
                      width: '40%',
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    },
                    {borderWidth: 1, borderColor: '#ABABAB'},
                  ]}
                  onPress={() => this.handleConfirm(false)}>
                  <Text style={[{color: '#6C6B6B'}]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    {
                      width: '40%',
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    },
                    {backgroundColor: '#F07120'},
                  ]}
                  onPress={() => this.handleConfirm(true)}>
                  <Text style={[{color: '#fff'}]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </Overlay>
          </>
        );
      } else if (
      this.state.navigator === 'WAREHOUSE'
      ) {
        Navigate = (
          <>
            <WarehouseNavigator />
            <Overlay
              isVisible={visible}
              onBackdropPress={this.toggleOverlay}
              fullScreen={true}
              overlayStyle={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  color: '#000000',
                  marginVertical: 40,
                }}>
                {this.state.overlayString}
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  style={[
                    {
                      width: '40%',
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    },
                    {borderWidth: 1, borderColor: '#ABABAB'},
                  ]}
                  onPress={() => this.handleConfirm(false)}>
                  <Text style={[{color: '#6C6B6B'}]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    {
                      width: '40%',
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    },
                    {backgroundColor: '#F07120'},
                  ]}
                  onPress={() => this.handleConfirm(true)}>
                  <Text style={[{color: '#fff'}]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </Overlay>
          </>
        );
      } else if (
     this.state.navigator === 'VAS'
      ) {
        Navigate = (
          <>
            <VASNavigator />
            <Overlay
              isVisible={visible}
              onBackdropPress={this.toggleOverlay}
              fullScreen={true}
              overlayStyle={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  color: '#000000',
                  marginVertical: 40,
                }}>
                {this.state.overlayString}
              </Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  style={[
                    {
                      width: '40%',
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    },
                    {borderWidth: 1, borderColor: '#ABABAB'},
                  ]}
                  onPress={() => this.handleConfirm(false)}>
                  <Text style={[{color: '#6C6B6B'}]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    {
                      width: '40%',
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    },
                    {backgroundColor: '#F07120'},
                  ]}
                  onPress={() => this.handleConfirm(true)}>
                  <Text style={[{color: '#fff'}]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </Overlay>
          </>
        );
      } else {
        this.props.navigation.navigate('MenuWarehouse');
        Navigate = <></>;
      }
    } else if (
    this.state.role === 'Delivery'
    ) {
      Navigate = (
        <>
          <DeliveryNavigator />
          <Overlay
            isVisible={visible}
            onBackdropPress={this.toggleOverlay}
            fullScreen={true}
            overlayStyle={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                color: '#000000',
                marginVertical: 40,
              }}>
              {this.state.overlayString}
            </Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={[
                  {
                    width: '40%',
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  },
                  {borderWidth: 1, borderColor: '#ABABAB'},
                ]}
                onPress={() => this.handleConfirm(false)}>
                <Text style={[{color: '#6C6B6B'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    width: '40%',
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  },
                  {backgroundColor: '#F07120'},
                ]}
                onPress={() => this.handleConfirm(true)}>
                <Text style={[{color: '#fff'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Overlay>
        </>
      );
    } else {
      Navigate = (
        <Stack.Navigator
          initialRouteName="Home"
          headerMode="screen"
          screenOptions={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'tomato'},
            headerShown: false,
          }}>
          <Stack.Screen
            name="Home"
            component={noAccess}
            options={{
              title: 'Awesome app',
            }}
          />
        </Stack.Navigator>
      );
    }
    return Navigate;
  }
}

function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    cameraPermission: state.originReducer.filters.cameraPermission,
    locationPermission: state.originReducer.filters.locationPermission,
    audioPermission: state.originReducer.filters.audioPermission,
    readStoragePermission: state.originReducer.filters.readStoragePermission,
    writeStoragePermission: state.originReducer.filters.writeStoragePermission,
    indexBottomBar: state.originReducer.filters.indexBottomBar,
    warehouse_module: state.originReducer.filters.warehouse_module,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setCameraPermission: (bool) =>
      dispatch({type: 'cameraPermission', payload: bool}),
    setAudioPermission: (bool) =>
      dispatch({type: 'audioPermission', payload: bool}),
    setLocationPermission: (bool) =>
      dispatch({type: 'locationPermission', payload: bool}),
    setReadStoragePermission: (bool) =>
      dispatch({type: 'readStoragePermission', payload: bool}),
    setWriteStoragePermission: (bool) =>
      dispatch({type: 'writeStoragePermission', payload: bool}),
    setIndexBottom: (num) => {
      return dispatch({type: 'indexBottom', payload: num});
    },
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
