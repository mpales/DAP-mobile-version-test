import React, {Component} from 'react';
import {View, TouchableOpacity, Text, PermissionsAndroid, NativeModules} from 'react-native';
import {SearchBar, Badge} from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AddressList from '../../../component/extend/ListItem-address';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux';
import {setDataOrder} from '../../../action/index';
import {getDirectionsAPI,setDirections,setRouteStats,getDirectionsAPIWithTraffic} from '../../../action/direction';
import {setGeoLocation, reverseGeoCoding} from '../../../action/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Util from '../../../component/map/interface/leafletPolygon';
import Location from '../../../component/map/interface/geoCoordinate'
import Mixins from '../../../mixins';
const {RNFusedLocation} = NativeModules;
class List extends Component {
  constructor(props) {
    super(props);
    
    const namedOrder = [
      {named: 'Ginny', coords:{lat: 1.3143394,lng:103.7038231},packages:15,Address:'Chang i 26th, Singapore', list: [
        {package:'3',weight:'23.00 Kg',CBM:'0.18', id: '#323344567553' },
        {package:'6',weight:'64.00 Kg',CBM:'0.50', id: '#323344342342' },
        {package:'3',weight:'23.00 Kg',CBM:'0.18', id: '#323312312312' },
        {package:'3',weight:'23.00 Kg',CBM:'0.18', id: '#323344897815'},
      ]},
      {named: 'Tho',coords: {lat:1.3287109, lng:103.8476682}, packages:4,Address:'639 Balestier Rd, Singapura 329922', list: [
        {package:'1',weight:'23.00 Kg',CBM:'0.18' , id: '#12544457577'},
        {package:'3',weight:'64.00 Kg',CBM:'0.50' , id: '#67785464564'},
      ]},
      {named: 'West', coords : {lat:1.2895404, lng:103.8081271}, packages:4,Address:'2 Orchard Turn, Singapura 238801', list: [
        {package:'1',weight:'23.00 Kg',CBM:'0.18' , id: '#988786767666'},
        {package:'3',weight:'64.00 Kg',CBM:'0.50' , id: '#455645645688'},
      ]},
      {named: 'Go', coords: {lat:1.3250369, lng:103.6973209}, packages:1,Address:'221A Boon Lay Pl, Singapura 641221', list: [
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#768565463455'},
      ]},
      {named: 'Dolittle', coords: {lat:1.3691909, lng:103.8436772}, packages:5,Address:'16 Ang Mo Kio Central 3, Singapore 567748', list: [
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#879755465377'},
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#345344234677'},
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#345345436435'},
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#213125432423'},
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#856756534555'},
      ]},
      {named: 'Cumberbatch', coords: {lat:1.330895, lng:103.8375949}, packages:1,Address:'510 Thomson Rd, Singapura 298135', list: [
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#323344897815'},
      ]},
      {named: 'Bram',packages:1,coords: {lat: 1.3911178, lng:103.7664461}, Address:'27 Woodlands Link, #01-01 Chang Cheng HQ, Singapura 738732', list: [
        {package:'1',weight:'2.00 Kg',CBM:'0.18' , id: '#456456456542'},
      ]},
    ];
  
  this.state = {
    data: [],
    search: '',
    namedOrder,
    locationPermission : false,
  };
  this.props.dataPackage.length > 0 ? null :   this.props.setDataOrder(namedOrder);

  this.translateOrders.bind(this);
  this.translateOrdersTraffic.bind(this);
  this.translatePressTimeToOrder.bind(this);
  this.translatePressPickupToOrder.bind(this);
  this.updateStateData.bind(this);
  }
  updateSearch = (search) => {
    this.setState({search});
  };
  componentDidMount() {
     let {locationPermission} = this.props;
    if (locationPermission && this.props.currentPositionData === null) {
        let watchID = Geolocation.watchPosition(
         ({coords}) => {
           let latLng = {
             lat: coords.latitude,
             lng: coords.longitude,
           };
           this.props.reverseGeoCoding(coords);
           this.props.setGeoLocation(latLng);
           Geolocation.clearWatch(watchID);
           if(this.props.isTraffic){
            this.props.getDirectionsAPIWithTraffic([{lat: 1.3143394,lng:103.7038231},{lat:1.3287109, lng:103.8476682},{lat:1.2895404, lng:103.8081271},{lat:1.3250369, lng:103.6973209},{lat:1.3691909, lng:103.8436772},{lat:1.330895, lng:103.8375949},{lat: 1.3911178, lng:103.7664461}], latLng);
          } else {
        
            this.props.getDirectionsAPI([{lat: 1.3143394,lng:103.7038231},{lat: 1.3911178, lng:103.7664461},{lat:1.3287109, lng:103.8476682},{lat:1.2895404, lng:103.8081271},{lat:1.3250369, lng:103.6973209},{lat:1.3691909, lng:103.8436772},{lat:1.330895, lng:103.8375949}], latLng);
          }
           RNFusedLocation.stopObserving();
         },
         () => {},
         {
           timeout: 300,
           maximumAge: 50,
           enableHighAccuracy: true,
           useSignificantChanges: false,
           distanceFilter: 0,
         },
       );
    }
    this.updateStateData();
  }

