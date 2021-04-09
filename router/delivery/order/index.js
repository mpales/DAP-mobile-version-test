import React from 'react';
import {Avatar, Text, Button, Input, Badge} from 'react-native-elements';
import {View} from 'react-native';
import IconSpeech26 from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import IconPen7 from '../../../assets/icon/iconmonstr-pen-7 1mobile.svg';
import IconFile24 from '../../../assets/icon/iconmonstr-file-24 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
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
          this.props.navigation.setOptions({   headerLeft: (props) => {
            return(
            <HeaderBackButton  {...props} onPress={()=>{
            this.props.setBottomBar(true);
             this.props.navigation.navigate('Order',{screen: 'Order'});
            }
            }
            />);
          }})
        return <Camera {...props}/>;},
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

const styles = {
  sectionSheetButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  deliveryText: {
    fontWeight: '600',
    color: '#ffffff',
    fontSize: 14,
  },
  navigationButton: {
    backgroundColor: '#121C78',
    borderRadius: 5,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  buttonDivider: {
    flex: 1,
  },
  sectionInput: {
    flexDirection: 'column',
    borderRadius: 13,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    marginBottom: 30,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  inputHead: {
    marginVertical: 17,
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 27,
  },
  sectionButtonGroup: {
    flexDirection: 'row',
  },
  sectionContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionText: {
    textAlign: 'center',
    width: 83,
    fontSize: 14,
    color: '#6C6B6B',
    marginVertical: 12,
  },
  inputStyle: {
    padding: 0,
    margin: 0,
    fontSize: 14,
    fontWeight: '400',
    color: '#ABABAB',
  },
  labelStyle: {
    padding: 0,
    margin: 0,
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 13,
    elevation: 8,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 10,
  },
};
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

