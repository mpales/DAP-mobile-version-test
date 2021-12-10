import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, Card, Input, Overlay} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import Slider from '@react-native-community/slider';
import SelectDropdown from 'react-native-select-dropdown';
// component
import {TextList, CustomTextList} from '../../../../component/extend/Text-list';
import Banner from '../../../../component/banner/banner';
// helper
import {productGradeToString} from '../../../../component/helper/string';
import {getData, postData} from '../../../../component/helper/network';
// style
import Mixins from '../../../../mixins';
// icon
import CheckmarkIcon from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

const window = Dimensions.get('window');

class RelocationRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocateFrom: this.props.selectedRequestRelocation,
      warehouseList: null,
      locationList: [],
      reasonCodeList: REASONCODELIST,
      gradeList: GRADELIST,
      newLocation: NEWLOCATION,
      remarks: '',
      quantityToTransfer: 0,
      selectedWarehouse: null,
      selectedLocation: null,
      selectedReasonCode: null,
      selectedGrade: null,
      sliderValue: 0,
      showOverlay: false,
      errorMessage: '',
      isSubmitting: false,
    };
  }

  componentDidMount() {
    this.getWarehouseList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedWarehouse !== this.state.selectedWarehouse) {
      if (this.state.selectedWarehouse === null) {
        this.setState({
          locationList: [],
          selectedLocation: null,
        });
      } else {
        this.getLocationList();
      }
    }
  }

  handleShowOverlay = (value) => {
    this.setState({
      showOverlay: value ?? false,
    });
  };

  handlePicker = (value, type) => {
    let obj = {};
    if (type === 'warehouse') {
      obj = {selectedWarehouse: value};
    } else if (type === 'locationId') {
      obj = {selectedLocation: value};
    } else if (type === 'reasonCode') {
      obj = {selectedReasonCode: value};
    } else if (type === 'grade') {
      obj = {selectedGrade: value};
    }
    this.setState(obj);
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'remarks') {
      obj = {remarks: value};
    } else if (type === 'quantity') {
      obj = {quantityToTransfer: value};
    }
    this.setState(obj);
  };

  buttonDisabled = () => {
    const {
      selectedWarehouse,
      selectedLocation,
      selectedReasonCode,
      selectedGrade,
      quantityToTransfer,
      isSubmitting,
    } = this.state;
    if (
      selectedWarehouse === null ||
      selectedLocation === null ||
      selectedReasonCode === null ||
      selectedGrade === null ||
      quantityToTransfer === 0 ||
      isSubmitting
    ) {
      return true;
    }
    return false;
  };

  getWarehouseList = async () => {
    const result = await getData('/warehouses/names');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        warehouseList: result,
      });
    }
  };

  getLocationList = async () => {
    const {selectedWarehouse} = this.state;
    const result = await getData(`/warehouses/${selectedWarehouse}/containers`);
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        locationList: result,
      });
    }
  };

  calculateQuantity = (value) => {
    const {relocateFrom} = this.state;
    let quantityNumber = 0;
    quantityNumber = relocateFrom.quantity * (value / 100);
    this.setState({
      quantityToTransfer: quantityNumber.toFixed(0),
      sliderValue: value,
    });
  };

  calculateSliderPercentage = (value) => {
    value = isNaN(value) || /\s/g.test(value) ? 0 : value;
    const {relocateFrom} = this.state;
    let percentage = 0;
    if (value !== '') {
      percentage = ((relocateFrom.quantity * parseInt(value)) / 100) * 10;
    }
    this.setState({
      quantityToTransfer:
        value === '' ? value : isNaN(parseInt(value)) ? 0 : value,
      sliderValue: isNaN(percentage) ? 0 : percentage,
    });
  };

  navigateToRelocationJobList = () => {
    this.handleShowOverlay();
    this.props.setBottomBar(true);
    this.props.navigation.navigate('RelocationList');
  };

  navigateToRequestRelocationBarcode = () => {
    this.props.navigation.navigate('RequestRelocationBarcode', {
      relocateTo: true,
    });
  };

  confirmRelocate = async () => {
    this.setState({
      isSubmitting: true,
    });
    const {
      relocateFrom,
      selectedLocation,
      selectedReasonCode,
      selectedGrade,
      quantityToTransfer,
      remarks,
    } = this.state;
    const data = {
      selectedBy: 0,
      clientId: relocateFrom.client.id,
      product: !!relocateFrom.itemCode
        ? relocateFrom.itemCode
        : relocateFrom.product.item_code,
      locationId: relocateFrom.locationId,
      relocateEntirePallet: 0,
      productStorageIdFroms: relocateFrom.id,
      warehouseStorageContainerIdTo: selectedLocation,
      productGradeTo: selectedGrade,
      quantityTo: quantityToTransfer,
      reasonCode: selectedReasonCode,
      remark: remarks,
    };
    const result = await postData('/stocks-mobile/stock-relocations', data);
    console.log(result);
    if (
      typeof result === 'object' &&
      result.message ===
        'Stock Relocation created and relocated successfully' &&
      result.error === undefined &&
      result.errors === undefined
    ) {
      this.handleShowOverlay(true);
    } else if (typeof result === 'string') {
      this.setState({
        errorMessage: result,
      });
    }
    this.setState({
      isSubmitting: true,
    });
  };

  closeBanner = () => {
    this.setState({
      errorMessage: '',
    });
  };

  render() {
    const {
      errorMessage,
      relocateFrom,
      warehouseList,
      locationList,
      reasonCodeList,
      gradeList,
      selectedWarehouse,
      selectedLocation,
      selectedGrade,
      remarks,
      quantityToTransfer,
    } = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {errorMessage !== '' && (
          <Banner
            title={errorMessage}
            backgroundColor="#F07120"
            closeBanner={this.closeBanner}
          />
        )}
        <ScrollView style={styles.body}>
          <Text style={styles.title}>Relocate From</Text>
          {relocateFrom !== null && (
            <Card containerStyle={styles.cardContainer}>
              <TextList title="Warehouse" value={relocateFrom.warehouseName} />
              <TextList title="Location" value={relocateFrom.locationId} />
              <TextList title="Client" value={relocateFrom.client.name} />
              <TextList
                title="Item Code"
                value={
                  !!relocateFrom.itemCode
                    ? relocateFrom.itemCode
                    : relocateFrom.product.item_code
                }
              />
              <TextList
                title="Description"
                value={
                  relocateFrom.description
                  // !!relocateFrom.description
                  //   ? relocateFrom.description
                  //   : relocateFrom.product.description
                }
              />
              <TextList title="Quantity" value={relocateFrom.quantity} />
              <TextList
                title="UOM"
                value={
                  typeof relocateFrom.uom === 'object'
                    ? relocateFrom.uom.packaging
                    : relocateFrom.uom
                }
              />
              <TextList
                title="Grade"
                value={productGradeToString(
                  !!relocateFrom.productGrade
                    ? relocateFrom.productGrade
                    : relocateFrom.grade,
                )}
              />
            </Card>
          )}
          <View style={styles.relocateToContainer}>
            <Text style={[styles.title, {marginHorizontal: 0}]}>
              Relocate To
            </Text>
            <Button
              title="By Barcode"
              titleStyle={[styles.buttonText, {fontSize: 14, lineHeight: 21}]}
              buttonStyle={[styles.smallButton]}
              onPress={this.navigateToRequestRelocationBarcode}
            />
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormTitle}>Warehouse</Text>
            <SelectDropdown
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownButtonText}
              rowTextStyle={[styles.dropdownButtonText, {textAlign: 'center'}]}
              data={!!warehouseList ? warehouseList : []}
              defaultButtonText="Select Warehouse"
              onSelect={(selectedItem) => {
                this.handlePicker(selectedItem.id, 'warehouse');
              }}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem.name;
              }}
              rowTextForSelection={(item) => {
                return item.name;
              }}
              renderDropdownIcon={() => (
                <View style={{marginRight: 10}}>
                  <ArrowDown fill="#2D2C2C" width="20px" height="20px" />
                </View>
              )}
            />
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormTitle}>Location ID</Text>
            <SelectDropdown
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownButtonText}
              rowTextStyle={[styles.dropdownButtonText, {textAlign: 'center'}]}
              data={!!locationList ? locationList : []}
              defaultButtonText="Selected Location ID"
              onSelect={(selectedItem) => {
                this.handlePicker(selectedItem.id, 'locationId');
              }}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem.locationId;
              }}
              rowTextForSelection={(item) => {
                return item.locationId;
              }}
              renderDropdownIcon={() => (
                <View style={{marginRight: 10}}>
                  <ArrowDown fill="#2D2C2C" width="20px" height="20px" />
                </View>
              )}
              disabled={selectedWarehouse === null}
            />
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormTitle}>Reason Code</Text>
            <SelectDropdown
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownButtonText}
              rowTextStyle={[styles.dropdownButtonText, {textAlign: 'center'}]}
              data={!!reasonCodeList ? reasonCodeList : []}
              defaultButtonText="Selected Reason Code"
              onSelect={(selectedItem) => {
                this.handlePicker(selectedItem.id, 'reasonCode');
              }}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem.code;
              }}
              rowTextForSelection={(item) => {
                return item.code;
              }}
              renderDropdownIcon={() => (
                <View style={{marginRight: 10}}>
                  <ArrowDown fill="#2D2C2C" width="20px" height="20px" />
                </View>
              )}
            />
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormTitle}>Remarks</Text>
            <Input
              multiline={true}
              containerStyle={{paddingHorizontal: 0}}
              inputContainerStyle={[styles.inputContainer, {height: 'auto'}]}
              numberOfLines={3}
              textAlignVertical="top"
              inputStyle={styles.inputText}
              renderErrorMessage={false}
              value={remarks}
              onChangeText={(text) => this.handleInput(text, 'remarks')}
            />
          </View>
          <View style={[styles.inputFormContainer, {marginHorizontal: 0}]}>
            <View style={{marginHorizontal: 20}}>
              <Text style={styles.inputFormTitle}>Quantity To Transfer</Text>
              <Input
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                keyboardType="numeric"
                renderErrorMessage={false}
                value={quantityToTransfer.toString()}
                onChangeText={(text) => this.calculateSliderPercentage(text)}
              />
            </View>
            <View style={{marginHorizontal: 10}}>
              <Slider
                style={{
                  width: '100%',
                  height: 40,
                  marginTop: 20,
                }}
                minimumValue={0}
                maximumValue={100}
                step={25}
                minimumTrackTintColor="#F07120"
                maximumTrackTintColor="#E7E8F2"
                thumbTintColor="#F07120"
                value={this.state.sliderValue}
                onValueChange={(value) => this.calculateQuantity(value)}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                }}>
                <Text>0%</Text>
                <Text style={{marginLeft: '5%'}}>25%</Text>
                <Text style={{marginLeft: '4%'}}>50%</Text>
                <Text style={{marginLeft: '4%'}}>75%</Text>
                <Text>100%</Text>
              </View>
            </View>
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormTitle}>Destination Grade</Text>
            <SelectDropdown
              buttonStyle={styles.dropdownButton}
              buttonTextStyle={styles.dropdownButtonText}
              rowTextStyle={[styles.dropdownButtonText, {textAlign: 'center'}]}
              data={!!gradeList ? gradeList : []}
              defaultButtonText="Selected Reason Code"
              onSelect={(selectedItem) => {
                this.handlePicker(selectedItem.id, 'grade');
              }}
              buttonTextAfterSelection={(selectedItem) => {
                return selectedItem.grade;
              }}
              rowTextForSelection={(item) => {
                return item.grade;
              }}
              renderDropdownIcon={() => (
                <View style={{marginRight: 10}}>
                  <ArrowDown fill="#2D2C2C" width="20px" height="20px" />
                </View>
              )}
            />
          </View>
          <Button
            title="Confirm Relocate"
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            disabledTitleStyle={{color: '#FFF'}}
            disabledStyle={{backgroundColor: 'gray'}}
            disabled={this.buttonDisabled()}
            onPress={this.confirmRelocate}
          />
        </ScrollView>
        {this.state.showOverlay && (
          <Overlay overlayStyle={{borderRadius: 10, padding: 0}}>
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
                  value={
                    locationList.find((el) => el.id === selectedLocation)
                      .locationId
                  }
                />
                <TextList
                  title="Item Code"
                  value={
                    !!relocateFrom.itemCode
                      ? relocateFrom.itemCode
                      : relocateFrom.product.item_code
                  }
                />
                <TextList
                  title="Description"
                  value={relocateFrom.description}
                />
                <CustomTextList title="Quantity" value={quantityToTransfer} />
                <TextList
                  title="UOM"
                  value={
                    typeof relocateFrom.uom === 'object'
                      ? relocateFrom.uom.packaging
                      : relocateFrom.uom
                  }
                />
                <CustomTextList
                  title="Grade"
                  value={productGradeToString(selectedGrade)}
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

const REASONCODELIST = [
  {id: 1, code: 'BATCHADJ'},
  {id: 2, code: 'CANCEL'},
  {id: 3, code: 'DAMAGED'},
  {id: 4, code: 'EXPADJ'},
  {id: 5, code: 'EXTRA'},
  {id: 6, code: 'LOTADJ'},
  {id: 7, code: 'OC'},
  {id: 8, code: 'PC'},
  {id: 9, code: 'QA INSPECT'},
  {id: 10, code: 'RELOCATION'},
  {id: 11, code: 'STK COUNT'},
  {id: 12, code: 'WE'},
];

const GRADELIST = [
  {id: 1, grade: 'PICK'},
  {id: 2, grade: 'BUFFER'},
  {id: 3, grade: 'DAMAGE'},
  {id: 4, grade: 'DEFECTIVE'},
  {id: 5, grade: 'SHORT EXPIRY'},
  {id: 6, grade: 'EXPIRED'},
  {id: 7, grade: 'NO STOCK'},
  {id: 8, grade: 'RESERVE'},
  {id: 9, grade: 'SIT'},
  {id: 10, grade: 'REWORK'},
];

const NEWLOCATION = {
  location: 'AW-00214',
  itemCode: '342045002',
  description: 'ERGOBLOM V2 BLUE DESK',
  quantity: 30,
  locationOpacity: 60,
  UOM: 'Pair',
  grade: 'expired',
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    marginHorizontal: 20,
    marginTop: 10,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 30,
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
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 5,
  },
  relocateToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
  },
  inputFormContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inputFormTitle: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    paddingHorizontal: 10,
    height: 40,
  },
  inputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  smallButton: {
    ...Mixins.bgButtonPrimary,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  dropdownButton: {
    width: '100%',
    maxHeight: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ABABAB',
    backgroundColor: 'white',
    paddingHorizontal: 0,
  },
  dropdownButtonText: {
    paddingHorizontal: 10,
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#424141',
    textAlign: 'left',
    paddingHorizontal: 0,
  },
});

function mapStateToProps(state) {
  return {
    selectedRequestRelocation:
      state.originReducer.filters.selectedRequestRelocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelocationRequest);
