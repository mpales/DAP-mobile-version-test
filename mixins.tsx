import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import { makeObservable, action, observable, computed, comparer, reaction, runInAction} from 'mobx';

import AsyncStorage from '@react-native-community/async-storage';
import {makePersistable, getPersistedStore} from 'mobx-persist-store';
const screen = Dimensions.get('window');

class ThemeStore {
  @observable _Scheme1 = '';
  @observable _Scheme2 = '';
  @observable _Scheme3 = '';
  @observable _Scheme4 = '';
  @observable _Scheme5 = '';
  @observable _Scheme6 = '';
  @observable _Scheme7 = '';
  @observable _Scheme8 = '';
  @observable fontName = 'Poppins';
  @observable theme = 'light'; // count is now persistent.

  constructor() {
    makeObservable(this);
    makePersistable(this, { name: 'themePersistor', properties: ['fontName','theme'], storage: AsyncStorage, debugMode:false }).then(
    action((hydratedStore)=>{
      this.setDefaultThemes(hydratedStore.target.theme);
    })
    );
  }

  @action.bound
  setDefaultfontName(fontName:string){
    this.fontName = fontName;
  }
  @action.bound
  setDefaultThemes(theme:string){
    this.theme = theme;
    runInAction(() => {
      if(theme === 'light'){
        this._Scheme1 = '#F07120';
        this._Scheme2 = '#121C78';
        this._Scheme3 = '#424141';
        this._Scheme4 = '#6C6B6B';
        this._Scheme5 = '#FFFFFF';
        this._Scheme6 = '#121C78';
        this._Scheme7 = '#000000';
        this._Scheme8 = '#FFFFFF';
      } else {
        this._Scheme1 = '#F07120';
        this._Scheme2 = '#121C78';
        this._Scheme3 = '#FFFFFF';
        this._Scheme4 = '#EFEFEF';
        this._Scheme5 = '#424141';
        this._Scheme6 = '#EFEFEF';
        this._Scheme7 = '#EFEFEF';
        this._Scheme8 = '#6C6B6B';
      }
    })
  }

