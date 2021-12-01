import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Avatar, Button, CheckBox} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
// component
import Banner from '../../../../component/banner/banner';
// helper
import {putBlob} from '../../../../component/helper/network';
//style
import Mixins from '../../../../mixins';
// icon
import IconPhoto5 from '../../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';

class StockTakeReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: this.props.route.params?.productId ?? null,
      reasonOption: '',
      otherReason: '',
      remarks: '',
      quantity: 0,
      isShowBanner: false,
      errorMessage: '',
    };
  }

  handleReportOptions = (selectedValue) => {
    this.setState({
      ...this.state,
      isShowBanner: false,
      reasonOption: selectedValue,
      otherReason: '',
    });
  };

  onChangeReasonInput = (value) => {
    this.setState({
      otherReason: value,
    });
  };

  onChangeRemarks = (value) => {
    this.setState({
      remarks: value,
    });
  };

  navigateToStockTakeCountList = (data) => {
    this.props.setBottomBar(false);
    this.props.navigation.navigate('StockTakeCountList', {jobData: data});
  };

  navigateToStockTakeReportCamera = () => {
    this.props.navigation.navigate('StockTakeReportCamera');
  };

  submitReport = async () => {
    this.setState({
      isShowBanner: false,
      errorMessage: '',
    });
    const {reasonOption, otherReason, remarks, quantity, productId} =
      this.state;
    if (parseInt(reasonOption) === 3 && otherReason === '') {
      this.setState({
        isShowBanner: true,
        errorMessage: 'Reason Details Is Required',
      });
      return;
    }
    let pictureData = await this.getStockTakeReportPhoto();
    let body = [
      {
        name: 'reportType',
        data: reasonOption.toString(),
      },
      {
        name: 'otherType',
        data: otherReason.toString(),
      },
      {
        name: 'reportedQuantity',
        data: quantity.toString(),
      },
      {
        name: 'remark',
        data: remarks.toString(),
      },
      ...pictureData,
    ];
    if (reasonOption === 3 && body[2].name === 'reportedQuantity') {
      body.splice(2, 1);
    }
    putBlob(
      `/stocks-mobile/stock-counts/${this.props.stockTakeId}/products/${productId}/reports`,
      body,
      () => {},
    )
      .then((result) => {
        if (
          result.message !== undefined &&
          result.message === 'Stock count successfully reported'
        ) {
          this.props.addStockTakeReportPhotoList([]);
          this.props.stockTakeReportPhotoSubmitted(false);
          this.navigateToStockTakeCountList();
        } else if (result.errors !== undefined) {
          this.setState({
            isShowBanner: true,
            errorMessage: result.errors[0].msg,
          });
        } else if (result.error !== undefined) {
          this.setState({
            isShowBanner: true,
            errorMessage: result.error,
          });
        } else if (result === 'Not found') {
          this.setState({
            isShowBanner: true,
            errorMessage: result,
          });
        }
      })
      .catch((error) => {
        this.setState({
          isShowBanner: true,
          errorMessage: 'Something went wrong',
        });
      });
  };

  getStockTakeReportPhoto = async () => {
    const {stockTakeReportPhotoList} = this.props;
    const dirs = RNFetchBlob.fs.dirs;
    let formData = [];
    for (let i = 0; i < stockTakeReportPhotoList.length; i++) {
      let newFilePathName,
        name,
        filename,
        path,
        type = '';
      let arr = stockTakeReportPhotoList[i].split('/');
      newFilePathName = `${dirs.DocumentDir}/${arr[arr.length - 1]}`;
      await RNFetchBlob.fs
        .stat(
          Platform.OS === 'ios' ? newFilePathName : stockTakeReportPhotoList[i],
        )
        .then((FSStat) => {
          name = FSStat.filename.replace('.', '-');
          filename = FSStat.filename;
          path = FSStat.path;
          type = FSStat.type;
        });
      if (type === 'file') {
        formData.push({
          name: 'photos',
          filename: filename,
          type: 'image/jpg',
          data: Platform.OS === 'ios' ? path : RNFetchBlob.wrap(path),
        });
      }
    }
    return formData;
  };

  handleInput = (text) => {
    this.setState({
      quantity: isNaN(text)
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
      quantity: this.state.quantity + 1,
    });
  };

  handleMinus = () => {
    if (this.state.quantity > 0) {
      this.setState({
        quantity: this.state.quantity - 1,
      });
    }
  };

  closeBanner = () => {
    this.setState({
      isShowBanner: false,
      errorMessage: '',
    });
  };

  render() {
    const {
      reasonOption,
      otherReason,
      remarks,
      quantity,
      isShowBanner,
      errorMessage,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="default" />
        {isShowBanner && errorMessage !== '' && (
          <Banner
            title={errorMessage}
            closeBanner={this.closeBanner}
            backgroundColor="#F1811C"
          />
        )}
        <ScrollView
          style={{paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Report</Text>
            <CheckBox
              title="Damage Item"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              textStyle={Mixins.subtitle3}
              size={25}
              containerStyle={styles.checkbox}
              checked={reasonOption === 0}
              onPress={() => this.handleReportOptions(0)}
            />
            {/* <CheckBox
              title="Item Missing"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              textStyle={Mixins.subtitle3}
              size={25}
              containerStyle={styles.checkbox}
              checked={reasonOption === 1}
              onPress={() => this.handleReportOptions(1)}
            /> */}
            {this.props.route.params?.isBlankCount ? (
              <CheckBox
                title="Expired Item"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#2A3386"
                uncheckedColor="#6C6B6B"
                textStyle={Mixins.subtitle3}
                size={25}
                containerStyle={styles.checkbox}
                checked={reasonOption === 2}
                onPress={() => this.handleReportOptions(2)}
              />
            ) : (
              <CheckBox
                title="Excess Item"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#2A3386"
                uncheckedColor="#6C6B6B"
                textStyle={Mixins.subtitle3}
                size={25}
                containerStyle={styles.checkbox}
                checked={reasonOption === 4}
                onPress={() => this.handleReportOptions(4)}
              />
            )}
            <CheckBox
              title="Other"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              textStyle={Mixins.subtitle3}
              size={25}
              containerStyle={styles.checkbox}
              checked={reasonOption === 3}
              onPress={() => this.handleReportOptions(3)}
            />
            {reasonOption === 3 ? (
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.onChangeReasonInput(text)}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                value={otherReason}
              />
            ) : (
              <View style={styles.quantityContainer}>
                <Text style={[styles.title, {marginVertical: 20}]}>
                  Affected Quantity
                </Text>
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
                    value={quantity.toString()}
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
          </View>
          <View style={[styles.contentContainer, {paddingTop: 10}]}>
            <Text style={styles.title}>Remarks</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.onChangeRemarks(text)}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
              value={remarks}
            />
            <View style={styles.sectionContainer}>
              <Avatar
                size={79}
                ImageComponent={() => (
                  <>
                    <IconPhoto5 height="40" width="40" fill="#fff" />
                    {this.props.isStockTakeReportPhotoSubmitted && (
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
                  backgroundColor: this.props.isStockTakeReportPhotoSubmitted
                    ? '#17B055'
                    : '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                onPress={() => this.navigateToStockTakeReportCamera()}
                activeOpacity={0.7}
                containerStyle={{alignSelf: 'center'}}
              />
              <Text style={styles.sectionText}>Photo Proof</Text>
            </View>
            <Button
              title="Submit"
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitText}
              onPress={this.submitReport}
              disabledStyle={{backgroundColor: '#ABABAB'}}
              disabledTitleStyle={{color: '#FFF'}}
              disabled={
                reasonOption !== 1 &&
                !this.props.isStockTakeReportPhotoSubmitted
              }
            />
          </View>
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 20,
  },
  title: {
    ...Mixins.subtitle3,
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
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  textInput: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  sectionText: {
    ...Mixins.subtitle3,
    textAlign: 'center',
    marginTop: 10,
  },
  submitButton: {
    borderRadius: 5,
    backgroundColor: '#F07120',
    width: '100%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitText: {
    ...Mixins.subtitle3,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  checkmark: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  quantityContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

function mapStateToProps(state) {
  return {
    isStockTakeReportPhotoSubmitted:
      state.originReducer.filters.isStockTakeReportPhotoSubmitted,
    stockTakeReportPhotoList: state.originReducer.stockTakeReportPhotoList,
    stockTakeId: state.originReducer.filters.stockTakeId,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    addStockTakeReportPhotoList: (uri) => {
      return dispatch({type: 'StockTakeReportPhotoList', payload: uri});
    },
    stockTakeReportPhotoSubmitted: (proof) => {
      return dispatch({type: 'StockTakeReportPhotoSubmitted', payload: proof});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockTakeReport);
