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
    Badge
} from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
//component
import VASManifest from '../../../component/extend/ListItem-VAS';
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
        const {type} = state;
        const {routes, index} = navigation.dangerouslyGetState();
            if(routes[index].params !== undefined && routes[index].params.type !== undefined && type !== routes[index].params.type){
                //if multiple sku
               return {...state, type : routes[index].params.type,renderRefresh : routes[index].params.type === state.type ? state.renderRefresh : true};
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
        const {activeVAS, completeVAS,ReportedVAS} = this.props;
        const result = Array.from({length: ASN.length}).map((num,index)=>{
            if (completeVAS.includes(ASN[index].number)){
                return {
                    ...ASN[index],
                    status: 'complete',
                };
            } else if(ReportedVAS.includes(ASN[index].number)){
                return {
                    ...ASN[index],
                    status: 'reported'
                }
            } else if(activeVAS.includes(ASN[index].number)){
                return {
                    ...ASN[index],
                    status : 'progress',
                };
            } else {
                return ASN[index];
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
        if(nextProps.keyStack === 'List'){
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
            this.props.setVASList(AllASN.filter((element)=> element.number.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            let PendingASN = await this.updateASN();
            this.props.setVASList(PendingASN.filter((element)=> element.status === 'pending').filter((element)=> element.number.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            let ProgressASN = await this.updateASN();
            this.props.setVASList(ProgressASN.filter((element)=> element.status === 'progress').filter((element)=> element.number.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            let CompleteASN = await this.updateASN();
            this.props.setVASList(CompleteASN.filter((element)=> element.status === 'complete').filter((element)=> element.number.indexOf(this.state.search) > -1));
        }else if(filtered === 4){
            let ReportedASN = await this.updateASN();
            this.props.setVASList(ReportedASN.filter((element)=> element.status === 'reported').filter((element)=> element.number.indexOf(this.state.search) > -1));
        }
        
        
    }
    async componentDidMount() {

        const {filtered} = this.state;
        if(filtered === 0) {
            let AllASN = await this.updateASN();
            this.props.setVASList(AllASN.filter((element)=> element.number.indexOf(this.state.search) > -1));
        }else if(filtered === 1){
            let PendingASN = await this.updateASN();
            this.props.setVASList(PendingASN.filter((element)=> element.status === 'pending').filter((element)=> element.number.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            let ProgressASN = await this.updateASN();
            this.props.setVASList(ProgressASN.filter((element)=> element.status === 'progress').filter((element)=> element.number.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            let CompleteASN = await this.updateASN();
            this.props.setVASList(CompleteASN.filter((element)=> element.status === 'complete').filter((element)=> element.number.indexOf(this.state.search) > -1));
        }else if(filtered === 4){
            let ReportedASN = await this.updateASN();
            this.props.setVASList(ReportedASN.filter((element)=> element.status === 'reported').filter((element)=> element.number.indexOf(this.state.search) > -1));
        }
    }
    _onRefresh = () => {
        this.setState({renderRefresh: true});
    }
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
            <View style={{flexDirection:'row', paddingHorizontal:15, marginTop:10,marginBottom:0 }}>
                    <View style={{flexDirection:'column', marginRight:10, flex:1,maxHeight:60}}>
                    <Text style={{...Mixins.subtitle1,lineHeight: 21,color:'#424141',}}>Search</Text>
                    <Input
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                    inputStyle={{backgroundColor: '#fff', 
                    paddingHorizontal: 10,
                    paddingVertical:0,
                    ...Mixins.small1,
                    color: '#424141',
                    fontWeight: '400',
                    lineHeight: 18,
                    textAlign:'left',
                    borderWidth: 1,
                    borderRadius:5,
                    borderColor: '#ABABAB',
                    height:30,
                    maxHeight:30,
                    minHeight:30,
                }}
                    containerStyle={{
                        backgroundColor: 'white',
                        height:30,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        paddingHorizontal: 0,
                        marginVertical: 0,
                        flexDirection:'column',
                    }}
                    inputContainerStyle={{
                        backgroundColor: 'white',
                        borderBottomColor:'transparent',
                        padding:0,
                        margin:0,
                    }}
                    />
                    </View>

                    <View style={{flexDirection:'column', marginRight:10,flex:1,maxHeight:60}}>
                    <Text style={{...Mixins.subtitle1,lineHeight: 21,color:'#424141'}}>Sort By</Text>
                    <SelectDropdown
                            buttonStyle={{width:'100%',maxHeight:30,borderRadius: 5, borderWidth:1, borderColor: '#ABABAB', backgroundColor:'white',padding:0,margin:0}}
                            buttonTextStyle={{ 
                                paddingHorizontal: 10,
                                ...Mixins.small1,
                                color: '#424141',
                                fontWeight: '400',
                                lineHeight: 18,
                                textAlign:'left',}}
                            data={['Client','Test', 'VAS', 'OVAS'] }
                            defaultValueByIndex={0}
                            onSelect={(selectedItem, index) => {
                              this.setState({sortBy:selectedItem});
                            }}
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
                          />
                    </View>
            </View>
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
                    value="Waiting"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Progress"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                           <Badge
                    value="Completed"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                           <Badge
                    value="Reported"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(4)}
                    badgeStyle={this.state.filtered === 4 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 4 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                     </ScrollView>
                            {
                            this.props.VASList.length === 0 ? 
                            (<View style={{justifyContent:'center',alignItems:'center',marginTop:100}}>
                              <EmptyIlustrate height="132" width="213" style={{marginBottom:15}}/>
                              <Text style={{  ...Mixins.subtitle3,}}>Scroll down to Refresh</Text>
                              </View>)
                            :
                            this.props.VASList.map((data, i, arr) => {
                                return (
                                    <VASManifest 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        if(this.state.type === 'DISPOSAL'){
                                            this.props.navigation.navigate( 'ListDisposal',{
                                                  type : 'Diposal',
                                                  dataCode : data.number,
                                              });
                                        } else {
                                            this.props.navigation.navigate( {
                                                name: 'ItemVASDetail',
                                                params: {
                                                  bayScanned : false,
                                                  dataCode : data.number,
                                                },
                                              });
                                        }
                                    }}
                               
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
});
const ASN = [
    {'number':'PO00001234','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001222','timestamp':moment().subtract(4, 'days').unix(),'transport':'DSP','status':'complete','desc':'Roboto', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001221','timestamp':moment().subtract(3, 'days').unix(),'transport':'DSP','status':'pending','desc':'Poopie', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001225','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001223','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001224','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001235','timestamp':moment().unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001236','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001237','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001238','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
];

function mapStateToProps(state) {
    return {
        ReportedVAS: state.originReducer.filters.ReportedVAS,
        activeVAS : state.originReducer.filters.activeVAS,
        completeVAS : state.originReducer.filters.completeVAS,
        VASList: state.originReducer.VASList,
        keyStack: state.originReducer.filters.keyStack,
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return { 
      setVASList: (data) => {
            return dispatch({type: 'VASList', payload: data});
        },
        setBottomBar: (toggle) => {
            return dispatch({type: 'BottomBar', payload: toggle});
          },
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(List)