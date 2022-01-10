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
  ActivityIndicator
} from 'react-native';
import {Card, Input, SearchBar, Badge} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//component
import Putaway from '../../../../component/extend/ListItem-inbound-putaway';
//style
import Mixins from '../../../../mixins';
//icon
import IconSearchMobile from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import {getData} from '../../../../component/helper/network';
import EmptyIlustrate from '../../../../assets/icon/Groupempty.svg';
import SelectDropdown from 'react-native-select-dropdown';
import IconArrow66Mobile from '../../../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
const window = Dimensions.get('window');

class List extends React.Component {
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

    this.updateASN.bind(this);
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
  }
  updateSearch = (search) => {
    this.setState({search: search, renderFiltered: true});
  };
  setFiltered = (num) => {
    this.setState({filtered: num, renderFiltered: true});
  };
  updateASN = async () => {
    this.setState({renderGoBack: false});
    const result = await getData('inboundsMobile/putaways');
    if (Array.isArray(result)) {
      return result.filter((element) => element !== null).sort((a, b) => -(String(a.receivedDate).localeCompare(String(b.receivedDate))));
    } else {
      return [];
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.keyStack !== nextProps.keyStack) {
      if (nextProps.keyStack === 'List') {
        this.setState({renderGoBack: true, renderFiltered: true});
        return true;
      }
    }
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.renderRefresh !== this.state.renderRefresh &&
      this.state.renderRefresh === true
    ) {
      const {filtered} = this.state;
      const resultedList = await this.updateASN();
      this.props.setPutawayList(resultedList);
      if (filtered === 0) {
        this.setState({
          list: resultedList.filter(
            (element) =>
              String(element.clientId)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 &&
                (this.state.dropdown === '' ||
                  (this.state.dropdown !== '' &&
                    moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
          ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      } else if (filtered === 1) {
        this.setState({
          list: resultedList
            .filter((element) => element.type === 1)
            .filter(
              (element) =>
                String(element.clientId)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 &&
                  (this.state.dropdown === '' ||
                    (this.state.dropdown !== '' &&
                      moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
            ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      } else if (filtered === 2) {
        this.setState({
          list: resultedList
            .filter((element) => element.type === 2)
            .filter(
              (element) =>
                String(element.clientId)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 &&
                  (this.state.dropdown === '' ||
                    (this.state.dropdown !== '' &&
                      moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
            ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      } else if (filtered === 3) {
        this.setState({
          list: resultedList
            .filter((element) => element.type === 3)
            .filter(
              (element) =>
                String(element.clientId)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 &&
                  (this.state.dropdown === '' ||
                    (this.state.dropdown !== '' &&
                      moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
            ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      } else if (filtered === 4) {
        this.setState({
          list: resultedList
            .filter((element) => element.type === 4)
            .filter(
              (element) =>
                String(element.clientId)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 &&
                  (this.state.dropdown === '' ||
                    (this.state.dropdown !== '' &&
                      moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
            ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      }
    } else {
      const {putawayList} = this.props;
      let filtered =
        (prevState.renderGoBack !== this.state.renderGoBack &&
          this.state.renderGoBack === true) ||
        prevState.filtered !== this.state.filtered ||
        prevState.search !== this.state.search ||
       ( prevState.renderFiltered !== this.state.renderFiltered && this.state.renderFiltered === true) ||
        prevState.dropdown !== this.state.dropdown
          ? this.state.filtered
          : null;
      if (filtered === 0) {
        this.setState({
          list: putawayList.filter(
            (element) =>
              String(element.clientId)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 &&
                (this.state.dropdown === '' ||
                  (this.state.dropdown !== '' &&
                    moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
          ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      } else if (filtered === 1) {
        this.setState({
          list: putawayList
            .filter((element) => element.type === 1)
            .filter(
              (element) =>
                String(element.clientId)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 &&
                  (this.state.dropdown === '' ||
                    (this.state.dropdown !== '' &&
                      moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
            ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      } else if (filtered === 2) {
        this.setState({
          list: putawayList
            .filter((element) => element.type === 2)
            .filter(
              (element) =>
                String(element.clientId)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 &&
                  (this.state.dropdown === '' ||
                    (this.state.dropdown !== '' &&
                      moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
            ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      } else if (filtered === 3) {
        this.setState({
          list: putawayList
            .filter((element) => element.type === 3)
            .filter(
              (element) =>
                String(element.clientId)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 &&
                  (this.state.dropdown === '' ||
                    (this.state.dropdown !== '' &&
                      moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
            ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      } else if (filtered === 4) {
        this.setState({
          list: putawayList
            .filter((element) => element.type === 4)
            .filter(
              (element) =>
                String(element.clientId)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 &&
                  (this.state.dropdown === '' ||
                    (this.state.dropdown !== '' &&
                      moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
            ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
        });
      }
    }
  
  }
  async componentDidMount() {
    const resultedList = await this.updateASN();
    this.props.setPutawayList(resultedList);
    const {filtered} = this.state;
    if (filtered === 0) {
      this.setState({
        list: resultedList.filter(
          (element) =>
            String(element.clientId)
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) > -1 &&
              (this.state.dropdown === '' ||
                (this.state.dropdown !== '' &&
                  moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
        ),
        renderGoBack: false,
        renderRefresh: false,
        renderFiltered: false
      });
    } else if (filtered === 1) {
      this.setState({
        list: resultedList
          .filter((element) => element.type === 1)
          .filter(
            (element) =>
              String(element.clientId)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 &&
                (this.state.dropdown === '' ||
                  (this.state.dropdown !== '' &&
                    moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
          ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
      });
    } else if (filtered === 2) {
      this.setState({
        list: resultedList
          .filter((element) => element.type === 2)
          .filter(
            (element) =>
              String(element.clientId)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 &&
                (this.state.dropdown === '' ||
                  (this.state.dropdown !== '' &&
                    moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
          ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
      });
    } else if (filtered === 3) {
      this.setState({
        list: resultedList
          .filter((element) => element.type === 3)
          .filter(
            (element) =>
              String(element.clientId)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 &&
                (this.state.dropdown === '' ||
                  (this.state.dropdown !== '' &&
                    moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
          ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
      });
    } else if (filtered === 4) {
      this.setState({
        list: resultedList
          .filter((element) => element.type === 4)
          .filter(
            (element) =>
              String(element.clientId)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 &&
                (this.state.dropdown === '' ||
                  (this.state.dropdown !== '' &&
                    moment(element.receivedDate).isSame(this.state.dropdown.split("-").reverse().join("-"), "day"))),
          ),
          renderGoBack: false,
          renderRefresh: false,
          renderFiltered: false
      });
    }
  }
  _onRefresh = () => {
    this.setState({renderRefresh: true,renderFiltered : true});
  };
  render() {
    const {putawayList} = this.props;
    let arrayDate = [];
    if(Array.isArray(putawayList) && putawayList.length > 0){
       arrayDate = Array.from({
        length: putawayList.length,
      }).map((num, index) => {
        if (putawayList[index].receivedDate !== undefined && putawayList[index].receivedDate !== 0) {
          return moment(putawayList[index].receivedDate).format("DD-MM-YYYY");
        }
        return null;
      });
    }
  
    let stringDate = arrayDate.filter((o)=> o !== null).join();
    let DateOption = [
      ...new Set(String('All' + (stringDate.length > 0 ? ',' + stringDate : '')).split(',')),
    ];
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={styles.body}
          refreshControl={
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={this.state.renderRefresh}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          showsVerticalScrollIndicator={false}>
          <View style={{flexDirection:'row',flexShrink:1, alignItems:'flex-start', justifyContent:'flex-start', paddingHorizontal:10,marginTop:15}}>
            <View style={{marginRight:15, flex:1}}>
         
          <Input
              leftIcon={
                <IconSearchMobile
                  height="20"
                  width="20"
                  fill="#ABABAB"
                  style={{marginLeft: 5}}
                />
              }
              containerStyle={{flex: 1}}
              inputContainerStyle={{
                ...styles.textInput,
                backgroundColor: '#fff',
              }}
              inputStyle={[
                Mixins.containedInputDefaultStyle,
                {marginHorizontal: 0},
              ]}
              labelStyle={[
                {
                  ...Mixins.body1,
                  ...Mixins.containedInputDefaultLabel
                  ,fontWeight:'700',lineHeight:21,color:'black',
                },
                {marginBottom: 5},
              ]}
              label="Search"
              onChangeText={this.updateSearch}
              value={this.state.search}
            />
            </View>
            <View style={{flex:1, alignItems:'flex-start', justifyContent:'flex-start'}}>
            <Text
            style={{
              ...Mixins.subtitle1,
              lineHeight: 21,
              color: '#424141',
              marginBottom:5,
            }}>
            Date
          </Text>
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
                    data={DateOption}
                    defaultValueByIndex={(this.state.dropdown === '' || DateOption.some((o)=> o === this.state.dropdown) === false) ? 0 : DateOption.findIndex((o)=> o === this.state.dropdown)}
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
          </View>
       
          <View style={styles.sectionContent}>
            <Card containerStyle={styles.cardContainer}>
              <View style={styles.headingCard}>
                <Badge
                  value="All"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(0)}
                  badgeStyle={
                    this.state.filtered === 0
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                  textStyle={
                    this.state.filtered === 0
                      ? styles.badgeActiveTint
                      : styles.badgeInactiveTint
                  }
                />
                <Badge
                  value="ASN"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(1)}
                  badgeStyle={
                    this.state.filtered === 1
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                  textStyle={
                    this.state.filtered === 1
                      ? styles.badgeActiveTint
                      : styles.badgeInactiveTint
                  }
                />
                <Badge
                  value="GRN"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(2)}
                  badgeStyle={
                    this.state.filtered === 2
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                  textStyle={
                    this.state.filtered === 2
                      ? styles.badgeActiveTint
                      : styles.badgeInactiveTint
                  }
                />
                <Badge
                  value="TRANSIT"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(3)}
                  badgeStyle={
                    this.state.filtered === 3
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                  textStyle={
                    this.state.filtered === 3
                      ? styles.badgeActiveTint
                      : styles.badgeInactiveTint
                  }
                />
                {/* <Badge
                  value="TRANSIT"
                  containerStyle={styles.badgeSort}
                  onPress={() => this.setFiltered(4)}
                  badgeStyle={
                    this.state.filtered === 4
                      ? styles.badgeActive
                      : styles.badgeInactive
                  }
                  textStyle={
                    this.state.filtered === 4
                      ? styles.badgeActiveTint
                      : styles.badgeInactiveTint
                  }
                /> */}
              </View>
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
                              <Text style={{  ...Mixins.subtitle3,}}>Scroll Down to Refresh</Text></>)}
                </View>
              ) : (
                this.state.list.map((data, i, arr) => {
                  return (
                    <Putaway
                      key={i}
                      index={i}
                      item={data}
                      ToManifest={() => {
                        this.props.setBottomBar(false);
                        this.props.setPutawayID(data.id);
                        if(data.type === 1){
                          this.props.navigation.navigate({
                            name: 'PutawayPallet',
                            params: {
                              dataCode: data.id,
                            },
                          });
                        } else if (data.type === 2){
                          // not implemented
                          // this.props.navigation.navigate({
                          //   name: 'PutawayItem',
                          //   params: {
                          //     dataCode: data.id,
                          //   },
                          // });
                        } else {
                          this.props.navigation.navigate({
                             name: 'PutawayTransitDetails',
                             params: {
                               dataCode: data.id,
                             },
                           });
                        }
                      }}
                    />
                  );
                })
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
    marginBottom: 20,
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
    height: 29,
    borderRadius: 5,
  },
  badgeActiveTint: {
    ...Mixins.body1,
    lineHeight: 21,
    fontWeight: '600',
    color: '#ffffff',
  },
  badgeInactive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121C78',
    paddingHorizontal: 12,
    height: 29,
    borderRadius: 5,
  },
  badgeInactiveTint: {
    ...Mixins.body1,
    lineHeight: 21,
    fontWeight: '600',
    color: '#121C78',
  },
});
const ASN = [
  {
    code: '8992761145019',
    timestamp: moment().subtract(1, 'days').unix(),
    location: 'WAREHOUSE A1',
    category: 'ASN',
  },
  {
    code: 'PALLET HJ-1234568',
    timestamp: moment().subtract(4, 'days').unix(),
    location: 'WAREHOUSE A1',
    category: 'ASN',
  },
  {
    code: 'PALLET HJ-1234569',
    timestamp: moment().subtract(3, 'days').unix(),
    location: 'WAREHOUSE A1',
    category: 'ASN',
  },
  {
    code: 'PALLET HJ-1234570',
    timestamp: moment().subtract(1, 'days').unix(),
    location: 'WAREHOUSE A1',
    category: 'GRN',
  },
  {
    code: 'PALLET HJ-1234571',
    timestamp: moment().unix(),
    location: 'WAREHOUSE A1',
    category: 'GRN',
  },
  {
    code: 'PALLET HJ-1234572',
    timestamp: moment().unix(),
    location: 'WAREHOUSE A1',
    category: 'GRN',
  },
  {
    code: 'PALLET HJ-1234573',
    timestamp: moment().unix(),
    location: 'WAREHOUSE A1',
    category: 'GRN',
  },
  {
    code: 'PALLET HJ-1234574',
    timestamp: moment().unix(),
    location: 'WAREHOUSE A1',
    category: 'GRN',
  },
  {
    code: 'PALLET HJ-1234575',
    timestamp: moment().subtract(1, 'days').unix(),
    location: 'WAREHOUSE A1',
    category: 'OTHERS',
  },
  {
    code: 'PALLET HJ-1234576',
    timestamp: moment().subtract(1, 'days').unix(),
    location: 'WAREHOUSE A1',
    category: 'OTHERS',
  },
];

function mapStateToProps(state) {
  return {
    putawayList: state.originReducer.putawayList,
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPutawayList: (data) => {
      return dispatch({type: 'PutawayList', payload: data});
    },
    setPutawayID: (data) => {
      return dispatch({type: 'PutawayID', payload: data});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setCurrentASN: (data) => {
      return dispatch({type: 'setASN', payload: data});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
