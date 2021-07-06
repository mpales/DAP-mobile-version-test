import * as React from 'react';
import { StackActions, dis} from '@react-navigation/native';
import {Store,Dispatch} from 'redux';
import {postData} from './network';
/**
 * Created on Sun Jun 20 2021
 *
 * Persist login 
 *
 * check login status when persist already hydrated from storage
 * with action function to reset-login and loggedin 
 * use on configureStore
 * also helper function for react-navigation to switch when jwt is gone
 * use on NavigationContainer
 * 
 * @param key
 * @return dispatch
 * @throws null
 * @todo add hard-reset for cache, and jwtToken validity from backend
 * @author Dwinanto Saputra (dwinanto@grip-principle.com)
 */
  export async function checkLoginStatus(store: Store) : Promise<Dispatch> {
    const jwtToken = store.getState().originReducer.jwtToken || false;
    //let body = {
      //jwtToken: useAppSelector(state => state.originReducer.jwtToken),
     // fingerprint: useAppSelector(state => state.originReducer.deviceSignature),
    //};
    //const result = await postData('auth/relogin', body);
    if(jwtToken){
      return Promise.resolve(store.dispatch);
    } else {
      return Promise.reject(store.dispatch);
    }
  }

  export const loggedIn = () => ({
    type: 'loggedIn',
    payload: true,
  });
  export const resetLog = () => ({
    type: 'resetLogin',
  });


  export const isReadyRef = React.createRef();

  // current no object type for navigationRef inside react-navigation
  export const navigationRef = React.createRef();
  
  export function switchLogged(screenName: any,props: any){
    if (isReadyRef.current && navigationRef.current) {
      // Perform navigation if the app has mounted
      navigationRef.current?.dispatch(StackActions.replace(screenName,props));
    } else {
      // You can decide what to do if the app hasn't mounted
      // You can ignore this, or add these actions to a queue you can call later
    }
  }

   
  export function popToLogout(){
    if (isReadyRef.current && navigationRef.current) {
      // Perform navigation if the app has mounted
      navigationRef.current?.resetRoot({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      // You can decide what to do if the app hasn't mounted
      // You can ignore this, or add these actions to a queue you can call later
    }
  }