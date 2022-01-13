import React from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import {CheckBox, Input, Avatar, Button} from 'react-native-elements';
import {connect} from 'react-redux';
//icon
import Mixins from '../../../mixins';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import Incremental from '../../../assets/icon/plus-mobile.svg';
import Decremental from '../../../assets/icon/min-mobile.svg';
import UploadTooltip from '../../../component/include/upload-tooltip';
import Svg, {Path} from 'react-native-svg';
import {postBlob} from '../../../component/helper/network';
import Banner from '../../../component/banner/banner';
import RNFetchBlob from 'rn-fetch-blob';

class ReportManifest extends React.Component {
  progressLinear = null;
  constructor(props) {
    super(props);
    this.state = {
      isShowConfirm: false,
      deliveryOption: null,
      reasonOption: '',
      otherReason: '',
      dataCode: '0',
      _task: null,
      errors: '',
      progressLinearVal: 0,
      overlayProgress: false,
      qtyreported: 0,
      submitPhoto: false,
    };
    this.handleSubmit.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {outboundList, navigation, loadFromGallery} = props;
    const {dataCode} = state;
    if (dataCode === '0') {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.dataCode !== undefined
      ) {
        loadFromGallery({gtype: 'report', gID: routes[index].params.dataCode});
        // for prototype only should be params ID from backend
        let manifest = outboundList.find(
          (element) =>
            element.pick_task_product_id === routes[index].params.dataCode,
        );
        return {
          ...state,
          dataCode: routes[index].params.dataCode,
          _task: manifest,
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
    const {currentTask} = this.props;
    const {_task, qtyreported, reasonOption} = this.state;
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
      case 'exp-date':
        intOption = '4';
        break;
      case 'other':
        intOption = '5';
        break;
      default:
        break;
    }
    let metafield =
      reasonOption !== 'other' &&
      isNaN(qtyreported) === false &&
      qtyreported > 0
        ? [
            {name: 'type', data: intOption},
            {name: 'description', data: this.state.otherReason},
            {name: 'qty', data: qtyreported.toString()},
          ]
        : [
            {name: 'type', data: intOption},
            {name: 'description', data: this.state.otherReason},
          ];
    postBlob(
      '/outboundMobile/pickTask/' +
        currentTask +
        '/product/' +
        _task.pick_task_product_id +
        '/reports',
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
        result === 'Pick Job successfully reported'
      ) {
        this.setState({errors: '', overlayProgress: false});
        this.props.setBottomBar(true);
        this.props.addPhotoReportPostpone(null);
        const {routes, index} = this.props.navigation.dangerouslyGetState();
        this.props.navigation.navigate('List');
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

  handleInput = (text) => {
    this.setState({
      qtyreported: isNaN(text)
        ? 0
        : /\s/g.test(text)
        ? ''
        : text === ''
        ? text
        : parseInt(text),
    });
  };

  handlePlus = () => {
    this.setState({
      qtyreported: this.state.qtyreported + 1,
    });
  };

  handleMinus = () => {
    if (this.state.qtyreported > 0) {
      this.setState({
        qtyreported: this.state.qtyreported - 1,
      });
    }
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
              title="Expired Date"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              size={25}
              containerStyle={styles.checkbox}
              checked={this.state.reasonOption === 'exp-date'}
              onPress={() => this.handleReasonOptions('exp-date')}
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
              <View style={styles.quantityContainer}>
                <Text style={styles.title}>Affected Quantity</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Button
                    title="-"
                    buttonStyle={styles.roundButton}
                    onPress={this.handleMinus}
                  />
                  <TextInput
                    value={this.state.qtyreported.toString()}
                    textAlign="center"
                    style={styles.inputStyle}
                    keyboardType="number-pad"
                    onChangeText={(text) => this.handleInput(text)}
                  />
                  <Button
                    title="+"
                    buttonStyle={styles.roundButton}
                    onPress={this.handlePlus}
                  />
                </View>
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

            <View style={styles.photoContainer}>
              <Avatar
                onPress={() => {
                  if (this.state.overlayProgress === true) {
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
                      <Svg
                        width="79"
                        height="79"
                        viewBox="0 0 79 79"
                        fill="none">
                        <Path
                          transform={
                            'rotate(' +
                            this.state.progressLinearVal * 360 +
                            ' 39 40)'
                          }
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.165 43C13.6574 56.4999 25.1026 67 39.0003 67C53.9119 67 66.0003 54.9117 66.0003 40C66.0003 25.0883 53.9119 13 39.0003 13V16C52.2551 16 63.0003 26.7452 63.0003 40C63.0003 53.2548 52.2551 64 39.0003 64C26.7614 64 16.6622 54.8389 15.1859 43H12.165Z"
                          fill="white"
                        />
                        <Path
                          d="M44.1818 49.75V52H32.8182V49.75H44.1818ZM44.1818 45.25H32.8182V47.5H44.1818V45.25ZM32.8182 37.375V43H44.1818V37.375H51L38.5 25L26 37.375H32.8182Z"
                          fill="white"
                        />
                      </Svg>
                    ) : (
                      <IconPhoto5 height="40" width="40" fill="#fff" />
                    )}
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
                    alignItems: this.state.overlayProgress
                      ? 'flex-start'
                      : 'center',
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
                  ref={(ref) => (this.progressLinear = ref)}
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
                Photo Proof Container
              </Text>
              {/* {this.state.errors !== '' && ( <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '400',color:'red'}}>{this.state.errors}</Text>)} */}
            </View>
            <Button
              containerStyle={{flexShrink: 1}}
              buttonStyle={styles.navigationButton}
              titleStyle={styles.deliveryText}
              onPressIn={() => {
                this.setState({overlayProgress: true});
              }}
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
    marginBottom: 10,
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
  checkbox: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    margin: 0,
    marginLeft: 0,
    paddingHorizontal: 0,
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
  quantityContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputStyle: {
    width: 70,
    height: 40,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ABABAB',
  },
  roundButton: {
    ...Mixins.bgButtonPrimary,
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    outboundList: state.originReducer.outboundList,
    photoReportPostpone: state.originReducer.photoReportPostpone,
    currentTask: state.originReducer.filters.currentTask,
    photoReportID: state.originReducer.photoReportID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    addPhotoReportPostpone: (uri) => {
      return dispatch({type: 'PhotoReportPostpone', payload: uri});
    },
    loadFromGallery: (action) => {
      return dispatch({type: 'loadFromGallery', payload: action});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportManifest);
