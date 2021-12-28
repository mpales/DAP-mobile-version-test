import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Badge, Button, SearchBar} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
//component
import Relocation from '../../../../component/extend/ListItem-relocation';
import Loading from '../../../../component/loading/loading';
// helper
import {getData} from '../../../../component/helper/network';
//style
import Mixins from '../../../../mixins';
// icon
import SearchIcon from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';
import ArrowDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-5.svg';

class RelocationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredJobList: null,
      jobList: null,
      search: '',
      filterStatus: 'All',
      selectedSortBy: 'Date Asc',
      isLoading: true,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getRelocatonJobList();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.search !== this.state.search ||
      prevState.filterStatus !== this.state.filterStatus ||
      prevState.jobList !== this.state.jobList
    ) {
      this.filterJoblist();
    }
    if (prevState.filteredJobList !== this.state.filteredJobList) {
      this.sortJobList(this.state.selectedSortBy);
    }
  }

  refreshRelocationList = async () => {
    this.setState({
      isRefreshing: true,
    });
    await this.getRelocatonJobList();
    this.setState({
      isRefreshing: false,
    });
  };

  getRelocatonJobList = async () => {
    const result = await getData('/stocks/stock-relocations/mobile');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        jobList: result,
      });
      this.sortJobList(this.state.selectedSortBy);
    }
    this.setState({
      isLoading: false,
    });
  };

  updateSearch = (search) => {
    this.setState({search});
  };

  handleFilterStatus = (value) => {
    this.setState({filterStatus: value});
  };

  // sort job list asc or desc
  sortJobList = (sortBy) => {
    const {filteredJobList, filterStatus, jobList, search} = this.state;
    this.setState({selectedSortBy: sortBy});
    let newJobList = [];
    if (search === '' && filterStatus === 'All') {
      newJobList = jobList.sort((a, b) => {
        if (sortBy === 'Date Asc') {
          return new Date(a.createdOn) - new Date(b.createdOn);
        } else if (sortBy === 'Date Desc') {
          return new Date(b.createdOn) - new Date(a.createdOn);
        }
      });
      this.setState({jobList: newJobList});
    } else {
      newJobList = filteredJobList.sort((a, b) => {
        if (sortBy === 'Date Asc') {
          return new Date(a.createdOn) - new Date(b.createdOn);
        } else if (sortBy === 'Date Desc') {
          return new Date(b.createdOn) - new Date(a.createdOn);
        }
      });
      this.setState({filteredJobList: newJobList});
    }
    return newJobList;
  };

  filterJoblist = () => {
    const {search, filterStatus} = this.state;
    const {jobList} = this.state;
    if (jobList !== null) {
      let filteredJobList = [];
      if (search.length > 0) {
        filteredJobList = jobList.filter((job) => {
          return (
            job.clientNameFroms
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            job.code.toLowerCase().includes(search.toLowerCase()) ||
            job.itemCodeFroms
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            job.warehouseNameFroms
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        });
        if (filterStatus !== 'All') {
          filteredJobList = filteredJobList.filter((job) => {
            return job.status === filterStatus;
          });
        }
      } else {
        if (filterStatus !== 'All') {
          filteredJobList = jobList.filter((job) => {
            return job.status === filterStatus;
          });
        }
      }
      this.setState({filteredJobList: filteredJobList});
    }
  };

  navigateToDetails = (relocationId, status) => {
    this.props.setBottomBar(false);
    if (status === 'Processing') {
      this.props.navigation.navigate('ConfirmRelocation', {
        relocationId: relocationId,
      });
    } else {
      this.props.navigation.navigate('RelocationDetails', {
        relocationId: relocationId,
      });
    }
  };

  navigateToRequestRelocation = () => {
    this.props.setBottomBar(false);
    this.props.navigation.navigate('RequestRelocation');
  };

  renderEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{...Mixins.subtitle3}}>No Job List</Text>
      </View>
    );
  };

  render() {
    const {
      search,
      filterStatus,
      jobList,
      filteredJobList,
      isLoading,
      isRefreshing,
      selectedSortBy,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.headerText}>Need move own items?</Text>
                <TouchableOpacity onPress={this.navigateToRequestRelocation}>
                  <Text style={styles.navigateText}>Request Relocation</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={require('../../../../assets/request_relocation.png')}
                style={styles.requestRelocation}
              />
            </View>
            <View style={styles.middleContainer}>
              <SearchBar
                placeholder="Search..."
                onChangeText={this.updateSearch}
                value={this.state.search}
                lightTheme={true}
                inputStyle={styles.searchInputText}
                searchIcon={
                  <SearchIcon height="20" width="20" fill="#2D2C2C" />
                }
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchInputContainer}
              />
              <SelectDropdown
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.dropdownButtonText}
                rowTextStyle={[
                  styles.dropdownButtonText,
                  {textAlign: 'center'},
                ]}
                data={['Date Asc', 'Date Desc']}
                defaultValueByIndex={0}
                onSelect={(selectedItem) => {
                  this.sortJobList(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item) => {
                  return item;
                }}
                renderDropdownIcon={() => (
                  <View style={{marginRight: 10}}>
                    <ArrowDown fill="#2D2C2C" width="20px" height="20px" />
                  </View>
                )}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 27,
                        backgroundColor:
                          item === selectedSortBy ? '#e7e8f2' : 'transparent',
                        paddingVertical: 0,
                        marginVertical: 0,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          ...Mixins.small1,
                          fontWeight: '400',
                          lineHeight: 18,
                          color: '#424141',
                          textAlign: 'center',
                        }}>
                        {item}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
            <ScrollView
              style={styles.badgeContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Badge
                value="All"
                onPress={() => this.handleFilterStatus('All')}
                badgeStyle={
                  this.state.filterStatus === 'All'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  this.state.filterStatus === 'All'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="Pending"
                onPress={() => this.handleFilterStatus('Pending')}
                badgeStyle={
                  this.state.filterStatus === 'Pending'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  this.state.filterStatus === 'Pending'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="Processing"
                onPress={() => this.handleFilterStatus('Processing')}
                badgeStyle={
                  this.state.filterStatus === 'Processing'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  this.state.filterStatus === 'Processing'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
            </ScrollView>
            <FlatList
              data={
                search === '' && filterStatus === 'All'
                  ? jobList
                  : filteredJobList
              }
              renderItem={({item, index}) => (
                <Relocation item={item} navigate={this.navigateToDetails} />
              )}
              refreshing={isRefreshing}
              onRefresh={this.refreshRelocationList}
              keyExtractor={(item, index) => index}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flex: 1}}
              ListEmptyComponent={this.renderEmpty}
            />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  headerText: {
    ...Mixins.subtitle3,
    lineHeight: 17,
    color: '#FFF',
    fontSize: 10,
  },
  middleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  navigateText: {
    ...Mixins.subtitle3,
    fontSize: 16,
    lineHeight: 23,
    lineHeight: 20,
    color: '#FFF',
    textDecorationLine: 'underline',
    textDecorationColor: '#FFF',
  },
  requestRelocation: {},
  searchInputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
  },
  searchContainer: {
    width: '48%',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D5D5D5',
    height: 40,
  },
  badgeContainer: {
    flex: 1,
    minHeight: 25,
    maxHeight: 25,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 20,
    minHeight: 25,
  },
  badge: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#121C78',
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 50,
  },
  badgeSelected: {
    flex: 1,
    backgroundColor: '#F07120',
    marginHorizontal: 2,
    paddingHorizontal: 5,
    borderRadius: 50,
  },
  badgeText: {
    ...Mixins.subtitle3,
    color: '#121C78',
  },
  badgeTextSelected: {
    ...Mixins.subtitle3,
    color: 'white',
  },
  dropdownButton: {
    width: '48%',
    maxHeight: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D5D5D5',
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
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelocationList);
