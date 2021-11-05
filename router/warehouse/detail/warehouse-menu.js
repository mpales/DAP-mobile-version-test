import React from 'react';
import {Text, Button,Image, Avatar} from 'react-native-elements';
import {TextInput, View, Dimensions,TouchableOpacity, BackHandler, InteractionManager, Platform, ScrollView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Inbound from '../../../assets/icon/iconmonstr-shipping-box-8mobile.svg';
import Outbound from '../../../assets/icon/iconmonstr-shipping-box-9mobile.svg';
import Warehouse from '../../../assets/icon/iconmonstr-building-6mobile.svg';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {
  CommonActions,
  NavigationRouteContext,
  NavigationContext,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import IconHome7Mobile from '../../../assets/icon/iconmonstr-home-7mobile.svg';
import WarehouseDrawer from '../../../assets/icon/warehouse-bottom-drawer-mobile.svg';
import IconBubble26Mobile from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconGear2Mobile from '../../../assets/icon/iconmonstr-gear-2mobile.svg';
import IconBell2Mobile from '../../../assets/icon/iconmonstr-bell-2mobile.svg';
import IconMenu from '../../../assets/icon/iconmonstr-menu-6 1mobile.svg';
import IconTime17Mobile from '../../../assets/icon/iconmonstr-time-17 1mobile.svg';  
import IconVAS from '../../../assets/icon/iconmonstr-delivery-15mobile.svg';
import LogoSmall from '../../../assets/dap_logo_hires1-e1544435829468 5small.svg';
import {popToLogout} from '../../../component/helper/persist-login';
import {SafeAreaView} from 'react-native-safe-area-context';
import Notification from '../notification';
import {postData} from '../../../component/helper/network';
import Settings from '../settings/index';
const screen = Dimensions.get('window');
const Drawer = createDrawerNavigator();
class WarehouseMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowSignature: false,
    };
    this.drawerRef = React.createRef();

    this._CustomBottomTabContent.bind(this);
    this._CustomDrawerContent.bind(this);
    this.drawerLogout.bind(this);
    this.renderView.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isDrawer !== this.props.isDrawer) {
      this.drawerRef.current = true;
    } else {
      this.drawerRef.current = false;
    }

    return true;
  }
  renderView = () => {
    return (
      <ScrollView style={{flex: 1, flexDirection:'column', backgroundColor: '#121C78', paddingHorizontal: 22,}}>
          <IconMenu fill="white" height="24" width="24" style={{position:'absolute', top: screen.height * 0.05}}
          onPress={()=>{
            this.props.toggleDrawer(true);
          }}
          />
          <View style={{alignItems:'center', justifyContent: 'center',flexDirection: 'column',marginVertical: 100}}>
             <LogoSmall width="135" height="70" style={{alignSelf:'center'}}/>
          </View>
           
          <Button
                containerStyle={ {marginVertical: 10, borderRadius: 10}}
                icon={() => (
                    <Inbound height="60" width="60" fill="#ABABAB" />
                )}
                iconContainerStyle={[Mixins.rectDefaultButtonIconStyle]}
                title="INBOUND"
                titleStyle={{color: '#6C6B6B', ...Mixins.h1, lineHeight: 36,flex:1}}
                onPress={()=>{
                  this.props.setBottomBar(true);
                  this.props.setWarehouseModule('INBOUND');
                  this.props.navigation.navigate('Details')}}
                buttonStyle={{backgroundColor: '#FFFFFF',paddingVertical:15, paddingHorizontal: 35}}
              />
                 
          <Button
               containerStyle={ {marginVertical: 10, borderRadius: 10}}
                 icon={() => (
                    <Outbound height="60" width="60" fill="#ABABAB" />
                )}
                iconContainerStyle={Mixins.rectDefaultButtonIconStyle}
                title="OUTBOUND"
                titleStyle={{color: '#6C6B6B', ...Mixins.h1, lineHeight: 36,flex:1}}
                onPress={()=>{
                  this.props.setBottomBar(true);
                  this.props.setWarehouseModule('OUTBOUND');
                    this.props.navigation.navigate('Details')}}
                    buttonStyle={{backgroundColor: '#FFFFFF',paddingVertical:15, paddingHorizontal: 35}}
                    />
                 
          <Button
          containerStyle={ {marginVertical: 10, borderRadius: 10}}
            icon={() => (
                    <Warehouse height="60" width="60" fill="#ABABAB" />
                )}
                iconContainerStyle={[Mixins.rectDefaultButtonIconStyle,{}]}
                title="WAREHOUSE"
                titleStyle={{color: '#6C6B6B', ...Mixins.h1, lineHeight: 36,flex:1}}
                onPress={()=>{
                  this.props.setBottomBar(true);
                  this.props.setWarehouseModule('WAREHOUSE');
                    this.props.navigation.navigate('Details')}}
                    buttonStyle={{backgroundColor: '#FFFFFF',paddingVertical:15, paddingHorizontal: 35}}
                    />
                             
          <Button
          containerStyle={ {marginVertical: 10, borderRadius: 10}}
            icon={() => (
                    <IconVAS height="60" width="60" fill="#ABABAB" />
                )}
                iconContainerStyle={[Mixins.rectDefaultButtonIconStyle,{}]}
                title="VAS"
                titleStyle={{color: '#6C6B6B', ...Mixins.h1, lineHeight: 36,flex:1}}
                onPress={()=>{
                  // // vas navigate
                  // this.props.setBottomBar(true);
                  // this.props.setWarehouseModule('VAS');
                  //   this.props.navigation.navigate('Details');
                }}
                    buttonStyle={{backgroundColor: '#FFFFFF',paddingVertical:15, paddingHorizontal: 35}}
                    />
        </ScrollView>
    );
  };
  drawerLogout = async () => {
    await postData('/auth/logout');
    this.props.removeJwtToken(null);
    popToLogout();
  };
  _CustomDrawerContent = (props) => {
    const {navigation, state} = props;
    let {isDrawer} = this.props;
    const isDrawerOpen = state.history.some((it) => it.type === 'drawer');
    if (this.drawerRef.current) {
      if (isDrawer) {
        navigation.openDrawer();
      } else {
        navigation.closeDrawer();
      }
      this.drawerRef.current = false;
    } else {
      this.props.toggleDrawer(isDrawerOpen);
    }

    return (
      <DrawerContentScrollView
        contentContainerStyle={{
          paddingTop: 0,
          flex: 1,
        }}
        {...props}>
        <SafeAreaView edges={['top']} style={{backgroundColor: '#F1811C'}}>
          <View style={styles.drawerHead}>
            <Avatar
              size={43}
              rounded
              containerStyle={styles.drawerAvatar}
              source={{
                uri:
                  'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
              }}></Avatar>
            <Text style={styles.drawerText}>Operator Name</Text>
          </View>
        </SafeAreaView>
        <DrawerItemList {...props} />
        <DrawerItem label="Logout" onPress={this.drawerLogout} />
        <Text style={styles.versionText}>
          {`Version ${DeviceInfo.getVersion()}`}
        </Text>
      </DrawerContentScrollView>
    );
  };

  _CustomBottomTabContent = (props) => {
    const {navigation, state, descriptors} = props;
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (
      focusedOptions.tabBarVisible === false ||
      this.props.bottomBar === false
    ) {
      return null;
    }
    return <BottomTabBar {...props} />;
  };

  deliveryTab = createCompatNavigatorFactory(createBottomTabNavigator)(
    {
      Home: {
        screen: this.renderView,
        navigationOptions: ({navigation}) => ({
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              onPress={() => {
                navigation.navigate('Home');
              }}
              icon={() => (
                <IconHome7Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        }),
      },
      Notification: {
        screen: Notification,
        navigationOptions: ({navigation}) => ({
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              onPress={() => navigation.navigate('Notification')}
              icon={() => (
                <IconBubble26Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        }),
      },
      Other: {
        screen: Settings,
        navigationOptions: ({navigation}) => ({
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              onPress={() => navigation.navigate('Other')}
              icon={() => (
                <IconGear2Mobile height="22" width="24" fill={color} />
              )}
            />
          ),
        }),
      },
    },
    {
      tabBar: (props) => {
        return this._CustomBottomTabContent(props);
      },
      initialRouteName: 'Home',
      tabBarOptions: {
        shifting: false,
        showLabel: false,
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#6C6B6B',
        tabStyle: {
          paddingVertical: 10,
          justifyContent: 'space-evenly',
        },
        style: {
          height: Platform.OS === 'ios' ? 94 : 64,
          borderWidth: 0.5,
          borderBottomWidth: 1,
          backgroundColor: '#F5F5FB',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderColor: 'transparent',
          overflow: 'hidden',
          paddingHorizontal: (screen.width * 10) / 100,
        },
      },
    },
  );
  render() {
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerStyle={Mixins.verticalBarExpand}
        drawerContent={this._CustomDrawerContent}
        contentContainerStyle={styles.drawerContainer}
        drawerContentOptions={{
          activeBackgroundColor: '#ffffff',
          inactiveBackgroundColor: '#ffffff',
          activeTintColor: '#6C6B6B',
          inactiveTintColor: '#6C6B6B',
          labelStyle: Mixins.button,
          itemStyle: Mixins.verticalBarMargin,
        }}>
        <Drawer.Screen
          name="Notifications"
          component={this.deliveryTab}
          options={{
            drawerIcon: ({focused, color, size}) => (
              <IconBell2Mobile height="20" width="17" fill="#2D2C2C" />
            ),
          }}
        />
        <Drawer.Screen
          name="History"
          component={this.deliveryTab}
          options={{
            drawerIcon: ({focused, color, size}) => (
              <IconTime17Mobile height="20" width="17" fill="#2D2C2C" />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={this.deliveryTab}
          options={{
            drawerIcon: ({focused, color, size}) => (
              <IconGear2Mobile height="20" width="17" fill="#2D2C2C" />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }
}

const styles = {
  sectionSheetButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  buttonDivider: {
    flex: 1,
  },
  sectionInput: {
    flexDirection: 'column',
    borderRadius: 13,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    marginBottom: 30,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  inputHead: {
    marginVertical: 12,
    ...Mixins.h4,
    lineHeight: 27,
  },
  sectionButtonGroup: {
    flexDirection: 'row',
  },
  sectionContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionText: {
    textAlign: 'center',
    width: 83,
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#6C6B6B',
    marginVertical: 12,
  },
  containerInput: {
    borderBottomColor: '#ABABAB',
    borderBottomWidth: 1,
    marginVertical: 0,
    paddingVertical: 0,
  },
  inputStyle: {
    ...Mixins.lineInputDefaultStyle,
    ...Mixins.body1,
    marginHorizontal: 0,
    flexShrink: 1,
    minHeight: 30,
    lineHeight: 21,
    fontWeight: '400',
  },
  labelStyle: {
    ...Mixins.lineInputDefaultLabel,
    ...Mixins.body1,
    lineHeight: 14,
    fontWeight: '400',
  },
  inputErrorStyle: {
    ...Mixins.body2,
    lineHeight: 14,
    marginVertical: 0,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 13,
    elevation: 8,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 0,
  },
  checkmark: {
    position: 'absolute',
    bottom: 62,
    right: 16,
  },
  drawerContainer: {
    paddingTop: 0,
  },
  drawerHead: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#F1811C',
  },
  drawerText: {
    flexShrink: 1,
    ...Mixins.verticalBarExpandText,
    ...Mixins.button,
    color: 'white',
  },
  drawerAvatar: {
    flexShrink: 1,
  },
  versionText: {
    position: 'absolute',
    bottom: 0,
    left: 20,
  },
};
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isPhotoProofSubmitted: state.originReducer.filters.isPhotoProofSubmitted,
    isSignatureSubmitted: state.originReducer.filters.isSignatureSubmitted,
    isDrawer: state.originReducer.filters.isDrawer,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    toggleDrawer: (bool) => {
      return dispatch({type: 'ToggleDrawer', payload: bool});
    },
    signatureSubmittedHandler: (signature) =>
      dispatch({type: 'Signature', payload: signature}),
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setStartDelivered: (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    },
    setWarehouseModule: (toggle) => {
      return dispatch({type: 'warehouseModule', payload: toggle});
    },
    removeJwtToken: (token) => {
      dispatch({type: 'JWTToken', payload: token});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseMenu);
