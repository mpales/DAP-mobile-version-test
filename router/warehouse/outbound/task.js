import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Card, Input, SearchBar, Badge} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import moment from 'moment';
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

const window = Dimensions.get('window');

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
      renderFiltered : true,
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
    // const {activeTask,completeTask, ReportedTask} = this.props;
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
    const {outboundTask} = this.props;
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
      const resultedList = await this.updateTask();
      this.props.setOutboundTask(resultedList);
      let filtered =
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === true) ||
        prevState.filtered !== this.state.filtered ||
        (prevState.renderFiltered !== this.state.renderFiltered && this.state.renderFiltered === true) ||
        prevState.search !== this.state.search ||
        prevState.dropdown !== this.state.dropdown
          ? this.state.filtered
          : null;
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
      } else if (filtered === 1) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === 5)
            .filter(
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
      } else if (filtered === 2) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === 2)
            .filter(
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
      } else if (filtered === 3) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === 3)
            .filter(
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
      } else if (filtered === 4) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === 4)
            .filter(
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
      }
    } else if (
      prevState.renderGoBack !== this.state.renderGoBack &&
      this.state.renderGoBack === true
    ) {
      const resultedList = await this.updateStatus();
      this.props.setOutboundTask(resultedList);
      let filtered =
        (prevState.renderGoBack !== this.state.renderGoBack &&
          this.state.renderGoBack === true) ||
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === true) ||
        prevState.filtered !== this.state.filtered ||
        (prevState.renderFiltered !== this.state.renderFiltered && this.state.renderFiltered === true) ||
        prevState.search !== this.state.search ||
        prevState.dropdown !== this.state.dropdown
          ? this.state.filtered
          : null;
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
      } else if (filtered === 1) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === 5)
            .filter(
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
      } else if (filtered === 2) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === 2)
            .filter(
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
      } else if (filtered === 3) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === 3)
            .filter(
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
      } else if (filtered === 4) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === 4)
            .filter(
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
      }
    } else {
      let filtered =
        (prevState.renderRefresh !== this.state.renderRefresh &&
          this.state.renderRefresh === false) ||
        prevState.filtered !== this.state.filtered ||
        (prevState.renderFiltered !== this.state.renderFiltered && this.state.renderFiltered === true) ||
        prevState.search !== this.state.search ||
        prevState.dropdown !== this.state.dropdown
          ? this.state.filtered
          : null;
      if (filtered === 0) {
        this.setState({
          list: outboundTask.filter(
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
      } else if (filtered === 1) {
        this.setState({
          list: outboundTask
            .filter((element) => element.status === 5)
            .filter(
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
      } else if (filtered === 2) {
        this.setState({
          list: outboundTask
            .filter((element) => element.status === 2)
            .filter(
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
      } else if (filtered === 3) {
        this.setState({
          list: outboundTask
            .filter((element) => element.status === 3)
            .filter(
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
      } else if (filtered === 4) {
        this.setState({
          list: outboundTask
            .filter((element) => element.status === 4)
            .filter(
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
      }
    }
  }
  async componentDidMount() {
    const resultedList = await this.updateTask();
    this.props.setOutboundTask(resultedList);
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
    } else if (filtered === 1) {
      this.setState({
        list: resultedList
          .filter((element) => element.status === 5)
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
    } else if (filtered === 2) {
      this.setState({
        list: resultedList
          .filter((element) => element.status === 2)
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
    } else if (filtered === 3) {
      this.setState({
        list: resultedList
          .filter((element) => element.status === 3)
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
    } else if (filtered === 4) {
      this.setState({
        list: resultedList
          .filter((element) => element.status === 4)
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
  }
  _onRefresh = () => {
    this.setState({renderRefresh: true, renderFiltered: true});
  };
  render() {
    const {outboundTask} = this.props;
    let arrayWarehouses = [];
    if(Array.isArray(outboundTask) && outboundTask.length > 0){
      arrayWarehouses = Array.from({
        length: outboundTask.length,
      }).map((num, index) => {
        if (outboundTask[index].warehouses !== undefined) {
          return outboundTask[index].warehouses.join();
        }
        return null;
      });
    }
    let stringWarehouses = arrayWarehouses.filter((o)=> o !== null).join();
    let Warehouses = [
      ...new Set(String('All' + (stringWarehouses.length > 0 ? ',' + stringWarehouses : '')).split(',')),
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
          <View style={[styles.headingCard, {paddingVertical: 10}]}>
            <View style={{flex:1, flexDirection:'column', paddingVertical:0}}>
              <Text style={{...Mixins.body1,fontWeight:'700',lineHeight:21,color:'black', marginBottom:5}}>Warehouse</Text>
          <SelectDropdown
                    buttonStyle={{
                     width:'100%',
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
                    defaultValueByIndex={(this.state.dropdown === '' || Warehouses.some((o)=> o === this.state.dropdown) === false) ? 0 : Warehouses.findIndex((o)=> o === this.state.dropdown)}
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
              leftIcon={
                <IconSearchMobile
                  height="20"
                  width="20"
                  fill="#ABABAB"
                  style={{marginLeft: 5}}
                />
              }
              containerStyle={{flex: 1,paddingRight:0}}
              inputContainerStyle={{
                ...styles.textInput,
                backgroundColor: 'white',
              }}
              inputStyle={[
                Mixins.containedInputDefaultStyle,
                {marginHorizontal: 0},
              ]}
              labelStyle={[
                {
                  ...Mixins.body1,
                  ...Mixins.containedInputDefaultLabel,
                  color: this.context._Scheme7
                  ,fontWeight:'700',lineHeight:21,color:'black',
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
                horizontal={true}>
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
              {(this.state.list.length === 0 || this.state.renderFiltered === true) ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 100,
                  }}>
             {this.state.renderFiltered === true ?(<ActivityIndicator 
                    size={50} 
                    color="#121C78"
                />) : (<><EmptyIlustrate height="132" width="213" style={{marginBottom:15}}/>
                              <Text style={{  ...Mixins.subtitle3,}}>Empty Job</Text></>)}
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
  picker: {
    borderWidth: 0,
    borderColor: '#D5D5D5',
    borderRadius: 0,
    marginBottom: 0,
  },
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
  headerBeranda: {
    flexDirection: 'column',
    height: window.width * 0.16,
    backgroundColor: '#121C78',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  ccmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  berandaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 30,
  },
  barSection: {
    flex: 1,
  },
  breadcrumb: {
    alignItems: 'flex-start',
  },
  search: {
    alignItems: 'flex-end',
  },
  navSection: {
    flex: 1,
  },
  toggleDrawer: {
    alignItems: 'flex-start',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  navWrapper: {
    alignItems: 'flex-end',
    flexDirection: 'row',
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

const outboundTaskDummy = [
  {
    code: 'WHUS00018789719',
    warehouse_code: 'Warehouse A1',
    timestamp: moment().subtract(1, 'days').unix(),
    company: 'WORKEDGE',
    sku: 20,
    status: 'Pending',
  },
  {
    code: 'WHUS00018789720',
    warehouse_code: 'Warehouse A1',
    timestamp: moment().subtract(1, 'days').unix(),
    company: 'WORKEDGE',
    sku: 20,
    status: 'Pending',
  },
  {
    code: 'WHUS00018789721',
    warehouse_code: 'Warehouse A1',
    timestamp: moment().subtract(1, 'days').unix(),
    company: 'WORKEDGE',
    sku: 20,
    status: 'Pending',
  },
  {
    code: 'WHUS00018789722',
    warehouse_code: 'Warehouse A1',
    timestamp: moment().subtract(1, 'days').unix(),
    company: 'WORKEDGE',
    sku: 20,
    status: 'Pending',
  },
  {
    code: 'WHUS00018789723',
    warehouse_code: 'Warehouse A1',
    timestamp: moment().unix(),
    company: 'WORKEDGE',
    sku: 20,
    status: 'Progress',
  },
  {
    code: 'WHUS00018789724',
    warehouse_code: 'Warehouse A1',
    timestamp: moment().unix(),
    company: 'WORKEDGE',
    sku: 20,
    status: 'Progress',
  },
  {
    code: 'WHUS00018789725',
    warehouse_code: 'Warehouse A1',
    timestamp: moment().unix(),
    company: 'WORKEDGE',
    sku: 20,
    status: 'Progress',
  },
];

function mapStateToProps(state) {
  return {
    outboundTask: state.originReducer.outboundTask,
    completedInboundList: state.originReducer.completedInboundList,
    ReportedTask: state.originReducer.filters.ReportedTask,
    activeTask: state.originReducer.filters.activeTask,
    completeTask: state.originReducer.filters.completeTask,
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
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