  translateOrdersTraffic = () => {
    const {orders} = this.props;
    let translate = Array.from({length:orders.length}).map((num,index)=>{
      return {lat:orders[index][0],lng:orders[index][1]};
    });
    return translate;
  }

  translateOrders = () => {
    const {orders} = this.props;
    let translate = Array.from({length:orders.length}).map((num,index)=>{
      return {lat:orders[index][0],lng:orders[index][1]};
    });
    let last = translate.pop();
    translate.splice(1,0,last);
    return translate;
  }
  
  updateStateData = () => {
    this.setState({data: Array.from({length: this.props.statAPI.length}).map((element,index)=>{
      let statSingleOffline = this.props.stat[index];
      let statSingleAPI = this.props.statAPI[index];
      let namedData = this.props.dataPackage.length > 0 ? this.props.dataPackage[index] : this.state.namedOrder[index];
      return {...statSingleOffline,...statSingleAPI,...namedData};
    })})
  }
  componentDidUpdate(prevProps, prevState, snapshot) {

    if( prevProps.statAPI.length !== this.props.statAPI.length || prevProps.stat.length === 0 && this.props.stat.length > 0 ||  prevProps.route_id !== this.props.route_id || prevProps.isActionQueue.length !== this.props.isActionQueue.length || prevProps.isConnected !== this.props.isConnected ){
      this.updateStateData();
    }
     let {locationPermission} = this.props;
     if (locationPermission && (prevProps.route_id !== this.props.route_id || this.props.currentPositionData === null)) {
         let watchID = Geolocation.watchPosition(
          ({coords}) => {
            let latLng = {
              lat: coords.latitude,
              lng: coords.longitude,
            };
            this.props.reverseGeoCoding(coords);
            this.props.setGeoLocation(latLng);
            Geolocation.clearWatch(watchID);
            RNFusedLocation.stopObserving();
          },
          () => {},
          {
            timeout: 300,
            maximumAge: 50,
            enableHighAccuracy: true,
            useSignificantChanges: false,
            distanceFilter: 0,
          },
        );
     }

     if(!this.props.steps){
      if(this.props.isTraffic){
        let {coords} = this.props.currentPositionData;
        let orders = this.translateOrdersTraffic();
        this.props.getDirectionsAPIWithTraffic(orders, coords);  
      } else {
        let orders = this.translateOrders();
        this.props.getDirectionsAPI(orders);  
      }
    }
   // for active subscribed geoLocation please see the conditional within props.step to update;
   if((prevProps.location === undefined && this.props.location !== undefined ) || (prevProps.route_id !== this.props.route_id && this.props.stat.length === 0)){
    let COORDINATES = this.props.steps;
    let markers = this.props.markers;
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
  translatePressTimeToOrder = () => {
    let {stat,markers, dataPackage} = this.props;
    let copyStat = [...stat];
    let changedNamed = [];
    let order = Array.from({length:markers.length}).map((num,index)=>{
      let prop = copyStat.reduce((prev, curr) => prev.chrono < curr.chrono ? prev : curr);
      delete copyStat[prop.key];
      changedNamed.push(dataPackage[prop.key]);
      return markers[prop.key]
    });
    this.props.setDataOrder(changedNamed);

    this.props.setFilter(1);
    this.props.setDirections(order);
  };
  translatePressPickupToOrder = () => {
   
    let {stat,markers, dataPackage} = this.props;
    let copyStat = [...stat];
    let changedNamed = [];
    let order = Array.from({length:markers.length}).map((num,index)=>{
      let prop = copyStat.reduce((prev, curr) => prev.dist < curr.dist ? prev : curr);
      delete copyStat[prop.key];
      changedNamed.push(dataPackage[prop.key]);
      return markers[prop.key]
    });    
    this.props.setDataOrder(changedNamed);
    this.props.setFilter(2);
    this.props.setDirections(order);
  };
  translateDragToOrder = (from,to) => {
    let {markers, dataPackage} = this.props;
    let changed = markers.splice(from,1);
    markers.splice(to,0,changed[0]);
     //demo purpose only

     let changedNamed = dataPackage.splice(from,1);
     dataPackage.splice(to,0,changedNamed[0]);
     this.props.setDataOrder(dataPackage);

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

    const {search} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <DraggableFlatList
          autoscrollSpeed={700}
          data={this.state.data}
          renderItem={(props) => {
            return (
              <AddressList {...props} navigation={this.navigateToDelivery} />
            );
          }}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({data,from,to}) => this.translateDragToOrder(from,to)}
          ListHeaderComponent={() => {
            return (
              <View style={styles.filterContainer}>
                <SearchBar
                  placeholder="Type Here..."
                  onChangeText={this.updateSearch}
                  value={search}
                  lightTheme={true}
                  inputStyle={{backgroundColor: '#fff'}}
                  placeholderTextColor="#2D2C2C"
                  searchIcon={() => (
                    <IconSearchMobile height="20" width="20" fill="#2D2C2C" />
                  )}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    paddingHorizontal: 37,
                    marginVertical: 5,
                  }}
                  inputContainerStyle={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#D5D5D5',
                  }}
                  leftIconContainerStyle={{backgroundColor: 'white'}}
                />
                <View style={styles.sectionSort}>
                  <Badge
                    value="All"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.props.setFilter(0)}
                    badgeStyle={this.props.isFiltered === 0 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.props.isFiltered === 0 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                  />

                  <Badge
                    value="Time"
                    containerStyle={styles.badgeSort}
                    onPress={this.translatePressTimeToOrder}
                    badgeStyle={this.props.isFiltered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.props.isFiltered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                  />

                  <Badge
                    value="Pickup"
                    containerStyle={styles.badgeSort}
                    onPress={this.translatePressPickupToOrder}
                    badgeStyle={this.props.isFiltered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.props.isFiltered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                  />

                  <Badge
                    value="Company"
                    containerStyle={styles.badgeSort}
                    badgeStyle={this.props.isFiltered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.props.isFiltered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                  />

                  <Badge
                    value="Warehouse"
                    containerStyle={styles.badgeSort}
                    badgeStyle={this.props.isFiltered === 4 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.props.isFiltered === 4 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                  />
                </View>
              </View>
            );
          }}
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
  badgeActive: {    
  backgroundColor: '#F1811C',
  borderWidth: 1,
  borderColor: '#F1811C',
  paddingHorizontal: 12,
  height: 20,

  },
  badgeActiveTint: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#ffffff'
  },
  badgeInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121C78',
    paddingHorizontal: 12,
    height: 20,
  },
  badgeInactiveTint: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#121C78'
  },
};

function mapStateToProps(state) {
  return {
    bottomBar: state.originReducer.filters.bottomBar,
    startDelivered: state.originReducer.filters.onStartDelivered,
    markers: state.originReducer.route.markers,
    steps: state.originReducer.route.steps,
    orders: state.originReducer.route.orders,
    location: state.originReducer.userRole.location,
    currentPositionData: state.originReducer.currentPositionData,
    route_id: state.originReducer.route.id,
    stat : state.originReducer.route.stat,
    isFiltered: state.originReducer.filters.isFiltered,
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
    setFilter: (num) => {
      return dispatch({type: 'filtered_sort',payload: num});
    },
    ...bindActionCreators({ setDataOrder,getDirectionsAPI,setDirections,setGeoLocation,setRouteStats, getDirectionsAPIWithTraffic, reverseGeoCoding}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
