import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
// icons
import TrashCan16Mobile from '../../../assets/icon/iconmonstr-trash-can-16mobile.svg';

import OfflineMode from '../../../component/linked/offlinemode';
const window = Dimensions.get("window");

class EnlargeImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            pictureData: this.props.photoProofList,
            convertedPictureData: [],
            currentPictureIndex: 0,
            isShowDelete: false,
        });
    }

    componentDidMount() {
        if(this.props.navigation.state.params.index !== undefined) {
            this.setState({
                currentPictureIndex: this.props.navigation.state.params.index,
            });
        }
        this.convertPictureData();
    }

    convertPictureData = () => {
        let convertedPictureData = [];
        this.state.pictureData.map(value => {
            const uri = { url: value };
            convertedPictureData = [...convertedPictureData, uri];
        });
        this.setState({
            convertedPictureData: convertedPictureData,
        });
    }

    handleShowDelete = () => {
        this.setState({isShowDelete: !this.state.isShowDelete})
    }

    handleDelete = () => {
        if(this.state.currentPictureIndex === (this.state.pictureData.length - 1)) {
            this.setState({
                currentPictureIndex: this.state.pictureData.length - ((this.state.pictureData.length < 2 ) ? 1 : 2),
            });
        }
        this.state.pictureData.splice(this.state.currentPictureIndex, 1);
        this.state.convertedPictureData.splice(this.state.currentPictureIndex, 1);
        if(this.state.pictureData.length < 1) {
            this.props.photoProofSubmittedHandler([]);
            this.props.navigation.navigate('Camera', {screen: 'Camera'});
        }
        this.handleShowDelete();
    }

    handleOnChangeImage = (index) => {
        this.setState({
            currentPictureIndex: index,
        });
    }

    render() {
        return (
            <>
                <View style={styles.container}>
                <OfflineMode/>
                    <View style={styles.pictureContainer}>
                        {this.state.convertedPictureData.length > 0 &&
                            <ImageViewer
                                imageUrls={this.state.convertedPictureData}
                                index={this.state.currentPictureIndex}
                                renderIndicator={() => null}
                                onChange={index => this.handleOnChangeImage(index)}
                            />
                        }
                        {/* {this.state.pictureData.map((value, index) => {
                            return <Image key={index} style={styles.picture} source={{uri: value}} />
                        })} */}
                    </View>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={this.handleShowDelete}
                    >
                        <TrashCan16Mobile height="30" width="25" fill="#fff" />
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                {this.state.isShowDelete &&
                    <View style={styles.transparentOverlay}>
                        <View style={styles.deleteContainer}>
                            <Text>Delete this image ?</Text>
                            <View style={styles.confirmButtonContainer}>
                                <TouchableOpacity
                                    onPress={this.handleShowDelete}
                                    style={[styles.confirmButton, {backgroundColor: '#fff', borderWidth: 1, borderColor: '#ABABAB'}]}
                                >
                                     <Text style={styles.cancelText}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.handleDelete}
                                    style={[styles.confirmButton, {backgroundColor: '#F07120'}]}
                                >
                                     <Text style={styles.confirmText}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </>
        )
    } 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2D2C2C',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pictureContainer: {
        height: window.height - (window.height * 40 / 100),
        flexDirection: 'row',
    },
    picture: {
        width: '100%',
    },
    transparentOverlay: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
    },
    deleteContainer: {
        width: '100%',
        height: window.height - (window.height * 80 / 100),
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    confirmButtonContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    confirmButton: {
        width: '40%',
        height: 40,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '700',
    },
    cancelText: {
        color: '#6C6B6B',
        fontWeight: '700',
    },
    deleteButton: {
        position: 'absolute',
        bottom: 0,
        paddingVertical: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: '#fff',
    }
})

function mapStateToProps(state) {
    return {
        photoProofList: state.originReducer.photoProofList,
    };
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        reset: () => dispatch({type: 'RESET'}),
        photoProofSubmittedHandler : (proof) => dispatch({type:'PhotoProof',payload:proof}),
        addPhotoProofList: (uri) => dispatch({type: 'PhotoProofList', payload: uri}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnlargeImage);