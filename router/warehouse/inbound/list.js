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

const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.setInboundLIst(inboundList)
    }

    render() {
        return(
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                <View style={styles.headerBeranda}>
                    <View style={styles.berandaBar}>
                        <View style={[styles.barSection,styles.breadcrumb]}>
                            <Text style={styles.ccmText}>CCM Module</Text>
                        </View>
                    </View>
                </View>
                <ScrollView 
                    style={styles.body} 
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.sectionContent}>
                        <Card containerStyle={styles.cardContainer}>
                            <View style={styles.headingCard}>
                                <Input 
                                    containerStyle={{flex: 1}}
                                    inputContainerStyle={styles.textInput} 
                                    inputStyle={Mixins.containedInputDefaultStyle}
                                    labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                    label="Date"
                                    placeholder="12/03/2021"
                                />
                                <Input
                                    leftIcon={<IconSearchMobile height="20" width="20" fill="#ABABAB" style={{marginLeft: 5}} />}
                                    containerStyle={{flex: 1}}
                                    inputContainerStyle={styles.textInput}
                                    inputStyle={[Mixins.containedInputDefaultStyle, {marginHorizontal: 0}]}
                                    labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                    label="Manifest"
                                    placeholder="Vehicle"
                                />
                            </View>
                            {this.props.inboundList.map((data, i) => (
                                <Inbound 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    navigation={this.props.navigation}
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
        justifyContent: 'space-between',
    },
    sectionContent: {
        marginHorizontal: 20,
        marginBottom: 20,
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
        marginVertical: 20,
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 0, //default is 1
        shadowRadius: 0, //default is 1
        elevation: 0,
        backgroundColor: '#ffffff',
    },
});

const inboundList = [
    {
        code: 'WHUS00018789719',
        total_package: 50,
        date: '12/03/2021',
        CBM: 20.10,
        weight: 115,
        status: 'onProgress'
    },
    {
        code: 'WHUS00018789720',
        total_package: 20,
        date: '12/03/2021',
        CBM: 10.10,
        weight: 70
    },
    {
        code: 'WHUS00018789721',
        total_package: 30,
        date: '12/03/2021',
        CBM: 15.10,
        weight: 90,
        status: 'onProgress',
    },
    {
        code: 'WHUS00018789722',
        total_package: 50,
        date: '12/03/2021',
        CBM: 20.10,
        weight: 115,
    },
    {
        code: 'WHUS00018789723',
        total_package: 20,
        date: '12/03/2021',
        CBM: 10.10,
        weight: 90
    },
    {
        code: 'WHUS00018789724',
        total_package: 30,
        date: '12/03/2021',
        CBM: 15.10,
        weight: 70
    },
    {
        code: 'WHUS00018789725',
        total_package: 50,
        date: '12/03/2021',
        CBM: 20.10,
        weight: 115
    },
];

function mapStateToProps(state) {
    return {
        bottomBar: state.originReducer.filters.bottomBar,
        inboundList: state.originReducer.inboundList,
        completedInboundList: state.originReducer.completedInboundList,
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
        setBottomBar: (toggle) => {
            return dispatch({type: 'BottomBar', payload: toggle});
        },
        setInboundLIst: (data) => {
            return dispatch({type: 'InboundList', payload: data});
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(List)