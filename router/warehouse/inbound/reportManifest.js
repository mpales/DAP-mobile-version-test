import React from 'react';
import {
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox, Input, Avatar, Button, LinearProgress} from 'react-native-elements';
import { connect } from 'react-redux';
//icon
import Mixins from '../../../mixins';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import ArrowDown from '../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';
import {postBlob} from '../../../component/helper/network';
import RNFetchBlob from 'rn-fetch-blob';
class ReportManifest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowConfirm: false,
            picker: "",
            deliveryOption: null,
            reasonOption: '',
            otherReason: "",
            dataCode : '0',
            _manifest : null,
            errors: '',
            progressLinearVal : 0,
        };
        this.getPhotoReceivingGoods.bind(this);
        this.listenToProgressUpload.bind(this);
        this.handleSubmit.bind(this);
    }
    static getDerivedStateFromProps(props,state){
        const {inboundList,navigation, manifestList} = props;
        const {dataCode} = state;
        if(dataCode === '0'){
            const {routes, index} = navigation.dangerouslyGetState();
            if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined) {
                // for prototype only should be params ID from backend
                let manifest = manifestList.find((element)=>element.code === routes[index].params.dataCode);
              return {...state, dataCode: routes[index].params.dataCode, _manifest:manifest};
            }
        }
        return {...state};
      }
      shouldComponentUpdate(nextProps, nextState) {
        if(this.props.keyStack !== nextProps.keyStack){
          if(nextProps.keyStack === 'ReportManifest'){
            this.props.setBottomBar(false);
            return true;
          }
        }
        return true;
      }
      componentDidUpdate(prevProps, prevState, snapshot) {
       
        if(prevState.dataCode !== this.state.dataCode){
          this.props.addPhotoReportPostpone(null);
        }
      }
    handleDeliveryOptions = (selectedValue) => {
        this.setState({
            ...this.state,
            reasonOption: selectedValue,
        });
    }

    handleReasonOptions = (selectedValue) => {
        this.setState({
            ...this.state,
            reasonOption: selectedValue,
        });
    }
    listenToProgressUpload = (written, total) => {
        console.log(written);
        console.log(total);
        this.setState({progressLinearVal:(1/total)*written});
      }
      getPhotoReceivingGoods = async () => {
        const {photoReportPostpone} = this.props;
        let formdata = [];
        for (let index = 0; index < photoReportPostpone.length; index++) {
          let name,filename,path,type ='';
          await RNFetchBlob.fs.stat(photoReportPostpone[index]).then((FSStat)=>{
            name = FSStat.filename.replace('.','-');
            filename= FSStat.filename;
            path = FSStat.path;
            type = FSStat.type;
          });
          if(type === 'file')
          formdata.push({ name : 'photos', filename : filename, type:'image/jpg', data: RNFetchBlob.wrap(path)})
        }
        return formdata;
      }
    handleSubmit = async () => {
        const {currentASN} = this.props;
        const {dataCode, _manifest} = this.state;
        let FormData = await this.getPhotoReceivingGoods();
        postBlob('/inbounds/'+currentASN+'/'+_manifest.id+'/reports', [
            // element with property `filename` will be transformed into `file` in form data
            { name : 'report', data: this.state.reasonOption},
            {name :'description', data : this.state.otherReason},
            // custom content type
            ...FormData,
          ], this.listenToProgressUpload).then(result=>{
            if(typeof result !== 'object' && result === 'Report submitted successfully'){
                this.props.setBottomBar(false);
                this.props.setReportedASN(currentASN);
                this.props.addPhotoReportPostpone(null);
                this.props.setReportedManifest(dataCode);
                this.props.navigation.navigate('Manifest');
            } else {
              if(typeof result === 'object'){
                if(result.errors !== undefined){
                    let errors = '';
                    result.errors.forEach(element => {
                        errors += element.msg + ' ';
                    });
                    this.setState({errors:errors});
                } else {
                    this.setState({errors: result.error});
                }
              } else {
                this.setState({errors: result});
              }
            }
          });
    }
    onChangeReasonInput = (value) => {
        this.setState({
          otherReason: value,
        });
      };

    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Report</Text>
                    <CheckBox
                        title='Damage goods'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.reasonOption === 'damage-goods'}
                        onPress={() => this.handleReasonOptions('damage-goods')}
                    />
                    <CheckBox
                        title='Item missing'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.reasonOption === 'missing-item'}
                        onPress={() => this.handleReasonOptions('missing-item')}
                    />
                                        <CheckBox
                        title='Expired Date'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checkedColor='#2A3386'
                        uncheckedColor='#6C6B6B'
                        size={25}
                        containerStyle={styles.checkbox}
                        checked={this.state.reasonOption === 'exp-date'}
                        onPress={() => this.handleReasonOptions('exp-date')}
                    />
                                        <CheckBox
                        title='Other'
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
                    <Text style={[styles.title, {marginBottom: 5}]}>Description :</Text>
                    <TextInput
                            style={styles.textInput}
                            onChangeText={this.onChangeReasonInput}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                            value={this.state.otherReason}
                        />

                        <View style={{alignItems: 'center',justifyContent: 'center', marginVertical: 20}}>
                        <Avatar onPress={()=>{
                                       if(this.props.photoReportID === null || this.props.photoReportID === this.state.dataCode){
                                    this.props.setBottomBar(false);
                                    this.props.navigation.navigate('SingleCamera')              
                                    }
                                }}
                                        size={79}
                                        ImageComponent={() => (
                                        <>
                                            <IconPhoto5 height="40" width="40" fill="#fff" />
                                            {(this.props.photoReportPostpone !== null && (this.props.photoReportID !== null && this.props.photoReportID === this.state.dataCode)) && (
                                            <Checkmark
                                                height="20"
                                                width="20"
                                                fill="#fff"
                                                style={styles.checkmark}
                                            />
                                            )}
                                        </>
                                        )}
                                        imageProps={{
                                        containerStyle: {
                                            alignItems: 'center',
                                            paddingTop: 18,
                                            paddingBottom: 21,
                                        },
                                        }}
                                        overlayContainerStyle={{
                                        backgroundColor: this.props.photoReportID !== null && this.props.photoReportID !== this.state.dataCode ? 'grey' : this.props.photoReportPostpone !== null 
                                            ? '#17B055'
                                            : '#F07120',
                                        flex: 2,
                                        borderRadius: 5,
                                        }}/>
                                        <View style={{marginVertical: 5}}>
                                        <LinearProgress value={this.state.progressLinearVal} color="primary" style={{width:80}} variant="determinate"/>
                                        </View>
                                        <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B'}}>Photo Proof Container</Text>
                                        {this.state.errors !== '' && ( <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '400',color:'red'}}>{this.state.errors}</Text>)}
                                </View>
                                <Button
              containerStyle={{flexShrink:1}}
              buttonStyle={styles.navigationButton}
              titleStyle={styles.deliveryText}
              onPress={this.handleSubmit}
              title="Submit"
              disabled={this.props.photoReportPostpone === null || (this.props.photoReportID !== null && this.props.photoReportID !== this.state.dataCode) || this.state.reasonOption === '' ? true : false}
              />
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
    deliveryText: {
        ...Mixins.h6,
        lineHeight: 27,
        fontWeight:'600',
        color: '#ffffff',
      },
      navigationButton: {
        backgroundColor: '#F07120',
        borderRadius: 5,
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
    textInput: {
        ...Mixins.subtitle3,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        padding: 5,
        marginTop: 5,
      },
      checkmark: {
        position: 'absolute', 
        bottom: 5, 
        right: 5
      },
});

const mapStateToProps = (state) => {
    return {
        manifestList: state.originReducer.manifestList,
        photoReportPostpone: state.originReducer.photoReportPostpone,
        currentASN : state.originReducer.filters.currentASN,
        photoReportID: state.originReducer.photoReportID,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setBottomBar: (toggle) => {
            return dispatch({type: 'BottomBar', payload: toggle});
        },
        setReportedManifest: (data) => {
            return dispatch({type:'ReportedManifest', payload: data});
        },
        setReportedASN: (data) => {
            return dispatch({type:'ReportedASN', payload: data});
        },
        addPhotoReportPostpone: (uri) => dispatch({type: 'PhotoReportPostpone', payload: uri}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportManifest);