import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';
// icons
import GalleryAttachment from '../../../../assets/icon/iconmonstr-picture-10.svg';
import FlashIcon from '../../../../assets/icon/Flash.svg';
import FlashActiveIcon from '../../../../assets/icon/FlashActive.svg';

import CheckMark from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import XMark from '../../../../assets/icon/iconmonstr-x-mark-5 1mobile.svg';
import {getBlob, getData} from '../../../../component/helper/network';
class CameraSingle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictureData: null,
            isShowImagePreview: false,
            isFlashActive: false,
            pictureGallery: null,
            inboundId : null,
            data : null,
            updateGallery : false,
        }
  
        this.handleShowImagePreview.bind(this);
        this.takePicture.bind(this);
        this.flashToggle.bind(this);
    }
    
    static getDerivedStateFromProps(props,state){
     const {addPhotoProofID, navigation} = props;
     const {pictureGallery, inboundId} = state;
     // only one instance of multi camera can exist before submited
     if(inboundId === null){
         const {routes, index} = navigation.dangerouslyGetState();
        if(routes[index].params !== undefined && routes[index].params.inboundId !== undefined && routes[index].params.photoId !== undefined){
           return {...state,inboundId:routes[index].params.inboundId, data:routes[index].params.photoId };
        } 
     } 
     return {...state};
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.keyStack !== nextProps.keyStack){
          if(nextProps.keyStack === 'CameraMulti' && this.props.keyStack ==='enlargeImage'){
            this.setState({updateGallery:true});
            return false;
          } 
        }
        return true;
      }
    async componentDidUpdate(prevProps, prevState) {
        if(this.state.updateGallery === true){
            const result = await getData('inbounds/'+this.state.inboundId+'/photosIds');
            if(typeof result === 'object' && result.errors === undefined){
                let galleryDump = [];
                for (let index = 0; index < result.inbound_photos.length; index++) {
                    const element = result.inbound_photos[index].photoId;
                    await getBlob('/inbounds/'+this.state.inboundId+'/processingThumb/'+element,null).then((result)=>{
                        if(typeof result === 'object' && result.error !== undefined){
                          } else {
                            galleryDump.push(Platform.OS === 'android' ? 'file://' + result : '' + result)
                         }
                     });
                }
                this.setState({pictureGallery: galleryDump, updateGallery:false});
            }
        }
    }
    
    async componentDidMount() {
        let galleryDump = [];
        for (let index = 0; index < this.state.data.length; index++) {
            const element = this.state.data[index];
            await getBlob('/inbounds/'+this.state.inboundId+'/processingThumb/'+element,null).then((result)=>{
                if(typeof result === 'object' && result.error !== undefined){
                  } else {
                    galleryDump.push(Platform.OS === 'android' ? 'file://' + result : '' + result)
                 }
             });
        }
        this.setState({pictureGallery: galleryDump});
    }

    flashToggle = () => {
        this.setState({
            isFlashActive: !this.state.isFlashActive,
        });
    }

    launchGallery = (data) => {
        if(!data.didCancel) {
            this.setState({pictureData: data.uri});
        }
    }

    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            this.setState({pictureData: data.uri});
        }
    };


    handlePhotoConfirmation = confirm => {
        const {pictureData, pictureGallery} = this.state;
        if(confirm) {
            this.setState({pictureGallery:[...pictureGallery,pictureData]})
        } else {

        }
        this.setState({pictureData: null});
    }
    handleShowImagePreview = () => {
        if(this.state.pictureGallery.length > 0) {
            console.log('test');
            this.setState({
                isShowImagePreview: !this.state.isShowImagePreview,
            });
        }
    }

    renderItem = ({ item, index }) => {
        console.log(item);
        return (
        <TouchableOpacity
            style={styles.pictureSize}
            onPress={()=> this.props.navigation.navigate('enlargeImage', {index: index})}
        >
            <Image style={{width: '100%', height: '100%'}} source={{ uri: item }} />
        </TouchableOpacity>
    )}
    render() {

        const {photoProofPostpone} = this.props;
        return (
            <>
            {(this.state.pictureData !== null ) ? (<View style={styles.container}>
                <View style={styles.preview}>
                    <Image style={styles.confirmPictureSize} source={{uri: this.state.pictureData}}  />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => {this.handlePhotoConfirmation(false)}} style={styles.gallery}>
                        <XMark height="50" width="50" fill="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.handlePhotoConfirmation(true)}} style={styles.gallery}>
                        <CheckMark height="50" width="50" fill="#fff" />
                    </TouchableOpacity>
                </View>
            </View>) : (<View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={this.state.isFlashActive ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                    captureAudio={false}
                />
                <View style={styles.optionContainer}>
                    <TouchableOpacity onPress={this.flashToggle}>
                        {this.state.isFlashActive
                            ? <FlashActiveIcon height="25" width="25" fill="#FFFFFF" />
                            : <FlashIcon height="25" width="25" fill="#FFFFFF" />
                        }
                    </TouchableOpacity>
                </View>
                {this.state.isShowImagePreview && 
                    this.state.pictureGallery !== null &&
                        <View style={styles.pictureListContainer}>
                            <FlatList 
                                ref={ref => { this.flatlist = ref }}
                                data={this.state.pictureGallery}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => index}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}
                            />
                        </View>
                }
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this.handleShowImagePreview} style={styles.gallery}>
                        {this.state.pictureGallery !== null &&
                            <Image style={styles.imagePreviewButton} source={{uri: this.state.pictureGallery[this.state.pictureGallery.length - 1]}} />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} />
                    <TouchableOpacity onPress={() => launchImageLibrary({mediaType: 'photo'}, this.launchGallery)} style={styles.gallery}>
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
        top: 60,
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
})

function mapStateToProps(state) {
    return {
        photoProofPostpone: state.originReducer.photoProofPostpone,
        keyStack: state.originReducer.filters.keyStack,
    };
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        addPhotoProofID: (id) => dispatch({type:'addPhotoProofID', payload: id}),
        addPhotoProofPostpone: (uri) => dispatch({type: 'PhotoProofPostpone', payload: uri}),
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CameraSingle);
