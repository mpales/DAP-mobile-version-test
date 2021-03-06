import React from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  PixelRatio,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  CheckBox,
  Input,
  Avatar,
  Button,
  LinearProgress,
} from 'react-native-elements';
import {connect} from 'react-redux';
//icon
import Mixins from '../../../mixins';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import ArrowDown from '../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';
import {postBlob} from '../../../component/helper/network';
import Banner from '../../../component/banner/banner';
import RNFetchBlob from 'rn-fetch-blob';
class ReportManifest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowConfirm: false,
      picker: '',
      deliveryOption: null,
      reasonOption: '',
      otherReason: '',
      dataCode: '0',
      _manifest: null,
      errors: '',
      progressLinearVal: 0,
      qtyreported: '0',
      submitPhoto: false,
    };
    this.getPhotoReceivingGoods.bind(this);
    this.listenToProgressUpload.bind(this);
    this.handleSubmit.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {inboundList, navigation, VASList} = props;
    const {dataCode} = state;
    if (dataCode === '0') {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.dataCode !== undefined
      ) {
        // for prototype only should be params ID from backend
        let manifest = VASList.find(
          (element) => element.number === routes[index].params.dataCode,
        );
        return {
          ...state,
          dataCode: routes[index].params.dataCode,
          _manifest: manifest,
        };
      }
    }
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.keyStack !== nextProps.keyStack) {
      if (nextProps.keyStack === 'ReportManifest') {
        this.props.setBottomBar(false);
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if (
          routes[index].params !== undefined &&
          routes[index].params.submitPhoto !== undefined &&
          routes[index].params.submitPhoto === true
        ) {
          this.setState({submitPhoto: true});
        }
        return false;
      }
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.dataCode !== this.state.dataCode) {
      this.props.addPhotoReportPostpone(null);
    }
    if (
      prevState.submitPhoto !== this.state.submitPhoto &&
      this.state.submitPhoto === true
    ) {
      if (this.props.photoReportPostpone !== null) {
        this.setState({submitPhoto: false});
      } else {
        this.setState({
          submitPhoto: false,
          errors: 'take a Photo Report before continue process',
        });
      }
    }
  }
  handleDeliveryOptions = (selectedValue) => {
    this.setState({
      ...this.state,
      reasonOption: selectedValue,
    });
  };

  handleReasonOptions = (selectedValue) => {
    this.setState({
      ...this.state,
      reasonOption: selectedValue,
    });
  };
  listenToProgressUpload = (written, total) => {
    console.log(written);
    console.log(total);
    this.setState({progressLinearVal: (1 / total) * written});
  };
  getPhotoReceivingGoods = async () => {
    const {photoReportPostpone} = this.props;
    let formdata = [];
    for (let index = 0; index < photoReportPostpone.length; index++) {
      let name,
        filename,
        path,
        type = '';
      await RNFetchBlob.fs
        .stat(
          Platform.OS === 'ios'
            ? photoReportPostpone[index].replace('file://', '')
            : photoReportPostpone[index],
        )
        .then((FSStat) => {
          name = FSStat.filename.replace('.', '-');
          filename = FSStat.filename;
          path = FSStat.path;
          type = FSStat.type;
        });
      if (type === 'file')
        formdata.push({
          name: 'photos',
          filename: filename,
          type: 'image/jpg',
          data: Platform.OS === 'ios' ? path : RNFetchBlob.wrap(path),
        });
    }
    return formdata;
  };
  handleSubmit = async () => {
    const {currentASN} = this.props;
    const {dataCode, _manifest, qtyreported, reasonOption} = this.state;
    this.props.setBottomBar(false);
    //    this.props.setReportedASN(currentASN);
    this.props.addPhotoReportPostpone(null);
    this.props.setReportedVAS(dataCode);
    this.props.navigation.navigate('List');
    // let FormData = await this.getPhotoReceivingGoods();
    // let intOption = '0';
    // switch (reasonOption) {
    //     case 'damage-goods':
    //         intOption = '1';
    //         break;
    //     case 'missing-item':
    //         intOption = '2';
    //         break;
    //     case 'excess-item':
    //         intOption = '3';
    //         break;
    //     case 'other':
    //         intOption = '4';
    //         break;
    //     default:
    //         break;
    // }
    // postBlob('/inboundsMobile/'+currentASN+'/'+_manifest.pId+'/reports', [
    //     // element with property `filename` will be transformed into `file` in form data
    //     { name : 'report', data: intOption},
    //     {name :'description', data : this.state.otherReason},
    //     {name : 'qty', data : qtyreported},
    //     // custom content type
    //     ...FormData,
    //   ], this.listenToProgressUpload).then(result=>{
    //     if(typeof result !== 'object' && result === 'Report submitted successfully'){
    //         this.props.setBottomBar(false);
    //         this.props.setReportedASN(currentASN);
    //         this.props.addPhotoReportPostpone(null);
    //         this.props.setReportedManifest(dataCode);
    //         const {routes,index} = this.props.navigation.dangerouslyGetState();
    //         if(routes[index-1].name === 'SupervisorMode'){
    //             this.props.navigation.navigate('SupervisorMode');
    //         } else {
    //             this.props.navigation.navigate('Manifest')
    //         }
    //     } else {
    //       if(typeof result === 'object'){
    //         if(result.errors !== undefined){
    //             let errors = '';
    //             result.errors.forEach(element => {
    //                 errors += element.msg + ' ';
    //             });
    //             this.setState({errors:errors});
    //         } else {
    //             this.setState({errors: result.error});
    //         }
    //       } else {
    //         this.setState({errors: result});
    //       }
    //     }
    //   });
  };
  onChangeReasonInput = (value) => {
    this.setState({
      otherReason: value,
    });
  };

  render() {
    return (
      <>
        {this.state.errors !== '' && (
          <Banner
            title={this.state.errors}
            backgroundColor="#F1811C"
            closeBanner={() => {
              this.setState({errors: ''});
            }}
          />
        )}
        <ScrollView style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Report</Text>
            <CheckBox
              title="Damage Item"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              size={25}
              containerStyle={styles.checkbox}
              checked={this.state.reasonOption === 'damage-goods'}
              onPress={() => this.handleReasonOptions('damage-goods')}
            />
            <CheckBox
              title="Item missing"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              size={25}
              containerStyle={styles.checkbox}
              checked={this.state.reasonOption === 'missing-item'}
              onPress={() => this.handleReasonOptions('missing-item')}
            />
            <CheckBox
              title="Excess Item"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              size={25}
              containerStyle={styles.checkbox}
              checked={this.state.reasonOption === 'excess-item'}
              onPress={() => this.handleReasonOptions('excess-item')}
            />
            <CheckBox
              title="Other"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              size={25}
              containerStyle={styles.checkbox}
              checked={this.state.reasonOption === 'other'}
              onPress={() => this.handleReasonOptions('other')}
            />
          </View>
          <View style={styles.contentContainer}>
            <View style={{marginBottom: 5}}>
              <Text style={styles.title}>Quantity Item:</Text>
              <Input
                containerStyle={{paddingHorizontal: 0, marginHorizontal: 0}}
                inputContainerStyle={{borderBottomWidth: 0}}
                style={{...styles.textInput, margin: 0}}
                keyboardType="number-pad"
                inputStyle={{margin: 0}}
                onChangeText={(val) => {
                  this.setState({qtyreported: val});
                }}
                multiline={false}
                numberOfLines={1}
                value={this.state.qtyreported}
                rightIcon={() => {
                  return (
                    <View
                      style={{
                        flexDirection: 'column',
                        backgroundColor: 'transparent',
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        flex: 1,
                        minWidth: 30,
                      }}>
                      <ArrowDown
                        width="20"
                        height="15"
                        fill="black"
                        style={{
                          flexShrink: 1,
                          marginBottom: 5,
                          transform: [{rotate: '180deg'}],
                        }}
                        onPress={() => {
                          const {qtyreported} = this.state;
                          let qty = parseInt(qtyreported);
                          this.setState({
                            qtyreported:
                              qtyreported === '' || qty === NaN
                                ? '0'
                                : '' + (qty + 1),
                          });
                        }}
                      />
                      <ArrowDown
                        width="20"
                        height="15"
                        fill="black"
                        style={{flexShrink: 1}}
                        onPress={() => {
                          const {qtyreported} = this.state;
                          let qty = parseInt(qtyreported);
                          this.setState({
                            qtyreported:
                              qtyreported === '' || qty === NaN
                                ? '0'
                                : '' + (qty - 1),
                          });
                        }}
                      />
                    </View>
                  );
                }}
              />
            </View>
            <View style={{marginBottom: 5}}>
              <Text style={styles.title}>Remarks :</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={this.onChangeReasonInput}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                value={this.state.otherReason}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
              }}>
              <Avatar
                onPress={() => {
                  if (
                    this.props.photoReportID === null ||
                    this.props.photoReportID === this.state.dataCode
                  ) {
                    this.props.setBottomBar(false);
                    this.props.navigation.navigate('SingleCamera');
                  }
                }}
                size={79}
                ImageComponent={() => (
                  <>
                    <IconPhoto5 height="40" width="40" fill="#fff" />
                    {this.props.photoReportPostpone !== null &&
                      this.props.photoReportID !== null &&
                      this.props.photoReportID === this.state.dataCode && (
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
                  backgroundColor:
                    this.props.photoReportID !== null &&
                    this.props.photoReportID !== this.state.dataCode
                      ? 'grey'
                      : this.props.photoReportPostpone !== null
                      ? '#17B055'
                      : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
              />
              <View style={{marginVertical: 5}}>
                <LinearProgress
                  value={this.state.progressLinearVal}
                  color="primary"
                  style={{width: 80}}
                  variant="determinate"
                />
              </View>
              <Text
                style={{
                  ...Mixins.subtitle3,
                  lineHeight: 21,
                  fontWeight: '600',
                  color: '#6C6B6B',
                }}>
                Photo Proof
              </Text>
              {/* {this.state.errors !== '' && ( <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '400',color:'red'}}>{this.state.errors}</Text>)} */}
            </View>
            <Button
              containerStyle={{flexShrink: 1}}
              buttonStyle={styles.navigationButton}
              titleStyle={styles.deliveryText}
              onPress={this.handleSubmit}
              title="Submit"
              disabled={
                this.props.photoReportPostpone === null ||
                (this.props.photoReportID !== null &&
                  this.props.photoReportID !== this.state.dataCode) ||
                this.state.reasonOption === ''
                  ? true
                  : false
              }
            />
          </View>
        </ScrollView>
      </>
    );
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
    fontWeight: '600',
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
    right: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    VASList: state.originReducer.VASList,
    photoReportPostpone: state.originReducer.photoReportPostpone,
    currentASN: state.originReducer.filters.currentASN,
    photoReportID: state.originReducer.photoReportID,
    keyStack: state.originReducer.filters.keyStack,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setReportedVAS: (data) => {
      return dispatch({type: 'ReportedVAS', payload: data});
    },
    addPhotoReportPostpone: (uri) =>
      dispatch({type: 'PhotoReportPostpone', payload: uri}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportManifest);
