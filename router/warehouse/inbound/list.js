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
import Inbound from '../../../component/extend/ListItem-inbound';
//style
import Mixins from '../../../mixins';
//icon
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import {getData} from '../../../component/helper/network';
import { element } from 'prop-types';
const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filtered : 0,
            type: null,
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
               return {...state, type : routes[index].params.type,};
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
        this.setState({renderGoBack: false, renderRefresh: false});
        const result = await getData('inboundsMobile/type/'+type);
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
            this.props.setInboundLIst(AllASN.filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            let PendingASN = await this.updateASN();
            this.props.setInboundLIst(PendingASN.filter((element)=> element.status === 3).filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            let ProgressASN = await this.updateASN();
            this.props.setInboundLIst(ProgressASN.filter((element)=> element.status === 4).filter((element)=> element.company.company_name.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            let CompleteASN = await this.updateASN();
            this.props.setInboundLIst(CompleteASN.filter((element)=> element.status === 5).filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        }else if(filtered === 4){
            let ReportedASN = await this.updateASN();
            this.props.setInboundLIst(ReportedASN.filter((element)=> element.status === 6).filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        }else if(filtered === 5){
            let ReportedASN = await this.updateASN();
            this.props.setInboundLIst(ReportedASN.filter((element)=> element.status === 7).filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        }
        
        
    }
    async componentDidMount() {

        const {filtered} = this.state;
        if(filtered === 0) {
            let AllASN = await this.updateASN();
            this.props.setInboundLIst(AllASN.filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        }else if(filtered === 1){
            let PendingASN = await this.updateASN();
            this.props.setInboundLIst(PendingASN.filter((element)=> element.status === 3).filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            let ProgressASN = await this.updateASN();
            this.props.setInboundLIst(ProgressASN.filter((element)=> element.status === 4).filter((element)=> element.company.company_name.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            let CompleteASN = await this.updateASN();
            this.props.setInboundLIst(CompleteASN.filter((element)=> element.status === 5).filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        }else if(filtered === 4){
            let ReportedASN = await this.updateASN();
            this.props.setInboundLIst(ReportedASN.filter((element)=> element.status === 6).filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        }else if(filtered === 5){
            let ReportedASN = await this.updateASN();
            this.props.setInboundLIst(ReportedASN.filter((element)=> element.status === 7).filter((element)=> element.company.company_name.indexOf(this.state.search) > -1));
        }
    }
    _onRefresh = () => {
        this.setState({renderRefresh: true});
    }
    render() {
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
                        <Text style={{...Mixins.subtitle1,lineHeight: 21,color:'#424141', paddingHorizontal: 20, marginTop: 15}}>Search</Text>
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
                    value="Waiting"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Received"
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
                          <Badge
                    value="Reported"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(5)}
                    badgeStyle={this.state.filtered === 5 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 5 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                     </ScrollView>
                            {this.props.inboundList.map((data, i, arr) => {
                                return (
                                    <Inbound 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                       if(data.status === 3 || data.status === 4){
                                            this.props.navigation.navigate(   {
                                                name: 'ReceivingDetail',
                                                params: {
                                                  number: data.id,
                                                  submitPhoto:false,
                                                },
                                              });
                                        } else {
                                            this.props.setCurrentASN(data.id);
                                             this.props.navigation.navigate(  {
                                                name: 'Manifest',
                                                 params: {
                                                  number: data.id,
                                                },
                                           })
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
        ReportedASN: state.originReducer.filters.ReportedASN,
        activeASN : state.originReducer.filters.activeASN,
        completeASN : state.originReducer.filters.completeASN,
        inboundList: state.originReducer.inboundList,
        completedInboundList: state.originReducer.completedInboundList,
        keyStack: state.originReducer.filters.keyStack,
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return { 
    setInboundLIst: (data) => {
            return dispatch({type: 'InboundList', payload: data});
        },
      setBottomBar: (toggle) => {
        return dispatch({type: 'BottomBar', payload: toggle});
      },
      setCurrentASN : (data)=> {
        return dispatch({type:'setASN', payload: data});
      },
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(List)