import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import ListItemPOD from '../../../../component/extend/ListItem-self-recollection-pod';
import Signature from '../peripheral/signature';
// style
import Mixins from '../../../../mixins';
// icon
import CameraIcon from '../../../../assets/icon/iconmonstr-photo-camera-5 2mobile.svg';
import SignatureIcon from '../../../../assets/icon/iconmonstr-pen-7 1mobile.svg';
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';

class RecollectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSignature: false,
    };
  }

  showSignatureHandler = () => {
    this.setState({isShowSignature: !this.state.isShowSignature});
  };

  submitSignature = () => {
    this.props.signatureSubmittedHandler(true);
    this.showSignatureHandler();
  };

  navigateToCamera = () => {
    this.props.navigation.navigate('RecollectionCamera');
  };

  navigateToReportRecollection = () => {};

  navigateRecollectionDetails = () => {
    this.props.navigation.navigate('RecollectionDetails');
  };

  navigateToSelectCustomer = () => {
    this.props.navigation.navigate('SelectCustomer');
  };

  // TODO
  // need to clear recollection photo list signature base64 and data when submitted

  render() {
    const {isShowSignature} = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingTop: 10}}>
          {DUMMYDATA.map((item, index) => (
            <ListItemPOD
              item={item}
              key={index}
              navigate={this.navigateRecollectionDetails}
            />
          ))}
          <View style={styles.container}>
            <View
              style={[
                styles.rowContainer,
                {justifyContent: 'center', marginTop: 20},
              ]}>
              <Text style={styles.text}>{`You have ${1} Delivery Job, `}</Text>
              <TouchableOpacity onPress={this.navigateToSelectCustomer}>
                <Text style={styles.navigationText}>Add More Delivery?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.sectionContainer}>
                <View>
                  <Avatar
                    size={79}
                    ImageComponent={() => (
                      <CameraIcon height="40" width="40" fill="#fff" />
                    )}
                    imageProps={{
                      containerStyle: {
                        alignItems: 'center',
                        paddingTop: 18,
                        paddingBottom: 21,
                      },
                    }}
                    overlayContainerStyle={{
                      backgroundColor: this.props.isRecollectionPhotoSubmitted
                        ? '#17B055'
                        : '#F07120',
                      flex: 2,
                      borderRadius: 5,
                    }}
                    onPress={this.navigateToCamera}
                    activeOpacity={0.7}
                    containerStyle={{alignSelf: 'center'}}
                  />
                  {this.props.isRecollectionPhotoSubmitted && (
                    <Checkmark
                      height="20"
                      width="20"
                      fill="#fff"
                      style={styles.checkmark}
                    />
                  )}
                </View>
                <Text style={styles.sectionText}>Photo Proof</Text>
              </View>
              <View style={styles.sectionContainer}>
                <View>
                  <Avatar
                    size={79}
                    ImageComponent={() => (
                      <SignatureIcon height="40" width="40" fill="#fff" />
                    )}
                    imageProps={{
                      containerStyle: {
                        alignItems: 'center',
                        paddingTop: 18,
                        paddingBottom: 21,
                      },
                    }}
                    overlayContainerStyle={{
                      backgroundColor: this.props.isSignatureSubmitted
                        ? '#17B055'
                        : '#F07120',
                      flex: 2,
                      borderRadius: 5,
                    }}
                    onPress={() => this.showSignatureHandler()}
                    activeOpacity={0.7}
                    containerStyle={{alignSelf: 'center'}}
                  />
                  {this.props.isSignatureSubmitted && (
                    <Checkmark
                      height="20"
                      width="20"
                      fill="#fff"
                      style={styles.checkmark}
                    />
                  )}
                </View>
                <Text style={styles.sectionText}>E-Signature</Text>
              </View>
            </View>
            <Button
              title="Submit"
              titleStyle={styles.buttonText}
              buttonStyle={styles.button}
              onPress={() => {}}
              disabledStyle={{backgroundColor: '#ABABAB'}}
              disabledTitleStyle={{color: '#FFF'}}
            />
            <Button
              type="clear"
              title="Report"
              containerStyle={styles.reportButton}
              titleStyle={styles.reportButtonText}
              onPress={this.navigateToReportRecollection}
            />
          </View>
        </ScrollView>
        {isShowSignature && (
          <Signature
            recollectionSignatureBase64={this.props.recollectionSignatureBase64}
            showSignatureHandler={this.showSignatureHandler}
            submitSignature={this.submitSignature}
            setRecollectionSignatureData={
              this.props.setRecollectionSignatureData
            }
            setRecollectionsignatureBase64={
              this.props.setRecollectionsignatureBase64
            }
          />
        )}
      </SafeAreaProvider>
    );
  }
}

const DUMMYDATA = [
  {
    client: {name: 'Messi', code: 'PO00002224'},
    warehouseName: 'KEPPEL',
    totalItem: 5,
  },
];

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
  },
  container: {
    marginHorizontal: 20,
  },
  text: {
    ...Mixins.subtitle3,
    lineHeight: 21,
  },
  navigationText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#121C78',
    textDecorationColor: '#121C78',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  sectionText: {
    textAlign: 'center',
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#6C6B6B',
    marginVertical: 12,
  },
  sectionContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  checkmark: {
    position: 'absolute',
    bottom: 3,
    right: 3,
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginBottom: 10,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    color: '#FFF',
  },
  reportButton: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6C6B6B',
  },
  reportButtonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    color: '#E03B3B',
  },
});

function mapStateToProps(state) {
  return {
    isRecollectionPhotoSubmitted:
      state.originReducer.filters.isRecollectionPhotoSubmitted,
    isSignatureSubmitted: state.originReducer.filters.isSignatureSubmitted,
    recollectionSignatureData: state.originReducer.recollectionSignatureData,
    recollectionSignatureBase64:
      state.originReducer.recollectionSignatureBase64,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setRecollectionSignatureData: (toggle) => {
      return dispatch({type: 'RecollectionSignatureData', payload: toggle});
    },
    setRecollectionsignatureBase64: (toggle) => {
      return dispatch({type: 'RecollectionSignatureBase64', payload: toggle});
    },
    signatureSubmittedHandler: (signature) => {
      return dispatch({type: 'Signature', payload: signature});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecollectionForm);
