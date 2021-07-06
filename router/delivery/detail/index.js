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
  Button,
} from 'react-native-elements';
import {Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {CommonActions} from '@react-navigation/native';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import error from '../../error/no-rights';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Carousel from '../../../component/carousel/carousel';
import IconTask1Mobile from '../../../assets/icon/iconmonstr-task-1 1mobile.svg';
import IconNavigation10Mobile from '../../../assets/icon/iconmonstr-navigation-10 1mobile.svg';
import IconAward23Mobile from '../../../assets/icon/iconmonstr-award-23 1mobile.svg';
import IconMenu6Mobile from '../../../assets/icon/iconmonstr-menu-6 1mobile.svg';
import Intersect from '../../../assets/icon/Intersectmobile.svg';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import Manifest from '../../../component/extend/ListItem-manifest';
import OfflineMode from '../../../component/linked/offlinemode';
import Mixins from '../../../mixins';
const window = Dimensions.get('window');

class Delivery extends React.Component {
  keyboardDidShowListener = null;
  keyboardDidHideListener = null;
  constructor(props) {
    super(props);

    const manifestList = [
      {
        name: 'Lorem ipsum dolor sit',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'amet, consectetur adipiscing elit vivamus turpis mattis ',
      },
      {
        name: 'Lorem ipsum dolor sit',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'amet, consectetur adipiscing elit vivamus turpis mattis ',
      },
    ];
    this.state = {
      text: 'Initial Placeholder',
      textTwo: 'Initial Two',
      keyboardState: 'closed',
      transitionTo: 0,
      manifestList,
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

  onChangeText(text) {
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

  onChangeTextTwo(text) {
    this.setState({textTwo: text});
  }
  onSubmited(e) {
    console.log(e);
  }
  onSubmitToBeranda(e) {
    return this.props.navigation.navigate('Details');
  }
  render() {
    var image = {uri: 'https://reactnative.dev/img/tiny_logo.png'};
    const {manifestList} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
          <ScrollView style={styles.body}>
              <SafeAreaView edges={['top'] } style={{backgroundColor: '#121C78'}}/>
            <OfflineMode position="top" />
            <View style={styles.headerBeranda}>
              <View style={{position:'absolute',top:0,left:0,right:0,bottom:0, width:window.width, alignItems:'center',justifyContent:'center'}}>
              <Intersect width={window.width + 2} height="316" fill="#121C78"/>
              </View>
              <View style={[styles.headerNav, {marginTop:39}]}>
                <Button
                  type="clear"
                  containerStyle={styles.navSection}
                  buttonStyle={{padding: 0, margin: 0}}
                  iconContainerStyle={{padding: 0, margin: 0}}
                  titleStyle={{padding: 0, margin: 0}}
                  onPress={()=>{
                    this.props.toggleDrawer(true);
                  }}
                  icon={() => (
                    <IconMenu6Mobile height="24" width="24" fill="#fff" />
                  )}
                />
                <View style={styles.logoSection}>
                <Image
                  source={require('../../../assets/dap_logo_hires1thumb.png')}
                  style={{ width: 74, height: 38 }}
                />
                </View>
              </View>
            
                <View style={[styles.headerNav,{marginTop:15}]}>
                  <Carousel
                    indicatorOffset={-25}
                    width={window.width / 1.2}
                    height={window.width / 3}
                    onScroll={() => console.log('on scroll view')}
                    onScrollBegin={() => console.log('scroll begin')}
                    onPageChange={(page) => console.log('scroll change', page)}>
                    <View style={{backgroundColor: '#F07120'}}>
                      <Text>Page 1</Text>
                    </View>
                    <View style={{backgroundColor: '#F07120'}}>
                      <Text>Page 2</Text>
                    </View>
                    <View style={{backgroundColor: '#F07120'}}>
                      <Text>Page 3</Text>
                    </View>
                  </Carousel>
                </View>
            </View>
            <View style={styles.navContainer}>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={79}
                  ImageComponent={() => (
                    <IconTask1Mobile height="40" width="40" fill="#fff" />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonAvatarDefaultIconStyle
                    },
                  }}
                  overlayContainerStyle={Mixins.buttonAvatarDefaultOverlayStyle}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
                />
                <Badge
                  status="success"
                  containerStyle={{position: 'absolute', top: 5, right: 25}}
                />
                <Text h4 style={styles.sectionText}>
                  Schedule Today
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={79}
                  ImageComponent={() => (
                    <IconNavigation10Mobile
                      height="40"
                      width="40"
                      fill="#fff"
                    />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonAvatarDefaultIconStyle
                    },
                  }}
                  overlayContainerStyle={Mixins.buttonAvatarDefaultOverlayStyle}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
                />
                <Badge
                  status="success"
                  containerStyle={{position: 'absolute', top: 5, right: 25}}
                />

                <Text h4 style={styles.sectionText}>
                  History
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={79}
                  ImageComponent={() => (
                    <IconAward23Mobile height="40" width="40" fill="#fff" />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonAvatarDefaultIconStyle
                    },
                  }}
                  overlayContainerStyle={Mixins.buttonAvatarDefaultOverlayStyle}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
                />
                <Badge
                  status="success"
                  containerStyle={{position: 'absolute', top: 5, right: 25}}
                />

                <Text h4 style={styles.sectionText}>
                  Points
                </Text>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <Card containerStyle={styles.cardContainer}>
                <Card.Title style={styles.headingCard}>
                  Today Manisfest
                </Card.Title>
                {manifestList.map((u, i) => (
                  <Manifest key={i} index={i} item={u} />
                ))}
              </Card>
            </View>
          </ScrollView>
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
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  headerBeranda: {
    alignSelf: 'center',
    width: window.width,
    overflow: 'hidden',
    height: 316,
  },
  headerNav: {
    alignSelf: 'center',
    width: window.width / 1.2,
    elevation: 2,
    flexDirection: 'row',
    marginTop: 30,
    zIndex: 10,
  },
  navSection: {},
  logoSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerContainer: {
    borderRadius: window.width * 0.8,
    width: window.width * 1.4,
    height: window.width * 2.5,
    marginLeft: -(window.width * 0.2),
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: '#121C78',
    justifyContent: 'center',
    alignItems: 'center',
    elevation:0,
    zIndex: 0,
  },
  sliderContainer: {
    position: 'absolute',
    bottom: window.width / 4.6,
    width: window.width / 1.2,
    height: window.width / 3,
  },
  contentSlider: {
    backgroundColor: 'black',
  },
  navContainer: {
    flex: 3,
    height: window.width / 3,
    marginHorizontal: 10,
    marginTop: -45,
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
  sectionText: {
    textAlign: 'center',
    width: 65,
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#6C6B6B',
    marginVertical: 16,
  },
  headingCard: {
    ...Mixins.h4,
    fontWeight: '700',
    lineHeight: 27,
    textAlign: 'left',
    paddingBottom: 8,
  },
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 43,
    marginVertical: 42,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0, //default is 1
    shadowRadius: 0, //default is 1
    elevation: 0,
    backgroundColor: '#ffffff',
  },
});

function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isDrawer: state.originReducer.filters.isDrawer,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    toggleDrawer: (bool) => {
      return dispatch({type: 'ToggleDrawer', payload: bool});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Delivery);
