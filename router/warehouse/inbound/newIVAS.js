import React from 'react';
import {Text, Button,Image, Input} from 'react-native-elements';
import {View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Mixins from '../../../mixins';
import SelectDropdown from 'react-native-select-dropdown';
import SearchableDropdown from 'react-native-searchable-dropdown';
const IVASDATA = ["Forklift", "Labelling", "Take Off Price Tag"];

class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      IVAS : '',
      sku: '',
      qty: '',
      note: '',
      productList : [],
    };
    this.submitItem.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {manifestList} = props;
    state.productList = Array.from({length:manifestList.length}).map((num,index)=>{
      return {id:index+1,name:manifestList[index].sku}
    });
    return {...state};
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    
  }
  submitItem = ()=>{
    const {sku} = this.state;
    this.props.addIVAS(sku);
    this.props.navigation.navigate('IVAS');
  }
  onChangeTextSKU = (text)=> {
    this.setState({sku: text});
  }
  onChangeTextqty = (text)=> {
    this.setState({qty: text});
  }
  
  onChangeTextnote = (text)=> {
    this.setState({note: text});
  }
  render(){
    const {IVAS, sku,qty, note} = this.state;
    return (
        <View style={{flex: 1, flexDirection:'column', backgroundColor: 'white', paddingHorizontal: 22,paddingVertical: 25}}>
         <View style={{flexDirection:'row', flexShrink:1, marginBottom:15}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, width: 120, alignItems: 'flex-start',marginRight: 20}}>
             <Text>Product Code</Text>
             </View>
             <View style={styles.inputWrapper}>
            
             <SearchableDropdown
                multi={false}
                onItemSelect={(item) => {
                  this.setState({ sku: item.name });
                }}
                containerStyle={{ flex: 1,
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  zIndex: 1 }}
                itemStyle={{
                  padding: 10,
                  marginTop: 0,
                  backgroundColor: '#fff',
                  borderColor: '#bbb',
                  borderWidth: 1,
                  zIndex:5,
                }}
                itemTextStyle={{ color: '#000' }}
                itemsContainerStyle={{ maxHeight: 140, backgroundColor:'white'}}
                items={this.state.productList}
                resetValue={false}
                textInputStyle={{ 
                  ...Mixins.small1,
                  ...Mixins.containedInputDefaultStyle,
                  marginHorizontal:0,
                  marginVertical:0,
                  lineHeight:18,
                  fontWeight:'400',
                  maxHeight:30,
                  borderWidth: 1,
                  borderColor: '#D5D5D5',
                  borderRadius: 5,}}
                textInputProps={
                  {
                    value: sku,
                    underlineColorAndroid: "transparent",
                    onTextChange: this.onChangeTextSKU.bind(this)
                  }
                }
                listProps={
                  {
                    nestedScrollEnabled: true,
                  }
                }
            />
            </View>
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
              <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, width: 120, alignItems: 'flex-start',marginRight: 30}}>
               <Text>IVAS</Text>
             </View>
                  <View style={{flexDirection:'column',flex:1,paddingRight:10}}>
                    <SelectDropdown
                            data={IVASDATA}
                            buttonStyle={{maxHeight:35, borderRadius: 5, borderWidth:1, borderColor: '#ABABAB', backgroundColor:'white',width:'100%'}}
                            onSelect={(selectedItem, index) => {
                              this.setState({IVAS:selectedItem});
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                              return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item
                            }}
                          />
                  </View>
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, width: 120, alignItems: 'flex-start',marginRight: 20}}>
          <Text>QTY</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0}}
                inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextqty.bind(this)}
                onSubmitEditing={this.onChangeTextqty.bind(this)}
                value={qty}
            />
         </View>
         <View style={{flexDirection:'row', flexShrink:1}}>
         <View style={{flexShrink:1, backgroundColor: 'transparent', maxHeight: 30, paddingHorizontal: 15, paddingVertical: 6, marginVertical:0,borderRadius: 5, width: 120, alignItems: 'flex-start',marginRight: 20}}>
          <Text>Note</Text>
             </View>
             <Input 
                containerStyle={{flex: 1,paddingVertical:0}}
                inputContainerStyle={styles.textInput} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                onChangeText={this.onChangeTextnote.bind(this)}
                onSubmitEditing={this.onChangeTextnote.bind(this)}
                value={note}
            />
         </View>
         <Button
              containerStyle={{flex:1, marginRight: 0,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.submitItem}
              title="Add"
              disabled={ qty && note && sku ? false : true }
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
inputWrapper:{
flex:1,
flexDirection:'column',
marginLeft:10,
marginRight:10,
},
autocompleteContainer: {
  flex: 1,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: 1
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
    addIVAS: (sku) => {
      return dispatch({type: 'currentIVAS', payload: sku});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

