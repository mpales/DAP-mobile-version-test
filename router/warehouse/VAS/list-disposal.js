import React from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl
} from 'react-native';
import {
    Card,
    Input,
    SearchBar,
    Badge,
    Button,
    Overlay
} from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider,  SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
//component
import VASManifest from '../../../component/extend/ListItem-VAS-disposal';
//style
import Mixins from '../../../mixins';
//icon
import SelectDropdown from 'react-native-select-dropdown'
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import {getData} from '../../../component/helper/network';
import Loading from '../../../component/loading/loading';
import { element } from 'prop-types';
import EmptyIlustrate from '../../../assets/icon/Groupempty.svg';
const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _visibleOverlay: false,
            receivingNumber : null,
            search: '',
            filtered : 0,
            type: null,
            sortBy : '',
            renderGoBack : false,
            renderRefresh : false,
        };

    this.updateASN.bind(this);
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
    }

    static getDerivedStateFromProps(props,state){
        const {navigation} = props;
        const {type, receivingNumber} = state;
        const {routes, index} = navigation.dangerouslyGetState();
        if(receivingNumber === null ){

            if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined  ){
                //if multiple sku
               return {...state, type : routes[index].params.type,renderRefresh : routes[index].params.type === state.type ? state.renderRefresh : true, receivingNumber : routes[index].params.dataCode};
            }
            return {...state};
        }
        return {...state};
      }
    updateSearch = (search) => {
        this.setState({search});
      };
    setFiltered = (num)=>{
        this.setState({filtered:num});
    }
    updateASN = async ()=>{
        const {type} = this.state;
        const {activeDisposal, completeDisposal,ReportedDisposal} = this.props;
        const result = Array.from({length: outboundListDummy.length}).map((num,index)=>{
            if (completeDisposal.includes(outboundListDummy[index].id)){
                return {
                    ...outboundListDummy[index],
                    status: 'complete',
                };
            } else if(ReportedDisposal.includes(outboundListDummy[index].id)){
                return {
                    ...outboundListDummy[index],
                    status: 'reported'
                }
            } else if(activeDisposal.includes(outboundListDummy[index].id)){
                return {
                    ...outboundListDummy[index],
                    status : 'progress',
                };
            } else {
                return outboundListDummy[index];
            }

        });
        this.setState({renderGoBack: false, renderRefresh: false});
        if(Array.isArray(result)){
            return result;
        } else {
            return [];
        }
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.keyStack !== nextProps.keyStack){
        if(nextProps.keyStack === 'ListDisposal'){
            this.setState({renderGoBack : true});
            return true;
        }
        }
        return true;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        let filtered = prevState.renderGoBack !== this.state.renderGoBack || prevState.renderRefresh !== this.state.renderRefresh || prevState.filtered !== this.state.filtered || prevState.search !== this.state.search ? this.state.filtered : null;
        if(filtered === 0) {
            let AllASN = await this.updateASN();
            this.props.setDisposalList(AllASN.filter((element)=> element.barcode.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            let PendingASN = await this.updateASN();
            this.props.setDisposalList(PendingASN.filter((element)=> element.status === 'pending').filter((element)=> element.barcode.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            let ProgressASN = await this.updateASN();
            this.props.setDisposalList(ProgressASN.filter((element)=> element.status === 'progress').filter((element)=> element.barcode.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            let CompleteASN = await this.updateASN();
            this.props.setDisposalList(CompleteASN.filter((element)=> element.status === 'complete').filter((element)=> element.barcode.indexOf(this.state.search) > -1));
        }else if(filtered === 4){
            let ReportedASN = await this.updateASN();
            this.props.setDisposalList(ReportedASN.filter((element)=> element.status === 'reported').filter((element)=> element.barcode.indexOf(this.state.search) > -1));
        }
        
        
    }
    async componentDidMount() {

        const {filtered} = this.state;
        if(filtered === 0) {
            let AllASN = await this.updateASN();
            this.props.setDisposalList(AllASN.filter((element)=> element.barcode.indexOf(this.state.search) > -1));
        }else if(filtered === 1){
            let PendingASN = await this.updateASN();
            this.props.setDisposalList(PendingASN.filter((element)=> element.status === 'pending').filter((element)=> element.barcode.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            let ProgressASN = await this.updateASN();
            this.props.setDisposalList(ProgressASN.filter((element)=> element.status === 'progress').filter((element)=> element.barcode.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            let CompleteASN = await this.updateASN();
            this.props.setDisposalList(CompleteASN.filter((element)=> element.status === 'complete').filter((element)=> element.barcode.indexOf(this.state.search) > -1));
        }else if(filtered === 4){
            let ReportedASN = await this.updateASN();
            this.props.setDisposalList(ReportedASN.filter((element)=> element.status === 'reported').filter((element)=> element.barcode.indexOf(this.state.search) > -1));
        }
    }
    _onRefresh = () => {
        this.setState({renderRefresh: true});
    }
    toggleOverlay = () => {
        const {_visibleOverlay} = this.state;
        this.setState({_visibleOverlay: !_visibleOverlay});
      };

      handleConfirm = async ({action}) => {
        const {receivingNumber} = this.state;
        const {currentASN} = this.props;
        this.toggleOverlay();
        if (action) {
         
            this.props.navigation.navigate( {
                name: 'ItemDisposalDetail',
                params: {
                  bayScanned : false,
                  dataCode : receivingNumber,
                },
              });
        }
      };
    
    render() {
        if(this.state.renderRefresh === true) 
        return <Loading />;
        return(
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                <ScrollView 
                    refreshControl={<RefreshControl
                            colors={["#9Bd35A", "#689F38"]}
                            refreshing={this.state.renderRefresh}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    style={styles.body} 
                    showsVerticalScrollIndicator={false}
                >
            <View style={{flexDirection:'row', flex:1, paddingHorizontal:20, paddingVertical:10}}>
                <View style={{flex:1}}>
                <Text style={{...Mixins.body, color:'#424141', fontWeight:'700', textAlign:'left'}}>DCR00012</Text>
                </View>
                <View style={{flex:1}}>
                <Text style={{...Mixins.body, color:'#424141', fontWeight:'700', textAlign:'right'}}>DSP</Text>
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
                    value="In Progress"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                           <Badge
                    value="Item Picked"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(4)}
                    badgeStyle={this.state.filtered === 4 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 4 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                     </ScrollView>
                            {
                            this.props.DISPOSALList.length === 0 ? 
                            (<View style={{justifyContent:'center',alignItems:'center',marginTop:100}}>
                              <EmptyIlustrate height="132" width="213" style={{marginBottom:15}}/>
                              <Text style={{  ...Mixins.subtitle3,}}>Scroll down to Refresh</Text>
                              </View>)
                            :
                            this.props.DISPOSALList.map((data, i, arr) => {
                                return (
                                    <VASManifest 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    currentList={(data)=>{
                                        this.props.setCurrentDisposal(data);
                                    }}
                                    navigation={this.props.navigation}
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        this.props.navigation.navigate( {
                                            name: 'BarcodeDisposal',
                                            params: {
                                                inputCode: data.id,
                                            },
                                          });
                                    }}
                               
                                />
                            )})}
                        </Card>
                    </View>
                </ScrollView>
                <Overlay
            fullScreen={false}
            overlayStyle={styles.overlayContainerStyle}
            isVisible={this.state._visibleOverlay}
            onBackdropPress={this.toggleOverlay}>
            <Text style={styles.confirmText}>
            Are you sure you want Start Disposal ?
            </Text>
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {borderWidth: 1, borderColor: '#ABABAB'},
                ]}
                onPress={() => this.handleConfirm({action: false})}>
                <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                onPress={() => this.handleConfirm({action: true})}>
                <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Overlay>
          <SafeAreaInsetsContext.Consumer>
            {(inset) => (
              <View
                style={[
                  styles.bottomTabContainer,
                  {paddingBottom: 10 + inset.bottom},
                ]}>
               
                <Button
                  containerStyle={{flex: 1, height: '100%', flexBasis: 1}}
                  buttonStyle={[
                    styles.navigationButton,
                    {paddingVertical: 10, flexGrow: 1},
                  ]}
                  titleStyle={styles.deliveryText}
                  onPress={this.toggleOverlay}
                  title="Complete Disposal"
                />
              </View>
            )}
          </SafeAreaInsetsContext.Consumer>
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
        paddingTop:5,
        paddingBottom:15,
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
        bottomTabContainer: {
            paddingHorizontal: 16,
            backgroundColor: '#FFF',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingBottom: 10,
            paddingTop: 40,
          },
          navigationButton: {
            backgroundColor: '#F07120',
            borderRadius: 5,
          },
          deliveryText: {
            ...Mixins.subtitle3,
            lineHeight: 21,
            color: '#ffffff',
            fontSize: 12,
          },
          overlayContainerStyle: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            height: window.height * 0.3,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          },
          cancelButtonContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          },
          confirmText: {
            fontSize: 20,
            textAlign: 'center',
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
        ReportedDisposal: state.originReducer.filters.ReportedDisposal,
        activeDisposal : state.originReducer.filters.activeDisposal,
        completeDisposal : state.originReducer.filters.completeDisposal,
        DISPOSALList: state.originReducer.DISPOSALList,
        keyStack: state.originReducer.filters.keyStack,
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return { 
      setDisposalList: (data) => {
            return dispatch({type: 'DISPOSALList', payload: data});
        },
        setCurrentDisposal : (data)=>{
            return dispatch({type:'setCurrentDisposal', payload:data});
        },
        setBottomBar: (toggle) => {
            return dispatch({type: 'BottomBar', payload: toggle});
          },
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(List)