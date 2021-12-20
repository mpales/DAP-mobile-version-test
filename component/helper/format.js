import {duration} from 'moment';

export default class Format {
  // convert from meter to km
  static calculateDistance = (value) => {
    if (!value || value === null) return '-';
    let km = value / 1000;
    return km.toFixed(1);
  };

  // format for list card item ETA
  static formatETATime = (durationAPI, minutesDp) => {
    if (!durationAPI || durationAPI === null) return '-';
    let latestTime = durationAPI + minutesDp * 60;
    var hrs = ~~(latestTime / 3600);
    var mins = ~~((latestTime % 3600) / 60);

    var ret = '';
    if (hrs > 0) {
      ret += '' + hrs + ' hour ' + (mins < 10 ? '0' : '');
    }
    ret += '' + mins + ' minute';
    return ret;
  };

  // format ETA with current time
  static ETATime2Current = (durationAPI, minutesDp) => {
    if (!durationAPI || durationAPI === null) return '-';
    let time = durationAPI + minutesDp * 60;
    let timeObject = new Date();
    let milliseconds = Math.round(time) * 1000;
    let date = new Date(timeObject.getTime() + milliseconds);
    let strTime = time2Current(date);
    return strTime;
  };

  // format date and time
  static formatDateTime = (date) => {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = ('' + newDate.getFullYear()).substr(2);
    let time = time2Current(newDate);
    return `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year} ${time}`;
  };

  // format date and time
  static formatDate = (date) => {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = ('' + newDate.getFullYear()).substr(2);
    return `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year}`;
  };
}

const time2Current = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'P.M' : 'A.M';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let mnt = minutes < 10 ? '0' + minutes : '' + minutes;
  var strTime = hours + ':' + mnt + ' ' + ampm;
  return strTime;
};
