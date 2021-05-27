import React from 'react';
import {Platform} from 'react-native';
import { Button } from 'react-native-elements';
import Camera from '../peripheral/camera';
import POD from './POD';
import EnlargeImage from '../peripheral/enlargeImage';
import ImageConfirmation from '../peripheral/imageConfirmation';
import Completed from './completed';
import {connect} from 'react-redux';
import {createStackNavigator,HeaderBackButton, Header} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
// icons
import IconDelivery8Mobile from '../../../assets/icon/iconmonstr-delivery-8 1mobile.svg';
import IconMenu11Mobile from '../../../assets/icon/iconmonstr-menu-11mobile.svg';

import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowCamera: false,
    };
    this.orderTab.bind(this);
    this.setWrapperofStack.bind(this);
  }

  submitPhotoProof = () => {
    if(this.props.photoProofList.length > 0) {
      this.props.photoProofSubmittedHandler(true);
      this.props.addPhotoProofList([]);
      this.props.navigation.navigate('Order', {screen: 'Order'});
    }
  }
  setWrapperofStack = (index,key) => {
    const {indexBottomBar} = this.props;
    console.log(indexBottomBar + key);
    if(indexBottomBar === 1){
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
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
      Completed: {
        screen: (props) => {
          this.props.navigation.setOptions({headerTransparent:false, headerShown: true});
          return (<Completed {...props}/>);},
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
      headerMode: 'screen',
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#121C78',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          ...Platform.select({
            android: {
              height: 45,
            },
          })
        },
        headerTitleStyle: {...Mixins.h6,fontWeight: '400',lineHeight: 22,
        ...Platform.select({
          ios: {
            marginHorizontal: 20,
          },
        })
        },
        headerBackImage:({tintColor})=>(<IconArrow66Mobile height="22" width="18" fill={tintColor}/>),
        header: (props) => {
          let state = props.navigation.dangerouslyGetState();
          let key =  state.routes[state.index].name;
          let index = state.index;
          this.setWrapperofStack(index,key);
        },
      },
    }
  );
  render(){
    console.log('navigation switch');
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
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    photoProofList: state.originReducer.photoProofList,
    indexBottomBar : state.originReducer.filters.indexBottomBar,
    indexStack : state.originReducer.filters.indexStack,
    keyStack : state.originReducer.filters.keyStack,
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
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);

