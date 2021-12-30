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
} from 'react-native';
import {Card, Input, SearchBar, Badge} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//component
import Putaway from '../../../../component/extend/ListItem-inbound-putaway-item';
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
      putawayID : null,
      filtered: 0,
      list: [],
      renderGoBack: false,
      renderRefresh: false,
    };

    this.updateASN.bind(this);
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    const {navigation, putawayContent} = props;
    const {putawayID} = state;
    if (putawayID === null) {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.dataCode !== undefined
      ) {
      
        return {...state, putawayID: routes[index].params.dataCode};
      }
      return {...state};
    }

    return {...state};
  }

  updateSearch = (search) => {
    this.setState({search});
  };
  setFiltered = (num) => {
    this.setState({filtered: num});
  };
  updateASN = async () => {
    const {putawayID} = this.state;
    const {currentID} = this.props;
    let contentID = putawayID !== null ? putawayID : currentID;
    const result = await getData('inboundsMobile/putaways');
    if (Array.isArray(result)) {
      let putawayContent = result.find((element) => element.id !== contentID);
      return putawayContent.content;
    } else {
      return [];
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.keyStack !== nextProps.keyStack) {
      if (nextProps.keyStack === 'List') {
        this.setState({renderGoBack: true});
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
      this.props.setPutawayContent(resultedList);
      if (filtered === 0) {
        this.setState({
          list: resultedList.filter(
            (element) =>
              String(element.client)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1,
          ),
          renderGoBack: false,
          renderRefresh: false,
        });
      } else if (filtered === 1) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 1))
            .filter(
              (element) =>
                String(element.client)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
          renderGoBack: false,
          renderRefresh: false,
        });
      } else if (filtered === 2) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 2))
            .filter(
              (element) =>
                String(element.client)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
          renderGoBack: false,
          renderRefresh: false,
        });
      } else if (filtered === 3) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 3))
            .filter(
              (element) =>
                String(element.client)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
          renderGoBack: false,
          renderRefresh: false,
        });
      } else if (filtered === 4) {
        this.setState({
          list: resultedList
            .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 4))
            .filter(
              (element) =>
                String(element.client)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
          renderGoBack: false,
          renderRefresh: false,
        });
      }
    } else {
      const {putawayContent} = this.props;
      let filtered =
        (prevState.renderGoBack !== this.state.renderGoBack &&
          this.state.renderGoBack === true) ||
        prevState.filtered !== this.state.filtered ||
        prevState.search !== this.state.search ||
        prevState.dropdown !== this.state.dropdown
          ? this.state.filtered
          : null;
      if (filtered === 0) {
        this.setState({
          list: putawayContent.filter(
            (element) =>
              String(element.client)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1,
          ),
          renderGoBack: false,
          renderRefresh: false,
        });
      } else if (filtered === 1) {
        this.setState({
          list: putawayContent
            .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 1))
            .filter(
              (element) =>
                String(element.client)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
          renderGoBack: false,
          renderRefresh: false,
        });
      } else if (filtered === 2) {
        this.setState({
          list: putawayContent
            .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 2))
            .filter(
              (element) =>
                String(element.client)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
          renderGoBack: false,
          renderRefresh: false,
        });
      } else if (filtered === 3) {
        this.setState({
          list: putawayContent
            .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 3))
            .filter(
              (element) =>
                String(element.client)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1 ,
            ),
          renderGoBack: false,
          renderRefresh: false,
        });
      } else if (filtered === 4) {
        this.setState({
          list: putawayContent
            .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 4))
            .filter(
              (element) =>
                String(element.client)
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) > -1,
            ),
          renderGoBack: false,
          renderRefresh: false,
        });
      }
    }
  
  }
  async componentDidMount() {
    const resultedList = await this.updateASN();
    this.props.setPutawayContent(resultedList);
    const {filtered} = this.state;
    if (filtered === 0) {
      this.setState({
        list: resultedList.filter(
          (element) =>
            String(element.client)
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) > -1 ,
        ),
          renderGoBack: false,
          renderRefresh: false,
      });
    } else if (filtered === 1) {
      this.setState({
        list: resultedList
          .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 1))
          .filter(
            (element) =>
              String(element.client)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 ,
          ),
          renderGoBack: false,
          renderRefresh: false,
      });
    } else if (filtered === 2) {
      this.setState({
        list: resultedList
          .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 2))
          .filter(
            (element) =>
              String(element.client)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 ,
          ),
          renderGoBack: false,
          renderRefresh: false,
      });
    } else if (filtered === 3) {
      this.setState({
        list: resultedList
          .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 3))
          .filter(
            (element) =>
              String(element.client)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1 ,
          ),
          renderGoBack: false,
          renderRefresh: false,
      });
    } else if (filtered === 4) {
      this.setState({
        list: resultedList
          .filter((element) => element.status === undefined || (element.status !== undefined && element.status === 4))
          .filter(
            (element) =>
              String(element.client)
                .toLowerCase()
                .indexOf(this.state.search.toLowerCase()) > -1,
          ),
          renderGoBack: false,
          renderRefresh: false,
      });
    }
  }
  _onRefresh = () => {
    this.setState({renderRefresh: true});
  };
  render() {
    const {putawayContent} = this.props;
  
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
          <SearchBar
              placeholder="Type Here..."
              onChangeText={this.updateSearch}
              value={this.state.search}
              lightTheme={true}
              inputStyle={{backgroundColor: '#fff'}}
              placeholderTextColor="#2D2C2C"
              searchIcon={() => (
                <IconSearchMobile height="20" width="20" fill="#2D2C2C" />
              )}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                paddingHorizontal: 20,
                marginVertical: 5,
              }}
              inputContainerStyle={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#D5D5D5',
              }}
              leftIconContainerStyle={{backgroundColor: 'white'}}
            />
          <View style={styles.sectionContent}>
            <Card containerStyle={styles.cardContainer}>
            <ScrollView style={styles.headingCard} horizontal={true}>
            <Badge
                    value="All"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(0)}
                    badgeStyle={this.state.filtered === 0 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 0 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Pending"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Reported"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                           <Badge
                    value="Processing"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                           <Badge
                    value="Processed"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(4)}
                    badgeStyle={this.state.filtered === 4 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 4 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                            </ScrollView>
              {this.state.list.length === 0 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 100,
                  }}>
                  <EmptyIlustrate
                    height="132"
                    width="213"
                    style={{marginBottom: 15}}
                  />
                  <Text style={{...Mixins.subtitle3}}>
                    Scroll down to Refresh
                  </Text>
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
                        this.props.navigation.navigate({
                          name: 'PutawayItemDetails',
                          params: {
                            dataCode: data.id,
                          },
                        });
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
    height: 20,
  
    },
    badgeActiveTint: {
      ...Mixins.small3,
      lineHeight: 12,
      color: '#ffffff'
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
      color: '#121C78'
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
    putawayContent: state.originReducer.putawayContent,
    currentID : state.originReducer.putawayID,
    keyStack: state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPutawayContent: (data) => {
      return dispatch({type: 'PutawayContent', payload: data});
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
