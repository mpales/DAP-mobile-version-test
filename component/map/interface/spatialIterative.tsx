import L from './shim-leaflet';
import Location from './geoCoordinate';
import GEO from './geoConditional';
import { LatLng } from 'react-native-maps';
import { CRS } from 'leaflet';

import {v5 as uuidv5} from 'uuid';
import Geohash from 'latlon-geohash';

const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
// example : geo-fencing and recomended route using cluster algorithm

/**
 * Distance
 *
 * Calculate distance between two or multiple locations using Mathematic functions.
 * fork from github and port to javascript.
 * @author Dwinanto Saputra <dwinanto@grip-principle.com>
 * @author Jeroen Desloovere <info@jeroendesloovere.be>
 */

interface geoLocation {
  latitude: number,
  longitude: number,
}

interface staticCordinate {
  latitude: number,
  longitude: number,
  altitude?: number,
  lat :number,
  lng :number,
  alt? :number,
}
export default class Distance {
  geoLocation:undefined | geoLocation = undefined;// 0-5 is exist within marker key 1 | and marker key 0 will have one cordinate
  history : L.LatLng [] = [] ;
  static location: staticCordinate;
  static camera: any; // this are region in react-native-maps
  static view : L.LatLngBoundsExpression;  // this are road history viewed from current location

  constructor(Location:Location) {
    Distance.location = Location.location();
    Distance.view = L.latLngBounds([[Location.location().lat,Location.location().lng]]);
    this.camera.bind(this);
    this.checkDestination.bind(this);
    this.locator.bind(this);
    this.view_history.bind(this);
  }
  checkDestinationID(uuid: any, geoLocation?:geoLocation){

    if(geoLocation !== undefined) {
      return uuid === uuidv5( Geohash.encode(geoLocation.latitude,geoLocation.longitude, 6) +  Geohash.encode(Distance.location.latitude(),Distance.location.longitude(), 6), MY_NAMESPACE);
    } else {
      return null;
    }      
  }

  checkDestination(Location:Location){
    return Distance.location.lat === Location.latitude() && Distance.location.lng === Location.longitude();
  }

  locator = (geoLocation?:geoLocation): L.LatLngBounds => {
    if(geoLocation !== undefined){
      this.geoLocation = geoLocation;
      
      this.history.push(L.latLng(geoLocation.latitude, geoLocation.longitude))

      return  L.latLngBounds([[geoLocation.latitude,geoLocation.longitude]]).extend(Distance.view);
    
    } else if(this.geoLocation !== undefined){
      return L.latLngBounds([[this.geoLocation.latitude,this.geoLocation.longitude]]).extend(Distance.view);
    } else {
      return L.latLng(Distance.location.lat,Distance.location.lng).toBounds(2).extend(Distance.view);
    }
  };
  
