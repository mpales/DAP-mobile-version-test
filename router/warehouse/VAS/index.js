import React from 'react';
import {Image, Text, TouchableOpacity, View, Platform} from 'react-native';
import {createStackNavigator, HeaderBackButton, Header} from '@react-navigation/stack';
import {CommonActions} from '@react-navigation/native'
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import Camera from '../peripheral/index-VAS-pallet';
import Barcode from '../peripheral/index-VAS-Disposal';
import List from './list';
import ListDisposal from './list-disposal';
import ListDisposalItem from './list-disposal-item';
import ReportManifest from './reportManifest';
import itemReportDetail from './itemReportDetails';
import Mixins from '../../../mixins';
import SingleCamera from '../peripheral/cameraMulti';
import DisposalCamera from '../peripheral/cameraDisposal';
import EnlargeImage from '../peripheral/enlargeImage';
import EnlargeMedia from '../peripheral/enlargeMedia';
import {SafeAreaView} from 'react-native-safe-area-context';
import ItemTransitDetail from './itemTransitDetails';
import ItemDisposalDetail from './itemDisposalDetails';
import ItemDetail from './itemDetails';
import ManualInput from './manualInput';
import ReportDisposal from './reportDisposal';
import IVASDetail from '../detail/index-VAS';
const Stack = createStackNavigator();
class HomeNavigator extends React.Component {
  _unsubscribe = null;
  _wrapperNavigation = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      type: 'ASN',
    };
    this.setWrapperofStack.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation} = props;
    const {routes,index} =  navigation.dangerouslyGetState();
    if(routes[index].params !== undefined && routes[index].params.type !== undefined){
      return {...state, type:routes[index].params.type  }
    }
    return {...state};
  }
  setWrapperofStack = (index,key) => {
    const {indexBottomBar} = this.props;
    if(indexBottomBar === 0 && key !== 'SupervisorMode' && key !== 'POSMPhoto' && key !== 'DetailsDraft'){
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  }
  updateASN = async ()=>{
    const {activeVAS, completeVAS,ReportedVAS, VASList} = this.props;
    const result = Array.from({length: VASList.length}).map((num,index)=>{
      if(ReportedVAS.includes(VASList[index].number)){
        return {
            ...VASList[index],
            status: 'reported'
        }
      } else if (completeVAS.includes(VASList[index].number)){
        return {
            ...VASList[index],
            status: 'complete',
        };
      } else if(activeVAS.includes(VASList[index].number)){
            return {
                ...VASList[index],
                status : 'progress',
            };
        } else {
            return VASList[index];
        }

    });
    if(Array.isArray(result)){
        return result;
    } else {
        return [];
    }
  }
  async componentDidMount(){
    this._unsubscribe =  this._wrapperNavigation.current.addListener('state', async (event) => {
      // do something
      const {state} = event.data;
      const {index,routes} = state;
      if(routes[index].name === 'ItemVASDetail' ){
        let updatedStatus = await this.updateASN();
        this.props.setVASList(updatedStatus);
      } else  if(routes[index].name === 'ItemDisposalDetail' ){
        let updatedStatus = await this.updateASN();
        this.props.setVASList(updatedStatus);
      }
    });
  }
  componentWillUnmount(){
    this._unsubscribe();
  }
  render() {
    return (
      <Stack.Navigator initialRouteName="IVASDetail" screenOptions={{
        headerBackImage:({tintColor})=>(<IconArrow66Mobile height="22" width="18" fill={tintColor}/>),
        headerBackTitleVisible:true,
        headerBackTitle:'Back',
        headerTitleAlign:'center',
        headerLeftContainerStyle:  Platform.OS === 'ios' ? {paddingHorizontal: 15} : null,
        header: (props) => {
          this._wrapperNavigation.current = props.navigation;
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
          name="IVASDetail"
          component={IVASDetail}
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
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(true)
                  this.props.navigation.navigate('MenuWarehouse');
                }
              }
              />);
            },
          }}
        />
        <Stack.Screen
          name="List"
          initialParams={{type:this.state.type}}
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
            headerTitle: this.state.type.toUpperCase(),
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(true)
                  this.props.navigation.navigate('IVASDetail');
                }
              }
              />);
            },
          }}
        />
      <Stack.Screen
          name="ListDisposal"
          initialParams={{type:this.state.type}}
          component={ListDisposal}
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
            headerTitle: 'Pick Disposal List',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(true)
                  this.props.navigation.navigate('List');
                }
              }
              />);
            },
          }}
        />
      <Stack.Screen
          name="ListDisposalItem"
          initialParams={{type:this.state.type}}
          component={ListDisposalItem}
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
            headerTitle: 'All item',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(false)
                  this.props.navigation.navigate('ItemDisposalDetail');
                }
              }
              />);
            },
          }}
        />
         <Stack.Screen
          name="ItemVASDetail"
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
            headerTitle: this.state.type.toUpperCase() + ' Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(false)
                  this.props.navigation.navigate('List');
                }
              }
              />);
            },
          })}
        />
         <Stack.Screen
          name="ItemDisposalDetail"
          component={ItemDisposalDetail}
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
            headerTitle: this.state.type.toUpperCase() + ' Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(false)
                  this.props.navigation.navigate('ListDisposal');
                }
              }
              />);
            },
          })}
        />
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetail}
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
            headerTitle: 'Report Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(false)
                  this.props.navigation.goBack();
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
            headerTitle: 'Report Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.setBottomBar(false)
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
            headerTitle:'',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
          })}
        />
        <Stack.Screen 
          name="BarcodeDisposal"
          component={Barcode}
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
            headerTitle:'',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
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
            headerTitle:'',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
          })}
        />
        <Stack.Screen
          name="ReportManifest"
          component={ReportManifest}
          options={({navigation}) => ({
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
              const {routes,index} = navigation.dangerouslyGetState();
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  if(routes[index-1].name === 'SupervisorMode'){
                    navigation.navigate('SupervisorMode');
                  } else {
                    this.props.navigation.navigate('ItemDisposalDetail')
                  }
                }
              }
              />);
            },
            headerTintColor: '#fff',
            headerTitle: 'Report',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
        
        <Stack.Screen
          name="ReportDisposal"
          component={ReportDisposal}
          options={({navigation}) => ({
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
              const {routes,index} = navigation.dangerouslyGetState();
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  this.props.navigation.navigate('ListDisposal')
                }
              }
              />);
            },
            headerTintColor: '#fff',
            headerTitle: 'Report',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
     
     <Stack.Screen
          name="DisposalCamera"
          component={DisposalCamera}
          options={({navigation}) => ({
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
              const {routes, index} = navigation.dangerouslyGetState();
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  navigation.navigate(routes[index-1].name,{ submitPhoto: false });
                }
              }
              />);
            },
            headerRight: () => {
              const {routes, index} = navigation.dangerouslyGetState();
              return (
              <Button
                type="clear"
                title="Submit"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0, color: '#fff'}}
                onPress={() =>
                  navigation.navigate(routes[index-1].name,{ submitPhoto: true })}
              />
            )},
            headerTitle:'',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
          <Stack.Screen
          name="SingleCamera"
          component={SingleCamera}
          options={({navigation}) => ({
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
              const {routes, index} = navigation.dangerouslyGetState();
              return(
                <HeaderBackButton  {...props} onPress={()=>{
                  navigation.navigate(routes[index-1].name,{ submitPhoto: false });
                }
              }
              />);
            },
            headerRight: () => {
              const {routes, index} = navigation.dangerouslyGetState();
              return (
              <Button
                type="clear"
                title="Submit"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0, color: '#fff'}}
                onPress={() =>
                  navigation.navigate(routes[index-1].name,{ submitPhoto: true })}
              />
            )},
            headerTitle:'',
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
            headerTitle:'',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
        
          })}
        />
       <Stack.Screen
          name="EnlargeMedia"
          component={EnlargeMedia}
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
            headerTitle:'',
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
    ReportedVAS: state.originReducer.filters.ReportedVAS,
    activeVAS : state.originReducer.filters.activeVAS,
    completeVAS : state.originReducer.filters.completeVAS,
    VASList: state.originReducer.VASList,
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
    setVASList: (data) => {
      return dispatch({type: 'VASList', payload: data});
  },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeNavigator);
