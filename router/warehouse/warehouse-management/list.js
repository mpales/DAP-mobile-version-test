import React from 'react';
import {Image, TouchableOpacity, View, Platform} from 'react-native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {
  createStackNavigator,
  HeaderBackButton,
  Header,
} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {connect} from 'react-redux';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import IconMenu6Mobile from '../../../assets/icon/iconmonstr-menu-6 1mobile.svg';
import IconUser40Mobile from '../../../assets/icon/iconmonstr-user-40mobile.svg';
import IconBell2Mobile from '../../../assets/icon/iconmonstr-bell-2mobile.svg';
import ListSKU from './list-sku';
import ListLocation from './list-location';
import Mixins from '../../../mixins';
import {SafeAreaView} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

class ListNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.listTab.bind(this);
    this.setWrapperofStack.bind(this);
  }
  setWrapperofStack = (index, key) => {
    const {indexBottomBar} = this.props;
    if (indexBottomBar === 1) {
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  };

  listTab = createCompatNavigatorFactory(createMaterialTopTabNavigator)(
    {
      ListSKU: {
        screen: ListSKU,
        navigationOptions: {
          tabBarLabel: 'SKU',
        },
      },
      ListLocation: {
        screen: ListLocation,
        navigationOptions: {
          tabBarLabel: 'Location',
        },
      },
    },
    {
      tabBarOptions: {
        style: {
          backgroundColor: '#121C78',
        },
        labelStyle: {
          ...Mixins.h5,
          lineHeight: 21,
          textTransform: 'none',
        },
        indicatorStyle: {
          borderWidth: 1,
          borderColor: 'black',
        },
        activeTintColor: '#ffffff',
        inactiveTintColor: '#ffffff',
      },
      swipeEnabled: false,
    },
  );
  render() {
    return <this.listTab />;
  }
}

function mapStateToProps(state) {
  return {
    bottomBar: state.originReducer.filters.bottomBar,
    indexStack: state.originReducer.filters.indexStack,
    keyStack: state.originReducer.filters.keyStack,
    indexBottomBar: state.originReducer.filters.indexBottomBar,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListNavigator);
