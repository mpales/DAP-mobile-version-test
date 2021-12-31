import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import {Card, Divider, Button, Avatar} from 'react-native-elements';
import {connect} from 'react-redux';
import mixins from '../../../mixins';
// component
import DetailList from '../../../component/extend/Card-detail';
// icon
import ChevronRight from '../../../assets/icon/iconmonstr-arrow-66mobile-2.svg';
import ChevronDown from '../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
import Checkmark from '../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
import RecordingIcon from '../../../assets/icon/recording-mobile.svg';

class ConnoteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'Name',
      dataCode : '0',
      _itemDetail: null,
      submitPhoto : false,
    };
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, VASList, loadFromGallery} = props;
    const {dataCode, _itemDetail} = state;
    if(dataCode === '0'){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined) {
        loadFromGallery({gtype: 'disposal',gID : routes[index].params.dataCode });
        if( VASList.some((element)=> element.number === routes[index].params.dataCode)){
          let manifest = VASList.find((element)=>element.number === routes[index].params.dataCode);
          return {...state, dataCode: routes[index].params.dataCode, _itemDetail:manifest};    
        }
        return {...state, dataCode: routes[index].params.dataCode};
      }
      return {...state};
    } 
    
    return {...state};
  }
  componentDidUpdate(prevProps, prevState) {
    if(this.props.VASList !== prevProps.VASList){
     this.setState({dataCode:'0'});
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.keyStack !== nextProps.keyStack){
      if(nextProps.keyStack === 'ItemDisposalDetail'){
        this.props.setBottomBar(false);
        const {routes, index} = nextProps.navigation.dangerouslyGetState();
        if(routes[index].params !== undefined &&  routes[index].params.submitPhoto !== undefined && routes[index].params.submitPhoto === true){
           this.setState({submitPhoto : true});
        }
        return false;
      }
    }
    return true;
  }
  componentDidMount(){
  }
  navigateSeeReport = () => {
    this.props.navigation.navigate('ItemReportDetail');
  };

  renderHeader = () => {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Log</Text>
          <View style={styles.sortContainer}>
            <Text style={{...mixins.subtitle3, fontWeight: '700'}}>
              Sort By Name
            </Text>
            <View style={styles.sortIconWrapper}>
              <ChevronDown width="15" height="15" fill="#6C6B6B" />
            </View>
          </View>
        </View>
        <View style={[styles.header, {marginTop: 10}]}>
          <Text style={styles.detailText}>Date and Time</Text>
          <Text style={styles.detailText}>Name</Text>
          <Text style={styles.detailText}>Activities</Text>
        </View>
      </>
    );
  };

  renderInner = (item) => {
    return (
      <View style={styles.header}>
        <Text style={styles.detailText}>{item.date}</Text>
        <Text style={styles.detailText}>{item.name}</Text>
        <Text style={styles.detailText}>{item.status}</Text>
      </View>
    );
  };

  render() {
    const {_itemDetail} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.container}>
        <View style={[styles.header,{marginHorizontal:20}]}>
            <Text style={styles.headerTitle}>Disposal Details</Text>
          
          </View>
          <View style={styles.body}>
            <Card containerStyle={styles.cardContainer}>
              <View style={{...styles.detail,paddingHorizontal:20, marginBottom:10}}>
              <DetailList title="Job Type" value="Re-Labeling" />
              <DetailList title="Required Proof" value="Photo and Video" />
              </View>
              
            </Card>

            <View style={{alignItems: 'center',justifyContent: 'center', marginVertical: 20, marginHorizontal:20}}>
                        <Avatar onPress={()=>{
                              if(this.props.disposalProofID === null || this.props.disposalProofID === this.state.dataCode){
                                this.props.setBottomBar(false);
                                this.props.navigation.navigate('DisposalCamera')   
                               }           
                                }}
                                        size={79}
                                        ImageComponent={() => (
                                        <>
                                            <RecordingIcon height="40" width="40" fill="#fff" />
                                            {this.props.disposalPostpone !== null && (
                                            <Checkmark
                                                height="20"
                                                width="20"
                                                fill="#fff"
                                                style={styles.checkmark}
                                            />
                                            )}
                                        </>
                                        )}
                                        imageProps={{
                                        containerStyle: {
                                            alignItems: 'center',
                                            paddingTop: 18,
                                            paddingBottom: 21,
                                        },
                                        }}
                                        overlayContainerStyle={{
                                          backgroundColor: this.props.disposalProofID !== null && this.props.disposalProofID !== this.state.dataCode ? 'grey' : this.props.disposalPostpone !== null 
                                          ? '#17B055'
                                          : '#F07120',
                                        flex: 2,
                                        borderRadius: 5,
                                        }}/>
                                      
                                        <Text style={{...mixins.subtitle3,lineHeight:21,fontWeight: '600',color:'#6C6B6B'}}>Upload Video or Photo</Text>
                                      
                                </View>
{ (_itemDetail.status === 'progress' || _itemDetail.status === 'pending') ? (            
<>
<Button
              containerStyle={{flexShrink:1, marginVertical: 10,marginHorizontal:20}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={()=>{
                this.props.addMediaProofPostpone(null);
                this.props.setCompleteVAS( _itemDetail.number);
                this.props.navigation.navigate('List');
              }}
              disabled={(!this.state.submitPhoto)}
              title="Submit"
            />
            <Button
              containerStyle={{flexShrink:1, marginBottom: 10,marginHorizontal:20}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0, backgroundColor:'#121C78'}]}
              titleStyle={styles.deliveryText}
              onPress={()=>{
                this.props.navigation.navigate('ListDisposalItem')
              }}
              title="See All the Item"
            />
          <Button
              containerStyle={{flexShrink:1, marginBottom: 10,marginHorizontal:20}}
              buttonStyle={[styles.reportButton, {paddingHorizontal: 0}]}
              titleStyle={{...styles.deliveryText,color:'#E03B3B'}}
              onPress={()=>{
                this.props.navigation.navigate({
                  name:"ReportManifest",
                  params: {
                    dataCode : _itemDetail.number,
                    submitPhoto: false,
                  },
                })
              }}
              title="Report"
        
            />
  </>          ) : (
       <Button
       containerStyle={{flexShrink:1, marginBottom: 10,marginHorizontal:20}}
       buttonStyle={[styles.reportButton, {paddingHorizontal: 0}]}
       titleStyle={{...styles.deliveryText,color:'#E03B3B'}}
       onPress={()=>{
         this.props.navigation.navigate('ItemReportDetail')
       }}
       title="See Report Detail"
 
     />
  ) }

            <View style={{flexDirection:'column',flexShrink:1, marginVertical:20, marginHorizontal:20}}>
              <Text style={{...mixins.subtitle3,lineHeight:21}}>Remarks</Text>
              <View style={styles.remark}>
              <Text style={styles.remarkText}>
              Lorem ipsum      Lorem ipsum      Lorem ipsum      Lorem ipsum     Lorem ipsum      Lorem ipsum
              </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  deliveryText: {
    ...mixins.h6,
    lineHeight: 27,
    fontWeight:'600',
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },

  reportButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth:1,
    borderColor:'#424141'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical:20,
  
  },
  
  remarkText:{
    ...mixins.body3,
    lineHeight:18,
    color:'black',
  },
  remark : {
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginVertical:15,
    marginHorizontal:5,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    flexDirection:'row',
    flexShrink:1,
    minWidth:320,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...mixins.subtitle3,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#424141',
  },
  seeReportButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  seeReportText: {
    ...mixins.subtitle3,
    marginRight: 10,
    color: '#E03B3B',
  },
  body: {
    flex: 1,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingHorizontal:0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  packageCounterText: {
    ...mixins.subtitle3,
    fontSize: 30,
    lineHeight: 40,
    color: '#6C6B6B',
  },
  detail: {
    flexDirection: 'column',
  },
  detailText: {
    ...mixins.subtitle3,
    color: '#6C6B6B',
  },
  reportSection: {
    flexDirection: 'column',
  },
  reportSectionTitle: {
    ...mixins.subtitle3,
    color: '#424141',
    fontWeight: '700',
  },
  reportText: {
    ...mixins.subtitle3,
    color: 'red',
  },
  sortContainer: {
    borderWidth: 1,
    borderColor: '#ADADAD',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  sortIconWrapper: {
    backgroundColor: '#C5C5C5',
    borderRadius: 3,
    padding: 5,
    marginLeft: 5,
  },
  checkmark: {
    position: 'absolute', 
    bottom: 5, 
    right: 5
  },
});

const mapStateToProps = (state) => {
  return {
    VASList: state.originReducer.VASList,
    keyStack: state.originReducer.filters.keyStack,
    disposalPostpone: state.originReducer.disposalPostpone,
    disposalProofID : state.originReducer.disposalProofID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompleteVAS: (data) => {
      return dispatch({type:'completeVAS', payload: data});
  },
  setBottomBar: (toggle) => {
    return dispatch({type: 'BottomBar', payload: toggle});
  },
  addMediaProofPostpone: (uri) => dispatch({type: 'disposalPostpone', payload: uri}),
  loadFromGallery: (action) => {
    return dispatch({type:'loadFromGallery', payload: action});
  },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteDetails);
