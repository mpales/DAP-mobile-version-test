import React from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import CheckMark from '../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import XMark from '../../../assets/icon/iconmonstr-x-mark-5 1mobile.svg';

class ImageConfirmation extends React.Component {
    constructor(props) {
        super(props);
    }

    handlePhotoConfirmation = confirm => {
        if(confirm) {
            let newPhotoProofList = [...this.props.photoProofList, this.props.imageConfirmationData];
            this.props.photoProofHandler(newPhotoProofList);
        }
        this.props.imageConfirmationHandler(null);
        this.props.navigation.navigate('Camera', {screen: 'Camera'});
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.preview}>
                    <Image style={styles.confirmPictureSize} source={{uri: this.props.imageConfirmationData}}  />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => {this.handlePhotoConfirmation(false)}} style={styles.gallery}>
                        <XMark height="50" width="50" fill="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.handlePhotoConfirmation(true)}} style={styles.gallery}>
                        <CheckMark height="50" width="50" fill="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        )
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
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 2,
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

const mapStateToProps = (state) => {
    return {
        imageConfirmationData: state.originReducer.imageConfirmationData,
        photoProofList: state.originReducer.photoProofList,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        photoProofHandler: (uri) => dispatch({type: 'PhotoProofList', payload: uri}),
        imageConfirmationHandler: (data) => dispatch({type: 'ImageConfirmation', payload: data}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageConfirmation)