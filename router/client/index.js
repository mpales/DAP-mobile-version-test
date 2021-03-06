import React from 'react';
import {TextInput, View, Text} from 'react-native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';

class ClientNavigator extends React.Component {
  constructor(props) {
    super(props);
  }

  clientRoute = () => {
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
  clientScreen = () => {
    return createCompatNavigatorFactory(createStackNavigator)({
      Home: {screen: this.props.component},
    });
  };
  clientTab = createCompatNavigatorFactory(createBottomTabNavigator)({
    Home: {screen: this.props.component},
    Profile: {screen: this.props.component},
    Notification: {screen: this.props.component},
    Other: {screen: this.props.component},
  });
  render() {
    return <this.clientTab />;
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientNavigator);
