import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, Divider} from 'react-native-elements';
import {connect} from 'react-redux';
import mixins from '../../../mixins';
// component
import DetailList from '../../../component/extend/Card-detail';
// icon
import ChevronRight from '../../../assets/icon/iconmonstr-arrow-66mobile-2.svg';
import ChevronDown from '../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
import Loading from '../../../component/loading/loading';
import {getData} from '../../../component/helper/network';
import moment from 'moment';
class ConnoteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'Name',
      dataCode : '0',
      bayCode :'0',
      dataActivities : [],
      totalReports: 0,
      _itemDetail: null,
    };
    this.renderHeader.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList} = props;
    const {dataCode, _itemDetail} = state;
    if(dataCode === '0'){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined) {
        return {...state, dataCode: routes[index].params.dataCode};
      }
      return {...state};
    } 
    
    return {...state};
  }

  async componentDidMount(){
    const {navigation, outboundList} = this.props;
    const {dataCode, _itemDetail, bayCode} = this.state;
    
    if(dataCode !=='0' && _itemDetail === null && outboundList.some((element)=> element.pick_task_product_id === dataCode)){
      let list = outboundList.find((element)=>element.pick_task_product_id === dataCode);
      this.setState({_itemDetail: list});
      const resultTotalReport = await getData('/outboundMobile/pickTask/'+this.props.currentTask+'/product/'+dataCode+'/reports');
      console.log(resultTotalReport)
      if(typeof resultTotalReport === 'object' && resultTotalReport.error === undefined){
        this.setState({totalReports:resultTotalReport.length})
      }

      const resultActivities = await getData('/outboundMobile/pickTask/'+this.props.currentTask+'/product/'+dataCode+'/activities');
      console.log(resultActivities);
      if(typeof resultActivities === 'object' && resultActivities.error === undefined){
        this.setState({dataActivities:resultActivities})
      }
    }
  }
  navigateSeeReport = () => {
    const {pick_task_product_id} = this.state._itemDetail;
    this.props.navigation.navigate('ItemReportDetail',{number:pick_task_product_id});
  };

  renderHeader = () => {
    const {_itemDetail} = this.state;
    let totalQty = Array.from({length:_itemDetail.detail.length}).map((num,index)=>{
      if(typeof _itemDetail.detail[index] !== 'object' || _itemDetail.detail[index].quantity === undefined)
      return null;

      return _itemDetail.detail[index].quantity;
    });
    let filteredTotalQty = totalQty.filter((o)=> o !== null);
    let expArr = Array.from({length:_itemDetail.detail.length}).map((num,index)=>{
        if(typeof _itemDetail.detail[index] !== 'object' || _itemDetail.detail[index].attributes.expiry_date === undefined)
        return null;
      return _itemDetail.detail[index].attributes.expiry_date;
    });
    let expFiltered = expArr.filter((o)=> o !== null);

    let colorArr = Array.from({length:_itemDetail.detail.length}).map((num,index)=>{
        if(typeof _itemDetail.detail[index] !== 'object' || _itemDetail.detail[index].attributes.color === undefined)
        return null;
      return _itemDetail.detail[index].attributes.color;
    });
    let colorFiltered =colorArr.filter((o)=> o !== null);;
    
    let weightArr = Array.from({length:_itemDetail.detail.length}).map((num,index)=>{
      if(typeof _itemDetail.detail[index] !== 'object' || _itemDetail.detail[index].attributes.weight === undefined)
      return null;
      return _itemDetail.detail[index].attributes.weight;
    });
    let weightFiltered = weightArr.filter((o)=> o !== null);;

    
    let volumeArr = Array.from({length:_itemDetail.detail.length}).map((num,index)=>{
      if(typeof _itemDetail.detail[index] !== 'object' || _itemDetail.detail[index].attributes.volume === undefined)
      return null;
      return _itemDetail.detail[index].attributes.volume;
    });
    let volumeFiltered = volumeArr.filter((o)=> o !== null);;
    
       
    let classArr = Array.from({length:_itemDetail.detail.length}).map((num,index)=>{
      if(typeof _itemDetail.detail[index] !== 'object' || _itemDetail.detail[index].attributes.class === undefined)
      return null;
      return _itemDetail.detail[index].attributes.class;
    });
    let classFiltered = classArr.filter((o)=> o !== null);;

    let banchArr = Array.from({length:_itemDetail.detail.length}).map((num,index)=>{
      if(_itemDetail.detail[index].batch_no === undefined)
      return null;
      return _itemDetail.detail[index].batch_no;
    });
    let banchFiltered = banchArr.filter((o)=> o !== null);;
    let categoryArr = Array.from({length:_itemDetail.detail.length}).map((num,index)=>{
      if(typeof _itemDetail.detail[index] !== 'object' || _itemDetail.detail[index].attributes.category === undefined)
      return null;
      return _itemDetail.detail[index].attributes.category;
    });
    categoryFiltered = categoryArr.filter((o)=> o !== null);
    return (
      <>
      <Card containerStyle={[styles.cardContainer,{paddingHorizontal:0,paddingVertical:10}]} style={styles.card}>
              <View style={[styles.header,{paddingHorizontal:20}]}>
                <View>
                  <Text style={[styles.headerTitle, {flex: 0, fontSize: 20}]}>
                    {_itemDetail.product.item_code}
                  </Text>
                </View>
                {/* <Text style={styles.packageCounterText}>{_itemDetail.scanned+'/'+_itemDetail.total_qty}</Text> */}
              </View>
              <View style={[styles.detail,{paddingVertical:10}]}>
                <View style={[styles.detailSection,{paddingBottom:10}]}>
                <DetailList title="Description" value={_itemDetail.product.description} />
                <DetailList title="Barcode" value={_itemDetail.product.item_code} />
                <DetailList title="UOM" value={_itemDetail.product.uom} />
                <DetailList title="Quantity" value={filteredTotalQty.length > 0 ? String(filteredTotalQty.reduce((p,n)=>p+n)) : "0"}/>
                <DetailList title="Item Classification" value={classFiltered.length > 0 ? classFiltered[0] : '-'  } />
                <DetailList title="CBM" value={volumeFiltered.length > 0 ? volumeFiltered[0] : '-'} />
                <DetailList title="Weight" value={weightFiltered.length > 0 ? weightFiltered[0] : '-'} />
                </View>
                <Divider/>
                <View style={[styles.detailSection,{paddingVertical:10}]}>
                  <Text style={styles.reportSectionTitle}>Product Category : {categoryFiltered.length > 0 ? categoryFiltered[0]:'-' }</Text>
                  <DetailList title="Color" value={colorFiltered.length > 0 ? colorFiltered[0] : '-' } />
                  <DetailList title="EXP Date" value={expFiltered.length > 0 && expFiltered[0] ? moment(expFiltered[0]).format('YYYY-MM-DD HH:mm:ss') : '-'} />
                  <DetailList title="Batch" value={banchFiltered.length > 0 ? banchFiltered[0] : '-'} />
                </View>
                <View style={[styles.reportSection,{paddingHorizontal:20}]}>
                  <Text style={styles.reportSectionTitle}>Report:</Text>
                  <TouchableOpacity
              style={styles.seeReportButton}
              onPress={this.navigateSeeReport}>
               <DetailList
                    title="Total Report"
                    value={this.state.totalReports+" Report"}
                    report={true}
                  />
                   </TouchableOpacity>
                </View>
              </View>
            </Card>
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
        <View style={{flex:1}}>
          <Text style={styles.detailText}>Date and Time</Text>
          </View>
          <View style={{flexShrink:1}}>
          <Text style={[styles.detailText,{textAlign:'left'}]}>Name</Text>
          </View>
          <View style={{flex:1, justifyContent:'flex-end',alignItems:'flex-end'}}>
          <Text style={styles.detailText}>Activities</Text>
          </View>
        </View>
      </>
    );
  };

  renderInner = ({item,index}) => {
    let oddeven = index % 2;
    return (
      <View style={[styles.header,{backgroundColor: oddeven == 0 ? '#EFEFEF' : 'white'}]}>
         <View style={{flex:1}}>
        <Text style={styles.detailText}>{moment(item.date).format('DD/MM/YYYY h:mm a')}</Text>
        </View>
        <View style={{flexShrink:1}}>
        <Text style={styles.detailText}>{item.user_id.firstName}</Text>
        </View>
        <View style={{flex:1, justifyContent:'flex-end',alignItems:'flex-end'}}>
        <Text style={[styles.detailText,{textAlign:'right'}]}>{item.activity}</Text>
        </View>
      </View>
    );
  };

  render() {
    const {_itemDetail} = this.state;
    if(_itemDetail === null){
      return (<Loading/>)
    }
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Product Details</Text>
        
          </View>
          <View style={styles.body}>
            <FlatList
              data={this.state.dataActivities}
              style={{padding:0}}
              ListHeaderComponent={this.renderHeader}
              renderItem={this.renderInner}
            />
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
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
    marginHorizontal: 15,
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
  detailSection: {
    flexDirection: 'column',
    paddingHorizontal:20,
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
});

const mapStateToProps = (state) => {
  return {
    outboundList: state.originReducer.outboundList,
    currentTask : state.originReducer.filters.currentTask,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteDetails);
