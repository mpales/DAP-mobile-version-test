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
  FAB 
} from 'react-native-elements';
import {Dimensions} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ListChat from '../../../component/extend/ListItem-chat';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import IconSpeech from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';

const window = Dimensions.get('window');

class List extends React.Component<IProps, {}> {
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  constructor(props: IProps | Readonly<IProps>) {
    super(props);

    const manifestList = [
      {
        name: 'John',
        desc: 'Hello , where are you now?',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        unread: 2,
        last_timestamp: '09.00',
      },
      {
        name: 'John',
        desc: 'Hello , where are you now?',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        unread: 2,
        last_timestamp: '09.00',
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
    this.updateSearch.bind(this);
    this.navigateToSingle.bind(this);
  }
  navigateToSingle = () => {
    this.props.setBottomBar(false);
    this.props.navigation.navigate('Single');
  }
  updateSearch = (search) => {
    this.setState({search});
  };
  render() {
    var image = {uri: 'https://reactnative.dev/img/tiny_logo.png'};
    const {manifestList,search} = this.state;
    return (
    <SafeAreaProvider>
      <ScrollView style={[styles.body]}>
        <View style={[styles.contentContainer,{minHeight:window.height}]}>
        <SearchBar
              placeholder="Type Here..."
              onChangeText={this.updateSearch}
              value={search}
              lightTheme={true}
              inputStyle={{backgroundColor: '#fff'}}
              placeholderTextColor="#2D2C2C"
              searchIcon={() => (
                <IconSearchMobile height="20" width="20" fill="#2D2C2C" />
              )}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                paddingHorizontal: 25,
                marginVertical: 5,
              }}
              inputContainerStyle={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#D5D5D5',
              }}
              leftIconContainerStyle={{backgroundColor: 'white'}}
            />
          <Card containerStyle={styles.cardContainer}>
            <Card.Title style={styles.headingCard}>
            Recent
            </Card.Title>
            {manifestList.map((u, i) => (
              <ListChat key={i} index={i} item={u} toSingle={this.navigateToSingle} />
            ))}
          </Card>
        </View>
      </ScrollView>
            <FAB 
            onPress={()=>{
              this.props.setBottomBar(false);
              this.props.navigation.navigate('Contact');
            }}
            icon={()=><IconSpeech fill="#fff" height="24" width="24"/>}
            color="#121C78"
            placement="right" style={{elevation:10,}} buttonStyle={{borderRadius:100}}/>
    </SafeAreaProvider>
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
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 25,
    marginTop: 15,
    marginBottom:28,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0, //default is 1
    shadowRadius: 0, //default is 1
    elevation: 0,
    backgroundColor: '#ffffff',
  },
  headingCard: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight:21,
    textAlign: 'left',
    color: '#000000',
    paddingBottom:10,
    margin:0,
  },
});

interface IProps {
  textfield: string;
  value: string;
  todos: {};
  decrement: () => void;
  reset: () => void;
  onChange: (text: any) => void;
  toggleDrawer: () => void;
}

interface dispatch {
  type: string;
  payload: {};
}

function mapStateToProps(state: {todos: {name: any}, userRole: any}) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isDrawer: state.originReducer.filters.isDrawer,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text: any) => {
      return {type: 'todos', payload: text};
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
