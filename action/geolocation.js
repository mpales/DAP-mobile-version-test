
export const setGeoLocation = (position) => {
  return dispatch => {
        dispatch({
            type: 'GeoLocation',
            payload: {position:position},
          });
      };    
}
export const reverseGeoCoding = (coords) => {

  return dispatch => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+coords.latitude+','+coords.longitude+'&key=AIzaSyCPhiV06uZ7rSLq2hOfeu_OXgVZ0PXVooQ')
    .then(res => {
      if(res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json();
    })
    .then((geoCode) => {

      let postal_code = geoCode.results[0].address_components.findIndex(o => o.types[0] === 'postal_code');

      let currentPositionData = {
        address:  geoCode.results[0].formatted_address,
        coords: geoCode.results[0].geometry.location,
        location_type: geoCode.results[0].geometry.location_type,
        type: geoCode.results[0].types,
        postal_code: postal_code >= 0 ? geoCode.results[0].address_components[postal_code].short_name : null,
      }
      

      dispatch({
        type: 'CurrentPositionData',
        payload: currentPositionData,
      })

    })
    .catch((errors) => {
      errors.forEach((error) => console.error(error));
    })
  }; 

}