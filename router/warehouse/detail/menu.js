import React from 'react';
import {Text, Button,Image} from 'react-native-elements';
import {View} from 'react-native';
import Inbound from '../../../assets/icon/iconmonstr-shipping-box-8mobile.svg';
import Outbound from '../../../assets/icon/iconmonstr-shipping-box-9mobile.svg';
import Warehouse from '../../../assets/icon/iconmonstr-building-6mobile.svg';
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
    this.props.setBottomBar(false);
    return (
        <View style={{flex: 1, flexDirection:'column', backgroundColor: '#E5E5E5', paddingHorizontal: 22,}}>
          <View style={{alignItems:'center', justifyContent: 'center',flexDirection: 'column',marginVertical: 100}}>
          <Image
              source={require('../../../assets/dap_logo_hires1thumb.png')}
              style={{ width: 135, height: 70 }}
            />
          </View>
           
          <Button
                containerStyle={ {marginVertical: 10, borderRadius: 10}}
                icon={() => (
                    <Inbound height="60" width="60" fill="#ABABAB" />
                )}
                iconContainerStyle={[Mixins.rectDefaultButtonIconStyle]}
                title="INBOUND"
                titleStyle={{color: '#6C6B6B', ...Mixins.h1, lineHeight: 36,flex:1}}
                onPress={()=>{
                  this.props.setBottomBar(true);
                  this.props.setWarehouseModule('INBOUND');
                  this.props.navigation.navigate('Details')}}
                buttonStyle={{backgroundColor: '#FFFFFF',paddingVertical:15, paddingHorizontal: 35}}
              />
                 
          <Button
               containerStyle={ {marginVertical: 10, borderRadius: 10}}
                 icon={() => (
                    <Outbound height="60" width="60" fill="#ABABAB" />
                )}
                iconContainerStyle={Mixins.rectDefaultButtonIconStyle}
                title="OUTBOUND"
                titleStyle={{color: '#6C6B6B', ...Mixins.h1, lineHeight: 36,flex:1}}
                onPress={()=>{
                  this.props.setBottomBar(true);
                  this.props.setWarehouseModule('OUTBOUND');
                    this.props.navigation.navigate('Details')}}
                    buttonStyle={{backgroundColor: '#FFFFFF',paddingVertical:15, paddingHorizontal: 35}}
                    />
                 
          <Button
          containerStyle={ {marginVertical: 10, borderRadius: 10}}
            icon={() => (
                    <Warehouse height="60" width="60" fill="#ABABAB" />
                )}
                iconContainerStyle={[Mixins.rectDefaultButtonIconStyle,{}]}
                title="WAREHOUSE"
                titleStyle={{color: '#6C6B6B', ...Mixins.h1, lineHeight: 36,flex:1}}
                onPress={()=>{
                  this.props.setBottomBar(true);
                  this.props.setWarehouseModule('WAREHOUSE');
                    this.props.navigation.navigate('Details')}}
                    buttonStyle={{backgroundColor: '#FFFFFF',paddingVertical:15, paddingHorizontal: 35}}
                    />
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
    },
    setWarehouseModule : (toggle) => {
      return dispatch({type: 'warehouseModule', payload: toggle});
    }
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

