import React from 'react';
import {TextInput, View, Text, Dimensions} from 'react-native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createDrawerNavigator,DrawerContentScrollView,
  DrawerItemList, } from '@react-navigation/drawer';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Map from './address';
import Notification from './notification';
import {Button, Avatar} from 'react-native-elements';
import IconHome7Mobile from '../../assets/icon/iconmonstr-home-7mobile.svg';
import IconDelivery6Mobile from '../../assets/icon/iconmonstr-delivery-6mobile.svg';
import IconBubble26Mobile from '../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconGear2Mobile from '../../assets/icon/iconmonstr-gear-2mobile.svg';
import IconBell2Mobile from '../../assets/icon/iconmonstr-bell-2mobile.svg';
import IconTime17Mobile from '../../assets/icon/iconmonstr-time-17 1mobile.svg';  
import IconLogout2Mobile from '../../assets/icon/iconmonstr-log-out-2 2mobile.svg';

const screen = Dimensions.get('window');
const Drawer = createDrawerNavigator();

class DeliveryNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.deliveryTab.bind(this);
    this.CustomDrawerContent.bind(this);
  }

  deliveryRoute = () => {
    let Route = '';
    if (this.props.userRole.type === 'Client') {
      Route = 'Client';
    }
    else if (this.props.userRole.type === 'Warehouse') {
      Route = 'Warehouse';
    } else if (this.props.userRole.type === 'Delivery') {
      Route = 'Delivery';
    } else {
      Route = 'Client';
    }
    return Route;
  };
  
  CustomDrawerContent = (props) =>  {
  return (
    <DrawerContentScrollView contentContainerStyle={{
      paddingTop: 0,
   }}
  {...props} >
      <View style={styles.drawerHead}>
        <Avatar
        size={43}
        rounded 
        containerStyle={styles.drawerAvatar}
          source={{
            uri:
              'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          }}
          >
        </Avatar>
        <Text style={styles.drawerText}>Driver Name</Text>
        </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView> );
  }
  deliveryScreen = () => {
    return createCompatNavigatorFactory(createStackNavigator)({
      Home: {screen: this.props.component},
    });
  };
  deliveryTab = createCompatNavigatorFactory(createBottomTabNavigator)(
    {
      Home: {
        screen: this.props.component,
        navigationOptions:  ({ navigation }) => ({
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              onPress={()=> navigation.navigate('Home')}
              icon={() => (
                <IconHome7Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        }),
      },
      Profile: {
        screen: Map,
        navigationOptions:  ({ navigation }) => ({
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              onPress={()=> navigation.navigate('Profile')}
              icon={() => (
                <IconDelivery6Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        }),
      },
      Notification: {
        screen: Notification,
        navigationOptions:  ({ navigation }) => ({
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              onPress={()=> navigation.navigate('Notification')}
              icon={() => (
                <IconBubble26Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        }),
      },
      Other: {
        screen: this.props.component,
        navigationOptions:  ({ navigation }) => ({
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              onPress={()=> navigation.navigate('Other')}
              icon={() => (
                <IconGear2Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        }),
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
    return (<Drawer.Navigator 
    initialRouteName="Home" 
    drawerStyle={{width:screen.width * 0.6}}
    drawerContent={this.CustomDrawerContent} 
    contentContainerStyle={styles.drawerContainer} 
    drawerContentOptions={{activeBackgroundColor: '#ffffff',inactiveBackgroundColor: '#ffffff',activeTintColor:'#6C6B6B',inactiveTintColor: '#6C6B6B',labelStyle:{fontSize:14,fontWeight: '600',lineHeight:21}}}>
    <Drawer.Screen name="Notifications" component={this.deliveryTab} 
    options={{
      drawerIcon:({ focused, color, size })=>(<IconBell2Mobile height="20" width="17" fill='#2D2C2C'/>),
    }}/>
    <Drawer.Screen name="History" component={this.deliveryTab} 
    options={{
      drawerIcon:({ focused, color, size })=>(<IconTime17Mobile height="20" width="17" fill="#2D2C2C"/>),
    }}/>
    <Drawer.Screen name="Settings" component={this.deliveryTab} 
    options={{
      drawerIcon:({ focused, color, size })=>(<IconGear2Mobile height="20" width="17" fill="#2D2C2C"/>),
    }}/>
    <Drawer.Screen name="Log out" component={this.deliveryTab} 
    options={{
      drawerIcon:({ focused, color, size })=>(<IconLogout2Mobile height="20" width="17" fill="#2D2C2C"/>),
    }}/>
  </Drawer.Navigator>);
  }
}

const styles = {
  drawerContainer : {
    paddingTop: 0,
  },
  drawerHead: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#F1811C',
  },
  drawerText : {
    flexShrink: 1,
    marginVertical: 10,
    marginHorizontal: 16,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    color: 'white',
  },
  drawerAvatar : {
    flexShrink: 1,
  },
};
function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
    isDrawer : state.filters.isDrawer,
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
