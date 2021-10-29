import React from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {Badge, Button, SearchBar} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//component
import StockTakeCountItem from '../../../../component/extend/ListItem-stock-take-count';
import Loading from '../../../../component/loading/loading';
// helper
import {getData} from '../../../../component/helper/network';
import {stockTakeCountStatus} from '../../../../component/helper/string';
import Format from '../../../../component/helper/format';
//style
import Mixins from '../../../../mixins';

class StockTakeCountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredStockTakeCountList: null,
      jobData: this.props.route.params?.jobData ?? null,
      stockTakeCountList: null,
      isLoading: true,
      isRefreshing: false,
      search: '',
      filterStatus: 'All',
    };
    this.handleFilterStatus.bind(this);
    this.updateSearch.bind(this);
    this.completeStockTake.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getStockTakeProduct();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.search !== this.state.search ||
      prevState.filterStatus !== this.state.filterStatus
    ) {
      this.filteredStockTakeCountList();
    }
    if (prevState.stockTakeCountList !== this.state.stockTakeCountList) {
      if (this.state.stockTakeCountList !== null) {
        this.filteredStockTakeCountList();
      }
    }
  }

  getStockTakeProduct = async () => {
    this.setState({
      isRefreshing: true,
    });
    const {jobData} = this.state;
    const result = await getData(
      `/stocks-mobile/stock-counts/${jobData.id}/products`,
    );
    if (typeof result === 'object' && result.error === undefined) {
      this.setState({
        stockTakeCountList: result,
      });
    }
    this.setState({
      isLoading: false,
      isRefreshing: false,
    });
  };

  updateSearch = (search) => {
    this.setState({search});
  };

  handleFilterStatus = (value) => {
    this.setState({filterStatus: value});
  };

  checkButtonDisabled = () => {
    const {stockTakeCountList} = this.state;
    let foundData = true;
    if (stockTakeCountList !== null) {
      foundData = stockTakeCountList.find(
        (el) => el.status === 'Waiting' || el.status === 'Reported',
      );
    }
    if (foundData === undefined) {
      return false;
    }
    return true;
  };

  filteredStockTakeCountList = () => {
    const {search, filterStatus, stockTakeCountList} = this.state;
    let filteredStockTakeCountList = [];
    if (search.length > 0) {
      filteredStockTakeCountList = stockTakeCountList.filter((job) => {
        return (
          job.product.itemCode.toLowerCase().includes(search.toLowerCase()) ||
          job.warehouse.locationId
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          job.warehouse.warehouse.toLowerCase().includes(search.toLowerCase())
        );
      });
      if (filterStatus !== 'All') {
        filteredStockTakeCountList = filteredStockTakeCountList.filter(
          (job) => {
            return stockTakeCountStatus(job.status) === filterStatus;
          },
        );
      }
    } else {
      if (filterStatus !== 'All') {
        filteredStockTakeCountList = stockTakeCountList.filter((job) => {
          return stockTakeCountStatus(job.status) === filterStatus;
        });
      }
    }
    this.setState({filteredStockTakeCountList: filteredStockTakeCountList});
  };

  navigateToStockTakeCountDetails = (data) => {
    this.props.navigation.navigate('StockTakeCountDetails', {
      stockTakeDetails: data,
    });
  };

  completeStockTake = () => {
    this.props.navigation.navigate('StockTakeJobList');
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
      stockTakeCountList,
      jobData,
      filteredStockTakeCountList,
      search,
      filterStatus,
      isLoading,
      isRefreshing,
    } = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
            paddingHorizontal: 20,
          }}>
          {jobData !== null && (
            <>
              <View>
                <Text style={styles.text}>{jobData.jobId}</Text>
                <Text style={styles.text}>{jobData.client.name}</Text>
              </View>
              <View>
                <Text style={[styles.text, {textAlign: 'right'}]}>
                  {Format.formatDate(jobData.date)}
                </Text>
                <Text style={[styles.text, {textAlign: 'right'}]}>
                  {jobData.client.code}
                </Text>
              </View>
            </>
          )}
        </View>
        <SearchBar
          placeholder="Search"
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
            value="Reported"
            onPress={() => this.handleFilterStatus('Reported')}
            badgeStyle={
              this.state.filterStatus === 'Reported'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'Reported'
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
            value="Recount"
            onPress={() => this.handleFilterStatus('Recount')}
            badgeStyle={
              this.state.filterStatus === 'Recount'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'Recount'
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
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <FlatList
              data={
                search === '' && filterStatus === 'All'
                  ? stockTakeCountList
                  : filteredStockTakeCountList
              }
              renderItem={({item, index}) => (
                <StockTakeCountItem
                  item={item}
                  navigate={this.navigateToStockTakeCountDetails}
                />
              )}
              refreshing={isRefreshing}
              onRefresh={this.getStockTakeProduct}
              keyExtractor={(item, index) => index}
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 70}}
              ListEmptyComponent={this.renderEmpty}
            />
            <View style={styles.bottomButtonContainer}>
              <Button
                title="Complete Stock Take"
                titleStyle={styles.buttonText}
                buttonStyle={styles.button}
                onPress={this.completeStockTake}
                disabled={this.checkButtonDisabled()}
                disabledStyle={{backgroundColor: '#ABABAB'}}
                disabledTitleStyle={{color: '#FFF'}}
              />
            </View>
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
  text: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#424141',
    fontWeight: '500',
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
  bottomButtonContainer: {
    justifyContent: 'center',
    position: 'absolute',
    height: 70,
    backgroundColor: '#FFF',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginHorizontal: 20,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    color: '#FFF',
  },
});

const STOCKTAKECOUNT = [
  {
    warehouse: 'KEPPEL',
    status: 'Waiting',
    location: 'JP2 C05-002',
    pallet: 'JP2 C05-002',
    itemCode: '561961',
    description: 'DAP ITEMS',
    quantity: '2000',
    UOM: 'PCS',
    grade: '01',
  },
  {
    warehouse: 'KEPPEL',
    status: 'In Progress',
    location: 'JP2 C05-002',
    pallet: 'JP2 C05-002',
    itemCode: '561961',
    description: 'DAP ITEMS',
    quantity: '2000',
    UOM: 'PCS',
    grade: '01',
  },
  {
    warehouse: 'KEPPEL',
    status: 'Reported',
    location: 'JP2 C05-002',
    pallet: 'JP2 C05-002',
    itemCode: '561961',
    description: 'DAP ITEMS',
    quantity: '2000',
    UOM: 'PCS',
    grade: '01',
  },

  {
    warehouse: 'KEPPEL',
    status: 'Waiting',
    location: 'JP2 C05-002',
    pallet: 'JP2 C05-002',
    itemCode: '561961',
    description: 'DAP ITEMS',
    quantity: '2000',
    UOM: 'PCS',
    grade: '01',
  },
];

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

export default connect(mapStateToProps, mapDispatchToProps)(StockTakeCountList);
