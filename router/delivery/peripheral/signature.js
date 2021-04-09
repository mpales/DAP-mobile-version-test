import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import RNFetchBlob from 'rn-fetch-blob';
// icon
import XMarkIcon from '../../../assets/icon/iconmonstr-x-mark-1 1mobile.svg';

class Signature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signatureData: null,
    }
  }

  componentDidUpdate(prevStates) {
    if(this.state.signatureData !== prevStates.signatureData) {
      this.props.signatureSubmittedHandler(true);
      this.props.showSignatureHandler(true);
    }
  }

  signatureHandler = async (signature) => {
    const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
    const fs = RNFetchBlob.fs;
    const base64 = RNFetchBlob.base64;
    await fs.writeFile(`${cacheDir}/signature.png`, base64.encode(signature), 'base64')
    RNFetchBlob.fs.readFile(`${cacheDir}/signature.png`, 'base64')
      .then((data) => {
        this.setState({signatureData: data});
      })
  };

  emptyHandler = () => {
    console.log('Empty');
  };

  webStyle = `
    .m-signature-pad {border: 1px solid gray; border-right: 2px solid gray; box-shadow: none;}
    .m-signature-pad--footer {margin-top: 25px;}
    .m-signature-pad--footer .description {display: none;}
    .m-signature-pad--footer .button {font-size: 16px; font-weight: bold;}
    .m-signature-pad--footer .button.clear {width: 45%; height: 40px; background-color: white; color: gray; border-radius: 5px; border: 1px solid gray;}
    .m-signature-pad--footer .button.save {width: 45%; height: 40px; background-color:  #121C78;}
  `;

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.canvasContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={this.props.showSignatureHandler}
          >
            <XMarkIcon width="15" height="15" fill="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Signature</Text>
          <SignatureCanvas
            ref={this.ref}
            onOK={this.signatureHandler}
            onEmpty={this.emptyHandler}
            clearText="Clear"
            confirmText="Submit"
            webStyle={this.webStyle}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    bottom: 0, 
    right: 0,
    left: 0,
  },
  transparentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(196,196,196,0.5)',
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 15,
  },
  canvasContainer: {
    flex: 0.6,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  closeButton: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#F07120',
    borderRadius: 40,
    right: 20,
    top: -20,
  },
});

export default Signature;