//for coordinate definition and algorithm within geo function
// distance related function in static format and other.<?php

export default class Location {
  // We'll need another constant here,
  // when we'll start using GPS on Mars

  EARTH_RADIUS = 6371000;
  static latitude: any;
  static longitude: any;
  constructor(latitude, longitude) {
    // Taskrunners
    if (!Number.MAX_SAFE_INTEGER) {
      Number.MAX_SAFE_INTEGER = 9007199254740991; // Math.pow(2, 53) - 1;
    }
    Number.isSafeInteger =
      Number.isSafeInteger ||
      function (value) {
        return (
          Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER
        );
      };

    this.isFloat.bind(this);
    if (
      (!Number.isSafeInteger(latitude) && !this.isFloat(latitude)) ||
      (!Number.isSafeInteger(longitude) && !this.isFloat(longitude))
    ) {
      console.error('Expect input to be float number.');
    } else {
      Location.latitude = latitude;
      Location.longitude = longitude;
    }
    this.latitude.bind(this);
    this.longitude.bind(this);
    this.meters.bind(this);
  }

  location = (type) => {
    if (type === 'leaflet') {
      return {lat: Location.latitude(), lng: Location.longitude()};
    }
    if (type === 'google') {
      return {lat: Location.latitude(), lng: Location.longitude()};
    }
    return {latitude: Location.latitude(), longitude: Location.longitude()};
  };
  isFloat = (n: number) => {
    return Number(n) === n && n % 1 !== 0;
  };

  /**
   * @return float
   */
  latitude() {
    return (Location.latitude * Math.PI) / 180.0;
  }

  /**
   * @return float
   */
  longitude() {
    return (Location.longitude * Math.PI) / 180.0;
  }

  meters = (locationX: Location, locationY: Location, precision: number) => {
    let y = this.location.call(locationX);
    let x = this.location.call(locationY);
    let deltaLatitude = y.latitude - x.latitude;
    let deltaLongitude = y.longitude - x.longitude;

    let angle =
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(deltaLatitude * 0.5), 2) +
            Math.cos(x.latitude) *
              Math.cos(y.latitude) *
              Math.pow(Math.sin(deltaLongitude * 0.5), 2),
        ),
      ) * 2;

    return parseFloat((this.EARTH_RADIUS * angle).toPrecision(precision));
  };

  kilometers = (locationX: Location, locationY: Location, precision) => {
    return parseFloat(
      (this.meters(locationX, locationY, 0) * 0.001).toPrecision(precision),
    );
  };

  miles = (locationX: Location, locationY: Location, precision) => {
    return parseFloat(
      (this.meters(locationX, locationY, 0) * 0.000621371).toPrecision(
        precision,
      ),
    );
  };

  centimeters = (locationX: Location, locationY: Location, precision) => {
    return parseFloat(
      (this.meters(locationX, locationY, 0) * 100).toPrecision(precision),
    );
  };
  yardes = (locationX: Location, locationY: Location, precision) => {
    return parseFloat(
      (this.meters(locationX, locationY, 0) * 1.09361).toPrecision(precision),
    );
  };
  feet = (locationX: Location, locationY: Location, precision) => {
    return parseFloat(
      (this.meters(locationX, locationY, 0) * 3.28083).toPrecision(precision),
    );
  };
}
