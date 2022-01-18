import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Button, SearchBar, Badge, Overlay} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//component
import OutboundDetail from '../../../component/extend/ListItem-outbound-detail';
//style
import Mixins from '../../../mixins';
//icon
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import Banner from '../../../component/banner/banner';
import {getData} from '../../../component/helper/network';
import {themeStoreContext} from '../../../mixins';
import {observer} from 'mobx-react';
import EmptyIlustrate from '../../../assets/icon/manifest-empty mobile.svg';

const screen = Dimensions.get('window');

@observer
class List extends React.Component {
  static contextType = themeStoreContext;
  _unsubscribe = null;
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      taskNumber: null,
      filtered: 0,
      _list: [],
      updated: false,
      renderRefresh: false,
      renderFiltered: true,
      renderGoBack: false,
      notifbanner: '',
      notifsuccess: false,
      isShowModal: false,
    };
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    return {...state};
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.keyStack !== prevProps.keyStack) {
      if (prevProps.keyStack === 'Barcode' && this.props.keyStack === 'List') {
        this.setState({renderRefresh: true});
      } else if (
        prevProps.keyStack === 'ReportManifest' &&
        this.props.keyStack === 'List'
      ) {
        this.setState({renderRefresh: true});
      } else if (
        this.props.keyStack === 'List' &&
        prevProps.keyStack !== 'Task'
      ) {
        this.setState({renderFiltered: true});
      }
    }
    if (
      this.state.renderRefresh !== prevState.renderRefresh &&
      this.state.renderRefresh === true
    ) {
      let shouldUpdatePickList =
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === true) ||
        (prevState.renderGoBack !== this.state.renderGoBack &&
          this.state.renderGoBack === true) ||
        prevState.filtered !== this.state.filtered ||
        prevState.search !== this.state.search ||
        this.state.updated === true
          ? true
          : false;
      if (shouldUpdatePickList === false) return;
      this.handleUpdatePickList();
    } else if (
      this.state.renderFiltered !== prevState.renderFiltered &&
      this.state.renderFiltered === true
    ) {
      let shouldUpdateStatus =
        (prevState.renderFiltered !== this.state.renderFiltered &&
          this.state.renderFiltered === true) ||
        (prevState.renderGoBack !== this.state.renderGoBack &&
          this.state.renderGoBack === true) ||
        prevState.filtered !== this.state.filtered ||
        prevState.search !== this.state.search ||
        this.state.updated === true
          ? true
          : false;
      if (shouldUpdateStatus === false) return;
      this.handleUpdateStatus();
    } else {
      let shouldLocalFilter =
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === false) ||
        (prevState.renderGoBack !== this.state.renderGoBack &&
          this.state.renderGoBack === true) ||
        prevState.filtered !== this.state.filtered ||
        prevState.search !== this.state.search ||
        this.state.updated === true
          ? true
          : false;
      if (shouldLocalFilter === false) return;
      this.handleLocalFilter();
    }
  }

  async componentDidMount() {
    const {navigation, currentTask} = this.props;
    const {taskNumber, _manifest, search} = this.state;
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      if (this.props.taskSuccess !== null) {
        this.setState({
          notifbanner: this.props.taskSuccess,
          notifsuccess: true,
        });
        this.props.setItemSuccess(null);
      } else if (this.props.taskError !== null) {
        this.setState({notifbanner: this.props.taskError, notifsuccess: false});
        this.props.setItemError(null);
      }
    });
    if (taskNumber === null) {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.number !== undefined
      ) {
        const result = await getData(
          'outboundMobile/pickTask/' + routes[index].params.number,
        );
        this.props.setOutboundList(result.products);
        this.setState({taskNumber: routes[index].params.number, updated: true});
      } else if (currentTask !== null) {
        const result = await getData('outboundMobile/pickTask/' + currentTask);
        this.props.setOutboundList(result.products);
        this.setState({taskNumber: currentTask, updated: true});
      } else {
        navigation.popToTop();
      }
    }
  }

  handleUpdatePickList = async () => {
    const {taskNumber} = this.state;
    const {currentTask} = this.props;
    let outboundId = taskNumber === null ? currentTask : taskNumber;
    const resultOutbound = await getData(
      'outboundMobile/pickTask/' + outboundId,
    );
    this.props.setOutboundList(resultOutbound.products);
    this.filteringTask(resultOutbound.products);
  };

  handleUpdateStatus = async () => {
    const resultOutbound = await this.updateStatus();
    this.props.setOutboundList(resultOutbound);
    this.filteringTask(resultOutbound);
  };

  handleLocalFilter = () => {
    const resultedList = this.props.outboundList;
    this.filteringTask(resultedList);
  };

  filteringTask = (resultedList) => {
    if (!!resultedList) {
      const {filtered} = this.state;
      if (filtered === 0) {
        this.setState({
          _list: resultedList.filter(
            (element) =>
              String(element.product.item_code)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1,
          ),
          updated: false,
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false,
        });
      } else {
        this.setState({
          _list: resultedList
            .filter((element) => element.status === filtered)
            .filter(
              (element) =>
                String(element.product.item_code)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
          updated: false,
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false,
        });
      }
    } else {
      this.setState({
        renderGoBack: false,
        renderRefresh: false,
        renderFiltered: false,
      });
    }
  };

  updateStatus = async () => {
    const {taskNumber} = this.state;
    const {currentTask, outboundList} = this.props;
    let outboundId = taskNumber === null ? currentTask : taskNumber;
    const result = await getData(
      '/outboundMobile/pickTask/' + outboundId + '/productStatus',
    );
    let updatedStatus = [];
    if (outboundList !== undefined) {
      for (let index = 0; index < outboundList.length; index++) {
        const element = outboundList[index];
        if (
          result !== undefined &&
          result.error === undefined &&
          result.pick_task_products.length > 0
        ) {
          const elementStatus = result.pick_task_products.find(
            (o) => o.id === element.pick_task_product_id,
          );
          if (elementStatus) delete elementStatus.id;
          updatedStatus[index] = {
            ...element,
            ...elementStatus,
          };
        } else {
          updatedStatus[index] = {
            ...element,
          };
        }
      }
    }
    return updatedStatus;
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  updateSearch = (search) => {
    this.setState({search});
  };

  setFiltered = (num) => {
    this.setState({filtered: num, renderFiltered: true});
  };

  _onRefresh = () => {
    this.setState({renderRefresh: true});
  };

  closeNotifBanner = () => {
    this.setState({notifbanner: '', notifsuccess: false});
  };

  handleShowModal = (value) => {
    this.setState({
      isShowModal: value ?? false,
    });
  };

  handleModalAction = (action) => {
    if (action) {
      // implement api for complete pick task
      this.handleShowModal();
      this.props.navigation.navigate('Task');
    } else {
      this.handleShowModal();
    }
  };

  disableCompleteButton = () => {
    const {_list} = this.state;
    let waitingStatus = _list.find((el) => el.status === 1 || el.status === 2);
    if (waitingStatus === undefined) return false;
    return true;
  };

  render() {
    const {outboundTask} = this.props;
    const {taskNumber, _list, isShowModal} = this.state;
    let currentTask = outboundTask.find((element) => element.id === taskNumber);

    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {this.state.notifbanner !== '' && (
          <Banner
            title={this.state.notifbanner}
            backgroundColor={
              this.state.notifsuccess === true ? '#17B055' : '#F1811C'
            }
            closeBanner={this.closeNotifBanner}
          />
        )}
        <ScrollView
          style={{...styles.body, backgroundColor: this.context._Scheme5}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={this.state.renderRefresh}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          <View style={styles.headingBar}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{alignItems: 'flex-start', flex: 1}}>
                <Text
                  style={{
                    ...Mixins.subtitle1,
                    lineHeight: 21,
                    color: this.context._Scheme7,
                  }}>
                  {currentTask !== undefined ? currentTask.pick_task_no : null}
                </Text>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 21,
                    fontWeight: '700',
                    color: this.context._Scheme7,
                  }}>
                  {currentTask !== undefined &&
                  currentTask.warehouses !== undefined
                    ? currentTask.warehouses.join()
                    : null}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end', flex: 1}}>
                <Text
                  style={{
                    ...Mixins.small1,
                    lineHeight: 21,
                    color: this.context._Scheme7,
                  }}>
                  {currentTask !== undefined ? currentTask.client_id : null}
                </Text>
              </View>
            </View>
          </View>
          <SearchBar
            placeholder="Search..."
            onChangeText={this.updateSearch}
            value={this.state.search}
            lightTheme={true}
            inputStyle={styles.searchInputText}
            searchIcon={
              <IconSearchMobile height="20" width="20" fill="#2D2C2C" />
            }
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.searchInputContainer}
          />
          <View style={styles.sectionContent}>
            <View
              style={{
                ...styles.cardContainer,
                backgroundColor: this.context._Scheme5,
              }}>
              <ScrollView
                style={styles.headingCard}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <Badge
                  value="All"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(0)}
                  badgeStyle={
                    this.state.filtered === 0
                      ? styles.badgeActive
                      : {
                          ...styles.badgeInactive,
                          backgroundColor: this.context._Scheme8,
                        }
                  }
                  textStyle={
                    this.state.filtered === 0
                      ? styles.badgeActiveTint
                      : {
                          ...styles.badgeInactiveTint,
                          color: this.context._Scheme6,
                        }
                  }
                />

                <Badge
                  value="Waiting"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(1)}
                  badgeStyle={
                    this.state.filtered === 1
                      ? styles.badgeActive
                      : {
                          ...styles.badgeInactive,
                          backgroundColor: this.context._Scheme8,
                        }
                  }
                  textStyle={
                    this.state.filtered === 1
                      ? styles.badgeActiveTint
                      : {
                          ...styles.badgeInactiveTint,
                          color: this.context._Scheme6,
                        }
                  }
                />
                <Badge
                  value="Reported"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(4)}
                  badgeStyle={
                    this.state.filtered === 4
                      ? styles.badgeActive
                      : {
                          ...styles.badgeInactive,
                          backgroundColor: this.context._Scheme8,
                        }
                  }
                  textStyle={
                    this.state.filtered === 4
                      ? styles.badgeActiveTint
                      : {
                          ...styles.badgeInactiveTint,
                          color: this.context._Scheme6,
                        }
                  }
                />
                <Badge
                  value="In Progress"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(2)}
                  badgeStyle={
                    this.state.filtered === 2
                      ? styles.badgeActive
                      : {
                          ...styles.badgeInactive,
                          backgroundColor: this.context._Scheme8,
                        }
                  }
                  textStyle={
                    this.state.filtered === 2
                      ? styles.badgeActiveTint
                      : {
                          ...styles.badgeInactiveTint,
                          color: this.context._Scheme6,
                        }
                  }
                />
                <Badge
                  value="Item Picked"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(3)}
                  badgeStyle={
                    this.state.filtered === 3
                      ? styles.badgeActive
                      : {
                          ...styles.badgeInactive,
                          backgroundColor: this.context._Scheme8,
                        }
                  }
                  textStyle={
                    this.state.filtered === 3
                      ? styles.badgeActiveTint
                      : {
                          ...styles.badgeInactiveTint,
                          color: this.context._Scheme6,
                        }
                  }
                />
              </ScrollView>
              {_list.length === 0 ||
              this.state.taskNumber === null ||
              this.state.renderRefresh ||
              this.state.renderFiltered ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 100,
                  }}>
                  {this.state.renderFiltered || this.state.renderRefresh ? (
                    <ActivityIndicator size={50} color="#121C78" />
                  ) : (
                    <>
                      <EmptyIlustrate
                        height="132"
                        width="213"
                        style={{marginBottom: 15}}
                      />
                      <Text style={{...Mixins.subtitle3}}>Empty Product</Text>
                    </>
                  )}
                </View>
              ) : (
                _list.map((data, i, arr) => {
                  return (
                    <OutboundDetail
                      key={i}
                      index={i}
                      item={data}
                      ToManifest={() => {
                        this.props.setBottomBar(false);
                        this.props.navigation.navigate({
                          name: 'Barcode',
                          params: {
                            inputCode: data.pick_task_product_id,
                          },
                        });
                      }}
                      navigation={this.props.navigation}
                      currentList={this.props.setCurrentList}
                    />
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <Button
            title="Complete Pick Task"
            titleStyle={styles.buttonText}
            buttonStyle={styles.button}
            onPress={() => this.handleShowModal(true)}
            disabled={_list.length === 0 ? true : this.disableCompleteButton()}
            disabledStyle={{backgroundColor: '#ABABAB'}}
            disabledTitleStyle={{color: '#FFF'}}
          />
        </View>
        {isShowModal && (
          <Overlay
            fullScreen={false}
            overlayStyle={styles.containerStyleOverlay}
            isVisible={isShowModal}>
            <Text style={styles.confirmText}>
              Are you sure sure you want to Complete Pick Task?
            </Text>
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {borderWidth: 1, borderColor: '#ABABAB'},
                ]}
                onPress={() => this.handleModalAction(false)}>
                <Text style={[styles.cancelText, {color: '#ABABAB'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                onPress={() => this.handleModalAction(true)}>
                <Text style={[styles.cancelText, {color: '#FFF'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Overlay>
        )}
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
    marginBottom: 70,
  },
  headingCard: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  badgeSort: {
    marginRight: 5,
  },
  sectionContent: {
    marginHorizontal: 20,
    marginBottom: 0,
  },
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
    marginBottom: 20,
    marginTop: 0,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0, //default is 1
    shadowRadius: 0, //default is 1
    elevation: 0,
    backgroundColor: '#ffffff',
  },
  headingBar: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  badgeActive: {
    backgroundColor: '#F1811C',
    borderWidth: 1,
    borderColor: '#F1811C',
    paddingHorizontal: 12,
    height: 20,
  },
  badgeActiveTint: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#ffffff',
  },
  badgeInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121C78',
    paddingHorizontal: 12,
    height: 20,
  },
  badgeInactiveTint: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#121C78',
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
  searchInputText: {
    ...Mixins.subtitle3,
    padding: 0,
    lineHeight: 24,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D5D5D5',
    height: 40,
  },
});

function mapStateToProps(state) {
  return {
    outboundTask: state.originReducer.outboundTask,
    outboundList: state.originReducer.outboundList,
    currentTask: state.originReducer.filters.currentTask,
    keyStack: state.originReducer.filters.keyStack,
    taskError: state.originReducer.filters.taskError,
    taskSuccess: state.originReducer.filters.taskSuccess,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOutboundList: (data) => {
      return dispatch({type: 'OutboundList', payload: data});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setCurrentList: (data) => {
      return dispatch({type: 'setCurrentList', payload: data});
    },
    setItemError: (error) => {
      return dispatch({type: 'TaskError', payload: error});
    },
    setItemSuccess: (error) => {
      return dispatch({type: 'TaskSuccess', payload: error});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
