//for conditional function and comparasion in geo related.
// we gonna use leaflet utils for this
import Location from './geoCoordinate';
import leaflet from 'leaflet';
import PolyUtils from 'leaflet-polyutils';

export default class Geo {
  items: null;
  _Location: Location;
  layerGroup: null;
  constructor() {
    this.getCenter.bind(this);
    this.setItem.bind(this);
  }
  setItem = (arr) => {
    if (this.items instanceof leaflet) {
      this.items.setLatLngs(arr);
    } else {
      if (this.items === null) {
        this.items = leaflet.polyline(arr, {color: 'red'});
      }
    }
  };
  getCenter = (LatLngs) => {
    this._Location = LatLngs;
    let curr = this._Location.location();
    if (this.items instanceof leaflet) {
      return this.items.getCenter();
    }
  };

  getToleranceRoute = (LatLng1, LatLng2) => {
    if (this.items instanceof leaflet) {
      let layer = L.latLng(LatLng1);

      var polystats = L.polyStats(this.items, {
        speedProfile: {
          method: L.PolyStats.POLYNOMIAL,
          parameters: [1.1, -0.1, -0.001],
        },
      });
      polystats.updateStatsFrom(0);

      var pts = this.items.getLatLngs();
      var lastpt = pts[pts.length - 1];
      //chrono is for computational distance time
      return lastpt.dist - layer.distanceTo(LatLng2);
    }
  };

  getChronoByDistance = (LatLng1, LatLng2) => {
    if (this.items instanceof leaflet) {
      var polystats = L.polyStats(this.items, {
        speedProfile: {
          method: L.PolyStats.POLYNOMIAL,
          parameters: [1.1, -0.1, -0.001],
        },
      });
      polystats.updateStatsFrom(0);

      var pts = this.items.getLatLngs();
      var lastpt = pts[pts.length - 1];
      //chrono is for computational distance time
      return lastpt.chrono;
    }
  };
}

