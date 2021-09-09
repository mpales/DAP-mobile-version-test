import React from 'react';
import {Avatar, Text, Button, Input, Badge,Overlay} from 'react-native-elements';
import {View,TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import IconSpeech26 from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import IconPen7 from '../../../assets/icon/iconmonstr-pen-7 1mobile.svg';
import IconFile24 from '../../../assets/icon/iconmonstr-file-24 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import Signature from '../peripheral/signature';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import ContactClient from '../../../component/linked/contactClient';
import OfflineMode from '../../../component/linked/offlinemode';
const window = Dimensions.get('window');

class POD extends React.Component {
  constructor(props) {
    super(props);
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    const singleData = this.props.dataPackage[routes[index].params.index];
 
    this.state = {
      singleData: singleData,
      bottomSheet: false,
      isShowSignature: false,
      _visibleOverlay : false,
      _visibleOverlayContact: false,
      indexPackage : routes[index].params.index,
      _isShowCancel: false,
      _isShowPostpone: false,
    };
    this.navigateToCamera.bind(this);
    this.submitSignature.bind(this);
    this.toggleOverlay.bind(this);
    this.toggleOverlayContact.bind(this);
    this.onLihatDetail.bind(this);
    this.handleShowCancel.bind(this);
    this.handleCancelConfirm.bind(this);
    this.handleShowPostpone.bind(this);
    this.handlePostponeConfirm.bind(this);
  }
  onLihatDetail = () => {
    this.props.setBottomBar(true);
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    this.props.navigation.navigate({
      routeName: 'Package',
      params: {
        index: routes[index].params.index,
      }
    });
  };
  navigateToCamera = () => {
    this.props.setBottomBar(false);
    this.props.navigation.navigate('Camera')
  }

  showSignatureHandler = (bottomBarValue) => {
    this.setState({isShowSignature: !this.state.isShowSignature});
    this.props.setBottomBar(bottomBarValue ?? true);
  }

  submitSignature = () => {
    this.props.signatureSubmittedHandler(true);
    this.showSignatureHandler();
  };
  toggleOverlay =()=> {
    const {_visibleOverlay} = this.state;
    this.setState({_visibleOverlay: !_visibleOverlay})
  }


  toggleOverlayContact = () => {
    const {_visibleOverlayContact} = this.state;
    this.setState({_visibleOverlayContact: !_visibleOverlayContact});
  };

  handleConfirm = ({action}) => {
    this.toggleOverlay();
    if(action) {
      this.props.setStartDelivered(false);
      this.props.navigation.navigate('Completed');
    }
  }

  

  handleShowCancel = () => {
    this.setState({
      _isShowCancel: !this.state._isShowCancel,
    });
  };

  handleCancelConfirm = async ({action}) => {
    this.handleShowCancel();
    if(action){
      this.props.navigation.navigate('List');
    }
  };

  handleShowPostpone = () => {
    this.setState({
      _isShowPostpone: !this.state._isShowPostpone,
    });
  };

  handlePostponeConfirm = ({action}) => {
    this.handleShowPostpone();
    if (action) {
      this.props.navigation.navigate('Cancel');
    }
  };

  componentDidMount(){
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    const singleData = this.props.dataPackage[routes[index].params.index];
    this.setState({singleData:singleData,indexPackage:routes[index].params.index});
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    const singleData = this.props.dataPackage[routes[index].params.index];
    if(this.state.indexPackage !== routes[index].params.index)
    this.setState({singleData:singleData,indexPackage:routes[index].params.index});
  }

  render(){
    const {named,packages,Address,list} = this.state.singleData;
    return (
      <>
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{paddingHorizontal: 22}}>
          <OfflineMode/>
          <View style={styles.sectionInput}>
            <View style={styles.inputContainer}>
              <Input
                containerStyle={{padding:0, margin: 0,marginVertical: 0,}}
                inputContainerStyle={{padding:0,margin:0,}}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                errorStyle={styles.inputErrorStyle}
                placeholder={named}
                label="Name"
              />
              <Input
              
                containerStyle={{padding:0, margin: 0,marginVertical: 0,}}
                inputContainerStyle={styles.containerInput}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                errorStyle={styles.inputErrorStyle}
                placeholder={Address}
                label="Address"
              />
              <Input
                inputContainerStyle={styles.containerInput}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                errorStyle={styles.inputErrorStyle}
                placeholder="Sneaker shoes 30 box"
                label="Package item"
              />
              <Input
                inputContainerStyle={styles.containerInput}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                errorStyle={styles.inputErrorStyle}
                placeholder="Please put in lobby"
                label="Instruction"
              />
        
            </View>
          </View>
          <View style={styles.sectionButtonGroup}>
            <View style={styles.sectionContainer}>
              <Avatar
                size={79}
                ImageComponent={() => (
                  <IconPhoto5 height="40" width="40" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: this.props.isPhotoProofSubmitted ? '#17B055' : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                onPress={() => {
                  this.props.isPhotoProofSubmitted 
                  ? null
                  : this.navigateToCamera()
                }}
                activeOpacity={0.7}
                containerStyle={{alignSelf: 'center'}}
              />
              {this.props.isPhotoProofSubmitted && 
                <Checkmark height="20" width="20" fill="#fff" style={styles.checkmark} />
              }
              <Text style={styles.sectionText}>Photo Proof</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Avatar
                size={79}
                ImageComponent={() => (
                  <IconPen7 height="40" width="40" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: this.props.isSignatureSubmitted ? '#17B055' : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                onPress={() => this.showSignatureHandler(false)}
                activeOpacity={0.7}
                containerStyle={{alignSelf: 'center'}}
              />
              {this.props.isSignatureSubmitted && 
                <Checkmark height="20" width="20" fill="#fff" style={styles.checkmark} />
              }
              <Text style={styles.sectionText}>E-Signature</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Avatar
                size={79}
                ImageComponent={() => (
                  <IconFile24 height="40" width="40" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                onPress={() => console.log('Works!')}
                activeOpacity={0.7}
                containerStyle={{alignSelf: 'center'}}
              />

              <Text style={styles.sectionText}>Invoice</Text>
            </View>
          </View>
          <View style={styles.sectionSheetButton}>
            <Button
              buttonStyle={styles.navigationButton}
              titleStyle={styles.deliveryText}
              title="Complete Delivery"
              onPress={()=>{
                this.toggleOverlay();
              }}
            />
            
            <Button
              buttonStyle={[styles.postponeButton, {marginTop: 10}]}
              titleStyle={styles.postponeText}
              disabledStyle={this.state.isSubmitting}
              title="Postpone"
              onPress={this.handleShowPostpone}
            />
            <View style={[styles.sectionDividier, {marginVertical: 12}]}>
              <Button
                containerStyle={[styles.buttonDivider, {marginRight: 10}]}
                title="Cancel"
                type="outline"
                onPress={this.handleShowCancel}
                titleStyle={{color: '#ABABAB', ...Mixins.subtitle3, lineHeight: 21}}
              />

            
                <Button
                containerStyle={[styles.buttonDivider, {marginLeft: 10}]}
                title="Contact"
                titleStyle={{
                  color: '#fff',
                  ...Mixins.subtitle3,
                  lineHeight: 21,
                }}
                onPress={this.toggleOverlayContact}
                buttonStyle={{backgroundColor: '#F07120'}}
              />
            </View>
          </View>
          </View>
        </ScrollView>
        {this.state.isShowSignature && 
          <Signature
            showSignatureHandler={this.showSignatureHandler}
            signatureSubmittedHandler={this.props.signatureSubmittedHandler}
          />
        }
         <Overlay fullScreen={false} overlayStyle={styles.containerStyleOverlay} isVisible={this.state._visibleOverlay} onBackdropPress={this.toggleOverlay}>
          <Text style={styles.confirmText}>Are you sure you want to 
Submit the POD?</Text>
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, {borderWidth: 1, borderColor: '#ABABAB'}]}
              onPress={() => this.handleConfirm({action: false})}
            >
            <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
              onPress={() => this.handleConfirm({action: true})}
            >
              <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
        <Overlay
          fullScreen={false}
          overlayStyle={styles.containerStyleOverlay}
          isVisible={this.state._isShowCancel}
          onBackdropPress={this.handleShowCancel}>
          <Text style={styles.confirmText}>
            Are you sure you want to cancel the deliver?
          </Text>
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {borderWidth: 1, borderColor: '#ABABAB'},
              ]}
              onPress={() => this.handleCancelConfirm({action: false})}>
              <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
              onPress={() => this.handleCancelConfirm({action: true})}>
              <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
        <Overlay
          fullScreen={false}
          overlayStyle={styles.containerStyleOverlay}
          isVisible={this.state._isShowPostpone}
          onBackdropPress={this.handleShowPostpone}>
          <Text style={styles.confirmText}>
            Are you sure you want to postpone the deliver?
          </Text>
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {borderWidth: 1, borderColor: '#ABABAB'},
              ]}
              onPress={() => this.handlePostponeConfirm({action: false})}>
              <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
              onPress={() => this.handlePostponeConfirm({action: true})}>
              <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
            </TouchableOpacity>
          </View>
        </Overlay>
        <ContactClient
          overlayState={this.state._visibleOverlayContact}
          toggleOverlay={this.toggleOverlayContact}
        />
      </>
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
    paddingTop: 15,
  },
  checkmark: {
    position: 'absolute', 
    bottom: 62, 
    right: 16
  },
  containerStyleOverlay: {
    position:'absolute',
    bottom:0,
    right:0,
    left:0,
    height:window.height * 0.3,
    borderTopRightRadius: 20, 
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cancelButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  confirmText: {
    fontSize: 20,
    textAlign: 'center',
  },
  cancelButton: {
    width: '40%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonDetail: {
    flexShrink: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 5,
    backgroundColor: '#F1811C',
    alignSelf: 'center',
    alignItems: 'center',
    height: 35,
    width: 130,
  },
  detailTitle: {
...Mixins.small3,
lineHeight: 12,
    fontWeight: '600',
    color: 'white',
  },
  postponeText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#F1811C',
  },
  postponeButton: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    backgroundColor: '#ffffff',
    borderRadius: 5,
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
    dataPackage: state.originReducer.route.dataPackage,
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

export default connect(mapStateToProps, mapDispatchToProps)(POD);

