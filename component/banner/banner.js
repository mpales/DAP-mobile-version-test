import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// icon
import Xmark from '../../assets/icon/iconmonstr-x-mark-1 1mobile.svg';

const screen = Dimensions.get('window');

class Banner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          styles.bannerNetworkMode,
          {
            justifyContent: 'center',
            backgroundColor: this.props.backgroundColor,
          },
        ]}>
        <Text style={{color: '#FFF'}}>{this.props.title}</Text>
        <TouchableOpacity
          style={styles.xButton}
          onPress={this.props.closeBanner}>
          <Xmark width="15" height="15" fill="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bannerNetworkMode: {
    top: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    flexShrink: 1,
    elevation: 10,
    zIndex: 10,
    width: screen.width,
  },
  xButton: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
});

export default Banner;
