import React from 'react';
import {TextInput, View, Text} from 'react-native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Map from './address';
import {Button} from 'react-native-elements';
import IconHome7Mobile from '../../assets/icon/iconmonstr-home-7mobile.svg';
import IconDelivery6Mobile from '../../assets/icon/iconmonstr-delivery-6mobile.svg';
import IconBubble26Mobile from '../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconGear2Mobile from '../../assets/icon/iconmonstr-gear-2mobile.svg';

class DeliveryNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.deliveryTab.bind(this);
  }

  deliveryRoute = () => {
    let Route = '';
    if (this.props.userRole.type === 'Client') {
      Route = 'Client';
    } else if (this.props.userRole.type === 'Warehouse') {
      Route = 'delivery';
    } else if (this.props.userRole.type === 'Delivery') {
      Route = 'Delivery';
    } else {
      Route = 'Client';
    }
    return Route;
  };
  deliveryScreen = () => {
    return createCompatNavigatorFactory(createStackNavigator)({
      Home: {screen: this.props.component},
    });
  };
  deliveryTab = createCompatNavigatorFactory(createBottomTabNavigator)(
    {
      Home: {
        screen: this.props.component,
        navigationOptions: {
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              icon={() => (
                <IconHome7Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        },
      },
      Profile: {
        screen: Map,
        navigationOptions: {
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              icon={() => (
                <IconDelivery6Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        },
      },
      Notification: {
        screen: this.props.component,
        navigationOptions: {
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              icon={() => (
                <IconBubble26Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        },
      },
      Other: {
        screen: this.props.component,
        navigationOptions: {
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              icon={() => (
                <IconGear2Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        },
      },
    },
    {
      tabBarOptions: {
        shifting: false,
        showLabel: false,
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#6C6B6B',
        tabStyle: {
          paddingVertical: 10,
        },
        style: {
          height: 94,
          borderWidth: 0.5,
          borderBottomWidth: 1,
          backgroundColor: '#F5F5FB',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderColor: 'transparent',
          overflow: 'hidden',
        },
      },
    },
  );
  render() {
    return <this.deliveryTab />;
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

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryNavigator);
