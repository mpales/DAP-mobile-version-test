// this gonna be a lot of functionality bridge within leaflet plugin
// and how map being rendering in react-native. 
// because the raster image is the same and most Road API
// had same data structure.
// and changes how interaction between google API
// leaflet toGeoJSON
// this for loop and irritate polygonal in spatial function
// lihat pada : https://leafletjs.com/reference-1.7.1.html#polyutil

import leaflet from 'leaflet';
import PolyUtils from 'leaflet-polyutils';
class Util {
    layerGroup = null;
    layers: any;
    markers = null;
    layerArray: any;
    constructor() {
        
    }
    setToPrune = () => {
        // prune the layer which not useable because re-ordering of route.
      this.layerGroup = 
    };
    translateToOrder = (markers,order) => {
            let markerLayer =   this.layerGroup.getLayer(this.layerGroup.getLayerId(markers));
            this.layerGroup.removeLayer(markerLayer);
            
            markerLayer = Array.from({length:markerLayer.length}).map((num,index)=>{
             return [markers[order[index]]];  
            });
            this.layerGroup.addLayer(markerLayer);      
    }; 
    setMarkers = (markers)=>{
        return Array.from({length:markers.length}).map((num,index)=>{
            return [leaflet.latLng(markers[index].location('leaflet'))]
        });
    }
    isMarkerLayered = (markers) => {
        return this.layerGroup.hasLayer(markers);
    };
    setLayerGroup = (items,markers) => {
        let prev = 0;
        let latlngs = [];
        this.layers = Array.from({length: items.length}).map((num,index)=> {
            
            let nLat = markers.findIndex(x => x.latitude === items[index].latitude);
            let nLng = markers.findIndex(x => x.longitude === items[index].longitude);
            if(nLat === nLng){
                let latlngs = items.slice(prev,index);
                markers[nLat] = leaflet.latLng(latlngs.shift());
                this.layerArray[nLat] = leaflet.polyline(markers[nLat],{color:'red'});  
                prev = index;
                let tempArray = Array.from({length: latlngs.length}).map((num, index) => {
                    let latLng = leaflet.latLng(latlngs[index]);
                    this.layerArray[nLat].addLatLng(latLng);
                    return [latLng];
                });
                return [tempArray];
            }
            return [items[index].lat, items[index].lng];
        });
        //split the item to layer group and update local variable 
        //this mean it also update the layer after re-ordering. 
        if(this.layers.length === markers.length) {

            this.layerGroup = leaflet.layerGroup(markers)
            .addLayer(this.layers);
    
        } else {
            this.layerGroup = leaflet.layerGroup(this.layers)
        }
        return this.layerGroup;
    };

}