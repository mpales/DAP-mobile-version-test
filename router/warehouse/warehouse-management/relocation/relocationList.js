import React from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Badge, Button, SearchBar} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//component
import Relocation from '../../../../component/extend/ListItem-relocation';
import Loading from '../../../../component/loading/loading';
// helper
import {getData} from '../../../../component/helper/network';
//style
import Mixins from '../../../../mixins';
import moment from 'moment';

class RelocationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredJobList: null,
      jobList: null,
      search: '',
      filterStatus: 'All',
      isLoading: true,
      isRefreshing: false,
    };
    this.handleFilterStatus.bind(this);
    this.updateSearch.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getRelocatonJobList();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.search !== this.state.search ||
      prevState.filterStatus !== this.state.filterStatus
    ) {
      this.filterJoblist();
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
    const result = await getData('/stocks/stock-relocations');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        jobList: result,
      });
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

  filterJoblist = () => {
    const {search, filterStatus} = this.state;
    const {jobList} = this.state;
    let filteredJobList = [];
    if (search.length > 0) {
      filteredJobList = jobList.filter((job) => {
        return (
          job.clientName.toLowerCase().includes(search.toLowerCase()) ||
          job.code.toLowerCase().includes(search.toLowerCase()) ||
          job.itemCode.toLowerCase().includes(search.toLowerCase()) ||
          job.warehouseNameFrom.toLowerCase().includes(search.toLowerCase())
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
  };

  navigateToDetails = (relocationId, status) => {
    this.props.setBottomBar(false);
    if (status === 'In Progress') {
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
          marginTop: '50%',
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
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 15,
                paddingHorizontal: 20,
              }}>
              <Text style={styles.searchTitle}>Search</Text>
              <Button
                buttonStyle={{
                  ...Mixins.bgButtonPrimary,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
                title="Request Relocation"
                titleStyle={{...Mixins.subtitle3, lineHeight: 20}}
                onPress={this.navigateToRequestRelocation}
              />
            </View>
            <SearchBar
              onChangeText={this.updateSearch}
              value={this.state.search}
              lightTheme={true}
              inputStyle={styles.searchInputText}
              searchIcon=""
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.searchInputContainer}
            />
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
                value="Waiting"
                onPress={() => this.handleFilterStatus('Waiting')}
                badgeStyle={
                  this.state.filterStatus === 'Waiting'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  this.state.filterStatus === 'Waiting'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="In Progress"
                onPress={() => this.handleFilterStatus('In Progress')}
                badgeStyle={
                  this.state.filterStatus === 'In Progress'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  this.state.filterStatus === 'In Progress'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="Completed"
                onPress={() => this.handleFilterStatus('Completed')}
                badgeStyle={
                  this.state.filterStatus === 'Completed'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  this.state.filterStatus === 'Completed'
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
  searchTitle: {
    ...Mixins.subtitle3,
    lineHeight: 20,
    color: '#424141',
  },
  searchInputText: {
    ...Mixins.subtitle3,
    lineHeight: 14,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D5D5D5',
    height: 35,
  },
  search: {
    alignItems: 'flex-end',
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
