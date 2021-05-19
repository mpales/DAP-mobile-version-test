import React, {Component} from 'react';
import {View, TouchableOpacity, PermissionsAndroid, Switch} from 'react-native';
import {SearchBar, Badge, Divider, Text} from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AddressList from '../../../component/extend/ListItem-map';
import Map from '../../../component/map/map-address';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'
import {setDataOrder} from '../../../action/index';
import {getDirectionsAPI,setDirections,setRouteStats,getDirectionsAPIWithTraffic} from '../../../action/direction';
import {setGeoLocation} from '../../../action/geolocation';
import RNLocation from 'react-native-location';
import Util from '../../../component/map/interface/leafletPolygon';
import Location from '../../../component/map/interface/geoCoordinate'
import Mixins from '../../../mixins';

class ListMap extends Component {
  
  constructor(props) {
    super(props);

    RNLocation.configure({
      distanceFilter: 0, // Meters
      desiredAccuracy: {
        ios: "best",
        android: "balancedPowerAccuracy"
      },
      // Android only
      androidProvider: "standard",
      interval: 5000, // Milliseconds
      fastestInterval: 10000, // Milliseconds
      maxWaitTime: 5000, // Milliseconds
      // iOS Only
      activityType: "other",
      allowsBackgroundLocationUpdates: false,
      headingFilter: 1, // Degrees
      headingOrientation: "portrait",
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
  })
    if(this.props.isTraffic){
      this.props.getDirectionsAPIWithTraffic([{lat: 1.3143394,lng:103.7038231},{lat:1.3287109, lng:103.8476682},{lat:1.2895404, lng:103.8081271},{lat:1.3250369, lng:103.6973209},{lat:1.3691909, lng:103.8436772},{lat:1.330895, lng:103.8375949},{lat: 1.3911178, lng:103.7664461}]);
    } else {

      this.props.getDirectionsAPI([{lat: 1.3143394,lng:103.7038231},{lat: 1.3911178, lng:103.7664461},{lat:1.3287109, lng:103.8476682},{lat:1.2895404, lng:103.8081271},{lat:1.3250369, lng:103.6973209},{lat:1.3691909, lng:103.8436772},{lat:1.330895, lng:103.8375949}]);
    }
   
    const namedOrder = [
      {named: 'Ginny',packages:15,Address:'Chang i 26th, Singapore', list: [
        {package:'3',weight:'23.00 Kg',CBM:'0.18', id: '#323344567553' },
        {package:'6',weight:'64.00 Kg',CBM:'0.50', id: '#323344342342' },
        {package:'3',weight:'23.00 Kg',CBM:'0.18', id: '#323312312312' },
        {package:'3',weight:'23.00 Kg',CBM:'0.18', id: '#323344897815'},
      ]},
      {named: 'Tho',packages:4,Address:'639 Balestier Rd, Singapura 329922', list: [
        {package:'1',weight:'23.00 Kg',CBM:'0.18' , id: '#12544457577'},
        {package:'3',weight:'64.00 Kg',CBM:'0.50' , id: '#67785464564'},
      ]},
      {named: 'West',packages:4,Address:'2 Orchard Turn, Singapura 238801', list: [
        {package:'1',weight:'23.00 Kg',CBM:'0.18' , id: '#988786767666'},
        {package:'3',weight:'64.00 Kg',CBM:'0.50' , id: '#455645645688'},
      ]},
      {named: 'Go',packages:1,Address:'221A Boon Lay Pl, Singapura 641221', list: [
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#768565463455'},
      ]},
      {named: 'Dolittle',packages:5,Address:'16 Ang Mo Kio Central 3, Singapore 567748', list: [
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#879755465377'},
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#345344234677'},
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#345345436435'},
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#213125432423'},
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#856756534555'},
      ]},
      {named: 'Cumberbatch',packages:1,Address:'510 Thomson Rd, Singapura 298135', list: [
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#323344897815'},
      ]},
      {named: 'Bram',packages:1,Address:'27 Woodlands Link, #01-01 Chang Cheng HQ, Singapura 738732', list: [
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#456456456542'},
      ]},
    ];
    this.props.setDataOrder(namedOrder);
    this.state = {
      search: '',
      data : [],
      namedOrder,
      trafficButton: false,
    };
    this.onPressedTraffic.bind(this);
    this.translateOrders.bind(this);
    this.translateOrdersTraffic.bind(this);
    this.translateDragToOrder.bind(this);
  }
  onPressedTraffic = (value) => {
    this.setState({trafficButton: value});
  };

  componentDidMount() {
    this.updateStateData();
  }
  updateSearch = (search) => {
    this.setState({search});
  };
  
  translateOrders = () => {
    const {orders} = this.props;
    let translate = Array.from({length:orders.length}).map((num,index)=>{
      return {lat:orders[index][0],lng:orders[index][1]};
    });
    let last = translate.pop();
    translate.splice(1,0,last);
    return translate;
  }

