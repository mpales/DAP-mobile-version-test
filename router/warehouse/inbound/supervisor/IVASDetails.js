import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Card, CheckBox, Button} from 'react-native-elements';
import {connect} from 'react-redux';
import Mixins from '../../../../mixins';
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
// component
import DetailList from '../../../../component/extend/Card-detail';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getData, postData} from '../../../../component/helper/network';
import Loading from '../../../../component/loading/loading';
import moment from 'moment';
class ConnoteReportDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inboundID : null,
      acknowledged:false,
      title: 'Forklift',
      note: 'Item weight is over 10 kg',
      itemIVAS : null,
      clientVAS : null,
      inboundData: null,
      shipmentID: null,
    };
    this.acknowledgedSPVConfirm.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList, inboundList} = props;
    const {inboundID, _itemDetail} = state;
    if(inboundID === null){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.number !== undefined) {
        let inboundData = inboundList.find((element) => element.id ===  routes[index].params.number);
        if(inboundData !== undefined && routes[index].params.shipmentID !== undefined){
          return {...state, inboundID: routes[index].params.number,inboundData: inboundData, shipmentID: routes[index].params.shipmentID, clientVAS: routes[index].params.clientVAS};
        } else {
          navigation.goBack();
          return {...state, inboundID: routes[index].params.number};
        }
      }
      return {...state};
    } 
    
    return {...state};
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    const {inboundID, shipmentID} = this.state;
    if(prevProps.keyStack !== this.props.keyStack && this.props.keyStack  === 'IVASDetailsSPV'){
      const result = await getData('/inboundsMobile/'+inboundID+'/shipmentVAS/'+ shipmentID );
      this.setState({itemIVAS:result, acknowledged:result.current_active});
    }
  }
  async componentDidMount(){
    const {inboundID, shipmentID} = this.state;
    const result = await getData('/inboundsMobile/'+inboundID+'/shipmentVAS/'+ shipmentID );
    console.log(result);
    this.setState({itemIVAS:result.inbound_shipment_va, acknowledged:false});
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
  toggleCheckBox = () => {
    this.setState({
      acknowledged: !this.state.acknowledged,
    });
  };
  acknowledgedSPVConfirm = async ()=>{
    const {inboundID, shipmentID} = this.state;
    let data = {acknowledge:this.state.acknowledged >>> 0}
    const result = await postData('/inboundsMobile/'+inboundID+'/shipmentVAS/'+shipmentID,data);
    console.log(result);
  }
  uncheckedIcon = () => {
    return <View style={styles.unchecked} />;
  };
  render() {
    const {inboundData,itemIVAS} = this.state;
    if(inboundData === null || itemIVAS === null )
    return (<Loading/>);
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.container}>
          <View style={[styles.header,{paddingHorizontal:10}]}>
            <Text style={styles.headerTitle}>Shipment VAS Details</Text>
          </View>
          <View style={[styles.body,{paddingHorizontal:10}]}>
            <Card containerStyle={styles.cardContainer} style={styles.card}>
             
              <View style={styles.detail}>
                <DetailList title="Client" value={this.state.clientVAS} />
                <DetailList title="Recorded By" value={ itemIVAS.created_by !== undefined ? itemIVAS.created_by.firstName : null} />
                <DetailList title="Date and Time" value={ itemIVAS.created_on  !== null ? moment(itemIVAS.created_on).format('DD/MM/YYY h:mm a') : null}/>
               
              <View style={{marginVertical:10}}> 
              <Text style={{...Mixins.body1,lineHeight:20,fontWeight:'700',color:'#2D2C2C'}}>
               { itemIVAS.inbound_shipment === 1 ?  'Un-Stuffing From Truck' : itemIVAS.inbound_shipment === 2 ? 'Un-Stuffing From 20’ Container' : itemIVAS.inbound_shipment === 3 ? 'Un-Stuffing From 40’ Container' : null}
                </Text>
                </View>
                <DetailList title="Number Pallet" value={itemIVAS.inbound_shipment_no_pallet} />
                <DetailList title="Number Cartons" value={itemIVAS.inbound_shipment_no_carton} />
                
              </View>
            </Card>
          </View>
          <CheckBox
                title="I Acknowledge"
                textStyle={styles.textCheckbox}
                containerStyle={[styles.checkboxContainer,{paddingHorizontal:10}]}
                checked={this.state.acknowledged}
                onPress={this.toggleCheckBox}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
          <Button
              containerStyle={{flex:1, marginHorizontal: 10,marginVertical:20}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              title="Confirm"
              onPress={this.acknowledgedSPVConfirm}
              disabled={(this.state.acknowledged === false)}
            />
              <Button
              containerStyle={{flex:1, marginHorizontal: 10,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={()=>{
                this.props.navigation.navigate('UpdateIVAS',{number:this.state.inboundID, shipmentID: this.state.shipmentID});
              }}
              title="Edit VAS"

            />
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical:20,
    paddingHorizontal:10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Mixins.subtitle3,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#424141',
  },
  body: {
    flex: 1,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  detailText: {
    ...Mixins.subtitle3,
    color: '#6C6B6B',
  },
  note: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    color: '#6C6B6B',
  },
  changeButton: {
    backgroundColor: '#F07120',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  changeButtonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
  textCheckbox: {
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
});

const mapStateToProps = (state) => {
  return {
    manifestList: state.originReducer.manifestList,
    inboundList: state.originReducer.inboundSPVList,
    keyStack: state.originReducer.filters.keyStack,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnoteReportDetails);
