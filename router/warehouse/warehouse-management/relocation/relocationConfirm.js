import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Card, Overlay} from 'react-native-elements';
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

const window = Dimensions.get('window');

class RelocationConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocationId: this.props.route.params?.relocationId ?? null,
      relocationDetails: null,
      showOverlay: false,
      errorMessage: '',
      isLoading: true,
      isSubmitting: false,
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

  handleShowOverlay = (value) => {
    this.setState({
      showOverlay: value ?? false,
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

  render() {
    const {errorMessage, isLoading, isSubmitting, relocationDetails} =
      this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {!isLoading && errorMessage !== '' && (
          <Banner
            title={errorMessage}
            backgroundColor="#F07120"
            closeBanner={this.closeBanner}
          />
        )}
        {isLoading && relocationDetails === null ? (
          <Loading />
        ) : (
          <>
            <ScrollView
              style={styles.body}
              showsVerticalScrollIndicator={false}>
              <Card containerStyle={styles.cardContainer}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.cardTitle}>Current Location</Text>
                  <TextList
                    title="Location"
                    value={relocationDetails.locationIdFrom}
                  />
                  <TextList
                    title="Item Code"
                    value={relocationDetails.itemCode}
                  />
                  <TextList
                    title="Description"
                    value={relocationDetails.description}
                  />
                  <CustomTextList
                    title="Quantity"
                    value={`${relocationDetails.quantityFrom}-${
                      relocationDetails.quantityFrom -
                      relocationDetails.quantityTo
                    }`}
                    separateQuantity={true}
                  />
                  <TextList title="UOM" value={relocationDetails.uom} />
                  <CustomTextList
                    title="Grade"
                    value={productGradeToString(
                      relocationDetails.productGradeFrom,
                    )}
                  />
                </View>
                <View style={styles.sectionContainer}>
                  <Text style={styles.cardTitle}>New Location</Text>
                  <TextList
                    title="Location"
                    value={relocationDetails.locationIdTo}
                  />
                  <TextList
                    title="Item Code"
                    value={relocationDetails.itemCode}
                  />
                  <TextList
                    title="Description"
                    value={relocationDetails.description}
                  />
                  <CustomTextList
                    title="Quantity"
                    value={`${0}-${relocationDetails.quantityTo}`}
                    separateQuantity={true}
                  />
                  <TextList title="UOM" value={relocationDetails.uom} />
                  <CustomTextList
                    title="Grade"
                    value={productGradeToString(
                      relocationDetails.productGradeTo,
                    )}
                  />
                </View>
              </Card>
              <Button
                title="Confirm Relocation"
                titleStyle={styles.buttonText}
                buttonStyle={styles.button}
                onPress={this.confirmRelocation}
                disabled={isSubmitting}
                disabledStyle={{backgroundColor: '#ABABAB'}}
                disabledTitleStyle={{color: '#FFF'}}
              />
            </ScrollView>
            <Overlay
              overlayStyle={{borderRadius: 10, padding: 0}}
              isVisible={this.state.showOverlay}>
              <View
                style={{
                  flexShrink: 1,
                  width: window.width * 0.9,
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
                  <TextList
                    title="Location"
                    value={relocationDetails.locationIdTo}
                  />
                  <TextList
                    title="Item Code"
                    value={relocationDetails.itemCode}
                  />
                  <TextList
                    title="Description"
                    value={relocationDetails.description}
                  />
                  <CustomTextList
                    title="Quantity"
                    value={`${
                      relocationDetails.quantityFrom +
                      relocationDetails.quantityTo
                    }`}
                  />
                  <TextList title="UOM" value={relocationDetails.uom} />
                  <CustomTextList
                    title="Grade"
                    value={productGradeToString(
                      relocationDetails.productGradeTo,
                    )}
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
          </>
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
  sectionContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardTitle: {
    ...Mixins.subtitle1,
    fontSize: 18,
    lineHeight: 25,
    color: '#2A3386',
    marginBottom: 5,
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

export default connect(mapStateToProps, mapDispatchToProps)(RelocationConfirm);
