import React from 'react';
import {
  TextInput,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  InteractionManager,
  Platform,
} from 'react-native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {
  CommonActions,
  NavigationRouteContext,
  NavigationContext,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabItem from '@react-navigation/bottom-tabs/src/views/BottomTabItem';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {AnyAction, Dispatch} from 'redux';
import {connect} from 'react-redux';
import CCM from '.';
import Settings from '../settings/index';
import Notification from '../notification';
import {Button, Avatar} from 'react-native-elements';
import IconHome7Mobile from '../../../assets/icon/iconmonstr-home-7mobile.svg';
import IconNote19Mobile from '../../../assets/icon/iconmonstr-shipping-box-8mobile.svg';
import IconBubble26Mobile from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconGear2Mobile from '../../../assets/icon/iconmonstr-gear-2mobile.svg';
import IconBell2Mobile from '../../../assets/icon/iconmonstr-bell-2mobile.svg';
import IconTime17Mobile from '../../../assets/icon/iconmonstr-time-17 1mobile.svg';
import IconLogout2Mobile from '../../../assets/icon/iconmonstr-log-out-2 2mobile.svg';
import IconVAS from '../../../assets/icon/iconmonstr-delivery-15mobile.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {popToLogout} from '../../../component/helper/persist-login';
import Mixins from '../../../mixins';
import {ReactReduxContext} from 'react-redux';
import {postData} from '../../../component/helper/network';
const screen = Dimensions.get('window');
const Drawer = createDrawerNavigator();

class WarehouseNavigator extends React.Component {
  _backHandlerRegisterToBottomBar = null;
  constructor(props) {
    super(props);
    this.drawerRef = React.createRef();
    this.bottomUpdateRef = React.createRef();
    this.navigationRef = React.createRef();

    this._CustomBottomTabContent.bind(this);
    this._CustomDrawerContent.bind(this);
    this.setWrapperofNavigation.bind(this);
    this.backActionFilterBottomBar.bind(this);
    this._refreshFromBackHandle.bind(this);
    this.drawerLogout.bind(this);
  }

  deliveryRoute = () => {
    let Route = '';
    if (this.props.userRole.type === 'Warehouse') {
      Route = 'delivery';
    } else if (this.props.userRole.type === 'Delivery') {
      Route = 'Delivery';
    } else {
      Route = 'Delivery';
    }
    return Route;
  };
  backActionFilterBottomBar = () => {
    this.props.setBottomBar(true);

    /**
     * Returning false will let the event to bubble up & let other event listeners
     * or the system's default back action to be executed.
     */
    return false;
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isDrawer !== this.props.isDrawer) {
      this.drawerRef.current = true;
    } else {
      this.drawerRef.current = false;
    }

    if (
      this.props.bottomBar !== nextProps.bottomBar &&
      this.props.indexBottomBar === nextProps.indexBottomBar
    ) {
      this.navigationRef.current.dispatch((state) => {
        const routes = state.routes;
        return CommonActions.reset({
          ...state,
          routes,
          index: state.index,
        });
      });
      this.bottomUpdateRef.current = true;
    }

