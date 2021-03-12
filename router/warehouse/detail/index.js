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
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {Avatar, Badge, Divider, withBadge, Text} from 'react-native-elements';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {CommonActions} from '@react-navigation/native';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import error from '../../error/no-rights';
const window = Dimensions.get('window');

class Warehouse extends React.Component<IProps, {}> {
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  constructor(props: IProps | Readonly<IProps>) {
    super(props);
    this.state = {
      text: 'Initial Placeholder',
      textTwo: 'Initial Two',
      keyboardState: 'closed',
      transitionTo: 0,
    };
    this._keyboardDidHide.bind(this);
    this._keyboardDidShow.bind(this);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    this.resetAction.bind(this);
    if (this.props.userRole.type !== 'Warehouse') {
      this.props.navigation.dispatch(this.resetAction);
    }
  }
  resetAction = () => {
    return CommonActions.reset({
      index: 1,
      routes: [{name: 'NoRights'}],
    });
  };
  onChangeText(text: any) {
    this.setState({text});
  }

  _keyboardDidShow = () => {
    this.setState({
      keyboardState: 'opened',
      transitionTo: 0,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      keyboardState: 'closed',
      transitionTo: 0,
    });
  };

  onChangeTextTwo(text: any) {
    this.setState({textTwo: text});
  }
  onSubmited(e: any) {
    console.log(e);
  }
  onSubmitToBeranda(e: any) {
    return this.props.navigation.navigate('Details');
  }
  render() {
    var image = {uri: 'https://reactnative.dev/img/tiny_logo.png'};
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaProvider>
          <ScrollView style={styles.body}>
            <View style={styles.headerBeranda}>
              <Text h1>Welcome Back</Text>
              <Text h2>Username</Text>
              <Text h3>Warehouse Dashboard</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.dividerContainer}>
                <View style={styles.sectionContainer}>
                  <Avatar
                    size="xlarge"
                    icon={{
                      name: 'rocket',
                      type: 'font-awesome',
                      color: 'white',
                    }}
                    overlayContainerStyle={{backgroundColor: 'black'}}
                    onPress={() => console.log('Works!')}
                    containerStyle={{alignSelf: "flex-end",marginRight:10}}
                  />
                  <Badge
                    status="success"
                    containerStyle={{position: 'absolute', top: 5, right: 15}}
                  />
                </View>
                <View style={styles.sectionContainer}>
                  <Avatar
                    size="xlarge"
                    icon={{
                      name: 'rocket',
                      type: 'font-awesome',
                      color: 'white',
                    }}
                    overlayContainerStyle={{backgroundColor: 'black', flex: 2}}
                    onPress={() => console.log('Works!')}
                    containerStyle={{alignSelf: "flex-start",marginLeft:10}}
                  />
                  <Badge
                    status="success"
                    containerStyle={{position: 'absolute', top: 5, right: 40}}
                  />
                </View>
              </View>
              <View style={styles.dividerContainer}>
                <View style={styles.sectionContainer}>
                  <Avatar
                    size="xlarge"
                    icon={{
                      name: 'rocket',
                      type: 'font-awesome',
                      color: 'white',
                    }}
                    overlayContainerStyle={{backgroundColor: 'black', flex: 2}}
                    onPress={() => console.log('Works!')}
                    containerStyle={{alignSelf: "flex-end", marginRight: 10}}
                  />
                  <Badge
                    status="success"
                    containerStyle={{position: 'absolute', top: 5, right: 15}}
                  />
                </View>
                <View style={styles.sectionContainer}>
                  <Avatar
                    size="xlarge"
                    icon={{
                      name: 'rocket',
                      type: 'font-awesome',
                      color: 'white',
                    }}
                    overlayContainerStyle={{backgroundColor: 'black', flex: 2}}
                    onPress={() => console.log('Works!')}
                    containerStyle={{alignSelf: "flex-start", marginLeft: 10}}
                  />
                  <Badge
                    status="success"
                    containerStyle={{position: 'absolute', top: 5, right: 40}}
                  />
                </View>
              </View>
              <View style={styles.dividerContainer}>
                <View style={styles.sectionContainer}>
                  <Avatar
                    size="xlarge"
                    icon={{
                      name: 'rocket',
                      type: 'font-awesome',
                      color: 'white',
                    }}
                    overlayContainerStyle={{backgroundColor: 'black', flex: 2}}
                    onPress={() => console.log('Works!')}
                    containerStyle={{alignSelf: "flex-end", marginRight: 10}}
                  />
                  <Badge
                    status="success"
                    containerStyle={{position: 'absolute', top: 5, right: 15}}
                  />
                </View>
                <View style={styles.sectionContainer}>
                  <Avatar
                    size="xlarge"
                    icon={{
                      name: 'rocket',
                      type: 'font-awesome',
                      color: 'white',
                    }}
                    overlayContainerStyle={{backgroundColor: 'black', flex: 2}}
                    onPress={() => console.log('Works!')}
                    containerStyle={{alignSelf: "flex-start", marginLeft: 10}}
                  />
                  <Badge
                    status="success"
                    containerStyle={{position: 'absolute', top: 5, right: 40}}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: Colors.black,
    marginBottom: 40,
  },
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  headerBeranda: {
    height: window.width / 2,
  },
  contentContainer: {
    height: window.width * 2,
    flexDirection: 'column',
    backgroundColor: Colors.white,
  },
  footer: {
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 40,
    justifyContent: 'flex-end',
  },
  dividerContainer: {
    flexShrink: 0,
    height: 150,
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  sectionContainer: {
    flex: 1,
  },
});

interface IProps {
  textfield: string;
  value: string;
  todos: {};
  decrement: () => void;
  reset: () => void;
  onChange: (text: any) => void;
}

interface dispatch {
  type: string;
  payload: {};
}

function mapStateToProps(state: {todos: {name: any}, userRole: any}) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text: any) => {
      return {type: 'todos', payload: text};
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(Warehouse);
const Stack = createStackNavigator();
const Root = () => {
  return (
    <Stack.Navigator
      initialRouteName="Warehouse"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
        headerShown: false,
      }}>
      <Stack.Screen
        name="Warehouse"
        component={ConnectedApp}
        options={{
          title: 'Awesome app',
        }}
      />
      <Stack.Screen
        name="NoRights"
        component={error}
        options={{
          title: 'Error app',
        }}
      />
    </Stack.Navigator>
  );
};
export default Root;