  //region by total route
  static regionByRoute(ASPECT_RATIO:number, route? : L.LatLng[]){
    if(route !== undefined){
      
    let mobileBOX = L.polyline(route).getBounds().pad(0.2);
      
      //bottom left and bottom right region
      let bottomleft = mobileBOX.getSouthWest();
      let bottomright = mobileBOX.getSouthEast();
      let bound = bottomright.distanceTo(bottomleft);
      //increase scale
      if(bound < 20000){
        //for singapore only
       mobileBOX = mobileBOX.pad(1.2);
      }
    const lat = mobileBOX.getCenter().lat;
    const lng = mobileBOX.getCenter().lng;
    const northeastLat = mobileBOX.getNorthEast().lat;
    const southwestLat = mobileBOX.getSouthWest().lat
    const latDelta = northeastLat - southwestLat;
    const lngDelta = latDelta * ASPECT_RATIO;

    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    }
    }
    return false;
  }
      //--- find closest point from route within latest geolocation
      //--- trim route from latest geolocation to destination
      //--- check if trimmed route are same with current camera box rectangular (destination x geolocation)
      //--- if not the same option are boxer or using trim route to extend box
      // boxer optional are make routebox within 1km radius camera centroid to current geolocation

  camera(ASPECT_RATIO:number, POV?:geoLocation, route? : L.LatLng[], optional? :string) {
    let BOX = this.locator(POV);
    if(POV !== undefined) {
      let meter = L.latLng(POV.latitude,POV.longitude).distanceTo(L.latLng(Distance.location.lat,Distance.location.lng));
      BOX.extend(L.latLng(POV.latitude,POV.longitude).toBounds(meter));

    if(route !== undefined && route !== null){
      let route_polyline = L.polyline(route);
      let route_polytrim = L.polyTrim(route_polyline,L.PolyTrim.FROM_START);
      let closest = Distance.getClosest(POV?.latitude,POV?.longitude, route, 2, 'meter');
   
      if(closest !== undefined){
        route_polytrim.trim(Distance.latLngIndex(route,L.latLng(closest.lat,closest.lng)));
      }

      if(BOX.equals(route_polyline.getBounds()) !== true){

        if(optional === 'boxer'){
         let polystats = L.polyStats(route_polyline, {
            speedProfile: {
              method : L.PolyStats.REFSPEEDS,
              parameters : [ [-5, 1.2638], [3, 1.25], [2, 1.1111], [6, 0.9722] ]
            }
          })
          polystats.updateStatsFrom(0);
          //further trim the route 
          let distanceToKM = route_polyline.getLatLngs().find(o => o.dist > 1000);
          
          if(distanceToKM !== undefined){ 
            let boxer_polytrim = L.polyTrim(route_polyline,L.PolyTrim.FROM_END);
            boxer_polytrim.trim(boxer_polytrim.getPolySize() - distanceToKM.i)
            
            let boxes = L.RouteBoxer.box(route_polyline, 0.5); // within 500 meter route boxer
            for (var i = 0; i < boxes.length; i++) {
              if(boxes[i].contains(L.latLng(POV.latitude,POV.longitude))){
                BOX = boxes[i];
                break;
              }
            }
          }
            
        } else {
          BOX.extend(route_polyline.getBounds());
        }
      }
    }      
   }
    //adapt bound to mobile media 
    if(optional === 'bottom-pad') {
      //Expand the southern boundary (and the others) to the correct size
      //Get a center coordinate along the southern boundary
      //Expand boundary only by encompassing the southern coord
      let bottomleft = BOX.getSouthWest();
      let bottomright = BOX.getSouthEast();
      let bottomPadded = L.latLngBounds(bottomleft, bottomright).getCenter();
      let bound = bottomright.distanceTo(bottomleft);
      BOX.extend(bottomPadded.toBounds(bound * 1.4)); // 40% bottom padding for item card
    }

    const mobileBOX = BOX.pad(optional === 'bottom-pad' ? 0.2 : 1.2 );

   
    const lat = mobileBOX.getCenter().lat;
    const lng = mobileBOX.getCenter().lng;
    const northeastLat = mobileBOX.getNorthEast().lat;
    const southwestLat = mobileBOX.getSouthWest().lat
    const latDelta = northeastLat - southwestLat;
    const lngDelta = latDelta * ASPECT_RATIO;

    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    }
  }

 
  bound(ASPECT_RATIO:number, POV?:geoLocation, route? : L.LatLng[]) {
    let BOX = this.locator();
    if(POV !== undefined) {
      BOX.extend({lat:POV.latitude, lng:POV.longitude});
    if(route !== undefined && route !== null){
      let route_polyline = L.polyline(route);
      BOX.extend(route_polyline.getBounds());
    }      
   }
  

    const mobileBOX = BOX.pad( 0.2 );

   
    const lat = mobileBOX.getCenter().lat;
    const lng = mobileBOX.getCenter().lng;
    const northeastLat = mobileBOX.getNorthEast().lat;
    const southwestLat = mobileBOX.getSouthWest().lat
    const latDelta = northeastLat - southwestLat;
    const lngDelta = latDelta * ASPECT_RATIO;

    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    }
  }


  view_history() {
    let history_polyline = L.polyline(this.history);
    let history_geojson = L.layerGroup([history_polyline])
    if(this.geoLocation){
      let history_marker = L.marker(L.latLng(this.geoLocation.latitude,this.geoLocation.longitude));
      history_geojson.addLayer(history_marker);
    }

    return history_geojson.toGeoJSON();
  }

  snap_history(snapToRoad){
    const snapped: L.LatLng[] = [];

    this.history.forEach((element,index, arr) => {
      if(index <= arr.length){
        let obj = snapToRoad.find(o => o.originalIndex === index);     
        let key = snapToRoad.findIndex(o => o.originalIndex === index);  
        let nextobj = snapToRoad.find(o => o.originalIndex === index+1);  
        let nextkey = snapToRoad.findIndex(o => o.originalIndex === index+1);  
        
        if(L.latLngBounds(element,arr[index+1]).overlaps(L.latLngBounds([obj.location.latitude,obj.location.longitude],[nextobj.location.latitude,nextobj.location.longitude])) && L.latLngBounds(element,arr[index+1]).equals(L.latLngBounds([obj.location.latitude,obj.location.longitude],[nextobj.location.latitude,nextobj.location.longitude]))){
         snapped.push(element);
        } else {
          if(key === index && nextkey === index+1){
            snapped.push(L.latLng(obj.location.latitude,obj.location.longitude));
          } else {
            snapToRoad.slice(key,nextkey-1).forEach((child: { location: { latitude: number; longitude: number; }; }) => {
              snapped.push(L.latLng(child.location.latitude,child.location.longitude));   
            });
          }
        }
      } else {
        let obj = snapToRoad.find(o => o.originalIndex === index);     
        let key = snapToRoad.findIndex(o => o.originalIndex === index);  
        if(element.equals(L.latLng(obj.location.latitude,obj.location.longitude))){
          snapped.push(element);
        } else {
          snapped.push(L.latLng(obj.location.latitude,obj.location.longitude));
        }
      }

    });
  }


  public static latLngIndex(items : L.LatLng[], latLng : L.LatLng){
    return items.findIndex(o => latLng.equals(o))
  }
  /**
   * Get distance between two coordinates
   *
   * @return float
   * @param  decimal $latitude1
   * @param  decimal $longitude1
   * @param  decimal $latitude2
   * @param  decimal $longitude2
   * @param  int     $decimals[optional] The amount of decimals
   * @param  string  $unit[optional]
   */

  public static between(
    latitude1,
    longitude1,
    latitude2,
    longitude2,
    decimals,
    unit,
  ) {

    let base =L.latLng(latitude1,longitude1);

    return base.distanceTo(L.latLng(latitude2,longitude2))


  }

  /**
   * Get closest location from all locations
   *
   * @return array   The item which is the closest + 'distance' to it.
   * @param  decimal latitude1
   * @param  decimal longitude1
   * @param  array   items = [Location] array or object with numeric index key 
   * @param  int     decimals[optional] The amount of decimals
   * @param  string  unit[optional]
   */
  public static getClosest(latitude1, longitude1, items, decimals, unit) {
   // init result

   let dump: [] = [];
    
   items.forEach(element => {
     let latitude2 = element[0];
     let longitude2 = element[1];
     let distance = Distance.between(
       latitude1,
       longitude1,
       latitude2,
       longitude2,
       10,
       unit,
     );
     dump[distance.toFixed(0)] = {lat:element[0],lng:element[1],distance:distance};
   });
  
   let dump_filter = dump.filter(function( element ) {
      return element !== undefined;
    });
    return dump_filter.shift();
  }

  
  /**
   * Get closest location from all locations
   *
   * @return array   The item which is the closest + 'distance' to it.
   * @param  decimal latitude1
   * @param  decimal longitude1
   * @param  array   items = [Location] array or object with numeric index key 
   * @param  int     decimals[optional] The amount of decimals
   * @param  string  unit[optional]
   */
  public static getFurthest(latitude1, longitude1, items, decimals, unit) {
    // init result

    let dump: [] = [];
    
    items.forEach(element => {
      let latitude2 = element[0];
      let longitude2 = element[1];
      let distance = Distance.between(
        latitude1,
        longitude1,
        latitude2,
        longitude2,
        10,
        unit,
      );
      dump[distance.toFixed(0)] = {lat:element[0],lng:element[1],distance:distance};
    });
   
    
    return dump.pop();
  }
}


