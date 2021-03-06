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
import mixins from '../../../../mixins';
// component
import DetailList from '../../../../component/extend/Card-detail';
// icon
import ChevronRight from '../../../../assets/icon/iconmonstr-arrow-66mobile-2.svg';
import ChevronDown from '../../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
import {getData} from '../../../../component/helper/network';
import moment from 'moment';
class ConnoteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'Name',
      dataCode : '0',
      inboundID: null,
      dataActivities : [],
      _itemDetail: null,
      totalReports: 0,
    };
    this.renderHeader.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList} = props;
    const {dataCode, _itemDetail} = state;
    if(dataCode === '0'){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined) {
        if( manifestList.some((element)=> element.pId === routes[index].params.dataCode)){
          let manifest = manifestList.find((element)=>element.pId === routes[index].params.dataCode);
          return {...state, dataCode: routes[index].params.dataCode, _itemDetail:manifest, inboundID:routes[index].params.inboundId };    
        }
        return {...state, dataCode: routes[index].params.dataCode, inboundID:routes[index].params.inboundId};
      }
      return {...state};
    } 
    
    return {...state};
  }

  async componentDidMount(){
    const {pId, logs} = this.state._itemDetail;
 
    if(logs.length > 0){
      this.setState({dataActivities:logs})
    } else {

    }
    const resultTotalReport = await getData('/inboundsMobile/'+this.state.inboundID+'/'+pId+'/reports');
    if(typeof resultTotalReport === 'object' && resultTotalReport.error === undefined){
      this.setState({totalReports:resultTotalReport.length})
    }
  }
  navigateSeeReport = () => {
    this.props.navigation.navigate('ItemReportDetail');
  };

  renderHeader = () => {
    const {_itemDetail} = this.state;
    return (
      <>
          <Card containerStyle={[styles.cardContainer,{paddingHorizontal:0,paddingVertical:10}]} style={styles.card}>
              <View style={[styles.header,{paddingHorizontal:20}]}>
                <View>
                  <Text style={[styles.headerTitle, {flex: 0, fontSize: 20}]}>
                  {_itemDetail.item_code}
                  </Text>
                
                </View>

              </View>
              <View style={[styles.detail,{paddingVertical:10}]}>
              <View style={[styles.detailSection,{paddingBottom:10}]}>
                <DetailList title="Description" value={_itemDetail.description} />
                <DetailList title="Barcode" value={ _itemDetail.barcodes.length === 0 ? 'EMPTY' : _itemDetail.barcodes[_itemDetail.barcodes.length - 1].code_number} />
             <DetailList title="UOM" value={_itemDetail.uom} />
                <DetailList title="Quantity" value={_itemDetail.qty} />
                <DetailList title="Product Class" value={_itemDetail.product_class === 1 ? 'Normal Stock' : _itemDetail.product_class === 2 ? 'POSM' : _itemDetail.product_class === 3 ? 'Packaging Materials' : 'Samples'} />
                <DetailList title="CBM" value={_itemDetail.basic.volume} />
                <DetailList title="Weight" value={_itemDetail.basic.weight + ' KG'} />
                </View>
                <Divider style={{marginBottom:10}}/>
                {_itemDetail.template !== undefined &&
                    _itemDetail.template !== null &&
                    _itemDetail.template.attributes !== undefined &&
                    _itemDetail.template.attributes !== null  && Array.isArray(_itemDetail.template.attributes) === true &&
                    _itemDetail.template.attributes.length > 0 && (<View style={[styles.detailSection,{paddingBottom:10}]}>
                  <Text style={styles.reportSectionTitle}>Custom Attributes</Text>
                  { _itemDetail.template.attributes.map((element,index)=>{
                      if(element.field_type === 'multi select' || element.field_type === 'options'){
                        return (<DetailList title={element.name} value={Array.isArray(element.values) && element.values.length > 0 ? element.values.join(', ') : '-'} />);
                      } else {
                        return (<DetailList title={element.name} value={element.field_type} />);
                      }
                    })}
                 
                </View>)}
                <View style={[styles.reportSection,{paddingHorizontal:20}]}>
                  <Text style={styles.reportSectionTitle}>Report:</Text>
                  <DetailList
                    title="Total Report"
                    value={this.state.totalReports+" Report"}
                    report={true}
                  />
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
          <Text style={styles.detailText}>Date and Time</Text>
          <Text style={styles.detailText}>Name</Text>
          <Text style={styles.detailText}>Activities</Text>
        </View>
      </>
    );
  };

  renderInner = ({item,index}) => {
    let oddeven = index % 2;
    return (
      <View style={[styles.header,{paddingHorizontal:10,backgroundColor: oddeven == 0 ? '#EFEFEF' : 'white'}]}>
          <View style={{flex:1}}>
        <Text style={styles.detailText}>{moment(item.dateTime).format('DD/MM/YYYY h:mm a')}</Text>
        </View>
        <View style={{flexShrink:1, paddingHorizontal:10,}}>
        <Text style={[styles.detailText, {textAlignVertical:'top'}]}>{item.user.firstName}</Text>
        </View>
        <View style={{flex:1, justifyContent:'flex-end',alignItems:'flex-end'}}>
        <Text style={[styles.detailText,{textAlign:'right'}]}>{item.activities}</Text>
        </View>
      </View>
    );
  };

  render() {
    const {_itemDetail} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={[styles.header,{paddingHorizontal:10}]}>
            <Text style={styles.headerTitle}>Product Details</Text>
         
          </View>
          <View style={styles.body}>
           
            <FlatList
              data={this.state.dataActivities}
              ListHeaderComponent={this.renderHeader}
              contentContainerStyle={{paddingHorizontal:10}}
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
    paddingHorizontal:10,
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
  detailSection: {
    flexDirection: 'column',
    paddingHorizontal:20,
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
    marginHorizontal: 0,
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
});

const mapStateToProps = (state) => {
  return {
    manifestList: state.originReducer.manifestList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteDetails);
