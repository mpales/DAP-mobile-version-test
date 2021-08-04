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
import Camera from '../peripheral';
import Manifest from './manifest';
import List from './list';
import ManualInput from './manualInput';
import ReportManifest from './reportManifest';
import ReceivingDetail from './receivingDetail';
import containerDetail from './containerDetail';
import itemReportDetail from './itemReportDetails';
import newItem from './newItem';
import Mixins from '../../../mixins';
import itemDetail from './itemDetails';
import SingleCamera from '../peripheral/cameraMulti';
import EnlargeImage from '../peripheral/enlargeImage';
import {SafeAreaView} from 'react-native-safe-area-context';
import recordIVAS from './recordIVAS';
import IVAS from './IVAS-list';
import detailIVAS from './IVASDetails';
import newIVAS from './newIVAS';
import PalletList from './putaway/putaway-list';
import PalletDetails from './putaway/palletDetails';
import PalletScanner from '../peripheral/index-inbound-pallet';
import ItemTransitDetail from './itemTransitDetails';
import DetailsDraft from './details/index';
import SupervisorMode from './supervisor/index';

const Stack = createStackNavigator();
class HomeNavigator extends React.Component {
  constructor(props) {
    super(props);
    
    this.setWrapperofStack.bind(this);
  }
  setWrapperofStack = (index,key) => {
    const {indexBottomBar} = this.props;
    if(indexBottomBar === 1 && key !== 'SupervisorMode' && key !== 'SupervisorMode'){
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  }
  render() {
    return (
      <Stack.Navigator initialRouteName="List" screenOptions={{
        headerBackImage:({tintColor})=>(<IconArrow66Mobile height="22" width="18" fill={tintColor}/>),
        headerBackTitleVisible:false,
        headerLeftContainerStyle:  Platform.OS === 'ios' ? {paddingHorizontal: 15} : null,
        header: (props) => {
          let state = props.navigation.dangerouslyGetState();
          let key =  state.routes[state.index].name;
          let index = state.index;
           const {options} = props.scene.descriptor;
          this.setWrapperofStack(index,key);
          return (
        
            <Header {...props} />
          );
        },
        }}>     
        <Stack.Screen
          name="List"
          component={List}
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
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
          name="Manifest"
          component={Manifest}
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
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
          name="PalletList"
          component={PalletList}
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar('true')
                  this.props.navigation.navigate('Home');
                }
              }
              />);
            },
          })}
        />
        <Stack.Screen
          name="PalletDetails"
          component={PalletDetails}
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar('false')
                  this.props.navigation.navigate('PalletList');
                }
              }
              />);
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
              })
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar('false')
                  this.props.navigation.navigate('Manifest');
                }
              }
              />);
            },
          })}
        />
         <Stack.Screen
          name="ItemTransitDetail"
          component={ItemTransitDetail}
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar('false')
                  this.props.navigation.navigate('Manifest');
                }
              }
              />);
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
              })
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar('false')
                  this.props.navigation.goBack();
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerTitle: 'Back',
          })}
        />
         <Stack.Screen
          name="PalletScanner"
          component={PalletScanner}
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerTitle: 'Back',
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
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(false);
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
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.navigation.navigate('Manifest')
                }
              }
              />);
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
          <Stack.Screen
          name="DetailsDraft"
          component={DetailsDraft}
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
            headerShown:false,
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
            <Stack.Screen
          name="SupervisorMode"
          component={SupervisorMode}
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
            headerShown:false,
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
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
              ...Platform.select({
                android: {
                  height: 45,
                },
              })
            },
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
          <Stack.Screen
          name="containerDetail"
          component={containerDetail}
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
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
              ...Platform.select({
                android: {
                  height: 45,
                },
              })
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
             <Stack.Screen
          name="newIVAS"
          component={newIVAS}
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
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
            <Stack.Screen
          name="RecordIVAS"
          component={recordIVAS}
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
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.navigation.navigate('List')
                }
              }
              />);
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
           <Stack.Screen
          name="IVAS"
          component={IVAS}
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
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.navigation.navigate('Manifest')
                }
              }
              />);
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
          <Stack.Screen
          name="detailIVAS"
          component={detailIVAS}
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
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.navigation.navigate('IVAS')
                }
              }
              />);
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
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
              })
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
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
              })
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
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
