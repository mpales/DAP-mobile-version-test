import Location from './geoCoordinate';

import L from './shim-leaflet';
// might need loader

export default class Geo {
  items: L.Polyline | undefined;
  _Location: Location | undefined;
  layerGroup: null;
  constructor() {
    this.getCenter.bind(this);
    this.setItem.bind(this);
    this.setToPrune.bind(this)
    this.time2txt.bind(this);
    this.time2current.bind(this);
  }

  time2txt = (time) => {
    var strTime = "";
    if (time >= 3600) strTime += Math.floor(time / 3600) + "h";
    time %= 3600;
    if (time >= 60) strTime += Math.floor(time / 60) + "m";
    time %= 60;
    strTime += Math.round(time) + "s";
    return strTime
  }
  time2current = (time) => {
    let timeObject = new Date();
    let milliseconds = Math.round(time) * 1000 ;
    let date = new Date(timeObject.getTime() + milliseconds);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let mnt = minutes < 10 ? '0'+minutes : ''+minutes;
    var strTime = hours + ':' + mnt + ' ' + ampm;
    return strTime;
  }

  setItem = (arr) => {
    if (this.items instanceof L.Polyline) {
      console.log("setted",arr);
      this.items.setLatLngs(arr);
    } else {

        this.items = L.polyline(arr, {color: 'red'});
    }
    return this.items;
  };
  getCenter = (LatLngs) => {
    this._Location = LatLngs;
    let curr = this._Location.location();
    if (this.items instanceof L.Polyline) {
      return this.items.getCenter();
    }
  };
  setToPrune = (tolerance) =>{
    return L.PolyPrune.prune(this.items.getLatLngs(), { tolerance: tolerance, useAlt: false });
  }  
  getDistanceRoute = () => {
    if (this.items instanceof L.Polyline) {

      var polystats = L.polyStats(this.items, {
        speedProfile: {
          method: L.PolyStats.POLYNOMIAL,
          parameters: [9],
        },
      });
      polystats.updateStatsFrom(0);

      var pts = this.items.getLatLngs();
      var lastpt = pts[pts.length - 1];

      //chrono is for computational distance time
      return lastpt.dist;
    }
  };

  getChronoByDistance = () => {
    if (this.items instanceof L.Polyline) {
      var polystats = L.polyStats(this.items, {
        speedProfile: {
          method: L.PolyStats.POLYNOMIAL,
          parameters: [9],
        },
      });
      polystats.updateStatsFrom(0);
      var pts = this.items.getLatLngs();
      var lastpt = pts[pts.length - 1];
      //chrono is for computational distance time
      return {eta: this.time2txt(lastpt.chrono), hour: this.time2current(lastpt.chrono), chrono: lastpt.chrono};
    }
  };
}

