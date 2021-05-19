import React from 'react';
import {TextInput, View, Text, useWindowDimensions} from 'react-native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator, HeaderBackButton, Header} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Map from '../../../component/map/index';
import {Button} from 'react-native-elements';
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import List from './list';
import ListMap from './list-map';
import Navigation from '../../../component/map/index';
import { TabRouter } from '@react-navigation/native';
import Package from '../package';
import Order from '../order/index';
import Cancel from '../order/cancelOrder';
import Mixins from '../../../mixins';

const Stack = createStackNavigator();

class AddressNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.deliveryTab.bind(this);
    this.backwithoutBottom.bind(this);
    this.cancelDelivery.bind(this);
    this.setWrapperofStack.bind(this);
  }
  setWrapperofStack = (index,key) => {
    const {indexBottomBar} = this.props;
    console.log(indexBottomBar + key);
    if(indexBottomBar === 0){
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  }
  backwithoutBottom = () => {
    this.props.setBottomBar(false);
  }
  cancelDelivery = ()=> {
    this.props.setStartDelivered(false);
    this.props.setBottomBar(true);
  }
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
        labelStyle : {
          ...Mixins.h5,
          lineHeight: 21,
          textTransform: 'none'
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
      <Stack.Navigator initialRouteName="List" screenOptions={{
        headerBackImage:({tintColor})=>(<IconArrow66Mobile height="22" width="18" fill={tintColor}/>),
        header: (props) => {
          let state = props.navigation.dangerouslyGetState();
          let key =  state.routes[state.index].name;
          let index = state.index;
          this.setWrapperofStack(index,key);
          return (
            <Header
            {...props}
            />
          );
        },
        }}>     
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
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
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
          component={Navigation}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerTitle: 'Delivery Order',
            headerLeft: (props) => {
              return(
              <HeaderBackButton  {...props} onPress={()=>{
                this.cancelDelivery();
                navigation.goBack();
              }
              }
              />);
            },
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
          })}
        />
        <Stack.Screen
          name="Package"
          component={Package}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerTitle: 'Delivery Order',
            headerLeft: (props) => {
              return(
              <HeaderBackButton  {...props} onPress={()=>{
                this.backwithoutBottom();
                navigation.goBack();
              }
              }
              />);
            },
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
          })}
        />
        <Stack.Screen
          name="Cancel"
          component={Cancel}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerTitle: 'Cancel Deliver',
            headerLeft: (props) => {
              return(
              <HeaderBackButton  {...props} onPress={()=>{
                this.backwithoutBottom();
                navigation.goBack();
              }
              }
              />);
            },
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
          })}
        />
        <Stack.Screen
          name="Order"
          component={Order}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerTitle: 'Delivery Order',
            headerLeft: (props) => {
              return(
              <HeaderBackButton  {...props} onPress={()=>{
                this.backwithoutBottom();
                navigation.goBack();
              }
              }
              />);
            },
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
          })}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    bottomBar: state.originReducer.filters.bottomBar,
    startDelivered: state.originReducer.filters.startDelivered,
    indexStack : state.originReducer.filters.indexStack,
    keyStack : state.originReducer.filters.keyStack,
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
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setStartDelivered : (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    },
    toggleDrawer: (bool) => {
      return dispatch({type: 'ToggleDrawer', payload: bool});
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

export default connect(mapStateToProps, mapDispatchToProps)(AddressNavigator);
