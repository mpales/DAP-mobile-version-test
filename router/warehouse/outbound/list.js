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
import OutboundReported from '../../../component/extend/ListItem-outbound-reported';
import OutboundCompleted from '../../../component/extend/ListItem-outbound-completed';
//style
import Mixins from '../../../mixins';
//icon
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import mixins from '../../../mixins';

const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);
        const {routes, index} = this.props.navigation.dangerouslyGetState();
        this.state = {
            search: '',
            filtered : 0,
            confirm : routes[index].params !== undefined ? routes[index].params.confirm : false,
        };
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
    }
    updateSearch = (search) => {
        this.setState({search});
      };
    setFiltered = (num)=>{
        this.setState({filtered:num});
    }

    componentDidMount(){
        this.props.setOutboundList(outboundList)
        const {routes, index} = this.props.navigation.dangerouslyGetState();
        this.setState({ confirm : routes[index].params !== undefined ? routes[index].params.confirm : false,});
      }
      componentDidUpdate(prevProps, prevState, snapshot){
        const {routes, index} = this.props.navigation.dangerouslyGetState();
        if(routes[index].params !== undefined && this.state.confirm !== routes[index].params.confirm)
        this.setState({ confirm : routes[index].params !== undefined ? routes[index].params.confirm : false,});
      }
    render() {
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
                            <Text style={{...Mixins.subtitle1,lineHeight:21}}>WO000123456</Text>
                        </View>
                            <View style={{alignItems:'flex-end',flex:1}}>
                            <Text style={{...Mixins.small1,lineHeight:21}}>Warehouse A1 </Text>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                        <Text style={{...Mixins.small1,lineHeight:21,fontWeight:'700'}}>WORKEDGE Singapore Ltd</Text>
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
                    onPress={()=> this.props.setFiltered(0)}
                    badgeStyle={this.state.filtered === 0 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 0 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Unprogress"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.props.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Progress"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.props.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Complete"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.props.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                            </View>
                            {this.props.outboundList.map((data, i) => (
                                <OutboundDetail 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        this.props.navigation.navigate('Scanner');
                                    }}
                                    // for prototype only
                                    completedInboundList={this.props.completedInboundList}
                                    // end
                                />
                            ))}
                        </Card>

                    <View style={styles.sectionHeadPackage}>
                    <Text style={styles.headTitle}>Reported</Text>
                    </View>
                    <Card containerStyle={styles.cardContainer}>
                    {this.props.outboundList.slice(0,1).map((data, i) => (
                                <OutboundReported 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        this.props.navigation.navigate('Reported');
                                    }}
                                    // for prototype only
                                    completedInboundList={this.props.completedInboundList}
                                    // end
                                />
                            ))}
                    </Card>


                    <View style={styles.sectionHeadPackage}>
                    <Text style={styles.headTitle}>Completed</Text>
                    </View>
                    <Card containerStyle={styles.cardContainer}>
                    {this.props.outboundList.slice(0,1).map((data, i) => (
                                <OutboundCompleted 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        this.props.navigation.navigate('Completed');
                                    }}
                                    // for prototype only
                                    completedInboundList={this.props.completedInboundList}
                                    // end
                                />
                            ))}
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

const outboundList = [
    {
       sku : 'ISO00012345',
       location_bay: 'JP2 C05-002',
       location_rack: ['J R21-15', 'J R21-01'],
       barcode: 'EBV 2BL - TL',
       description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
       category: '-',
       status: 'pending'
    },
    {
        sku : 'ISO00012345',
       location_bay: 'JP2 C05-002',
       location_rack: ['J R21-15', 'J R21-01'],
       barcode: 'EBV 2BL - TL',
       description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
       category: '-',
       status: 'pending'
    },
    {
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-002',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TL',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        status: 'pending'
    },
    {
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-002',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TL',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        status: 'pending'
    },
    {
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-002',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TL',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        status: 'pending'
    },
    {
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-002',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TL',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        status: 'pending'
    },
    {
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-002',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TL',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        status: 'pending'
    },
];

function mapStateToProps(state) {
    return {
        outboundList: state.originReducer.outboundList,
        completedInboundList: state.originReducer.completedInboundList,
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
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(List)