import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Card, Input, Badge} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
//component
import Outbound from '../../../component/extend/ListItem-outbound';
//style
import Mixins, {themeStoreContext} from '../../../mixins';
//icon

import IconArrow66Mobile from '../../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import {observer} from 'mobx-react';
import EmptyIlustrate from '../../../assets/icon/list-empty mobile.svg';
import {getData} from '../../../component/helper/network';

@observer
class List extends React.Component {
  static contextType = themeStoreContext;
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      dropdown: '',
      filtered: 0,
      list: [],
      renderGoBack: false,
      renderRefresh: false,
      renderFiltered: true,
    };
    this.updateTask.bind(this);
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
  }

  updateSearch = (search) => {
    this.setState({search: search, renderFiltered: true});
  };

  setFiltered = (num) => {
    this.setState({filtered: num, renderGoBack: true, renderFiltered: true});
  };

  updateTask = async () => {
    const result = await getData('outboundMobile/pickTask');
    if (Array.isArray(result)) {
      return result
        .filter((o) => o !== null)
        .sort(
          (a, b) =>
            -String(a.delivery_date).localeCompare(String(b.delivery_date)),
        );
    } else {
      return [];
    }
  };

  updateStatus = async () => {
    const {outboundTask} = this.props;
    const result = await getData('/outboundMobile/pickTask/status');
    let updatedStatus = [];
    for (let index = 0; index < outboundTask.length; index++) {
      const element = outboundTask[index];
      if (result !== undefined && result.error === undefined) {
        const elementStatus = result.find((o) => o.id === element.id);
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
    return updatedStatus;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.keyStack !== prevProps.keyStack) {
      if (
        this.props.keyStack === 'Task' &&
        prevProps.keyStack !== 'WarehouseOut'
      ) {
        this.setState({renderGoBack: true, renderFiltered: true});
      }
    }
    if (
      prevState.renderRefresh !== this.state.renderRefresh &&
      this.state.renderRefresh === true
    ) {
      let shouldUpdateTask =
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === true) ||
        prevState.filtered !== this.state.filtered ||
        (prevState.renderFiltered !== this.state.renderFiltered &&
          this.state.renderFiltered === true) ||
        prevState.search !== this.state.search ||
        prevState.dropdown !== this.state.dropdown
          ? true
          : false;
      if (shouldUpdateTask === false) return;
      this.handleUpdatePickTask();
    } else if (
      prevState.renderGoBack !== this.state.renderGoBack &&
      this.state.renderGoBack === true
    ) {
      let shouldUpdateStatus =
        (prevState.renderGoBack !== this.state.renderGoBack &&
          this.state.renderGoBack === true) ||
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === true) ||
        prevState.filtered !== this.state.filtered ||
        (prevState.renderFiltered !== this.state.renderFiltered &&
          this.state.renderFiltered === true) ||
        prevState.search !== this.state.search ||
        prevState.dropdown !== this.state.dropdown
          ? true
          : false;
      if (shouldUpdateStatus === false) return;
      this.handleUpdateStatus();
    } else {
      let shouldLocalFilter =
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === false) ||
        prevState.filtered !== this.state.filtered ||
        (prevState.renderFiltered !== this.state.renderFiltered &&
          this.state.renderFiltered === true) ||
        prevState.search !== this.state.search ||
        prevState.dropdown !== this.state.dropdown
          ? true
          : false;
      if (shouldLocalFilter === false) return;
      this.handleLocalFilter();
    }
  }

  componentDidMount() {
    this.handleUpdatePickTask();
  }

  handleUpdatePickTask = async () => {
    const resultedList = await this.updateTask();
    this.props.setOutboundTask(resultedList);
    this.filteringTask(resultedList);
  };

  handleUpdateStatus = async () => {
    const resultedList = await this.updateStatus();
    this.props.setOutboundTask(resultedList);
    this.filteringTask(resultedList);
  };

  handleLocalFilter = () => {
    const resultedList = this.props.outboundTask;
    this.filteringTask(resultedList);
  };

  filteringTask = (resultedList) => {
    if (!!resultedList) {
      const {filtered} = this.state;
      if (filtered === 0) {
        this.setState({
          list: resultedList.filter(
            (element) =>
              String(element.client_id)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 &&
              (this.state.dropdown === '' ||
                (this.state.dropdown !== '' &&
                  element.warehouses.includes(this.state.dropdown))),
          ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false,
        });
      } else {
        this.setState({
          list: resultedList
            .filter((element) => element.status === filtered)
            .filter(
              (element) =>
                String(element.client_id)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
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

  _onRefresh = () => {
    this.setState({renderRefresh: true, renderFiltered: true});
  };

  render() {
    const {outboundTask} = this.props;
    let arrayWarehouses = [];
    if (Array.isArray(outboundTask) && outboundTask.length > 0) {
      arrayWarehouses = Array.from({
        length: outboundTask.length,
      }).map((num, index) => {
        if (outboundTask[index].warehouses !== undefined) {
          return outboundTask[index].warehouses.join();
        }
        return null;
      });
    }
    let stringWarehouses = arrayWarehouses.filter((o) => o !== null).join();
    let Warehouses = [
      ...new Set(
        String(
          'All' + (stringWarehouses.length > 0 ? ',' + stringWarehouses : ''),
        ).split(','),
      ),
    ];
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
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
          <View style={[styles.headingCard, {paddingTop: 10}]}>
            <View
              style={{flex: 1, flexDirection: 'column', paddingVertical: 0}}>
              <Text
                style={{
                  ...Mixins.body1,
                  fontWeight: '700',
                  lineHeight: 21,
                  color: 'black',
                  marginBottom: 5,
                }}>
                Warehouse
              </Text>
              <SelectDropdown
                buttonStyle={{
                  width: '100%',
                  maxHeight: 30,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#D5D5D5',
                  backgroundColor: 'white',
                }}
                buttonTextStyle={{
                  ...Mixins.small1,
                  fontWeight: '400',
                  lineHeight: 18,
                  color: '#424141',
                  textAlign: 'left',
                }}
                data={Warehouses}
                defaultValueByIndex={
                  this.state.dropdown === '' ||
                  Warehouses.some((o) => o === this.state.dropdown) === false
                    ? 0
                    : Warehouses.findIndex((o) => o === this.state.dropdown)
                }
                onSelect={(selectedItem, index) => {
                  this.setState({
                    dropdown: selectedItem === 'All' ? '' : selectedItem,
                    renderFiltered: true,
                  });
                }}
                renderDropdownIcon={() => {
                  return (
                    <IconArrow66Mobile
                      fill="#2D2C2C"
                      height="15"
                      width="15"
                      style={{transform: [{rotate: '90deg'}]}}
                    />
                  );
                }}
                dropdownIconPosition="right"
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
                renderCustomizedRowChild={(item, index) => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 27,
                        backgroundColor:
                          item === this.state.dropdown ||
                          (item === 'All' && this.state.dropdown === '')
                            ? '#e7e8f2'
                            : 'transparent',
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
                        }}>
                        {item}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
            <Input
              placeholder="Search..."
              leftIcon={
                <IconSearchMobile
                  height="20"
                  width="20"
                  fill="#ABABAB"
                  style={{marginLeft: 5}}
                />
              }
              containerStyle={{flex: 1, paddingRight: 0}}
              inputContainerStyle={{
                ...styles.textInput,
                backgroundColor: 'white',
              }}
              inputStyle={[
                Mixins.containedInputDefaultStyle,
                Mixins.subtitle3,
                {marginHorizontal: 0, lineHeight: 21},
              ]}
              labelStyle={[
                {
                  ...Mixins.body1,
                  ...Mixins.containedInputDefaultLabel,
                  color: this.context._Scheme7,
                  fontWeight: '700',
                  lineHeight: 21,
                  color: 'black',
                },
                {marginBottom: 5},
              ]}
              label="Search"
              onChangeText={this.updateSearch}
              value={this.state.search}
            />
          </View>
          <View style={styles.sectionContent}>
            <Card
              containerStyle={{
                ...styles.cardContainer,
                backgroundColor: this.context._Scheme5,
              }}>
              <ScrollView
                style={{flexDirection: 'row', paddingBottom: 10}}
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
                  value="Reported"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(5)}
                  badgeStyle={
                    this.state.filtered === 5
                      ? styles.badgeActive
                      : {
                          ...styles.badgeInactive,
                          backgroundColor: this.context._Scheme8,
                        }
                  }
                  textStyle={
                    this.state.filtered === 5
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
                <Badge
                  value="Completed"
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
              </ScrollView>
              {this.state.list.length === 0 ||
              this.state.renderFiltered === true ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 100,
                  }}>
                  {this.state.renderFiltered === true ? (
                    <ActivityIndicator size={50} color="#121C78" />
                  ) : (
                    <>
                      <EmptyIlustrate
                        height="132"
                        width="213"
                        style={{marginBottom: 15}}
                      />
                      <Text style={{...Mixins.subtitle3}}>Empty Job</Text>
                    </>
                  )}
                </View>
              ) : (
                this.state.list.map((data, i) => (
                  <Outbound
                    key={i}
                    index={i}
                    item={data}
                    ToManifest={() => {
                      this.props.setBottomBar(true);
                      this.props.setCurrentTask(data.id);
                      // this.props.setActiveTask(data.id);
                      this.props.navigation.navigate({
                        name: 'List',
                        params: {
                          number: data.id,
                        },
                      });
                    }}
                  />
                ))
              )}
            </Card>
          </View>
        </ScrollView>
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
  },
  headingCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  badgeSort: {
    marginRight: 5,
  },
  sectionContent: {
    marginHorizontal: 20,
    marginBottom: 0,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 30,
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
});

function mapStateToProps(state) {
  return {
    outboundTask: state.originReducer.outboundTask,
    activeTask: state.originReducer.filters.activeTask,
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOutboundTask: (data) => {
      return dispatch({type: 'OutboundTask', payload: data});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setCurrentTask: (data) => {
      return dispatch({type: 'setTask', payload: data});
    },
    setActiveTask: (data) => {
      return dispatch({type: 'addActiveTask', payload: data});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
