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
import { Picker } from '@react-native-picker/picker';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import moment from 'moment';
//component
import Outbound from '../../../component/extend/ListItem-outbound';
//style
import Mixins from '../../../mixins';
//icon
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';

const window = Dimensions.get('window');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filtered : 0,
            renderGoBack : false,
        };
    this.updateTask.bind(this);
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
    }
    updateSearch = (search) => {
        this.setState({search});
      };
    setFiltered = (num)=>{
        this.setState({filtered:num});
    }
    updateTask = ()=>{
        const {activeTask,completeTask, ReportedTask} = this.props;
        this.setState({renderGoBack: false});
        return Array.from({length: outboundTaskDummy.length}).map((num, index) => {
            return {
                ...outboundTaskDummy[index],
                status: completeTask.includes(outboundTaskDummy[index].code) ? 'completed' : ReportedTask.includes(outboundTaskDummy[index].code) ? 'reported' : activeTask.includes(outboundTaskDummy[index].code) ? 'progress': 'pending',
            };
          });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.keyStack !== nextProps.keyStack){
        if(nextProps.keyStack === 'Task'){
            this.setState({renderGoBack : true});
            return true;
        }
        }
        return true;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        let filtered = prevState.renderGoBack !== this.state.renderGoBack || prevState.filtered !== this.state.filtered || prevState.search !== this.state.search ? this.state.filtered : null;
        if(filtered === 0) {
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.code.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.status === 'reported').filter((element)=> element.code.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.status === 'pending').filter((element)=> element.code.indexOf(this.state.search)> -1));
        }else if(filtered === 3){
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.status === 'progress').filter((element)=> element.code.indexOf(this.state.search) > -1));
        }else if(filtered === 4){
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.status === 'completed').filter((element)=> element.code.indexOf(this.state.search) > -1));
        }
        
    }
    componentDidMount() {

        const {filtered} = this.state;
        if(filtered === 0) {
            this.props.setOutboundTask(
                this.updateTask().filter((element)=> element.code.indexOf(this.state.search) > -1));
        } else if(filtered === 1){
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.status === 'reported').filter((element)=> element.code.indexOf(this.state.search) > -1));
        } else if(filtered === 2){
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.status === 'pending').filter((element)=> element.code.indexOf(this.state.search) > -1));
        }else if(filtered === 3){
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.status === 'progress').filter((element)=> element.code.indexOf(this.state.search) > -1));
        }else if(filtered === 4){
            this.props.setOutboundTask(this.updateTask().filter((element)=> element.status === 'completed').filter((element)=> element.code.indexOf(this.state.search) > -1));
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
                       <View style={[styles.headingCard, {paddingVertical: 10}]}>
                                <Input 
                                    containerStyle={{flex: 1}}
                                    inputContainerStyle={styles.textInput} 
                                    inputStyle={Mixins.containedInputDefaultStyle}
                                    labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                    label="Warehouse"
                                    InputComponent={()=> {
                                        return (   <View style={[styles.picker, {flex:1}]}>
                                            <Picker>
                                                        <Picker.Item style={{fontSize: 20}} key={1} label="test" value="aja" />
                                                        <Picker.Item style={{fontSize: 20}} key={2} label="test" value="aja" />
                                                    </Picker>
                                            </View>)
                                    }}
                                    placeholder=""
                                />
                                <Input
                                    leftIcon={<IconSearchMobile height="20" width="20" fill="#ABABAB" style={{marginLeft: 5}} />}
                                    containerStyle={{flex: 1}}
                                    inputContainerStyle={styles.textInput}
                                    inputStyle={[Mixins.containedInputDefaultStyle, {marginHorizontal: 0}]}
                                    labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                    label="Search"
                                    onChangeText={this.updateSearch}
                                    value={this.state.search}
                                />
                            </View>
                    <View style={styles.sectionContent}>
                        <Card containerStyle={styles.cardContainer}>
                        <View style={{flexDirection:'row',paddingBottom:10}}>
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
                            {this.props.outboundTask.map((data, i) => (
                                <Outbound 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                        this.props.setBottomBar(false);
                                        this.props.setCurrentTask(data.code);
                                        this.props.setActiveTask(data.code);
                                        this.props.navigation.navigate(   {
                                            name: 'List',
                                            params: {
                                              number: data.code,
                                            },
                                          });
                                    }}
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
    picker: {
        borderWidth: 0,
        borderColor: '#D5D5D5',
        borderRadius: 0,
        marginBottom: 0,
    },
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
        marginHorizontal: 20,
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

const outboundTaskDummy = [
    {
        code: 'WHUS00018789719',
        warehouse_code: 'Warehouse A1',
        timestamp: moment().subtract(1, 'days').unix(),
        company: 'WORKEDGE',
        sku: 20,
        status: 'Pending'
    },
    {
        code: 'WHUS00018789720',
        warehouse_code: 'Warehouse A1',
        timestamp: moment().subtract(1, 'days').unix(),
        company: 'WORKEDGE',
        sku: 20,
        status: 'Pending'
    },
    {
        code: 'WHUS00018789721',
        warehouse_code: 'Warehouse A1',
        timestamp: moment().subtract(1, 'days').unix(),
        company: 'WORKEDGE',
        sku: 20,
        status: 'Pending'
    },
    {
        code: 'WHUS00018789722',
        warehouse_code: 'Warehouse A1',
        timestamp: moment().subtract(1, 'days').unix(),
        company: 'WORKEDGE',
        sku: 20,
        status: 'Pending'
    },
    {
        code: 'WHUS00018789723',
        warehouse_code: 'Warehouse A1',
        timestamp: moment().unix(),
        company: 'WORKEDGE',
        sku: 20,
        status: 'Progress'
    },
    {
        code: 'WHUS00018789724',
        warehouse_code: 'Warehouse A1',
        timestamp: moment().unix(),
        company: 'WORKEDGE',
        sku: 20,
        status: 'Progress'
    },
    {
        code: 'WHUS00018789725',
        warehouse_code: 'Warehouse A1',
        timestamp: moment().unix(),
        company: 'WORKEDGE',
        sku: 20,
        status: 'Progress'
    },
];

function mapStateToProps(state) {
    return {
        outboundTask: state.originReducer.outboundTask,
        completedInboundList: state.originReducer.completedInboundList,
        ReportedTask: state.originReducer.filters.ReportedTask,
        activeTask : state.originReducer.filters.activeTask,
        completeTask : state.originReducer.filters.completeTask,
        keyStack: state.originReducer.filters.keyStack,
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
      
    setOutboundTask: (data) => {
            return dispatch({type: 'OutboundTask', payload: data});
        },
      setBottomBar: (toggle) => {
        return dispatch({type: 'BottomBar', payload: toggle});
      },
      setCurrentTask : (data)=> {
        return dispatch({type:'setTask', payload: data});
      },
      setActiveTask : (data)=> {
        return dispatch({type:'addActiveTask', payload: data});
      },
      //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(List)