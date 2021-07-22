import React from 'react';
import {Text, Button,Image, Input, Divider, CheckBox} from 'react-native-elements';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import Mixins from '../../../mixins';

class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      stuffTruck: false,
      stuff20Container: false,
      stuff20ContainerDot1: false,
      stuff20ContainerDot2: false,
      stuff40Container: false,
      stuff40ContainerDot1: false,
      stuff40ContainerDot2: false,
      takeCartoon: false,
      takeLabelling: false,
      takePacking: false,
      
    };
    this.submitItem.bind(this);
    this.toggleCheckBoxStuffTruck.bind(this);
    this.toggleCheckBoxStuffContainer20.bind(this);
    this.toggleCheckBoxStuffContainer40.bind(this);
    this.toggleCheckBoxTakeCartoon.bind(this);
    this.toggleCheckBoxTakeLabelling.bind(this);
    this.toggleCheckBoxTakePacking.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList} = props;
    const {dataCode} = state;
    if(dataCode === '0'){
      const {routes, index} = navigation.dangerouslyGetState();
       if(routes[index].params !== undefined && routes[index].params.inputCode !== undefined){
        return {...state, dataCode: routes[index].params.dataCode,};
      }
      return {...state};
    } 
    
    return {...state};
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    
  }
  submitItem = ()=>{
    this.props.setBottomBar(true);
    this.props.navigation.navigate('List');
  }
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
  toggleCheckBoxStuffTruck = () => {
    this.setState({
        stuffTruck: !this.state.stuffTruck,
    });
  };
  toggleCheckBoxStuffContainer20= () => {
    this.setState({
        stuff20Container: !this.state.stuff20Container,
    });
  };

  toggleCheckBoxStuffContainer40= () => {
    this.setState({
        stuff40Container: !this.state.stuff40Container,
    });
  };
  toggleCheckBoxTakeCartoon = () => {
    this.setState({
        takeCartoon: !this.state.takeCartoon,
    });
  };
  toggleCheckBoxTakeLabelling= () => {
    this.setState({
        takeLabelling: !this.state.takeLabelling,
    });
  };
  toggleCheckBoxTakePacking = () => {
    this.setState({
        takePacking: !this.state.takePacking,
    });
  };
  render(){
    return (
        <ScrollView style={styles.body}>
         <View style={[styles.sectionInput,{paddingHorizontal: 30,paddingTop: 40}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Client</Text>
             </View>
             <Input 
                containerStyle={{flexShrink:1}}
                inputContainerStyle={[Mixins.containedInputDefaultContainer,{maxHeight:35}]} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={true}
                placeholder="DSP"
            />
         </View>
         <View style={[styles.sectionInput,{    paddingHorizontal: 30,}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Date</Text>
             </View>
             <Input 
                 containerStyle={{flexShrink:1}}
                 inputContainerStyle={[Mixins.containedInputDefaultContainer,{maxHeight:35}]} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={true}
                placeholder="22-06-21"
            />
         </View>

         <View style={[styles.sectionInput,{    paddingHorizontal: 30,}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Issue By</Text>
             </View>
             <Input 
                 containerStyle={{flexShrink:1}}
                 inputContainerStyle={[Mixins.containedInputDefaultContainer,{maxHeight:35}]} 
                inputStyle={Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={true}
                placeholder="DSP"
            />
         </View>
         <Divider orientation="horizontal" color="#D5D5D5" style={{marginVertical: 15}}/>
        <View style={styles.sectionInbound}>
        <CheckBox
                title="Un-Stuffing From Truck"
                textStyle={styles.text}
                containerStyle={styles.checkboxContainer}
                checked={this.state.stuffTruck}
                onPress={this.toggleCheckBoxStuffTruck}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
        <View style={styles.sectionInput}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Number Pallet</Text>
             </View>
             <Input 
                 containerStyle={{flexShrink:1}}
                 inputContainerStyle={[(!this.state.stuffTruck) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                inputStyle={(!this.state.stuffTruck) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.stuffTruck)}
            />
         </View>      
         <View style={styles.sectionInput}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Number Cartons</Text>
             </View>
             <Input 
                                 containerStyle={{flexShrink:1}}
                                 inputContainerStyle={[(!this.state.stuffTruck) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.stuffTruck) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                             
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.stuffTruck)}
            />
         </View> 

            <CheckBox
                title="Un-Stuffing From 20 Container "
                textStyle={styles.text}
                containerStyle={styles.checkboxContainer}
                checked={this.state.stuff20Container}
                onPress={this.toggleCheckBoxStuffContainer20}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
            <View style={styles.groupCheckbox}>
                <CheckBox
                center
                title='Palletized'
                containerStyle={styles.checkboxContainer}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={this.state.stuff20ContainerDot1}
                onPress={()=>{
                    this.setState({stuff20ContainerDot1: !this.state.stuff20ContainerDot1})
                }}
                disabled={(!this.state.stuff20Container)}
                />
                   <CheckBox
                center
                title='Loose'
                containerStyle={styles.checkboxContainer}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={this.state.stuff20ContainerDot2}
                onPress={()=>{
                    this.setState({stuff20ContainerDot2: !this.state.stuff20ContainerDot2})
                }}
                disabled={(!this.state.stuff20Container)}
                />
            </View>
            <View style={styles.sectionInput}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Number Cartons</Text>
             </View>
             <Input 
                               containerStyle={{flexShrink:1}}
                               inputContainerStyle={[(!this.state.stuff20Container) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                               inputStyle={(!this.state.stuff20Container) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                           
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.stuff20Container)}
            />
            </View> 

            <CheckBox
                title="Un-Stuffing From 40 Container "
                textStyle={styles.text}
                containerStyle={styles.checkboxContainer}
                checked={this.state.stuff40Container}
                onPress={this.toggleCheckBoxStuffContainer40}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
            <View style={styles.groupCheckbox}>
                <CheckBox
                center
                title='Palletized'
                containerStyle={styles.checkboxContainer}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={this.state.stuff40ContainerDot1}
                onPress={()=>{
                    this.setState({stuff40ContainerDot1: !this.state.stuff40ContainerDot1})
                }}
                disabled={(!this.state.stuff40Container)}
                />
                   <CheckBox
                center
                title='Loose'
                containerStyle={styles.checkboxContainer}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={this.state.stuff40ContainerDot2}
                onPress={()=>{
                    this.setState({stuff40ContainerDot2: !this.state.stuff40ContainerDot2})
                }}
                disabled={(!this.state.stuff40Container)}
                />
            </View>
            <View style={styles.sectionInput}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Number Cartons</Text>
             </View>
             <Input 
                    containerStyle={{flexShrink:1}}
                    inputContainerStyle={[(!this.state.stuff40Container) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                    inputStyle={(!this.state.stuff40Container) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}

                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.stuff40Container)}
            />
            </View> 
        </View>

        <Divider orientation="horizontal" color="#D5D5D5" style={{marginVertical: 15}}/>

        <View style={styles.sectionValueAdded}>
            <CheckBox
                title="Take Carton Dimension "
                textStyle={styles.text}
                containerStyle={styles.checkboxContainer}
                checked={this.state.takeCartoon}
                onPress={this.toggleCheckBoxTakeCartoon}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
            <View style={styles.sectionInput}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Number SKU</Text>
             </View>
             <Input 
                                 containerStyle={{flexShrink:1}}
                                 inputContainerStyle={[(!this.state.takeCartoon) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.takeCartoon) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.takeCartoon)}
            />
            </View> 
            <View style={styles.sectionInput}>
            <Input 
                    inputContainerStyle={[(!this.state.takeCartoon) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer]} 
                    inputStyle={(!this.state.takeCartoon) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                labelStyle={styles.textInput}
                label="Request By : ( Please attach supporting email )"
                disabled={(!this.state.takeCartoon)}
            />
            </View> 


            <CheckBox
                title="Labelling Required  "
                textStyle={styles.text}
                containerStyle={styles.checkboxContainer}
                checked={this.state.takeLabelling}
                onPress={this.toggleCheckBoxTakeLabelling}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
            <View style={styles.sectionInput}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Qty In PCS</Text>
             </View>
             <Input 
                                 containerStyle={{flexShrink:1}}
                                 inputContainerStyle={[(!this.state.takeLabelling) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.takeLabelling) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.takeLabelling)}
            />
            </View> 
            <View style={styles.sectionInput}>
            <Input 
                    inputContainerStyle={[(!this.state.takeLabelling) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer]} 
                    inputStyle={(!this.state.takeLabelling) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
           
                labelStyle={styles.textInput}
                label="Request By : ( Please attach supporting email )"
                disabled={(!this.state.takeLabelling)}
            />
            </View> 


            <CheckBox
                title="Packing Into Sets "
                textStyle={styles.text}
                containerStyle={styles.checkboxContainer}
                checked={this.state.takePacking}
                onPress={this.toggleCheckBoxTakePacking}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
            <View style={styles.sectionInput}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Qty In Sets</Text>
             </View>
             <Input 
                                 containerStyle={{flexShrink:1}}
                                 inputContainerStyle={[(!this.state.takePacking) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.takePacking) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.takePacking)}
            />
            </View> 
            <View style={styles.sectionInput}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>No SKU per SET</Text>
             </View>
             <Input 
                                 containerStyle={{flexShrink:1}}
                                 inputContainerStyle={[(!this.state.takePacking) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.takePacking) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
            labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.takePacking)}
            />
            </View> 
            <View style={styles.sectionInput}>
            <Input 
                   inputContainerStyle={[(!this.state.takePacking) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer]} 
                   inputStyle={(!this.state.takePacking) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
          
                labelStyle={styles.textInput}
                label="Request By : ( Please attach supporting email )"
                disabled={(!this.state.takePacking)}
            />
            </View> 
        </View>
         <Button
              containerStyle={{flex:1, marginHorizontal: 30,marginVertical: 20}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.submitItem}
              title="Submit"
            />
        </ScrollView>
    );
  }
}

const styles = {
body: {
    backgroundColor: 'white',
    flexDirection: 'column',
},
sectionInbound: {
flexDirection:'column',
flexShrink: 1,
paddingHorizontal: 30,
},
sectionValueAdded: {
  flexDirection:'column',
  flexShrink: 1,
  paddingHorizontal:30,
},
groupCheckbox: {
paddingHorizontal: 40,
paddingVertical: 10,
},
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
    justifyContent: 'flex-start',
    alignItems:'flex-start',
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
sectionInput: {
    flexDirection:'row', 
    flexShrink:1,
},
labelHeadInput :{
    width: 60,
    justifyContent: 'center',
    maxHeight:35
},
labelInput: {
    flexShrink: 1,
    width: 120,
    justifyContent: 'center',
    maxHeight:35
},
textHeadInput :{
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '600',
    color: '#6C6B6B',
},
textInput :{
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#424141',
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

