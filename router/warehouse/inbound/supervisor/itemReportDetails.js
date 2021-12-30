import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {Card, CheckBox, Button, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import Mixins from '../../../../mixins';
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
// component
import DetailList from '../../../../component/extend/Card-detail';
import ImageLoading from '../../../../component/loading/image';
import Banner from '../../../../component/banner/banner';
import {
  getData,
  getBlob,
  postData,
  postBlob,
} from '../../../../component/helper/network';
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';
import TouchableScale from 'react-native-touchable-scale';
import EmptyIlustrate from '../../../../assets/icon/manifest-empty mobile.svg';
import moment from 'moment';
const window = Dimensions.get('screen');
class ConnoteReportDetails extends React.Component {
  overlayThumb = null;
  arrayImageProcessingRef = {};
  _unsubscribe = null;
  constructor(props) {
    super(props);
    this.state = {
      receivingNumber: null,
      inboundID: null,
      acknowledged: false,
      title: 'Damage Item',
      note: 'Theres some crack on packages',
      resolution: '',
      dataReports: null,
      overlayImage: false,
      overlayImageString: null,
      overlayImageFilename: null,
      acknowledged: false,
      error: '',
      activeReportId: null,
      isShowBannerSuccess: false,
    };
    this.toggleOverlay.bind(this);
    this.renderPhotoProof.bind(this);
    this.renderInner.bind(this);
    this._onPressSingleReports.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {navigation} = props;
    const {receivingNumber} = state;
    if (receivingNumber === null) {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.number !== undefined
      ) {
        return {
          ...state,
          inboundID: routes[index].params.number,
          receivingNumber: routes[index].params.productID,
        };
      }
      return {...state};
    }

    return {...state};
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.dataReports !== this.state.dataReports) {
      for (const [key, value] of Object.entries(this.arrayImageProcessingRef)) {
        if (value !== undefined) {
          value.init();
        }
      }
    }
    if (
      prevState.overlayImage !== this.state.overlayImage &&
      this.state.overlayImage === true
    ) {
      if (this.overlayThumb !== null && this.overlayThumb !== undefined) {
        this.overlayThumb.refresh();
      }
    }
    if (
      this.props.keyStack !== prevProps.keyStack &&
      this.props.keyStack === 'ReportDetailsSPV' &&
      prevProps.keyStack === 'ReportSingleDetailsSPV'
    ) {
      const {receivingNumber, inboundID} = this.state;
      const {currentASN} = this.props;
      const result = await getData(
        '/inboundsMobile/' + inboundID + '/' + receivingNumber + '/reports',
      );
      if (typeof result === 'object' && result.error === undefined) {
        this.setState({dataReports: result});
      } else {
        // this.props.navigation.goBack();
      }
    }
  }
  async componentDidMount() {
    const {receivingNumber, inboundID} = this.state;
    const {currentASN} = this.props;
    const result = await getData(
      '/inboundsMobile/' + inboundID + '/' + receivingNumber + '/reports',
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({dataReports: result});
    } else {
      // this.props.navigation.goBack();
    }
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      // do something
      const {routes, index} = this.props.navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.isShowBannerSuccess === true
      ) {
        this.setState({
          isShowBannerSuccess: true,
          error: routes[index].params.isShowBanner,
        });
        this.props.navigation.setParams({
          ...routes[index].params,
          isShowBannerSuccess: false,
          isShowBanner: '',
        });
      }
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  toggleOverlay = (item) => {
    const {overlayImage} = this.state;
    this.setState({
      overlayImage: !overlayImage,
      overlayImageString:
        item !== undefined
          ? '/inboundsMobile/' +
            item.inbound_id +
            '/' +
            item.inbound_product_id +
            '/reports/' +
            item.report_id +
            '/photo/' +
            item.id
          : null,
      overlayImageFilename:
        item !== undefined
          ? '' +
            item.inbound_id +
            '' +
            item.inbound_product_id +
            '' +
            item.report_id +
            '' +
            item.id +
            '.png'
          : null,
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
  acknowledgedReport = async () => {
    const {
      receivingNumber,
      inboundID,
      activeReportId,
      acknowledged,
      resolution,
      dataReports,
    } = this.state;
    let data = {
      acknowledge: acknowledged >>> 0,
      resolution: 'test',
    };
    let result = await postData(
      '/inboundsMobile/' +
        inboundID +
        '/' +
        receivingNumber +
        '/reports/' +
        activeReportId,
      data,
    );
    if (typeof result !== 'object') {
      this.setState({
        dataReports: Array.from({length: dataReports.length}).map(
          (num, index) => {
            if (activeReportId === dataReports[index].id) {
              return {
                ...dataReports[index],
                acknowledged: 1,
              };
            } else {
              return dataReports[index];
            }
          },
        ),
      });
      this.setState({
        acknowledged: false,
        isShowBannerSuccess: true,
        error: result,
      });
    } else {
      if (result.errors !== undefined) {
        let dumpError = '';
        result.errors.forEach((element) => {
          dumpError += element.msg + ' ';
        });
        this.setState({error: dumpError, isShowBannerSuccess: false});
      } else if (result.error !== undefined) {
        this.setState({error: result.error, isShowBannerSuccess: false});
      }
    }
  };
  toggleCheckBox = () => {
    this.setState({
      acknowledged: !this.state.acknowledged,
    });
  };
  renderEmptyComponent = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '30%',
        }}>
        <EmptyIlustrate height="132" width="213" style={{marginBottom: 15}} />
        <Text style={{...Mixins.subtitle3}}>No report</Text>
      </View>
    );
  };
  renderPhotoProof = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => this.toggleOverlay(item)}>
        <ImageLoading
          ref={(ref) => {
            this.arrayImageProcessingRef[item.id] = ref;
          }}
          callbackToFetch={async (indicatorTick) => {
            return await getBlob(
              '/inboundsMobile/' +
                item.inbound_id +
                '/' +
                item.inbound_product_id +
                '/reports/' +
                item.report_id +
                '/thumb/' +
                item.id,
              {
                filename:
                  '' +
                  item.inbound_id +
                  '' +
                  item.inbound_product_id +
                  '' +
                  item.report_id +
                  '' +
                  item.id +
                  '.jpg',
              },
              (received, total) => {
                // if(this.arrayImageProcessingRef.length > 0 && this.arrayImageProcessingRef[item.id] !== undefined && this.arrayImageProcessingRef[item.id] !== null)
                // this.arrayImageProcessingRef[item.id].
                indicatorTick(received);
              },
            );
          }}
          containerStyle={{width: 65, height: 65, margin: 5}}
          style={{width: 65, height: 65, backgroundColor: 'black'}}
          imageStyle={{width: 65, height: 65}}
          imageContainerStyle={{}}
        />
      </TouchableOpacity>
    );
  };
  _onPressSingleReports = (item) => {
    this.props.navigation.navigate('ReportSingleDetailsSPV', {
      number: item.inbound_id,
      productID: item.inbound_product_id,
      reportID: item.id,
      arrayPhotoID: item.inbound_report_photos,
    });
  };
  renderInner = ({item, separators}) => {
    let photoData = Array.from({length: item.inbound_report_photos.length}).map(
      (num, index) => {
        return {
          ...item.inbound_report_photos[index],
          report_id: item.id,
          inbound_id: item.inbound_id,
          inbound_product_id: item.inbound_product_id,
        };
      },
    );
    let report_title = 'Other';
    switch (item.report) {
      case 1:
        report_title = 'Damage Item';
        break;
      case 2:
        report_title = 'Item Missing';
        break;
      case 3:
        report_title = 'Excess Item';
        break;
      case 4:
        report_title = 'Others';
        break;
      case 5:
        report_title = 'Expired Item';
        break;

      default:
        break;
    }
    return (
      <TouchableScale
        key={item.key}
        onPress={() => this._onPressSingleReports(item)}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
        activeScale={0.9}>
        <Card containerStyle={styles.cardContainer} style={styles.card}>
          <View style={styles.header}>
            <Text
              style={[
                styles.headerTitle,
                {
                  marginBottom: 10,
                  color: '#E03B3B',
                  fontSize: 20,
                  color: item.acknowledged === 1 ? '#17B055' : '#E03B3B',
                },
              ]}>
              {report_title}
            </Text>
          </View>
          <View style={styles.detail}>
            <DetailList title="Report By" value={item.reported_by.firstName} />
            <DetailList
              title="Date and Time"
              value={moment(item.reported_on).format('DD/MM/YYY h:mm a')}
            />
            <DetailList title="Affected Quantity" value={item.qty} />
            <DetailList title="Photo Proof" value={''} />
            <View style={{flexDirection: 'row'}}>
              <FlatList
                horizontal={true}
                contentContainerStyle={{flex: 1}}
                keyExtractor={(item, index) => index}
                data={photoData}
                renderItem={this.renderPhotoProof}
              />
              <ArrowDown
                fill="black"
                height="26"
                width="26"
                style={{flexShrink: 1, transform: [{rotate: '-90deg'}]}}
              />
            </View>
            <Text style={styles.detailText}>Remarks</Text>
            <TextInput
              style={styles.note}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
              value={item.description}
              editable={false}
            />

            {/* {this.state.activeReportId === item.id && (
                 <>
                 <CheckBox
                      title="I Acknowledge"
                      textStyle={styles.textCheckbox}
                      containerStyle={[styles.checkboxContainer,{paddingHorizontal:0}]}
                      checked={item.acknowledged === 1 ? true : this.state.acknowledged}
                      onPress={this.toggleCheckBox}
                      checkedIcon={this.checkedIcon()}
                      uncheckedIcon={this.uncheckedIcon()}
                      disabled={item.acknowledged === 1 ? true : false }
                    />
                <Button
                    containerStyle={{flex:1, marginHorizontal: 0,}}
                    buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
                    titleStyle={styles.deliveryText}
                    title="Confirm"
                    onPress={this.acknowledgedReport}
                    disabled={(this.state.acknowledged === false || item.acknowledged === 1)}
                  />
                  </>
                  )} */}
          </View>
        </Card>
      </TouchableScale>
    );
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

  closeBanner = () => {
    this.setState({
      isShowBannerSuccess: false,
      error: '',
    });
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          {this.state.error !== '' && (
            <Banner
              title={this.state.error}
              closeBanner={this.closeBanner}
              backgroundColor={
                this.state.isShowBannerSuccess === true ? '#17B055' : '#F1811C'
              }
            />
          )}
          <Overlay
            isVisible={this.state.overlayImage}
            onBackdropPress={this.toggleOverlay}>
            <ImageLoading
              ref={(ref) => {
                this.overlayThumb = ref;
              }}
              callbackToFetch={async (indicatorTick) => {
                return await getBlob(
                  this.state.overlayImageString,
                  {filename: this.state.overlayImageFilename},
                  (received, total) => {
                    // if(this.overlayThumb !== undefined)
                    // this.overlayThumb.
                    indicatorTick(received);
                  },
                );
              }}
              containerStyle={{
                width: window.width * 0.8,
                height: window.width * 0.8,
              }}
              style={{
                width: window.width * 0.8,
                height: window.width * 0.8,
                backgroundColor: 'black',
              }}
              imageStyle={{
                width: window.width * 0.8,
                height: window.width * 0.8,
              }}
              imageContainerStyle={{}}
            />
          </Overlay>
          <View style={styles.body}>
            <FlatList
              keyExtractor={(item, index) => index}
              ListHeaderComponent={() => {
                return (
                  <View
                    style={[
                      styles.header,
                      {paddingTop: 20, paddingBottom: 10},
                    ]}>
                    <Text style={styles.headerTitle}>Report Details</Text>
                  </View>
                );
              }}
              data={this.state.dataReports}
              contentContainerStyle={{paddingHorizontal: 10}}
              ListEmptyComponent={this.renderEmptyComponent}
              renderItem={this.renderInner}
            />
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 0,
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Mixins.subtitle3,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#424141',
  },
  body: {
    flex: 1,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  detailText: {
    ...Mixins.subtitle3,
    color: '#6C6B6B',
  },
  note: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    color: '#6C6B6B',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  changeButton: {
    backgroundColor: '#F07120',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  changeButtonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
  textCheckbox: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#6C6B6B',
    textAlign: 'center',
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
});

const mapStateToProps = (state) => {
  return {keyStack: state.originReducer.filters.keyStack};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnoteReportDetails);
