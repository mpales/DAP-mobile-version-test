import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {connect} from 'react-redux';
// icons
import GalleryAttachment from '../../../../assets/icon/iconmonstr-picture-10.svg';
import FlashIcon from '../../../../assets/icon/Flash.svg';
import FlashActiveIcon from '../../../../assets/icon/FlashActive.svg';

import CheckMark from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import XMark from '../../../../assets/icon/iconmonstr-x-mark-5 1mobile.svg';
class CameraSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureData: null,
      isShowImagePreview: false,
      isFlashActive: false,
      pictureGallery: this.props.photoProofPostpone,
    };

    this.handleShowImagePreview.bind(this);
    this.takePicture.bind(this);
    this.flashToggle.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.keyStack !== nextProps.keyStack) {
      if (
        nextProps.keyStack === 'POSMSingleCamera' &&
        this.props.keyStack === 'POSMEnlargeImage'
      ) {
        this.setState({pictureGallery: this.props.photoProofPostpone});
        return true;
      }
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      Array.isArray(this.props.photoProofPostpone) &&
      ((prevProps.photoProofPostpone === null &&
        this.props.photoProofPostpone !== prevProps.photoProofPostpone) ||
        this.props.photoProofPostpone.length !==
          prevProps.photoProofPostpone.length)
    ) {
      this.setState({pictureGallery: this.props.photoProofPostpone});
      if (this.state.isShowImagePreview && this.state.pictureGallery !== null) {
        this.flatlist.scrollToEnd();
      }
    }
  }

  flashToggle = () => {
    this.setState({
      isFlashActive: !this.state.isFlashActive,
    });
  };

  launchGallery = (data) => {
    if (!data.didCancel) {
      this.setState({pictureData: data.uri});
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.setState({pictureData: data.uri});
    }
  };

  handlePhotoConfirmation = (confirm) => {
    const {pictureData} = this.state;
    if (confirm) {
      this.props.addPhotoProofPostpone(pictureData);
    } else {
    }
    this.setState({pictureData: null});
  };
  handleShowImagePreview = () => {
    if (this.state.pictureGallery.length > 0) {
      this.setState({
        isShowImagePreview: !this.state.isShowImagePreview,
      });
    }
  };

  render() {
    const renderItem = ({item, index}) => (
      <TouchableOpacity
        style={styles.pictureSize}
        onPress={() =>
          this.props.navigation.navigate('POSMEnlargeImage', {index: index})
        }>
        <Image style={{width: '100%', height: '100%'}} source={{uri: item}} />
      </TouchableOpacity>
    );

    const {photoProofPostpone} = this.props;
    return (
      <>
        {this.state.pictureData !== null ? (
          <View style={[styles.container, {zIndex: 10, elevation: 10}]}>
            <View style={styles.preview}>
              <Image
                style={styles.confirmPictureSize}
                source={{uri: this.state.pictureData}}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.handlePhotoConfirmation(false);
                }}
                style={styles.gallery}>
                <XMark height="50" width="50" fill="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handlePhotoConfirmation(true);
                }}
                style={styles.gallery}>
                <CheckMark height="50" width="50" fill="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={
                this.state.isFlashActive
                  ? RNCamera.Constants.FlashMode.on
                  : RNCamera.Constants.FlashMode.off
              }
              captureAudio={false}
            />
            <View style={styles.optionContainer}>
              <TouchableOpacity onPress={this.flashToggle}>
                {this.state.isFlashActive ? (
                  <FlashActiveIcon height="25" width="25" fill="#FFFFFF" />
                ) : (
                  <FlashIcon height="25" width="25" fill="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
            {this.state.isShowImagePreview &&
              this.state.pictureGallery !== null && (
                <View style={styles.pictureListContainer}>
                  <FlatList
                    ref={(ref) => {
                      this.flatlist = ref;
                    }}
                    data={this.state.pictureGallery}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      flexGrow: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                </View>
              )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.handleShowImagePreview}
                disabled={(this.state.pictureGallery === null)}
                style={styles.gallery}>
                {this.state.pictureGallery !== null && (
                  <Image
                    style={styles.imagePreviewButton}
                    source={{
                      uri: this.state.pictureGallery[
                        this.state.pictureGallery.length - 1
                      ],
                    }}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.takePicture.bind(this)}
                style={styles.capture}
              />
              <TouchableOpacity
                onPress={() =>
                  launchImageLibrary({mediaType: 'photo'}, this.launchGallery)
                }
                style={styles.gallery}>
                <GalleryAttachment height="39" width="30" fill="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: 'black',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 2,
    paddingVertical: 35,
  },
  optionContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: Platform.OS === 'ios' ? 120 : 60,
    right: 20,
    zIndex: 2,
  },
  pictureListContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 130,
    zIndex: 3,
  },
  pictureSize: {
    width: 80,
    height: 80,
    marginHorizontal: 2,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 2,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 80,
  },
  gallery: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  imagePreviewButton: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  confirmPictureSize: {
    width: '100%',
    height: '100%',
  },
  gallery: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 60,
    height: 60,
    borderRadius: 60,
  },
});

function mapStateToProps(state) {
  return {
    photoProofPostpone: state.originReducer.filters.POSMPostpone,
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    // addPhotoProofID: (id) => dispatch({type:'addPhotoProofID', payload: id}),
    addPhotoProofPostpone: (uri) =>
      dispatch({type: 'POSMPostpone', payload: uri}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraSingle);
