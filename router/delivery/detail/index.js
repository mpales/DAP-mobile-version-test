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
  Text,
} from 'react-native';
import {
  Avatar,
  Badge,
  Divider,
  withBadge,
  Card,
  Icon,
} from 'react-native-elements';
import {Dimensions} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {CommonActions} from '@react-navigation/native';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import error from '../../error/no-rights';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Carousel from '../../../component/carousel/carousel';
const window = Dimensions.get('window');

class Delivery extends React.Component<IProps, {}> {
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
    if (this.props.userRole.type !== 'Delivery') {
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
              <View style={styles.headerContainer}>
                <View style={styles.sliderContainer}>
                  <Carousel
                   indicatorOffset={-50}
                    width={window.width / 1.1}
                    height={window.width / 3}
                    onScroll={() => console.log('on scroll view')}
                    onScrollBegin={() => console.log('scroll begin')}
                    onPageChange={(page) => console.log('scroll change', page)}>
                    <View style={{backgroundColor: 'yellow'}}>
                      <Text>Page 1</Text>
                    </View>
                    <View style={{backgroundColor: 'black'}}>
                      <Text>Page 2</Text>
                    </View>
                    <View style={{backgroundColor: 'red'}}>
                      <Text>Page 3</Text>
                    </View>
                  </Carousel>
                </View>
              </View>
            </View>
            <View style={styles.navContainer}>
              <Divider style={styles.sectionContainer}>
                <Avatar
                  size="large"
                  icon={{
                    name: 'rocket',
                    type: 'font-awesome',
                    color: 'white',
                  }}
                  overlayContainerStyle={{backgroundColor: 'black', flex: 2}}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={{alignSelf: 'center'}}
                />
                <Badge
                  status="success"
                  containerStyle={{position: 'absolute', top: 5, right: 25}}
                />

                <Text h4>Heading 4</Text>
              </Divider>
              <Divider style={styles.sectionContainer}>
                <Avatar
                  size="large"
                  icon={{
                    name: 'rocket',
                    type: 'font-awesome',
                    color: 'white',
                  }}
                  overlayContainerStyle={{backgroundColor: 'black', flex: 2}}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={{alignSelf: 'center'}}
                />
                <Badge
                  value="1"
                  status="error"
                  containerStyle={{position: 'absolute', top: 5, right: 25}}
                />

                <Text h4>Heading 4</Text>
              </Divider>
              <Divider style={styles.sectionContainer}>
                <Avatar
                  size="large"
                  icon={{
                    name: 'rocket',
                    type: 'font-awesome',
                    color: 'white',
                  }}
                  overlayContainerStyle={{backgroundColor: 'black', flex: 2}}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={{alignSelf: 'center'}}
                />
                <Badge
                  value="1"
                  status="error"
                  containerStyle={{position: 'absolute', top: 5, right: 25}}
                />

                <Text h4>Heading 4</Text>
              </Divider>
            </View>
            <View style={styles.contentContainer}>
              <Card>
                <Card.Title>HELLO WORLD</Card.Title>
                <Card.Divider />
                <Card.Image source={require('../../../assets/default.png')}>
                  <Text style={{marginBottom: 10}}>
                    The idea with React Native Elements is more about component
                    structure than actual design.
                  </Text>
                  <Button
                    icon={{
                      name: 'rocket',
                      type: 'font-awesome',
                      color: 'white',
                    }}
                    buttonStyle={{
                      borderRadius: 0,
                      marginLeft: 0,
                      marginRight: 0,
                      marginBottom: 0,
                    }}
                    title="VIEW NOW"
                  />
                </Card.Image>
              </Card>
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
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  headerBeranda: {
    alignSelf: 'center',
    width: window.width,
    overflow: 'hidden',
    height: window.width / 1.7,
  },
  headerContainer: {
    borderRadius: window.width * 0.8,
    width: window.width * 1.4,
    height: window.width * 2.5,
    marginLeft: -(window.width * 0.2),
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: '#9DD6EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: window.width / 4.5,
    width: window.width / 1.1,
    height: window.width / 3,
  },
  contentSlider: {
    backgroundColor: 'black',
  },
  navContainer: {
    flex: 3,
    height: window.width / 3,
    marginHorizontal: 10,
    marginVertical: 20,
    flexDirection: 'row',
  },
  sectionContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 3,
    flexDirection: 'column',
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

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(Delivery);
const Stack = createStackNavigator();
const Root = () => {
  return (
    <Stack.Navigator
      initialRouteName="Delivery"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
        headerShown: false,
      }}>
      <Stack.Screen
        name="Delivery"
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
