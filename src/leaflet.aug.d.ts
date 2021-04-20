/**
 * Created on Sat Apr 10 2021
 *
 * <reference path="<path-to-typings-dir>/leaflet/index.d.ts" />
 *
 * ambient for polyutil
 *
 * @param ..
 * @return ..
 * @throws ..
 * @todo ..
 * @author Dwinanto Saputra (dwinanto@grip-principle.com)
 */

import 'leaflet';

declare module 'leaflet' {
    interface optionsPrune {
        tolerance: number|undefined,
        useAlt: boolean,
    }
    interface optionsStats {
        chrono? : boolean,
        speedProfile: any,
        onUpdate? :any,
        minspeed?: number,
    }
    interface objectStats {
        minalt :number,
        maxalt :number,
        climbing : number,
        descent : number,
    }
    export class PolyPrune {
  
      customField: string;
  
      static prune(polyline: L.LatLng[] | L.LatLng[][] | L.LatLng[][][], options: optionsPrune): L.LatLng[] | L.LatLng[][] | L.LatLng[][][];
    }
    export interface PolyTrim {
        FROM_START: L.Direction;
        FROM_END: L.Direction;
    }
    export function polyTrim(polyline: L.Polyline, direction:L.Direction): PolyTrim;
    export class Polytrim {
        trim(n:number): void;
        getDirection():PolyTrim;
        getPolySize():void;
    }
    export function polyStats(polyline : L.Polyline,options:optionsStats) :PolyStats 
    export class PolyStats {
        static REFSPEEDS: any;
        static LINEAR: any;
        static POWER: any;
        static POLYNOMIAL: any;
        setSpeedProfile(speedprofile: any) : void;
        updateStatsFrom(i:number): void;
        computeSpeedProfileFromTrack(geojson : L.GeoJSON, method: any, iterations: any, pruning: any, polydeg: any, threshold: any): void;
        computeSpeedProfileFromSpeeds(refspeeds: any, method: any, iterations: any, pruning: any, polydeg: any, threshold: any): void;
    }
    export interface LatLng extends Array< LatLng> {
        i : number,
        dist : number,
        chrono :number,
        chrono_rt: number,
    }
    export interface Polyline {
        stats: objectStats;
    }
}
  