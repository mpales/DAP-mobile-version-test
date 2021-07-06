import React from 'react';
import {Platform} from 'react-native';
import WebView from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import {View} from 'react-native';
const dirs = RNFetchBlob.fs.dirs;

export default class Signature extends React.Component<IProps, {}> {
  webview: any;
  state: any;
  constructor(props: IProps | Readonly<IProps>) {
    super(props);
    this.state = {webViewUrl: 'file:///android_asset/custom/log-android.html', iosUrl: dirs.MainBundleDir+'/log-ios.html'};
    this.onMessage.bind(this);
  }

  onMessage = (event: any) => {
    this.props.deviceSignature(event.nativeEvent.data);
  };

  render() {

    //need to terminate browser function when inject javascript finish. which would trigger onContentProcessDidTerminate,
    // so there is a need to trigger browser crash on injected javascript.
    const jsCode =
      "document.querySelector('.HeaderHero').style.backgroundColor = 'purple';";
    return (
      <View>
      { Platform.OS === 'ios' ? (
              <WebView
          ref={(ref) => {
            this.webview = ref;
          }}
          useWebKit={true}
          allowFileAccess={true}
          source={{uri: this.state.iosUrl }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          injectedJavaScript={jsCode}
          injectedJavaScriptBeforeContentLoaded={jsCode}
          onMessage={this.onMessage}
       
        />) : (
              <WebView
          ref={(ref) => {
            this.webview = ref;
          }}
          allowFileAccess={true}
          source={{uri: this.state.webViewUrl}}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          injectedJavaScript={jsCode}
          injectedJavaScriptBeforeContentLoaded={jsCode}
          onMessage={this.onMessage}
          onShouldStartLoadWithRequest={(request) => {
            // stop the loading process, preferable to crash the browser content immediately for low process memory
            this.webview.stopLoading();
            return false;
          }}
          startInLoadingState={false}
          onContentProcessDidTerminate={(syntheticEvent) => {
            // after terminate trigger certain function on RN side such as redux-worker stop instance
            const {nativeEvent} = syntheticEvent;
            console.warn('Content process terminated, reloading', nativeEvent);
          }}
        />
      ) }
       
      </View>
    );
  }
}


interface IProps {
  deviceSignature: (text: string) => void
}
