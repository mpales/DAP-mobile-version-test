import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button, Card, Input} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
// component
import {TextList} from '../../../../component/extend/Text-list';
// style
import Mixins from '../../../../mixins';

class RelocationRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocateFrom: RELOCATEFROM,
      warehouseList: WAREHOUSELIST,
      locationList: LOCATIONIDDUMMY,
      reasonCodeList: REASONCODELIST,
      gradeList: GRADELIST,
      remarks: '',
      quantityToTransfer: '',
      selectedWarehouse: '',
      selectedLocationId: '',
      selectedReasonCode: '',
      selectedGrade: '',
    };
  }

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

  navigateToConfirmRelocation = () => {
    this.props.navigation.navigate('ConfirmRelocation');
  };

  render() {
    const {
      relocateFrom,
      warehouseList,
      locationList,
      reasonCodeList,
      gradeList,
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
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormtitle}>Quantity To Transfer</Text>
            <Input
              containerStyle={{paddingHorizontal: 0}}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              keyboardType="numeric"
              renderErrorMessage={false}
              value={quantityToTransfer}
              onChangeText={(text) => this.handleInput(text, 'quantity')}
            />
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
            onPress={this.navigateToConfirmRelocation}
          />
        </ScrollView>
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
