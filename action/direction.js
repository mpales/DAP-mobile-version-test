import fetch from 'cross-fetch';
const polyUtil = require('polyline-encoded');
import { v5 as uuidv5 } from 'uuid';
import Geohash from 'latlon-geohash';
import { offlineActionCreators } from 'react-native-offline';

// Define a custom namespace. 
const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

export const setDirections = (markers) => {

    let geohash = Array.from({length:markers.length}).map((num,index)=>{
        return Geohash.encode(markers[index][0], markers[index][1], 6);
    });
      let last = geohash.pop();
      geohash.splice(1,0,last);

    let uuid = uuidv5(geohash.join(), MY_NAMESPACE); // ⇨ '630eb68f-e0fa-5ecc-887a-7c7a62614681'
    const thunk = (dispatch, getState) => {
        dispatch({
            type: 'MarkerOrdered',
            payload: {orders: markers, uuid: uuid},
          });
      };  
      thunk.interceptInOffline = true;

      thunk.meta = {
        retry: true,
        name: 'setDirections',
        args: [markers],
      };
    return thunk;
}
export const getDirectionsAPI = (orders) => {
    let geohash = Array.from({length:orders.length}).map((num,index)=>{
        return Geohash.encode(orders[index].lat, orders[index].lng, 6);
    });

    let uuid = uuidv5(geohash.join(), MY_NAMESPACE); // ⇨ '630eb68f-e0fa-5ecc-887a-7c7a62614681'

    var markers = [];
    var steps = [];
    let chrono = {};
    let origin = orders.slice(0,1);
    let destination = orders.slice(1,2);
    let waypoints = orders.slice(2,orders.length);
    waypoints = Array.from({length:waypoints.length}).map((num,index)=>{
        return 'via:'+waypoints[index].lat+','+waypoints[index].lng;
    });
    if(waypoints.length)
    waypoints = '&waypoints='+waypoints.join('|');

    let string = 'origin='+origin[0].lat+','+origin[0].lng+'&destination='+destination[0].lat+','+destination[0].lng+waypoints+'&key=AIzaSyCPhiV06uZ7rSLq2hOfeu_OXgVZ0PXVooQ';
    const thunk = (dispatch, getState) => {
    fetch('https://maps.googleapis.com/maps/api/directions/json?'+string)
    .then(res => {
    if (res.status >= 400) {
        throw new Error("Bad response from server");
    }
    return res.json();
    })
    .then(directions => {
    if(directions.routes[0].hasOwnProperty('legs')){
       
        chrono = {distance: directions.routes[0].legs[0].distance, duration: directions.routes[0].legs[0].duration};
        markers.push([directions.routes[0].legs[0].start_location.lat,directions.routes[0].legs[0].start_location.lng]);
        if(directions.routes[0].legs[0].hasOwnProperty('via_waypoint') && directions.routes[0].legs[0].via_waypoint.length > 0){
            directions.routes[0].legs[0].via_waypoint.forEach(element=> {
                markers.push([directions.routes[0].legs[0].steps[element.step_index].start_location.lat, directions.routes[0].legs[0].steps[element.step_index].start_location.lng]);          
            });
        }

        markers.push([directions.routes[0].legs[0].end_location.lat,directions.routes[0].legs[0].end_location.lng]);
        
        if(directions.routes[0].legs[0].hasOwnProperty('steps') && directions.routes[0].legs[0].steps.length > 0)
            directions.routes[0].legs[0].steps.forEach(element => {
                steps.push([element.start_location.lat,element.start_location.lng]);
                let decode = polyUtil.decode(element.polyline.points);
                if(decode.length > 0 ){
                    steps = steps.concat(decode);
                }
                steps.push([element.end_location.lat, element.end_location.lng]);
            });
            dispatch({
                type: 'Directions',
                payload: {markers: markers,steps:steps, uuid: uuid},
              });
        }
    })
    .catch(err => {
        dispatch(offlineActionCreators.fetchOfflineMode(thunk));
    });
    
    };
    thunk.interceptInOffline = true;

    thunk.meta = {
      retry: true,
      name: 'getDirectionsAPI',
      args: [orders],
    };
  return thunk;
};



