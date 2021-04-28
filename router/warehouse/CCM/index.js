import React from 'react';
import {TextInput, View, Text, useWindowDimensions} from 'react-native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {Button} from 'react-native-elements';
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import Camera from '../peripheral';
import Manifest from './manifest';
import Mixins from '../../../mixins';

const Stack = createStackNavigator();

class AddressNavigator extends React.Component {
  constructor(props) {
    super(props);
  }
  backwithoutBottom = () => {
  }
  cancelDelivery = ()=> {
  }
  render() {
    return (
      <Stack.Navigator initialRouteName="List" screenOptions={{headerBackImage:({tintColor})=>(<IconArrow66Mobile height="22" width="18" fill={tintColor}/>)}}>
        <Stack.Screen
          name="List"
          component={Manifest}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitle: 'Manifest',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerLeft: (props) => {
              return(
              <HeaderBackButton  {...props} onPress={()=>{
                this.props.setBottomBar('true')
                navigation.navigate('Home');
              }
              }
              />);
            },
          })}
        />
        <Stack.Screen
          name="Barcode"
          component={Camera}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#121C78',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTransparent: true,
            headerTintColor: '#fff',
            headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22},
            headerTitle: 'Barcode Scan',
          })}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    bottomBar: state.filters.bottomBar,
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

export default connect(mapStateToProps, mapDispatchToProps)(AddressNavigator);
