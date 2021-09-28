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
import {Picker} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
// component
import {TextList, CustomTextList} from '../../../../component/extend/Text-list';
// style
import Mixins from '../../../../mixins';
// icon
import CheckmarkIcon from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';

const window = Dimensions.get('window');

class RelocationRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocateFrom: RELOCATEFROM,
      warehouseList: WAREHOUSELIST,
      locationList: LOCATIONIDDUMMY,
      reasonCodeList: REASONCODELIST,
      gradeList: GRADELIST,
      newLocation: NEWLOCATION,
      remarks: '',
      quantityToTransfer: 0,
      selectedWarehouse: '',
      selectedLocationId: '',
      selectedReasonCode: '',
      selectedGrade: '',
      sliderValue: 0,
      showOverlay: false,
    };
    this.handleShowOverlay.bind(this);
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
      obj = {selectedLocationId: value};
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
      selectedLocationId,
      selectedReasonCode,
      selectedGrade,
      remarks,
      quantityToTransfer,
    } = this.state;
    if (
      selectedWarehouse === '' ||
      selectedLocationId === '' ||
      selectedReasonCode === '' ||
      selectedGrade === '' ||
      remarks === '' ||
      quantityToTransfer === ''
    ) {
      return true;
    }
    return false;
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
    const {relocateFrom} = this.state;
    let percentage = 0;
    if (value !== '') {
      percentage = ((relocateFrom.quantity * parseInt(value)) / 100) * 10;
    }
    this.setState({
      quantityToTransfer: value,
      sliderValue: percentage,
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

  render() {
    const {
      relocateFrom,
      warehouseList,
      locationList,
      reasonCodeList,
      gradeList,
      newLocation,
      selectedWarehouse,
      selectedLocationId,
      selectedReasonCode,
      selectedGrade,
      remarks,
      quantityToTransfer,
    } = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body}>
          <Text style={styles.title}>Relocate From</Text>
          <Card containerStyle={styles.cardContainer}>
            <Text style={styles.cardTitle}>
              Warehouse {relocateFrom.warehouse}
            </Text>
            <TextList title="Job ID" value={relocateFrom.jobId} />
            <TextList title="Client" value={relocateFrom.client} />
            <TextList title="Location" value={relocateFrom.location} />
            <TextList title="Item Code" value={relocateFrom.itemCode} />
            <TextList title="Description" value={relocateFrom.description} />
            <TextList title="Quantity" value={relocateFrom.quantity} />
            <TextList title="Warehouse" value={relocateFrom.warehouse} />
            <TextList title="From Location" value={relocateFrom.fromLocation} />
            <TextList title="To Location" value={relocateFrom.toLocation} />
          </Card>
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
            <Text style={styles.inputFormtitle}>Warehouse</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dialog"
                selectedValue={selectedWarehouse}
                onValueChange={(value) =>
                  this.handlePicker(value, 'warehouse')
                }>
                <Picker.Item
                  label="Select Warehouse"
                  value=""
                  color="#ABABAB"
                />
                {warehouseList.length > 0 &&
                  warehouseList.map((item) => (
                    <Picker.Item label={item.name} value={item.name} />
                  ))}
              </Picker>
            </View>
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormtitle}>Location ID</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dialog"
                selectedValue={selectedLocationId}
                onValueChange={(value) =>
                  this.handlePicker(value, 'locationId')
                }>
                <Picker.Item
                  label="Select Location ID"
                  value=""
                  color="#ABABAB"
                />
                {locationList.length > 0 &&
                  locationList.map((item) => (
                    <Picker.Item label={item.id} value={item.id} />
                  ))}
              </Picker>
            </View>
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormtitle}>Reason Code</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dialog"
                selectedValue={selectedReasonCode}
                onValueChange={(value) =>
                  this.handlePicker(value, 'reasonCode')
                }>
                <Picker.Item
                  label="Select Reason Code"
                  value=""
                  color="#ABABAB"
                />
                {reasonCodeList.length > 0 &&
                  reasonCodeList.map((item) => (
                    <Picker.Item label={item.code} value={item.code} />
                  ))}
              </Picker>
            </View>
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormtitle}>Remarks</Text>
            <Input
              multiline={true}
              containerStyle={{paddingHorizontal: 0}}
              inputContainerStyle={styles.inputContainer}
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
              <Text style={styles.inputFormtitle}>Quantity To Transfer</Text>
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
                <Text style={{marginLeft: '6%'}}>25%</Text>
                <Text style={{marginLeft: '7%'}}>50%</Text>
                <Text style={{marginLeft: '6%'}}>75%</Text>
                <Text>100%</Text>
              </View>
            </View>
          </View>
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormtitle}>Destination Grade</Text>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dialog"
                selectedValue={selectedGrade}
                onValueChange={(value) => this.handlePicker(value, 'grade')}>
                <Picker.Item label="Select Grade" value="" color="#ABABAB" />
                {gradeList.length > 0 &&
                  gradeList.map((item) => (
                    <Picker.Item label={item.name} value={item.name} />
                  ))}
              </Picker>
            </View>
          </View>
          <Button
            title="Start Relocate"
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            disabledTitleStyle={{color: '#FFF'}}
            disabledStyle={{backgroundColor: 'gray'}}
            disabled={this.buttonDisabled()}
            onPress={() => this.handleShowOverlay(true)}
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
              <TextList title="Location" value={newLocation.location} />
              <TextList title="Item Code" value={newLocation.itemCode} />
              <TextList title="Description" value={newLocation.description} />
              <CustomTextList title="Quantity" value={newLocation.quantity} />
              <TextList title="UOM" value={newLocation.UOM} />
              <CustomTextList title="Grade" value={newLocation.grade} />
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
      </SafeAreaProvider>
    );
  }
}

