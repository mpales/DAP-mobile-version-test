import React from 'react';
import { Button } from 'react-native-elements';
import Camera from '../peripheral/camera';
import POD from './POD';
import EnlargeImage from '../peripheral/enlargeImage';
import {connect} from 'react-redux';
import {createStackNavigator,HeaderBackButton} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
// icons
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import IconMenu11Mobile from '../../../assets/icon/iconmonstr-menu-11mobile.svg';


class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowCamera: false,
    };
    this.orderTab.bind(this);
  }
  orderTab = createCompatNavigatorFactory(createStackNavigator)(
    {
      Order: {
        screen: POD,
        options: {
          title: 'Awesome app',
        },
      },
      Camera: {
        screen: (props) => {
          this.props.navigation.setOptions({headerTransparent:true});
          this.props.navigation.setOptions({
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} 
                  onPress={()=> {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate('Order',{screen: 'Order'});
                  }}
                />
              );
            },
            headerRight: () => (
              <Button
                type="clear"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0}}
                onPres={() => {}}
                icon={() => (
                  <IconDelivery8Mobile height="24" width="24" fill="#fff" />
                )}
              />
            ),
          });
          return <Camera {...props}/>;
        },
        options: {
          title: 'Awesome app',
        },
      },
      EnlargeImage: {
        screen:  (props) => {
          this.props.navigation.setOptions({headerTransparent:true});
          this.props.navigation.setOptions({
            headerLeft: (props) => {
              return(
                <HeaderBackButton  {...props} 
                  onPress={()=> {
                    this.props.navigation.navigate('Camera', {screen: 'Camera'});
                  }}
                />
              );
            },
            headerRight: () => (
              <Button
                type="clear"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0}}
                onPress={() => {}}
                icon={() => (
                  <IconMenu11Mobile height="20" width="20" fill="#fff" />
                )}
              />
            )
          });
          return <EnlargeImage {...props}/>;
        },
      }
    },
    {
      initialRouteName:"Order",
      headerMode:"none",
      screenOptions:{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
        headerShown: false,
      },
    }
  );
  render(){
    this.props.navigation.setOptions({headerTransparent:false});
    this.props.navigation.setOptions({   headerLeft: (props) => {
      return(
      <HeaderBackButton  {...props} onPress={()=>{
        this.props.setBottomBar(false);
       this.props.navigation.goBack();
      }
      }
      />);
    }})
    return <this.orderTab/>;
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
    isPhotoProofSubmitted: state.filters.isPhotoProofSubmitted,
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

export default connect(mapStateToProps, mapDispatchToProps)(Example);

