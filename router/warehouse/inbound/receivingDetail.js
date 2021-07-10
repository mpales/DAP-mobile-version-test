import React from 'react';
import {Text, Button, Input, Avatar, Image} from 'react-native-elements';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import moment from 'moment';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';


class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    this.state = {
      bottomSheet: false,
      isShowSignature: false,
      receivingNumber: routes[index].params.number,
      data : null,
    };
  }
  static getDerivedStateFromProps(props,state){
    const {inboundList} = props;
    const {receivingNumber} = state;
    if(receivingNumber === undefined){
      return {...state};
    }
    if(state.data === null){
      return {...state, data: inboundList.find((element)=> element.number === receivingNumber)};
    }
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.keyStack !== nextProps.keyStack){
      if(nextProps.keyStack === 'ReceivingDetail'){
        this.props.setBottomBar(true);
        return true;
      }
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.data !== this.state.data){
      if(this.state.data === undefined) {
        this.props.addPhotoProofPostpone(null);
        this.props.navigation.goBack();
      } else {
        //
      }
    }
    if(prevState.receivingNumber !== this.state.receivingNumber){
      this.props.addPhotoProofPostpone(null);
      if(this.props.receivingNumber === undefined){
        this.props.navigation.goBack();
      }
    }
  }
  componentDidMount(){
  }



  render(){
    const {data} = this.state;
    const {userRole} = this.props;
    if(userRole === 'default'){
      return (  
        <View style={{flex: 1, flexDirection:'column', backgroundColor: 'white', justifyContent: 'center',alignItems: 'center'}}>
      <Image
        source={require('../../../assets/group_mobile.png')}
        style={{ width: 280, height: 236 }}
      />
      </View>)
    }
    return (
        <View style={{flex: 1, flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 22,paddingVertical: 25}}>
         <View style={{flexDirection:'row', flexShrink:1}}>
             <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'center',marginRight: 20}}>
                 <Text>Client</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0}}
                inputContainerStyle={styles.textInput} 
                inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21}]}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                placeholder={data.transport}
                disabled={true}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
              <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'center',marginRight: 20}}>
                   <Text>Rcpt #</Text>
             </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0}}
              inputContainerStyle={styles.textInput} 
                inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21}]}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                placeholder={data.rcpt}
                disabled={true}
            />
            <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, alignItems: 'center',marginRight: 10}}>
                   <Text>N</Text>
             </View>
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'center',marginRight: 20}}>
              <Text>Doc Ref #</Text>
             </View>
             <Input 
               containerStyle={{flex: 1,paddingVertical:0}}
               inputContainerStyle={styles.textInput} 
                inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21}]}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                placeholder={data.ref}
                disabled={true}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'center',marginRight: 20}}>
              <Text>PO #</Text>
             </View>
             <Input 
               containerStyle={{flex: 1,paddingVertical:0}}
               inputContainerStyle={styles.textInput} 
                inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21}]}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                placeholder={data.number}
                disabled={true}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>            
         <Text>Status</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0}}
                inputContainerStyle={[styles.textInput,{backgroundColor:'#F8B511'}]} 
                inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21,textTransform: 'uppercase', color:'#fff'}]}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                value={data.status}
                disabled={false}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
         <Text>Date</Text>
         
           </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0}}
              inputContainerStyle={styles.textInput} 
                inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21}]}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                placeholder={moment.unix(data.timestamp).format('DD/MM/YYYY')}
                disabled={true}
            />
         </View>
         <View style={{alignItems: 'center',justifyContent: 'center', marginVertical: 20}}>
         <Avatar
          onPress={()=>{
            this.props.setBottomBar(false);
            this.props.navigation.navigate('SingleCamera')}}
                size={79}
                ImageComponent={() => (
                  <>
                    <IconPhoto5 height="40" width="40" fill="#fff" />
                    {this.props.photoProofPostpone !== null && (
                      <Checkmark
                        height="20"
                        width="20"
                        fill="#fff"
                        style={styles.checkmark}
                      />
                    )}
                  </>
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: this.props.photoProofPostpone !== null
                    ? '#17B055'
                    : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}/>
                <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B'}}>Photo Proof Container</Text>
         </View>
         <Button
              containerStyle={{flex:1, marginRight: 20,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={()=>{
                this.props.addPhotoProofPostpone( null );
                this.props.setBottomBar(false);
                this.props.setActiveASN(this.state.receivingNumber);
                this.props.setCurrentASN(this.state.receivingNumber);
                this.props.setReportedManifest(null);
                this.props.setItemScanned([]);
                this.props.setManifestList([]);
                this.props.navigation.navigate(  {
                  name: 'Manifest',
                  params: {
                    number: data.number,
                  },
                })}}
              title="Start Receiving"
              disabled={this.props.photoProofPostpone === null ? true : false}
            />
        </View>
    );
  }
}

const styles = {
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 30,
},
  sectionSheetButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  deliveryText: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight:'600',
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
    bottom: 5, 
    right: 5
  },
};
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole.role,
    isPhotoProofSubmitted: state.originReducer.filters.isPhotoProofSubmitted,
    isSignatureSubmitted: state.originReducer.filters.isSignatureSubmitted,
    photoProofPostpone: state.originReducer.photoProofPostpone,
    inboundList: state.originReducer.inboundList,
    keyStack: state.originReducer.filters.keyStack,
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
    setCurrentASN : (data)=> {
      return dispatch({type:'setASN', payload: data});
    },
    setActiveASN : (data)=> {
      return dispatch({type:'addActiveASN', payload: data});
    },
    addPhotoProofPostpone: (uri) => dispatch({type: 'PhotoProofPostpone', payload: uri}),
    //prototype only
    setManifestList: (data) => {
      return dispatch({type: 'ManifestList', payload: data});
    },
    setItemScanned : (item) => {
      return dispatch({type: 'BarcodeScanned', payload: item});
    },
    setReportedManifest: (data) => {
      return dispatch({type:'ReportedManifest', payload: data});
    },
    //end
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

