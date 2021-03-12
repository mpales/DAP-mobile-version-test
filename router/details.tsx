import React from 'react';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Client from './client/detail';
import Delivery from './delivery/detail';
import Warehouse from './warehouse/detail';
import WarehouseNavigator from './warehouse';
import DeliveryNavigator from './delivery';
import ClientNavigator from './client';
import {createStackNavigator} from '@react-navigation/stack';
import {ReactReduxContext} from 'react-redux';
import noAccess from './error/no-access';
class Details extends React.Component {
  [x: string]: any;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.detailsRoute.bind(this);
  }
  Stack = createStackNavigator();
  detailsRoute = () => {
    let Route = '';
    if (this.props.userRole.type === 'Client') {
      Route = 'Client';
    } else if (this.props.userRole.type === 'Warehouse') {
      Route = 'Warehouse';
    } else if (this.props.userRole.type === 'Delivery') {
      Route = 'Delivery';
    } else {
      Route = 'Client';
    }
    return Route;
  };

  render() {
    return (
      <this.Stack.Navigator
        initialRouteName={this.detailsRoute()}
        headerMode="screen"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
          headerShown: false,
        }}>
        <this.Stack.Screen
          name="Client"
          component={Client}
          options={{
            title: 'Awesome app',
          }}
        />
        <this.Stack.Screen
          name="Delivery"
          component={Delivery}
          options={{
            title: 'Beranda app',
          }}
        />
        <this.Stack.Screen
          name="Warehouse"
          component={Warehouse}
          options={{
            title: 'Beranda app',
          }}
        />
      </this.Stack.Navigator>
    );
  }
}

function mapStateToProps(state: {todos: {name: any}; userRole: any}) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text: any) => {
      return {type: 'todos', payload: text};
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(Details);
const Stack = createStackNavigator();

const Beranda = () => {
  return (
    <ReactReduxContext.Consumer>
      {({store}) => {
        if (store.getState().userRole.type === 'Warehouse') {
          return <WarehouseNavigator component={ConnectedApp} />;
        } else if (store.getState().userRole.type === 'Delivery') {
          return <DeliveryNavigator component={ConnectedApp} />;
        } else if (store.getState().userRole.type === 'Client') {
          return <ClientNavigator component={ConnectedApp} />;
        } else {
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
          </Stack.Navigator>;
        }
      }}
    </ReactReduxContext.Consumer>
  );
};
export default Beranda;
