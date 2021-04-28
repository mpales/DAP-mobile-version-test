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
  StyleSheet,
  ScrollView,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';
import {
  Image,
} from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Signature from './Browser';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Mixins from './mixins';
import {Input} from './input';
import {FadeInView} from './animated';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import Beranda from './router/details';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {enableScreens} from 'react-native-screens';

enableScreens(false);
class App extends React.Component<IProps, {}> {
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  constructor(props: IProps | Readonly<IProps>){
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
    this.webWorker.bind(this);
    this.webWorker();
  }

  webWorker() {}
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
    this.setState({textTwo: e.nativeEvent.text});

    const {textTwo} = this.state;
    this.props.login(textTwo);
  }
  onSubmitToBeranda(e: any) {
   this.props.login(this.state.textTwo);
    this.props.navigation.navigate('Details');
  }
  render() {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <Signature />
        <View style={styles.body}>
          <View style={styles.sectionContainerIMG}>
            <Image
              source={require('./assets/dap_logo_hires1large.png')}
              style={{ width: 176, height: 91 }}
              containerStyle={styles.tinyLogo}
            />
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
            <View>
              <Text style={styles.buttonTextForgot}>Forgot password?</Text>
            </View>
          </FadeInView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.onSubmitToBeranda.bind(this)}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#121C78',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  tinyLogo: {
    width: 176,
    height: 91,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: Colors.black,
    marginBottom: 40,
  },
  body: {
    backgroundColor: '#121C78',
    flexDirection: 'column',
    flex: 1,
  },
  footer: {
    backgroundColor: '#121C78',
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 40,
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: Colors.white,
    ...Mixins.h5,
    lineHeight: 27,

  },
  buttonTextForgot: {
    color: Colors.white,
    ...Mixins.body1,
    lineHeight:21,
  },
  button: {
    flex: 0,
    flexShrink: 1,
    padding: 10,
    backgroundColor: '#F07120',
    borderColor: '#F07120',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionContainerIMG: {
    marginTop: 52,
    marginBottom: 60,
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
  textTwo: string;
  login: (text: any) => void;
  onChange: (text: any) => void;
  navigation: any;
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
    login: (text: any) => dispatch({type: 'login', payload: text}),
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
            animationEnabled: false, // hack to fix android 10-12 crash with react-native-screens
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
