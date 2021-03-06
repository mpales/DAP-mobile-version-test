import React from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Badge, SearchBar} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//component
import StockTakeItem from '../../../../component/extend/ListItem-stock-take';
import Loading from '../../../../component/loading/loading';
// helper
import {getData} from '../../../../component/helper/network';
//style
import Mixins from '../../../../mixins';
// icon
import SearchIcon from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';

class StockTakeList extends React.Component {
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
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.setStockTakeId(null);
      this.getStockTakeList();
      this.props.setBottomBar(true);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.search !== this.state.search ||
      prevState.filterStatus !== this.state.filterStatus
    ) {
      this.filterJoblist();
    }
  }

  updateSearch = (search) => {
    this.setState({search});
  };

  handleFilterStatus = (value) => {
    this.setState({filterStatus: value});
  };

  filterJoblist = () => {
    const {search, filterStatus, jobList} = this.state;
    if (jobList !== null) {
      let filteredJobList = [];
      if (search.length > 0) {
        filteredJobList = jobList.filter((job) => {
          return (
            job.jobId.toLowerCase().includes(search.toLowerCase()) ||
            job.client.name.toLowerCase().includes(search.toLowerCase()) ||
            job.client.code.toLowerCase().includes(search.toLowerCase())
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

  refreshStockTakeList = async () => {
    this.setState({
      isRefreshing: true,
    });
    await this.getStockTakeList();
    this.setState({
      isRefreshing: false,
    });
  };

  getStockTakeList = async () => {
    const result = await getData('/stocks-mobile/stock-counts');
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        jobList: result,
      });
    }
    this.setState({
      isLoading: false,
    });
  };

  navigateToStockTakeCountList = (data) => {
    this.props.setBottomBar(false);
    this.props.navigation.navigate('StockTakeCountList', {jobData: data});
  };

  renderEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{...Mixins.subtitle3}}>No Result</Text>
      </View>
    );
  };

  render() {
    const {
      jobList,
      filteredJobList,
      search,
      filterStatus,
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
            <SearchBar
              placeholder="Search..."
              onChangeText={this.updateSearch}
              value={this.state.search}
              lightTheme={true}
              inputStyle={styles.searchInputText}
              searchIcon={<SearchIcon height="20" width="20" fill="#2D2C2C" />}
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
                  filterStatus === 'All' ? styles.badgeSelected : styles.badge
                }
                textStyle={
                  filterStatus === 'All'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="Pending"
                onPress={() => this.handleFilterStatus('Pending')}
                badgeStyle={
                  filterStatus === 'Pending'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  filterStatus === 'Pending'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="Processing"
                onPress={() => this.handleFilterStatus('Processing')}
                badgeStyle={
                  filterStatus === 'Processing'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  filterStatus === 'Processing'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="Pending Review"
                onPress={() => this.handleFilterStatus('Pending Review')}
                badgeStyle={
                  filterStatus === 'Pending Review'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  filterStatus === 'Pending Review'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="Reported"
                onPress={() => this.handleFilterStatus('Reported')}
                badgeStyle={
                  filterStatus === 'Reported'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  filterStatus === 'Reported'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="Completed"
                onPress={() => this.handleFilterStatus('Completed')}
                badgeStyle={
                  filterStatus === 'Completed'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  filterStatus === 'Completed'
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
                <StockTakeItem
                  item={item}
                  navigate={this.navigateToStockTakeCountList}
                />
              )}
              refreshing={isRefreshing}
              onRefresh={this.refreshStockTakeList}
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
  searchInputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
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
    setStockTakeId: (id) => {
      return dispatch({type: 'StockTakeId', payload: id});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockTakeList);
