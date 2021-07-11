import React from 'react';
import {Text, Button,Image, Input} from 'react-native-elements';
import {View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Mixins from '../../../mixins';

class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      bottomSheet: false,
      isShowSignature: false,
      batch: '',
      lot :'',
      expDate: '',
      mfgDate: '',
      size: '',
      color : '',
      class : '',
      country : '',
      cLot : '',
      update: false,
    };
    this.submitItem.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation} = props;
    const {dataCode} = state;
    if(dataCode === '0'){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined) {
        return {...state, dataCode: routes[index].params.dataCode, update:false};
      } else if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined){
        return {...state, dataCode: routes[index].params.dataCode, update: true};
      }
      return {...state};
    } 
    
    return {...state};
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    
  }
  submitItem = ()=>{
    const {manifestList} = this.props;
    const {update,dataCode, batch,lot,expDate,mfgDate,size,color,classcode,country,cLot} = this.state;
    let manifest = []
    if(update){
      manifest = Array.from({length: manifestList.length}).map((num, index, arr) => {
        
      return {
        ...manifestList[index],
          code: dataCode,
          total_package: 2,
          name: batch+lot,
          color:color,
          category: cLot,
          timestamp: moment().unix(),
          scanned: 0,
          CBM: 20.10,
          weight: 115,
      };
    });
    } else {
      manifest = Array.from({length: manifestList.length + 1}).map((num, index, arr) => {
        if(index === arr.length - 1)
        return {
          code: dataCode,
          total_package: 2,
          name: batch+lot,
          color:color,
          category: cLot,
          timestamp: moment().unix(),
          scanned: 0,
          CBM: 20.10,
          weight: 115,
        };
      return manifestList[index];
    });
    }

    this.props.setManifestList(manifest)
    this.props.setBottomBar(false);
    if(update){
      this.props.navigation.navigate('Manifest');
    }else {

      this.props.navigation.navigate({
        name: 'Barcode',
        params: {
            inputCode: dataCode,
        }
      });
    }
  }
  onChangeTextBatch = (text)=> {
    this.setState({batch: text});
  }
  onSubmitedBatch = (e) => {
    this.setState({batch: e.nativeEvent.text});
  }

  onChangeTextLot = (text)=> {
    this.setState({lot: text});
  }
  onSubmitedLot = (e) => {
    this.setState({lot: e.nativeEvent.text});
  }
  onChangeTextexpdate = (text)=> {
    this.setState({expDate: text});
  }
  onSubmitedexpdate = (e) => {
    this.setState({expDate: e.nativeEvent.text});
  }
  onChangeTextmfgdate = (text)=> {
    this.setState({mfgDate: text});
  }
  onSubmitedmfgdate = (e) => {
    this.setState({mfgDate: e.nativeEvent.text});
  }
  onChangeTextsize = (text)=> {
    this.setState({size: text});
  }
  onSubmitedsize = (e) => {
    this.setState({size: e.nativeEvent.text});
  }
  onChangeTextcolor = (text)=> {
    this.setState({color: text});
  }
  onSubmitedcolor = (e) => {
    this.setState({color: e.nativeEvent.text});
  }
  onChangeTextclasscode = (text)=> {
    this.setState({classcode: text});
  }
  onSubmitedclasscode = (e) => {
    this.setState({classcode: e.nativeEvent.text});
  }
  onChangeTextcountry = (text)=> {
    this.setState({country: text});
  }
  onSubmitedcountry = (e) => {
    this.setState({country: e.nativeEvent.text});
  }
  onChangeTextclot = (text)=> {
    this.setState({cLot: text});
  }
  onSubmitedclot = (e) => {
    this.setState({cLot: e.nativeEvent.text});
  }
  render(){
    const {batch,lot,expDate,mfgDate,size,color,classcode,country,cLot} = this.state;
    return (
        <View style={{flex: 1, flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 22,paddingVertical: 25}}>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
             <Text>Batch#</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0}}
                inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextBatch.bind(this)}
                onSubmitEditing={this.onSubmitedBatch.bind(this)}
                value={batch}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
               <Text>Lot#</Text>
             </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextLot.bind(this)}
                onSubmitEditing={this.onSubmitedLot.bind(this)}
                value={lot}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
              <Text>Exp Date</Text>
             </View>
             <Input 
               containerStyle={{flex: 1,paddingVertical:0}}
               inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextexpdate.bind(this)}
                onSubmitEditing={this.onSubmitedexpdate.bind(this)}
                value={expDate}
            />
             <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, alignItems: 'center',marginRight: 10}}>
                   <Text>dd-MM-yyyy</Text>
             </View>
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
             <Text>Mfg Date</Text>
             </View>
             <Input 
               containerStyle={{flex: 1,paddingVertical:0}}
               inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextmfgdate.bind(this)}
                onSubmitEditing={this.onSubmitedmfgdate.bind(this)}
                value={mfgDate}
            />
                <View style={{flexShrink:1, backgroundColor: '#D5D5D5', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, alignItems: 'center',marginRight: 10}}>
                   <Text>dd-MM-yyyy</Text>
             </View>
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Size</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0}}
                inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextsize.bind(this)}
                onSubmitEditing={this.onSubmitedsize.bind(this)}
                value={size}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Color</Text>
           </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextcolor.bind(this)}
                onSubmitEditing={this.onSubmitedcolor.bind(this)}
                value={color}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Class</Text>
           </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextclasscode.bind(this)}
                onSubmitEditing={this.onSubmitedclasscode.bind(this)}
                value={classcode}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Country</Text>
           </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextcountry.bind(this)}
                onSubmitEditing={this.onSubmitedcountry.bind(this)}
                value={country}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
          <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, minWidth: 100, alignItems: 'flex-start',marginRight: 20}}>
          <Text>C.Lot#</Text>
           </View>
             <Input 
              containerStyle={{flex: 1,paddingVertical:0}}
              inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextclot.bind(this)}
                onSubmitEditing={this.onSubmitedclot.bind(this)}
                value={cLot}
            />
         </View>
         <Button
              containerStyle={{flex:1, marginRight: 20,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.submitItem}
              title="Add"
              disabled={ batch && lot && expDate && mfgDate && size && color && classcode && country && cLot ? false : true }
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
    manifestList: state.originReducer.manifestList,
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
    setFromBarcode: (dataCode) => {
      return dispatch({type: 'fromBarcode', payload: dataCode});
    },
    setManifestList: (data) => {
      return dispatch({type: 'ManifestList', payload: data});
    },
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

