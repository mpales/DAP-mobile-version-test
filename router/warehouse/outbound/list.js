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
import {
    Card,
    Input,
    SearchBar,
    Badge
} from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
//component
import OutboundDetail from '../../../component/extend/ListItem-outbound-detail';
//style
import Mixins from '../../../mixins';
//icon
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import Banner from '../../../component/banner/banner';
import {getData} from '../../../component/helper/network';
import mixins, {themeStoreContext} from '../../../mixins';
import {observer} from 'mobx-react';
import EmptyIlustrate from '../../../assets/icon/manifest-empty mobile.svg';
const window = Dimensions.get('window');

@observer
class List extends React.Component {
  static contextType = themeStoreContext;
  _unsubscribe = null;
  constructor(props) {
        super(props);

        this.state = {
            search: '',
            taskNumber: null,
            filtered : 0,
            _list: [],
            updated: false,
            renderRefresh : false,
            renderGoBack : false,
            notifbanner : '',
            notifsuccess: false,
        };
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
    }
    static getDerivedStateFromProps(props,state){
       
        return {...state};
      }
      // shouldComponentUpdate(nextProps, nextState) {
      //   if(this.props.keyStack !== nextProps.keyStack){
      //     if(nextProps.keyStack === 'List' && this.props.keyStack ==='Barcode'){
      //       this.setState({updated: true});
      //       return true;
      //     } else if(nextProps.keyStack === 'List' && this.props.keyStack ==='ReportManifest'){
      //       this.setState({updated: true});
      //       return true;
      //     } else if(nextProps.keyStack === 'List'){
      //       return true;
      //     }
      //   }
      //   return true;
      // }
      async componentDidUpdate(prevProps, prevState, snapshot) {

        if(this.props.keyStack !== prevProps.keyStack){
          if(prevProps.keyStack === 'Barcode' && this.props.keyStack ==='List'){
            this.setState({renderRefresh: true});
    
          } else if(prevProps.keyStack === 'ReportManifest' && this.props.keyStack ==='List'){
            this.setState({updated: true});
          }
        }

        if(this.state.renderRefresh !== prevState.renderRefresh && this.state.renderRefresh === true){
          const {taskNumber} = this.state;
          const {currentTask} = this.props;
          let outboundId = taskNumber === null ? currentTask : taskNumber;
          const resultOutbound = await getData('outboundMobile/pickTask/'+outboundId);
          this.props.setOutboundList(resultOutbound.products)
        }

        const {outboundList} = this.props;
        let filtered = (prevState.renderRefresh !== this.state.renderRefresh && this.state.renderRefresh === true) || (prevState.renderGoBack !== this.state.renderGoBack && this.state.renderGoBack === true)|| prevState.filtered !== this.state.filtered || prevState.search !== this.state.search || this.state.updated === true ? this.state.filtered : null;
        if(filtered === 0) {
          this.setState({_list: outboundList.filter((element)=> String(element.product.item_code).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1), updated: false, renderGoBack: false, renderRefresh: false});
          } else if(filtered === 1){
            this.setState({_list: outboundList.filter((element)=> element.status === 4).filter((element)=> String(element.product.item_code).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1), updated: false, renderGoBack: false, renderRefresh: false});
          } else if(filtered === 2){
            this.setState({_list: outboundList.filter((element)=>  element.status === 1).filter((element)=> String(element.product.item_code).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1), updated: false, renderGoBack: false, renderRefresh: false});
          }else if(filtered === 3){
            this.setState({_list: outboundList.filter((element)=>  element.status === 2).filter((element)=> String(element.product.item_code).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1), updated: false, renderGoBack: false, renderRefresh: false});
          }else if(filtered === 4){
            this.setState({_list: outboundList.filter((element)=>  element.status === 3).filter((element)=> String(element.product.item_code).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1), updated: false, renderGoBack: false, renderRefresh: false});
          } 
       
      }
      async componentDidMount() {
        const {navigation, currentTask,barcodeScanned, ReportedManifest} = this.props;
        const {taskNumber, _manifest, search} = this.state;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
          // do something
          if(this.props.taskSuccess !== null){
            this.setState({notifbanner: this.props.taskSuccess, notifsuccess: true});
            this.props.setItemSuccess(null);
          } else if(this.props.taskError !== null){
            this.setState({notifbanner: this.props.taskError, notifsuccess: false});
            this.props.setItemError(null);
          }
        });
        if(taskNumber === null){
          const {routes, index} = navigation.dangerouslyGetState();
          if(routes[index].params !== undefined && routes[index].params.number !== undefined) {
            const result = await getData('outboundMobile/pickTask/'+routes[index].params.number);
            this.props.setOutboundList(result.products);
            this.setState({taskNumber: routes[index].params.number, updated: true})
          } else if(currentTask !== null) {
            const result = await getData('outboundMobile/pickTask/'+currentTask);
            this.props.setOutboundList(result.products);
            this.setState({taskNumber: currentTask, updated: true})
          } else {
            navigation.popToTop();
          }
        }
      }
      componentWillUnmount(){
        this._unsubscribe();
      }
    updateSearch = (search) => {
        this.setState({search});
      };
    setFiltered = (num)=>{
        this.setState({filtered:num});
    }
    _onRefresh = () => {
      this.setState({renderRefresh: true});
  }
  closeNotifBanner = ()=>{
    this.setState({notifbanner:'', notifsuccess: false});
  }
    render() {
        const {outboundTask} = this.props;
        const {taskNumber, _list} = this.state;
        console.log(_list);
        let currentTask = outboundTask.find((element) => element.id === taskNumber);
        return(
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                {this.state.notifbanner !== '' && (<Banner
                  title={this.state.notifbanner}
                  backgroundColor={this.state.notifsuccess === true ? "#17B055" : "#F1811C"}
                  closeBanner={this.closeNotifBanner}
                />)}
                <ScrollView 
                   style={{...styles.body, backgroundColor: this.context._Scheme5}} 
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl
                      colors={["#9Bd35A", "#689F38"]}
                      refreshing={this.state.renderRefresh}
                      onRefresh={this._onRefresh.bind(this)}
                  />
                 }
                >
                    <View style={styles.headingBar}>
                        <View style={{flex:1,flexDirection: 'row'}}>
                        <View style={{alignItems:'flex-start',flex:1}}>
                            <Text style={{...Mixins.subtitle1,lineHeight:21, color: this.context._Scheme7}}>{currentTask !== undefined ? currentTask.pick_task_no : null}</Text>
                        </View>
                            <View style={{alignItems:'flex-end',flex:1}}>
                            <Text style={{...Mixins.small1,lineHeight:21, color :this.context._Scheme7}}>{currentTask !== undefined ? currentTask.client_id : null}</Text>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                        <Text style={{...Mixins.small1,lineHeight:21,fontWeight:'700', color : this.context._Scheme7}}>{currentTask !== undefined && currentTask.warehouses !== undefined ? currentTask.warehouses.join() : null}</Text>
                        </View>
                    </View>
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
                        <Card containerStyle={{...styles.cardContainer, backgroundColor: this.context._Scheme5}}>
                        <ScrollView style={styles.headingCard} horizontal={true}>
                        <Badge
                    value="All"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(0)}
                    badgeStyle={this.state.filtered === 0 ? styles.badgeActive : {...styles.badgeInactive, backgroundColor: this.context._Scheme8}}
                    textStyle={this.state.filtered === 0 ? styles.badgeActiveTint : {...styles.badgeInactiveTint, color: this.context._Scheme6} }
                    />
                    
                    <Badge
                    value="Waiting"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : {...styles.badgeInactive, backgroundColor: this.context._Scheme8} }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : {...styles.badgeInactiveTint, color: this.context._Scheme6} }
                    />
                    <Badge
                    value="Reported"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : {...styles.badgeInactive, backgroundColor: this.context._Scheme8} }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : {...styles.badgeInactiveTint, color: this.context._Scheme6} }
                    />
                    <Badge
                    value="In Progress"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : {...styles.badgeInactive, backgroundColor: this.context._Scheme8} }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : {...styles.badgeInactiveTint, color: this.context._Scheme6} }
                    />
                    <Badge
                    value="Item Picked"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(4)}
                    badgeStyle={this.state.filtered === 4 ? styles.badgeActive :{...styles.badgeInactive, backgroundColor: this.context._Scheme8}}
                    textStyle={this.state.filtered === 4 ? styles.badgeActiveTint : {...styles.badgeInactiveTint, color: this.context._Scheme6} }
                    />
                            </ScrollView>
                           
                            {_list.length === 0 ? 
                (<View style={{justifyContent:'center',alignItems:'center',marginTop:100}}>
                  {this.state.taskNumber === null ? (    <ActivityIndicator 
                    size={50} 
                    color="#121C78"
                />) :  (<>
                <EmptyIlustrate height="132" width="213" style={{marginBottom:15}}/>
                <Text style={{  ...Mixins.subtitle3,}}>Empty Product</Text>
                </>)}
                  </View>)
                : _list.map((data, i, arr) =>   {
                              
                                return (
                                <OutboundDetail 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        this.props.navigation.navigate({
                                          name: 'Barcode',
                                          params: {
                                              inputCode: data.pick_task_product_id,
                                          }
                                        });
                                    }}
                                    navigation={this.props.navigation}
                                    currentList={this.props.setCurrentList}
                                    // for prototype only
                                    // end
                                />
                            
                            )})}
                        </Card>

                    </View>


                  

                 
                    
                </ScrollView>
            </SafeAreaProvider>
        )
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
        paddingBottom: 20,
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
    breadcrumb : {
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
        marginBottom:20,
        marginTop:0,
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
        sectionHeadPackage: {
            flexDirection: 'column',
            marginHorizontal: 15,
            marginTop: 10,
          },
          headTitle: {
            ...Mixins.h4,
            lineHeight: 27,
          },
});

