import React from 'react';
import {TextInput, View, Text} from 'react-native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Scanner from './peripheral';

class WarehouseNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.warehouseTab.bind(this)
  }

  warehouseRoute = () => {
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
  warehouseScreen = () => {
    return createCompatNavigatorFactory(createStackNavigator)({
      Home: {screen: this.props.component},
    });
  };
  warehouseTab = createCompatNavigatorFactory(createBottomTabNavigator)({
    Home: {screen: this.props.component},
    Profile: {screen: Scanner},
    Notification: {screen: this.props.component},
    Other: {screen: this.props.component},
  });
  render() {
    return <this.warehouseTab />;
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseNavigator);
