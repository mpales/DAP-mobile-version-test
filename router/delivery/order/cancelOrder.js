import React from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    View,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';

import OfflineMode from '../../../component/linked/offlinemode';
class CancelOrder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowConfirm: false,
            textInput: "",
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

    handleShowConfirm = (bool) => {
        this.setState({
            ...this.state,
            isShowConfirm: bool,
        });
        this.props.setBottomBar(!bool);
    }

    handleConfirm = async (action) => {
        if(action) {
            await this.onSubmit();
            this.props.navigation.popToTop();
            this.props.navigation.navigate('Home');
        } else {
            this.handleShowConfirm(false);
        }
        this.props.setBottomBar(true);
    }

    onSubmit = async () => {
        this.props.setStartDelivered(false);
    }
    render() {
        return (
            <View style={styles.container}>
                <OfflineMode />
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Delivery</Text>
                    <CheckBox
                        title='Postpone Delivery'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.deliveryOption === 'postpone'}
                        onPress={() => this.handleDeliveryOptions('postpone')}
                    />
                    <CheckBox
                        title='Cancel Delivery'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.deliveryOption === 'cancel'}
                        onPress={() => this.handleDeliveryOptions('cancel')}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Reason</Text>
                    <CheckBox
                        title='Traffic jam'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.reasonOption === 'traffic-jam'}
                        onPress={() => this.handleReasonOptions('traffic-jam')}
                    />
                    <CheckBox
                        title='Have an accident'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.reasonOption === 'accident'}
                        onPress={() => this.handleReasonOptions('accident')}
                    />
                    <CheckBox
                        title='Other reason'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.reasonOption === 'other'}
                        onPress={() => this.handleReasonOptions('other')}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <TextInput
                        style={styles.textInput}
                        multiline={true}
                        textAlignVertical='top'
                        numberOfLines={3}
                        onChangeText={this.state.textInput}
                    />
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.handleShowConfirm(true)}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </View>
                {this.state.isShowConfirm &&
                    <View style={styles.overlayContainer}>
                        <View style={styles.confirmSubmitSheet}>
                            <Text style={styles.cancelText}>
                                Are you sure you want to Submit?
                            </Text>
                            <View style={styles.cancelButtonContainer}>
                                <TouchableOpacity 
                                    style={[styles.cancelButton, {borderWidth: 1, borderColor: '#ABABAB'}]}
                                    onPress={() => this.handleConfirm(false)}
                                >
                                <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                                    onPress={() => this.handleConfirm(true)}
                                >
                                <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
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
        color: '#6C6B6B',
        fontSize: 16,
        fontWeight: '700',
    },
    textInput: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ABABAB',
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
        borderWidth: 0, 
        backgroundColor: 'transparent'
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
        bottomBar: state.originReducer.filters.bottomBar,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setBottomBar: (toggle) => {
            return dispatch({type: 'BottomBar', payload: toggle});
        },
        
        setStartDelivered : (toggle) => {
            return dispatch({type: 'startDelivered', payload: toggle});
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelOrder);