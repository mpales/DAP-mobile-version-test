import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {Text, Button, Overlay, Avatar} from 'react-native-elements';
import {useSelector} from 'react-redux';
import IconPhone from '../../assets/icon/iconmonstr-phone-7 1mobile.svg';
import IconEmail from '../../assets/icon/iconmonstr-email-4 2mobile.svg';
import IconWA from '../../assets/icon/iconmonstr-whatsapp-1 1mobile.svg';
import SendIntentAndroid from 'react-native-send-intent';
import Mixins from '../../mixins';
const screen = Dimensions.get('window');

const styles = StyleSheet.create({
  overlayContainer: {
    flexShrink: 1,
    borderRadius: 13,
    flexDirection: 'column',
    padding: 0,
    margin: 0,
  },
  headerText: {
    ...Mixins.h6,
    fontWeight: '400',
    lineHeight: 27,
    color: '#6C6B6B',
  },
  contactContainer: {
    flexShrink: 1,
    flexDirection: 'column',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  contactList: {
    flexDirection: 'row',
    flexShrink: 1,
    width: '50%',
    marginBottom: 50,
  },
  iconList: {
    flexShrink: 1,
    paddingHorizontal: 10,
  },
  textList: {
    ...Mixins.subtitle3,
    color: '#6C6B6B',
    fontWeight: '400',
    lineHeight: 21,
  },
  contactSection: {
    flexDirection: 'row',
    flexShrink: 1,
    marginHorizontal: 20,
    marginBottom: 39,
  },
  sectionButton: {
    alignItems: 'center',
    flexShrink: 1,
    marginHorizontal: 15,
  },
  sectionText: {
    flexShrink: 1,
    ...Mixins.small3,
    fontWeight: '400',
    lineHeight: 15,
    color: '#6C6B6B',
  },
  buttonCancel: {
    flexShrink: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 5,
    backgroundColor: '#F07120',
    alignSelf: 'center',
    alignItems: 'center',
  },
  cancelTitle: {
    ...Mixins.small3,
    lineHeight: 12,
    fontWeight: '600',
    color: 'white',
  },
});
export default OverlayContact = (props) => {
  const currentDeliveringAddress = useSelector(
    (state) => state.originReducer.currentDeliveringAddress,
  );
  const dataPackage = useSelector(
    (state) => state.originReducer.route.dataPackage,
  );

  let phoneNumber = '0023132232';
  // if (currentDeliveringAddress !== null) {
  //   const {phone} = dataPackage[currentDeliveringAddress];
  //   phoneNumber = phone;
  // }
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  React.useEffect(() => {
    if (props.overlayState) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [props.overlayState]);

  const sendToCall = () => {
    if (Platform.OS === 'android') {
      SendIntentAndroid.sendPhoneCall(phoneNumber, true);
    } else {
      Linking.openURL('tel://' + phoneNumber);
    }
  };
  const sendToSMS = () => {
    let body = 'SMS body text here';
    if (Platform.OS === 'android') {
      SendIntentAndroid.sendSms(phoneNumber, body);
    } else {
      Linking.openURL(`sms:${phoneNumber}&body=${body}`);
    }
  };
  const sendToWA = () => {
    Linking.openURL(
      'whatsapp://send?&phone=' + phoneNumber + '&text=body-text-here',
    );
  };
  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={props.toggleOverlay}
      overlayStyle={styles.overlayContainer}
      fullScreen={false}>
      <View
        style={{
          borderBottomColor: '#D5D5D5',
          borderBottomWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20,
        }}>
        <Text style={styles.headerText}>Contact Client</Text>
      </View>
      <View style={styles.contactContainer}>
        <View style={styles.contactList}>
          <View style={styles.iconList}>
            <IconPhone width="15" height="15" fill="#7177AE" />
          </View>
          <Text style={styles.textList}>{phoneNumber}</Text>
        </View>
        <View style={styles.contactSection}>
          <TouchableOpacity style={[styles.sectionButton]} onPress={sendToCall}>
            <Avatar
              size={40}
              ImageComponent={() => (
                <>
                  <IconPhone height="25" width="25" fill="#fff" />
                </>
              )}
              imageProps={{
                containerStyle: {
                  alignItems: 'center',
                  paddingTop: 8,
                  paddingBottom: 0,
                },
              }}
              overlayContainerStyle={{
                backgroundColor: '#F07120',
                flex: 2,
                borderRadius: 100,
              }}
              activeOpacity={0.7}
              containerStyle={{alignSelf: 'center'}}
            />
            <Text style={styles.sectionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sectionButton]} onPress={sendToSMS}>
            <Avatar
              size={40}
              ImageComponent={() => (
                <>
                  <IconEmail height="25" width="25" fill="#fff" />
                </>
              )}
              imageProps={{
                containerStyle: {
                  alignItems: 'center',
                  paddingTop: 8,
                  paddingBottom: 0,
                },
              }}
              overlayContainerStyle={{
                backgroundColor: '#F07120',
                flex: 2,
                borderRadius: 100,
              }}
              activeOpacity={0.7}
              containerStyle={{alignSelf: 'center'}}
            />
            <Text style={styles.sectionText}>SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.sectionButton]} onPress={sendToWA}>
            <Avatar
              size={40}
              ImageComponent={() => (
                <>
                  <IconWA height="25" width="25" fill="#fff" />
                </>
              )}
              imageProps={{
                containerStyle: {
                  alignItems: 'center',
                  paddingTop: 8,
                  paddingBottom: 0,
                },
              }}
              overlayContainerStyle={{
                backgroundColor: '#F07120',
                flex: 2,
                borderRadius: 100,
              }}
              activeOpacity={0.7}
              containerStyle={{alignSelf: 'center'}}
            />
            <Text style={styles.sectionText}>Whatsapp</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.buttonCancel}
          onPress={props.toggleOverlay}>
          <Text style={styles.cancelTitle}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};