const outboundListDummy = [
    {
        id: 1,
       sku : 'COCA00012345',
       location_bay: '8992761145019',
       location_rack: ['J R21-15', 'J R21-01'],
       barcode: '8998768568882',
       description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
       category: '-',
       grade : '01',
       UOM : 'PCS',
       packaging : 'PC 1 of 6',
       total_qty: 100,
       whole_qty: '1 pallet',
       phoneNumber: '0123456774',
       name: 'Yan Ting',
       address: 'Blk 110 Pasir Ris Street 11 #11-607',
       zipcode: 'Zip Code',
       scanned: 0,
       timestamp: moment().add(1, 'days').unix(),
       status: 'pending'
    },
    {
      id: 2,
        sku : 'CICI0002323',
        location_bay: '8998768568882',
       location_rack: ['J R21-15', 'J R21-01'],
       barcode: '8992761145019',
       description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
       category: '-',
       grade : '01',
       UOM : 'PCS',
       packaging : 'PC 1 of 6',
       total_qty: 1,
       phoneNumber: '0123456774',
       name: 'Yan Ting',
       address: 'Blk 110 Pasir Ris Street 11 #11-607',
       zipcode: 'Zip Code',
       scanned: 0,
       whole_qty: '1 pallet',
       timestamp: moment().add(1, 'days').unix(),
       status: 'pending'
    },
    {
      id: 3,
        sku : 'ISO0004353453',
        location_bay: 'JP2 C05-003',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TC',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 100,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(2, 'days').unix(),
        status: 'pending'
    },
    {
      id: 4,
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-004',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TD',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 100,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(2, 'days').unix(),
        status: 'pending'
    },
    {
      id: 5,
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-005',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TF',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 50,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(4, 'days').unix(),
        status: 'pending'
    },
    {
      id: 6,
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-006',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TG',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 50,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(1, 'days').unix(),
        status: 'pending'
    },
    {
      id: 7,
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-008',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TH',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 30,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(10, 'days').unix(),
        status: 'pending'
    },
];

