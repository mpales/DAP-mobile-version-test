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
import {Card, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import mixins from '../../../../mixins';
import moment from 'moment';
// component
import {TextList} from '../../../../component/extend/Text-list';
import FormatHelper from '../../../../component/helper/format';
import ImageLoading from '../../../../component/loading/image';
// helper
import {getBlob, getData} from '../../../../component/helper/network';
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
      productUOM: this.props.route.params?.productUOM ?? null,
      reportData: null,
      resolution: '',
      overlayImage: false,
      overlayImageString: null,
      overlayImageFilename: null,
      isMounted: false,
      acknowledged: false,
      isLoading: true,
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
    if (prevState.reportData !== this.state.reportData) {
      this.initPhotoThumb();
    }
  }

  componentDidMount() {
    this.getStockCountProductReport();
    this.setState({
      isMounted: true,
    });
  }

  getStockCountProductReport = async () => {
    const {productId} = this.state;
    const {stockTakeId} = this.props;
    const result = await getData(
      `/stocks-mobile/stock-counts/${stockTakeId}/products/${productId}/reports`,
    );
    if (typeof result === 'object' && result.errros === undefined) {
      this.setState({
        reportData: result,
        isLoading: false,
      });
      console.log(result);
    }
  };

  initPhotoThumb = () => {
    const {reportData} = this.state;
    reportData.photo.forEach((element) => {
      this.arrayImageProcessingRef[element.id].init();
    });
  };

  toggleOverlay = (item) => {
    const {overlayImage, showAllReport, productId} = this.state;
    const {stockTakeId} = this.props;
    this.setState({
      overlayImage: !overlayImage,
      overlayImageString: `	
      /stocks-mobile/stock-counts/${stockTakeId}/products/${productId}/reports/${item.id}/photo`,
      overlayImageFilename: item.id,
    });
  };

  toggleCheckBox = () => {
    const {acknowledged} = this.state;
    this.setState({
      acknowledged: !acknowledged,
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

  renderPhotoProof = (item) => {
    const {productId} = this.state;
    const {stockTakeId} = this.props;
    return (
      <TouchableOpacity onPress={() => this.toggleOverlay(item)}>
        <ImageLoading
          ref={(ref) => {
            this.arrayImageProcessingRef[item.id] = ref;
          }}
          callbackToFetch={async (indicatorTick) => {
            return await getBlob(
              `/stocks-mobile/stock-counts/${stockTakeId}/products/${productId}/reports/${item.id}/thumb`,
              {filename: item.id + '.jpg'},
              (received, total) => {
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

  render() {
    const {reportData, isLoading, productUOM} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Report Details</Text>
          </View>
          {!isLoading && reportData !== null && (
            <View style={styles.body}>
              <Card containerStyle={styles.cardContainer} style={styles.card}>
                <View style={styles.header}>
                  <Text
                    style={[
                      styles.headerTitle,
                      {marginBottom: 10, color: '#E03B3B', fontSize: 20},
                    ]}>
                    {!!reportData.otherType
                      ? reportData.otherType
                      : reportData.reportType}
                  </Text>
                </View>
                <View>
                  <TextList
                    title="Report By"
                    value={`${reportData.reportedBy.firstName} ${reportData.reportedBy.lastName}`}
                  />
                  <TextList
                    title="Date and Time"
                    value={FormatHelper.formatDateTime(reportData.reportedOn)}
                  />
                  <TextList
                    title="Quantity"
                    value={!!reportData.quantity ? reportData.quantity : '-'}
                  />
                  <TextList title="UOM" value={productUOM} />
                  <TextList title="Photo Proof" value="" />
                  <FlatList
                    horizontal={true}
                    keyExtractor={(item, index) => index}
                    data={reportData.photo}
                    renderItem={({item, index}) => this.renderPhotoProof(item)}
                  />
                  <Text style={styles.detailText}>Remarks</Text>
                  <TextInput
                    style={styles.note}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={reportData.remark}
                    editable={false}
                  />
                </View>
              </Card>
            </View>
          )}
        </ScrollView>
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
      </SafeAreaView>
    );
  }
}

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
  return {
    stockTakeId: state.originReducer.filters.stockTakeId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockTakeReportDetails);
