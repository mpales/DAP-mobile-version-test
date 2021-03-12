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
import store from './Store';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Input} from './input';
import {FadeInView} from './animated';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import Beranda from './router/details';
import {Colors} from 'react-native/Libraries/NewAppScreen';

class App extends React.Component<IProps, {}> {
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
  }

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
        <View style={styles.body}>
          <View style={styles.sectionContainerIMG}>
            <Image style={styles.tinyLogo} source={image} />
          </View>
          <FadeInView
            transition={this.state.transitionTo}
            style={styles.sectionContainerKeyboard}>
            <Input
              label="Email"
              placeholder="Masukan Email / Username"
              onChangeText={this.onChangeTextTwo.bind(this)}
              onSubmitEditing={this.onSubmited.bind(this)}
            />
            <Input
              label="Password"
              placeholder="password"
              onChangeText={this.onChangeTextTwo.bind(this)}
              onSubmitEditing={this.onSubmited.bind(this)}
            />
          </FadeInView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onSubmitToBeranda.bind(this)}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  footer: {
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 40,
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: Colors.white,
  },
  button: {
    flex: 0,
    flexShrink: 1,
    padding: 20,
    backgroundColor: Colors.black,
    borderColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionContainerIMG: {
    marginTop: 32,
    paddingHorizontal: 20,
    flex: 0,
    flexShrink: 1,
    height: 60,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    height: 180,
    flex: 0,
    flexShrink: 1,
  },
  sectionContainerKeyboard: {
    marginTop: 10,
    paddingHorizontal: 20,
    height: 180,
    flex: 0,
    flexShrink: 1,
  },
  sectionContainerFooter: {
    marginTop: 32,
    paddingHorizontal: 20,
    flex: 2,
  },
  sectionTextInput: {
    height: 20,
    width: 100,
    padding: 0,
    borderColor: 'gray',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
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
function mapStateToProps(state: {todos: {name: any}}) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
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

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
const Stack = createStackNavigator();
const Root = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          headerMode="screen"
          screenOptions={{
            headerTintColor: 'white',
            headerStyle: {backgroundColor: 'tomato'},
            headerShown: false,
          }}>
          <Stack.Screen
            name="Home"
            component={ConnectedApp}
            options={{
              title: 'Awesome app',
            }}
          />
          <Stack.Screen
            name="Details"
            component={Beranda}
            options={{
              title: 'Beranda app',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
export default Root;