function mapStateToProps(state) {
    return {
        outboundTask: state.originReducer.outboundTask,
        outboundList: state.originReducer.outboundList,
        barcodeScanned: state.originReducer.filters.barcodeScanned,
        idScanned: state.originReducer.filters.idScanned,
        currentTask : state.originReducer.filters.currentTask,
        ReportedList : state.originReducer.filters.ReportedList,
        keyStack: state.originReducer.filters.keyStack,
        taskError: state.originReducer.filters.taskError,
        taskSuccess : state.originReducer.filters.taskSuccess,
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
      setBarcodeScanner: (toggle) => {
        return dispatch({type: 'ScannerActive', payload: toggle});
      },
      addCompleteTask : (data)=>{
        return dispatch({type:'addCompleteTask', payload: data})
      },
      setItemScanned : (item) => {
        return dispatch({type: 'BarcodeScanned', payload: item});
      },
      setReportedList: (data) => {
        return dispatch({type:'ReportedList', payload: data});
      },
      setCurrentList: (data) => {
        return dispatch({type:'setCurrentList', payload: data});
      },
      setItemIDScanned : (id) => {
        return dispatch({type: 'ListIDScanned', payload: id});
      },
      setItemError : (error)=>{
        return dispatch({type:'TaskError', payload: error});
      },
      setItemSuccess : (error)=>{
        return dispatch({type:'TaskSuccess', payload: error});
      },
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(List)