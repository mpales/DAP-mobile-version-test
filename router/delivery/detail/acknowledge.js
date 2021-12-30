import React from 'react';
import {CheckBox, Text, Button, Image} from 'react-native-elements';
import {View, Dimensions, Platform, StatusBar, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-2 (1) 1mobile.svg';
// component
import Loading from '../../../component/loading/loading';
import Banner from '../../../component/banner/banner';
//compat navigation
import {withNavigationFocus} from '@react-navigation/compat';
// helper
import {getData, postData} from '../../../component/helper/network';
import {popToLogout} from '../../../component/helper/persist-login';
const screen = Dimensions.get('window');

class Acknowledge extends React.Component {
  unsubscribe = null;
  constructor(props) {
    super(props);
    this.state = {
      totalPackages: 0,
      totalAcknowledged: 0,
      totalNotAcknowledged: 0,
      cageId: null,
      bannerTitle: '',
      acknowledged: false,
      permissionload: false,
      isLoaded: false,
      isShowBanner: false,
      isSubmitting: false,
    };
    this.onAcknowledged.bind(this);
    this.toggleCheckBox.bind(this);
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
    if(this.props.isFocused === true){
      // this.getTotalPackages();
      this.props.setBottomBar(false);
    }
   }
  componentDidUpdate(prevProps, prevState) {
   if(prevProps.isFocused !== this.props.isFocused && this.props.isFocused === true){
      // this.getTotalPackages();
      this.props.setBottomBar(false);
     }
  }

  componentWillUnmount(){
  }
  permissionCheck = () => {
    const {
      cameraPermission,
      locationPermission,
      readStoragePermission,
      writeStoragePermission,
      callPhonePermission,
      backgroundlocationPermission,
    } = this.props;
    let result;
    if (Platform.OS === 'android') {
      result =
        callPhonePermission &&
        locationPermission &&
        readStoragePermission &&
        writeStoragePermission &&
        cameraPermission &&
        (Platform.Version < 29 ||
          (Platform.Version >= 29 && backgroundlocationPermission));
    } else if (Platform.OS === 'ios') {
      result =
        locationPermission &&
        readStoragePermission &&
        writeStoragePermission &&
        cameraPermission &&
        (Platform.Version < 29 ||
          (Platform.Version >= 29 && backgroundlocationPermission));
    }
    return result;
  };

  toggleCheckBox = () => {
    this.setState({
      acknowledged: !this.state.acknowledged,
    });
  };

  getTotalPackages = async () => {
    const result = await getData('cmobile/driver/acknowledge');
    if (result.acknowledgeDetails) {
      if (result.acknowledgeDetails.hasAcknowledge) {
        this.props.setBottomBar(true);
        this.props.navigation.navigate('Delivery'); 
      }
      this.setState({
        totalPackages: result.acknowledgeDetails.totalPackages,
        totalAcknowledged: result.acknowledgeDetails.totalAcknowledged,
        totalNotAcknowledged: result.acknowledgeDetails.totalNotAcknowledged,
        cageId: result.acknowledgeDetails.vehicleDetails.cageId,
      });
      this.props.setNoDelivery(false);
    } else {
      this.props.setNoDelivery(true);
    }
    this.setState({
      isLoaded: true,
    });
  };

  onAcknowledged = async () => {
    if (!this.state.acknowledged) return;
    this.setState({
      isSubmitting: true,
    });
    let body = {};
    const result = await postData('cmobile/driver/acknowledge', body);
    if (result.acknowledgeDetails) {
      if (result.acknowledgeDetails.hasAcknowledge) {
        this.props.setBottomBar(true);
        this.props.navigation.navigate('Delivery');
      }
    } else if (result === 'No Delivery') {
      this.setState({
        bannerTitle: result,
        isShowBanner: true,
      });
    } else if (result === 'Unauthorized') {
      this.closeSession();
    }
    this.setState({
      isSubmitting: false,
    });
  };

  checkedIcon = () => {
    return (
      <View
        style={
          this.state.totalPackages > 0
            ? styles.checked
            : [styles.checked, {backgroundColor: '#ABABAB'}]
        }>
        <Checkmark height="14" width="14" fill="#FFFFFF" />
      </View>
    );
  };

  closeSession = async () => {
    this.props.setBottomBar(true);
    this.props.navigation.navigate('Delivery');
  };

  uncheckedIcon = () => {
    return <View style={styles.unchecked} />;
  };

  closeBanner = () => {
    this.setState({
      isShowBanner: false,
    });
  };

  render() {
    const {totalPackages, totalAcknowledged, totalNotAcknowledged, isLoaded} =
      this.state;
    return (
      <>
        <StatusBar barStyle={'dark-content'} />
        {this.state.isShowBanner && (
          <Banner
            title={this.state.bannerTitle}
            backgroundColor="#F1811C"
            closeBanner={this.closeBanner}
          />
        )}
        <View style={styles.container}>
          {isLoaded ? (
            <>
              <View style={styles.contentContainer}>
                {totalAcknowledged > 0 && totalNotAcknowledged > 0 && (
                  <Text
                    style={[
                      styles.text,
                      {fontWeight: '700', marginBottom: 20},
                    ]}>
                    {'New Package Added'}
                  </Text>
                )}
                <Image
                  source={
                    totalPackages > 0
                      ? require('../../../assets/driver-1.png')
                      : require('../../../assets/driver-2.png')
                  }
                  style={{width: 200, height: 200}}
                  resizeMode="contain"
                />
                <View style={{marginVertical: 30}}>
                  <Text style={styles.text}>
                    {totalAcknowledged > 0 && totalNotAcknowledged > 0
                      ? 'New Package:' + ' '
                      : 'Today Package:' + ' '}
                    <Text
                      style={
                        totalPackages > 0 ? {fontWeight: '700'} : styles.text
                      }>
                      {totalAcknowledged > 0 && totalNotAcknowledged > 0
                        ? this.state.totalNotAcknowledged
                        : this.state.totalPackages}
                    </Text>
                  </Text>
                  <Text style={styles.text}>
                    {'Cage Number:'+ ' '}
                    {totalPackages > 0 ? (
                      <Text style={{fontWeight: '700'}}>
                        {this.state.cageId !== null && this.state.cageId}
                      </Text>
                    ) : (
                      '-'
                    )}
                  </Text>
                  <Text style={styles.text}>
                    {'Make sure to count the packages before you deliver'}
                  </Text>
                </View>
              </View>
              {totalPackages > 0 ? (
                <CheckBox
                  title={
                    'I Acknowledge that I have counted the packages to be correct'
                  }
                  textStyle={[styles.text, {textAlign: 'left'}]}
                  containerStyle={styles.checkboxContainer}
                  checked={this.state.acknowledged}
                  onPress={this.toggleCheckBox}
                  checkedIcon={this.checkedIcon()}
                  uncheckedIcon={this.uncheckedIcon()}
                />
              ) : (
                <CheckBox
                  title={
                    'I Acknowledge that I have counted the packages to be correct'
                  }
                  textStyle={[styles.text, {textAlign: 'left'}]}
                  containerStyle={styles.checkboxContainer}
                  checked={true}
                  onPress={this.toggleCheckBox}
                  checkedIcon={this.checkedIcon()}
                  disabled={true}
                />
              )}
              <View style={{alignSelf: 'center', marginVertical: 40}}>
                {totalPackages > 0 ? (
                  <Button
                    containerStyle={styles.buttonContainer}
                    buttonStyle={
                      this.state.acknowledged
                        ? [
                            styles.navigationButton,
                            {backgroundColor: '#F07120'},
                          ]
                        : [styles.navigationButton, {backgroundColor: 'gray'}]
                    }
                    titleStyle={styles.deliveryText}
                    title={'Acknowledge'}
                    onPress={this.onAcknowledged}
                    disabled={this.state.isSubmitting}
                    disabledStyle={[
                      styles.navigationButton,
                      {backgroundColor: 'gray'},
                    ]}
                    disabledTitleStyle={{color: '#FFF'}}
                  />
                ) : (
                  <Button
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.closeButton}
                    titleStyle={[styles.deliveryText, {color: '#ABABAB'}]}
                    onPress={this.closeSession}
                    title={'Close'}
                  />
                )}
              </View>
            </>
          ) : (<View style={{flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
             <Image
                  source={require('../../../assets/driver-1.png')
                  }
                  style={{width: 200, height: 200}}
                  resizeMode="contain"
                />
           <View style={{marginVertical:20}}>
           <Text style={styles.text}>
                    {'Checking for acknowledgement, press button refresh to try again.'}
                  </Text>
           </View>
            <Button
                    containerStyle={[styles.buttonContainer,{paddingHorizontal:0, marginVertical:40, width:'100%'}]}
                    buttonStyle={styles.closeButton}
                    titleStyle={[styles.deliveryText, {color: '#ABABAB'}]}
                    onPress={()=>{
                      this.props.navigation.navigate('Detail')
                    }}
                 
                    title={'Close'}
                  />
          </View>)}
        </View>
      </>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 22,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  deliveryText: {
    ...Mixins.subtitle3,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  text: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#6C6B6B',
    textAlign: 'center',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  checkboxContainer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginRight: 0,
    marginLeft: 0,
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
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    width: screen.width,
  },
  closeButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ABABAB',
    backgroundColor: '#FFF',
  },
};
function mapStateToProps(state) {
  return {
    cameraPermission: state.originReducer.filters.cameraPermission,
    locationPermission: state.originReducer.filters.locationPermission,
    backgroundlocationPermission:
      state.originReducer.filters.backgroundlocationPermission,
    readStoragePermission: state.originReducer.filters.readStoragePermission,
    writeStoragePermission: state.originReducer.filters.writeStoragePermission,
    callPhonePermission: state.originReducer.filters.callPhonePermission,
    keyStack: state.originReducer.filters.keyStack,
    indexBottomBar: state.originReducer.filters.indexBottomBar,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => dispatch({type: 'BottomBar', payload: toggle}),
    setUserRole: (data) => {
      dispatch({type: 'login', payload: data});
    },
    removeJwtToken: (token) => {
      dispatch({type: 'JWTToken', payload: token});
    },
    setNoDelivery: (toggle) => {
      return dispatch({type: 'NoDelivery', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(Acknowledge));
