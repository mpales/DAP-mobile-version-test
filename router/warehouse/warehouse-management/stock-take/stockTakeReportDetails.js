import React from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Card, CheckBox, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import mixins from '../../../../mixins';
import moment from 'moment';
// component
import {TextList} from '../../../../component/extend/Text-list';
import DetailList from '../../../../component/extend/Card-detail';
import FormatHelper from '../../../../component/helper/format';
import ImageLoading from '../../../../component/loading/image';
// helper
import {getBlob, postData} from '../../../../component/helper/network';
// icon
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-2 (1) 1mobile.svg';

const window = Dimensions.get('screen');

class StockTakeReportDetails extends React.Component {
  overlayThumb = null;
  arrayImageProcessingRef = [];
  constructor(props) {
    super(props);
    this.state = {
      productId: this.props.route.params?.productId ?? null,
      selectedReportId: null,
      resolution: '',
      overlayImage: false,
      overlayImageString: null,
      overlayImageFilename: null,
      isMounted: false,
      acknowledged: false,
    };
    this.toggleCheckBox.bind(this);
    this.toggleOverlay.bind(this);
    this.renderPhotoProof.bind(this);
    this.initPhotoThumb.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.overlayImage !== this.state.overlayImage) {
      if (this.state.overlayImage) {
        this.overlayThumb.init();
      }
    }
    if (prevState.isMounted !== this.state.isMounted) {
      this.initPhotoThumb();
    }
    if (prevState.selectedReportId !== this.state.selectedReportId) {
      if (this.state.selectedReportId === null) {
        this.initPhotoThumb();
      }
    }
  }

  componentDidMount() {
    this.setState({
      isMounted: true,
    });
  }

  initPhotoThumb = () => {
    REPORTDATA.photos.forEach((element) => {
      this.arrayImageProcessingRef[element.photoId].init();
    });
  };

  toggleOverlay = (item, reportId) => {
    const {overlayImage, showAllReport, productId} = this.state;
    this.setState({
      overlayImage: !overlayImage,
      overlayImageString: `https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//84/MTA-3060811/kardus-box_kardus-dus-karton-box-polos-packing-kecil-20x10x8_full02.jpg`,
      overlayImageFilename: item.photoId,
    });
    // this.setState({
    //   overlayImage: !overlayImage,
    //   overlayImageString: `/cmobile/receive/connote-details/${
    //     this.props.manifestId
    //   }/${
    //     showAllReport ? 'manifest' : productId
    //   }/report-photo/full/${reportId}/${item.photoId}`,
    //   overlayImageFilename: item.photoId,
    // });
  };

  toggleCheckBox = () => {
    const {acknowledged} = this.state;
    this.setState({
      acknowledged: !acknowledged,
    });
  };

  selectReport = (reportId) => {
    this.setState({
      selectedReportId: this.state.selectedReportId === null ? reportId : null,
      resolution: '',
      acknowledged: false,
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

  onChangeResolution = (value) => {
    this.setState({
      resolution: value,
    });
  };

  renderPhotoProof = (item, reportId) => {
    const {productId} = this.state;
    return (
      <TouchableOpacity onPress={() => this.toggleOverlay(item, reportId)}>
        <ImageLoading
          ref={(ref) => {
            this.arrayImageProcessingRef[item.photoId] = ref;
          }}
          callbackToFetch={async (indicatorTick) => {
            return await getBlob(
              'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//84/MTA-3060811/kardus-box_kardus-dus-karton-box-polos-packing-kecil-20x10x8_full02.jpg',
              {filename: `${item.photoId}.jpg`},
              (received, total) => {
                indicatorTick(received);
              },
            );
            // return await getBlob(
            //   `/cmobile/receive/connote-details/${this.props.manifestId}/${
            //     showAllReport ? 'manifest' : productId
            //   }/report-photo/thumbs/${reportId}/${item.photoId}`,
            //   {filename: item.photoId + '.jpg'},
            //   (received, total) => {
            //     indicatorTick(received);
            //   },
            // );
          }}
          containerStyle={{width: 65, height: 65, margin: 5}}
          style={{width: 65, height: 65, backgroundColor: 'black'}}
          imageStyle={{width: 65, height: 65}}
          imageContainerStyle={{}}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const {reportedBy, dateTime, notes, reason, quantity, UOM} = REPORTDATA;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Report Details</Text>
          </View>
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
                    indicatorTick(received.reportPhotoThumb);
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
            <Card containerStyle={styles.cardContainer} style={styles.card}>
              <View style={styles.header}>
                <Text
                  style={[
                    styles.headerTitle,
                    {marginBottom: 10, color: '#E03B3B', fontSize: 20},
                  ]}>
                  {reason}
                </Text>
              </View>
              <View style={styles.detail}>
                <TextList
                  title="Report By"
                  value={`${reportedBy.firstName} ${reportedBy.lastName}`}
                />
                <TextList
                  title="Date and Time"
                  value={FormatHelper.formatDateTime(dateTime)}
                />
                <TextList title="Quantity" value={quantity} />
                <TextList title="UOM" value={UOM} />
                <TextList title="Photo Proof" value="" />
                <FlatList
                  horizontal={true}
                  keyExtractor={(item, index) => index}
                  data={REPORTDATA.photos}
                  renderItem={({item, index}) =>
                    this.renderPhotoProof(item, REPORTDATA.reportId)
                  }
                />
                <Text style={styles.detailText}>Remarks</Text>
                <TextInput
                  style={styles.note}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={notes}
                  editable={false}
                />
              </View>
            </Card>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const REPORTDATA = {
  reportId: '123123123',
  dateTime: moment().subtract(1, 'days').unix(),
  reason: 'Damage Item',
  reportedBy: {
    firstName: 'Kim',
    lastName: 'Tan',
  },
  quantity: '32',
  UOM: 'PCS',
  notes: 'Theres some crack on packages',
  photos: [
    {
      photoId: 'kardus-box_kardus-dus',
    },
    {
      photoId: 'kardus-box_kardus-duss',
    },
  ],
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...mixins.subtitle3,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#424141',
  },
  body: {
    flexShrink: 1,
    marginBottom: 20,
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
    ...mixins.subtitle3,
    color: '#6C6B6B',
  },
  note: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    color: '#6C6B6B',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
    marginVertical: 10,
  },
  textCheckbox: {
    ...mixins.subtitle3,
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
    marginVertical: 10,
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
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockTakeReportDetails);
