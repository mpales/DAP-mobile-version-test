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
import DeviceInfo from 'react-native-device-info';
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
        if (this.props.keyStack === 'List' && this.props.indexBottomBar === 0) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'WarehouseIn',
          });
          return true;
        } else if (
          this.props.keyStack === 'Manifest' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'List'});
          return true;
        } else if (
          this.props.keyStack === 'ReceivingDetail' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'List'});
          return true;
        } else if (
          prevProps.keyStack === 'Manifest' &&
          this.props.keyStack === 'Barcode' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          this.props.keyStack === 'CompleteReceiving' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          this.props.keyStack === 'Completed' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'List'});
          return true;
        } else if (
          prevProps.keyStack === 'WarehouseIn' &&
          this.props.keyStack === 'Barcode' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'WarehouseIn',
          });
          return true;
        } else if (
          this.props.keyStack === 'Barcode' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          this.props.keyStack === 'ReportManifest' && prevProps.keyStack === 'ManifestSupervisor' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'ManifestSupervisor',
          });
          return true;
        } else if (
          this.props.keyStack === 'ReportManifest' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          this.props.keyStack === 'ItemDetail' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          this.props.keyStack === 'ItemTransitDetail' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          this.props.keyStack === 'ItemReportDetail' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'ItemDetail',
          });
          return true;
        } else if (
          this.props.keyStack === 'ManualInput' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          this.props.keyStack === 'containerDetail' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          this.props.keyStack === 'newItem' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {screen: 'Manifest'});
          return true;
        } else if (
          prevProps.keyStack === 'ReceivingDetail' &&
          this.props.keyStack === 'SingleCamera' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'ReceivingDetail',
            params: {submitPhoto: false},
          });
          return true;
        } else if (
          prevProps.keyStack === 'ReportManifest' &&
          this.props.keyStack === 'SingleCamera' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'ReportManifest',
            params: {submitPhoto: false},
          });
          return true;
        } else if (
          prevProps.keyStack === 'CompleteReceiving' &&
          this.props.keyStack === 'SingleCamera' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'CompleteReceiving',
            params: {submitPhoto: false},
          });
          return true;
        } else if (
          prevProps.keyStack === 'PalletDetails' &&
          this.props.keyStack === 'PalletScanner' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PalletDetails',
          });
          return true;
        } else if (
          prevProps.keyStack === 'PutawayItemDetails' &&
          this.props.keyStack === 'PalletScanner' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PutawayItemDetails',
          });
          return true;
        } else if (
          prevProps.keyStack === 'PutawayTransitDetails' &&
          this.props.keyStack === 'PalletScanner' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PutawayTransitDetails',
          });
          return true;
        } else if (
          this.props.keyStack === 'ManualPallet' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PalletScanner',
          });
          return true;
        } else if (
          this.props.keyStack === 'POSMCameraMulti' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'Barcode',
            params: {upload: false},
          });
          return true;
        } else if (
          this.props.keyStack === 'PalletDetails' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PutawayPallet',
          });
          return true;
        } else if (
          this.props.keyStack === 'PutawayTransitDetails' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PalletList',
          });
          return true;
        } else if (
          this.props.keyStack === 'PutawayItemDetails' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PutawayItem',
          });
          return true;
        }else if (
          this.props.keyStack === 'PutawayItem' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PalletList',
          });
          return true;
        }else if (
          this.props.keyStack === 'PutawayPallet' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'PalletList',
          });
          return true;
        } else if (
          this.props.keyStack === 'PalletList' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'WarehouseIn',
          });
          return true;
        } else if (
          this.props.keyStack === 'ListSupervisor' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'WarehouseIn',
          });
          return true;
        } else if (
          this.props.keyStack === 'ManifestSupervisor' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'ListSupervisor',
          });
          return true;
        } else if (
          this.props.keyStack === 'CompletedSupervisor' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'ListSupervisor',
          });
          return true;
        } else if (
          this.props.keyStack === 'PhotosDraftSPV' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'ManifestSupervisor',
          });
          return true;
        } else if (
          this.props.keyStack === 'ReportDetailsSPV' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'ManifestSupervisor',
          });
          return true;
        } else if (
          this.props.keyStack === 'ReportSingleDetailsSPV' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'ReportDetailsSPV',
          });
          return true;
        } else if (
          this.props.keyStack === 'IVASListSPV' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'ManifestSupervisor',
          });
          return true;
        } else if (
          this.props.keyStack === 'IVASDetailsSPV' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'IVASListSPV',
          });
          return true;
        } else if (
          this.props.keyStack === 'UpdateIVAS' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('SupervisorMode', {
            screen: 'IVASDetailsSPV',
          });
          return true;
        } else if (
          this.props.keyStack === 'ManifestDetails' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('Inbound', {
            screen: 'ReceivingDetail',
          });
          return true;
        } else if (
          this.props.keyStack === 'PhotosDraft' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('DetailsDraft', {
            screen: 'ManifestDetails',
          });
          return true;
        } else if (
          this.props.keyStack === 'ItemDraftDetails' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('DetailsDraft', {
            screen: 'ManifestDetails',
          });
          return true;
        } else if (
          this.props.keyStack === 'CameraMulti' &&
          this.props.indexBottomBar === 0
        ) {
          return false;
        } else if (
          this.props.keyStack === 'ItemTransitDraftDetail' &&
          this.props.indexBottomBar === 0
        ) {
          this.navigationRef.current.navigate('DetailsDraft', {
            screen: 'ManifestDetails',
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
        this.props.keyStack === 'WarehouseIn'
      ) {
        this.props.setBottomBar(true);
      }
      if (this.props.keyStack === 'List' && this.props.indexBottomBar === 0) {
        this.props.setBottomBar(true);
      }
      if (
        this.props.keyStack === 'ReceivingDetail' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'Manifest' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'Barcode' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ItemProcess' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'itemDetail' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'newItem' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ReportManifest' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ManualInput' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (this.props.keyStack === 'List' && this.props.indexBottomBar === 1) {
        this.props.setBottomBar(true);
      }
      if (this.props.keyStack === 'Chat' && this.props.indexBottomBar === 1) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'PalletScanner' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ManualPallet' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'PalletDetails' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'PutawayTransitDetails' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'PutawayItemDetails' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'PutawayItem' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'PutawayPallet' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'PalletList' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ListSupervisor' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ManifestSupervisor' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'PhotosDraftSPV' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'CompleteReceiving' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'Completed' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'CompletedSupervisor' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ReportSingleDetailsSPV' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ReportDetailsSPV' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'IVASListSPV' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }

      if (
        this.props.keyStack === 'IVASDetailsSPV' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }

      if (
        this.props.keyStack === 'UpdateIVAS' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }

      if (
        this.props.keyStack === 'ManifestDetails' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(true);
      }
      if (
        this.props.keyStack === 'CameraMulti' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'enlargeImage' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'EnlargeImage' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'SingleCamera' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ItemDraftDetails' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'UpdatePhotos' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'ItemTransitDraftDetail' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'POSMEnlargeImage' &&
        this.props.indexBottomBar === 0
      ) {
        this.props.setBottomBar(false);
      }
      if (
        this.props.keyStack === 'POSMCameraMulti' &&
        this.props.indexBottomBar === 0
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
        {...filteredProps}
        contentContainerStyle={{
          paddingTop: 0,
          flex: 1,
        }}>
        <SafeAreaView edges={['top']} style={{backgroundColor: '#F1811C'}}>
          <View style={styles.drawerHead}>
            <Avatar
              size={43}
              rounded
              containerStyle={styles.drawerAvatar}
              source={{
                uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
              }}></Avatar>
            <Text style={styles.drawerText}>Operator Name</Text>
          </View>
        </SafeAreaView>
        <DrawerItemList {...filteredProps} />
        <DrawerItem label="Logout" onPress={this.drawerLogout} />
        <Text style={styles.versionText}>
          {`Version ${DeviceInfo.getVersion()}`}
        </Text>
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
      Inbound: {
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
                navigation.navigate('Inbound', {screen: 'WarehouseIn'});
              }}
              icon={() => (
                <IconNote19Mobile height="22" width="24" fill={color} />
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
      initialRouteName: 'Inbound',
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
