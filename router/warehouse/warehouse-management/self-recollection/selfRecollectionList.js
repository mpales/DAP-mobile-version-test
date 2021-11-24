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
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import SelfRecollectionItem from '../../../../component/extend/ListItem-self-recollection';
import Loading from '../../../../component/loading/loading';
// style
import Mixins from '../../../../mixins';
// icon
import SearchIcon from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';

class SelfRecollectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredRecollectionList: null,
      recollectionList: null,
      search: '',
      filterStatus: 'All',
      isLoading: true,
      isRefreshing: false,
    };
    this.handleFilterStatus.bind(this);
    this.updateSearch.bind(this);
  }

  componentDidMount() {
    this.setState({
      recollectionList: RECOLLECTIONLIST,
      isLoading: false,
    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
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
      this.filterRecollectionlist();
    }
  }

  updateSearch = (search) => {
    this.setState({search});
  };

  handleFilterStatus = (value) => {
    this.setState({filterStatus: value});
  };

  filterRecollectionlist = () => {
    const {search, filterStatus, recollectionList} = this.state;
    if (recollectionList !== null) {
      let filteredRecollectionList = [];
      if (search.length > 0) {
        filteredRecollectionList = recollectionList.filter((recollection) => {
          return (
            recollection.poId.toLowerCase().includes(search.toLowerCase()) ||
            recollection.client.name
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        });
        if (filterStatus !== 'All') {
          filteredRecollectionList = filteredRecollectionList.filter(
            (recollection) => {
              return recollection.status === filterStatus;
            },
          );
        }
      } else {
        if (filterStatus !== 'All') {
          filteredRecollectionList = recollectionList.filter((recollection) => {
            return recollection.status === filterStatus;
          });
        }
      }
      this.setState({filteredRecollectionList: filteredRecollectionList});
    }
  };

  refreshStockTakeList = async () => {
    this.setState({
      isRefreshing: true,
    });
    // add get recollection list function
    this.setState({
      isRefreshing: false,
    });
  };

  renderEmpty = () => {
    return (
      <View
        style={{
          marginTop: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{...Mixins.subtitle3}}>No Result</Text>
      </View>
    );
  };

  navigateToSelfRecollectionForm = () => {};

  render() {
    const {
      filterStatus,
      filteredRecollectionList,
      isLoading,
      isRefreshing,
      recollectionList,
      search,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <SearchBar
              onChangeText={this.updateSearch}
              value={this.state.search}
              lightTheme={true}
              inputStyle={styles.searchInputText}
              searchIcon={<SearchIcon height="20" width="20" fill="#2D2C2C" />}
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.searchInputContainer}
              placeholder="Search..."
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
                value="Waiting"
                onPress={() => this.handleFilterStatus('Waiting')}
                badgeStyle={
                  filterStatus === 'Waiting'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  filterStatus === 'Waiting'
                    ? styles.badgeTextSelected
                    : styles.badgeText
                }
              />
              <Badge
                value="In Progress"
                onPress={() => this.handleFilterStatus('In Progress')}
                badgeStyle={
                  filterStatus === 'In Progress'
                    ? styles.badgeSelected
                    : styles.badge
                }
                textStyle={
                  filterStatus === 'In Progress'
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
            </ScrollView>
            <FlatList
              data={
                search === '' && filterStatus === 'All'
                  ? recollectionList
                  : filteredRecollectionList
              }
              renderItem={({item, index}) => (
                <SelfRecollectionItem
                  item={item}
                  navigate={this.navigateToSelfRecollectionForm}
                />
              )}
              refreshing={isRefreshing}
              onRefresh={this.refreshStockTakeList}
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

const RECOLLECTIONLIST = [
  {
    date: new Date(),
    poId: 'PO00001234',
    client: {
      name: 'Messi',
    },
    status: 'Waiting',
  },
  {
    date: new Date(),
    poId: 'PO00001235',
    client: {
      name: 'Roberto',
    },
    status: 'Waiting',
  },
  {
    date: new Date(),
    poId: 'PO00001236',
    client: {
      name: 'Li',
    },
    status: 'Waiting',
  },
  {
    date: new Date(),
    poId: 'PO00001237',
    client: {
      name: 'Si',
    },
    status: 'Waiting',
  },
];

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
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
    lineHeight: 21,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    marginVertical: 10,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelfRecollectionList);
