import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import IconMenu6Mobile from '../../../assets/icon/iconmonstr-menu-6 1mobile.svg';
import IconUser40Mobile from '../../../assets/icon/iconmonstr-user-40mobile.svg';
import IconBell2Mobile from '../../../assets/icon/iconmonstr-bell-2mobile.svg';
import Camera from '../peripheral';
import Manifest from './manifest';
import List from './list';
import ManualInput from './manualInput';
import ReportManifest from './reportManifest';
import ReceivingDetail from './receivingDetail';
import itemDetail from './itemDetail';
import newItem from './newItem';
import Mixins from '../../../mixins';

const Stack = createStackNavigator();
class HomeNavigator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Stack.Navigator initialRouteName="List" screenOptions={{headerBackImage:({tintColor})=>(<IconArrow66Mobile height="22" width="18" fill={tintColor}/>)}}>
        <Stack.Screen
          name="List"
          component={List}
          options={{
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerTitleAlign: 'center',
            headerTitle: () => (
                <Image
                  source={require('../../../assets/dap_logo_hires1thumb.png')}
                  style={{ width: 74, height: 38 }}
                />
            ),
            headerLeft: () => (
              <TouchableOpacity
                style={{paddingHorizontal: 20, margin: 0}}
                onPress={() => this.props.toggleDrawer(true)}
              >
                  <IconMenu6Mobile height="24" width="24" fill="#fff" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{paddingHorizontal: 20, margin: 0}}
                  onPress={() => {}}
                >
                    <IconBell2Mobile height="24" width="24" fill="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{paddingRight: 20, margin: 0}}
                  onPress={() => {}}
                >
                    <IconUser40Mobile height="24" width="24" fill="#fff" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="Manifest"
          component={Manifest}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar('true')
                  this.props.navigation.navigate('List');
                }
              }
              />);
            },
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
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerTitle: 'Back',
            headerRight: () => (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{paddingHorizontal: 20, margin: 0}}
                  onPress={() => this.props.navigation.navigate('ReportManifest')}
                >
                  <Text style={{...Mixins.h6,fontWeight: '400',lineHeight: 22, color: '#FFF'}}>Report</Text>
                </TouchableOpacity>
              </View>
            ),
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
            },
            headerTintColor: '#fff',
            headerTitle: 'Input Manual',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.navigation.navigate('Barcode')
                }
              }
              />);
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
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
          })}
        />
          <Stack.Screen
          name="ReceivingDetail"
          component={ReceivingDetail}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
          })}
        />
          <Stack.Screen
          name="itemDetail"
          component={itemDetail}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
          })}
        />
         <Stack.Screen
          name="newItem"
          component={newItem}
          options={() => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
          })}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    bottomBar: state.originReducer.filters.bottomBar,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeNavigator);