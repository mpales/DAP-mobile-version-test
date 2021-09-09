import React from 'react';
import {CheckBox, Text, Button, Image} from 'react-native-elements';
import {View, Dimensions, Platform} from 'react-native';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-2 (1) 1mobile.svg';
import DonePicture from '../../../assets/done deliver-01 1mobile.svg';
// helper
const screen = Dimensions.get('window');

class NoDelivery extends React.Component {
  constructor(props) {
    super(props);
  }

  closeSession = () => {
    this.props.navigation.navigate('Delivery');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <DonePicture width="151" height="172"/>
          <View style={{marginVertical: 30}}>
            <Text style={styles.text}>All set End of Day Delivery Come back tomorrow</Text>
          </View>
        </View>
        <View style={{alignSelf: 'center', marginVertical: 40}}>
          <Button
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.closeButton}
            titleStyle={[styles.deliveryText, {color: '#ABABAB'}]}
            onPress={this.closeSession}
            title="Close"
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 22,
    paddingVertical: screen.height / 5,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  deliveryText: {
    ...Mixins.subtitle3,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  text: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#2D2C2C',
    textAlign: 'center',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  checkboxContainer: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    margin: 0,
    paddingHorizontal: 0,
  },
  checked: {
    backgroundColor: '#2A3386',
    padding: 5,
    borderRadius: 2,
    marginRight: 5,
    marginVertical: 3,
  },
  unchecked: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#6C6B6B',
    padding: 5,
    marginRight: 5,
    marginVertical: 3,
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    width: screen.width,
  },
  closeButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ABABAB',
    backgroundColor: '#FFF',
  },
};
function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NoDelivery);
