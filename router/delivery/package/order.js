import React from 'react';
import {Avatar, Text, Button, Input, Badge} from 'react-native-elements';
import {View} from 'react-native';
import IconSpeech26 from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import IconPen7 from '../../../assets/icon/iconmonstr-pen-7 1mobile.svg';
import IconFile24 from '../../../assets/icon/iconmonstr-file-24 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import Camera from '../peripheral/camera';
import Signature from '../peripheral/signature';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowCamera: false,
      isShowSignature: false,
      isPhotoProofSubmitted: false,
      isSignatureSubmitted: false,
    };
  }

  componentDidUpdate(prevState) {
    if(this.state.isShowCamera !== prevState.isShowCamera) {
      this.props.navigation.setOptions({
        headerTransparent: this.state.isShowCamera ? true : false,
      });
    }
  }

  photoProofSubmittedHandler = () => {
    this.setState({isPhotoProofSubmitted: true});
  }

  signatureSubmittedHandler = () => {
    this.setState({isSignatureSubmitted: true});
  }

  showCameraHandler = () => {
    this.setState({isShowCamera: !this.state.isShowCamera});
  }

  showSignatureHandler = () => {
    this.setState({isShowSignature: !this.state.isShowSignature});
  }

  render() {
    return (
      <>
        <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 22}}>
          <View style={styles.sectionInput}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputHead}>#323344567553</Text>
              <Input
                inputContainerStyle={{height: 30}}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                placeholder="John"
                label="Name"
              />
              <Input
                inputContainerStyle={{height: 30}}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                placeholder="Jln. Raja H Fisabiliah, Post 5, Kota"
                label="Address"
              />
              <Input
                inputContainerStyle={{height: 30}}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                placeholder="Sneaker shoes 30 box"
                label="Package item"
              />
              <Input
                inputContainerStyle={{height: 30}}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                placeholder="Please put in lobby"
                label="Instruction"
              />
            </View>
          </View>
          <View style={styles.sectionButtonGroup}>
            <View style={styles.sectionContainer}>
              <Avatar
                size={79}
                ImageComponent={() => (
                  <IconPhoto5 height="40" width="40" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: this.state.isPhotoProofSubmitted ? '#17B055' : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                onPress={() => this.showCameraHandler()}
                activeOpacity={0.7}
                containerStyle={{alignSelf: 'center'}}
              />
              {this.state.isPhotoProofSubmitted && 
                <Checkmark height="20" width="20" fill="#fff" style={{position: 'absolute', bottom: 45, right: 16}} />
              }
              <Text style={styles.sectionText}>Photo Proof</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Avatar
                size={79}
                ImageComponent={() => (
                  <IconPen7 height="40" width="40" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: this.state.isSignatureSubmitted ? '#17B055' : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                onPress={() => this.showSignatureHandler()}
                activeOpacity={0.7}
                containerStyle={{alignSelf: 'center'}}
              />
              {this.state.isSignatureSubmitted && 
                <Checkmark height="20" width="20" fill="#fff" style={{position: 'absolute', bottom: 45, right: 16}} />
              }
              <Text style={styles.sectionText}>E-Signature</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Avatar
                size={79}
                ImageComponent={() => (
                  <IconFile24 height="40" width="40" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    alignItems: 'center',
                    paddingTop: 18,
                    paddingBottom: 21,
                  },
                }}
                overlayContainerStyle={{
                  backgroundColor: '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                onPress={() => console.log('Works!')}
                activeOpacity={0.7}
                containerStyle={{alignSelf: 'center'}}
              />

              <Text style={styles.sectionText}>Invoice</Text>
            </View>
          </View>
          <View style={styles.sectionSheetButton}>
            <Button
              buttonStyle={styles.navigationButton}
              titleStyle={styles.deliveryText}
              title="Complete Delivery"
            />
            <View style={[styles.sectionDividier, {marginVertical: 12}]}>
              <Button
                containerStyle={[styles.buttonDivider, {marginRight: 10}]}
                title="Cancel"
                type="outline"
                titleStyle={{color: '#F1811C', fontSize: 14}}
              />

              <Button
                containerStyle={[styles.buttonDivider, {marginLeft: 10}]}
                icon={() => (
                  <View style={{marginRight: 6}}>
                    <IconSpeech26 height="15" width="15" fill="#fff" />
                  </View>
                )}
                title="Chat Client"
                titleStyle={{color: '#fff', fontSize: 14}}
                buttonStyle={{backgroundColor: '#F07120'}}
              />
            </View>
          </View>
        </View>
        {this.state.isShowCamera && (
          <Camera 
            showCameraHandler={this.showCameraHandler}
            photoProofSubmittedHandler={this.photoProofSubmittedHandler}
          />
        )}
        {this.state.isShowSignature && (
          <Signature
            showSignatureHandler={this.showSignatureHandler}
            signatureSubmittedHandler={this.signatureSubmittedHandler}
          />
        )}
      </>
    );
  }
}

const styles = {
  sectionSheetButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  deliveryText: {
    fontWeight: '600',
    color: '#ffffff',
    fontSize: 14,
  },
  navigationButton: {
    backgroundColor: '#121C78',
    borderRadius: 5,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  buttonDivider: {
    flex: 1,
  },
  sectionInput: {
    flexDirection: 'column',
    borderRadius: 13,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    marginBottom: 30,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  inputHead: {
    marginVertical: 17,
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 27,
  },
  sectionButtonGroup: {
    flexDirection: 'row',
  },
  sectionContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionText: {
    textAlign: 'center',
    width: 83,
    fontSize: 14,
    color: '#6C6B6B',
    marginVertical: 12,
  },
  inputStyle: {
    padding: 0,
    margin: 0,
    fontSize: 14,
    fontWeight: '400',
    color: '#ABABAB',
  },
  labelStyle: {
    padding: 0,
    margin: 0,
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 13,
    elevation: 8,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 10,
  },
};
export default Example;
