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
import Putaway from '../../../../component/extend/ListItem-inbound-putaway';
//style
import Mixins from '../../../../mixins';
//icon
import IconSearchMobile from '../../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import {getData} from '../../../../component/helper/network';
import { element } from 'prop-types';
const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filtered : 0,
            renderGoBack : false,
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
    updateASN = async ()=>{
        this.setState({renderGoBack: false});
        const result = ASN;
        if(Array.isArray(result)){
            return result.filter((element)=> element.inbound_asn !== null );
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
        let filtered = prevState.renderGoBack !== this.state.renderGoBack || prevState.filtered !== this.state.filtered || prevState.search !== this.state.search ? this.state.filtered : null;
        if(filtered === 0) {
            let AllASN = await this.updateASN();
            this.props.setPutawayList(AllASN.filter((element)=> element.code.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            let PendingASN = await this.updateASN();
            this.props.setPutawayList(PendingASN.filter((element)=> element.category === 'ASN').filter((element)=> element.code.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            let ProgressASN = await this.updateASN();
            this.props.setPutawayList(ProgressASN.filter((element)=> element.category === 'GRN').filter((element)=> element.code.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            let CompleteASN = await this.updateASN();
            this.props.setPutawayList(CompleteASN.filter((element)=> element.category === 'OTHERS').filter((element)=> element.code.indexOf(this.state.search) > -1));
        }
        
    }
    async componentDidMount() {

        const {filtered} = this.state;
        if(filtered === 0) {
            let AllASN = await this.updateASN();
            this.props.setPutawayList(AllASN.filter((element)=> element.code.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            let PendingASN = await this.updateASN();
            this.props.setPutawayList(PendingASN.filter((element)=> element.category === 'ASN').filter((element)=> element.code.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            let ProgressASN = await this.updateASN();
            this.props.setPutawayList(ProgressASN.filter((element)=> element.category === 'GRN').filter((element)=> element.code.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            let CompleteASN = await this.updateASN();
            this.props.setPutawayList(CompleteASN.filter((element)=> element.category === 'OTHERS').filter((element)=> element.code.indexOf(this.state.search) > -1));
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
                    onPress={()=> this.setFiltered(0)}
                    badgeStyle={this.state.filtered === 0 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 0 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                      <Badge
                    value="ASN"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="GRN"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="OTHERS"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                            </View>
                            {this.props.putawayList.map((data, i, arr) => {
                                return (
                                    <Putaway 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        this.props.navigation.navigate(   {
                                            name: 'PalletDetails',
                                            params: {
                                              dataCode: data.code,
                                            },
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
          color: '#ffffff'
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
          color: '#121C78'
        },
});
const ASN = [
    {'code':'8992761145019','timestamp':moment().subtract(1, 'days').unix(),'location':'WAREHOUSE A1', 'category': 'ASN'},
    {'code':'PALLET HJ-1234568','timestamp':moment().subtract(4, 'days').unix(),'location':'WAREHOUSE A1', 'category': 'ASN'},
    {'code':'PALLET HJ-1234569','timestamp':moment().subtract(3, 'days').unix(),'location':'WAREHOUSE A1', 'category': 'ASN'},
    {'code':'PALLET HJ-1234570','timestamp':moment().subtract(1, 'days').unix(),'location':'WAREHOUSE A1', 'category': 'GRN'},
    {'code':'PALLET HJ-1234571','timestamp':moment().unix(),'location':'WAREHOUSE A1', 'category': 'GRN'},
    {'code':'PALLET HJ-1234572','timestamp':moment().unix(),'location':'WAREHOUSE A1', 'category': 'GRN'},
    {'code':'PALLET HJ-1234573','timestamp':moment().unix(),'location':'WAREHOUSE A1', 'category': 'GRN'},
    {'code':'PALLET HJ-1234574','timestamp':moment().unix(),'location':'WAREHOUSE A1', 'category': 'GRN'},
    {'code':'PALLET HJ-1234575','timestamp':moment().subtract(1, 'days').unix(),'location':'WAREHOUSE A1', 'category': 'OTHERS'},
    {'code':'PALLET HJ-1234576','timestamp':moment().subtract(1, 'days').unix(),'location':'WAREHOUSE A1', 'category': 'OTHERS'},
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