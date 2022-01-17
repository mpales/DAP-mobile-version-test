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

import '../../../../router/warehouse/inbound/itemDetails';
import {ConnectedProps, GetProps} from 'react-redux';
import { StackNavigationProp  } from '@react-navigation/stack';
import { RouteProp   } from '@react-navigation/native';

import { ComponentClass, Consumer, ConsumerProps, ContextType, Dispatch, ExoticComponent, Provider, ProviderExoticComponent, ProviderProps, SetStateAction } from 'react';

declare module '../../../../router/warehouse/inbound/itemDetails' {
    type StackParamList = {
        ItemReportDetail: ParamsToNavigate;
        ItemDetail: ParamsPage;
        Feed: ParamsToNavigate;
      };
    interface ParamsPage {
        dataCode : string
    }
    interface ParamsToNavigate {
        number : string
    }
    type itemDetailScreenRouteProp = RouteProp<StackParamList, 'ItemDetail'>;

    type itemDetailScreenNavigationProp = StackNavigationProp<
    StackParamList,
        'ItemDetail'
    >;
    //componentProps in getDerivedStateFromProps
    export interface OwnProps{
        navigation : itemDetailScreenNavigationProp
        route : itemDetailScreenRouteProp
    }
    //componentState in getDerivedStateFromProps
    export interface OwnState{
        sortBy: string;
        dataCode : string;
        dataActivities : Array<object>;
        totalReports: number;
        _itemDetail:  null  | keyableDetail,
    }
    interface keyableDetail {
        description: any;
        barcodes: any;
        uom: any;
        qty: any;
        product_class: number;
        basic: any;
        category: any;
        template: undefined | keyableTemplate ;
        item_code: any;
        pId : any;
        logs: Array<object>
    }
    interface keyableTemplate {
        attributes : Array<keyableAttribute>
    }
    interface keyableAttribute {
        name: string;
        values : Array<string>;
        field_type : string;
    }
    //Redux State in mapStateToProps
    export interface ReduxState {
        originReducer: any
    }
    // Connected State to Props from mapStateToProps
    export interface StateProps {
        manifestList: Array<keyableDetail>;
        currentASN: string;
    }  
    // Connected Action to Props from mapDispatchToProps
    export interface DispatchProps{
        setBottomBar: (toggle: boolean) => void;
    }
    // Action type in Redux-Dispatch 
    export interface ISetAppView {
        type: 'BottomBar';
        payload: boolean;
    }
    
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
    }
    
    // default augmentation for router view
    export default interface itemDetail <ConnectedComponent> {
        WrappedComponent : ReactView;
    } 
}
