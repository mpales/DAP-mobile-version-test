
export const setDataOrder = (data) => {
  const thunk = (dispatch, getState) => {
    dispatch({
        type: 'RouteData',
        payload: data,
      });
  };  
  thunk.interceptInOffline = true;

  thunk.meta = {
    retry: true,
    name: 'setDataOrder',
    args: [data],
  };
return thunk;
};