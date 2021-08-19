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
      dataActivities : [],
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
        if( manifestList.some((element)=> element.code === routes[index].params.dataCode)){
          let manifest = manifestList.find((element)=>element.code === routes[index].params.dataCode);
          return {...state, dataCode: routes[index].params.dataCode, _itemDetail:manifest};    
        }
        return {...state, dataCode: routes[index].params.dataCode};
      }
      return {...state};
    } 
    
    return {...state};
  }

  async componentDidMount(){
    const {id} = this.state._itemDetail;
    const result = await getData('/inboundsMobile/'+id+'/activities');
    if(typeof result === 'object' && result.error === undefined){
      this.setState({dataActivities:result})
    } else {

    }
  }
  navigateSeeReport = () => {
    this.props.navigation.navigate('ItemReportDetail');
  };

  renderHeader = () => {
    const {_itemDetail} = this.state;
    return (
      <>
        <Card containerStyle={styles.cardContainer} style={styles.card}>
             
             <View style={styles.detail}>
               <DetailList title="Container #" value="ADIDAS SHOES" />
               <DetailList title="No. of Pallet" value="20" />
               <DetailList title="No. of Carton" value="10" />
               <DetailList title="CBM" value="0.68" />
               <DetailList
                 title="Weight"
                 value="11 KG"
               />
               <Divider />
               <View style={styles.header}>
                 <Text style={[styles.detailText, {lineHeight: 24}]}>
                 Delivery Information
                 </Text>
               </View>
               <DetailList title="Delivery Type" value="SELF COLLECTION" />
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
        <Text style={styles.detailText}>{moment(item.date).format('DD/MM/YYY h:mm a')}</Text>
        <Text style={styles.detailText}>{item.name.firstName}</Text>
        <Text style={styles.detailText}>{item.activity}</Text>
      </View>
    );
  };

  render() {
    const {_itemDetail} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Transit Item Details</Text>
            
          </View>
          <View style={styles.body}>
          
            <FlatList
              data={this.state.dataActivities}
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
    padding: 20,
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