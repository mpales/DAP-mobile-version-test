import React from 'react';
import {
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import RNFetchBlob from 'rn-fetch-blob';
// icon
import XMarkIcon from '../../../../assets/icon/iconmonstr-x-mark-1 1mobile.svg';
const window = Dimensions.get('window');

class Signature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({isMounted: true});
    }, 0);
  }

  saveSignature = async (data) => {
    let randomString = Math.random().toString(36).substring(7);
    let signatureData = '';
    const cacheDir =
      Platform.OS === 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const fs = RNFetchBlob.fs;
    let filePathName = `${cacheDir}/signature_${randomString}.png`;
    await fs.writeFile(
      filePathName,
      data.replace('data:image/png;base64,', ''),
      'base64',
    );
    if (Platform.OS === 'ios') {
      const dirs = RNFetchBlob.fs.dirs;
      let arr = filePathName.split('/');
      let newFilePathName = `file://${dirs.DocumentDir}/${arr[arr.length - 1]}`;
      signatureData = newFilePathName;
    } else {
      signatureData = `file://${filePathName}`;
    }
    this.props.submitSignature();
    this.props.setRecollectionsignatureBase64(data);
    this.props.setRecollectionSignatureData(signatureData);
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
            onPress={() => this.props.showSignatureHandler()}>
            <XMarkIcon width="15" height="15" fill="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Signature</Text>
          {this.state.isMounted && (
            <SignatureCanvas
              onOK={this.saveSignature}
              onEmpty={this.emptyHandler}
              clearText="Clear"
              confirmText="Submit"
              webStyle={this.webStyle}
              dataURL={this.props.recollectionSignatureBase64}
            />
          )}
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 15,
  },
  canvasContainer: {
    width: window.width,
    height: window.height - (window.height * 40) / 100,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
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
