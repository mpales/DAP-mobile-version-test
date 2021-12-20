import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableHighlight
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
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';
import EmptyIlustrate from '../../../../assets/icon/list-empty mobile.svg';
import TouchableScale from 'react-native-touchable-scale';
import moment from 'moment';
class ConnoteReportDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inboundID : null,
      title: 'Forklift',
      note: 'Item weight is over 10 kg',
      itemIVAS : null,
      inboundData: null,
    };
    this._onPressSingleReports.bind(this);
    this.renderHeaderListVAS.bind(this);
    this.renderListVAS.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList, inboundList} = props;
    const {inboundID, _itemDetail} = state;
    if(inboundID === null){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.number !== undefined) {
        let inboundData = inboundList.find((element) => element.id ===  routes[index].params.number);
        if(inboundData !== undefined){
          return {...state, inboundID: routes[index].params.number,inboundData: inboundData};
        } else {
          navigation.goBack();
          return {...state, inboundID: routes[index].params.number};
        }
      }
      return {...state};
    } 
    
    return {...state};
  }
  async componentDidMount(){
    const {inboundID} = this.state;
    const result = await getData('/inboundsMobile/'+inboundID+'/shipmentVAS');
    if(typeof result === 'object' && result.error === undefined){
    this.setState({itemIVAS:result});
    } else {
      this.setState({itemIVAS:[]});
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    const {inboundID} = this.state;
    if(prevProps.keyStack !== this.props.keyStack && this.props.keyStack  === 'IVASListSPV'){
      const result = await getData('/inboundsMobile/'+inboundID+'/shipmentVAS');
      if(typeof result === 'object' && result.error === undefined){
        this.setState({itemIVAS:result});
      } else {
        this.setState({itemIVAS:[]});
      }
    }
  }
  renderHeaderListVAS = ()=>{
    return (
      <View style={styles.header}>
      <Text style={styles.headerTitle}>Shipment VAS Details</Text>
    </View>
    );
  }
  _onPressSingleReports = (item)=>{ 
    this.props.navigation.navigate('IVASDetailsSPV',{number:this.state.inboundID, shipmentID: item.inbound_shipment_va.id, clientVAS : item.inbound.client});
  }
  renderListVAS = ({item,index, separators})=>{
    let shipmentopt = '';
    switch ( item.inbound_shipment_va.inbound_shipment) {
      case 1:
        shipmentopt = 'Un-Stuffing From Truck';
        break;
        case 2:
          shipmentopt = '20ft Loose';
          break;
          case 3:
            shipmentopt = '40ft Loose';
            break;
            case 4:
              shipmentopt = '20ft Palletized';
              break;
              case 5:
                shipmentopt = '40ft Palletized';
                break;
                case 6:
                  shipmentopt = '20ft High Cube Loose';
                  break;
                  case 7:
                    shipmentopt = '40ft High Cube Loose';
                    break;
                    case 8:
                      shipmentopt = '20ft High Cube Palletized';
                      break;
                      case 9:
                        shipmentopt = '40ft High Cube Palletized';
                        break;                                            
      default:
        break;
    }
    return (
      <TouchableScale
      key={item.key}
      onPress={() => 
        {if(item.inbound_shipment_va.inbound_shipment !== undefined)
          this._onPressSingleReports(item)
        }}
      onShowUnderlay={separators.highlight}
      onHideUnderlay={separators.unhighlight}
      activeScale={0.9}
      >
      <View style={styles.body}>
      <Card containerStyle={styles.cardContainer} style={styles.card}>
       
        <View style={styles.detail}>
          <DetailList title="Client" value={item.inbound.client} />
          <DetailList title="Ref #" value={this.state.inboundData.reference_id} />
          <DetailList title="Shipment Type" value={this.state.inboundData.shipment_type === 2 ? "FCL" : "LCL"} />
          <DetailList title="Recorded By" value={item.inbound_shipment_va.created_by  !== undefined ? item.inbound_shipment_va.created_by.firstName : null} />
          <DetailList title="Date and Time" value={item.inbound_shipment_va.created_on  !== undefined && item.inbound_shipment_va.created_on  !== null ? moment(item.inbound_shipment_va.created_on).format('DD/MM/YYYY h:mm a') : null}/>
         
        <View style={{marginVertical:10, flexDirection:'row'}}> 
        <View style={{flex:1, alignContent:'flex-start'}}>        
        <Text style={{...Mixins.body1,lineHeight:20,fontWeight:'700',color:'#2D2C2C'}}>
        { shipmentopt}  
      </Text>
      </View>

        {item.inbound_shipment_va.inbound_shipment !== undefined && (<ArrowDown fill="black" height="26" width="26" style={{flexShrink:1,alignContent:'flex-end', transform:[{rotate:'-90deg'}]}}/>)}
          </View>
          <DetailList title="Number Pallet" value={item.inbound_shipment_va.inbound_shipment_no_pallet} />
          <DetailList title="Number Cartons" value={item.inbound_shipment_va.inbound_shipment_no_carton} />
          
        </View>
      </Card>
    </View>
    </TouchableScale>
    );
  }
  renderEmptyComponent = () => {
    return (
      <View style={{alignItems:'center', justifyContent:'center', marginTop:'30%'}}>
                <EmptyIlustrate height="132" width="213" style={{marginBottom:15}}/>
                <Text style={{  ...Mixins.subtitle3,}}>No shipment VAS found</Text>
    </View>
    );
  }
  render() {
    const {inboundData,itemIVAS} = this.state;
    if(inboundData === null || itemIVAS === null )
    return (<Loading/>);
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
         
        <FlatList
            horizontal={false}
            ListHeaderComponent={this.renderHeaderListVAS}
            keyExtractor={(item,index)=>index}
            data={itemIVAS}
            contentContainerStyle={{paddingHorizontal:10}}
            ListEmptyComponent={this.renderEmptyComponent}
            renderItem={this.renderListVAS}
            />
       
        
        </View>
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
