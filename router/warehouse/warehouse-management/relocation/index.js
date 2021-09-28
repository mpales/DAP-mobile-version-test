import React from 'react';
import {
  createStackNavigator,
  Header,
  HeaderBackButton,
} from '@react-navigation/stack';
import {connect} from 'react-redux';
import Mixins from '../../../../mixins';
// screen
import RelocationList from './relocationList';
import RelocationDetails from './relocationDetails';
import RelocationConfirm from './relocationConfirm';
import RelocationRequest from './relocationRequest';
import RelocationRequestForm from './relocationRequestForm';
import RelocationScanResult from './relocationScanResult';
import RelocationRequestConfirm from './relocationRequestConfirm';
import BarcodeCamera from '../peripheral/barcodeCamera';
// icon
import IconArrow66Mobile from '../../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';

const Stack = createStackNavigator();

class WarehouseManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowSignature: false,
    };
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
        initialRouteName="RelocationList"
        screenOptions={{
          headerBackImage: () => (
            <IconArrow66Mobile height="22" width="18" fill="#FFF" />
          ),
          headerShown: true,
          headerBackTitleVisible: true,
          headerBackTitleStyle: {color: '#FFF'},
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
          headerTitleAlign: 'center',
          headerTitleStyle: {...Mixins.subtitle3, lineHeight: 50},
          headerTintColor: '#FFF',
          headerLeftContainerStyle:
            Platform.OS === 'ios' ? {paddingHorizontal: 15} : null,
          header: (props) => {
            let state = props.navigation.dangerouslyGetState();
            let key = state.routes[state.index].name;
            let index = state.index;
            this.setWrapperofStack(index, key);
            return <Header {...props} />;
          },
        }}>
        <Stack.Screen
          component={RelocationList}
          name="RelocationList"
          options={{
            headerTitle: 'Warehouse Relocation',
          }}
        />
        <Stack.Screen
          component={RelocationDetails}
          name="RelocationDetails"
          options={{
            headerTitle: 'Warehouse Relocation',
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  this.props.setBottomBar(true);
                  this.props.navigation.navigate('RelocationList');
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          component={RelocationConfirm}
          name="ConfirmRelocation"
          options={{
            headerTitle: 'Relocate',
          }}
        />
        <Stack.Screen
          component={RelocationRequest}
          name="RequestRelocation"
          options={{
            headerTitle: 'Warehouse Relocation',
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  this.props.setBottomBar(true);
                  this.props.navigation.navigate('RelocationList');
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          component={RelocationScanResult}
          name="RelocationScanResult"
          options={{
            headerTitle: 'Warehouse Relocation',
          }}
        />
        <Stack.Screen
          component={RelocationRequestForm}
          name="RequestRelocationForm"
          options={{
            headerTitle: 'Warehouse Relocation',
          }}
        />
        <Stack.Screen
          component={RelocationRequestConfirm}
          name="RelocationRequestConfirm"
          options={{
            headerTitle: 'Relocate',
          }}
        />
        <Stack.Screen
          component={BarcodeCamera}
          name="RequestRelocationBarcode"
          options={{
            headerTitle: '',
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isPhotoProofSubmitted: state.originReducer.filters.isPhotoProofSubmitted,
    isSignatureSubmitted: state.originReducer.filters.isSignatureSubmitted,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setStartDelivered: (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    },
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WarehouseManagement);