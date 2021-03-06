package com.transportapp;

import android.os.Bundle; // here
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

// react-native gesture handler < 2.0.0
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
//react-native-foreground
import android.content.Intent;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.ExceptionsManagerModule;
import java.util.HashMap;
import java.util.Map;
import java.io.IOException;
import android.util.Log;
import org.devio.rn.splashscreen.SplashScreen; // here

public class MainActivity extends ReactActivity {
 // Add from here down to the end of your MainActivity
  public boolean isOnNewIntent = false;

    @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashScreenTheme, false);
      super.onCreate(null);
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "transportApp";
  }
  //rn gesture handler < 2.0.0
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
 //foreground service function
     @Override
    public  void  onNewIntent(Intent  intent) {
        super.onNewIntent(intent);
        isOnNewIntent = true;
    ForegroundEmitter(intent);
    }

    @Override
    protected  void  onStart() {
        super.onStart();
        if(isOnNewIntent == true){}else {
      ForegroundEmitter(getIntent());
        }
    }
    @ReactMethod
   public void ForegroundEmitter(Intent intent){
    // this method is to send back data from java to javascript so one can easily 
    // know which button from notification or from the notification btn is clicked

    String main = intent.getStringExtra("mainOnPress");
    String btn = intent.getStringExtra("buttonOnPress");
    WritableMap  map = Arguments.createMap();
    if (main != null) {
        // Log.d("SuperLog A", main);
        map.putString("main", main);
    } 
    if (btn != null) {
        // Log.d("SuperLog B", btn);
        map.putString("button", btn);
    }
    try {
        getReactInstanceManager().getCurrentReactContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("notificationClickHandle", map);  	
    } catch (Exception  e) {	
    Log.e("SuperLog", "Caught Exception: " + e.getMessage());
    }
  }
}
