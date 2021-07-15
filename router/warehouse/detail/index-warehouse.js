import React from 'react';
import {Text, Button,Image, Avatar} from 'react-native-elements';
import {View} from 'react-native';
import ShippingBox from '../../../assets/icon/iconmonstr-shipping-box-2mobile.svg';
import Warehouse from '../../../assets/icon/warehouse-mobile.svg';
import Report from '../../../assets/icon/note-mobile.svg';
import Shipping from '../../../assets/icon/iconmonstr-airport-8mobile.svg';
import Recycling from '../../../assets/icon/recycle-mobile.svg';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';

class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowSignature: false,
    };
  }



  render(){
    return (
        <View style={{flex: 1, flexDirection:'column', backgroundColor: '#121C78', paddingHorizontal: 22,}}>
          <View style={{alignItems:'center', justifyContent: 'center',flexDirection: 'column',marginVertical: 50}}>
          <Image
              source={require('../../../assets/dap_logo_hires1thumb.png')}
              style={{ width: 135, height: 70 }}
            />
          </View>
          <View style={{flexDirection: 'row', flexShrink:1}}>
          <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <ShippingBox height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonFloatedAvatarDefaultIconStyle
                    },
                  }}
                  title="Stock Tick"
                  overlayContainerStyle={Mixins.buttonFloatedAvatarDefaultOverlayStyle}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('Management',{screen:'Stock'})}}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonFloatedAvatarDefaultContainerStyle}
                  placeholderStyle={Mixins.buttonFloatedAvatarDefaultPlaceholderStyle}
                  titleStyle={[Mixins.buttonFloatedAvatarDefaultTitleStyle,{...Mixins.subtitle3,lineHeight:16,fontWeight: '700'}]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <Warehouse height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonFloatedAvatarDefaultIconStyle
                    },
                  }}
                  title="Warehouse Relocation"
                  overlayContainerStyle={Mixins.buttonFloatedAvatarDefaultOverlayStyle}
                  onPress={() => {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('Management',{screen:'Location'})}}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonFloatedAvatarDefaultContainerStyle}
                  placeholderStyle={Mixins.buttonFloatedAvatarDefaultPlaceholderStyle}
                  titleStyle={[Mixins.buttonFloatedAvatarDefaultTitleStyle,{...Mixins.subtitle3,lineHeight:16,fontWeight: '700'}]}
                />
              </View>
          </View>
          
          <View style={{flexDirection: 'row', flexShrink:1}}>
          <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <Report height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonFloatedAvatarDefaultIconStyle
                    },
                  }}
                  title="Report"
                  overlayContainerStyle={Mixins.buttonFloatedAvatarDefaultOverlayStyle}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonFloatedAvatarDefaultContainerStyle}
                  placeholderStyle={Mixins.buttonFloatedAvatarDefaultPlaceholderStyle}
                  titleStyle={[Mixins.buttonFloatedAvatarDefaultTitleStyle,{...Mixins.subtitle3,lineHeight:16,fontWeight: '700'}]}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <Shipping height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonFloatedAvatarDefaultIconStyle
                    },
                  }}
                  title="Shipping"
                  overlayContainerStyle={Mixins.buttonFloatedAvatarDefaultOverlayStyle}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonFloatedAvatarDefaultContainerStyle}
                  placeholderStyle={Mixins.buttonFloatedAvatarDefaultPlaceholderStyle}
                  titleStyle={[Mixins.buttonFloatedAvatarDefaultTitleStyle,{...Mixins.subtitle3,lineHeight:16,fontWeight: '700'}]}
                />
              </View>
          </View>
          <View style={{flexDirection: 'row', flexShrink:1}}>
          <View style={styles.sectionContainer}>
                <Avatar
                  size={140}
                  ImageComponent={() => (
                    <Recycling height="70" width="70" fill="#6C6B6B" />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonFloatedAvatarDefaultIconStyle
                    },
                  }}
                  title="Recycling"
                  overlayContainerStyle={Mixins.buttonFloatedAvatarDefaultOverlayStyle}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonFloatedAvatarDefaultContainerStyle}
                  placeholderStyle={Mixins.buttonFloatedAvatarDefaultPlaceholderStyle}
                  titleStyle={[Mixins.buttonFloatedAvatarDefaultTitleStyle,{...Mixins.subtitle3,lineHeight:16,fontWeight: '700'}]}
                />
              </View>
              <View style={styles.sectionContainer}>
              
              </View>
          </View>
        </View>
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
    right: 16
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
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    signatureSubmittedHandler: (signature) => dispatch({type: 'Signature', payload: signature}),
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setStartDelivered : (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    }
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

