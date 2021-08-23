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
class ConnoteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'Name',
      dataCode : '0',
      bayCode :'0',
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
        return {...state, dataCode: routes[index].params.dataCode, bayCode:routes[index].params.bayCode};
      }
      return {...state};
    } 
    
    return {...state};
  }

  componentDidMount(){
    const {navigation, outboundList} = this.props;
    const {dataCode, _itemDetail, bayCode} = this.state;
    
    if(dataCode !=='0' && _itemDetail === null && outboundList.some((element)=> element.barcode === dataCode && element.location_bay === bayCode)){
      let list = outboundList.find((element)=>element.barcode === dataCode);
      this.setState({_itemDetail: list});
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
                    {_itemDetail.barcode}
                  </Text>
                </View>
                {/* <Text style={styles.packageCounterText}>{_itemDetail.scanned+'/'+_itemDetail.total_qty}</Text> */}
              </View>
              <View style={[styles.detail,{paddingVertical:10}]}>
                <View style={[styles.detailSection,{paddingBottom:10}]}>
                <DetailList title="Description" value={_itemDetail.description} />
                <DetailList title="Barcode" value={_itemDetail.barcode} />
                <DetailList title="UOM" value={_itemDetail.UOM} />
                <DetailList title="Quantity" value={_itemDetail.total_qty} />
                <DetailList title="Product Class" value="-" />
                <DetailList title="CBM" value="-" />
                <DetailList title="Weight" value="-" />
                </View>
                <Divider/>
                <View style={[styles.detailSection,{paddingVertical:10}]}>
                  <Text style={styles.reportSectionTitle}>Product Category : Fashion</Text>
                  <DetailList title="Color" value="BLACK" />
                  <DetailList title="EXP Date" value="-" />
                  <DetailList title="Banch" value="-" />
                </View>
                <View style={[styles.reportSection,{paddingHorizontal:20}]}>
                  <Text style={styles.reportSectionTitle}>Report:</Text>
                  <TouchableOpacity
              style={styles.seeReportButton}
              onPress={this.navigateSeeReport}>
                  <DetailList
                    title="Total Report"
                    value="2 Report"
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
              data={[]}
              style={{padding:0}}
              ListHeaderComponent={this.renderHeader}
              renderItem={({item}) => this.renderInner(item)}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteDetails);
