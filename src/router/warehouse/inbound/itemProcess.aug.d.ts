/**
 * Created on Monday January 17 2022
 *
 * ambient for component View itemDetails
 * 
 * Usecase for inbound router template augmentation 
 * written in typescript.
 *
 * @param ..
 * @return ..
 * @throws ..
 * @todo ..
 * @author Dwinanto Saputra (dwinanto@grip-principle.com)
 */

import '../../../../router/warehouse/inbound/itemProcess';
import {ConnectedProps, GetProps} from 'react-redux';
import { StackNavigationProp  } from '@react-navigation/stack';
import { RouteProp   } from '@react-navigation/native';
import React,{ ConsumerProps, ComponentType, Dispatch, ExoticComponent, Provider, ProviderExoticComponent, ProviderProps, SetStateAction, Component } from 'react';

declare module '../../../../router/warehouse/inbound/itemProcess' {
    type StackParamList = {
        POSMPhoto: ParamsToNavigate;
        ManualInput: ParamsToNavigate;
        ItemProcess : ParamsPage;
        ReportManifest: ParamsToNavigate;
        Manifest : ParamsToNavigate;
      };
    interface ParamsPage {
        inputCode : string,
        upload? : boolean,
    }
    interface ParamsToNavigate {
        dataCode?: string
        upload?: boolean;
    }
    type ItemProcessScreenRouteProp = RouteProp<StackParamList, 'ItemProcess'>;

    type ItemProcessScreenNavigationProp = StackNavigationProp<
    StackParamList,
        'ItemProcess'
    >;
    //componentProps in getDerivedStateFromProps
    export interface OwnProps{
        navigation : ItemProcessScreenNavigationProp
        route : ItemProcessScreenRouteProp
    }
    //componentState in getDerivedStateFromProps
    export interface OwnState{
        dataCode: string;
        qty:  string;
        scanItem: string;
        dataItem: null | keyableDetail;
        multipleSKU: boolean;
        indexItem: null | number;
        ItemGrade: null | string;
        ItemPallet: null | string;
        ItemPalletNo : null | string;
        PalletArray: null | Array<keyablePallet>;
        currentPOSM: boolean;
        enterAttr: boolean;
        batchNo: null | string;
        attrData: Array<object>;
        errorAttr: string;
        isPOSM: boolean;
        isConfirm: boolean;
        uploadPOSM: boolean;
        filterMultipleSKU: null;
        ISODateProductionString: null | Date | string;
        ISODateExpiryString: null | Date | string;
      
    }

    interface keyableDetail {
      [key:string] : any;
      barcodes: Array<keyableBarcode>;
      is_transit : number;
      template: undefined | keyableTemplate ;
      description: any;
      uom: any;
      qty: any;
      product_class: number;
      basic: any;
      category: any;
    }
    interface keyableTemplate {
        attributes : Array<keyableAttribute>
    }
    interface keyableAttribute {
        name: string;
        values? : Array<string>;
        field_type : string;
        required : number;
        interval? : string; 
        lowest? : string;
        highest? : string;
    }
    interface keyableBarcode {
        code_number : string;
    }
    interface keyablePallet {
        palete_id : string;
        pallet_no : string;
    }
    interface keyableAttribute {
        name: string;
        values? : Array<string>;
        field_type : string;
    }

    //Redux State in mapStateToProps
    export interface ReduxState {
        originReducer: any
    }
    // Connected State to Props from mapStateToProps
    export interface StateProps {
        ManifestCompleted: Array<object>;
        detectBarcode : boolean;
        barcodeScanned : Array<string>;
        manifestList : Array <keyableDetail>
        keyStack : string;
        POSMPostpone: Array <string>;
        ManifestType : number;
        currentASN: string;
    }  
  
    // Connected Action to Props from mapDispatchToProps
    export interface DispatchProps{
        setBottomBar: (toggle: boolean) => void;
        dispatchCompleteManifest : (bool : boolean) => void;
        setBarcodeScanner : (toggle : boolean) => void;
        setItemScanned : (item: string) => void;
        setItemGrade : (grade:string) => void;
        setItemError : (error:string)=> void;
        addPOSMPostpone : (uri:string | null)=> void;
    }
    // Action type in Redux-Dispatch 
    export interface ISetAppView {
        type: string;
        payload: boolean;
    }

    export interface ISetAppItem {
        type: string;
        payload: string;
    }

    export interface ISetReduxItem {
        type: string;
        payload: object | null;
    }
    type DispatchAllAssets = (arg: boolean) => (ISetAppView);
    // Component Context type
    interface Context {
        Provider: Provider<ProviderExoticComponent<ProviderProps<ContextProps>>> | never;
        Consumer: ExoticComponent<ConsumerProps<ContextProps>> | never;
      }
      
    //upstream usage - neccesary when implement custom template
    export interface ContextProps {
        currentTypeMedia : "photo" | "video" | "auto";
        setMediaType : Dispatch<SetStateAction<"auto" | "photo" | "video">>;
    }

    // static function from WrappedComponent - redux
    interface ReactView {
        getDerivedStateFromProps : (props: StateProps & DispatchProps & OwnProps, state: OwnState) => OwnState
        contextType?:React.ContextType<Context | any>
        prototype: inheritInit;
    }
   
    interface inheritInit {
    navigateSeeReport: (test:any,asd:any) => void;
    renderHeader : () => JSX.Element; 
   }
    // default augmentation for router view
    export default interface itemDetail <ConnectedComponent> {
        WrappedComponent :ReactView;
    } 
}
