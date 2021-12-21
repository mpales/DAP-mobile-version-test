import React from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Input, Overlay} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {TextList, CustomTextList} from '../../../../component/extend/Text-list';
import Banner from '../../../../component/banner/banner';
import Loading from '../../../../component/loading/loading';
// helper
import {getData, putData} from '../../../../component/helper/network';
import {productGradeToString} from '../../../../component/helper/string';
// style
import Mixins from '../../../../mixins';
// icon
import CheckmarkIcon from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';

const screen = Dimensions.get('window');

class ManualInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocationId: this.props.route.params?.relocationId ?? null,
      relocationDetails: null,
      showOverlay: false,
      manualInputValue: '',
      errorMessage: '',
      isLoading: true,
      isSubmitting: false,
      showOverlay: false,
    };
  }

  componentDidMount() {
    this.getRelocationJobDetails();
  }

  getRelocationJobDetails = async () => {
    const {relocationId} = this.state;
    if (relocationId === null) return;
    const result = await getData(
      `/stocks/stock-relocations/${relocationId}/details`,
    );
    console.log(result);
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        relocationDetails: result,
      });
    } else if (result.error !== undefined) {
      this.setState({
        errorMessage: result.error,
      });
    }
    this.setState({isLoading: false});
  };

  confirmRelocation = async () => {
    this.setState({
      isSubmitting: true,
    });
    const {relocationId} = this.state;
    const result = await putData(
      `/stocks-mobile/stock-relocations/${relocationId}/confirm-relocation`,
    );
    if (typeof result === 'object' && result.message === 'Relocation Success') {
      this.handleShowOverlay(true);
    } else if (result.error !== undefined) {
      this.setState({
        errorMessage: result.error,
      });
    } else if (typeof result === 'string') {
      this.setState({
        errorMessage: result,
      });
    }
    this.setState({
      isSubmitting: false,
    });
  };

  confirmValidation = () => {
    this.handleShowOverlay(true);
    const {manualInputValue, relocationDetails} = this.state;
    if (
      manualInputValue.toLowerCase() !==
      relocationDetails.locationTo.toLowerCase()
    ) {
      this.setState({
        errorMessage: 'Location Id is not match',
      });
      return;
    }
    this.confirmRelocation();
  };

  handleShowOverlay = (value) => {
    this.setState({
      showOverlay: value ?? false,
    });
  };

  navigateToConfirmRelocationBarcode = () => {
    const {relocationId} = this.state;
    this.props.navigation.navigate('ConfirmRelocationBarcode', {
      relocationId: relocationId,
    });
  };

  navigateToRelocationJobList = () => {
    this.handleShowOverlay();
    this.props.setBottomBar(true);
    this.props.navigation.navigate('RelocationList');
  };

  closeBanner = () => {
    this.setState({
      errorMessage: '',
    });
  };

  navigateToItemDetails = () => {
    this.props.navigation.navigate('RelocationItemDetails', {
      relocationDetails: this.state.relocationDetails,
    });
  };

  render() {
    const {
      errorMessage,
      isLoading,
      isSubmitting,
      manualInputValue,
      relocationDetails,
      showOverlay,
    } = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {!isLoading && errorMessage !== '' && (
          <Banner
            title={errorMessage}
            backgroundColor="#E03B3B"
            closeBanner={this.closeBanner}
          />
        )}
        {isLoading && relocationDetails === null ? (
          <Loading />
        ) : (
          <View style={styles.body}>
            <Text style={styles.title}>Manual Input</Text>
            <Input
              placeholder=""
              value={manualInputValue}
              containerStyle={{paddingHorizontal: 20}}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              renderErrorMessage={false}
              onChangeText={(text) => this.setState({manualInputValue: text})}
            />
            <Button
              title="Confirm"
              titleStyle={styles.buttonText}
              buttonStyle={styles.button}
              containerStyle={{marginTop: 20}}
              disabled={isSubmitting || manualInputValue === ''}
              onPress={this.confirmValidation}
              disabledStyle={{backgroundColor: '#ABABAB'}}
              disabledTitleStyle={{color: '#FFF'}}
            />
          </View>
        )}
        {!isLoading && (
          <Overlay
            overlayStyle={{borderRadius: 10, padding: 0}}
            isVisible={showOverlay}>
            <View
              style={{
                flexShrink: 1,
                width: screen.width * 0.9,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#ABABAB',
                  paddingVertical: 15,
                }}>
                <CheckmarkIcon height="24" width="24" fill="#17B055" />
                <Text
                  style={{
                    ...Mixins.subtitle3,
                    fontSize: 18,
                    lineHeight: 25,
                    marginLeft: 10,
                    color: '#17B055',
                  }}>
                  Relocation Successful
                </Text>
              </View>
              <View style={{padding: 20}}>
                <Text style={styles.cardTitle}>New Location</Text>
                {relocationDetails.productStorageFroms.length > 1 && (
                  <TextList
                    title="Warehouse"
                    value={relocationDetails.warehouseNameTo}
                  />
                )}
                <TextList
                  title="Location"
                  value={relocationDetails.locationTo}
                />
                {!(relocationDetails.productStorageFroms.length > 1) && (
                  <>
                    <TextList
                      title="Item Code"
                      value={
                        relocationDetails.productStorageFroms[0].product
                          .item_code
                      }
                    />
                    <TextList
                      title="Description"
                      value={
                        relocationDetails.productStorageFroms[0].product
                          .description
                      }
                    />
                    <TextList
                      title="UOM"
                      value={
                        relocationDetails.productStorageFroms[0].productUom
                          .packaging
                      }
                      isBold={true}
                    />
                  </>
                )}
                <CustomTextList
                  title="Destination Grade"
                  value={productGradeToString(relocationDetails.gradeTo)}
                />
                <Button
                  title="Back To List"
                  titleStyle={styles.buttonText}
                  buttonStyle={[
                    styles.button,
                    {marginHorizontal: 0, marginTop: 20},
                  ]}
                  onPress={this.navigateToRelocationJobList}
                />
              </View>
            </View>
          </Overlay>
        )}
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
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 23,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    borderColor: '#D5D5D5',
  },
  inputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    paddingHorizontal: 10,
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
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

export default connect(mapStateToProps, mapDispatchToProps)(ManualInput);
