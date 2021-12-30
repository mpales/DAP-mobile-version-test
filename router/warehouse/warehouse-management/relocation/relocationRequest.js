import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Input, Divider} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {getData} from '../../../../component/helper/network';
// component
import RelocationResult from '../../../../component/extend/ListItem-relocation-result';
import Banner from '../../../../component/banner/banner';
// style
import Mixins from '../../../../mixins';
// icon
import TimesCircle from '../../../../assets/icon/iconmonstr-x-mark-5 1mobile.svg';

class RelocationRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      locationId: null,
      locationList: null,
      searchResult: null,
      filteredLocationList: null,
      searchSubmitted: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getLocationList();
      this.props.setSelectedRequestRelocation(null);
      this.props.setSelectedLocationId(null);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getLocationList = async () => {
    const result = await getData('/warehouses/containers/all');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        locationList: result,
      });
    } else {
      this.handleRequestError(result);
    }
  };

  getLocationProductList = async () => {
    const {locationId} = this.state;
    const result = await getData(
      `/stocks/product-storage/location-id/${locationId}`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        searchResult: result,
      });
    } else {
      this.handleRequestError(result);
    }
    this.setState({searchSubmitted: true});
  };

  submitSearch = () => {
    const {location} = this.state;
    if (location === '') {
      return;
    }
    this.getLocationProductList();
  };

  handleInput = (value, type) => {
    let obj = {};
    if (type === 'locationList') {
      if (value === '') {
        obj = {
          location: value,
          filteredLocationList: null,
          searchSubmitted: false,
          searchResult: null,
        };
      } else {
        obj = {
          location: value,
          filteredLocationList: this.filterLocationList(value),
          searchSubmitted: false,
          searchResult: null,
        };
      }
    }
    this.setState(obj);
  };

  handleSelect = (value, type) => {
    if (type === 'location') {
      obj = {
        location: value.locationId,
        locationId: value.locationId,
        filteredLocationList: null,
      };
    }
    this.setState(obj);
  };

  filterLocationList = (value) => {
    const {locationList} = this.state;
    if (locationList !== null) {
      return locationList.filter((location) => {
        if (location.locationId !== null)
          return location.locationId
            .toLowerCase()
            .includes(value.toLowerCase());
      });
    }
    return null;
  };

  resetInput = () => {
    this.setState({
      location: '',
      locationId: null,
      filteredLocationList: null,
      searchSubmitted: false,
      searchResult: null,
    });
  };

  closeBanner = () => {
    this.setState({
      errorMessage: '',
    });
  };

  handleRequestError = (result) => {
    let errorMessage = '';
    if (!!result.error) {
      errorMessage = result.error;
    } else if (typeof result === 'string') {
      errorMessage = result;
    }
    this.setState({
      errorMessage: errorMessage,
    });
  };

  navigateToRequestRelocationForm = (data) => {
    this.props.setSelectedRequestRelocation([data]);
    this.props.setSelectedLocationId(this.state.locationId);
    this.props.navigation.navigate('RequestRelocationForm');
  };

  navigateToRequestRelocationBarcode = () => {
    this.props.navigation.navigate('RequestRelocationBarcode');
  };

  renderItem = (item, type) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.inputContainer,
          {justifyContent: 'center', paddingHorizontal: 10},
        ]}
        onPress={() => this.handleSelect(item, type)}>
        <Text style={styles.inputText}>{item.locationId}</Text>
      </TouchableOpacity>
    );
  };

  renderTimesIcon = () => {
    return (
      <TouchableOpacity onPress={this.resetInput}>
        <TimesCircle height="20" width="20" fill="#121C78" />
      </TouchableOpacity>
    );
  };

  render() {
    const {
      errorMessage,
      searchResult,
      location,
      locationId,
      filteredLocationList,
      searchSubmitted,
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
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.searchContainer}>
            <View style={{paddingHorizontal: 20}}>
              <Text style={styles.title}>Request Relocation</Text>
              <View
                style={
                  Platform.OS === 'ios'
                    ? [styles.inputWrapper, {zIndex: 2}]
                    : styles.inputWrapper
                }>
                <Text style={styles.inputTitle}>Location ID</Text>
                <Input
                  placeholder="Select Location Id"
                  value={location}
                  containerStyle={{paddingHorizontal: 0}}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                  rightIcon={
                    locationId === null ? null : this.renderTimesIcon()
                  }
                  renderErrorMessage={false}
                  onChangeText={(text) =>
                    this.handleInput(text, 'locationList')
                  }
                />
                <View style={styles.dropdownContainer}>
                  {location !== '' &&
                    locationId === null &&
                    filteredLocationList !== null &&
                    filteredLocationList.length === 0 && (
                      <View
                        style={[
                          styles.inputContainer,
                          {justifyContent: 'center', paddingHorizontal: 10},
                        ]}>
                        <Text style={styles.inputText}>No Result</Text>
                      </View>
                    )}
                  {filteredLocationList !== null &&
                    filteredLocationList
                      .slice(0, 4)
                      .map((location) => this.renderItem(location, 'location'))}
                </View>
              </View>
              <Button
                title="Search"
                titleStyle={styles.buttonText}
                buttonStyle={[
                  styles.button,
                  {marginHorizontal: 0, marginTop: 20},
                ]}
                disabled={locationId === null}
                disabledStyle={{backgroundColor: '#ABABAB'}}
                disabledTitleStyle={{color: '#FFF'}}
                onPress={this.submitSearch}
              />
              <Button
                title="Scan Location Barcode"
                titleStyle={styles.buttonText}
                buttonStyle={[
                  styles.button,
                  {marginHorizontal: 0, marginVertical: 20},
                ]}
                onPress={this.navigateToRequestRelocationBarcode}
              />
            </View>
            <Divider color="#ABABAB" style={{marginVertical: 10}} />
            {searchSubmitted && (
              <View style={styles.resultContainer}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                    <Text style={[styles.title, {marginRight: 20}]}>
                      Results
                    </Text>
                    <Text
                      style={[
                        styles.title,
                        styles.textBlue,
                        {flexWrap: 'wrap'},
                      ]}>
                      {`${locationId}`}
                    </Text>
                  </View>
                  <Text style={[styles.text, styles.textBlue]}>{`${
                    searchResult === null ? 0 : searchResult.length
                  } Result`}</Text>
                </View>
                {searchResult !== null &&
                  searchResult.map((item, index) => (
                    <RelocationResult
                      key={index}
                      item={item}
                      navigate={this.navigateToRequestRelocationForm}
                    />
                  ))}
                {searchResult === null ||
                  (Array.isArray(searchResult) && !searchResult.length > 0 && (
                    <View
                      style={{
                        alignItems: 'center',
                        marginTop: '40%',
                      }}>
                      <Text style={styles.title}>No Result</Text>
                    </View>
                  ))}
              </View>
            )}
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
  searchContainer: {
    flexShrink: 1,
    paddingTop: 10,
    overflow: 'visible',
  },
  resultContainer: {
    flexShrink: 1,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    marginTop: 10,
  },
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  text: {
    ...Mixins.subtitle3,
    fontSize: 14,
    lineHeight: 21,
  },
  textBlue: {
    color: '#2A3386',
  },
  inputTitle: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    marginBottom: 10,
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
    marginHorizontal: 10,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  dropdownContainer: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 70,
    zIndex: 1,
    backgroundColor: '#FFF',
  },
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedRequestRelocation: (data) => {
      return dispatch({type: 'SelectedRequestRelocation', payload: data});
    },
    setSelectedLocationId: (data) => {
      return dispatch({type: 'SelectedLocationId', payload: data});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelocationRequest);
