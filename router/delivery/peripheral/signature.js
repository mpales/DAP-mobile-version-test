import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { FileSystem } from 'react-native-unimodules';
// icon
import XMarkIcon from '../../../assets/icon/iconmonstr-x-mark-1 1mobile.svg';

class Signature extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Created on Thu Apr 08 2021
     *
     * handle signature base64 response convert to .png file store in cache
     *
     * function called when submit button pressed
     * and FileSystem will write as .png file saved in cache
     *
     * @param signature string: base64
     * @todo upload created signature.png file
     * @author Daniel Lim (daniel@grip-principle.com)
     */
    signatureHandler = signature => {
        const path = FileSystem.cacheDirectory + 'signature.png';
        FileSystem.writeAsStringAsync(path, signature.replace('data:image/png;base64,', ''), {encoding: FileSystem.EncodingType.Base64})
            .then(() => {
                FileSystem.getInfoAsync(path, {size: true, md5: true})
                .then(file => {
                    console.log(file);
                })
                this.props.signatureSubmittedHandler();
                this.props.showSignatureHandler();
            })
            .catch(err => {
                console.log("err", err);
            })
    };

    emptyHandler = () => {
        console.log('Empty');
    }

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
    }
})

export default Signature;