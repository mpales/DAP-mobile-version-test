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
  Badge,
} from 'react-native-elements';
import {connect} from 'react-redux';
//icon
import Mixins from '../../../mixins';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import ArrowDown from '../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';
import Incremental from '../../../assets/icon/plus-mobile.svg';
import Decremental from '../../../assets/icon/min-mobile.svg';
import {postBlob} from '../../../component/helper/network';
import UploadTooltip from '../../../component/include/upload-tooltip';
import Svg, {
  Path,
  Rect,
} from 'react-native-svg';
import Banner from '../../../component/banner/banner';
import RNFetchBlob from 'rn-fetch-blob';
class ReportManifest extends React.Component {
  constructor(props) {
    super(props);
    progressLinear = null;
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
      overlayProgress: false,
      qtyreported: '0',
      submitPhoto: false,
    };
    this.getPhotoReceivingGoods.bind(this);
    this.listenToProgressUpload.bind(this);
    this.handleSubmit.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {inboundList, navigation, manifestList, loadFromGallery} = props;
    const {dataCode} = state;
    if (dataCode === '0') {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.dataCode !== undefined
      ) {
        loadFromGallery({gtype: 'report', gID: routes[index].params.dataCode});
        // for prototype only should be params ID from backend
        let manifest = manifestList.find(
          (element) => element.pId === routes[index].params.dataCode,
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
    const {overlayProgress} = this.state;
    this.setState({
      progressLinearVal: (1 / total) * written,
     
    });
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
    let FormData = await this.getPhotoReceivingGoods();
    let intOption = '0';
    switch (reasonOption) {
      case 'damage-goods':
        intOption = '1';
        break;
      case 'missing-item':
        intOption = '2';
        break;
      case 'excess-item':
        intOption = '3';
        break;
      case 'other':
        intOption = '4';
        break;
      default:
        break;
    }
    let metafield =
      reasonOption !== 'other'
        ? [
            {name: 'report', data: intOption},
            {name: 'description', data: this.state.otherReason},
            {name: 'qty', data: qtyreported},
          ]
        : [
            {name: 'report', data: intOption},
            {name: 'description', data: this.state.otherReason},
          ];
    postBlob(
      '/inboundsMobile/' + currentASN + '/' + _manifest.pId + '/reports',
      [
        // element with property `filename` will be transformed into `file` in form data
        ...metafield,
        // custom content type
        ...FormData,
      ],
      this.listenToProgressUpload,
    ).then((result) => {
      if (
        typeof result !== 'object' &&
        result === 'Report submitted successfully'
      ) {
        this.setState({errors: '', overlayProgress: false});
        this.props.setBottomBar(false);
        this.props.setReportedASN(currentASN);
        this.props.addPhotoReportPostpone(null);
        this.props.setReportedManifest(dataCode);
        const {routes, index} = this.props.navigation.dangerouslyGetState();
        if (routes[index - 1].name === 'SupervisorMode') {
          this.props.navigation.navigate('SupervisorMode');
        } else {
          this.props.navigation.navigate('Manifest');
        }
      } else {
        if (typeof result === 'object') {
          if (result.errors !== undefined) {
            let errors = '';
            result.errors.forEach((element) => {
              errors += element.msg + ' ';
            });
            this.setState({errors: errors, overlayProgress: false});
          } else {
            this.setState({errors: result.error, overlayProgress: false});
          }
        } else {
          this.setState({errors: result, overlayProgress: false});
        }
      }
    });
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
            {this.state.reasonOption !== 'other' && (
              <View style={{marginBottom: 5, flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'column',
                    marginRight: 15,
                    paddingVertical: 20,
                  }}>
                  <Text style={styles.title}>Affected Quantity</Text>
                </View>
                <Input
                  containerStyle={{
                    paddingHorizontal: 0,
                    marginHorizontal: 0,
                    flexShrink: 1,
                    paddingTop: 15,
                  }}
                  inputContainerStyle={{borderBottomWidth: 0}}
                  style={{
                    ...styles.textInput,
                    margin: 0,
                    fontSize: 18,
                    fontWeight: '700',
                  }}
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
                          flex: 1,
                          marginTop: 5,
                          marginLeft: 15,
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <Incremental
                          height="30"
                          width="30"
                          style={{flexShrink: 1}}
                          onPress={() => {
                            const {qtyreported} = this.state;
                            let qty = parseInt(qtyreported);
                            this.setState({
                              qtyreported:
                                qtyreported === '' ||
                                isNaN(qty) === true ||
                                qty < 0
                                  ? '0'
                                  : '' + (qty + 1),
                            });
                          }}
                        />
                      </View>
                    );
                  }}
                  leftIcon={() => {
                    return (
                      <View
                        style={{
                          flexDirection: 'column',
                          backgroundColor: 'transparent',
                          flex: 1,
                          marginTop: 5,
                          marginRight: 15,
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <Decremental
                          height="30"
                          width="30"
                          style={{flexShrink: 1}}
                          onPress={() => {
                            const {qtyreported} = this.state;
                            let qty = parseInt(qtyreported);
                            this.setState({
                              qtyreported:
                                qtyreported === '' ||
                                isNaN(qty) === true ||
                                qty <= 0
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
            )}
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
                  if(this.state.overlayProgress === true){
                    this.progressLinear.toggle();
                  } else {
                      if (
                        this.props.photoReportID === null ||
                        this.props.photoReportID === this.state.dataCode
                      ) {
                        this.props.setBottomBar(false);
                        this.props.navigation.navigate('SingleCamera');
                      }
                  }
                }}
                size={79}
                ImageComponent={() => (
                  <>
                      {this.state.overlayProgress === true ? (
                    <Svg width="79" height="79" viewBox="0 0 79 79" fill="none">
                    <Path transform={"rotate("+(this.state.progressLinearVal * 360 )+" 39 40)"} fill-rule="evenodd" clip-rule="evenodd" d="M12.165 43C13.6574 56.4999 25.1026 67 39.0003 67C53.9119 67 66.0003 54.9117 66.0003 40C66.0003 25.0883 53.9119 13 39.0003 13V16C52.2551 16 63.0003 26.7452 63.0003 40C63.0003 53.2548 52.2551 64 39.0003 64C26.7614 64 16.6622 54.8389 15.1859 43H12.165Z" fill="white"/>
                    <Path d="M44.1818 49.75V52H32.8182V49.75H44.1818ZM44.1818 45.25H32.8182V47.5H44.1818V45.25ZM32.8182 37.375V43H44.1818V37.375H51L38.5 25L26 37.375H32.8182Z" fill="white"/>
                    </Svg>
                 ) : (<IconPhoto5 height="40" width="40" fill="#fff" />)}
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
                    alignItems: this.state.overlayProgress ? 'flex-start' : 'center',
                    paddingTop: this.state.overlayProgress ? 0 : 18,
                    paddingBottom: this.state.overlayProgress ? 0 : 21,
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
                <UploadTooltip
                      ref={(ref)=>this.progressLinear = ref}
                  overlayLinearProgress={{
                    value: this.state.progressLinearVal,
                    color: '#F1811C',
                    variant: 'determinate',
                    style: {
                      height: 13,
                      backgroundColor: 'white',
                      borderRadius: 10,
                    },
                  }}
                  value={this.state.progressLinearVal}
                  color="primary"
                  style={{width: 80}}
                  variant="determinate"
                  enabled={this.state.overlayProgress}
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
              onPressIn={()=>{this.setState({overlayProgress: true})}}
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
    manifestList: state.originReducer.manifestList,
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
    setReportedManifest: (data) => {
      return dispatch({type: 'ReportedManifest', payload: data});
    },
    setReportedASN: (data) => {
      return dispatch({type: 'ReportedASN', payload: data});
    },
    addPhotoReportPostpone: (uri) =>
      dispatch({type: 'PhotoReportPostpone', payload: uri}),
    loadFromGallery: (action) => {
      return dispatch({type: 'loadFromGallery', payload: action});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportManifest);