const RELOCATEFROM = {
  warehouse: 'KEPPEL',
  jobId: '09123',
  client: 'BG5G',
  location: 'JP2 C05-002',
  itemCode: '256000912',
  description: 'ERGOBLOM V2 BLUE DESK',
  requestBy: 'BS5G',
  quantity: 30,
  fromLocation: 'JP2 C05-002',
  toLocation: 'JP-0004',
};

const WAREHOUSELIST = [
  {name: 'KEPPEL'},
  {name: 'KEPPEL 2'},
  {name: 'KEPPEL 3'},
  {name: 'KEPPEL 4'},
];

const LOCATIONIDDUMMY = [
  {id: '123123'},
  {id: '234234'},
  {id: '345434'},
  {id: '4556456'},
];

const REASONCODELIST = [
  {code: 'BATCHADJ', description: 'Batch No Adjustment'},
  {code: 'CANCEL', description: 'CANCEL'},
  {code: 'DAMAGED', description: 'Damaged'},
  {code: 'EXPADJ', description: 'Expiry Date Adjustment'},
  {code: 'EXTRA', description: 'EXTRA PACK'},
  {code: 'LOTADJ', description: 'Lot No Adjustment'},
  {code: 'OC', description: 'Order Cancelled'},
  {code: 'PC', description: 'PACKING COMPLETE'},
  {code: 'QA INSPECT', description: 'Quality Assurance Inpection'},
  {code: 'RELOCATION', description: 'Relocation'},
  {code: 'STK COUNT', description: 'Stock Count Adjustment'},
  {code: 'WE', description: 'Wrong Entry'},
];

const GRADELIST = [
  {name: 'Pick'},
  {name: 'Buffer'},
  {name: 'Damage'},
  {name: 'Defective'},
  {name: 'Short Expiry'},
  {name: 'Expired'},
  {name: 'No Stock'},
  {name: 'Reserve'},
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
  inputFormtitle: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    paddingHorizontal: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(RelocationRequest);
