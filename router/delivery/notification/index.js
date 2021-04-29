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
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
} from 'react-native';
import {
  Card,
  SearchBar
} from 'react-native-elements';
import {Dimensions} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ListChat from '../../../component/extend/ListItem-chat';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import List from './list';
import Chat from './single';
import Mixins from '../../../mixins';

const window = Dimensions.get('window');

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.StackSelector.bind(this);
  }

  StackSelector = createCompatNavigatorFactory(createStackNavigator)(
    {
      List: {
        screen: List,
        navigationOptions:  ({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#121C78',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#fff',
          headerTitle: 'Chat',
        }),
      },
      Single: {
        screen: Chat,
        navigationOptions:  ({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#121C78',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#fff',
          headerTitle: 'Chat',
        }),
      },
    },
    {
      initialRouteName: 'List',
    },
  );
  render() {
    return <this.StackSelector />;
  }
}


function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
    isDrawer: state.filters.isDrawer,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
