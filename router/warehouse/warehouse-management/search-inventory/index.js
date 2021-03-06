import React from 'react';
import {
  createStackNavigator,
  Header,
  HeaderBackButton,
} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {Platform} from 'react-native';
import Mixins from '../../../../mixins';
// screen
import SearchInventory from './searchInventory';
import SearchInventoryList from './searchInventoryList';
import SearchInventoryDetails from './searchInventoryDetails';
import SearchInventoryBarcode from '../peripheral/searchInventoryBarcode';
// icon
import IconArrow66Mobile from '../../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';

const Stack = createStackNavigator();

class SearchInventoryNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowSignature: false,
    };
  }

  setWrapperofStack = (index, key) => {
    this.props.setCurrentStackKey(key);
    this.props.setCurrentStackIndex(index);
  };

  render() {
    return (
      <Stack.Navigator
        initialRouteName="SearchInventory"
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
          headerBackTitle: 'Back',
          header: (props) => {
            let state = props.navigation.dangerouslyGetState();
            let key = state.routes[state.index].name;
            let index = state.index;
            this.setWrapperofStack(index, key);
            return <Header {...props} />;
          },
        }}>
        <Stack.Screen
          component={SearchInventory}
          name="SearchInventory"
          options={{
            headerTitle: 'Search Inventory',
          }}
        />
        <Stack.Screen
          component={SearchInventoryList}
          name="SearchInventoryList"
          options={{
            headerTitle: 'Search Results',
          }}
        />
        <Stack.Screen
          component={SearchInventoryDetails}
          name="SearchInventoryDetails"
          options={{
            headerTitle: 'Storage Details',
          }}
        />
        <Stack.Screen
          component={SearchInventoryBarcode}
          name="SearchInventoryBarcode"
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerBackTitle: 'Back',
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  this.props.navigation.navigate('SearchInventory');
                }}
              />
            ),
          }}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
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
)(SearchInventoryNavigator);
