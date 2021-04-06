import React from 'react';
import WebView from 'react-native-webview';
import {View} from 'react-native';

export default class Signature extends React.Component {
  webview: any;
  state: any;
  constructor(props) {
    super(props);
    this.state = {webViewUrl: 'file:///android_asset/html/log.html'};
    this.onMessage.bind(this);
  }

  onMessage = (event) => {
    console.log(event.nativeEvent.data);
  };

  render() {
    //need to terminate browser function when inject javascript finish. which would trigger onContentProcessDidTerminate,
    // so there is a need to trigger browser crash on injected javascript.
    const jsCode =
      "document.querySelector('.HeaderHero').style.backgroundColor = 'purple';";
    return (
      <View>
        <WebView
          ref={(ref) => {
            this.webview = ref;
          }}
          source={{uri: this.state.webViewUrl}}
          originWhitelist={['*']}
          javaScriptEnabledAndroid={true}
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
      </View>
    );
  }
}