  translateOrdersTraffic = () => {
    const {orders} = this.props;
    let translate = Array.from({length:orders.length}).map((num,index)=>{
      return {lat:orders[index][0],lng:orders[index][1]};
    });
    return translate;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if( prevProps.statAPI.length !== this.props.statAPI.length || prevProps.stat.length === 0 && this.props.stat.length > 0 ||  prevProps.route_id !== this.props.route_id || prevProps.isActionQueue.length !== this.props.isActionQueue.length || prevProps.isConnected !== this.props.isConnected ){
      this.updateStateData();
    }
   
    let {locationPermission} = this.props;
    if (locationPermission && prevProps.route_id !== this.props.route_id) {
      RNLocation.configure({ distanceFilter: 0 });
      RNLocation.getLatestLocation({ timeout: 600 })
        .then(latestLocation => {
          this.props.setGeoLocation({timestamp: latestLocation.timestamp,lat: latestLocation.latitude, lng: latestLocation.longitude});
        })
    }

    if(!this.props.steps){
      if(this.props.isTraffic){
        let orders = this.translateOrdersTraffic();
        this.props.getDirectionsAPIWithTraffic(orders);  
      } else {
        let orders = this.translateOrders();
        this.props.getDirectionsAPI(orders);  
      }
    }
  // for active subscribed geoLocation please see the conditional within props.step to update;
  if((prevProps.location === undefined && this.props.location !== undefined ) || (prevProps.route_id !== this.props.route_id && this.props.stat.length === 0)){
    let COORDINATES = this.props.steps;
    let markers = this.props.markers;
    let location = this.props.location;
    let LatLngs =  Array.from({length: COORDINATES.length}).map((num, index) => {
      let latLng = new Location(COORDINATES[index][0],COORDINATES[index][1]);
      return latLng.location();
    });
    let marker = Array.from({length:markers.length}).map((num,index)=>{
      let latLng = new Location(markers[index][0],markers[index][1]);
    return  latLng.location(); 
    });

    const Polygon = new Util;
    
    Polygon.setGeoLocation(this.props.location);
    let LayerGroup = Polygon.setLayerStats(LatLngs,marker);
    let stats = Polygon.translateToStats(marker);

    this.props.setRouteStats(markers,stats)
    }
  }

  updateStateData = () => {
    this.setState({data: Array.from({length: this.props.statAPI.length}).map((element,index)=>{
      let statSingleOffline = this.props.stat[index];
      let statSingleAPI = this.props.statAPI[index];
      let namedData = this.props.dataPackage.length > 0 ? this.props.dataPackage[index] : this.state.namedOrder[index];
      return {...statSingleOffline,...statSingleAPI,...namedData};
    })})
  }

  translateDragToOrder = (from,to) => {
    let {markers} = this.props;
    let changed = markers.splice(from,1);
    markers.splice(to,0,changed[0]);

    //demo purpose only
    let {namedOrder} = this.state;
    let changedNamed = namedOrder.splice(from,1);
    namedOrder.splice(to,0,changedNamed[0]);
    this.props.setDataOrder(namedOrder);
    this.setState({namedOrder:namedOrder});
    //demo purpose only


    this.props.setDirections(markers);
  }

  navigateToDelivery = (index)=> {
    const {startDelivered} = this.props;
    if(startDelivered) {
      this.props.setBottomBar(false);
    } else {
      this.props.setBottomBar(true);
    }
    this.props.navigation.navigate('Navigation', {
      index: index,
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.headerContainer}>
          <View style={{height: 250}}>
            <Map trafficLayer={this.state.trafficButton}/>
          </View>
          <View
            style={{
              backgroundColor: '#F07120',
              paddingLeft: 73,
              paddingRight: 23,
              paddingVertical: 10,
              flexDirection: 'row',
            }}>
            <Text style={{...Mixins.subtitle3,lineHeight: 21, color: 'white', flex:1}}>
              Delivery List
            </Text>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignSelf: 'flex-end',alignContent:'flex-end'}}>
                <Text style={{...Mixins.subtitle3,lineHeight: 21, color: 'white', flexShrink:1,marginHorizontal: 5}}>
              Traffic
            </Text>
            <Switch onValueChange={(value) => this.onPressedTraffic(value)}
                      value={this.state.trafficButton}/>
                </View>
          </View>
        </View>
        <DraggableFlatList
          data={this.state.data}
          autoscrollSpeed={700}
          renderItem={(props) => (
            <AddressList {...props} navigation={this.navigateToDelivery} />
          )}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({data,from,to}) => this.translateDragToOrder(from,to)}
        />
      </View>
    );
  }
}

const styles = {
  filterContainer: {
    flexShrink: 1,
    marginVertical: 15,
    flexDirection: 'column',
  },
  sectionSort: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  badgeSort: {
    paddingHorizontal: 5,
  }, 
};
function mapStateToProps(state) {
  return {
    markers: state.originReducer.route.markers,
    steps: state.originReducer.route.steps,
    orders: state.originReducer.route.orders,
    location: state.originReducer.userRole.location,
    route_id: state.originReducer.route.id,
    stat : state.originReducer.route.stat,
    statAPI : state.originReducer.route.statAPI,
    isTraffic: state.originReducer.filters.isTraffic,
    locationPermission : state.originReducer.filters.locationPermission,
    dataPackage: state.originReducer.route.dataPackage,
    isConnected : state.network.isConnected,
    isActionQueue: state.network.actionQueue,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setStartDelivered : (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    },
 
    ...bindActionCreators({ setDataOrder,getDirectionsAPI,setDirections,setGeoLocation,setRouteStats, getDirectionsAPIWithTraffic}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListMap);
