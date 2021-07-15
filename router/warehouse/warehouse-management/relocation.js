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
import Relocation from '../../../component/extend/ListItem-relocation';
//style
import Mixins from '../../../mixins';
//icon
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import { element } from 'prop-types';
const window = Dimensions.get('window');

class ListSKU extends React.Component {
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
    updateASN = ()=>{
       
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      
    }
    componentDidMount() {

     
    }
    render() {
        return(
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                <ScrollView 
                    style={styles.body} 
                    showsVerticalScrollIndicator={false}
                >
                            <Text style={{...Mixins.subtitle1,lineHeight: 21,color:'#424141', paddingHorizontal: 20, marginTop: 15}}>Search SKU </Text>
        
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
                      
                            {STOCK.map((data, i, arr) => {
                                return (
                                <Relocation 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                       this.props.navigation.navigate('RelocationConfirm')
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
const STOCK = [
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001234','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001222','timestamp':moment().subtract(4, 'days').unix(),'transport':'DSP','status':'complete','desc':'Roboto', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001221','timestamp':moment().subtract(3, 'days').unix(),'transport':'DSP','status':'pending','desc':'Poopie', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001225','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001223','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001224','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001235','timestamp':moment().unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001236','timestamp':moment().unix(),'transport':'DSP','status':'pending','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001237','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
    {'title': 'GCPL STOCK TAKE 20 02 20','number':'PO00001238','timestamp':moment().subtract(1, 'days').unix(),'transport':'DSP','status':'progress','desc':'Dead Sea Premier', 'rcpt': 'DRC000206959', 'ref': 'BESG20200820A'},
];

function mapStateToProps(state) {
    return {
   
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return { 
        setBottomBar: (toggle) => {
            return dispatch({type: 'BottomBar', payload: toggle});
          },
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(ListSKU)