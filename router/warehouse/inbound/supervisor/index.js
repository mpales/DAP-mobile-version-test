/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StyleSheet, ScrollView, View, Keyboard} from 'react-native';
import {Card, SearchBar} from 'react-native-elements';
import {Dimensions, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AnyAction, Dispatch} from 'redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import IconArrow66Mobile from '../../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {
  createStackNavigator,
  Header,
  HeaderBackButton,
} from '@react-navigation/stack';
import SupervisorList from './list';
import SupervisorManifest from './manifest';
import PhotosDraftSPV from './photos';
import ReportDetailsSPV from './itemReportDetails';
import ReportSingleDetailsSPV from './singleReportDetails';
import IVASDetailsSPV from './IVASDetails';
import IVASListSPV from './IVASList';
import UpdateIVAS from './updateIVAS';
import Mixins from '../../../../mixins';
import UpdatePhotos from '../../peripheral/updatePhoto/index';
import Completed from './completed';
const window = Dimensions.get('window');

class SupervisorInbound extends React.Component {
  constructor(props) {
    super(props);
    this.StackSelector.bind(this);
    this.setWrapperofStack.bind(this);
  }

  setWrapperofStack = (i, key) => {
    const {indexBottomBar} = this.props;
    const {routes,index} = this.props.navigation.dangerouslyGetState();

    if (indexBottomBar === 0 && key !== 'UpdatePhotosSPV' && routes[index].name === 'SupervisorMode' ) {
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(i);
    }
  };
  componentWillUnmount() {
    this.props.setBottomBar(true);
    this.props.setCurrentStackKey('WarehouseIn');
    this.props.setCurrentStackIndex(0);
  }
  StackSelector = createCompatNavigatorFactory(createStackNavigator)(
    {
      ListSupervisor: {
        screen: SupervisorList,
        navigationOptions: ({navigation}) => ({
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
          headerTitle: 'Inbound Supervisor',
        }),
      },
      ManifestSupervisor: {
        screen: SupervisorManifest,
        navigationOptions: ({navigation}) => ({
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
          // react-navigation 6 drop dangerously so its fine to use
          headerTitle:
            navigation.dangerouslyGetState().params !== undefined &&
            navigation.dangerouslyGetState().params.type !== undefined
              ? navigation.dangerouslyGetState().params.type
              : 'Manifest',
        }),
      },
      CompletedSupervisor: {
        screen: Completed,
        navigationOptions: ({navigation}) => ({
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
                  this.props.navigation.navigate('ListSupervisor');
                }}
              />
            );
          },
          // react-navigation 6 drop dangerously so its fine to use
          headerTitle: 'Completed',
        }),
      },
      PhotosDraftSPV: {
        screen: PhotosDraftSPV,
        navigationOptions: ({navigation}) => ({
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
          headerTitle: 'Photo',
        }),
      },
      UpdatePhotosSPV: {
        screen: UpdatePhotos,
        navigationOptions: ({navigation}) => ({
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
        }),
      },
      ReportDetailsSPV: {
        screen: ReportDetailsSPV,
        navigationOptions: ({navigation}) => ({
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
        }),
      },
      ReportSingleDetailsSPV: {
        screen: ReportSingleDetailsSPV,
        navigationOptions: ({navigation}) => ({
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
        }),
      },
      IVASListSPV: {
        screen: IVASListSPV,
        navigationOptions: ({navigation}) => ({
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
          headerTitle: 'Shipment VAS',
        }),
      },
      IVASDetailsSPV: {
        screen: IVASDetailsSPV,
        navigationOptions: ({navigation}) => ({
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
          headerTitle: 'Shipment VAS',
        }),
      },
      UpdateIVAS: {
        screen: UpdateIVAS,
        navigationOptions: ({navigation}) => ({
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
          headerTitle: 'Shipment VAS',
        }),
      },
    },
    {
      initialRouteName: 'ListSupervisor',
      headerMode: 'screen',
      defaultNavigationOptions: {
        headerBackTitleVisible: true,
        headerBackTitle: 'Back',
        headerTitleStyle: {
          ...Mixins.h6,
          fontWeight: '400',
          lineHeight: 22,
          textAlign: 'center',
          paddingRight: Platform.OS === 'ios' ? 0 : 40,
        },
        headerBackImage: ({tintColor}) => (
          <IconArrow66Mobile height="22" width="18" fill={tintColor} />
        ),
        headerLeftContainerStyle:
          Platform.OS === 'ios' ? {paddingHorizontal: 15} : null,
        header: (props) => {
          let state = props.navigation.dangerouslyGetState();
          let key = state.routes[state.index].name;
          let index = state.index;
          this.setWrapperofStack(index, key);
          if (
            key !== 'ListSupervisor' &&
            key !== 'CompletedSupervisor' &&
            props.scene.descriptor.options.headerTitle.indexOf('-') === -1
          ) {
            let typeString = '';
            switch (this.props.manifestType) {
              case 1:
                typeString = 'ASN';
                break;
              case 2:
                typeString = 'GRN';
                break;
              case 3:
                typeString = 'OTHERS';
                break;
              default:
                break;
            }
            props.scene.descriptor.options.headerTitle =
              typeString + ' - ' + props.scene.descriptor.options.headerTitle;
          }
          return <Header {...props} />;
        },
      },
    },
  );
  render() {
    return <this.StackSelector />;
  }
}

function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isDrawer: state.originReducer.filters.isDrawer,
    indexBottomBar: state.originReducer.filters.indexBottomBar,
    indexStack: state.originReducer.filters.indexStack,
    keyStack: state.originReducer.filters.keyStack,
    manifestType: state.originReducer.filters.currentManifestType,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SupervisorInbound);
