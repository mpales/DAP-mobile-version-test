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
import Inbound from '../../../component/extend/ListItem-inbound';
//style
import Mixins from '../../../mixins';
//icon
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import { element } from 'prop-types';
const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filtered : 0,
        };

    this.updateASN.bind(this);
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
    }
    updateSearch = (search) => {
        this.setState({search});
      };
    setFiltered = (num)=>{
        this.setState({filtered:num});
    }
    updateASN = ()=>{
        const {activeASN,completeASN} = this.props;
        return Array.from({length: ASN.length}).map((num, index) => {
            console.log(activeASN);
            console.log(completeASN);
            return {
                ...ASN[index],
                status: completeASN.includes(ASN[index].number) ? 'complete' : activeASN.includes(ASN[index].number) ? 'progress': 'unprogress',
            };
          });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

        let filtered = prevState.filtered !== this.state.filtered || prevState.search !== this.state.search ? this.state.filtered : null;
        if(filtered === 0) {
            this.updateASN(ASN).sort((a,b)=>{
                return   a.timestamp <   b.timestamp ? 1 : -1;  
            })
            this.props.setInboundLIst(this.updateASN(ASN).filter((element)=> element.number.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            this.props.setInboundLIst(this.updateASN(ASN).filter((element)=> element.status === 'unprogres').filter((element)=> element.number.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            this.props.setInboundLIst(this.updateASN(ASN).filter((element)=> element.status === 'progress').filter((element)=> element.number.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            this.props.setInboundLIst(this.updateASN(ASN).filter((element)=> element.status === 'complete').filter((element)=> element.number.indexOf(this.state.search) > -1));
        }
    }
    componentDidMount() {

        const {filtered} = this.state;
        if(filtered === 0) {
            this.updateASN(ASN).sort((a,b)=>{
                return   a.timestamp <   b.timestamp ? 1 : -1;  
            })
            this.props.setInboundLIst(this.updateASN(ASN).filter((element)=> element.number.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            this.props.setInboundLIst(this.updateASN(ASN).filter((element)=> element.status === 'unprogres').filter((element)=> element.number.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            this.props.setInboundLIst(this.updateASN(ASN).filter((element)=> element.status === 'progress').filter((element)=> element.number.indexOf(this.state.search) > -1));
        }else if(filtered === 3){
            this.props.setInboundLIst(this.updateASN(ASN).filter((element)=> element.status === 'complete').filter((element)=> element.number.indexOf(this.state.search) > -1));
        }
    }
    render() {
        return(
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                <ScrollView 
                    style={styles.body} 
                    showsVerticalScrollIndicator={false}
                >
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
                    value="Unprogress"
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
                    value="Complete"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                            </View>
                            {this.props.inboundList.map((data, i, arr) => {
                                let printdate = i === 0 || moment.unix(data.timestamp).isSame(moment.unix(arr[i -1].timestamp), 'day') === false
                                return (
                                <>
                                {printdate && 
                                <View style={{paddingVertical: 10}}><Text style={{...Mixins.small1,fontWeight: '300',lineHeight: 18}}>{moment.unix(data.timestamp).calendar(null, {
                                    sameDay: '[Today] , D MMMM YYYY',
                                    nextDay: '[Tomorrow] , D MMMM YYYY',
                                    nextWeek: 'dddd , D MMMM YYYY',
                                    lastDay: '[Yesterday] , D MMMM YYYY',
                                    lastWeek: '[Last] dddd , D MMMM YYYY',
                                    sameElse: 'D MMMM YYYY'
                                })}</Text></View>
                                }
                                <Inbound 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(true);
                                        if(data.status !== 'unprogress') {
                                           this.props.setCurrentASN(data.number);
                                            this.props.navigation.navigate(   {
                                                name: 'Manifest',
                                                params: {
                                                  number: data.number,
                                                },
                                              });
                                        } else {
                                            this.props.navigation.navigate(   {
                                                name: 'ReceivingDetail',
                                                params: {
                                                  number: data.number,
                                                },
                                              });
                                        }
                                    }}
                               
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
    {'number':'PO00001221','timestamp':moment().subtract(3, 'days').unix(),'transport':'DSP','status':'unprogres','desc':'Poopie', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001225','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001223','timestamp':moment().unix(),'transport':'DSP','status':'unprogres','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001224','timestamp':moment().unix(),'transport':'DSP','status':'unprogres','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001235','timestamp':moment().unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001236','timestamp':moment().unix(),'transport':'DSP','status':'unprogres','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001237','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'number':'PO00001238','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
];

function mapStateToProps(state) {
    return {
        activeASN : state.originReducer.filters.activeASN,
        completeASN : state.originReducer.filters.completeASN,
        inboundList: state.originReducer.inboundList,
        completedInboundList: state.originReducer.completedInboundList,
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