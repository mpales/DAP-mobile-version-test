// this gonna be a lot of functionality bridge within leaflet plugin
// and how map being rendering in react-native. 
// because the raster image is the same and most Road API
// had same data structure.
// and changes how interaction between google API
// leaflet toGeoJSON
// this for loop and irritate polygonal in spatial function
// lihat pada : https://leafletjs.com/reference-1.7.1.html#polyutil

import L from './shim-leaflet';
import Geo from './geoConditional';
import { cos } from 'react-native-reanimated';

interface geoLocation {
    lat: number,
    lng: number,
    timestamp: number,
}
export default class Util {
    layerGroup: undefined | L.LayerGroup;
    layers: any; // 1-5 route exist with coresponding items 1 | and items 0 will have 0 route cordinate 
    markers:any[] = [];
    layerArray: any[] = []; 
    geoLocation:undefined | geoLocation = undefined;// 0-5 is exist within marker key 1 | and marker key 0 will have one cordinate
    constructor() {        
     //   this.setLayerGroup.bind(this);
    }
    setToGeoJSON = () => {
        // prune the layer which not useable because re-ordering of route.
      return this.layerGroup.toGeoJSON()
    };
    setGeoLocation = (geoLocation) => {
        this.geoLocation = geoLocation;
        return this.geoLocation;
    }
    compareLatLngs = (order,reorder) => {
        order = this.setLatLng(order);
        reorder = this.setLatLng(reorder);
        return Array.from({length:order.length}).map((num, index)=>{
            if(order[index].equals(reorder[index]))
            return reorder[index];
        }).length === order.length;
    };
    //orders = {1:coordinate, 2: coordinate, 3: coordinate}
    translateToStats = (orders) => {       
        var tempArray: any[][] = [];
        var stats: any[] = [];
        
        orders.forEach((element,index, array) => {
            var latLngToBeFound = L.latLng(element);
            let test = this.setLatLng(orders).findIndex(x => x.equals( this.markers[this.markers.length - 1].getLatLng()));
           
            let next = index < array.length - 1 ? index + 1 : test;
           
            var latLngNextToBeFound = L.latLng(orders[next]);
            var saved = false;
            var double = false;
            tempArray[index] = [];
            this.layerArray.forEach((layer,i,arr) => {
                let latLng = layer.getLatLngs();
                var leg: any[] = [];
                latLng.forEach((element,index) => {
                    if(latLngToBeFound.equals(element) || latLngNextToBeFound.equals(element)){
                    leg.push(index);
                    } 
                });

                let segment = leg.length > 1 ? false : true ;

                saved = segment && !saved ? true : !segment && saved ? true : false;

                if(leg.length > 1){
                    tempArray[index] = layer;
                } else if((segment || saved) && Array.isArray(tempArray[index])){
                    //non double saved delete the array
                    tempArray[index].push(layer);
                    if(segment && !saved)
                    double = true;
                }
            });
            if(!double && Array.isArray(tempArray[index]))
            delete tempArray[index];
        });
        
        let layer: any[] = [];
        tempArray.forEach((layers,index) => {
            //segment
            layer = [];
            if(Array.isArray(layers)){
                layers.forEach(element => {
                    layer.push(...element.getLatLngs());
                });
            } else {
            layer.push(...layers.getLatLngs());
            }   
            
            if(this.geoLocation){
                layer.splice(0,0,[this.geoLocation.lat,this.geoLocation.lng]);
            }

            let GEO = new Geo;
            let items = GEO.setItem(layer);
            let distance = GEO.getDistanceRoute();
            let chrono = GEO.getChronoByDistance();
         
            stats[index] = {key: index,dist: distance, chrono: chrono.chrono ,distance:Math.round(distance/1000),eta:chrono.eta,hour:chrono.hour, current: layer[0].lat +","+ layer[0].lng, to: layer[layer.length -1].lat + ","+ layer[layer.length -1].lng};
        });
        return stats;
    }; 
    setMarkers = (markers)=>{
        this.markers = Array.from({length:markers.length}).map((num,index)=>{

            if(markers[index] instanceof L.LatLng)
            return L.marker(markers[index]);

            return L.marker(L.latLng(markers[index]));
        });
        return this.markers;
    }
    setLatLng = (LatLng) => {
        return Array.from({length:LatLng.length}).map((num,index)=>{

            if(LatLng[index] instanceof L.LatLng)
            return LatLng[index];

            return L.latLng(LatLng[index]);
        });
    }
    isMarkerLayered = (marker) => {
        return this.layerGroup.hasLayer(marker);
    };
    setLayerStats = (items,markers) => {
        var prev = 0;
        var latlngs = [];
        var multipolygon = false;

        markers = this.setLatLng(markers);
        this.layers = Array.from({length: items.length}).map((num,index)=> {
            

        var mark = markers.findIndex(x => x.equals(items[index]));
                if(mark >= 0){
                    let next = index > 0 ? index+1 : 1;
    
                    var latlngs = items.slice(prev,next);
                    //update markers and add first dot in polyline
                    if(this.layerArray[mark] !== undefined){
                        // this will fail in intersection within marker
                        let prevLayer = this.layerArray[mark].getLatLngs();
                        prevLayer.push(...latlngs)
                        this.layerArray[mark] = L.polyline(this.setLatLng(prevLayer),{color:'red'});
                    } else {
                        this.layerArray[mark] = L.polyline(this.setLatLng(latlngs),{color:'red'});  
                    }
                    //udate prev
                    prev = index;
                    //return [this.layerArray[nLat]];
                }
                return L.latLng(items[index]);
        });

        this.layerGroup = L.layerGroup(this.setMarkers(markers)).addLayer(L.polyline(this.layers,{color:'blue'}));
        
        return this.layerGroup;
    };
    setLayersGroup = (items,markers) => {

    return L.layerGroup(this.setMarkers(markers)).addLayer(L.polyline(this.setLatLng(items),{color:'blue'}));
    };
    
}