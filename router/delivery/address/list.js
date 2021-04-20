import React, {Component} from 'react';
import {View, TouchableOpacity, Text, PermissionsAndroid} from 'react-native';
import {SearchBar, Badge} from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AddressList from '../../../component/extend/ListItem-address';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux';
import {getDirectionsAPI,setDirections,setRouteStats} from '../../../action/direction';
import {setGeoLocation} from '../../../action/geolocation';
import RNLocation from 'react-native-location';
import Util from '../../../component/map/interface/leafletPolygon';
import Location from '../../../component/map/interface/geoCoordinate'

const exampleData = [...Array(20)].map((d, index) => ({
  key: `item-${index}`, // For example only -- don't use index as your key!
  label: index,
  backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${
    index * 5
  }, ${132})`,
}));

class List extends Component {
  constructor(props) {
    super(props);
    this.requestLocationPermission.bind(this);
    this.translatePressTimeToOrder.bind(this);
    this.translatePressPickupToOrder.bind(this);
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
  }
  state = {
    data: exampleData,
    search: '',
    locationPermission : false,
  };
  updateSearch = (search) => {
    this.setState({search});
  };
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
   console.log('updated');
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
    let {stat,markers} = this.props;
    let copyStat = [...stat];
    let order = Array.from({length:markers.length}).map((num,index)=>{
      let prop = copyStat.reduce((prev, curr) => prev.chrono < curr.chrono ? prev : curr);
      delete copyStat[prop.key];
      return markers[prop.key]
    });
    this.props.setFilter(1);
    this.props.setDirections(order);
  };
  translatePressPickupToOrder = () => {
   
    let {stat,markers} = this.props;
    let copyStat = [...stat];
    let order = Array.from({length:markers.length}).map((num,index)=>{
      let prop = copyStat.reduce((prev, curr) => prev.dist < curr.dist ? prev : curr);
      delete copyStat[prop.key];
      return markers[prop.key]
    });    
    this.props.setFilter(2);
    this.props.setDirections(order);
  };
  translateDragToOrder = (from,to) => {
    let {markers} = this.props;
    let changed = markers.splice(from,1);
    markers.splice(to,0,changed[0]);
    this.props.setDirections(markers);
  }
  render() {
    const {search} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <DraggableFlatList
          autoscrollSpeed={700}
          data={this.props.stat}
          renderItem={(props) => {
            return (
              <AddressList {...props} navigation={this.props.navigation} />
            );
          }}
          keyExtractor={(item, index) => index}
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
    fontSize: 10, 
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
    fontSize: 10, 
    color: '#121C78'
  },
};

function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    bottomBar: state.filters.bottomBar,
    startDelivered: state.filters.startDelivered,
    markers: state.route.markers,
    steps: state.route.steps,
    orders: state.route.orders,
    location: state.userRole.location,
    route_id: state.route.id,
    stat : state.route.stat,
    isFiltered: state.filters.isFiltered,
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
    ...bindActionCreators({ getDirectionsAPI,setDirections,setGeoLocation,setRouteStats}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