    return true;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this._backHandlerRegisterToBottomBar !== null) {
      this._backHandlerRegisterToBottomBar.remove();
    }
    this._backHandlerRegisterToBottomBar = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        this._refreshFromBackHandle();
        if (
          this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'IVASDetail'
        ) {
          this.navigationRef.current.navigate('MenuWarehouse');
          return true;
        } else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'List'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'IVASDetail',
          });
          return true;
        } else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ItemVASDetail'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'List',
          });
          return true;
        } else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ItemDisposalDetail'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ListDisposal',
          });
          return true;
        } else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ItemReportDetail'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ItemDetails',
          });
          return true;
        } else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ItemDetails' && prevProps.keyStack === 'ListDisposal'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ListDisposal',
          });
          return true;
        } else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ItemDetails' && prevProps.keyStack === 'ListDisposalItem'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ListDisposalItem',
          });
          return true;
        }else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'Barcode'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ItemVASDetail',
          });
          return true;
        } else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'BarcodeDisposal'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ListDisposal',
          });
          return true;
        }else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ReportManifest'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ItemDisposalDetail',
          });
          return true;
        }else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ReportDisposal'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ListDisposal',
          });
          return true;
        }else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ManualInput'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'BarcodeDisposal',
          });
          return true;
        }else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ListDisposal'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'List',
          });
          return true;
        } else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'ListDisposalItem'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ItemDisposalDetail',
          });
          return true;
        }else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'DisposalCamera'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'ItemDisposalDetail',
          });
          return true;
        }else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'EnlargeImage'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'SingleCamera',
          });
          return true;
        }else if (
          this.props.indexBottomBar === 0 && this.props.keyStack === 'EnlargeMedia'
        ) {
          this.navigationRef.current.navigate('VAS', {
            screen: 'SingleCamera',
          });
          return true;
        }
        return false;
      },
    );
  }

  _refreshFromBackHandle = () => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (this.props.keyStack === 'MenuWarehouse') {
        this.props.setBottomBar(true);
        if (this._backHandlerRegisterToBottomBar !== null) {
          this._backHandlerRegisterToBottomBar.remove();
        }
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'IVASDetail'
      ) {
        this.props.setBottomBar(true);
      }
      if (this.props.indexBottomBar === 0 && this.props.keyStack === 'List') {
        this.props.setBottomBar(true);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ItemVASDetail'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ItemDisposalDetail'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ItemReportDetail'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'Barcode'
      ) {
        this.props.setBottomBar(false);
      } 
       if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'BarcodeDisposal'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ReportManifest'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'DisposalCamera'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'SingleCamera'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'SingleCamera'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'EnlargeMedia'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ReportDisposal'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ManualInput'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ItemDetails'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ListDisposalItem'
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.indexBottomBar === 0 &&
        this.props.keyStack === 'ListDisposal'
      ) {
        this.props.setBottomBar(false);
      }
    });
    return () => interactionPromise.cancel();
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
    const filteredProps = {
      ...props,
      state: {
        ...props.state,
        routeNames: props.state.routeNames.filter((routeName) => {
          routeName !== 'HomeDrawer';
        }),
        routes: props.state.routes.filter(
          (route) => route.name !== 'HomeDrawer',
        ),
      },
    };
    return (
      <DrawerContentScrollView
        contentContainerStyle={{
          paddingTop: 0,
        }}
        {...filteredProps}>
        <SafeAreaView edges={['top']} style={{backgroundColor: '#F1811C'}}>
          <View style={styles.drawerHead}>
            <Avatar
              size={43}
              rounded
              containerStyle={styles.drawerAvatar}
              source={{
                uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
              }}></Avatar>
            <Text style={styles.drawerText}>Driver Name</Text>
          </View>
        </SafeAreaView>
        <DrawerItemList {...filteredProps} />
        <DrawerItem label="Logout" onPress={this.drawerLogout} />
      </DrawerContentScrollView>
    );
  };
  deliveryScreen = () => {
    return createCompatNavigatorFactory(createStackNavigator)({
      Home: {screen: this.props.component},
    });
  };
  setWrapperofNavigation = (navigation, index, key) => {
    if (!this.navigationRef.current) {
      this.navigationRef.current = navigation;
    }

    if (this.bottomUpdateRef.current) {
      this.bottomUpdateRef.current = false;
    } else {
      this.props.setKeyBottom(key);
      this.props.setIndexBottom(index);
    }
  };
  _CustomBottomTabContent = (props) => {
    const {navigation, state, descriptors} = props;
    const focusedRoute = state.routes[state.index];
    const focusedDescriptor = descriptors[focusedRoute.key];
    const focusedOptions = focusedDescriptor.options;
    const {tabBarActiveBackgroundColor, tabBarInactiveBackgroundColor} =
      focusedOptions;
    const tabBarActiveTintColor = props.activeTintColor;
    const tabBarInactiveTintColor = props.inactiveTintColor;
    this.setWrapperofNavigation(
      navigation,
      state.index,
      state.routes[state.index].name,
    );
    if (
      focusedOptions.tabBarVisible === false ||
      this.props.bottomBar === false
    ) {
      return null;
    }

    return (
      <View style={{...props.style, flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            justifyContent: 'space-evenly',
          }}>
          <Button
            buttonStyle={{backgroundColor: 'transparent'}}
            onPress={() => navigation.navigate('MenuWarehouse')}
            icon={() => (
              <IconHome7Mobile height="22" width="24" fill={'#6C6B6B'} />
            )}
          />
        </TouchableOpacity>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const accessibilityLabel =
            options.tabBarAccessibilityLabel !== undefined
              ? options.tabBarAccessibilityLabel
              : typeof label === 'string' && Platform.OS === 'ios'
              ? `${label}, tab, ${index + 1} of ${state.routes.length}`
              : undefined;
          return (
            <NavigationContext.Provider
              key={route.key}
              value={descriptors[route.key].navigation}>
              <NavigationRouteContext.Provider value={route}>
                <BottomTabItem
                  route={route}
                  focused={isFocused}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityLabel={accessibilityLabel}
                  testID={options.tabBarTestID}
                  allowFontScaling={options.tabBarAllowFontScaling}
                  activeTintColor={tabBarActiveTintColor}
                  inactiveTintColor={tabBarInactiveTintColor}
                  activeBackgroundColor={tabBarActiveBackgroundColor}
                  inactiveBackgroundColor={tabBarInactiveBackgroundColor}
                  button={options.tabBarButton}
                  icon={
                    options.tabBarIcon ??
                    (({color, size}) => (
                      <MissingIcon color={color} size={size} />
                    ))
                  }
                  badge={options.tabBarBadge}
                  badgeStyle={options.tabBarBadgeStyle}
                  label={label}
                  showLabel={false}
                  labelStyle={options.tabBarLabelStyle}
                  iconStyle={options.tabBarIconStyle}
                  style={options.tabBarItemStyle}
                />
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          );
        })}
      </View>
    );
  };
  deliveryTab = createCompatNavigatorFactory(createBottomTabNavigator)(
    {
      VAS: {
        screen: CCM,
        navigationOptions: ({navigation}) => ({
          tabBarIcon: ({color, focused}) => (
            <Button
              buttonStyle={
                focused
                  ? {backgroundColor: '#F07120'}
                  : {backgroundColor: 'transparent'}
              }
              onPress={() => {
                navigation.navigate('VAS', {screen: 'IVASDetail'});
              }}
              icon={() => <IconVAS height="22" width="24" fill={color} />}
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
      initialRouteName: 'VAS',
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
        initialRouteName="HomeDrawer"
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
          name="HomeDrawer"
          component={this.deliveryTab}
          options={{
            drawerIcon: ({focused, color, size}) => (
              <IconBell2Mobile height="20" width="17" fill="#2D2C2C" />
            ),
          }}
        />
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
};
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isDrawer: state.originReducer.filters.isDrawer,
    bottomBar: state.originReducer.filters.bottomBar,
    indexBottomBar: state.originReducer.filters.indexBottomBar,
    keyBottomBar: state.originReducer.filters.keyBottomBar,
    keyStack: state.originReducer.filters.keyStack,
    indexStack: state.originReducer.filters.indexStack,
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
    setIndexBottom: (num) => {
      return dispatch({type: 'indexBottom', payload: num});
    },
    setKeyBottom: (string) => {
      return dispatch({type: 'keyBottom', payload: string});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    removeJwtToken: (token) => {
      dispatch({type: 'JWTToken', payload: token});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseNavigator);
