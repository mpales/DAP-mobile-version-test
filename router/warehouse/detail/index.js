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
  StatusBar,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {Avatar, 
  Button, Text,Input, Card} from 'react-native-elements';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import {CommonActions} from '@react-navigation/native';
import {AnyAction, Dispatch} from 'redux';
import {connect, Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import error from '../../error/no-rights';
import IconMenu6Mobile from '../../../assets/icon/iconmonstr-menu-6 1mobile.svg';
import IconBell2Mobile from '../../../assets/icon/iconmonstr-bell-2mobile.svg';
import IconUser7Mobile from '../../../assets/icon/iconmonstr-user-7 1mobile.svg';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import Mixins from '../../../mixins';
import Inbound from '../../../component/extend/ListItem-inbound';
const window = Dimensions.get('window');

class Warehouse extends React.Component{

  constructor(props) {
    super(props);
    const inboundList = [
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
      inboundList,
    };

  }
  render() {
    const {inboundList} = this.state;
    var image = {uri: 'https://reactnative.dev/img/tiny_logo.png'};
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaProvider>
          <ScrollView style={styles.body}>
            <View style={styles.headerBeranda}>
              <View style={styles.berandaNav}>
                <View style={[styles.navSection,styles.toggleDrawer]}>
                  <Button
                    type="clear"
                    containerStyle={{padding: 0, margin:0 }}
                    buttonStyle={{padding: 0, margin: 0}}
                    iconContainerStyle={{padding: 0, margin: 0}}
                    titleStyle={{padding: 0, margin: 0}}
                    onPress={()=>{
                      this.props.toggleDrawer(true);
                    }}
                    icon={() => (
                      <IconMenu6Mobile height="24" width="24" fill="#ABABAB" />
                    )}
                  />
                </View>
                <View style={[styles.navSection, styles.logoWrapper]}>
                  <Text>Logo</Text>
                </View>
                <View style={[styles.navSection, styles.navWrapper]}>
                  <Button
                    type="clear"
                    containerStyle={[styles.navSection,{alignItems: 'flex-end'}]}
                    buttonStyle={{padding: 0, margin: 0}}
                    iconContainerStyle={{padding: 0, margin: 0}}
                    titleStyle={{padding: 0, margin: 0}}
                    onPress={()=>{
                      this.props.toggleDrawer(true);
                    }}
                    icon={() => (
                      <IconBell2Mobile height="24" width="20" fill="#ABABAB" />
                    )}
                  />
                  <Button
                    type="clear"
                    containerStyle={[styles.navSection,{alignItems: 'flex-end'}]}
                    buttonStyle={{padding: 0, margin: 0}}
                    iconContainerStyle={{padding: 0, margin: 0}}
                    titleStyle={{padding: 0, margin: 0}}
                    onPress={()=>{
                      this.props.toggleDrawer(true);
                    }}
                    icon={() => (
                      <IconUser7Mobile height="24" width="20" fill="#ABABAB" />
                    )}
                  />
                    
                </View>
              </View>
              <View style={styles.berandaBar}>
                  <View style={[styles.barSection,styles.breadcrumb]}>
                            <Text>CCM Module</Text>
                  </View>
                  <View style={[styles.barSection,styles.search]}>
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
                      <IconSearchMobile height="20" width="21" fill="#ABABAB" />
                    )}
                  />    
                  </View>
             
            </View>
            </View>
            <View style={styles.sectionContent}>
            <Card containerStyle={styles.cardContainer}>
                  <View style={styles.headingCard}>
                      <Input 
                      containerStyle={{flex: 1,}}
                      inputContainerStyle={[Mixins.containedInputDefaultContainer,{maxHeight: 30}]} 
                      inputStyle={Mixins.containedInputDefaultStyle}
                      labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                      rightIconContainerStyle={Mixins.containedInputDefaultRightIcon}
                      leftIconContainerStyle={Mixins.containedInputDefaultLeftIcon}
                      label="Date"
                      />
                      <Input 
                      
                      containerStyle={{flex: 1,}}
                      inputContainerStyle={[Mixins.containedInputDefaultContainer,{maxHeight: 30}]}
                      inputStyle={Mixins.containedInputDefaultStyle}
                      labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                      rightIconContainerStyle={Mixins.containedInputDefaultRightIcon}
                      leftIconContainerStyle={Mixins.containedInputDefaultLeftIcon}
                      label="Manifest"
                      />
                  </View>
                  {inboundList.map((u, i) => (
                    <Inbound key={i} index={i} item={u} />
                  ))}
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
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  headingCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionContent: {
    marginVertical: 4,
    marginHorizontal: 30,
  },
  headerBeranda: {
    flexDirection: 'column',
    height: window.width * 0.3,
    backgroundColor: '#F5F5FB',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  berandaNav : {
    flexDirection: 'row',
  },
  berandaBar: {
    marginTop: 40,
    flexDirection: 'row',
  },
  barSection: {
    flex: 1,
  },
  breadcrumb : {
    alignItems: 'flex-start',
  },
  search: {
    alignItems: 'flex-end',
  },
  navSection: {
    flex: 1,
  },
  toggleDrawer: {
    alignItems: 'flex-start',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  navWrapper: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
    marginVertical: 20,
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
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
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
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);
