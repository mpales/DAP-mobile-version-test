import React, {Component} from 'react';
import {View, TouchableOpacity, PermissionsAndroid } from 'react-native';
import {SearchBar, Badge, Divider, Text} from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import addressList from '../../../component/extend/ListItem-map';
import Map from '../../../component/map/map-address';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'
import {getDirectionsAPI,setDirections,setRouteStats} from '../../../action/direction';
import {setGeoLocation} from '../../../action/geolocation';
import RNLocation from 'react-native-location';
import Util from '../../../component/map/interface/leafletPolygon';
import Location from '../../../component/map/interface/geoCoordinate'


class ListMap extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      data : [],
    };
    this.translateOrders.bind(this);
    this.translateDragToOrder.bind(this);
    this.requestLocationPermission.bind(this);
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

    this.props.getDirectionsAPI([{lat: 1.1037975445392902,lng:104.09571858289692},{lat:1.14464508675823, lng:104.02156086973538},{lat:1.1082599092338112, lng:104.04078694269813},{lat:1.0698147079937361, lng:104.02362080612424},{lat:1.1031110269159847, lng:103.95735951894906},{lat:1.1243930156749928, lng:104.01812764242061},{lat:1.110319459656965, lng:103.99752827853195},{lat:1.115125071726475, lng:104.05348988376281}]);
  }
  
  async requestLocationPermission() {
    let {locationPermission} = this.state;
    if (locationPermission) {
     await RNLocation.checkPermission({
        ios: 'whenInUse', // or 'always'
        android: {
          detail: 'coarse' // or 'fine'
        }
      }).then(granted => {
        if (granted) {
          this.setState({locationPermission: true});
        } else {

          this.setState({locationPermission: false});
        }
      });
    } else {
      
           await RNLocation.requestPermission({
              ios: 'whenInUse', // or 'always'
              android: {
                detail: 'coarse', // or 'fine'
                rationale: {
                  title: "We need to access your location",
                  message: "We use your location to show where you are on the map",
                  buttonPositive: "OK",
                  buttonNegative: "Cancel"
                }
              }
          }).then(granted => {
            if (granted) {
              this.setState({locationPermission: true});
            } else {

              this.setState({locationPermission: false});
            }
          });
     
    }
};

  componentDidMount() {
    
    this.requestLocationPermission();
    
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
  
  componentDidUpdate(prevProps, prevState, snapshot) {
   
   
    let {locationPermission} = this.state;
    if (prevState.locationPermission !== locationPermission && locationPermission) {
      RNLocation.configure({ distanceFilter: 0 });
      RNLocation.getLatestLocation({ timeout: 600 })
        .then(latestLocation => {
          this.props.setGeoLocation({timestamp: latestLocation.timestamp,lat: latestLocation.latitude, lng: latestLocation.longitude});
        })
    }

    if(!this.props.steps){
     console.log('new');
     let orders = this.translateOrders();
    this.props.getDirectionsAPI(orders);  
   } else {
     console.log('old');
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
  translateDragToOrder = (from,to) => {
    let {markers} = this.props;
    let changed = markers.splice(from,1);
    markers.splice(to,0,changed[0]);

    this.props.setDirections(markers);
  }
  render() {
    const {search} = this.state;
    return (
      <View style={{flex: 1}}>
        <DraggableFlatList
          data={this.props.stat}
          autoscrollSpeed={700}
          renderItem={addressList}
          keyExtractor={(item, index) => index}
          onDragEnd={({data,from,to}) => this.translateDragToOrder(from,to)}
          ListHeaderComponent={() => {
            return (
              <View style={styles.headerContainer}>
                <View style={{height: 250}}>
                  <Map />
                </View>
                <View
                  style={{
                    backgroundColor: '#F07120',
                    paddingHorizontal: 73,
                    paddingVertical: 10,
                  }}>
                  <Text style={{fontSize: 14, color: 'white'}}>
                    Delivery List
                  </Text>
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
};
function mapStateToProps(state) {
  return {
    markers: state.route.markers,
    steps: state.route.steps,
    orders: state.route.orders,
    location: state.userRole.location,
    route_id: state.route.id,
    stat : state.route.stat,
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
    ...bindActionCreators({ getDirectionsAPI,setDirections,setGeoLocation,setRouteStats}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListMap);
