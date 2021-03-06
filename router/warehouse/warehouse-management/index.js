import React from 'react';
import {
  createStackNavigator,
  HeaderBackButton,
  Header,
} from '@react-navigation/stack';
import {Avatar} from 'react-native-elements';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
// module navigator
import StockTakeNavigator from './stock-take';
import StockTakeSupervisorNavigator from './stock-take-supervisor';
import RelocationNavigator from './relocation';
import SearchInventoryNavigator from './search-inventory';
import ClientInventoryNavigator from './client-inventory';
import SelfRecollectionNavigator from './self-recollection';
// icon
import WarehouseRelocationIcon from '../../../assets/icon/warehouse-mobile.svg';
import StockTakeIcon from '../../../assets/icon/iconmonstr-shipping-box-2mobile.svg';
import StockTakeSupervisorIcon from '../../../assets/icon/iconmonstr-delivery-10 1mobile.svg';
import CheckInventoryIcon from '../../../assets/icon/iconmonstr-delivery-19mobile.svg';
import ClientInventoryIcon from '../../../assets/icon/iconmonstr-cube-18mobile.svg';
import SelfRecollectionIcon from '../../../assets/icon/iconmonstr-shipping-box-11mobile.svg';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-7.svg';
import LogoSmall from '../../../assets/dap_logo_hires1-e1544435829468 5small.svg';

const Stack = createStackNavigator();

class WarehouseManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowSignature: false,
    };
    this.setWrapperofStack.bind(this);
  }

  setWrapperofStack = (index, key) => {
    if (index === 0 && key === 'ManagementMenu') {
      this.props.setCurrentStackKey(key);
      this.props.setCurrentStackIndex(index);
    }
  };

  managementMenu = () => {
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <ScrollView
            style={[
              styles.menuContainer,
              {paddingTop: insets.top, paddingBottom: insets.bottom},
            ]}
            showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              <LogoSmall
                width="135"
                height="70"
                style={{alignSelf: 'center'}}
              />
            </View>
            <View style={styles.menuButtonContainer}>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <StockTakeIcon height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="STOCK TAKE"
                  overlayContainerStyle={
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle
                  }
                  onPress={() => {
                    this.props.navigation.navigate('StockTakeNavigator');
                  }}
                  activeOpacity={0.7}
                  containerStyle={
                    Mixins.buttonFloatedAvatarDefaultContainerStyle
                  }
                  placeholderStyle={
                    Mixins.buttonFloatedAvatarDefaultPlaceholderStyle
                  }
                  titleStyle={[
                    Mixins.buttonFloatedAvatarDefaultTitleStyle,
                    styles.buttonTitle,
                  ]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <StockTakeSupervisorIcon
                      height="70"
                      width="70"
                      fill="#6C6B6B"
                    />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="STOCK TAKE SUPERVISOR"
                  overlayContainerStyle={
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle
                  }
                  onPress={() => {
                    this.props.navigation.navigate(
                      'StockTakeSupervisorNavigator',
                    );
                  }}
                  activeOpacity={0.7}
                  containerStyle={
                    Mixins.buttonFloatedAvatarDefaultContainerStyle
                  }
                  placeholderStyle={
                    Mixins.buttonFloatedAvatarDefaultPlaceholderStyle
                  }
                  titleStyle={[
                    Mixins.buttonFloatedAvatarDefaultTitleStyle,
                    styles.buttonTitle,
                  ]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <WarehouseRelocationIcon
                      height="70"
                      width="70"
                      fill="#6C6B6B"
                    />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="WAREHOUSE RELOCATION"
                  overlayContainerStyle={
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle
                  }
                  onPress={() => {
                    this.props.navigation.navigate('RelocationNavigator');
                  }}
                  activeOpacity={0.7}
                  containerStyle={
                    Mixins.buttonFloatedAvatarDefaultContainerStyle
                  }
                  placeholderStyle={
                    Mixins.buttonFloatedAvatarDefaultPlaceholderStyle
                  }
                  titleStyle={[
                    Mixins.buttonFloatedAvatarDefaultTitleStyle,
                    styles.buttonTitle,
                  ]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <CheckInventoryIcon height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="SEARCH INVENTORY"
                  overlayContainerStyle={
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle
                  }
                  onPress={() =>
                    this.props.navigation.navigate('SearchInventoryNavigator')
                  }
                  activeOpacity={0.7}
                  containerStyle={
                    Mixins.buttonFloatedAvatarDefaultContainerStyle
                  }
                  placeholderStyle={
                    Mixins.buttonFloatedAvatarDefaultPlaceholderStyle
                  }
                  titleStyle={[
                    Mixins.buttonFloatedAvatarDefaultTitleStyle,
                    styles.buttonTitle,
                  ]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <SelfRecollectionIcon
                      height="70"
                      width="70"
                      fill="#6C6B6B"
                    />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="SELF COLLECTION"
                  overlayContainerStyle={
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle
                  }
                  onPress={() =>
                    this.props.navigation.navigate('SelfRecollectionNavigator')
                  }
                  activeOpacity={0.7}
                  containerStyle={
                    Mixins.buttonFloatedAvatarDefaultContainerStyle
                  }
                  placeholderStyle={
                    Mixins.buttonFloatedAvatarDefaultPlaceholderStyle
                  }
                  titleStyle={[
                    Mixins.buttonFloatedAvatarDefaultTitleStyle,
                    styles.buttonTitle,
                  ]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <ClientInventoryIcon
                      height="70"
                      width="70"
                      fill="#6C6B6B"
                    />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="CLIENT INVENTORY"
                  overlayContainerStyle={
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle
                  }
                  onPress={() =>
                    this.props.navigation.navigate('ClientInventoryNavigator')
                  }
                  activeOpacity={0.7}
                  containerStyle={
                    Mixins.buttonFloatedAvatarDefaultContainerStyle
                  }
                  placeholderStyle={
                    Mixins.buttonFloatedAvatarDefaultPlaceholderStyle
                  }
                  titleStyle={[
                    Mixins.buttonFloatedAvatarDefaultTitleStyle,
                    styles.buttonTitle,
                  ]}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  };

  render() {
    return (
      <Stack.Navigator
        initialRouteName="ManagementMenu"
        screenOptions={{
          headerBackImage: () => (
            <IconArrow66Mobile height="22" width="18" fill="#FFF" />
          ),
          headerTransparent: true,
          headerTitle: '',
          headerBackTitleVisible: true,
          headerBackTitleStyle: {color: '#FFF'},
          headerLeftContainerStyle:
            Platform.OS === 'ios' ? {paddingHorizontal: 15} : null,
          header: (props) => {
            let state = props.navigation.dangerouslyGetState();
            let key = state.routes[state.index].name;
            let index = state.index;
            this.setWrapperofStack(index, key);
            return <Header {...props} />;
          },
        }}>
        <Stack.Screen
          component={this.managementMenu}
          name="ManagementMenu"
          options={{
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  this.props.navigation.navigate('MenuWarehouse');
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          component={StockTakeNavigator}
          name="StockTakeNavigator"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={StockTakeSupervisorNavigator}
          name="StockTakeSupervisorNavigator"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={RelocationNavigator}
          name="RelocationNavigator"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={SearchInventoryNavigator}
          name="SearchInventoryNavigator"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={ClientInventoryNavigator}
          name="ClientInventoryNavigator"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={SelfRecollectionNavigator}
          name="SelfRecollectionNavigator"
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }
}

const styles = {
  menuContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#121C78',
    paddingHorizontal: 22,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginVertical: 50,
  },
  buttonTitle: {
    ...Mixins.subtitle3,
    lineHeight: 16,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  menuButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  sectionContainer: {
    width: '50%',
    marginVertical: 10,
    alignItems: 'center',
  },
};
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isPhotoProofSubmitted: state.originReducer.filters.isPhotoProofSubmitted,
    isSignatureSubmitted: state.originReducer.filters.isSignatureSubmitted,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setStartDelivered: (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
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
)(WarehouseManagement);
