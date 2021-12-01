import React from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Badge, Button, Overlay, SearchBar} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//component
import StockTakeCountItem from '../../../../component/extend/ListItem-stock-take-count';
import Loading from '../../../../component/loading/loading';
// helper
import {getData} from '../../../../component/helper/network';
import Format from '../../../../component/helper/format';
//style
import Mixins from '../../../../mixins';
// icon
import SearchIcon from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';

const screen = Dimensions.get('window');

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
      isShowModal: false,
    };
  }

  componentDidMount() {
    this.getStockTakeProduct();
    this.props.setStockTakeId(this.state.jobData.id);
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
    if (
      prevProps.keyStack !== this.props.keyStack &&
      prevProps.keyStack === 'StockTakeCountDetails' &&
      this.props.keyStack === 'StockTakeCountList'
    ) {
      setTimeout(() => {
        this.getStockTakeProduct();
      }, 1000);
    }
    if (
      prevProps.keyStack !== this.props.keyStack &&
      prevProps.keyStack === 'ReportStockTakeCount' &&
      this.props.keyStack === 'StockTakeCountList'
    ) {
      this.getStockTakeProduct();
    }
  }

  refreshStockTakeProduct = async () => {
    this.setState({
      isRefreshing: true,
    });
    await this.getStockTakeProduct();
    this.setState({
      isRefreshing: false,
    });
  };

  getStockTakeProduct = async () => {
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
    });
  };

  updateSearch = (search) => {
    this.setState({search});
  };

  handleFilterStatus = (value) => {
    this.setState({filterStatus: value});
  };

  handleShowModal = (value) => {
    this.setState({
      isShowModal: value ?? false,
    });
  };

  handleModalAction = (action) => {
    if (action) {
      this.completeStockTake();
    }
    this.handleShowModal();
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
            return job.status === filterStatus;
          },
        );
      }
    } else {
      if (filterStatus !== 'All') {
        filteredStockTakeCountList = stockTakeCountList.filter((job) => {
          return job.status === filterStatus;
        });
      }
    }
    this.setState({filteredStockTakeCountList: filteredStockTakeCountList});
  };

  completeStockTake = () => {
    this.props.navigation.navigate('StockTakeJobList');
  };

  navigateToStockTakeCountDetails = (data) => {
    this.props.navigation.navigate('StockTakeCountDetails', {
      stockTakeDetails: data,
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

  render() {
    const {
      stockTakeCountList,
      jobData,
      filteredStockTakeCountList,
      search,
      filterStatus,
      isLoading,
      isRefreshing,
      isShowModal,
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
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.text}>{`JOB ID ${jobData.jobId}`}</Text>
                <Text style={[styles.text, {textAlign: 'right'}]}>
                  {Format.formatDate(jobData.date)}
                </Text>
              </View>
              <Text
                style={
                  styles.text
                }>{`${jobData.client.name} (${jobData.client.code})`}</Text>
            </View>
          )}
        </View>
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
              onRefresh={this.refreshStockTakeProduct}
              keyExtractor={(item, index) => index}
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 70}}
              ListEmptyComponent={this.renderEmpty}
            />
            {jobData.status !== 'Completed' && (
              <View style={styles.bottomButtonContainer}>
                <Button
                  title="Complete Recount"
                  titleStyle={styles.buttonText}
                  buttonStyle={styles.button}
                  onPress={() => this.handleShowModal(true)}
                  disabledStyle={{backgroundColor: '#ABABAB'}}
                  disabledTitleStyle={{color: '#FFF'}}
                />
              </View>
            )}
            {isShowModal && (
              <Overlay
                fullScreen={false}
                overlayStyle={styles.containerStyleOverlay}
                isVisible={isShowModal}>
                <Text style={styles.confirmText}>
                  Are you sure sure you want to Complete Recount?
                </Text>
                <View style={styles.cancelButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      {borderWidth: 1, borderColor: '#ABABAB'},
                    ]}
                    onPress={() => this.handleModalAction(false)}>
                    <Text style={[styles.cancelText, {color: '#ABABAB'}]}>
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                    onPress={() => this.handleModalAction(true)}>
                    <Text style={[styles.cancelText, {color: '#FFF'}]}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                </View>
              </Overlay>
            )}
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
    lineHeight: 19,
    color: '#424141',
    fontWeight: '500',
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
  containerStyleOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: screen.height * 0.3,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  confirmText: {
    ...Mixins.subtitle3,
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  cancelText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  cancelButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cancelButton: {
    width: '40%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

function mapStateToProps(state) {
  return {
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setStockTakeId: (id) => {
      return dispatch({type: 'StockTakeId', payload: id});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockTakeCountList);
