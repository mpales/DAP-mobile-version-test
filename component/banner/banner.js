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
// style
import Mixins from '../../mixins';

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
        <Text style={styles.text}>{this.props.title}</Text>
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
    elevation: 99,
    zIndex: 99,
    width: screen.width,
  },
  xButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: 20,
    top: '50%',
  },
  text: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#FFF',
    textAlign: 'center',
  },
});

export default Banner;
