/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import configureStore from './Store';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Keyboard,
  InteractionManager,
  BackHandler,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Signature from './Browser';
import {NavigationContainer, TabRouter} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Mixins from './mixins';
import {LoginInput} from './input';
import {FadeInView} from './animated';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider, useSelector, useDispatch} from 'react-redux';
import Beranda from './router/details';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {enableScreens} from 'react-native-screens';
import {
  ReduxNetworkProvider,
  offlineActionCreators,
} from 'react-native-offline';
import {PersistGate} from 'redux-persist/integration/react';
import {postData} from './component/helper/network';
import Checkmark from './assets/icon/iconmonstr-check-mark-8mobile.svg';
import {
  isReadyRef,
  navigationRef,
  switchLogged,
  refreshLogin,
  setRootParams,
  setRootScreens
} from './component/helper/persist-login';
import MenuWarehouse from './router/warehouse/detail/warehouse-menu';
import LogoLarge from './assets/dap_logo_hires1-e1544435829468 5large.svg';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
enableScreens(false);
class App extends React.Component<IProps, IState> {
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  constructor(props: IProps | Readonly<IProps>) {
    super(props);
    this.state = {
      email: '',
      password: '',
      keyboardState: 'closed',
      transitionTo: 0,
      errors: [],
    };
    this._keyboardDidHide.bind(this);
    this._keyboardDidShow.bind(this);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  _keyboardDidShow = () => {
    this.setState({
      keyboardState: 'opened',
      transitionTo: 0,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      keyboardState: 'closed',
      transitionTo: 0,
    });
  };

  onChangeEmail(text: any) {
    this.setState({email: text});
    this.clearError('email');
  }

  onChangePassword(text: any) {
    this.setState({password: text});
    this.clearError('password');
  }
  clearError = (inputName: string) => {
    const errors = this.state.errors;
    if (errors.length > 0 && typeof errors === 'object') {
      errors.map((err: Error, i) => {
        if (err.param === inputName) {
          inputName === 'email' ? errors.splice(i, 2) : errors.splice(i, 1);
        }
      });
      this.setState({errors: errors});
    } else {
      this.setState({errors: []});
    }
  };

  onSubmitToBeranda = async (e: any) => {
    let body = {
      email: this.state.email,
      password: this.state.password,
      fingerprint: this.props.deviceSignatureValue,
    };
    const result = await postData('auth/login', body);
    console.log(result);
    if (result.authToken) {
      // user object is temporary
      let role = '';
      let type = '';
      if (
        result.userRights.includes('m1') ||
        result.userRights.includes('m2') ||
        result.userRights.includes('m3') ||
        result.userRights.includes('m6') ||
        result.userRights.includes('m7') ||
        result.userRights.includes('m8') ||
        result.userRights.includes('m9') ||
        result.userRights.includes('m11') ||
        result.userRights.includes('m10') ||
        result.userRights.includes('m12') ||
        result.userRights.includes('m13') ||
        result.userRights.includes('m14') 
      ) {
        type = 'Warehouse';
        if (
          result.userRights.includes('m6') ||
          result.userRights.includes('m13')
        ) {
          role = 'SPV';
        } else {
          role = 'default';
        }
      } else if (
        result.userRights.includes('m4') ||
        result.userRights.includes('m5')
      ) {
        type = 'Delivery';
        role = 'default';
      }
      let user = {
        id: 0,
        role: role,
        name: this.state.email,
        type: type,
        userRights: result.userRights,
      };
      this.props.login(user);
      this.props.saveJwtToken(result.authToken);
      this.setState({
        email: '',
        password: '',
      });
      setTimeout(() => {
        setRootParams('loggedParams', user);
      }, 1000);
    } else if (result.errors) {
      this.setState({
        errors: result.errors,
      });
    } else {
      this.setState({
        errors: result,
      });
    }
  };
  render() {
    const {errors} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Signature deviceSignature={this.props.deviceSignature} />
        <View style={styles.body}>
          <View style={styles.sectionContainerIMG}>
            <LogoLarge width="179" height="91" style={{alignSelf: 'center'}} />
          </View>
          <FadeInView
            transition={this.state.transitionTo}
            style={styles.sectionContainerKeyboard}>
            <LoginInput
              label="Email"
              value={this.state.email}
              placeholder="Masukan Email / Username"
              onChangeText={this.onChangeEmail.bind(this)}
              secureTextEntry={false}
            />
            <View style={styles.errorContainer}>
              {errors.length > 0 &&
                typeof errors === 'object' &&
                errors.map((err: Error, i) => {
                  if (err.param === 'email') {
                    return (
                      <Text
                        key={i}
                        style={[
                          styles.labelText,
                          {color: 'red', textAlign: 'left'},
                        ]}>
                        {err.msg}
                      </Text>
                    );
                  }
                })}
            </View>
            <LoginInput
              label="Password"
              value={this.state.password}
              placeholder="password"
              onChangeText={this.onChangePassword.bind(this)}
              secureTextEntry={true}
            />
            <View style={[styles.errorContainer, {flexShrink: 1}]}>
              {errors.length > 0 && typeof errors === 'object' ? (
                errors.map((err: Error, i) => {
                  if (err.param === 'password') {
                    return (
                      <Text
                        key={i}
                        style={[
                          styles.labelText,
                          {color: 'red', textAlign: 'left'},
                        ]}>
                        {err.msg}
                      </Text>
                    );
                  }
                })
              ) : (
                <Text
                  style={[styles.labelText, {color: 'red', textAlign: 'left'}]}>
                  {errors}
                </Text>
              )}
            </View>
            <View style={{flexShrink: 1}}>
              <Text style={styles.buttonTextForgot}>Forgot password?</Text>
            </View>
          </FadeInView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onSubmitToBeranda.bind(this)}
              disabled={
                this.state.email.length !== 0 &&
                this.state.password.length !== 0
                  ? false
                  : true
              }>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={
              styles.versionText
            }>{`Version ${DeviceInfo.getVersion()}`}</Text>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#121C78',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  tinyLogo: {
    width: 176,
    height: 91,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: Colors.black,
    marginBottom: 40,
  },
  body: {
    backgroundColor: '#121C78',
    flexDirection: 'column',
    flex: 1,
  },
  footer: {
    backgroundColor: '#121C78',
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 40,
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: Colors.white,
    ...Mixins.h5,
    lineHeight: 27,
  },
  buttonTextForgot: {
    color: Colors.white,
    ...Mixins.body1,
    lineHeight: 21,
  },
  button: {
    flex: 0,
    flexShrink: 1,
    padding: 10,
    backgroundColor: '#F07120',
    borderColor: '#F07120',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionContainerIMG: {
    marginTop: 52,
    marginBottom: 60,
    paddingHorizontal: 20,
    flex: 0,
    flexShrink: 1,
    height: 60,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    height: 180,
    flex: 0,
    flexShrink: 1,
  },
  sectionContainerKeyboard: {
    marginTop: 10,
    paddingHorizontal: 20,
    height: 180,
    flex: 0,
    flexShrink: 1,
  },
  sectionContainerFooter: {
    marginTop: 32,
    paddingHorizontal: 20,
    flex: 2,
  },
  sectionTextInput: {
    height: 20,
    width: 100,
    padding: 0,
    borderColor: 'gray',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  errorContainer: {},
  labelText: {
    color: Colors.white,
    ...Mixins.body1,
    lineHeight: 21,
    textAlign: 'center',
  },
  versionText: {
    ...Mixins.subtitle3,
    color: '#FFF',
    position: 'absolute',
    bottom: 0,
    left: 20,
  },
});
type IState = {
  email: string;
  password: string;
  transitionTo: number;
  keyboardState: string;
  errors: [];
};
interface Error {
  value: string;
  msg: string;
  param: string;
  location: string;
}
interface userObject {
  id: number;
  role: string;
  name: string;
  type: string;
  userRights: object;
}
interface IProps {
  textfield: string;
  value: string;
  todos: {};
  password: string;
  email: string;
  deviceSignatureValue: string;
  login: (text: userObject) => void;
  logout: () => void;
  onChange: (text: any) => void;
  deviceSignature: (text: string) => void;
  navigation: any;
  roletype: string;
  saveJwtToken: (token: string) => void;
  saveUsername: (text: string | null) => void;
}

interface dispatch {
  type: string;
  payload: {};
}
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    roletype: state.originReducer.userRole.type,
    deviceSignatureValue: state.originReducer.deviceSignature,
    userRole: state.originReducer.userRole,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    login: (user: userObject) => dispatch({type: 'login', payload: user}),
    logout: () => dispatch({type: 'logout'}),
    onChange: (text: any) => {
      return {type: 'todos', payload: text};
    },
    deviceSignature: (text: string) => {
      return dispatch({type: 'DeviceSignature', payload: text});
    },
    saveJwtToken: (token: string) => {
      dispatch({type: 'JWTToken', payload: token});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
const Stack = createStackNavigator();
const NavigationWrapper = (props) => {
  const isConnected = useSelector((state) => state.network.isConnected);
  const isJWTExist = useSelector((state) => state.originReducer.jwtToken);
  const roleType = useSelector((state) => state.originReducer.userRole.type);
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [currentRoute, setRouteName] = React.useState(null);
  const {changeQueueSemaphore} = offlineActionCreators;

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  React.useEffect(() => {
    // fixed bug can go back to warehouse screen from logout flow
    const backAction = () => {
      if(currentRoute !== null && currentRoute === 'Login'){
        BackHandler.exitApp()
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [currentRoute]);
  const filterLoading = React.useCallback(
    (state) => {
      setRouteName(state.routes[state.index].name);
      const task = InteractionManager.runAfterInteractions(() => {
        if (state.routes[state.index].name === 'Details' && !isJWTExist) {
          switchLogged('Login', {});
        } else if (state.routes[state.index].name === 'Login' && isJWTExist) {
          if (
            state.routes[state.index].params !== undefined &&
            state.routes[state.index].params.loggedParams !== undefined
          ) {
            if (
              state.routes[state.index].params.loggedParams.type ===
              'Warehouse'
            ) {
              let initialScreens = 'Warehouse';
              const isUserRights = state.routes[state.index].params.loggedParams.userRights;
              if(isUserRights !== null && isUserRights !== undefined && Array.isArray(isUserRights) === true){
                if(
                  isUserRights.includes('m14') ||
                  isUserRights.includes('m13')  || 
                  isUserRights.includes('m1') ||
                  isUserRights.includes('m6')
                ){
                  initialScreens = 'Warehouse';
                  if(            
                  isUserRights.includes('m1') &&
                  isUserRights.includes('m6') === false  && 
                  isUserRights.includes('m13') === false &&
                  isUserRights.includes('m14') === false){
                    initialScreens = 'INBOUND';
                  } else if(
                    isUserRights.includes('m1') === false &&
                    isUserRights.includes('m6') && 
                    isUserRights.includes('m13') === false &&
                    isUserRights.includes('m14') === false
                  ){
                    initialScreens = 'INBOUND';
                  } else if(
                    isUserRights.includes('m1') === false &&
                    isUserRights.includes('m6') === false && 
                    isUserRights.includes('m13') &&
                    isUserRights.includes('m14') === false
                  ){
                    initialScreens = 'WAREHOUSE';
                  } else if(
                    isUserRights.includes('m1') === false &&
                    isUserRights.includes('m6') === false && 
                    isUserRights.includes('m13') === false &&
                    isUserRights.includes('m14')
                  ){
                    initialScreens = 'WAREHOUSE';
                  }
                } 
              }
              
              switch (initialScreens) {
                case 'WAREHOUSE':
                  switchLogged('Details', {
                    navigator: 'WAREHOUSE',
                    role: 'Warehouse'
                  });                  
                  break;
                case 'INBOUND':
                  switchLogged('Details', {
                    navigator: 'INBOUND',
                    role: 'Warehouse'
                  });
                  break;
                case 'OUTBOUND':
                case 'Warehouse':
                default:
                  // changes screen to trigger on what warehouse modules using user role.
                  setRootScreens('navigator',initialScreens,'Details');
                  setRootScreens('role','Warehouse','Details');
                  switchLogged('MenuWarehouse', {});
                break;
              }
            } else if (
              state.routes[state.index].params.loggedParams.type ===
              'Delivery'
            ) {
              switchLogged('Details', {
                navigator: 'Delivery',
                initialScreens: 'Acknowledgement',
                role: 'Delivery',
              });
            } else {
              switchLogged('Details', {});
            }
          }
          
        }
        if (
          state.routes[state.index].params !== undefined &&
          state.routes[state.index].params.hardReset !== undefined
        ) {
          if (state.routes[state.index].params.hardReset === true) {
            dispatch({type: 'logout'});
            setRootParams('hardReset', false);
          }
        }
      });
      return () => task.cancel();
    },
    [isJWTExist],
  );
  React.useEffect(() => {
    if (!isConnected) {
      dispatch(changeQueueSemaphore('RED'));
    }
  }, [isConnected]); // Only re-run the effect if count changes

  return (
    <SafeAreaProvider
      style={{backgroundColor: '#121C78', width: '100%', height: '100%'}}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}
        onStateChange={filterLoading}
        {...props}
      />
    </SafeAreaProvider>
  );
};

const Root = (props) => {
  const [isLoading, setLoading] = React.useState(true);
  const isLoggedIn = React.useRef(null);
  const [isRole, setRole] = React.useState(null);
  const [initialScreens, setInitScreens] = React.useState("");
  const [initialParams, setInitParams] = React.useState({});
  const [routeName, setRoute] = React.useState('Login');
  const setLoggedin = React.useCallback((store) => {
    let bool = store.getState().originReducer.filters.logged;
    let roleType = store.getState().originReducer.userRole.type;
    let userRights = store.getState().originReducer.userRole.userRights;
    if (bool) {
      if (roleType === 'Warehouse') {
        let initialScreens = 'Warehouse';
        if(userRights !== null && userRights !== undefined && Array.isArray(userRights) === true){
          if(
            userRights.includes('m14') ||
            userRights.includes('m13')  || 
            userRights.includes('m1') ||
            userRights.includes('m6')
          ){
            initialScreens = 'Warehouse';
            if(            
              userRights.includes('m1') &&
              userRights.includes('m6') === false  && 
              userRights.includes('m13') === false &&
              userRights.includes('m14') === false){
              initialScreens = 'INBOUND';
            } else if(
              userRights.includes('m1') === false &&
              userRights.includes('m6') && 
              userRights.includes('m13') === false &&
              userRights.includes('m14') === false
            ){
              initialScreens = 'INBOUND';
            } else if(
              userRights.includes('m1') === false &&
              userRights.includes('m6') === false && 
              userRights.includes('m13') &&
              userRights.includes('m14') === false
            ){
              initialScreens = 'WAREHOUSE';
            } else if(
              userRights.includes('m1') === false &&
              userRights.includes('m6') === false && 
              userRights.includes('m13') === false &&
              userRights.includes('m14')
            ){
              initialScreens = 'WAREHOUSE';
            }
          } 
        }
        switch (initialScreens) {
          case 'WAREHOUSE':
          case 'INBOUND':
            setRoute('Details');
            break;
          case 'OUTBOUND':
          case 'Warehouse':
          default:
            setRoute('MenuWarehouse');
          break;
        }
        setInitScreens(initialScreens);
      } else {
        setRoute('Details');
      }
      setRole(roleType)
    } else {
      setRoute('Login');
      setLoading(false);
    }
    isLoggedIn.current = bool;
  }, []);
  
  const {store, persistor} = configureStore(() => {
    // this is callback to store.subscribe, please don't load anymore state
    // as this is expensive trigger to redux without lazy
    setLoggedin(store);
  });
  
  React.useEffect(() => {
    if (isRole !== null) {
      if (isRole === 'Warehouse') {
        setInitParams({navigator: initialScreens, role: 'Warehouse'});
        setLoading(false);
      } else if (isRole === 'Delivery') {
        // const result = await getData('cmobile/driver/acknowledge');
        // if (result.acknowledgeDetails) {
        //   if (result.acknowledgeDetails.hasAcknowledge === true) {
        //     setInitParams({screen: 'Delivery', role: 'Delivery'});
        //     setLoading(false);
        //   } else {
        //     setInitParams({screen: 'Acknowledge', role: 'Delivery'});
        //     setLoading(false);
        //   }
        // } else {
          setInitParams({navigator: 'Delivery', initialScreens : 'Detail', role: 'Delivery'});
          setLoading(false);
        // }
      } else {
        setInitParams({});
        setLoading(false);
      }
    }
  }, [isRole, initialScreens]);

  React.useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  if (isLoading) return null;
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReduxNetworkProvider>
          <NavigationWrapper>
            <Stack.Navigator
              initialRouteName={routeName}
              headerMode="screen"
              screenOptions={{
                headerTintColor: 'white',
                headerStyle: {backgroundColor: 'tomato'},
                headerShown: false,
                animationEnabled: false, // hack to fix android 10-12 crash with react-native-screens
              }}>
              <Stack.Screen
                name="Login"
                component={ConnectedApp}
                options={{
                  title: '',
                }}
              />
              <Stack.Screen
                name="Details"
                component={Beranda}
                initialParams={initialParams}
                options={{
                  title: '',
                }}
              />
              <Stack.Screen
                name="MenuWarehouse"
                component={MenuWarehouse}
                options={{
                  title: '',
                }}
              />
            </Stack.Navigator>
          </NavigationWrapper>
        </ReduxNetworkProvider>
      </PersistGate>
    </Provider>
  );
};
export default Root;
