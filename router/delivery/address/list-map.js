import React, {Component} from 'react';
import {View, TouchableOpacity, PermissionsAndroid, Switch, Dimensions, NativeModules, FlatList} from 'react-native';
import {SearchBar, Badge, Divider, Text, FAB} from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AddressList from '../../../component/extend/ListItem-map';
import Map from '../../../component/map/map-address';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'
import {setDataOrder} from '../../../action/index';
import {getDirectionsAPI,setDirections,setRouteStats,getDirectionsAPIWithTraffic} from '../../../action/direction';
import {setGeoLocation, reverseGeoCoding} from '../../../action/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Util from '../../../component/map/interface/leafletPolygon';
import Location from '../../../component/map/interface/geoCoordinate'
import Mixins from '../../../mixins';
import Delivery6 from '../../../assets/icon/iconmonstr-delivery-6mobile.svg';
const {RNFusedLocation} = NativeModules;
const screen = Dimensions.get('window');
class ListMap extends Component {
  
  constructor(props) {
    super(props);

  
    this.state = {
      search: '',
      data : [],
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

   
    if(prevProps.route_id !== this.props.route_id){
      let {coords} = this.props.currentPositionData;
      let orders = this.translateOrdersTraffic();
      this.props.getDirectionsAPIWithTraffic(orders, coords);  
  }
  // for active subscribed geoLocation please see the conditional within props.step to update;
  // if((prevProps.location === undefined && this.props.location !== undefined ) || (prevProps.route_id !== this.props.route_id && this.props.stat.length === 0)){
  //   let COORDINATES = this.props.steps;
  //   let markers = this.props.markers;
  //   let location = this.props.location;
  //   let LatLngs =  Array.from({length: COORDINATES.length}).map((num, index) => {
  //     let latLng = new Location(COORDINATES[index][0],COORDINATES[index][1]);
  //     return latLng.location();
  //   });
  //   let marker = Array.from({length:markers.length}).map((num,index)=>{
  //     let latLng = new Location(markers[index][0],markers[index][1]);
  //   return  latLng.location(); 
  //   });

  //   const Polygon = new Util;
    
  //   Polygon.setGeoLocation(this.props.location);
  //   let LayerGroup = Polygon.setLayerStats(LatLngs,marker);
  //   let stats = Polygon.translateToStats(marker);

  //   this.props.setRouteStats(markers,stats)
  //   }
  }

  updateStateData = () => {
    this.setState({data: Array.from({length: this.props.statAPI.length}).map((element,index)=>{
      //let statSingleOffline = this.props.stat[index];
      let statSingleAPI = this.props.statAPI[index];
      let namedData = this.props.dataPackage[index] ;
      return {...statSingleAPI,...namedData};
    })})
  }

  translateDragToOrder = (from,to) => {
    let {markers, dataPackage} = this.props;
    let changed = markers.splice(from,1);
    markers.splice(to,0,changed[0]);

    //demo purpose only
    let changedNamed = dataPackage.splice(from,1);
    dataPackage.splice(to,0,changedNamed[0]);
    this.props.setDataOrder(dataPackage);
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
          <View style={{height: screen.height / 4}}>
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
        <FlatList
          data={this.state.data}
          renderItem={(props) => (
            <AddressList {...props} navigation={this.navigateToDelivery} />
          )}
          keyExtractor={(item, index) => index}
        />
                <FAB 
            onPress={()=>{
              console.log('test');
            }}
            icon={()=><Delivery6 fill="#fff" height="24" width="24"/>}
            color="#121C78"
            placement="right" style={{elevation:10,}} buttonStyle={{borderRadius:100}}/>
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
    currentPositionData: state.originReducer.currentPositionData,
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
 
    ...bindActionCreators({ setDataOrder,getDirectionsAPI,setDirections,setGeoLocation,setRouteStats, getDirectionsAPIWithTraffic, reverseGeoCoding}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListMap);
