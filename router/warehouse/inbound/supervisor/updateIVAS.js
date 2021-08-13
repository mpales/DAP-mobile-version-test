import React from 'react';
import {Text, Button,Image, Input, Divider, CheckBox} from 'react-native-elements';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import Mixins from '../../../../mixins';
import {getData,putData} from '../../../../component/helper/network';
class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivingNumber: null,
      inboundData : null,
      stuffTruck: false,
      stuffTruckPallet: '',
      stuffTruckCarton : '',
      stuff20Container: false,
      stuff20ContainerDot1: false,
      stuff20ContainerDot2: false,
      stuff20ContainerPallet :'',
      stuff20ContainerCarton : '',
      stuff40Container: false,
      stuff40ContainerDot1: false,
      stuff40ContainerDot2: false,
      stuff40ContainerPallet :'',
      stuff40ContainerCarton : '',
      takeCartoon: false,
      takeCartonSKU : '',
      takeLabelling: false,
      takePacking: false,
      takeOthers: false,
      takeOthersInput : '',
      recordedBy : '',
    };
    this.submitItem.bind(this);
    this.toggleCheckBoxStuffTruck.bind(this);
    this.toggleCheckBoxStuffContainer20.bind(this);
    this.toggleCheckBoxStuffContainer40.bind(this);
    this.toggleCheckBoxTakeCartoon.bind(this);
    this.toggleCheckBoxTakeOthers.bind(this);
    this.toggleCheckBoxTakeLabelling.bind(this);
    this.toggleCheckBoxTakePacking.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, inboundList} = props;
    const {receivingNumber} = state;
    if(receivingNumber === null){
      const {routes, index} = navigation.dangerouslyGetState();
       if(routes[index].params !== undefined && routes[index].params.number !== undefined){
        let inboundData = inboundList.find((element) => element.id === routes[index].params.number);
        return {...state, receivingNumber: routes[index].params.number,inboundData: inboundData};
      }
      return {...state};
    } 
    
    return {...state};
  }

  async componentDidMount(){
    const {receivingNumber} = this.state;
    const result = await getData('/inbounds/'+receivingNumber+'/shipmentVAS');
    this.setState({
      stuffTruck: result.inbound_shipment === 1 ? true : false,
      stuffTruckPallet: result.inbound_shipment === 1 ? ''+result.inbound_shipment_no_pallet : '',
      stuffTruckCarton : result.inbound_shipment === 1 ? ''+result.inbound_shipment_no_carton : '',
      stuff20Container: result.inbound_shipment === 2 ? true : false,
      stuff20ContainerDot1: result.inbound_shipment === 2 && (result.inbound_shipment_pallet === 1 || result.inbound_shipment_pallet === 3) ? true : false,
      stuff20ContainerDot2: result.inbound_shipment === 2 && (result.inbound_shipment_pallet === 2 || result.inbound_shipment_pallet === 3) ? true : false,
      stuff20ContainerPallet :result.inbound_shipment === 2 ? ''+result.inbound_shipment_no_pallet : '',
      stuff20ContainerCarton : result.inbound_shipment === 2 ? ''+result.inbound_shipment_no_pallet : '',
      stuff40Container: result.inbound_shipment === 3 ? true : false,
      stuff40ContainerDot1: result.inbound_shipment === 3 && (result.inbound_shipment_pallet === 1 || result.inbound_shipment_pallet === 3) ? true : false,
      stuff40ContainerDot2: result.inbound_shipment === 3 && (result.inbound_shipment_pallet === 2 || result.inbound_shipment_pallet === 3) ? true : false,
      stuff40ContainerPallet :result.inbound_shipment === 3 ? ''+result.inbound_shipment_no_pallet : '',
      stuff40ContainerCarton : result.inbound_shipment === 3 ? ''+result.inbound_shipment_no_pallet : '',
      takeCartoon: result.carton_dimension_sku === 1 ? true : false,
      takeCartonSKU : ''+result.carton_dimension_sku,
      takeLabelling: false,
      takePacking: false,
      takeOthers: result.other === 1 ? true : false,
      takeOthersInput : '',
      recordedBy: result.updated_by.firstName,
    });
  }
  submitItem = async ()=>{
    const {stuffTruck, stuff20Container, stuff40Container} = this.state;
    const {stuff20ContainerDot1, stuff20ContainerDot2, stuff40ContainerDot1, stuff40ContainerDot2} = this.state;

    let shipment = stuffTruck ? 1 : stuff20Container ? 2 : stuff40Container ? 3 : 0;
    let shipmentpallet = 0;
    if(stuff20Container){
      if(stuff20ContainerDot1 && stuff20ContainerDot2){
        shipmentpallet = 3;
      } else {
        if(stuff20ContainerDot1){
          shipmentpallet = 1;
        } else if(stuff20ContainerDot2){
          shipmentpallet = 2;
        }
      }
    } else if (stuff40Container){
      if(stuff40ContainerDot1 && stuff40ContainerDot2){
        shipmentpallet = 3;
      } else {
        if(stuff40ContainerDot1){
          shipmentpallet = 1;
        } else if(stuff40ContainerDot2){
          shipmentpallet = 2;
        }
      }
    }
    let VAS = {
      shipment:shipment,
      shipmentPallet: shipmentpallet,
      nCartoon : shipment === 1 ? parseInt(this.state.stuffTruckCarton) : shipment === 2 ? parseInt(this.state.stuff20ContainerCarton) : shipment === 3 ? parseInt(this.state.stuff40ContainerCarton) : 0,
      nPallet  : shipment === 1 ? parseInt(this.state.stuffTruckPallet) : shipment === 2 ? parseInt(this.state.stuff20ContainerPallet) : shipment === 3 ? parseInt(this.state.stuff40ContainerPallet) : 0,
      cartoonDimensionSKU : parseInt(this.state.takeCartonSKU),
      other: this.state.takeOthersInput
    };
    const result = await putData('/inbounds/'+this.state.receivingNumber+'/shipmentVAS', VAS);
    this.props.navigation.goBack();
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
      stuff20Container: false,
        stuffTruck: !this.state.stuffTruck,
        stuff40Container: false,
    });
  };
  toggleCheckBoxStuffContainer20= () => {
    this.setState({
        stuff20Container: !this.state.stuff20Container,
        stuffTruck: false,
        stuff40Container: false,
    });
  };

  toggleCheckBoxStuffContainer40= () => {
    this.setState({
      stuff20Container: false,
      stuffTruck:false,
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
  toggleCheckBoxTakeOthers = ()=> {
    this.setState({
      takeOthers: !this.state.takeOthers,
  });
  }
  stuffTruckPalletInput = (text) => {
    this.setState({stuffTruckPallet:text});
  }
  stuffTruckCartonInput = (text) => {
    this.setState({stuffTruckCarton:text});
  }
  stuff20ContainerPalletInput = (text) => {
    this.setState({stuff20ContainerPallet :text});
  }
  stuff20ContainerCartonInput = (text) => {
    this.setState({stuff20ContainerCarton :text});
  }
  stuff40ContainerPalletInput = (text) => {
    this.setState({stuff40ContainerPallet :text});
  }
  stuff40ContainerCartonInput = (text) => {
    this.setState({stuff40ContainerCarton :text});
  }
  takeCartonSKUInput = (text) => {
    this.setState({takeCartonSKU :text});
  }
  takeOthersChangeInput = (text) => {
    this.setState({takeOthersInput:text});
  }
  render(){
    return (
        <ScrollView style={styles.body}>
       <View style={[styles.sectionInput,{paddingHorizontal: 30,paddingTop: 40, paddingBottom:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Client</Text>
             </View>
             <Text style={styles.textHeadInput}>{this.state.inboundData.company.company_name}</Text>
         </View>
         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Ref #</Text>
             </View>
             <Text style={styles.textHeadInput}>{this.state.inboundData.inbound_asn !== null ? this.state.inboundData.inbound_asn.reference_id : this.state.inboundData.inbound_grn !== null ? this.state.inboundData.inbound_grn.reference_id : '' }</Text>
         </View>

         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Receipt #</Text>
             </View>
             <Text style={styles.textHeadInput}>{this.state.inboundData.inbound_receipts.length > 0 ? this.state.inboundData.inbound_receipts[0].id : ''}</Text>
         </View>
         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Date</Text>
             </View>
             <Text style={styles.textHeadInput}>{moment(this.state.inboundData.created_on).format('DD-MM-YYYY')}</Text>
         </View>
         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Recorded By</Text>
             </View>
             <Text style={styles.textHeadInput}>{this.state.recordedBy}</Text>
         </View>
         <Divider orientation="horizontal" color="#D5D5D5" style={{marginVertical: 15}}/>
        <View style={styles.sectionInbound}>
          <Text style={{...Mixins.h6,lineHeight:27,fontWeight:'600',color:'#424141',marginVertical:10}}>Inbound Shipment</Text>
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
                onChangeText={this.stuffTruckPalletInput}
                value={this.state.stuffTruckPallet}
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
                onChangeText={this.stuffTruckCartonInput}
                value={this.state.stuffTruckCarton}
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
             <Text style={styles.textInput}>Number Pallet</Text>
             </View>
             <Input 
                 containerStyle={{flexShrink:1}}
                 inputContainerStyle={[(!this.state.stuff20Container) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                inputStyle={(!this.state.stuff20Container) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.stuff20Container)}
                onChangeText={this.stuff20ContainerPalletInput}
                value={this.state.stuff20ContainerPallet}
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
                onChangeText={this.stuff20ContainerCartonInput}
                value={this.state.stuff20ContainerCarton}
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
             <Text style={styles.textInput}>Number Pallet</Text>
             </View>
             <Input 
                 containerStyle={{flexShrink:1}}
                 inputContainerStyle={[(!this.state.stuff40Container) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer,{maxHeight:35, width:80}]} 
                inputStyle={(!this.state.stuff40Container) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.stuff40Container)}
                onChangeText={this.stuff40ContainerPalletInput}
                value={this.state.stuff40ContainerPallet}
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
                onChangeText={this.stuff40ContainerCartonInput}
                value={this.state.stuff40ContainerCarton}
            />
            </View> 
        </View>

        <Divider orientation="horizontal" color="#D5D5D5" style={{marginVertical: 15}}/>

        <View style={styles.sectionValueAdded}>
        <Text style={{...Mixins.h6,lineHeight:27,fontWeight:'600',color:'#424141',marginVertical:10}}>Value Added Work Required</Text>
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
                onChangeText={this.takeCartonSKUInput}
                value={this.state.takeCartonSKU}
            />
            </View> 
            <CheckBox
                title="Other"
                textStyle={styles.text}
                containerStyle={styles.checkboxContainer}
                checked={this.state.takeOthers}
                onPress={this.toggleCheckBoxTakeOthers}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
            <View style={styles.sectionInput}>
            <Input 
                    inputContainerStyle={[(!this.state.takeOthers) ? Mixins.containedInputDisabledContainer: Mixins.containedInputDefaultContainer]} 
                    inputStyle={(!this.state.takeOthers) ? Mixins.containedInputDisabledStyle: Mixins.containedInputDefaultStyle}
                labelStyle={styles.textInput}
                disabled={(!this.state.takeOthers)}
                onChangeText={this.takeOthersChangeInput}
                value={this.state.takeOthersInput}
            />
            </View> 


            {/* <CheckBox
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
            </View>  */}
        </View>
         <Button
              containerStyle={{flex:1, marginHorizontal: 30,marginVertical: 20}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.submitItem}
              disabled={ this.state.stuffTruck || this.state.stuff20Container || this.state.stuff40Container ? false : true}
              title="Update"
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
  flexShrink: 1,
  width: 120,
  justifyContent: 'center',
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

    inboundList: state.originReducer.inboundSPVList,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {

    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);

