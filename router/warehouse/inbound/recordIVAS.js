import React from 'react';
import {Text, Button,Image, Input, Divider, CheckBox} from 'react-native-elements';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import Mixins from '../../../mixins';
import {postData} from '../../../component/helper/network';
import Loading from '../../../component/loading/loading';
import Banner from '../../../component/banner/banner';
import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import SelectDropdown from 'react-native-select-dropdown';
class Acknowledge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivingNumber: null,
      inboundData : null,
      error : '',
      stuffTruck: false,
      stuffTruckPallet: '',
      stuffTruckCarton : '',
      stuffContainer: 0,
      stuffContainerDot1: false,
      stuffContainerDot2: false,
      stuffContainerPallet :'',
      stuffContainerCarton : '',
      takeCartoon: false,
      takeCartonSKU : '',
      takeLabelling: false,
      takePacking: false,
      takeOthers: false,
      takeOthersInput : '',
      
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
         console.log('state params',routes[index].params.number);
        let inboundData = inboundList.find((element) => element.id === routes[index].params.number);
        if(inboundData !== undefined){
          if(inboundData.type !== 2 && inboundData.shipment_type === 2){
            return {...state, receivingNumber: routes[index].params.number,inboundData: inboundData, stuff20Container: 0};
          } else {
            return {...state, receivingNumber: routes[index].params.number,inboundData: inboundData, stuffTruck: true};
          }
        } else {
          navigation.goBack();
          return {...state, receivingNumber: routes[index].params.number};
        }
      }
      return {...state};
    } 
    
    return {...state};
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    
  }
  submitItem = async ()=>{
    const {stuffTruck, stuff20Container, stuff40Container} = this.state;
    const {stuffContainer,stuffContainerDot1, stuffContainerDot2, stuffContainerCarton, stuffContainerPallet, stuffTruckCarton, stuffTruckPallet} = this.state;

    let shipment = stuffTruck ? 1 : stuffContainer + 2;
    let shipmentpallet = 0;
    if(shipment > 1 ){
      if(stuffContainerDot1 && stuffContainerDot2){
        shipmentpallet = 3;
      } else {
        if(stuffContainerDot1){
          shipmentpallet = 1;
        } else if(stuffContainerDot2){
          shipmentpallet = 2;
        }
      }
    } 
    let VAS = {
      shipment:shipment,
      shipmentPallet: shipmentpallet,
      nCartoon : shipment === 1 ? parseInt(stuffTruckCarton) : parseInt(stuffContainerCarton),
      nPallet  : shipment === 1 ? parseInt(stuffTruckPallet) : parseInt(stuffContainerPallet),      
      other: this.state.takeOthersInput
    };
    // if(this.state.takeCartoon){
    //   VAS.cartoonDimensionSKU = parseInt(this.state.takeCartonSKU);
    // }
    const result = await postData('/inboundsMobile/'+this.state.receivingNumber+'/shipmentVAS', VAS);
    if(result === 'IVAS succesfully created'){
      this.props.navigation.navigate('Manifest',{
        notifbanner : result,
      })
    } else {
      if(result.error){
        this.setState({error:result.error})
      } else if (result.errors !== undefined){
        console.log(result.errors);
        let error = '';
        result.errors.forEach(element => {
          error += element.msg + ' ' + element.param +', ';
        });
        this.setState({error:error});
      }
    }
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
        stuff40ContainerDot1: false,
        stuff40ContainerDot2: false,
    });
  };

  toggleCheckBoxStuffContainer40= () => {
    this.setState({
      stuff20Container: false,
      stuffTruck:false,
        stuff40Container: !this.state.stuff40Container,
        stuff20ContainerDot1: false,
        stuff20ContainerDot2: false,
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
  stuffContainerPalletInput = (text) => {
    this.setState({stuffContainerPallet :text});
  }
  stuffContainerCartonInput = (text) => {
    this.setState({stuffContainerCarton :text});
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
    if(this.state.inboundData === null) return <Loading/>
    return (
        <ScrollView style={styles.body}>
            {this.state.error !== '' && (<Banner
            title={this.state.error}
            backgroundColor="#F1811C"
            closeBanner={()=>{
              this.setState({error:''});
            }}
          />)}
       <View style={[styles.sectionInput,{paddingHorizontal: 30,paddingTop: 40, paddingBottom:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Client</Text>
             </View>
             <Text style={styles.dotLabelStyle}>:</Text>
             <Text style={styles.textHeadInput}>{this.state.inboundData.client}</Text>
         </View>
         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
         <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Ref #</Text>
             </View>
             <Text style={styles.dotLabelStyle}>:</Text>
             <Text style={styles.textHeadInput}>{this.state.inboundData.reference_id }</Text>
         </View>

         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
         <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Receipt #</Text>
             </View>
             <Text style={styles.dotLabelStyle}>:</Text>
             <Text style={styles.textHeadInput}>{this.state.inboundData.inbound_receipt.length > 0 ? this.state.inboundData.inbound_receipt[this.state.inboundData.inbound_receipt.length -1].receipt_no : ''}</Text>
         </View>
         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Shipment Type</Text>
             </View>
             <Text style={styles.dotLabelStyle}>:</Text>
             <Text style={styles.textHeadInput}>{this.state.inboundData.shipment_type === 2 ? "FCL" : "LCL"}</Text>
         </View>
         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Date</Text>
             </View>
             <Text style={styles.dotLabelStyle}>:</Text>
             <Text style={styles.textHeadInput}>{moment(this.state.inboundData.created_on).format('DD-MM-YYYY')}</Text>
         </View>
         <View style={[styles.sectionInput,{    paddingHorizontal: 30,paddingVertical:10}]}>
            <View style={styles.labelHeadInput}>
             <Text style={styles.textHeadInput}>Recorded By</Text>
             </View>
             <Text style={styles.dotLabelStyle}>:</Text>
             <Text style={styles.textHeadInput}>{this.props.userRole.name}</Text>
         </View>
         <Divider orientation="horizontal" color="#D5D5D5" style={{marginVertical: 15}}/>
        <View style={styles.sectionInbound}>
          <View style={{flexDirection:'row', flexShrink:1,}}>
          <Text style={{...Mixins.h6,lineHeight:27,fontWeight:'700',color:'#424141',marginVertical:10}}>Inbound Shipment</Text>
          <Text style={{...Mixins.h6,lineHeight:27,fontWeight:'700',color:'red',marginVertical:10}}>*</Text>
          </View>

         {(this.state.inboundData.shipment_type === 1 || this.state.inboundData.type === 2) ? ( 
         <View style={{flexDirection:'column', flex:1, marginVertical:14}}>
            <Text style={{...Mixins.body1, color:'#2D2C2C', lineHeight:20, fontWeight:'700'}}>
            Un-Stuffing From Truck
            </Text>
            
        <View style={[styles.sectionInput, {paddingVertical:10}]}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Number Pallet</Text>
             </View>
             <Input 
                 containerStyle={{flexShrink:1, flexDirection:'row', alignItems:'center'}}
                 inputContainerStyle={[(!this.state.stuffTruck) ? styles.containedInputDisabled: styles.containedInputDefault,{maxHeight:35, width:80, borderColor:'#ABABAB'}]} 
                inputStyle={(!this.state.stuffTruck) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.stuffTruck)}
                style={{...Mixins.body1,lineHeight:21,color:'#6C6B6B',fontWeight:'400'}}
                onChangeText={this.stuffTruckPalletInput}
                value={this.state.stuffTruckPallet}
                keyboardType="number-pad"
            />
         </View>      
         <View style={[styles.sectionInput, {paddingVertical:10}]}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Number Cartons</Text>
             </View>
             <Input 
                                  containerStyle={{flexShrink:1, flexDirection:'row', alignItems:'center'}}
                                 inputContainerStyle={[(!this.state.stuffTruck) ? styles.containedInputDisabled: styles.containedInputDefault,{maxHeight:35, width:80, borderColor:'#ABABAB'}]} 
                                 inputStyle={(!this.state.stuffTruck) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
                                 style={{...Mixins.body1,lineHeight:21,color:'#6C6B6B',fontWeight:'400'}}            
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.stuffTruck)}
                onChangeText={this.stuffTruckCartonInput}
                value={this.state.stuffTruckCarton}
                keyboardType="number-pad"
            />
         </View>
         </View> ): (
            <View style={{flexDirection:'column', flex:1, marginVertical:14}}>
                <SelectDropdown
                            buttonStyle={{width:'100%',maxHeight:25,borderRadius: 5, borderWidth:1, borderColor: '#ABABAB', backgroundColor:'white'}}
                            buttonTextStyle={{...Mixins.body1, color:'#2D2C2C', lineHeight:20, fontWeight:'700',textAlign:'left',}}
                            data={['20ft', '40ft','20ft High Cube','40ft High Cube'] }
                            defaultValueByIndex={this.state.stuffContainer}
                            disabled={this.state.stuffTruck}
                            onSelect={(selectedItem, index) => {
                              const {stuffContainer} = this.state;
                              if(index === stuffContainer) {
                                this.setState({
                                  stuffContainer : index,
                                });
                              } else {
                                this.setState({
                                  stuffContainer: index,
                                  stuffContainerDot1: false,
                                  stuffContainerDot2: false,
                                  stuffContainerCarton: '',
                                  stuffContainerPallet: '',
                                });
                              }
                            }}
                            renderDropdownIcon={() => {
                              return (
                                <IconArrow66Mobile fill="#ABABAB" height="16" width="16" style={{transform:[{rotate:'90deg'}]}}/>
                              );
                            }}
                            dropdownIconPosition="right"
                            buttonTextAfterSelection={(selectedItem, index) => {
                              // text represented after item is selected
                              // if data array is an array of objects then return selectedItem.property to render after item is selected
                              return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                              // text represented for each item in dropdown
                              // if data array is an array of objects then return item.property to represent item in dropdown
                              return item;
                            }}
            
                            renderCustomizedRowChild={(item, index) => {
                              return (
                                <View style={{flex:1,paddingHorizontal:17, backgroundColor:this.state.stuffContainer === index ? '#e7e8f2' : 'transparent',paddingVertical:0,marginVertical:0, justifyContent:'center'}}>
                                  <Text style={{...Mixins.small1,fontWeight:'400',lineHeight:18, color:'#424141'}}>{item}</Text>
                                </View>
                              );
                            }}
                          />
          
            <View style={styles.groupCheckbox}>
                <CheckBox
                center
                title='Palletized'
                containerStyle={styles.checkboxContainer}
                textStyle={{...Mixins.body1,color:'#2D2C2C',fontWeight:'400',lineHeight:20}}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                uncheckedColor="#6C6B6B"
                checkedColor="#2A3386"
                checked={this.state.stuffContainerDot1}
                onPress={()=>{
                    this.setState({stuffContainerDot1: !this.state.stuffContainerDot1, stuffContainerDot2: false})
                }}
                disabled={this.state.stuffTruck}
                />
                  <CheckBox
                center
                title='Loose'
                containerStyle={styles.checkboxContainer}
                textStyle={{...Mixins.body1,color:'#2D2C2C',fontWeight:'400',lineHeight:20}}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                uncheckedColor="#6C6B6B"
                checkedColor="#2A3386"
                checked={this.state.stuffContainerDot2}
                onPress={()=>{
                    this.setState({stuffContainerDot2: !this.state.stuffContainerDot2, stuffContainerDot1:false})
                }}
                disabled={this.state.stuffTruck}
                />
            </View>
            <View style={[styles.sectionInput, {paddingVertical:10}]}>
            <View style={styles.labelInput}>
            <Text style={styles.textInput}>Number Pallet</Text>
            </View>
            <Input 
                      containerStyle={{flexShrink:1, flexDirection:'row', alignItems:'center'}}
                      inputContainerStyle={[styles.containedInputDefault,{maxHeight:35, width:80, borderColor:'#ABABAB'}]} 
                      inputStyle={styles.containedInputDefaultStyle}
                      labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                      style={{...Mixins.body1,lineHeight:21,color:'#6C6B6B',fontWeight:'400'}}
                      onChangeText={this.stuffContainerPalletInput}
                      value={this.state.stuffContainerPallet}
                keyboardType="number-pad"
                disabled={this.state.stuffTruck}
            />
        </View>      
        <View style={[styles.sectionInput, {paddingVertical:10}]}>
            <View style={styles.labelInput}>
            <Text style={styles.textInput}>Number Cartons</Text>
            </View>
            <Input 
              containerStyle={{flexShrink:1, flexDirection:'row', alignItems:'center'}}
              inputContainerStyle={[styles.containedInputDefault,{maxHeight:35, width:80, borderColor:'#ABABAB'}]} 
              inputStyle={styles.containedInputDefaultStyle}
              style={{...Mixins.body1,lineHeight:21,color:'#6C6B6B',fontWeight:'400'}}
              labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
              onChangeText={this.stuffContainerCartonInput}
              value={this.state.stuffContainerCarton}
                keyboardType="number-pad"
                disabled={this.state.stuffTruck}
            />
            </View> 

         

          </View> 
         )} 
       
           
        </View>

        {/* <Divider orientation="horizontal" color="#D5D5D5" style={{marginVertical: 15}}/> */}

        {/* <View style={styles.sectionValueAdded}>
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
               <View style={[styles.sectionInput, {paddingVertical:10}]}>
            <View style={styles.labelInput}>
             <Text style={styles.textInput}>Number SKU</Text>
             </View>
             <Input 
                                    containerStyle={{flexShrink:1, flexDirection:'row', alignItems:'center'}}
                                 inputContainerStyle={[(!this.state.takeCartoon) ? styles.containedInputDisabled: styles.containedInputDefault,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.takeCartoon) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
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
                    inputContainerStyle={[(!this.state.takeOthers) ? styles.containedInputDisabled: styles.containedInputDefault]} 
                    inputStyle={(!this.state.takeOthers) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
                labelStyle={styles.textInput}
                disabled={(!this.state.takeOthers)}
                onChangeText={this.takeOthersChangeInput}
                value={this.state.takeOthersInput}
            />
            </View>  */}


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
                                 inputContainerStyle={[(!this.state.takeLabelling) ? styles.containedInputDisabled: styles.containedInputDefault,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.takeLabelling) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
                labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.takeLabelling)}
            />
            </View> 
            <View style={styles.sectionInput}>
            <Input 
                    inputContainerStyle={[(!this.state.takeLabelling) ? styles.containedInputDisabled: styles.containedInputDefault]} 
                    inputStyle={(!this.state.takeLabelling) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
           
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
                                 inputContainerStyle={[(!this.state.takePacking) ? styles.containedInputDisabled: styles.containedInputDefault,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.takePacking) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
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
                                 inputContainerStyle={[(!this.state.takePacking) ? styles.containedInputDisabled: styles.containedInputDefault,{maxHeight:35, width:80}]} 
                                 inputStyle={(!this.state.takePacking) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
            labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                disabled={(!this.state.takePacking)}
            />
            </View> 
            <View style={styles.sectionInput}>
            <Input 
                   inputContainerStyle={[(!this.state.takePacking) ? styles.containedInputDisabled: styles.containedInputDefault]} 
                   inputStyle={(!this.state.takePacking) ? styles.containedInputDisabledStyle: styles.containedInputDefaultStyle}
          
                labelStyle={styles.textInput}
                label="Request By : ( Please attach supporting email )"
                disabled={(!this.state.takePacking)}
            />
            </View>  */}
        {/* </View> */}
         <Button
              containerStyle={{flex:1, marginHorizontal: 30,marginVertical: 20}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.submitItem}
              disabled={ (this.state.stuffTruck && this.state.stuffTruckCarton && this.state.stuffTruckPallet) || (this.state.stuffContainer >=0 && this.state.stuffContainerCarton && this.state.stuffContainerPallet) ? false : true}
               title="Record VAS"
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
paddingHorizontal: 0,
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
  width: 120,
  justifyContent: 'flex-start',
},
labelInput: {
    flexShrink: 1,
    width: 230,
    justifyContent: 'center',
 
},
textHeadInput :{
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '600',
    color: '#6C6B6B',
    flexShrink: 1,
    textAlignVertical:'top',
},
textInput :{
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#424141',
    textAlignVertical:'center',
},
dotLabelStyle : {
  ...Mixins.body1,
  color:'#6C6B6B',
  fontWeight:'400',
  lineHeight:21,
  paddingHorizontal:9,

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
  containedInputDisabled : {
    ...Mixins.containedInputDisabledContainer,
    paddingHorizontal: 5,
    },
    containedInputDefault : {
      ...Mixins.containedInputDefaultContainer,
      paddingHorizontal: 5,
      },
      containedInputDefaultStyle : {
    ...Mixins.containedInputDefaultStyle,
    marginHorizontal: 0,
      },
      containedInputDisabledStyle : {
     ...Mixins.containedInputDisabledStyle,
      marginHorizontal:0,
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
    inboundList: state.originReducer.inboundList,
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

