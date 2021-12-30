import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import {LinearProgress} from 'react-native-elements';
import {RNCamera} from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {connect} from 'react-redux';
// icons
import GalleryAttachment from '../../../../assets/icon/iconmonstr-picture-10.svg';
import FlashIcon from '../../../../assets/icon/Flash.svg';
import FlashActiveIcon from '../../../../assets/icon/FlashActive.svg';

import CheckMark from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import XMark from '../../../../assets/icon/iconmonstr-x-mark-5 1mobile.svg';
import ImageLoading from '../../../../component/loading/image';
import RNFetchBlob from 'rn-fetch-blob';
import Mixins from '../../../../mixins';
import {getBlob, getData, putBlob} from '../../../../component/helper/network';
class CameraSingle extends React.Component {
  thumbRef = null;
  flatlistImageRef = [];
  constructor(props) {
    super(props);
    this.state = {
      progressLinearVal: 0,
      pictureData: null,
      isShowImagePreview: false,
      isFlashActive: false,
      pictureGallery: null,
      inboundId: null,
      data: null,
      updateGallery: false,
      typeGallery: null,
      errors: '',
    };
    this.getPhotoToFormdata.bind(this);
    this.listenToProgressUpload.bind(this);
    this.renderItem.bind(this);
    this.handleShowImagePreview.bind(this);
    this.takePicture.bind(this);
    this.flashToggle.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const {addPhotoProofID, navigation} = props;
    const {pictureGallery, inboundId} = state;
    // only one instance of multi camera can exist before submited
    if (inboundId === null) {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.inboundId !== undefined &&
        routes[index].params.photoId !== undefined
      ) {
        return {
          ...state,
          inboundId: routes[index].params.inboundId,
          data: routes[index].params.photoId,
          typeGallery: routes[index].params.type,
        };
      }
    }
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.keyStack !== nextProps.keyStack) {
      if (
        nextProps.keyStack === 'CameraMulti' &&
        this.props.keyStack === 'enlargeImage'
      ) {
        this.setState({updateGallery: true});
        return false;
      }
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.state.updateGallery === true) {
      const result = await getData(
        'inboundsMobile/' + this.state.inboundId + '/photosIds',
      );
      if (typeof result === 'object' && result.errors === undefined) {
        let galleryIDDump = [];
        for (let index = 0; index < result.inbound_photos.length; index++) {
          const element = result.inbound_photos[index].photoId;
          if (
            result.inbound_photos[index].status === 2 &&
            this.state.typeGallery === 'received'
          ) {
            galleryIDDump.push(element);
          } else if (
            result.inbound_photos[index].status === 3 &&
            this.state.typeGallery === 'processing'
          ) {
            galleryIDDump.push(element);
          } else if (
            result.inbound_photos[index].status === 4 &&
            this.state.typeGallery === 'receiving'
          ) {
            galleryIDDump.push(element);
          }
        }
        this.setState({pictureGallery: galleryIDDump, updateGallery: false});
      }
    }
    if (prevState.pictureGallery !== this.state.pictureGallery) {
      this.thumbRef.init();
    }
    if (
      prevState.isShowImagePreview !== this.state.isShowImagePreview &&
      this.state.isShowImagePreview === true
    ) {
      this.flatlistImageRef.forEach((element) => {
        if (element.checkPreload() === true) {
          element.init();
        }
      });
    }
    if (
      this.state.updateGallery !== prevState.updateGallery &&
      this.state.updateGallery === false
    ) {
      this.flatlistImageRef.forEach((element) => {
        if (element !== null) element.refresh();
      });
    }
  }

  async componentDidMount() {
    let galleryIDDump = [];
    for (let index = 0; index < this.state.data.length; index++) {
      const element = this.state.data[index];
      galleryIDDump.push(element);
    }
    console.log(this.state.typeGallery);
    this.setState({pictureGallery: galleryIDDump});
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
  getPhotoToFormdata = async () => {
    const {pictureData} = this.state;
    let name,
      filename,
      path,
      type = '';
    await RNFetchBlob.fs
      .stat(
        Platform.OS === 'ios'
          ? pictureData.replace('file://', '')
          : pictureData,
      )
      .then((FSStat) => {
        name = FSStat.filename.replace('.', '-');
        filename = FSStat.filename;
        path = FSStat.path;
        type = FSStat.type;
      });
    if (type === 'file')
      return {
        name: 'photos',
        filename: filename,
        data: Platform.OS === 'ios' ? path : RNFetchBlob.wrap(path),
        type: 'image/jpg',
      };
  };
  listenToProgressUpload = (written, total) => {
    this.setState({progressLinearVal: (1 / total) * written});
  };
  handlePhotoConfirmation = async (confirm) => {
    const {pictureData, pictureGallery} = this.state;
    let FormData = await this.getPhotoToFormdata();
    let uploadCategory =
      this.state.typeGallery === 'received' ? 'receiving/update' : 'processing';
    if (confirm) {
      let putString =
        this.state.typeGallery === 'receiving'
          ? '/inboundsMobile/' + this.state.inboundId + '/complete-receiving'
          : '/inboundsMobile/' + this.state.inboundId + '/' + uploadCategory;
      putBlob(putString, [FormData], this.listenToProgressUpload).then(
        (result) => {
          if (typeof result !== 'object') {
            this.setState({pictureData: null, updateGallery: true});
          } else {
            if (typeof result === 'object') {
              this.setState({errors: result.error});
            }
          }
        },
      );
    } else {
      this.setState({pictureData: null, errors: ''});
    }
  };
  handleShowImagePreview = () => {
    if (this.state.pictureGallery.length > 0) {
      this.setState({
        isShowImagePreview: !this.state.isShowImagePreview,
      });
    }
  };

  renderItem = ({item, index}) => {
    let typeAPI =
      this.state.typeGallery === 'received'
        ? 'receiveThumb'
        : this.state.typeGallery === 'receiving'
        ? 'complete-receiving'
        : 'processingThumb';
    return (
      <TouchableOpacity
        style={styles.pictureSize}
        onPress={() =>
          this.props.navigation.navigate('enlargeImage', {
            index: index,
            photoId: this.state.pictureGallery,
          })
        }>
        <ImageLoading
          ref={(ref) => {
            this.flatlistImageRef[index] = ref;
          }}
          callbackToFetch={async (indicatorTick) => {
            if (typeAPI === 'complete-receiving') {
              return await getBlob(
                '/inboundsMobile/' +
                  this.state.inboundId +
                  '/complete-photo/' +
                  item +
                  '/full',
                (received, total) => {
                  // if(this.flatlistImageRef[index] !== null)
                  // this.flatlistImageRef[index].
                  indicatorTick(received);
                },
              );
            } else {
              return await getBlob(
                '/inboundsMobile/' +
                  this.state.inboundId +
                  '/' +
                  typeAPI +
                  '/' +
                  item,
                {filename: item + '.jpg'},
                (received, total) => {
                  // if(this.flatlistImageRef[index] !== null)
                  // this.flatlistImageRef[index].
                  indicatorTick(received);
                },
              );
            }
          }}
          containerStyle={{width: '100%', height: '100%'}}
          style={{width: '100%', height: '100%', backgroundColor: 'black'}}
          imageStyle={{}}
          imageContainerStyle={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
    );
  };
  render() {
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
            <View style={[styles.buttonContainer, {paddingVertical: 0}]}>
              <LinearProgress
                value={this.state.progressLinearVal}
                color="primary"
                style={{width: '100%', flexShrink: 1}}
                variant="determinate"
              />
              <View style={styles.errorContainer}>
                <Text
                  style={{
                    ...Mixins.subtitle3,
                    lineHeight: 21,
                    fontWeight: '400',
                    color: 'red',
                  }}>
                  {this.state.errors}
                </Text>
              </View>
              <View style={[styles.buttonContent, {paddingVertical: 35}]}>
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
                    renderItem={this.renderItem}
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
              <View style={styles.buttonContent}>
                <TouchableOpacity
                  onPress={this.handleShowImagePreview}
                  style={styles.gallery}>
                  {this.state.pictureGallery !== null && (
                    <ImageLoading
                      ref={(ref) => {
                        this.thumbRef = ref;
                      }}
                      callbackToFetch={async (indicatorTick) => {
                        if (this.state.typeGallery === 'receiving') {
                          return await getBlob(
                            '/inboundsMobile/' +
                              this.state.inboundId +
                              '/complete-photo/' +
                              this.state.pictureGallery[
                                this.state.pictureGallery.length - 1
                              ] +
                              '/full',
                            (received, total) => {
                              // if(this.thumbRef !== null)
                              // this.thumbRef.
                              indicatorTick(received);
                            },
                          );
                        } else {
                          return await getBlob(
                            '/inboundsMobile/' +
                              this.state.inboundId +
                              '/' +
                              (this.state.typeGallery === 'received'
                                ? 'receiveThumb'
                                : 'processingThumb') +
                              '/' +
                              this.state.pictureGallery[
                                this.state.pictureGallery.length - 1
                              ],
                            {
                              filename:
                                this.state.pictureGallery[
                                  this.state.pictureGallery.length - 1
                                ] + '.jpg',
                            },
                            (received, total) => {
                              // if(this.thumbRef !== null)
                              // this.thumbRef.
                              indicatorTick(received);
                            },
                          );
                        }
                      }}
                      containerStyle={styles.imagePreviewButton}
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black',
                      }}
                      imageStyle={{}}
                      imageContainerStyle={{width: '100%', height: '100%'}}
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
  errorContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 2,
    flexShrink: 1,
    paddingVertical: 5,
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    zIndex: 2,
    paddingVertical: 35,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
    photoProofPostpone: state.originReducer.photoProofPostpone,
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addPhotoProofID: (id) => dispatch({type: 'addPhotoProofID', payload: id}),
    addPhotoProofPostpone: (uri) =>
      dispatch({type: 'PhotoProofPostpone', payload: uri}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraSingle);
