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
import Banner from '../../../component/banner/banner';
class ManualInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanItem : null,
            inputCode: '',
            dataCode: null,
            error: false,
        }
    }

    static getDerivedStateFromProps(props,state){
        const {routes, index} = props.navigation.dangerouslyGetState();
        const {manifestList} = props;
        if(state.scanItem === null){
          if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined && manifestList.some((o) => o.pId === routes[index].params.dataCode) === true) {   
            return {...state, scanItem : routes[index].params.dataCode};
          }
          else {
            return {...state, scanItem : false};
          }
        }
        return {...state};
      }
    handleConfirm = () => {
        const {inputCode,scanItem} = this.state;
        const {manifestList} = this.props;
        if(scanItem === false){
            let dataItem = manifestList.find((element) => element.barcodes !== undefined && element.barcodes.some((element)=> inputCode === element.code_number) === true);
            if(dataItem !== undefined){
                this.props.setBottomBar(false);
                this.props.navigation.navigate({
                    name: 'Barcode',
                    params: {
                        manualCode: this.state.inputCode,
                    }
                });
            } else {
                this.setState({inputCode: '', error: true});
            }
        } else {
            let dataItem = manifestList.find((o)=>o.pId === scanItem);
            let barcodeArray = Array.from({length: dataItem.barcodes.length}).map((num,index)=>{
                return dataItem.barcodes[index].code_number;
            });   
            if(barcodeArray.includes(inputCode)) {
                this.props.setBottomBar(false);
                this.props.navigation.navigate({
                    name: 'Barcode',
                    params: {
                        manualCode: this.state.inputCode,
                    }
                });
            } else {
                this.setState({inputCode: '', error: true});
            }
        }

    }
    closeNotifBanner = ()=>{
        this.setState({error:false});
      }
    render() {
        return (
            <View style={styles.container}>
                  {this.state.error && (<Banner
            title="Invalid input barcode , please try it again"
            backgroundColor="#F1811C"
            closeBanner={this.closeNotifBanner}
          />)}
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
                {/* {this.state.error && (<View style={{position: 'absolute', bottom:0, left:0, right:0, backgroundColor:'#E03B3B', width: '100%', justifyContent: 'center', alignItems: 'center'}}> 
                <Text style={{...Mixins.small3, lineHeight: 16, fontSize: 11,fontWeight: '400', color:'#fff'}}>Invalid input barcode , please try it again</Text>
                </View>)} */}
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