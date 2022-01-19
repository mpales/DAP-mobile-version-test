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
import GalleryAttachment from '../../../assets/icon/iconmonstr-picture-10.svg';
import FlashIcon from '../../../assets/icon/Flash.svg';
import FlashActiveIcon from '../../../assets/icon/FlashActive.svg';

import OfflineMode from '../../../component/linked/offlinemode';
class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureData: this.props.photoProofList,
      isShowImagePreview: false,
      isFlashActive: false,
    };
    this.flashToggle.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.photoProofList.length !== prevProps.photoProofList.length) {
      this.setState({
        pictureData: this.props.photoProofList,
      });
    }
    if (this.state.pictureData.length !== prevState.pictureData.length) {
      if (this.state.isShowImagePreview && this.state.pictureData.length > 0) {
        this.flatlist.scrollToEnd();
      }
      this.props.addPhotoProofList(this.state.pictureData);
    }
  }

  flashToggle = () => {
    this.setState({
      isFlashActive: !this.state.isFlashActive,
    });
  };

  launchGallery = (data) => {
    if (!data.didCancel) {
      this.setState({pictureData: [...this.state.pictureData, data.uri]});
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.props.imageConfirmationHandler(data.uri);
      this.props.navigation.navigate('ImageConfirmation');
    }
  };

  handleShowImagePreview = () => {
    if (this.state.pictureData.length > 0) {
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
          this.props.navigation.navigate('EnlargeImage', {index: index})
        }>
        <Image style={{width: '100%', height: '100%'}} source={{uri: item}} />
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <OfflineMode />
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
        {this.state.isShowImagePreview && this.state.pictureData.length > 0 && (
          <View style={styles.pictureListContainer}>
            <FlatList
              ref={(ref) => {
                this.flatlist = ref;
              }}
              data={this.state.pictureData}
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
            style={styles.gallery}
            disabled={(this.state.pictureData === null)}
            >
            {this.state.pictureData.length > 0 && (
              <Image
                style={styles.imagePreviewButton}
                source={{
                  uri: this.state.pictureData[
                    this.state.pictureData.length - 1
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
});

function mapStateToProps(state) {
  return {
    photoProofList: state.originReducer.photoProofList,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    reset: () => dispatch({type: 'RESET'}),
    photoProofSubmittedHandler: (proof) =>
      dispatch({type: 'PhotoProof', payload: proof}),
    addPhotoProofList: (uri) =>
      dispatch({type: 'PhotoProofList', payload: uri}),
    imageConfirmationHandler: (data) =>
      dispatch({type: 'ImageConfirmation', payload: data}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Camera);
