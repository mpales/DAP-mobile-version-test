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
// style
import Mixins from '../../../../mixins';
// icon
import CheckmarkIcon from '../../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

const window = Dimensions.get('window');

class RelocationRequestConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocateFrom: RELOCATEFROM,
      currentLocation: CURRENTLOCATION,
      newLocation: NEWLOCATION,
      gradeList: GRADELIST,
      quantityToTransfer: 0,
      remarks: '',
      selectedGrade: '',
      sliderValue: 0,
      showOverlay: false,
    };
  }

  handleShowOverlay = (value) => {
    this.setState({
      showOverlay: value ?? false,
    });
  };

  confirmRelocation = () => {
    this.handleShowOverlay(true);
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'remarks') {
      obj = {remarks: value};
    }
    this.setState(obj);
  };

  handlePicker = (value, type) => {
    let obj = {};
    if (type === 'grade') {
      obj = {selectedGrade: value};
    }
    this.setState(obj);
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
      quantityToTransfer: value,
      sliderValue: percentage,
    });
  };

  navigateToRelocationJobList = () => {
    this.handleShowOverlay();
    this.props.setBottomBar(true);
    this.props.navigation.navigate('RelocationList');
  };

  buttonDisabled = () => {
    const {remarks, quantityToTransfer, selectedGrade} = this.state;
    if (selectedGrade === '' || remarks === '' || quantityToTransfer === '') {
      return true;
    }
    return false;
  };

  render() {
    const {
      relocateFrom,
      newLocation,
      remarks,
      gradeList,
      quantityToTransfer,
      showOverlay,
      sliderValue,
    } = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
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
          <View style={styles.inputFormContainer}>
            <Text style={styles.inputFormtitle}>Remarks</Text>
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
                value={sliderValue}
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
            title="Confirm Relocation"
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            disabledTitleStyle={{color: '#FFF'}}
            disabledStyle={{backgroundColor: 'gray'}}
            disabled={this.buttonDisabled()}
            onPress={this.confirmRelocation}
          />
        </ScrollView>
        <Overlay
          overlayStyle={{borderRadius: 10, padding: 0}}
          isVisible={showOverlay}>
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
    height: 40,
  },
  inputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
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

const CURRENTLOCATION = {
  location: 'JP2 C05-002',
  itemCode: '342045002',
  description: 'ERGOBLOM V2 BLUE DESK',
  quantity: 30,
  locationOpacity: 0,
  UOM: 'Pair',
  grade: '01',
};

const NEWLOCATION = {
  location: 'AW-00214',
  itemCode: '342045002',
  description: 'ERGOBLOM V2 BLUE DESK',
  quantity: 30,
  locationOpacity: 60,
  UOM: 'Pair',
  grade: 'expired',
};

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RelocationRequestConfirm);
