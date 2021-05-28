import React from 'react';
import {Image, Text, TouchableOpacity, View, Platform} from 'react-native';
import {createStackNavigator, HeaderBackButton, Header} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import IconMenu6Mobile from '../../../assets/icon/iconmonstr-menu-6 1mobile.svg';
import IconUser40Mobile from '../../../assets/icon/iconmonstr-user-40mobile.svg';
import IconBell2Mobile from '../../../assets/icon/iconmonstr-bell-2mobile.svg';
import Scanner from '../scanner';
import Camera from '../peripheral/index-outbound';
import Task from './task';
import List from './list';
import Completed from './detail-completed';
import Reported from './detail-reported';
import ManualInput from './manualInput';
import ReportManifest from './reportManifest';
import Mixins from '../../../mixins';

const Stack = createStackNavigator();
class HomeNavigator extends React.Component {
  constructor(props) {
    super(props);
    
    this.setWrapperofStack.bind(this);
  }
  setWrapperofStack = (index,key) => {
    const {indexBottomBar} = this.props;
    if(indexBottomBar === 1){
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  }
  render() {
    return (
      <Stack.Navigator initialRouteName="Task" screenOptions={{
        headerBackImage:({tintColor})=>(<IconArrow66Mobile height="22" width="18" fill={tintColor}/>),
        headerBackTitleVisible:false,
        headerLeftContainerStyle:  Platform.OS === 'ios' ? {paddingHorizontal: 15} : null,
        header: (props) => {
          let state = props.navigation.dangerouslyGetState();
          let key =  state.routes[state.index].name;
          let index = state.index;
          this.setWrapperofStack(index,key);
          return (
            <Header
            {...props}/>
          );
        },
        }}>     
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
              })
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
            ...Platform.select({
              ios: {
                marginHorizontal: 20,
              },
            })
          },
            headerTitleAlign: 'left',
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar('true')
                  this.props.navigation.navigate('Home');
                }
              }
              />);
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
              })
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
            ...Platform.select({
              ios: {
                marginHorizontal: 20,
              },
            })
            },
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
              ...Platform.select({
                android: {
                  height: 45,
                },
              })
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
            ...Platform.select({
              ios: {
                marginHorizontal: 20,
              },
            })
            },
            headerTitle: 'Back',
            headerRight: () => (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{paddingHorizontal: 20, margin: 0}}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('ReportManifest')}}
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
              ...Platform.select({
                android: {
                  height: 45,
                },
              })
            },
            headerTintColor: '#fff',
            headerTitle: 'Input Manual',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
            ...Platform.select({
              ios: {
                marginHorizontal: 20,
              },
            })  
          },
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
              ...Platform.select({
                android: {
                  height: 45,
                },
              })
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
            ...Platform.select({
              ios: {
                marginHorizontal: 20,
              },
            })
          },
          })}
        />
         <Stack.Screen
          name="Scanner"
          component={Scanner}
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
              })
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
            ...Platform.select({
              ios: {
                marginHorizontal: 20,
              },
            })
            },
            headerTitle: 'Back',
            headerRight: () => (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{paddingHorizontal: 20, margin: 0}}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('ReportManifest')}}
                >
                  <Text style={{...Mixins.h6,fontWeight: '400',lineHeight: 22, color: '#FFF'}}>Report</Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
          <Stack.Screen
          name="Reported"
          component={Reported}
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
              })
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
            ...Platform.select({
              ios: {
                marginHorizontal: 20,
              },
            })
          },
          })}
        />
         <Stack.Screen
          name="Completed"
          component={Completed}
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
              })
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
            ...Platform.select({
              ios: {
                marginHorizontal: 20,
              },
            })
          },
          })}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    indexBottomBar : state.originReducer.filters.indexBottomBar,
    keyBottomBar : state.originReducer.filters.keyBottomBar,
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