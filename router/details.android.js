import React from 'react';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Delivery from './delivery/detail';
import Warehouse from './warehouse/detail';
import warehouseMenu from './warehouse/detail/menu';
import WarehouseNavigator from './warehouse';
import DeliveryNavigator from './delivery';
import {createStackNavigator, Header} from '@react-navigation/stack';
import {PermissionsAndroid} from 'react-native';
import RNLocation from 'react-native-location';
import noAccess from './error/no-access';
const Stack = createStackNavigator();

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.detailsRoute.bind(this);
    this.detailPage.bind(this);
    this.requestLocationPermission.bind(this);
    this.requestCameraPermission.bind(this);
    this.requestReadStoragePermission.bind(this);
    this.requestWriteStoragePermission.bind(this);
    this.setWrapperofStack.bind(this);
    this.state = {
      cancel: false,
    };
  }
  setWrapperofStack = (index,key) => {
    const {indexBottomBar} = this.props;
    if(key === 'MenuWarehouse'){
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  }
  async requestLocationPermission() {
    let {locationPermission} = this.props;
    if (locationPermission) {
     await RNLocation.checkPermission({
        ios: 'whenInUse', // or 'always'
        android: {
          detail: 'coarse' // or 'fine'
        }
      }).then(granted => {
        if (granted) {
          this.props.setLocationPermission(true);
        } else {

          this.props.setLocationPermission(false);
        }
      });
    } else {
           await RNLocation.requestPermission({
              ios: 'whenInUse', // or 'always'
              android: {
                detail: 'coarse', // or 'fine'
                rationale: {
                  title: "We need to access your location",
                  message: "We use your location to show where you are on the map",
                  buttonPositive: "OK",
                  buttonNegative: "Cancel"
                }
              }
          }).then(granted => {
            if (granted) {
              this.props.setLocationPermission(true);
            } else {
              this.props.setLocationPermission(false);
              this.setState({cancel:true});
            }
          });
     
    }
  };
  requestCameraPermission = async () => {
    let {type} = this.props.userRole;
    let msg = '';
    if(type === 'Warehouse'){
      msg = "Warehouse module needs access to your camera " +
      "so you can take Barcode Scan.";
    } else if(type === 'Delivery') {
      msg = "Driver App needs access to your camera " +
      "so you can take Proof of Delivery pictures.";
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: msg,
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.props.setCameraPermission(true);
      } else {
        this.props.setCameraPermission(false);
        this.setState({cancel:true});
      }
    } catch (err) {
      console.warn(err);
    }
  }
  requestReadStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "App Read Storage Permission",
          message:
          "Driver module needs read access to your External Storage " +
          "so you can Manage Proof of Delivery Photo",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.props.setReadStoragePermission(true);
      } else {
        this.props.setReadStoragePermission(false);
        this.setState({cancel:true});
      }
    } catch (err) {
      console.warn(err);
    }
  }
  requestWriteStoragePermission = async () => {
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "App Write Storage Permission",
          message:
          "Driver module needs write access to your External Storage " +
          "so you can save Signature and Photo Proof",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.props.setWriteStoragePermission(true);
      } else {
        this.props.setWriteStoragePermission(false);
        this.setState({cancel:true});
      }
    } catch (err) {
      console.warn(err);
    }
  }
  componentDidMount() {
    if (this.props.userRole.type === 'Warehouse') {
      if(this.state.cancel === true){
        this.props.navigation.navigate('Home');
      } else {
        this.requestCameraPermission();
      }
    } else if (this.props.userRole.type === 'Delivery') {
      if(this.state.cancel === true){
        this.props.navigation.navigate('Home');
      } else {
      this.requestLocationPermission();
      this.requestCameraPermission();
      this.requestReadStoragePermission();
      this.requestWriteStoragePermission();
      }
    } else {
      // 
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.userRole.type === 'Warehouse') {
      if(prevState.cancel !== this.state.cancel && this.state.cancel === true){
        this.props.navigation.navigate('Home');
      } else if(!this.props.cameraPermission){
        this.requestCameraPermission();
      } 
    } else if (this.props.userRole.type === 'Delivery') {
      if(prevState.cancel !== this.state.cancel && this.state.cancel === true){
        this.props.navigation.navigate('Home');
      } else if(!this.props.cameraPermission){
        this.requestCameraPermission();
      } else if (!this.props.locationPermission) {
        this.requestLocationPermission();
      } else if(!this.props.readStoragePermission){
        this.requestReadStoragePermission();
      } else if(!this.props.writeStoragePermission){
        this.requestWriteStoragePermission();
      } 
    } else {
      // 
    }
  
  }
  detailsRoute = () => {
    let Route = '';
    if (this.props.userRole.type === 'Warehouse') {
      this.props.setBottomBar(true);
      Route = 'MenuWarehouse';
    } else if (this.props.userRole.type === 'Delivery') {
      this.props.setBottomBar(true);
      Route = 'Delivery';
    } else {
      Route = 'Delivery';
    }
    return Route;
  };

  detailPage = () => {
    return (
      <Stack.Navigator
        initialRouteName={this.detailsRoute()}
        headerMode="screen"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
          header: (props) => {
            let state = props.navigation.dangerouslyGetState();
            let key =  state.routes[state.index].name;
            let index = state.index;
            this.setWrapperofStack(index,key);
          },
        }}>
        <Stack.Screen
          name="Delivery"
          component={Delivery}
          options={{
            title: 'Beranda app',
          }}
        />
        <Stack.Screen
          name="Warehouse"
          component={Warehouse}
          options={{
            title: 'Beranda app',
          }}
        />
        <Stack.Screen
          name="MenuWarehouse"
          component={warehouseMenu}
          options={{
            title: 'Beranda app',
          }}
        />
      </Stack.Navigator>
    );
  }

  render() {
    let Navigate;
    if (this.props.userRole.type === 'Warehouse') {
      Navigate = <WarehouseNavigator component={this.detailPage} />;
    } else if (this.props.userRole.type === 'Delivery') {
      Navigate =  <DeliveryNavigator component={this.detailPage} />;
    } else {
      Navigate = <Stack.Navigator
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
      </Stack.Navigator>;
    }
    return Navigate;

  };
}

function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    cameraPermission : state.originReducer.filters.cameraPermission,
    locationPermission : state.originReducer.filters.locationPermission,
    readStoragePermission : state.originReducer.filters.readStoragePermission,
    writeStoragePermission : state.originReducer.filters.writeStoragePermission,
    indexBottomBar : state.originReducer.filters.indexBottomBar,
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
    setCameraPermission: (bool)=> dispatch({type: 'cameraPermission', payload: bool}),
    setLocationPermission: (bool)=> dispatch({type: 'locationPermission', payload: bool}),
    setReadStoragePermission: (bool)=> dispatch({type: 'readStoragePermission', payload: bool}),
    setWriteStoragePermission: (bool)=> dispatch({type: 'writeStoragePermission', payload: bool}),
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