  @computed({equals:comparer.structural,keepAlive:true}) 
  get styleSheet() {
    const _font = this.fontName;
    return StyleSheet.create({
      bgButtonPrimary: {
        backgroundColor: '#F07120',
      },
      h1: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: 48,
        letterSpacing: 0.2,
      },
      h2: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 48,
        letterSpacing: 0.2,
      },
      h3: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 24,
        lineHeight: 48,
        letterSpacing: 0.2,
      },
      h4: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 36,
        letterSpacing: 0.2,
      },
      h5: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 36,
        letterSpacing: 0.2,
      },
      h6: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18,
        lineHeight: 36,
        letterSpacing: 0.2,
      },
      subtitle1: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 28,
        letterSpacing: 0.2,
      },
      subtitle2: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 28,
        letterSpacing: 0.2,
      },
      subtitle3: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 28,
        letterSpacing: 0.2,
      },
      body1: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 28,
        letterSpacing: 0.2,
      },
      body2: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 12,
        lineHeight: 24,
        letterSpacing: 0.2,
      },
      body3: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 24,
        letterSpacing: 0.2,
      },
      small1: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 12,
        lineHeight: 24,
        letterSpacing: 0.2,
      },
      small2: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 10,
        lineHeight: 20,
        letterSpacing: 0.2,
      },
      small3: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 10,
        lineHeight: 20,
        letterSpacing: 0.2,
      },
      button: {
        fontFamily: _font,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        lineHeight: 20,
        letterSpacing: 0.2,
      },
      verticalBarExpand: {
        width: screen.width * 0.6,
      },
      verticalBarPadding: {
        paddingVertical: 32,
      },
      verticalBarMargin: {
        marginHorizontal: 20,
        marginVertical: 0,
      },
      verticalBarExpandText: {
        marginHorizontal: 20,
        marginVertical: 11,
      },
      verticalBarExpandIcon: {
        marginHorizontal: 20,
      },
      lineInputDefaultContainer: {
        borderBottomWidth: 2,
        marginVertical: 8,
        borderBottomColor: '#ABABAB',
      },
      lineInputDefaultStyle: {
        marginVertical: 0,
        paddingVertical: 0,
        marginHorizontal: 9,
        color: '#ABABAB',
      },
      lineInputDefaultLabel: {
        padding: 0,
        margin: 0,
        color: '#000000',
      },
      lineInputDefaultLeftIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputDefaultRightIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputFocusedContainer: {
        borderBottomWidth: 2,
        borderBottomColor: '#F07120',
        marginVertical: 8,
      },
      lineInputFocusedStyle: {
        marginVertical: 0,
        paddingVertical: 0,
        marginHorizontal: 9,
        color: '#D5D5D5',
      },
      lineInputFocusedLabel: {
        padding: 0,
        margin: 0,
        color: '#F07120',
      },
      lineInputFocusedLeftIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputFocusedRightIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputFilledContainer: {
        borderBottomWidth: 2,
        borderBottomColor: '#6C6B6B',
        marginVertical: 8,
      },
      lineInputFilledStyle: {
        marginVertical: 0,
        paddingVertical: 0,
        marginHorizontal: 9,
        color: '#6C6B6B',
      },
      lineInputFilledLabel: {
        padding: 0,
        margin: 0,
        color: '#6C6B6B',
      },
      lineInputFilledLeftIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputFilledRightIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputErrorContainer: {
        borderBottomWidth: 2,
        borderBottomColor: '#E03B3B',
        marginVertical: 8,
      },
      lineInputErrorStyle: {
        marginVertical: 0,
        paddingVertical: 0,
        marginHorizontal: 9,
        color: '#6C6B6B',
      },
      lineInputErrorLabel: {
        padding: 0,
        margin: 0,
        color: '#E03B3B',
      },
      lineInputErrorLeftIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputErrorRightIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputDisabledContainer: {
        borderBottomWidth: 2,
        borderBottomColor: '#D5D5D5',
        marginVertical: 8,
      },
      lineInputDisabledStyle: {
        marginVertical: 0,
        paddingVertical: 0,
    
        marginHorizontal: 9,
        color: '#D5D5D5',
      },
      lineInputDisabledLabel: {
        padding: 0,
        margin: 0,
        color: '#D5D5D5',
      },
      lineInputDisabledLeftIcon: {
        padding: 0,
        margin: 0,
      },
      lineInputDisabledRightIcon: {
        padding: 0,
        margin: 0,
      },
    
      containedInputDefaultContainer: {
        borderWidth: 1,
        borderColor: '#414993',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 9,
      },
      containedInputDefaultStyle: {
        marginVertical: 0,
        paddingVertical: 0,
        marginHorizontal: 9,
        color: '#ABABAB',
      },
      containedInputDefaultLabel: {
        padding: 0,
        margin: 0,
        color: '#000000',
      },
      containedInputDefaultLeftIcon: {
        padding: 0,
        margin: 0,
      },
      containedInputDefaultRightIcon: {
        padding: 0,
        margin: 0,
      },
    
      containedInputFocusedContainer: {
        borderWidth: 1,
        borderColor: '#414993',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 9,
      },
      containedInputFocusedStyle: {
        marginVertical: 0,
        paddingVertical: 0,
    
        marginHorizontal: 9,
        color: '#000000',
      },
      containedInputFocusedLabel: {
        padding: 0,
        margin: 0,
        color: '#000000',
      },
      containedInputFocusedLeftIcon: {
        padding: 0,
        margin: 0,
      },
      containedInputFocusedRightIcon: {
        padding: 0,
        margin: 0,
      },
    
      containedInputFilledContainer: {
        borderWidth: 1,
        borderColor: '#414993',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 9,
      },
      containedInputFilledStyle: {
        paddingVertical: 0,
        marginVertical: 0,
        marginHorizontal: 9,
        color: '#000000',
      },
      containedInputFilledLabel: {
        padding: 0,
        margin: 0,
        color: '#000000',
      },
      containedInputFilledLeftIcon: {
        padding: 0,
        margin: 0,
      },
      containedInputFilledRightIcon: {
        padding: 0,
        margin: 0,
      },
    
      containedInputErrorContainer: {
        borderWidth: 1,
        borderColor: '#414993',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 9,
      },
      containedInputErrorStyle: {
        marginVertical: 0,
        paddingVertical: 0,
    
        marginHorizontal: 9,
        color: '#6C6B6B',
      },
      containedInputErrorLabel: {
        padding: 0,
        margin: 0,
        color: '#000000',
      },
      containedInputErrorLeftIcon: {
        padding: 0,
        margin: 0,
      },
      containedInputErrorRightIcon: {
        padding: 0,
        margin: 0,
      },
    
      containedInputDisabledContainer: {
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 9,
        backgroundColor: '#F5F5FB',
      },
      containedInputDisabledStyle: {
        marginVertical: 0,
        paddingVertical: 0,
        marginHorizontal: 9,
        color: '#D5D5D5',
        backgroundColor: 'transparent',
      },
      containedInputDisabledLabel: {
        padding: 0,
        margin: 0,
        color: '#D5D5D5',
      },
      containedInputDisabledLeftIcon: {
        padding: 0,
        margin: 0,
      },
      containedInputDisabledRightIcon: {
        padding: 0,
        margin: 0,
      },
    
      rectDefaultButtonContainerStyle: {
        borderRadius: 5,
      },
      rectDefaultButtonStyle: {
        backgroundColor: '#F07120',
      },
      rectDefaultButtonIconStyle: {
        marginRight: 8,
      },
      rectDefaultButtonTitleStyle: {
        color: '#FFFFFF',
      },
    
      rectDisabledButtonContainerStyle: {
        borderRadius: 5,
      },
      rectDisabledButtonStyle: {
        backgroundColor: '#E7E8F2',
      },
      rectDisabledButtonIconStyle: {
        marginRight: 8,
      },
      rectDisabledButtonTitleStyle: {
        color: '#FFFFFF',
      },
    
      rectOutlineDefaultButtonContainerStyle: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D5D5D5',
      },
      rectOutlineDefaultButtonStyle: {
        backgroundColor: 'transparent',
      },
      rectOutlineDefaultButtonIconStyle: {
        marginRight: 8,
      },
      rectOutlineDefaultButtonTitleStyle: {
        color: '#4E4E4E',
      },
    
      rectOutlineDisabledButtonContainerStyle: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D5D5D5',
      },
      rectOutlineDisabledButtonStyle: {
        backgroundColor: 'transparent',
      },
      rectOutlineDisabledButtonIconStyle: {
        marginRight: 8,
      },
      rectOutlineDisabledButtonTitleStyle: {
        color: '#D5D5D5',
      },
    
      roundDefaultButtonContainerStyle: {
        borderRadius: 10,
      },
      roundDefaultButtonStyle: {
        backgroundColor: '#F07120',
      },
      roundDefaultButtonIconStyle: {
        marginRight: 8,
      },
      roundDefaultButtonTitleStyle: {
        color: '#FFFFFF',
      },
    
      roundDisabledButtonContainerStyle: {
        borderRadius: 5,
      },
      roundDisabledButtonStyle: {
        backgroundColor: '#E7E8F2',
      },
      roundDisabledButtonIconStyle: {
        marginRight: 8,
      },
      roundDisabledButtonTitleStyle: {
        color: '#FFFFFF',
      },
    
      roundOutlineDefaultButtonContainerStyle: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D5D5D5',
      },
      roundOutlineDefaultButtonStyle: {
        backgroundColor: 'transparent',
      },
      roundOutlineDefaultButtonIconStyle: {
        marginRight: 8,
      },
      roundOutlineDefaultButtonTitleStyle: {
        color: '#4E4E4E',
      },
    
      roundOutlineDisabledButtonContainerStyle: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D5D5D5',
      },
      roundOutlineDisabledButtonStyle: {
        backgroundColor: 'transparent',
      },
      roundOutlineDisabledButtonIconStyle: {
        marginRight: 8,
      },
      roundOutlineDisabledButtonTitleStyle: {
        color: '#D5D5D5',
      },
    
      //use avatar for this classes
      buttonAvatarDefaultIconStyle: {
        alignItems: 'center',
        paddingTop: 18,
        paddingBottom: 21,
      },
      buttonAvatarDefaultOverlayStyle: {
        backgroundColor: '#F07120',
        flex: 2,
        borderRadius: 5,
      },
      buttonAvatarDefaultContainerStyle: {
        alignSelf: 'center',
      },
    
      buttonAvatarDisabledIconStyle: {
        alignItems: 'center',
        paddingTop: 18,
        paddingBottom: 21,
      },
      buttonAvatarDisabledOverlayStyle: {
        backgroundColor: '#E7E8F2',
        flex: 2,
        borderRadius: 5,
      },
      buttonAvatarDisabledContainerStyle: {
        alignSelf: 'center',
      },
    
      buttonFloatedAvatarDefaultIconStyle: {
        alignItems: 'center',
        paddingTop: 18,
        paddingBottom: 13,
      },
      buttonFloatedAvatarDefaultOverlayStyle: {
        backgroundColor: '#FFFFFF',
        flex: 2,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    
        elevation: 3,
      },
      buttonFloatedAvatarDefaultContainerStyle: {
        alignSelf: 'center',
      },
    
      buttonFloatedAvatarDefaultPlaceholderStyle: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
      },
      buttonFloatedAvatarDefaultTitleStyle: {
        color: '#121C78',
      },
    
      buttonFloatedAvatarHoverIconStyle: {
        alignItems: 'center',
        paddingTop: 18,
        paddingBottom: 13,
      },
      buttonFloatedAvatarHoverOverlayStyle: {
        backgroundColor: '#2A3386',
        flex: 2,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    
        elevation: 3,
      },
      buttonFloatedAvatarHoverContainerStyle: {
        alignSelf: 'center',
      },
    
      buttonFloatedAvatarHoverPlaceholderStyle: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
      },
    
      buttonFloatedAvatarHoverTitleStyle: {
        color: '#FFFFFF',
      },
    
      buttonFloatedAvatarDisabledIconStyle: {
        alignItems: 'center',
        paddingTop: 18,
        paddingBottom: 13,
      },
      buttonFloatedAvatarDisabledOverlayStyle: {
        backgroundColor: '#FFFFFF',
        flex: 2,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    
        elevation: 3,
      },
      buttonFloatedAvatarDisabledContainerStyle: {
        alignSelf: 'center',
      },
    
      buttonFloatedAvatarDisabledPlaceholderStyle: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
      },
    
      buttonFloatedAvatarDisabledTitleStyle: {
        color: '#F5F5FB',
      },
    
      buttonGroupContainerStyle: {
        borderRadius: 10,
        borderColor: '#ABABAB',
      },
      buttonGroupInnerBorderStyle: {
        borderColor: '#ABABAB',
      },
      buttonGroupButtonStyle: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
      },
      buttonGroupSelectedStyle: {
        backgroundColor: '#F07120',
        color: '#FFFFFF',
      },
    });
  }
}
 

export const themeStore = new ThemeStore(); // You need to export the counterStore instance.
export const themeStoreContext = React.createContext(themeStore);
export const useThemeStore = () => {
  const _ctx = React.useContext(themeStoreContext);
  const _disposer = reaction(
    () => _ctx.theme,
    theme => {
        if (theme === 'light') {
          _ctx._Scheme1 = '';
          _ctx._Scheme2 = '';
          _ctx._Scheme3 = '';
        } else {
          _ctx._Scheme1 = '';
          _ctx._Scheme2 = '';
          _ctx._Scheme3 = '';
        }
    }
  );
  React.useEffect(() => {
    return () => _disposer();
  }, []);
  return _ctx;
}

export default themeStore.styleSheet;