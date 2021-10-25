import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Mixins from '../../../mixins';
import { connect } from 'react-redux';

class ManualInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputCode: '',
            dataCode: null,
            error: false,
        }
    }

    static getDerivedStateFromProps(props,state){
        return {...state};
      }
    handleConfirm = () => {
        const {inputCode} = this.state;
        const {manifestList} = this.props;
        this.props.setBottomBar(false);
        this.props.navigation.navigate({
            name: 'RegisterBarcode',
            params: {
                manualCode: this.state.inputCode,
            }
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{padding:20}}>
                <Text style={styles.title}>Input Manual Barcode</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => this.setState({inputCode: value})}
                    defaultValue=""
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={this.handleConfirm}
                >
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 20,
    }, 
    submitButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#F07120',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
    }
});

const mapStateToProps = (state) => {
    return {
        manifestList: state.originReducer.manifestList,
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
        setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
   
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManualInput);