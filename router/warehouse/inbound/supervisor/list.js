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
import InboundSupervisor from '../../../../component/extend/ListItem-inbound-supervisor';
//style
import Mixins from '../../../../mixins';
//icon
import IconSearchMobile from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import {getData} from '../../../../component/helper/network';
import { element } from 'prop-types';
import EmptyIlustrate from '../../../../assets/icon/Groupempty.svg';
const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filtered : 0,
            type: 0,
            list: [],
            renderGoBack : false,
            renderRefresh: false,
        };

    this.updateASN.bind(this);
    this.setFiltered.bind(this);
    this.setType.bind(this);
    this.updateSearch.bind(this);
    }
    updateSearch = (search) => {
        this.setState({search});
      };
    setFiltered = (num)=>{
        this.setState({filtered:num});
    }
    setType = (num)=>{
        this.setState({type:num});
    }
    updateASN = async ()=>{
        this.setState({renderGoBack: false, renderRefresh: false});

        const result = await getData('inboundsMobile');
        if(Array.isArray(result)){
            return result.filter((o)=> o !== null);
        } else {
            return [];
        }
    }
    updateStatus = async ()=>{
        const {type} = this.state;
        const {inboundList} = this.props;
        const result = await getData('inboundsMobile/status');
        let updatedStatus = [];
        for (let index = 0; index < inboundList.length; index++) {
            const element = inboundList[index];
            const elementStatus = result.find((o)=>o.id === element.id);
           updatedStatus[index] = {
             ...element,
             ...elementStatus,  
           };
        }
        this.setState({renderGoBack: false, renderRefresh: false});
       return updatedStatus;
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
        const {type} = this.state;
        const {inboundList} = this.props; 
        if(prevState.renderRefresh !== this.state.renderRefresh && this.state.renderRefresh === true){
            const resultedList =  await this.updateASN();
            this.props.setinboundList(resultedList);
        }
        let filtered =  (prevState.renderRefresh !== this.state.renderRefresh || prevState.renderGoBack !== this.state.renderGoBack || prevState.filtered !== this.state.filtered || prevState.search !== this.state.search || prevState.type !== this.state.type) && inboundList.length > 0 ? this.state.filtered : null;
        if(filtered === 0) {
            let AllASN = await this.updateStatus();
            this.setState({list:AllASN.filter((element)=> String(element.client).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 && (type === 0 || type !== 0 && element.type === type))});
        } else if(filtered === 1){
            let PendingASN = await this.updateStatus();
            this.setState({list:PendingASN.filter((element)=> element.status === 7).filter((element)=>String(element.client).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 && (type === 0 || type !== 0 && element.type === type))});
        } else if(filtered === 2){
            let ProgressASN = await this.updateStatus();
            this.setState({list:ProgressASN.filter((element)=> element.status === 6).filter((element)=> String(element.client).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 && (type === 0 || type !== 0 && element.type === type))});
        }
        
    }
    async componentDidMount() {
        const {type} = this.state;
        const resultedList =  await this.updateASN();
        this.props.setinboundList(resultedList);
        const {filtered} = this.state;
        if(filtered === 0) {
            this.setState({list:resultedList.filter((element)=> String(element.client).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 && (type === 0 || type !== 0 && element.type === type))});
        } else if(filtered === 1){
            this.setState({list:resultedList.filter((element)=> element.status === 7).filter((element)=>String(element.client).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 && (type === 0 || type !== 0 && element.type === type))});
        } else if(filtered === 2){
            this.setState({list:resultedList.filter((element)=> element.status === 6).filter((element)=> String(element.client).toLowerCase().indexOf(this.state.search.toLowerCase()) > -1 && (type === 0 || type !== 0 && element.type === type))});
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
                        <View style={styles.headingCard}>
                        <Badge
                    value="All"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setType(0)}
                    badgeStyle={this.state.type === 0 ? styles.badgeBigActive : styles.badgeBigInactive }
                    textStyle={this.state.type === 0 ? styles.badgeBigActiveTint : styles.badgeBigInactiveTint }
                    />
                      <Badge
                    value="ASN"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setType(1)}
                    badgeStyle={this.state.type === 1 ? styles.badgeBigActive : styles.badgeBigInactive }
                    textStyle={this.state.type === 1 ? styles.badgeBigActiveTint : styles.badgeBigInactiveTint }
               />
                          <Badge
                    value="GRN"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setType(2)}
                    badgeStyle={this.state.type === 2 ? styles.badgeBigActive : styles.badgeBigInactive }
                    textStyle={this.state.type === 2 ? styles.badgeBigActiveTint : styles.badgeBigInactiveTint }
             />
                          <Badge
                    value="OTHERS"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setType(3)}
                    badgeStyle={this.state.type === 3 ? styles.badgeBigActive : styles.badgeBigInactive }
                    textStyle={this.state.type === 3 ? styles.badgeBigActiveTint : styles.badgeBigInactiveTint }
           />
                            </View>
                            <View style={styles.headingCard}>
                        <Badge
                    value="All"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(0)}
                    badgeStyle={this.state.filtered === 0 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 0 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                      <Badge
                    value="Cancelled"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Processed"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                  
                            </View>
                            {
                            this.props.inboundList.length === 0 ? 
                            (<View style={{justifyContent:'center',alignItems:'center',marginTop:100}}>
                              <EmptyIlustrate height="132" width="213" style={{marginBottom:15}}/>
                              <Text style={{  ...Mixins.subtitle3,}}>Scroll down to Refresh</Text>
                              </View>)
                            :
                            this.state.list.map((data, i, arr) => {
                                return (
                                    <InboundSupervisor 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setCurrentASN(data.id);
                                        this.props.setManifestType(data.type);
                                        this.props.setBottomBar(false);
                                        this.props.navigation.navigate('ManifestSupervisor',   {
                                            number: data.id,
                                            type : data.type === 1 ? 'ASN' : data.type === 2 ? 'GRN' : 'Others',
                                        });
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
    badgeBigActive: {    
        backgroundColor: '#F1811C',
        borderWidth: 1,
        borderColor: '#F1811C',
        paddingHorizontal: 12,
        height: 29,
        borderRadius: 5,
        },
        badgeBigActiveTint: {
          ...Mixins.body1,
          lineHeight: 21,
          fontWeight: '600',
          color: '#ffffff'
        },
        badgeBigInactive: {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#121C78',
          paddingHorizontal: 12,
          height: 29,
          borderRadius: 5,
        },
        badgeBigInactiveTint: {
          ...Mixins.body1,
          lineHeight: 21,
          fontWeight: '600',
          color: '#121C78'
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
  {'number':'PO00001234','category':'ASN','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001222','category':'ASN','timestamp':moment().subtract(4, 'days').unix(),'transport':'DSP','status':'complete','desc':'Roboto', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001221','category':'GRN','timestamp':moment().subtract(3, 'days').unix(),'transport':'DSP','status':'pending','desc':'Poopie', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001225','category':'GRN','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001223','category':'GRN','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001224','category':'OTHERS','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001235','category':'OTHERS','timestamp':moment().unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001236','category':'OTHERS','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001237','category':'OTHERS','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
  {'number':'PO00001238','category':'OTHERS','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
];

function mapStateToProps(state) {
    return {
        inboundList: state.originReducer.inboundSPVList,
        keyStack: state.originReducer.filters.keyStack,
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return { 
      setinboundList: (data) => {
            return dispatch({type: 'InboundSPVList', payload: data});
        },
      setBottomBar: (toggle) => {
        return dispatch({type: 'BottomBar', payload: toggle});
      },
      setCurrentASN : (data)=> {
        return dispatch({type:'setASN', payload: data});
      },
      setManifestType : (data)=> {
        return dispatch({type:'setManifestType', payload: data});
      },
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(List)