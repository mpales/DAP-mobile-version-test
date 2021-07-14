import React from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
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
import mixins from '../../../mixins';

const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            taskNumber: null,
            filtered : 0,
            _list: [],
            updated: false,
        };
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
    }
    static getDerivedStateFromProps(props,state){
        const {navigation,outboundList, currentTask,barcodeScanned, ReportedList, idScanned} = props;
        const {taskNumber, _list, search, filtered} = state;
        if(outboundList.length === 0 && search === ''){
          let list = outboundListDummy.filter((element)=>element.description.indexOf(search) > -1);
          props.setOutboundList(list);
          return {...state, _list : list, updated: true};
        } else if(outboundList.length > 0 && barcodeScanned.length > 0 && idScanned !== null) {
          let list = Array.from({length: outboundList.length}).map((num, index) => {
            return {
                ...outboundList[index],
                scanned: barcodeScanned.includes(outboundList[index].barcode) && idScanned === outboundList[index].id ? barcodeScanned.length : outboundList[index].scanned,
            };
          });
          props.setItemIDScanned(null);
          props.setItemScanned([]);
          props.setOutboundList(list);
          return {...state,_list : list, updated: true};
        } else if(outboundList.length > 0 && ReportedList !== null ) {
          let list = Array.from({length: outboundList.length}).map((num, index) => {
            return {
                ...outboundList[index],
                scanned: ReportedList === outboundList[index].id ? -1 : outboundList[index].scanned,
            };
          });
          props.setReportedList(null);
          props.setOutboundList(list);
          return {...state, _list: list, updated: true}
        } else if(outboundList.length > 0 && _list.length === 0  && search === '' && filtered === 0 ) {
          return {...state, _list: outboundList, updated: true}
        }
        return {...state};
      }
      shouldComponentUpdate(nextProps, nextState) {
        if(this.props.keyStack !== nextProps.keyStack){
          if(nextProps.keyStack === 'List' && this.props.keyStack ==='Barcode'){
            this.setState({updated: true});
            return true;
          } else if(nextProps.keyStack === 'List' && this.props.keyStack ==='ReportManifest'){
            this.setState({updated: true});
            return true;
          } else if(nextProps.keyStack === 'List'){
            return true;
          }
        }
        return true;
      }
      componentDidUpdate(prevProps, prevState, snapshot) {
        const {outboundList} = this.props;
        
        if(prevState.taskNumber !== this.state.taskNumber){
          if(this.state.taskNumber === null){
            this.props.navigation.goBack();
          } else {
            this.setState({_list: []});
            this.props.setOutboundList([]);
          }
        } 
        let filtered = prevState.filtered !== this.state.filtered || prevState.search !== this.state.search || this.state.updated === true ? this.state.filtered : null;
        console.log('test'+ filtered);
        if(filtered === 0) {
          this.setState({_list: outboundList.sort((a,b)=>{
            if(a.scanned !== a.total_qty && b.scanned === b.total_qty)
            return -1;
            if(a.scanned === a.total_qty && b.scanned !== b.total_qty)
            return 1;
            return a.scanned < b.scanned ? 1 : -1;  
        }).filter((element)=> element.description.indexOf(this.state.search) > -1), updated: false});
          } else if(filtered === 1){
            this.setState({_list: outboundList.filter((element)=> element.scanned === -1).filter((element)=> element.description.indexOf(this.state.search) > -1), updated: false});
          } else if(filtered === 2){
            this.setState({_list: outboundList.filter((element)=>  element.scanned === 0).filter((element)=> element.description.indexOf(this.state.search) > -1), updated: false});
          }else if(filtered === 3){
            this.setState({_list: outboundList.filter((element)=>  element.scanned < element.total_qty && element.scanned > 0).filter((element)=> element.description.indexOf(this.state.search) > -1), updated: false});
          }else if(filtered === 4){
            this.setState({_list: outboundList.filter((element)=>  element.scanned === element.total_qty).filter((element)=> element.description.indexOf(this.state.search) > -1), updated: false});
          } 
       
      }
      componentDidMount() {
        const {navigation, currentTask,barcodeScanned, ReportedManifest} = this.props;
        const {taskNumber, _manifest, search} = this.state;
        if(taskNumber === null){
          const {routes, index} = navigation.dangerouslyGetState();
          if(routes[index].params !== undefined && routes[index].params.number !== undefined) {
            this.setState({taskNumber: routes[index].params.number})
          } else if(currentTask !== null) {
            this.setState({taskNumber: currentTask})
          } else {
            navigation.popToTop();
          }
        }
      }
    updateSearch = (search) => {
        this.setState({search});
      };
    setFiltered = (num)=>{
        this.setState({filtered:num});
    }

    render() {
        const {outboundTask} = this.props;
        const {taskNumber, _list} = this.state;
        let currentTask = outboundTask.find((element) => element.code === taskNumber);
        return(
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                <ScrollView 
                    style={styles.body} 
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headingBar}>
                        <View style={{flex:1,flexDirection: 'row'}}>
                        <View style={{alignItems:'flex-start',flex:1}}>
                            <Text style={{...Mixins.subtitle1,lineHeight:21}}>{taskNumber}</Text>
                        </View>
                            <View style={{alignItems:'flex-end',flex:1}}>
                            <Text style={{...Mixins.small1,lineHeight:21}}>{currentTask !== undefined ? currentTask.warehouse_code : null}</Text>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                        <Text style={{...Mixins.small1,lineHeight:21,fontWeight:'700'}}>{currentTask !== undefined ? currentTask.company : null}</Text>
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
                        <Card containerStyle={styles.cardContainer}>
                        <View style={styles.headingCard}>
                        <Badge
                    value="All"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(0)}
                    badgeStyle={this.state.filtered === 0 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 0 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                    <Badge
                    value="Reported"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                    <Badge
                    value="Pending"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                    <Badge
                    value="Progress"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                    <Badge
                    value="Completed"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(4)}
                    badgeStyle={this.state.filtered === 4 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 4 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                            </View>
                            {_list.map((data, i, arr) =>   {
                              let status = 'grey';
                              let textstatus = 'pending';
                              if(data.scanned < data.total_qty && data.scanned >= 0) {
                                if(data.scanned === 0) {
                                  status = 'grey';
                                  textstatus = 'Pending';
                                } else {
                                  status = 'orange'
                                  textstatus = 'Progress'
                                }
                              } else if(data.scanned === -1){
                                status = 'red';
                                textstatus = 'Reported'
                              } else {
                                textstatus = 'Completed'
                                status = 'green';
                              }
                              let printheader = this.state.filtered === 0 && i > 0 && data.scanned !== arr[i -1].scanned;
                                return (
                                <>
                                {printheader && 
                                <View style={{paddingVertical: 10}}>
                                  <Text style={{...Mixins.h6,fontWeight: '600',lineHeight: 27}}>
                                    {textstatus}
                                    </Text></View>
                                }
                                <OutboundDetail 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        this.props.navigation.navigate({
                                          name: 'Barcode',
                                          params: {
                                              inputCode: data.barcode,
                                              bayCode: data.location_bay
                                          }
                                        });
                                    }}
                                    navigation={this.props.navigation}
                                    currentList={this.props.setCurrentList}
                                    // for prototype only
                                    // end
                                />
                                </>
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
       sku : 'ISO00012345',
       location_bay: '8993175536820',
       location_rack: ['J R21-15', 'J R21-01'],
       barcode: '9780312205195',
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
        sku : 'ISO00034434',
        location_bay: '9780312205195',
       location_rack: ['J R21-15', 'J R21-01'],
       barcode: '8993175536820',
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
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(List)