import React from 'react';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Delivery from './delivery/detail';
import Warehouse from './warehouse/detail';
import warehouseMenu from './warehouse/detail/menu';
import WarehouseNavigator from './warehouse';
import DeliveryNavigator from './delivery';
import {createStackNavigator, Header} from '@react-navigation/stack';
import RNLocation from 'react-native-location';
import noAccess from './error/no-access';
const Stack = createStackNavigator();

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.detailsRoute.bind(this);
    this.detailPage.bind(this);
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
  componentDidMount() {
 
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
  
  }
  detailsRoute = () => {
    let Route = '';
    if (this.props.userRole.type === 'Warehouse') {
      Route = 'MenuWarehouse';
    } else if (this.props.userRole.type === 'Delivery') {
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

