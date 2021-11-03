import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Card, Button} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {TextList, TextListBig} from '../../../../component/extend/Text-list';
import Loading from '../../../../component/loading/loading';
import Banner from '../../../../component/banner/banner';
// helper
import {getData, putData} from '../../../../component/helper/network';
import Format from '../../../../component/helper/format';
import {productGradeToString} from '../../../../component/helper/string';
//style
import Mixins from '../../../../mixins';

class RelocationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocationId: this.props.route.params?.relocationId ?? null,
      relocationDetails: null,
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

  closeBanner = () => {
    this.setState({
      errorMessage: '',
    });
  };

  startRelocate = async () => {
    this.setState({
      isSubmitting: true,
    });
    const {relocationId} = this.state;
    const result = await putData(
      `/stocks-mobile/stock-relocations/${relocationId}/start-relocate`,
    );
    if (
      result.message === 'Stock relocation started' &&
      result.error === undefined
    ) {
      this.navigateToConfirmRelocation();
    } else if (result.error !== undefined) {
      this.setState({
        errorMessage: result.error,
      });
    }
    this.setState({
      isSubmitting: false,
    });
  };

  navigateToConfirmRelocation = () => {
    this.props.navigation.navigate('ConfirmRelocation', {
      relocationId: this.state.relocationId,
    });
  };

  render() {
    const {
      errorMessage,
      isLoading,
      relocationDetails,
      isSubmitting,
    } = this.state;
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
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Relocate From</Text>
            <Card containerStyle={styles.cardContainer}>
              <TextList
                title="Warehouse"
                value={relocationDetails.warehouseNameFrom}
              />
              <TextList
                title="Job Request Date"
                value={Format.formatDate(relocationDetails.createdOn)}
              />
              <TextList title="Client" value={relocationDetails.clientName} />
              <TextList
                title="Location"
                value={relocationDetails.locationIdFrom}
              />
              <TextList title="Item Code" value={relocationDetails.itemCode} />
              <TextList
                title="Description"
                value={relocationDetails.description}
              />
              <TextList
                title="Request By"
                value={`${relocationDetails.createdBy.firstName} ${relocationDetails.createdBy.lastName}`}
              />
              <TextList
                title="Grade"
                value={productGradeToString(relocationDetails.productGradeFrom)}
              />
              <TextList
                title="Expiry Date"
                value={
                  relocationDetails.attributes.expiry_date !== undefined
                    ? Format.formatDate(
                        relocationDetails.attributes.expiry_date,
                      )
                    : '-'
                }
              />
              <TextList title="Batch No" value={relocationDetails.batchNo} />
              <TextList
                title="Reason Code"
                value={relocationDetails.reasonCode}
              />
              <TextList
                title="Remarks"
                value={
                  relocationDetails.remark !== ''
                    ? relocationDetails.remark
                    : '-'
                }
              />
              <View style={{borderWidth: 1, borderRadius: 5, padding: 10}}>
                <TextListBig
                  title="Quantity"
                  value={relocationDetails.quantityTo}
                />
                <TextListBig title="UOM" value={relocationDetails.uom} />
              </View>
            </Card>
            <View style={styles.blueContainer}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.blueContainerText}>Move Quantity</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.blueContainerText}>
                    {relocationDetails.quantityTo}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.blueContainerText}>UOM</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.blueContainerText}>
                    {relocationDetails.uom}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.title}>Relocate To</Text>
            <Card containerStyle={styles.cardContainer}>
              <TextList
                title="Warehouse"
                value={relocationDetails.warehouseNameTo}
              />
              <TextList
                title="Location"
                value={relocationDetails.locationIdTo}
              />
              <TextList title="Item Code" value={relocationDetails.itemCode} />
              <TextList
                title="Description"
                value={relocationDetails.description}
              />
              <TextList
                title="Destination Grade"
                value={productGradeToString(relocationDetails.productGradeTo)}
              />
            </Card>
            <Button
              title="Start Relocate"
              titleStyle={styles.buttonText}
              buttonStyle={styles.button}
              disabled={isSubmitting}
              onPress={this.startRelocate}
              disabledStyle={{backgroundColor: '#ABABAB'}}
              disabledTitleStyle={{color: '#FFF'}}
            />
          </ScrollView>
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
    marginTop: 10,
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
    lineHeight: 21,
  },
  blueContainer: {
    backgroundColor: '#414993',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  blueContainerText: {
    ...Mixins.subtitle1,
    fontSize: 18,
    lineHeight: 25,
    color: '#FFF',
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
  return {
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelocationDetails);
