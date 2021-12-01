import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator, Header} from '@react-navigation/stack';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
// component
import SelfRecollectionList from './selfRecollectionList';
import RecollectionForm from './recollectionForm';
import RecollectionDetails from './recollectionDetails';
import SelectCustomer from './selectCustomer';
import RecollectionCamera from '../peripheral/recollectionCamera';
import RecollectionEnlargeImage from '../peripheral/recollectionEnlargeImage';
// style
import Mixins from '../../../../mixins';
// icon
import IconArrow66Mobile from '../../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';

const Stack = createStackNavigator();

class SelfRecollectionNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setWrapperofStack = (index, key) => {
    this.props.setCurrentStackKey(key);
    this.props.setCurrentStackIndex(index);
  };

  submitRecollectionPhotoList = () => {
    if (this.props.recollectionPhotoList.length > 0) {
      this.props.setRecollectionPhotoSubmitted(true);
      this.props.navigation.navigate('RecollectionForm');
    }
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
          }}
        />
        <Stack.Screen
          component={RecollectionForm}
          name="RecollectionForm"
          options={{
            headerTitle: 'Self Recollection',
          }}
        />
        <Stack.Screen
          component={RecollectionDetails}
          name="RecollectionDetails"
          options={{
            headerTitle: 'Item Details',
          }}
        />
        <Stack.Screen
          component={SelectCustomer}
          name="SelectCustomer"
          options={{
            headerTitle: 'Select Customer',
          }}
        />
        <Stack.Screen
          component={RecollectionCamera}
          name="RecollectionCamera"
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerBackTitle: 'Back',
            headerRight: () => {
              return (
                <Button
                  type="clear"
                  title={'Submit'}
                  buttonStyle={{paddingHorizontal: 20, margin: 0}}
                  iconContainerStyle={{padding: 0, margin: 0}}
                  titleStyle={{
                    ...Mixins.h6,
                    padding: 0,
                    margin: 0,
                    color: '#fff',
                  }}
                  onPress={this.submitRecollectionPhotoList}
                />
              );
            },
          }}
        />
        <Stack.Screen
          component={RecollectionEnlargeImage}
          name="EnlargeImage"
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    recollectionPhotoList: state.originReducer.recollectionPhotoList,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
    setRecollectionPhotoSubmitted: (toggle) => {
      return dispatch({type: 'RecollectionPhotoSubmitted', payload: toggle});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelfRecollectionNavigator);
