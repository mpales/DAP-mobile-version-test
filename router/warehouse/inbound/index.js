import React from 'react';
import {Image, Text, TouchableOpacity, View, Platform} from 'react-native';
import {
  createStackNavigator,
  HeaderBackButton,
  Header,
} from '@react-navigation/stack';
import {CommonActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import IconMenu6Mobile from '../../../assets/icon/iconmonstr-menu-6 1mobile.svg';
import IconUser40Mobile from '../../../assets/icon/iconmonstr-user-40mobile.svg';
import IconBell2Mobile from '../../../assets/icon/iconmonstr-bell-2mobile.svg';
import Camera from '../peripheral';
import ItemProcess from './itemProcess';
import Manifest from './manifest';
import List from './list';
import ManualInput from './manualInput';
import ManualRegister from './manualInput-register';
import ManualPallet from './manualInput-pallet';
import ReportManifest from './reportManifest';
import ReceivingDetail from './receivingDetail';
import containerDetail from './containerDetail';
import itemReportDetail from './itemReportDetails';
import newItem from './newItem';
import Mixins from '../../../mixins';
import itemDetail from './itemDetails';
// typescript as error check
// import {default as itemDetail} from './itemDetails';
// let b :itemDetail<React.ComponentType> = itemDetail;
import SingleCamera from '../peripheral/cameraMulti';
import EnlargeImage from '../peripheral/enlargeImage';
import EnlargePhoto from '../peripheral/enlargePhoto';
import viewPhoto from './attributes/photos';
import {SafeAreaView} from 'react-native-safe-area-context';
import recordIVAS from './recordIVAS';
import IVAS from './IVAS-list';
import detailIVAS from './IVASDetails';
import newIVAS from './newIVAS';
import PalletList from './putaway/putaway-list';
import PutawayPallet from './putaway/putaway-pallet';
import PutawayItem from './putaway/putaway-item';
import PutawayTransitDetails from './putaway/transitDetails';
import PutawayItemDetails from './putaway/itemDetails.js';
import PalletDetails from './putaway/palletDetails';
import PalletScanner from '../peripheral/index-inbound-pallet';
import ItemTransitDetail from './itemTransitDetails';
import DetailsDraft from './details/index';
import SupervisorMode from './supervisor/index';
import RegisterBarcode from '../peripheral/index-inbound-register';
import POSMPhoto from '../peripheral/POSMPhoto/index';
import CompleteReceiving from './complete-receiving';
import Completed from './completed';
import WarehouseIn from '../detail/index-inbound';
import updatePhoto from '../peripheral/updatePhoto';
import completeReceiving from './complete-receiving';

const Stack = createStackNavigator();
class HomeNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'ASN',
    };
    this.setWrapperofStack.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {navigation} = props;
    const {routes, index} = navigation.dangerouslyGetState();
    if (
      routes[index].params !== undefined &&
      routes[index].params.type !== undefined
    ) {
      return {...state, type: routes[index].params.type};
    }
    return {...state};
  }
  setWrapperofStack = (index, key) => {
    const {indexBottomBar} = this.props;
    if (
      indexBottomBar === 0 &&
      key !== 'SupervisorMode' &&
      key !== 'POSMPhoto' &&
      key !== 'DetailsDraft'
    ) {
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  };
  render() {
    return (
      <Stack.Navigator
        initialRouteName="WarehouseIn"
        screenOptions={{
          headerBackImage: ({tintColor}) => (
            <IconArrow66Mobile height="22" width="18" fill={tintColor} />
          ),
          headerBackTitleVisible: true,
          headerBackTitle: 'Back',
          headerTitleAlign: 'center',
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
          name="WarehouseIn"
          component={WarehouseIn}
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
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('MenuWarehouse');
                  }}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="List"
          initialParams={{type: this.state.type}}
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
              }),
            },
            headerTintColor: '#fff',
            headerTitle: this.state.type.toUpperCase(),
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('WarehouseIn');
                  }}
                />
              );
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
              }),
            },
            headerTintColor: '#fff',
            headerTitle: this.state.type.toUpperCase(),
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('List');
                  }}
                />
              );
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
              }),
            },
            headerTintColor: '#fff',
            headerTitle: 'Put-Away',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('WarehouseIn');
                  }}
                />
              );
            },
          })}
        />
            <Stack.Screen
          name="PutawayPallet"
          component={PutawayPallet}
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
            headerTitle: 'Pallet List',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('PalletList');
                  }}
                />
              );
            },
          })}
        />
            <Stack.Screen
          name="PutawayItem"
          component={PutawayItem}
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
            headerTitle: 'Item List',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('PalletList');
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="PutawayTransitDetails"
          component={PutawayTransitDetails}
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
            headerTitle: 'Pallet Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('PalletList');
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="PutawayItemDetails"
          component={PutawayItemDetails}
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
            headerTitle: 'Item Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('PutawayItem');
                  }}
                />
              );
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
              }),
            },
            headerTintColor: '#fff',
            headerTitle: 'Pallet Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('PutawayPallet');
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

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('Manifest');
                  }}
                />
              );
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
              }),
            },
            headerTintColor: '#fff',
            headerTitle: 'Transit Item Details',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('Manifest');
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

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('ItemDetail');
                  }}
                />
              );
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
              }),
            },
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
          })}
        />
        <Stack.Screen
          name="ItemProcess"
          component={ItemProcess}
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
            headerTitle: 'Process Item',
            headerTransparent: false,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
          })}
        />
        <Stack.Screen
          name="RegisterBarcode"
          component={RegisterBarcode}
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
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
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
              }),
            },
            headerTitle: '',
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
              }),
            },
            headerTintColor: '#fff',
            headerTitle: 'Manual Barcode',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('Barcode');
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="ManualRegister"
          component={ManualRegister}
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
            headerTitle: 'Manual Register',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('RegisterBarcode');
                  }}
                />
              );
            },
          })}
        />
        <Stack.Screen
          name="ManualPallet"
          component={ManualPallet}
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
            headerTitle: 'Manual Register',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},

            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('PalletScanner');
                  }}
                />
              );
            },
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
              }),
            },
            headerLeft: (props) => {
              const {routes, index} = navigation.dangerouslyGetState();
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    if (routes[index - 1].name === 'SupervisorMode') {
                      navigation.navigate('SupervisorMode');
                    } else {
                      this.props.navigation.navigate('Manifest');
                    }
                  }}
                />
              );
            },
            headerTintColor: '#fff',
            headerTitle: 'Report',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
          })}
        />
        <Stack.Screen
          name="DetailsDraft"
          initialParams={{type: this.state.type}}
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
              }),
            },
            headerShown: false,
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
              }),
            },
            headerShown: false,
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
              }),
            },
            headerTintColor: '#fff',
            headerTitle: this.state.type.toUpperCase(),
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
              }),
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
              }),
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitle: 'Record',
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
              }),
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
              }),
            },
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.navigation.navigate('Manifest');
                  }}
                />
              );
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitle: 'Shipment VAS',
          })}
        />
        <Stack.Screen
          name="CompleteReceiving"
          component={completeReceiving}
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
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.navigation.navigate('Manifest');
                  }}
                />
              );
            },
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitle: 'Complete Receiving',
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
              }),
            },
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
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
            headerTitle: 'Completed',
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
              }),
            },
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.navigation.navigate('Manifest');
                  }}
                />
              );
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
              }),
            },
            headerLeft: (props) => {
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    this.props.navigation.navigate('IVAS');
                  }}
                />
              );
            },
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
              }),
            },
            headerLeft: (props) => {
              const {routes, index} = navigation.dangerouslyGetState();
              return (
                <HeaderBackButton
                  {...props}
                  onPress={() => {
                    navigation.navigate(routes[index - 1].name, {
                      submitPhoto: false,
                    });
                  }}
                />
              );
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
                    navigation.navigate(routes[index - 1].name, {
                      submitPhoto: true,
                    })
                  }
                />
              );
            },
            headerTitle: '',
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
              }),
            },
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
          })}
        />
        <Stack.Screen
          name="EnlargePhoto"
          component={EnlargePhoto}
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
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
          })}
        />
        <Stack.Screen
          name="ViewPhotoAttributes"
          component={viewPhoto}
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
            headerTitle: 'Photo',
            headerTransparent: false,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
          })}
        />
        <Stack.Screen
          name="POSMPhoto"
          component={POSMPhoto}
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
            headerShown: false,
            headerTintColor: '#fff',
            headerTitle: 'Back',
            headerTitleStyle: {...Mixins.h6, fontWeight: '400', lineHeight: 22},
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
