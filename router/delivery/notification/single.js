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
  SearchBar,
  Avatar
} from 'react-native-elements';
import {Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import TheChat from '../../../component/extend/ListItem-message';
import IconClipMobile from '../../../assets/icon/iconmonstr-paperclip-1 1mobile.svg';
import IconPlaneMobile from '../../../assets/icon/iconmonstr-paper-plane-2mobile.svg';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import Contact from './list';
import Mixins from '../../../mixins';

import OfflineMode from '../../../component/linked/offlinemode';

const window = Dimensions.get('window');

class Chat extends React.Component {
  constructor(props) {
    super(props);

    const manifestList = [
      {
        role: 1,
        message: 'Hello , where are you now?',
        attachment_uuid: '',
        timestamp: '10:08 am'
      },
      {
        role: 1,
        message: 'Hello , where are you now?',
        attachment_uuid: '',
        timestamp: '10:08 am'
      },
      {
        role: 0,
        message: 'Hello , where are you now?',
        attachment_uuid: '',
        timestamp: '10:08 am'
      },
      {
        role: 1,
        message: 'Hello , where are you now?',
        attachment_uuid: '',
        timestamp: '10:08 am'
      },
      {
        role: 0,
        message: 'Hello , where are you now?',
        attachment_uuid: '',
        timestamp: '10:08 am'
      },
    ];
    this.state = {
      text: 'Initial Placeholder',
      textTwo: 'Initial Two',
      keyboardState: 'closed',
      transitionTo: 0,
      manifestList,
      search: '',
    };
    this.props.setBottomBar(false);
    this.updateSearch.bind(this);
  }
  updateSearch = (search) => {
    this.setState({search});
  };
  render() {
    var image = {uri: 'https://reactnative.dev/img/tiny_logo.png'};
    const {manifestList,search} = this.state;
    return ( <>
      <ScrollView style={styles.body}>
        <View style={styles.contentContainer}>
          <OfflineMode/>
          <Card containerStyle={styles.cardContainer}>
            <Card.Title style={styles.headingCard}>
            Recent
            </Card.Title>
            {manifestList.map((u, i) => (
              <TheChat key={i} index={i} item={u} />
            ))}
          </Card>
        </View>
      </ScrollView>
      <SafeAreaView edges={[ 'bottom']} style={{backgroundColor: '#F5F5FB'}}>
      <SearchBar
              placeholder="Type Here..."
              onChangeText={this.updateSearch}
              value={search}
              lightTheme={true}
              platform="android"
              inputStyle={{backgroundColor: '#fff'}}
              placeholderTextColor="#2D2C2C"
              loadingProps={{color:'#000'}}
              showLoading={true}
              searchIcon={() => (
                <IconClipMobile height="24" width="14" fill="#2D2C2C" />
              )}
              cancelIcon={
                 ()=>{
                     return (
                        <Avatar
                        size={41}
                        rounded
                        ImageComponent={() => (
                        <IconPlaneMobile height="20" width="20" fill="#fff" />
                        )}
                        imageProps={{
                          containerStyle: {
                           ...Mixins.buttonAvatarDefaultIconStyle,
                         paddingTop: 11,
                          },
                        }}
                        overlayContainerStyle={styles.sendButton}
                        onPress={() => console.log('Works!')}
                        activeOpacity={0.7}
                        containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
                      />
                     );
                 } 
              }
              containerStyle={{
                backgroundColor: '#F5F5FB',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                paddingHorizontal: 12,
                marginVertical: 5,
                flexShrink: 1,
              }}
              inputContainerStyle={{
                backgroundColor: '#F5F5FB',
                borderWidth: 0,
                borderBottomWidth: 0,
                margin: 0,
                padding: 0,
              }}
              inputStyle={{
                  minHeight: 37,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
              }}
              leftIconContainerStyle={{backgroundColor: 'transparent'}}
              rightIconContainerStyle={{backgroundColor: 'transparent'}}
            />
    </SafeAreaView>
    </>);
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
  wrapper: {
      flexDirection: 'column',
  },
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flexGrow: 1,
  },
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 43,
    marginVertical: 28,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0, //default is 1
    shadowRadius: 0, //default is 1
    elevation: 0,
    backgroundColor: '#ffffff',
  },
  headingCard: {
    ...Mixins.subtitle3,
    lineHeight:21,
    textAlign: 'left',
    color: '#000000',
    paddingBottom: 20,
  },
  sendButton: {
    ...Mixins.buttonAvatarDefaultOverlayStyle,
    backgroundColor: '#121C78',
    borderRadius: 50,

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
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
