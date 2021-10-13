import React from 'react';
import {Image, Text, TouchableOpacity, View, Platform} from 'react-native';
import {
  createStackNavigator,
  HeaderBackButton,
  Header,
} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import IconMenu6Mobile from '../../../assets/icon/iconmonstr-menu-6 1mobile.svg';
import IconUser40Mobile from '../../../assets/icon/iconmonstr-user-40mobile.svg';
import IconBell2Mobile from '../../../assets/icon/iconmonstr-bell-2mobile.svg';
import Camera from '../peripheral/index-outbound';
import Task from './task';
import List from './list';
import itemDetail from './itemDetails';
import itemReportDetail from './itemReportDetails';
import ManualInput from './manualInput';
import ReportManifest from './reportManifest';
import Mixins from '../../../mixins';
import SingleCamera from '../peripheral/cameraMulti';
import EnlargeImage from '../peripheral/enlargeImage';
import WarehouseOut from '../detail/index-outbound';
import {SafeAreaView} from 'react-native-safe-area-context';

const Stack = createStackNavigator();
class HomeNavigator extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperofStack.bind(this);
  }
  setWrapperofStack = (index, key) => {
    const {indexBottomBar} = this.props;
    if (indexBottomBar === 0) {
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  };
  render() {
    return (
      <Stack.Navigator
        initialRouteName="WarehouseOut"
        headerMode="float"
        screenOptions={{
          headerBackImage: ({tintColor}) => (
            <IconArrow66Mobile height="22" width="18" fill={tintColor} />
          ),
          headerBackTitleVisible: true,
          headerBackTitle: 'Back',
          headerLeftContainerStyle:
            Platform.OS === 'ios' ? {paddingHorizontal: 15} : null,
          header: (props) => {
            let state = props.navigation.dangerouslyGetState();
            let key = state.routes[state.index].name;
            let index = state.index;
            const {options} = props.scene.descriptor;
            this.setWrapperofStack(index, key);
            return <Header {...props} />;
          },
        }}>
        <Stack.Screen
          name="WarehouseOut"
          component={WarehouseOut}
          options={{
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerShown: false,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar('true');
                    this.props.navigation.navigate('Home');
                  }}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="Task"
          component={Task}
          options={{
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitle: 'Pick Task',
            headerTitleAlign: 'center',
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar('true');
                    this.props.navigation.navigate('WarehouseOut');
                  }}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="List"
          component={List}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTintColor: '#fff',
            headerTitle: 'Pick List',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitleAlign: 'center',
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar('true');
                    this.props.navigation.navigate('Task');
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="ItemDetail"
          component={itemDetail}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTintColor: '#fff',
            headerTitle: 'Product Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitleAlign: 'center',
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar('false');
                    this.props.navigation.navigate('List');
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="ItemReportDetail"
          component={itemReportDetail}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTintColor: '#fff',
            headerTitle: 'Report Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitleAlign: 'center',
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar('false');
                    this.props.navigation.goBack();
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="ManualInput"
          component={ManualInput}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTintColor: '#fff',
            headerTitle: 'Input Manual',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitleAlign: 'center',
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.navigation.navigate('List');
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="ReportManifest"
          component={ReportManifest}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTintColor: '#fff',
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.navigation.navigate('List');
                  }}
                />
              );
            },
            headerTitle: 'Report',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitleAlign: 'center',
          })}
        />
        <Stack.Screen
          name="Barcode"
          component={Camera}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerTitle: '',
            headerRight: () => (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{paddingHorizontal: 20, margin: 0}}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('ReportManifest');
                  }}>
                  <Text
                    style={{
                      ...Mixins.h6,
                      fontWeight: '400',
                      lineHeight: 22,
                      color: '#FFF',
                    }}>
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="SingleCamera"
          component={SingleCamera}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitle: '',
          })}
        />
        <Stack.Screen
          name="EnlargeImage"
          component={EnlargeImage}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              ...Platform.select({
                android: {
                  height: 45,
                },
              }),
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitle: '',
          })}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    indexBottomBar: state.originReducer.filters.indexBottomBar,
    keyBottomBar: state.originReducer.filters.keyBottomBar,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeNavigator);
