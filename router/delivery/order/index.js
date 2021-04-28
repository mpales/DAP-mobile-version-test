import React from 'react';
import { Button } from 'react-native-elements';
import Camera from '../peripheral/camera';
import POD from './POD';
import EnlargeImage from '../peripheral/enlargeImage';
import ImageConfirmation from '../peripheral/imageConfirmation';
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

  submitPhotoProof = () => {
    if(this.props.photoProofList.length > 0) {
      this.props.photoProofSubmittedHandler(true);
      this.props.addPhotoProofList([]);
      this.props.navigation.navigate('Order', {screen: 'Order'});
    }
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
            headerShown: true,
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
                title="Submit"
                buttonStyle={{paddingHorizontal: 20, margin: 0}}
                iconContainerStyle={{padding: 0, margin: 0}}
                titleStyle={{padding: 0, margin: 0, color: '#fff'}}
                onPress={this.submitPhotoProof}
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
      },
      ImageConfirmation: {
        screen: (props) => {
          this.props.navigation.setOptions({
            headerShown: false,
          });
          return <ImageConfirmation {...props} />
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
    photoProofList: state.photoProofList,
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
    photoProofSubmittedHandler : (proof) => dispatch({type:'PhotoProof',payload:proof}),
    addPhotoProofList: (uri) => dispatch({type: 'PhotoProofList', payload: uri}),
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);

