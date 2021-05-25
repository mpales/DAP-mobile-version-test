import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
  Text,
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native';
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({hasError: true});
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    return (
      <View>
        <Text>Something did wrong with this one</Text>
      </View>
    );
  }
}