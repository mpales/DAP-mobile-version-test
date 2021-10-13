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
import {Card, SearchBar, Button} from 'react-native-elements';
import {Dimensions, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AnyAction, Dispatch} from 'redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import IconSearchMobile from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';
import IconArrow66Mobile from '../../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {
  createStackNavigator,
  Header,
  HeaderBackButton,
} from '@react-navigation/stack';
import CameraMulti from './cameraMulti';
import enlargeImage from './enlargeImage';
import Mixins from '../../../../mixins';

const window = Dimensions.get('window');

class UpdatePhoto extends React.Component {
  constructor(props) {
    super(props);
    this.StackSelector.bind(this);
    this.setWrapperofStack.bind(this);
  }

  setWrapperofStack = (index, key) => {
    const {indexBottomBar} = this.props;

    if (indexBottomBar === 0) {
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  };
  StackSelector = createCompatNavigatorFactory(createStackNavigator)(
    {
      POSMCameraMulti: {
        screen: CameraMulti,
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
          headerTitle: '',
          headerLeft: (props) => {
            return (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  navigation.navigate('Inbound', {
                    screen: 'Barcode',
                    params: {
                      upload: false,
                    },
                  });
                }}
              />
            );
          },
          headerRight: () => (
            <Button
              type="clear"
              title="Submit"
              buttonStyle={{paddingHorizontal: 20, margin: 0}}
              iconContainerStyle={{padding: 0, margin: 0}}
              titleStyle={{
                ...Mixins.h6,
                fontWeight: '400',
                lineHeight: 22,
                padding: 0,
                margin: 0,
                color: '#fff',
              }}
              onPress={() => {
                navigation.navigate('Inbound', {
                  screen: 'Barcode',
                  params: {
                    upload: true,
                  },
                });
              }}
            />
          ),
        }),
      },
      POSMEnlargeImage: {
        screen: enlargeImage,
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
          headerTitle: '',
        }),
      },
    },
    {
      initialRouteName: 'POSMCameraMulti',
      headerMode: 'float',
      defaultNavigationOptions: {
        headerTransparent: true,
        headerBackTitleVisible: true,
        headerBackTitle: 'Back',
        headerTitleStyle: {
          ...Mixins.h6,
          fontWeight: '400',
          lineHeight: 22,
          textAlign: 'center',
          paddingRight: 40,
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
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePhoto);
