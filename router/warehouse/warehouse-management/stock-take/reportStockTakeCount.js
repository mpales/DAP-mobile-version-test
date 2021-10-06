import React from 'react';
import {
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
//style
import Mixins from '../../../../mixins';
// icon
import IconPhoto5 from '../../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';

class StockTakeReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonOption: '',
      otherReason: '',
      remarks: '',
    };
  }

  handleReportOptions = (selectedValue) => {
    this.setState({
      ...this.state,
      isShowBanner: false,
      reasonOption: selectedValue,
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

  submitReport = () => {
    this.navigateToStockTakeCountList();
  };

  render() {
    const {reasonOption, otherReason, remarks} = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="default" />
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
              checked={reasonOption === 'damage item'}
              onPress={() => this.handleReportOptions('damage item')}
            />
            <CheckBox
              title="Item Missing"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              textStyle={Mixins.subtitle3}
              size={25}
              containerStyle={styles.checkbox}
              checked={reasonOption === 'item missing'}
              onPress={() => this.handleReportOptions('item missing')}
            />
            <CheckBox
              title="Expired item"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              textStyle={Mixins.subtitle3}
              size={25}
              containerStyle={styles.checkbox}
              checked={reasonOption === 'expired item'}
              onPress={() => this.handleReportOptions('expired item')}
            />
            <CheckBox
              title="Other"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checkedColor="#2A3386"
              uncheckedColor="#6C6B6B"
              textStyle={Mixins.subtitle3}
              size={25}
              containerStyle={styles.checkbox}
              checked={reasonOption === 'other'}
              onPress={() => this.handleReportOptions('other')}
            />
            {reasonOption === 'other' ? (
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.onChangeReasonInput(text)}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                value={otherReason}
              />
            ) : (
              <>
                <Text style={[styles.title, {marginTop: 20}]}>
                  Quantity Item
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.onChangeReasonInput(text)}
                  textAlignVertical="top"
                  keyboardType="number-pad"
                  value={otherReason}
                />
              </>
            )}
          </View>
          <View style={styles.contentContainer}>
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
                    {/* {this.props.photoReportConnoteList.length > 0 && (
                      <Checkmark
                        height="20"
                        width="20"
                        fill="#fff"
                        style={styles.checkmark}
                      />
                    )} */}
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
                    // this.props.photoReportConnoteList.length > 0
                    //   ? '#17B055'
                    // :
                    '#F07120',
                  flex: 2,
                  borderRadius: 5,
                }}
                onPress={() => {}}
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
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockTakeReport);
