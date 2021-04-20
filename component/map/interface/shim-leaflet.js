 /**
 * Created on Sat Apr 10 2021
 *
 * Shim Leaflet to and work with geo related condtional
 * usage L.polyline, L. Layer, and Leaflet non-DOM variable object
 * @return L instance
 * @throws ..
 * @todo bare implementation from leaflet-headless 
 * @author Dwinanto Saputra (dwinanto@grip-principle.com)
 */

global.window = {
    screen: {
      devicePixelRatio: 1
    }
  };
  global.document = {
    documentElement: {
      style: {}
    },
    getElementsByTagName: function() { return []; },
    createElement: function() { return {}; }
  };
  global.navigator = {
    userAgent: 'nodejs',
    platform: 'nodejs'
  };
const L = require('leaflet');
//const prune = require('leaflet-polyutils/src/leaflet.polyprune');
const stats = require('leaflet-polyutils/src/leaflet.polystats');
const trim = require('leaflet-polyutils/src/leaflet.polytrim');
var PolyPrune = L.Class.extend({

  statics: {
      /**
       * Pruning function
       * Removes points located less than a given distance from the track between its adjacent points.
       * Possible options:
       *  - tolerance: distance in meters (default is 5)
       *  - useAlt: use altitude to compute 3D distance (default is true)
       */
      prune : function(latlngs, options) {

          var tolerance = 5;
          var useAlt = true;
          if (options) {
            if (!isNaN(options.tolerance)) {
              tolerance = options.tolerance;
            }
            if (typeof(options.useAlt) == typeof(true)) {
              useAlt = options.useAlt;
            }
          }

          var initlen = latlngs.length; // initial number of points
          var pruned = [];

          /**
           * Returns the closest distance (2D) of a point to a segment defined by 2 points
           *
           * Adapted from Pieter Iserbyt & Paul Bourke http://paulbourke.net/geometry/pointlineplane/
           *
           * @param startLine  First point of the segment
           * @param endLine    Second point of the segment
           * @return The distance
           */
          function distanceFromLine(latlng, startLine, endLine) {

              var xDelta = endLine.lng - startLine.lng;
              var yDelta = endLine.lat - startLine.lat;
              // we need all points to have altitude to compute 3D distance
              var zDelta = !useAlt || isNaN(endLine.alt) ||
                isNaN(startLine.alt) || isNaN(latlng.alt) ?
                undefined : (endLine.alt - startLine.alt);
              var closestPoint;

              if ((xDelta === 0) && (yDelta === 0)) {
                  // startLine and endLine are the same point, return distance from this point
                  closestPoint = L.latLng(startLine.lat, startLine.lng);
                  if (!isNaN(zDelta)) {
                    closestPoint.alt = startLine.alt + zDelta / 2;
                  }
              }

              var u = ((latlng.lng - startLine.lng) * xDelta + (latlng.lat - startLine.lat) * yDelta) / (xDelta * xDelta + yDelta * yDelta);

              if (u < 0) {
                  closestPoint = startLine;
              } else if (u > 1) {
                  closestPoint = endLine;
              } else {
                  closestPoint = L.latLng(startLine.lat + u * yDelta, startLine.lng + u * xDelta);
                  if (!isNaN(zDelta)) {
                    closestPoint.alt = startLine.alt + u * zDelta;
                  }
              }

              var dist2d = latlng.distanceTo(closestPoint);
              var dist3d;
              if (!isNaN(zDelta)) {
                var zDeltaClosest = closestPoint.alt - latlng.alt;
                dist3d = Math.sqrt(Math.pow(dist2d,2) + Math.pow(zDeltaClosest,2));
              }

              // return 3D distance if it could be computed, otherwise 2D
              //console.log("2D: " + dist2d);
              //console.log("3D: " + dist3d);
              return isNaN(dist3d) ? dist2d : dist3d;
          }


          if (initlen > 2) { // no pruning required when 0, 1 or 2 points
              var mindeleted = initlen; // mindeleted tracks the smallest deleted point index

              // we always keep first point
              pruned.push(latlngs[0]);

              var ptmax = initlen - 1; // max point index
              var ptlast = 0; // mast inserted point index

              for (var i = 1; i < ptmax; i++) {

                  var prev = pruned[pruned.length - 1];
                  var next = latlngs[i + 1];

                  for (var j = i; j > ptlast; j--) {
                      var pt = latlngs[j];
                      var delta = distanceFromLine(pt, prev, next);
                      if (delta > tolerance) {
                          // removing i loses this pt, keep this trkpt[i]
                          latlngs[i].i = pruned.length;
                          ptlast = i;
                          pruned.push(latlngs[i]);
                          break;
                      }
                  }
                  // did we keep i?
                  if (ptlast != i) {
                      // discarded
                      mindeleted = Math.min(i, mindeleted);
                  }
              }

              // we always keep last point
              latlngs[initlen - 1].i = pruned.length;
              pruned.push(latlngs[latlngs.length - 1]);

              return pruned;
          } else {
              return latlngs;
          }

      }
  },

  initialize: function() {
  },
});

L.PolyPrune = PolyPrune;
L.polyPrune = function() {
  return new L.PolyPrune();
};
stats();
trim();
// export the combined object
module.exports = L;