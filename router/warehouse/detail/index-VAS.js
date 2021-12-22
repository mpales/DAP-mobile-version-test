import React from 'react';
import {Text, Button, Image, Avatar} from 'react-native-elements';
import {View, ScrollView} from 'react-native';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import IVASNote from '../../../assets/icon/iconmonstr-shipping-box-8mobile.svg';
import OVASNote from '../../../assets/icon/iconmonstr-shipping-box-9mobile.svg';
import DisposalNote from '../../../assets/icon/disposal-mobile.svg';
import CargoNote from '../../../assets/icon/iconmonstr-delivery-19mobile.svg';
import OtherNote from '../../../assets/icon/iconmonstr-shipping-box-2mobile.svg';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import LogoSmall from '../../../assets/dap_logo_hires1-e1544435829468 5small.svg';
class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowSignature: false,
    };
  }

  render() {
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <ScrollView
            style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: '#121C78',
              paddingHorizontal: 22,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            }}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                marginTop: 20,
                marginBottom: 10,
              }}>
              <LogoSmall
                width="135"
                height="70"
                style={{alignSelf: 'center'}}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                flexShrink: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 10,
              }}>
              <Text
                style={{
                  ...Mixins.h1,
                  lineHeight: 36,
                  fontWeight: '700',
                  color: '#fff',
                }}>
                Value-Added Services
              </Text>
            </View>
            <View style={{flexDirection: 'row', flexShrink: 1}}>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <IVASNote height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="IVAS"
                  overlayContainerStyle={[
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle,
                  ]}
                  onPress={() =>
                    this.props.navigation.navigate('VAS', {
                      screen: 'List',
                      type: 'IVAS',
                    })
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
                    {...Mixins.subtitle3, lineHeight: 16, fontWeight: '700'},
                    this.props.currentASN === null ? {color: '#6C6B6B'} : null,
                  ]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <OVASNote height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="OVAS"
                  overlayContainerStyle={
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle
                  }
                  onPress={() =>
                    this.props.navigation.navigate('VAS', {
                      screen: 'List',
                      type: 'OVAS',
                    })
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
                    {...Mixins.subtitle3, lineHeight: 16, fontWeight: '700'},
                  ]}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', flexShrink: 1}}>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <DisposalNote height="70" width="60" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="DISPOSAL"
                  overlayContainerStyle={[
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle,
                  ]}
                  onPress={() =>
                    this.props.navigation.navigate('VAS', {
                      screen: 'List',
                      type: 'DISPOSAL',
                    })
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
                    {...Mixins.subtitle3, lineHeight: 16, fontWeight: '700'},
                    this.props.currentASN === null ? {color: '#6C6B6B'} : null,
                  ]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <CargoNote height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="CARGO CHECK"
                  overlayContainerStyle={
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle
                  }
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('VAS', {
                      screen: 'PalletList',
                    });
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
                    {...Mixins.subtitle3, lineHeight: 16, fontWeight: '700'},
                  ]}
                />
              </View>
            </View>
            <View style={{flexDirection: 'row', flexShrink: 1}}>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <OtherNote height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                      ...Mixins.buttonFloatedAvatarDefaultIconStyle,
                    },
                  }}
                  title="OTHER"
                  overlayContainerStyle={[
                    Mixins.buttonFloatedAvatarDefaultOverlayStyle,
                  ]}
                  activeOpacity={0.7}
                  containerStyle={
                    Mixins.buttonFloatedAvatarDefaultContainerStyle
                  }
                  placeholderStyle={
                    Mixins.buttonFloatedAvatarDefaultPlaceholderStyle
                  }
                  titleStyle={[
                    Mixins.buttonFloatedAvatarDefaultTitleStyle,
                    {...Mixins.subtitle3, lineHeight: 16, fontWeight: '700'},
                    this.props.currentASN === null ? {color: '#6C6B6B'} : null,
                  ]}
                />
              </View>
              <View style={styles.sectionContainer}></View>
            </View>
          </ScrollView>
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}

const styles = {
  sectionSheetButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  buttonDivider: {
    flex: 1,
  },
  sectionContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
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
    marginVertical: 12,
    ...Mixins.h4,
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
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#6C6B6B',
    marginVertical: 12,
  },
  containerInput: {
    borderBottomColor: '#ABABAB',
    borderBottomWidth: 1,
    marginVertical: 0,
    paddingVertical: 0,
  },
  inputStyle: {
    ...Mixins.lineInputDefaultStyle,
    ...Mixins.body1,
    marginHorizontal: 0,
    flexShrink: 1,
    minHeight: 30,
    lineHeight: 21,
    fontWeight: '400',
  },
  labelStyle: {
    ...Mixins.lineInputDefaultLabel,
    ...Mixins.body1,
    lineHeight: 14,
    fontWeight: '400',
  },
  inputErrorStyle: {
    ...Mixins.body2,
    lineHeight: 14,
    marginVertical: 0,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 13,
    elevation: 8,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 0,
  },
  checkmark: {
    position: 'absolute',
    bottom: 62,
    right: 16,
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
    currentASN: state.originReducer.filters.currentASN,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    signatureSubmittedHandler: (signature) =>
      dispatch({type: 'Signature', payload: signature}),
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setStartDelivered: (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);
