import React from 'react';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Delivery from './delivery/detail';
import Warehouse from './warehouse/detail';
import WarehouseNavigator from './warehouse';
import DeliveryNavigator from './delivery';
import {createStackNavigator} from '@react-navigation/stack';
import {ReactReduxContext} from 'react-redux';
import noAccess from './error/no-access';
const Stack = createStackNavigator();

class Details extends React.Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.detailsRoute.bind(this);
    this.detailPage.bind(this);
  }
  detailsRoute = () => {
    let Route = '';
    if (this.props.userRole.type === 'Warehouse') {
      Route = 'Warehouse';
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
          headerShown: false,
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

export default connect(mapStateToProps, mapDispatchToProps)(Details);

