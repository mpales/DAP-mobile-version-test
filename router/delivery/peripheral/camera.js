import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { launchImageLibrary } from 'react-native-image-picker';
// icons
import UploadIcon from '../../../assets/icon/iconmonstr-upload-5 1mobile.svg';
import SettingIcon from '../../../assets/icon/iconmonstr-gear-2mobile.svg';
import FlashIcon from '../../../assets/icon/Flash.svg';
import {connect} from 'react-redux';

class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoData: null,
            isFlashActive: false,
        }
        this.submitPhotoProof.bind(this);
    }

    componentDidUpdate(prevStates) {
        if(this.state.photoData !== prevStates.photoData) {
            this.submitPhotoProof();
        }
    }

    submitPhotoProof = () => {
        this.props.photoProofSubmittedHandler(true);
        this.props.navigation.navigate('Order');
    }

    launchGallery = (data) => {
        this.setState({
            photoData: data,
        })
    }

    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            this.setState({
                photoData: data,
            })
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={this.state.isFlashActive ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    // onGoogleVisionBarcodesDetected={({ barcodes }) => {
                    //     console.log(barcodes);
                    // }}
                />
                <View style={styles.optionContainer}>
                    <TouchableOpacity onPress={() => {}}>
                        <SettingIcon height="25" width="25" fill="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} style={{marginTop: 20}}>
                        <FlashIcon height="25" width="25" fill="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => launchImageLibrary({mediaType: 'photo'}, this.launchGallery)} style={styles.gallery}>
                        <Text style={{ fontSize: 12 }}> Gallery </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                        {/* <Text style={{ fontSize: 14 }}> SNAP </Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} style={styles.gallery}>
                        <UploadIcon height="25" width="25" fill="#FFFFFF" />
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
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30, 
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        zIndex: 2,
    },
    optionContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        top: 60,
        right: 20,
        zIndex: 2,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 2,
    },
    capture: {
        flex: 0,
        backgroundColor: '#121C78',
        width: 80,
        height: 80,
        borderRadius: 80,
    },
    gallery: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C4C4C4',
        width: 60,
        height: 60,
        borderRadius: 60,
    },
})

function mapStateToProps(state) {
    return {
      todos: state.todos,
      textfield: state.todos.name,
      value: state.todos.name,
      userRole: state.userRole,
      isPhotoProofSubmitted: state.filters.isPhotoProofSubmitted,
    };
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      decrement: () => dispatch({type: 'DECREMENT'}),
      reset: () => dispatch({type: 'RESET'}),
      onChange: (text) => {
        return {type: 'todos', payload: text};
      },
      photoProofSubmittedHandler : (proof) => dispatch({type:'PhotoProof',payload:proof}),
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
      setBottomBar: (toggle) =>  dispatch({type: 'BottomBar', payload: toggle}),
    };
    
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(Camera);
