import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, Header} from '@react-navigation/stack';
import {connect} from 'react-redux';
// component
import SelfRecollectionList from './selfRecollectionList';
// style
import Mixins from '../../../../mixins';
// icon
import IconArrow66Mobile from '../../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';

const Stack = createStackNavigator();

class SelfRecollectionNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setWrapperofStack.bind(this);
  }
  setWrapperofStack = (index, key) => {
    this.props.setCurrentStackKey(key);
    this.props.setCurrentStackIndex(index);
  };

  render() {
    return (
      <Stack.Navigator
        initialRouteName="SelfRecollectionList"
        screenOptions={{
          headerBackImage: () => (
            <IconArrow66Mobile height="22" width="18" fill="#FFF" />
          ),
          headerShown: true,
          headerBackTitleVisible: true,
          headerBackTitleStyle: {color: '#FFF'},
          headerStyle: {
            backgroundColor: '#121C78',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            ...Platform.select({
              android: {
                height: 45,
              },
            }),
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {...Mixins.subtitle3, lineHeight: 50},
          headerTintColor: '#FFF',
          headerLeftContainerStyle:
            Platform.OS === 'ios' ? {paddingHorizontal: 15} : null,
          headerBackTitle: 'Back',
          header: (props) => {
            let state = props.navigation.dangerouslyGetState();
            let key = state.routes[state.index].name;
            let index = state.index;
            this.setWrapperofStack(index, key);
            return <Header {...props} />;
          },
        }}>
        <Stack.Screen
          component={SelfRecollectionList}
          name="SelfRecollectionList"
          options={{
            headerTitle: 'Self Recollection',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelfRecollectionNavigator);
