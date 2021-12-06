import React from 'react';
import {InteractionManager} from 'react-native';
import Acknowledge from './acknowledge';
import DetailComponent from './detail';
import {connect} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

class Detail extends React.Component {
  unsubscribe = null;
  constructor(props) {
    super(props);
    this.setWrapperofStack.bind(this);
  }

  setWrapperofStack = (index, key) => {
    console.log('test',key);
    this.props.setCurrentStackKey(key);
    this.props.setCurrentStackIndex(index);
  };

  componentDidMount(){
  
  }

  componentWillUnmount(){

  }
  render() {
    const {routes,index} = this.props.navigation.dangerouslyGetParent().getParent().dangerouslyGetState();
   console.log(routes[index].params);
    return (
      <Stack.Navigator
        initialRouteName={routes[index].params !== undefined &&
          routes[index].params.screen !== undefined
            ? routes[index].params.screen
            : 'Detail'}
        headerMode="screen"
        screenOptions={{
          headerTintColor: 'white',
          header: (props) => {
            let state = props.navigation.dangerouslyGetState();
            let key = state.routes[state.index].name;
            let index = state.index;
            this.setWrapperofStack(index, key);
          },
        }}>
        <Stack.Screen
          name="Acknowledgement"
          component={Acknowledge}
          options={{
            title: 'Beranda app',
          }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailComponent}
          options={{
            title: 'Beranda app',
          }}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    indexBottomBar : state.originReducer.filters.indexBottomBar,
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
