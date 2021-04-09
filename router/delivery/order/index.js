import React from 'react';
import Camera from '../peripheral/camera';
import POD from './POD';
import {connect} from 'react-redux';
import {createStackNavigator,HeaderBackButton} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';

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
            }
          });
          return <Camera {...props}/>;
        },
        options: {
          title: 'Awesome app',
        },
      },
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

