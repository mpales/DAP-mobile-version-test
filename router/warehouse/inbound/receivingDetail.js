import React from 'react';
import {Text, Button, Input, Avatar, Image, CheckBox, LinearProgress} from 'react-native-elements';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import moment from 'moment';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import WarehouseIlustration from '../../../assets/icon/Group 4968warehouse_ilustrate_mobile.svg'
import {getData, postBlob} from '../../../component/helper/network';
import RNFetchBlob from 'rn-fetch-blob';
class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      acknowledged: false,
      bottomSheet: false,
      isShowSignature: false,
      receivingNumber: null,
      data : null,
      startReceiving: false,
      errors: '',
      progressLinearVal : 0,
      updateData: false,
    };
    this.toggleCheckBox.bind(this);
    this.startProcessing.bind(this);
    this.getPhotoReceivingGoods.bind(this);
    this.listenToProgressUpload.bind(this);
    this.goToList.bind(this);
    this.toggleStartReceiving.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {inboundList, navigation} = props;
    const {receivingNumber} = state;
    const {routes, index} = navigation.dangerouslyGetState();
    if(receivingNumber === null &&  routes[index].params !== undefined &&  routes[index].params.number !== undefined ){
        return {...state, receivingNumber: routes[index].params.number};
    }
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.receivingNumber === null ){
      this.props.navigation.goBack();
      return false;
    }
    if(this.props.keyStack !== nextProps.keyStack){
      if(nextProps.keyStack === 'ReceivingDetail'){
        this.setState({updateData:true});
        this.props.setBottomBar(true);
        return false;
      }
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    
    if(this.state.updateData === true){
      const result = await getData('inbounds/'+this.state.receivingNumber);
      if(typeof result === 'object' && result.errors === undefined){
        this.setState({updateData:false,data: result, startReceiving: result.status === 1 ? false : true,acknowledge: result.status === 1 ? false : true});
      } else {
        this.props.navigation.goBack();
      }
    } 
  }
  
  async componentDidMount(){
    const result = await getData('inbounds/'+this.state.receivingNumber);
    if(typeof result === 'object' && result.error === undefined){
      this.setState({data: result, startReceiving: result.status === 1 ? false : true,acknowledge: result.status === 1 ? false : true});
    } else {
      this.props.navigation.goBack();
    }
  }

  toggleCheckBox = () => {
    this.setState({
      acknowledged: !this.state.acknowledged,
    });
  };
  checkedIcon = () => {
    return (
      <View
        style={
          styles.checked
        }>
        <Checkmark height="14" width="14" fill="#FFFFFF" />
      </View>
    );
  };
  
  uncheckedIcon = () => {
    return <View style={styles.unchecked} />;
  };
  toggleStartReceiving = ()=>{
    this.setState({
      startReceiving: true,
    });
  };
  getPhotoReceivingGoods = async () => {
    const {photoProofPostpone} = this.props;
    let formdata = [];
    for (let index = 0; index < photoProofPostpone.length; index++) {
      let name,filename,path,type ='';
      await RNFetchBlob.fs.stat(photoProofPostpone[index]).then((FSStat)=>{
        name = FSStat.filename.replace('.','-');
        filename= FSStat.filename;
        path = FSStat.path;
        type = FSStat.type;
      });
      if(type === 'file')
      formdata.push({ name : 'photos', filename : filename, data: RNFetchBlob.wrap(path)})
    }
    return formdata;
  }
  goToList = ()=>{
    this.props.setBottomBar(false);
    this.props.setActiveASN(this.state.receivingNumber);
    this.props.setCurrentASN(this.state.receivingNumber);
    this.props.navigation.navigate(  {
      name: 'Manifest',
      params: {
        number: this.state.receivingNumber,
      },
    })
  }
  listenToProgressUpload = (written, total) => {
    this.setState({progressLinearVal:(1/total)*written});
  }
  startProcessing = async () => {
    const {photoProofPostpone} = this.props;
    let FormData = await this.getPhotoReceivingGoods();
    postBlob('/inbounds/'+this.state.receivingNumber, [
      // element with property `filename` will be transformed into `file` in form data
      { name : 'receiptNumber', data: this.state.data.inbound_asn !== null ? ''+this.state.data.inbound_asn.reference_id :  ''+this.state.data.inbound_grn.reference_id},
      // custom content type
      ...FormData,
    ], this.listenToProgressUpload).then(result=>{
      if(typeof result === 'object' && result.error === undefined){
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
            number: this.state.receivingNumber,
          },
        })
      } else {
        if(typeof result === 'object'){
          this.setState({errors: result.error});
        } else {
          this.setState({errors: result});
        }
      }
    });
  };
  render(){
    const {data,startReceiving} = this.state;
    const {userRole} = this.props;
    if(startReceiving === false){
      return (  
        <View style={{flexGrow: 1, flexDirection:'column', backgroundColor: 'white', justifyContent: 'center',alignItems: 'center', paddingHorizontal: 30}}>
    <WarehouseIlustration height="200" width="200" />
      <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '400',color: '#424141'}}>Before start receiving, please acknowledge the item</Text>
      <CheckBox
                title="I Acknowledge"
                textStyle={styles.text}
                containerStyle={styles.checkboxContainer}
                checked={this.state.acknowledged}
                onPress={this.toggleCheckBox}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />

        <Button
              containerStyle={{width:'100%', marginRight: 0,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.toggleStartReceiving}
              title="Start Receiving"
              disabled={(!this.state.acknowledged)}
            />
      </View>)
    }
    return (
        <View style={{flexGrow: 1, flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 22,paddingVertical: 25}}>
         <View style={{flexDirection:'row', flexShrink:1}}>
             <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'center',marginRight: 20}}>
                 <Text>Client</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0}}
                inputContainerStyle={styles.textInput} 
                inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.subtitle3,fontWeight:'600',lineHeight: 21}]}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                placeholder={data.company}
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
                placeholder={"test"}
                disabled={true}
            />
            <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, alignItems: 'center',marginRight: 10}}>
                   <Text>N</Text>
             </View>
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
                placeholder={data.eta}
                disabled={true}
            />
         </View>
        <View style={{alignItems: 'center',justifyContent: 'center', marginVertical: 20}}>
        {data.status ==='Waiting' && ( <>
         <Avatar
          onPress={()=>{
            if(this.props.photoProofID === null || this.props.photoProofID === data.id){
              this.props.setBottomBar(false);
              this.props.navigation.navigate('SingleCamera')              
            }
          }}
                size={79}
                ImageComponent={() => (
                  <>
                    <IconPhoto5 height="40" width="40" fill="#fff" />
                    {(this.props.photoProofPostpone !== null && (this.props.photoProofID !== null && this.props.photoProofID === data.id)) && (
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
                  backgroundColor: this.props.photoProofID !== null && this.props.photoProofID !== data.id ? 'grey' : this.props.photoProofPostpone !== null 
                    ? '#17B055'
                    : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}/>
                <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/>
                <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B'}}>Photo Proof Container</Text>
               {this.state.errors !== '' && ( <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '400',color:'red'}}>{this.state.errors}</Text>)}
                </>)}
                </View>
                
            {data.status === 'Waiting' ? ( <Button
              containerStyle={{flexShrink:1, marginVertical: 10,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.startProcessing}
              title={'Start Processing'}
              disabled={(this.props.photoProofPostpone === null || (this.props.photoProofID !== null && this.props.photoProofID !== data.id)) && data.status === 'Waiting' ? true : false}
            />) : ( <Button
              containerStyle={{flexShrink:1, marginVertical: 10,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.goToList}
              title={'Go To  List'}
            />)}

          <Button
              containerStyle={{flexShrink:1, marginRight: 0,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0, backgroundColor: '#121C78'}]}
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
                  name: 'RecordIVAS',
                  params: {
                    number: data.id,
                  },
                })}}
              title="Record IVAS"
        
            />
        </View>
    );
  }
}

const styles = {
  text: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#6C6B6B',
    textAlign: 'center',
  },
  checkboxContainer: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    margin: 0,
    paddingHorizontal: 0,
  },
  checked: {
    backgroundColor: '#2A3386',
    padding: 5,
    borderRadius: 2,
    marginRight: 5,
    marginVertical: 3,
  },
  unchecked: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#6C6B6B',
    padding: 5,
    marginRight: 5,
    marginVertical: 3,
  },
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
    photoProofID: state.originReducer.photoProofID,
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

