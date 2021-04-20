
export const setGeoLocation = (position) => {
  return dispatch => {
        dispatch({
            type: 'GeoLocation',
            payload: {position:position},
          });
      };    
}