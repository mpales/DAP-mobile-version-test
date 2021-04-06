import React from 'react';
import {TextInput, View, Text, useWindowDimensions} from 'react-native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Map from '../../../component/map/index';
import {Button} from 'react-native-elements';
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import List from './list';
import ListMap from './list-map';
import Navigation from '../../../component/map/index';
import { TabRouter } from '@react-navigation/native';
import Package from '../package';
import Order from '../package/order';

const Stack = createStackNavigator();

class AddressNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.deliveryTab.bind(this);
    this.toggleBarVisible.bind(this);
  }
  toggleBarVisible = (toggle) => {
    if (toggle) {
      this.props.navigation.setOptions({tabBarVisible: true});
    } else {
      this.props.navigation.setOptions({tabBarVisible: false});
    }
  };
  deliveryTab = createCompatNavigatorFactory(createMaterialTopTabNavigator)(
    {
      Address: {
        screen: List,
        navigationOptions: {
          tabBarLabel: 'List',
        },
      },
      Map: {
        screen: ListMap,
        navigationOptions: {
          tabBarLabel: 'Map',
        },
      },
    },
    {
      tabBarOptions: {
        style: {
          backgroundColor: '#121C78',
        },
        indicatorStyle: {
          borderWidth: 1,
          borderColor: 'black',
        },
        activeTintColor: '#ffffff',
        inactiveTintColor: '#ffffff',
      },
    },
  );
  render() {
    return (
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen
          name="List"
          component={this.deliveryTab}
          options={{
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Delivery Order',
            headerRight: () => (
              <Button
                type="clear"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0}}
                icon={() => (
                  <IconDelivery8Mobile height="24" width="24" fill="#fff" />
                )}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Navigation"
          component={props => (
            <Navigation bottomBar={this.toggleBarVisible} {...props} />
          )}
          options={{
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Delivery Order',
            headerRight: () => (
              <Button
                type="clear"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0}}
                icon={() => (
                  <IconDelivery8Mobile height="24" width="24" fill="#fff" />
                )}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Package"
          component={Package}
          options={{
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Delivery Order',
            headerRight: () => (
              <Button
                type="clear"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0}}
                icon={() => (
                  <IconDelivery8Mobile height="24" width="24" fill="#fff" />
                )}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Order"
          component={Order}
          options={{
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Delivery Order',
            headerRight: () => (
              <Button
                type="clear"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0}}
                icon={() => (
                  <IconDelivery8Mobile height="24" width="24" fill="#fff" />
                )}
              />
            ),
          }}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    toggle: state.toggle,
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

export default connect(mapStateToProps, mapDispatchToProps)(AddressNavigator);