export const getDirectionsAPIWithTraffic = (orders) => {
    let geohash = Array.from({length:orders.length}).map((num,index)=>{
        return Geohash.encode(orders[index].lat, orders[index].lng, 6);
    });
      let last = geohash.pop();
      geohash.splice(1,0,last);

    let uuid = uuidv5(geohash.join(), MY_NAMESPACE); // ⇨ '630eb68f-e0fa-5ecc-887a-7c7a62614681'

    var markers = [];
    var steps = [];
    var statsAPI = [];
    
    const urls = Array.from({length:orders.length}).map((element,index) => {
        let origin, destination;
        if(index === orders.length - 1){
        origin = orders[orders.length - 2];
        destination = orders[index];
        }else {
        origin = orders[index];
        destination = orders[index + 1];
        }
        let string = 'origin='+origin.lat+','+origin.lng+'&destination='+destination.lat+','+destination.lng+'&departure_time=now&key=AIzaSyCPhiV06uZ7rSLq2hOfeu_OXgVZ0PXVooQ';
        return 'https://maps.googleapis.com/maps/api/directions/json?' + string;
    });
    const thunk = (dispatch, getState) => {
        const requests = urls.map((url) => fetch(url));
        
            Promise.all(requests)
            .then((responses) => {
                const errors = responses.filter((response) => !response.ok);
                if (errors.length > 0) {
                throw errors.map((response) => Error(response.statusText));
                }

                const json = responses.map((response) => response.json());
                return Promise.all(json);
            })
            .then((data) => {
                data.forEach((directions,index, arr) => {
                    if(directions.routes[0].hasOwnProperty('legs')){
                        statsAPI.push({distanceAPI: directions.routes[0].legs[0].distance.value, durationAPI: directions.routes[0].legs[0].duration.value, duration_in_trafficAPI: directions.routes[0].legs[0].duration_in_traffic.value});
                      if(index === arr.length -1){
                        markers.push([directions.routes[0].legs[0].end_location.lat,directions.routes[0].legs[0].end_location.lng]);
                      } else {
                        markers.push([directions.routes[0].legs[0].start_location.lat,directions.routes[0].legs[0].start_location.lng]);
                      }
                      
                      // if driver can add waypoint in their apps for stopover and other things!
                        //  if(directions.routes[0].legs[0].hasOwnProperty('via_waypoint') && directions.routes[0].legs[0].via_waypoint.length > 0){
                        //    directions.routes[0].legs[0].via_waypoint.forEach(element=> {
                          //      markers.push([directions.routes[0].legs[0].steps[element.step_index].start_location.lat, directions.routes[0].legs[0].steps[element.step_index].start_location.lng]);          
                           // });
                        ///}
                
                        
                        if(index < arr.length -1 && directions.routes[0].legs[0].hasOwnProperty('steps') && directions.routes[0].legs[0].steps.length > 0)
                            directions.routes[0].legs[0].steps.forEach(element => {
                                steps.push([element.start_location.lat,element.start_location.lng]);
                                let decode = polyUtil.decode(element.polyline.points);
                                if(decode.length > 0 ){
                                    steps = steps.concat(decode);
                                }
                                steps.push([element.end_location.lat, element.end_location.lng]);
                            });
                        }
                });
                dispatch({
                    type: 'DirectionsPoint',
                    payload: {markers: markers,steps:steps, uuid: uuid, statsAPI: statsAPI},
                });
            })
            .catch((errors) => {
                errors.forEach((error) => console.error(error));
                
            dispatch(offlineActionCreators.fetchOfflineMode(thunk));
            });
    };
    
    thunk.interceptInOffline = true;

    thunk.meta = {
      retry: true,
      name: 'getDirectionsAPIWithTraffic',
      args: [orders],
    };
  return thunk;
};
export const setRouteStats = (markers,stats) => {
    
    let geohash = Array.from({length:markers.length}).map((num,index)=>{
        return Geohash.encode(markers[index][0], markers[index][1], 6);
    });
      let last = geohash.pop();
      geohash.splice(1,0,last);

    let uuid = uuidv5(geohash.join(), MY_NAMESPACE); // ⇨ '630eb68f-e0fa-5ecc-887a-7c7a62614681'
    const thunk = (dispatch, getState) => {
        dispatch({
            type: 'RouteStats',
            payload: {stats : stats ,uuid: uuid},
          });
    };
    thunk.meta = {
        retry: true,
        name: 'setRouteStats',
        args: [markers,stats],
      };
    return thunk;
}    
  