import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox, Input } from 'react-native-elements';
import { connect } from 'react-redux';
//icon
import ArrowDown from '../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

class ReportManifest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowConfirm: false,
            picker: "",
            deliveryOption: null,
            reasonOption: null,
        };
    }

    handleDeliveryOptions = (selectedValue) => {
        this.setState({
            ...this.state,
            deliveryOption: selectedValue,
        });
    }

    handleReasonOptions = (selectedValue) => {
        this.setState({
            ...this.state,
            reasonOption: selectedValue,
        });
    }

    handleSubmit = () => {
        this.props.setBottomBar(false);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Report</Text>
                    <CheckBox
                        title='Missing Item'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.deliveryOption === 'missing-item'}
                        onPress={() => this.handleDeliveryOptions('missing-item')}
                    />
                    <CheckBox
                        title='Wrong Item Received'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.deliveryOption === 'wrong-item'}
                        onPress={() => this.handleDeliveryOptions('wrong-item')}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={[styles.title, {marginBottom: 5}]}>Report Item</Text>
                    <Text style={{marginBottom: 20, color: '#6C6B6B'}}>Write which Item connote is missing</Text>
                    <View style={styles.picker}>
                        <Picker>
                            {this.props.manifestList.map((data) => (
                                <Picker.Item style={{fontSize: 20}} key={data.code} label={data.code} value={data.code} />
                            ))}
                        </Picker>
                    </View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.handleSubmit()}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 20,
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 20,
    },
    title: {
        color: '#424141',
        fontSize: 16,
        fontWeight: '700',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginBottom: 20,
    },
    submitButton: {
        borderRadius: 5,
        backgroundColor: '#F07120',
        width: '100%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    checkbox: {
        width: '100%',
        borderWidth: 0, 
        backgroundColor: 'transparent',
        margin: 0,
        marginLeft: 0,
        paddingHorizontal: 0,
    },
    overlayContainer: {
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
    confirmSubmitSheet: {
        width: '100%',
        backgroundColor: '#fff',
        flex: 0.35,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    cancelButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    cancelText: {
        fontSize: 20,
        textAlign: 'center',
    },
    cancelButton: {
        width: '40%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
});

const mapStateToProps = (state) => {
    return {
        manifestList: state.originReducer.manifestList,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setBottomBar: (toggle) => {
            return dispatch({type: 'BottomBar', payload: toggle});
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportManifest);