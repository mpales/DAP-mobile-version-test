import React from 'react';
import {
  Text,
  Button,
  Input,
  Avatar,
  Image,
  CheckBox,
  LinearProgress,
  Overlay,
} from 'react-native-elements';
import Svg, {
  Path,
  Rect,
} from 'react-native-svg';
import {View, ScrollView, Platform, PixelRatio} from 'react-native';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import moment from 'moment';
import IconPhoto5 from '../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import ProgressIcon from '../../../assets/icon/Group 5283mobile.svg';
import WarehouseIlustration from '../../../assets/icon/Group 4968warehouse_ilustrate_mobile.svg';
import {getData, putBlob, postData} from '../../../component/helper/network';
import Loading from '../../../component/loading/loading';
import UploadProgress from '../../../component/include/upload-progress';
import UploadTooltip from '../../../component/include/upload-tooltip';
import Banner from '../../../component/banner/banner';
import RNFetchBlob from 'rn-fetch-blob';
class Acknowledge extends React.Component {
  progressLinear = null;
  constructor(props) {
    super(props);
    this.state = {
      bottomSheet: false,
      isShowSignature: false,
      receivingNumber: null,
      data: null,
      errors: '',
      labelerror: false,
      progressLinearVal: 0,
      ISOreceivedDate: null,
      updateData: false,
      submitPhoto: false,
      submitDetail: false,
      updateParams: false,
      overlayProgress: false,
    };
    this.toggleCheckBox.bind(this);
    this.uploadSubmittedPhoto.bind(this);
    this.getPhotoReceivingGoods.bind(this);
    this.listenToProgressUpload.bind(this);
    this.goToList.bind(this);
    this.toggleStartReceiving.bind(this);
    this.detailSubmited.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {inboundList, navigation, loadFromGallery} = props;
    const {receivingNumber} = state;
    const {routes, index} = navigation.dangerouslyGetState();
    if (
      receivingNumber === null &&
      routes[index].params !== undefined &&
      routes[index].params.number !== undefined
    ) {
      loadFromGallery({gtype: 'proof', gID: routes[index].params.number});
      return {...state, receivingNumber: routes[index].params.number};
    }

    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.receivingNumber === null) {
      this.props.navigation.goBack();
      return false;
    }
    if (this.props.keyStack !== nextProps.keyStack) {
      if (
        nextProps.keyStack === 'ReceivingDetail' &&
        this.props.keyStack === 'SingleCamera'
      ) {
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if (
          routes[index].params !== undefined &&
          routes[index].params.submitPhoto !== undefined &&
          routes[index].params.submitPhoto === true
        ) {
          this.setState({
            updateData: true,
            submitPhoto: true,
            errors: '',
            labelerror: false,
          });
        } else {
          this.setState({updateData: true, errors: '', labelerror: false});
        }
        this.props.setBottomBar(false);
        return false;
      } else if (nextProps.keyStack === 'ReceivingDetail') {
        this.setState({updateData: true, errors: '', labelerror: false});
        return false;
      }
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.updateData === true) {
      const result = await getData(
        'inboundsMobile/' + this.state.receivingNumber,
      );
      if (typeof result === 'object' && result.errors === undefined) {
        this.setState({updateData: false, data: result});
      } else {
        this.props.navigation.goBack();
      }
      let activeReceipt = result.inbound_receipt.find(
        (o) => o.current_active === true,
      );
      const resultphoto = await getData(
        'inboundsMobile/' + this.state.receivingNumber + '/photosIds',
      );
      if (typeof resultphoto === 'object' && resultphoto.error === undefined) {
        let submitDetail = false;
        for (
          let index = 0;
          index < resultphoto.inbound_photos.length;
          index++
        ) {
          const element = resultphoto.inbound_photos[index].inbound_receipt_id;
          if (activeReceipt !== undefined && activeReceipt.id === element) {
            if (
              resultphoto.inbound_photos[index].status === 2 &&
              result.status === 3
            ) {
              submitDetail = true;
            } else if (
              resultphoto.inbound_photos[index].status === 3 &&
              result.status === 4
            ) {
              submitDetail = true;
            }
          }
        }
        this.setState({submitDetail: submitDetail});
      }
    }
    if (
      prevState.submitPhoto !== this.state.submitPhoto &&
      this.state.submitPhoto === true
    ) {
      if (this.props.photoProofPostpone !== null) {
        this.setState({submitPhoto: false, overlayProgress: true});
        await this.uploadSubmittedPhoto();
      } else {
        this.setState({
          submitPhoto: false,
          errors: 'take a Photo Proof before continue process',
          labelerror: true,
        });
      }
    }
  }

  async componentDidMount() {
    const result = await getData(
      'inboundsMobile/' + this.state.receivingNumber,
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({data: result});
    } else {
      this.props.navigation.goBack();
    }
    let activeReceipt = result.inbound_receipt.find(
      (o) => o.current_active === true,
    );
    const resultphoto = await getData(
      'inboundsMobile/' + this.state.receivingNumber + '/photosIds',
    );
    if (typeof resultphoto === 'object' && resultphoto.error === undefined) {
      let submitDetail = false;
      for (let index = 0; index < resultphoto.inbound_photos.length; index++) {
        const element = resultphoto.inbound_photos[index].inbound_receipt_id;
        if (activeReceipt !== undefined && activeReceipt.id === element) {
          if (
            resultphoto.inbound_photos[index].status === 2 &&
            result.status === 3
          ) {
            submitDetail = true;
          } else if (
            resultphoto.inbound_photos[index].status === 3 &&
            result.status === 4
          ) {
            submitDetail = true;
          }
        }
      }
      this.setState({submitDetail: submitDetail});
    }
  }

  toggleCheckBox = () => {
    this.setState({
      acknowledged: !this.state.acknowledged,
    });
  };
  checkedIcon = () => {
    return (
      <View style={styles.checked}>
        <Checkmark height="14" width="14" fill="#FFFFFF" />
      </View>
    );
  };

  uncheckedIcon = () => {
    return <View style={styles.unchecked} />;
  };
  toggleStartReceiving = () => {
    this.setState({
      startReceiving: true,
    });
  };
  getPhotoReceivingGoods = async () => {
    const {photoProofPostpone} = this.props;
    let formdata = [];
    const dirs = RNFetchBlob.fs.dirs;
    for (let index = 0; index < photoProofPostpone.length; index++) {
      let name,
        filename,
        path,
        type = '';

      await RNFetchBlob.fs
        .stat(
          Platform.OS === 'ios'
            ? photoProofPostpone[index].replace('file://', '')
            : photoProofPostpone[index],
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
  goToList = () => {
    this.props.setBottomBar(false);
    this.props.setActiveASN(this.state.receivingNumber);
    this.props.setCurrentASN(this.state.receivingNumber);
    this.props.navigation.navigate({
      name: 'Manifest',
      params: {
        number: this.state.receivingNumber,
      },
    });
  };
  listenToProgressUpload = (written, total) => {
    this.setState({progressLinearVal: (1 / total) * written});
  };
  detailSubmited = async () => {
    const {receivingNumber} = this.state;
    if (this.state.data.status >= 5) {
      this.props.navigation.navigate({
        name: 'Manifest',
        params: {
          number: receivingNumber,
        },
      });
    } else {
      let uploadCategory =
        this.state.data.status === 3 ? 'receiving' : 'processing';
      const result = await postData(
        'inboundsMobile/' + receivingNumber + '/' + uploadCategory,
      );
      console.log(result);
      if (
        (typeof result !== 'object' &&
          (result === 'Inbound status changed to received' ||
            result === 'Inbound status changed to processing')) ||
        (typeof result === 'object' &&
          ((result.msg !== undefined &&
            result.msg === 'Inbound status changed to processing') ||
            (result.message !== undefined &&
              result.message === 'Inbound status changed to received')))
      ) {
        if (this.state.data.status === 3) {
          this.setState({
            updateData: true,
            submitDetail: false,
            errors: '',
            labelerror: false,
            ISOreceivedDate: result.receivedDate,
          });
        } else {
          this.props.setActiveASN(receivingNumber);
          this.props.setCurrentASN(receivingNumber);
          this.props.setReportedManifest(null);
          this.props.setItemScanned([]);
          this.props.setManifestList([]);
          this.setState({
            updateData: true,
            submitDetail: false,
            errors: '',
            labelerror: false,
          });
          this.props.navigation.navigate({
            name: 'Manifest',
            params: {
              number: receivingNumber,
            },
          });
        }
      } else {
        if (typeof result === 'object') {
          this.setState({errors: result.error, labelerror: true});
        } else {
          this.setState({errors: result, labelerror: true});
        }
      }
    }
  };
  getBackgroundStatusColor = (statuscode) => {
    let status = '#ABABAB';
    switch (statuscode) {
      case 3:
        status = '#ABABAB';
        labelstatus = 'Waiting';
        break;
      case 4:
        status = '#F8B511';
        labelstatus = 'Received';
        break;
      case 5:
        status = '#F1811C';
        labelstatus = 'Processing';
        break;
      case 6:
        status = '#17B055';
        labelstatus = 'Processed';
        break;
      case 7:
        status = '#E03B3B';
        labelstatus = 'Cancelled';
        break;
      case 8:
        status = '#17B055';
        labelstatus = 'Putaway';
        break;
      case 9:
        status = '#17B055';
        labelstatus = 'Completed';
        break;
    }
    return status;
  };
  uploadSubmittedPhoto = async () => {
    const {photoProofPostpone} = this.props;
    let FormData = await this.getPhotoReceivingGoods();
    let uploadCategory =
      this.state.data.status === 3 ? 'receiving/first' : 'processing';
    console.log(FormData);
    putBlob(
      '/inboundsMobile/' + this.state.receivingNumber + '/' + uploadCategory,
      [
        // element with property `filename` will be transformed into `file` in form data
        //{ name : 'receiptNumber', data: this.state.data.inbound_asn !== null ? this.state.data.inbound_asn.reference_id :  this.state.data.inbound_grn !== null ?  this.state.data.inbound_grn.reference_id : this.state.data.inbound_other.reference_id},
        // custom content type
        ...FormData,
      ],
      this.listenToProgressUpload,
    ).then((result) => {
      console.log('asdasd', result);
      if (typeof result !== 'object') {
        this.props.addPhotoProofPostpone(null);
        this.setState({
          updateData: true,
          progressLinearVal: 0,
          errors: result,
          submitDetail: true,
          labelerror: false,
          overlayProgress: false,
        });
      } else {
        if (typeof result === 'object') {
          this.setState({
            errors: result.error,
            progressLinearVal: 0,
            labelerror: true,
            overlayProgress: false,
          });
        }
      }
    });
  };

  closeNotifBanner = () => {
    this.setState({errors: '', labelerror: false});
  };
  render() {
    const {data, startReceiving} = this.state;
    const {userRole} = this.props;
    if (data === null) return <Loading />;
    return (
      <>
        {this.state.errors !== '' && (
          <Banner
            title={this.state.errors}
            backgroundColor={
              this.state.labelerror === false ? '#17B055' : '#F1811C'
            }
            closeBanner={this.closeNotifBanner}
          />
        )}
        <ScrollView
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            backgroundColor: 'white',
            paddingHorizontal: 22,
            paddingVertical: 25,
          }}>
          <View style={{flexDirection: 'row', flexShrink: 1}}>
            <View
              style={{
                flexShrink: 1,
                backgroundColor: 'transparent',
                paddingLeft: 15,
                paddingVertical: 6,
                marginVertical: 0,
                borderRadius: 5,
                width: data.status === 3 ? 140 : 110,
                alignItems: 'flex-start',
                marginRight: 0,
              }}>
              <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                Client ID
              </Text>
            </View>
            <Input
              containerStyle={{
                flex: 1,
                paddingVertical: 0,
                marginVertical: 0,
                flexDirection: 'row',
              }}
              inputContainerStyle={{
                borderWidth: 0,
                borderBottomWidth: 0,
                paddingVertical: 0,
                marginVertical: 0,
                flexDirection: 'column-reverse',
              }}
              inputStyle={[
                Mixins.containedInputDefaultStyle,
                {
                  ...Mixins.subtitle3,
                  fontWeight: '600',
                  lineHeight: 21,
                  color: '#6C6B6B',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
              ]}
              labelStyle={[
                Mixins.containedInputDefaultLabel,
                {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
              ]}
              value={data.client}
              multiline={true}
              disabled={true}
              label=" : "
            />
          </View>
          <View style={{flexDirection: 'row', flexShrink: 1}}>
            <View
              style={{
                flexShrink: 1,
                backgroundColor: 'transparent',
                paddingLeft: 15,
                paddingVertical: 6,
                marginVertical: 0,
                borderRadius: 5,
                width: data.status === 3 ? 140 : 110,
                alignItems: 'flex-start',
                marginRight: 0,
              }}>
              <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                Inbound ID
              </Text>
            </View>
            <Input
              containerStyle={{
                flex: 1,
                paddingVertical: 0,
                marginVertical: 0,
                flexDirection: 'row',
              }}
              inputContainerStyle={{
                borderWidth: 0,
                borderBottomWidth: 0,
                paddingVertical: 0,
                marginVertical: 0,
                flexDirection: 'column-reverse',
              }}
              inputStyle={[
                Mixins.containedInputDefaultStyle,
                {
                  ...Mixins.subtitle3,
                  fontWeight: '600',
                  lineHeight: 21,
                  color: '#6C6B6B',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
              ]}
              labelStyle={[
                Mixins.containedInputDefaultLabel,
                {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
              ]}
              value={data.inbound_number}
              multiline={true}
              disabled={true}
              label=" : "
            />
          </View>
          <View style={{flexDirection: 'row', flexShrink: 1}}>
            <View
              style={{
                flexShrink: 1,
                backgroundColor: 'transparent',
                paddingLeft: 15,
                paddingVertical: 6,
                marginVertical: 0,
                borderRadius: 5,
                width: data.status === 3 ? 140 : 110,
                alignItems: 'flex-start',
                marginRight: 0,
              }}>
              <Text style={{...Mixins.subtitle3, lineHeight: 21}}>Ref #</Text>
            </View>
            <Input
              containerStyle={{
                flex: 1,
                paddingVertical: 0,
                marginVertical: 0,
                flexDirection: 'row',
              }}
              inputContainerStyle={{
                borderWidth: 0,
                borderBottomWidth: 0,
                paddingVertical: 0,
                marginVertical: 0,
                flexDirection: 'column-reverse',
              }}
              inputStyle={[
                Mixins.containedInputDefaultStyle,
                {
                  ...Mixins.subtitle3,
                  fontWeight: '600',
                  lineHeight: 21,
                  color: '#6C6B6B',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
              ]}
              labelStyle={[
                Mixins.containedInputDefaultLabel,
                {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
              ]}
              value={data.reference_id ? data.reference_id : '-'}
              multiline={true}
              disabled={true}
              label=" : "
            />
          </View>
          {data.status === 3 && (
            <>
              {data.shipment_type === 2 ? (
                <>
                  <View style={{flexDirection: 'row', flexShrink: 1}}>
                    <View
                      style={{
                        flexShrink: 1,
                        backgroundColor: 'transparent',
                        paddingLeft: 15,
                        paddingVertical: 6,
                        marginVertical: 0,
                        borderRadius: 5,
                        width: data.status === 3 ? 140 : 110,
                        alignItems: 'flex-start',
                        marginRight: 0,
                      }}>
                      <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                        Shipment Type
                      </Text>
                    </View>
                    <Input
                      containerStyle={{
                        flex: 1,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'row',
                      }}
                      inputContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 0,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'column-reverse',
                      }}
                      inputStyle={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.subtitle3,
                          fontWeight: '600',
                          lineHeight: 21,
                          color: '#6C6B6B',
                          marginVertical: 0,
                          paddingVertical: 0,
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
                      ]}
                      value="FCL"
                      multiline={true}
                      disabled={true}
                      label=" : "
                    />
                  </View>
                  <View style={{flexDirection: 'row', flexShrink: 1}}>
                    <View
                      style={{
                        flexShrink: 1,
                        backgroundColor: 'transparent',
                        paddingLeft: 15,
                        paddingVertical: 6,
                        marginVertical: 0,
                        borderRadius: 5,
                        width: data.status === 3 ? 140 : 110,
                        alignItems: 'flex-start',
                        marginRight: 0,
                      }}>
                      <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                        Container #
                      </Text>
                    </View>

                    <Input
                      containerStyle={{
                        flex: 1,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'row',
                      }}
                      inputContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 0,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'column-reverse',
                      }}
                      inputStyle={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.subtitle3,
                          fontWeight: '600',
                          lineHeight: 21,
                          color: '#6C6B6B',
                          marginVertical: 0,
                          paddingVertical: 0,
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
                      ]}
                      value={data.container_no}
                      multiline={true}
                      disabled={true}
                      label=" : "
                    />
                  </View>
                  <View style={{flexDirection: 'row', flexShrink: 1}}>
                    <View
                      style={{
                        flexShrink: 1,
                        backgroundColor: 'transparent',
                        paddingLeft: 15,
                        paddingVertical: 6,
                        marginVertical: 0,
                        borderRadius: 5,
                        width: data.status === 3 ? 140 : 110,
                        alignItems: 'flex-start',
                        marginRight: 0,
                      }}>
                      <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                        Container Size
                      </Text>
                    </View>

                    <Input
                      containerStyle={{
                        flex: 1,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'row',
                      }}
                      inputContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 0,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'column-reverse',
                      }}
                      inputStyle={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.subtitle3,
                          fontWeight: '600',
                          lineHeight: 21,
                          color: '#6C6B6B',
                          marginVertical: 0,
                          paddingVertical: 0,
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
                      ]}
                      value={data.container_size}
                      multiline={true}
                      disabled={true}
                      label=" : "
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={{flexDirection: 'row', flexShrink: 1}}>
                    <View
                      style={{
                        flexShrink: 1,
                        backgroundColor: 'transparent',
                        paddingLeft: 15,
                        paddingVertical: 6,
                        marginVertical: 0,
                        borderRadius: 5,
                        width: data.status === 3 ? 140 : 110,
                        alignItems: 'flex-start',
                        marginRight: 0,
                      }}>
                      <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                        Shipment Type
                      </Text>
                    </View>

                    <Input
                      containerStyle={{
                        flex: 1,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'row',
                      }}
                      inputContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 0,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'column-reverse',
                      }}
                      inputStyle={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.subtitle3,
                          fontWeight: '600',
                          lineHeight: 21,
                          color: '#6C6B6B',
                          marginVertical: 0,
                          paddingVertical: 0,
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
                      ]}
                      value="LCL"
                      multiline={true}
                      disabled={true}
                      label=" : "
                    />
                  </View>
                  <View style={{flexDirection: 'row', flexShrink: 1}}>
                    <View
                      style={{
                        flexShrink: 1,
                        backgroundColor: 'transparent',
                        paddingLeft: 15,
                        paddingVertical: 6,
                        marginVertical: 0,
                        borderRadius: 5,
                        width: data.status === 3 ? 140 : 110,
                        alignItems: 'flex-start',
                        marginRight: 0,
                      }}>
                      <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                        Pallet Type
                      </Text>
                    </View>

                    <Input
                      containerStyle={{
                        flex: 1,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'row',
                      }}
                      inputContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 0,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'column-reverse',
                      }}
                      inputStyle={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.subtitle3,
                          fontWeight: '600',
                          lineHeight: 21,
                          color: '#6C6B6B',
                          marginVertical: 0,
                          paddingVertical: 0,
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
                      ]}
                      value={data.pallet_type === 1 ? 'Loose' : 'Palletized'}
                      multiline={true}
                      disabled={true}
                      label=" : "
                    />
                  </View>
                  <View style={{flexDirection: 'row', flexShrink: 1}}>
                    <View
                      style={{
                        flexShrink: 1,
                        backgroundColor: 'transparent',
                        paddingLeft: 15,
                        paddingVertical: 6,
                        marginVertical: 0,
                        borderRadius: 5,
                        width: data.status === 3 ? 140 : 110,
                        alignItems: 'flex-start',
                        marginRight: 0,
                      }}>
                      <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                        # of Pallet
                      </Text>
                    </View>

                    <Input
                      containerStyle={{
                        flex: 1,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'row',
                      }}
                      inputContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 0,
                        paddingVertical: 0,
                        marginVertical: 0,
                        flexDirection: 'column-reverse',
                      }}
                      inputStyle={[
                        Mixins.containedInputDefaultStyle,
                        {
                          ...Mixins.subtitle3,
                          fontWeight: '600',
                          lineHeight: 21,
                          color: '#6C6B6B',
                          marginVertical: 0,
                          paddingVertical: 0,
                        },
                      ]}
                      labelStyle={[
                        Mixins.containedInputDefaultLabel,
                        {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
                      ]}
                      value={String(data.no_of_pallet)}
                      multiline={true}
                      disabled={true}
                      label=" : "
                    />
                  </View>
                </>
              )}
            </>
          )}

          <View
            style={{flexDirection: 'row', flexShrink: 1, paddingVertical: 5}}>
            <View
              style={{
                flexShrink: 1,
                backgroundColor: 'transparent',
                paddingLeft: 15,
                paddingVertical: 0,
                marginVertical: 0,
                borderRadius: 5,
                width: data.status === 3 ? 140 : 110,
                alignItems: 'flex-start',
                marginRight: 0,
              }}>
              <Text style={{...Mixins.subtitle3, lineHeight: 21}}>Status</Text>
            </View>
            <Input
              containerStyle={{
                flex: 1,
                paddingVertical: 0,
                maxHeight: 30,
                flexDirection: 'row',
              }}
              inputContainerStyle={{
                borderWidth: 0,
                borderBottomWidth: 0,
                flexShrink: 1,
                flexDirection: 'column',
              }}
              style={{
                ...Mixins.subtitle3,
                paddingHorizontal: 20,
                paddingVertical: 0,
                textTransform: 'uppercase',
                  color: '#fff',
                  fontWeight: '600',
                  lineHeight:PixelRatio.get() > 2.75 ? 18 : 21,
                  textAlign:'center',
                  textAlignVertical:'center',
              }}
              inputStyle={[
                {
                  flexShrink:1,
                  justifyContent:'center',
                  alignContent:'center',
                  alignItems:'center',
                  height:'auto',
                  maxHeight:'auto',
                  minHeight:'auto',
                  backgroundColor: this.getBackgroundStatusColor(data.status),
                  borderRadius: 5,
                },
              ]}
              disabledInputStyle={{opacity: 1}}
              labelStyle={[
                Mixins.containedInputDefaultLabel,
                {...Mixins.subtitle3, marginBottom: 0, marginRight: 15},
              ]}
              value={
                data.status === 3
                  ? 'Waiting'
                  : data.status === 4
                  ? 'Received'
                  : data.status === 5
                  ? 'Processing'
                  : data.status === 6
                  ? 'Processed'
                  : 'Reported'
              }
              disabled={true}
              label=" : "
            />
          </View>
          <View style={{flexDirection: 'row', flexShrink: 1}}>
            <View
              style={{
                flexShrink: 1,
                backgroundColor: 'transparent',
                paddingLeft: 15,
                paddingVertical: 6,
                marginVertical: 0,
                borderRadius: 5,
                width: data.status === 3 ? 140 : 110,
                alignItems: 'flex-start',
                marginRight: 0,
              }}>
              <Text style={{...Mixins.subtitle3, lineHeight: 21}}>
                {data.status === 3 ? 'ETA Date' : 'Received'}
              </Text>
            </View>

            <Input
              containerStyle={{
                flex: 1,
                paddingVertical: 0,
                marginVertical: 0,
                flexDirection: 'row',
              }}
              inputContainerStyle={{
                borderWidth: 0,
                borderBottomWidth: 0,
                paddingVertical: 0,
                marginVertical: 0,
                flexDirection: 'column-reverse',
              }}
              inputStyle={[
                Mixins.containedInputDefaultStyle,
                {
                  ...Mixins.subtitle3,
                  fontWeight: '600',
                  lineHeight: 21,
                  color: '#6C6B6B',
                  marginVertical: 0,
                  paddingVertical: 0,
                },
              ]}
              labelStyle={[
                Mixins.containedInputDefaultLabel,
                {...Mixins.subtitle3, marginBottom: 0, marginTop: 5},
              ]}
              value={
                data.status === 3
                  ? moment(data.eta).format('DD-MM-YYYY')
                  : this.state.ISOreceivedDate !== null
                  ? moment(this.state.ISOreceivedDate).format(
                      'DD-MM-YYYY / hh.mm A',
                    )
                  : moment(data.receivedDate).format('DD-MM-YYYY / hh.mm A')
              }
              multiline={true}
              disabled={true}
              label=" : "
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            {(data.status === 3 || data.status === 4) && (
              <>
       

                <Avatar
                  onPress={() => {
                    if(this.state.overlayProgress === true){
                      this.progressLinear.toggle();
                    } else if((this.props.photoProofID === null &&
                      this.state.submitDetail === false) ||
                    this.props.photoProofID === data.id){
                      this.props.setBottomBar(false);
                      this.props.navigation.navigate('SingleCamera');
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
                      {((this.props.photoProofPostpone !== null &&
                        this.props.photoProofID !== null &&
                        this.props.photoProofID === data.id) ||
                        this.state.submitDetail === true) && (
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
                      this.props.photoProofID !== null &&
                      this.props.photoProofID !== data.id
                        ? 'grey'
                        : this.props.photoProofPostpone !== null ||
                          this.state.submitDetail === true
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
                <View style={{maxWidth: 150, justifyContent: 'center'}}>
                  <Text
                    style={{
                      ...Mixins.subtitle3,
                      lineHeight: 21,
                      fontWeight: '600',
                      color: '#6C6B6B',
                      textAlign: 'center',
                    }}>
                    {data.status === 3
                      ? 'Photo Proof Before Opening Container'
                      : 'Photo Proof After Opening Container'}
                  </Text>
                </View>
              </>
            )}
          </View>

          <Button
            containerStyle={{flexShrink: 1, marginVertical: 10}}
            buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
            titleStyle={styles.deliveryText}
            onPress={this.detailSubmited}
            title={
              data.status === 3
                ? 'Receive Goods'
                : data.status === 4
                ? 'Start Processing'
                : 'Go to Processing'
            }
            disabled={data.status < 5 ? !this.state.submitDetail : false}
          />
          <Button
            containerStyle={{flexShrink: 1, marginBottom: 10}}
            buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
            titleStyle={styles.deliveryText}
            onPress={() => {
              this.props.setBottomBar(true);
              this.props.navigation.navigate({
                name: 'DetailsDraft',
                params: {
                  number: this.state.receivingNumber,
                },
              });
            }}
            title="Inbound Details"
          />

          <View
            style={{
              flexDirection: 'column',
              flexShrink: 1,
              marginVertical: 20,
            }}>
            <Text style={{...Mixins.subtitle3, lineHeight: 21}}>Remarks</Text>
            <View style={styles.remark}>
              <Text style={styles.remarkText}>{data.remarks}</Text>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = {
  text: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#6C6B6B',
    textAlign: 'center',
  },
  remarkText: {
    ...Mixins.body3,
    lineHeight: 18,
    color: 'black',
  },
  remark: {
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginVertical: 15,
    marginHorizontal: 5,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    flexDirection: 'row',
    flexShrink: 1,
    minWidth: 320,
    elevation: 2,
  },
  checkboxContainer: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    margin: 0,
    paddingHorizontal: 0,
  },
  checked: {
    backgroundColor: '#2A3386',
    padding: 5,
    borderRadius: 2,
    marginRight: 5,
    marginVertical: 3,
  },
  unchecked: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#6C6B6B',
    padding: 5,
    marginRight: 5,
    marginVertical: 3,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 30,
  },
  sectionSheetButton: {
    marginHorizontal: 20,
    marginVertical: 10,
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
  sectionDividier: {
    flexDirection: 'row',
  },
  buttonDivider: {
    flex: 1,
  },
  sectionInput: {
    flexDirection: 'column',
    borderRadius: 13,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    marginBottom: 30,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  inputHead: {
    marginVertical: 12,
    ...Mixins.h4,
    lineHeight: 27,
  },
  sectionButtonGroup: {
    flexDirection: 'row',
  },
  sectionContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  sectionText: {
    textAlign: 'center',
    width: 83,
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#6C6B6B',
    marginVertical: 12,
  },
  containerInput: {
    borderBottomColor: '#ABABAB',
    borderBottomWidth: 1,
    marginVertical: 0,
    paddingVertical: 0,
  },
  inputStyle: {
    ...Mixins.lineInputDefaultStyle,
    ...Mixins.body1,
    marginHorizontal: 0,
    flexShrink: 1,
    minHeight: 30,
    lineHeight: 21,
    fontWeight: '400',
  },
  labelStyle: {
    ...Mixins.lineInputDefaultLabel,
    ...Mixins.body1,
    lineHeight: 14,
    fontWeight: '400',
  },
  inputErrorStyle: {
    ...Mixins.body2,
    lineHeight: 14,
    marginVertical: 0,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 13,
    elevation: 8,
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 0,
  },
  checkmark: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
};
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole.role,
    isPhotoProofSubmitted: state.originReducer.filters.isPhotoProofSubmitted,
    isSignatureSubmitted: state.originReducer.filters.isSignatureSubmitted,
    photoProofPostpone: state.originReducer.photoProofPostpone,
    inboundList: state.originReducer.inboundList,
    keyStack: state.originReducer.filters.keyStack,
    photoProofID: state.originReducer.photoProofID,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    signatureSubmittedHandler: (signature) =>
      dispatch({type: 'Signature', payload: signature}),
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setStartDelivered: (toggle) => {
      return dispatch({type: 'startDelivered', payload: toggle});
    },
    setCurrentASN: (data) => {
      return dispatch({type: 'setASN', payload: data});
    },
    setActiveASN: (data) => {
      return dispatch({type: 'addActiveASN', payload: data});
    },
    addPhotoProofPostpone: (uri) =>
      dispatch({type: 'PhotoProofPostpone', payload: uri}),
    //prototype only
    setManifestList: (data) => {
      return dispatch({type: 'ManifestList', payload: data});
    },
    setItemScanned: (item) => {
      return dispatch({type: 'BarcodeScanned', payload: item});
    },
    setReportedManifest: (data) => {
      return dispatch({type: 'ReportedManifest', payload: data});
    },
    loadFromGallery: (action) => {
      return dispatch({type: 'loadFromGallery', payload: action});
    },
    //end
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Acknowledge);
