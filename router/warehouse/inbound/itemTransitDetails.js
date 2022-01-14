import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import {Card, Divider} from 'react-native-elements';
import {connect} from 'react-redux';
import mixins from '../../../mixins';
// component
import DetailList from '../../../component/extend/Card-detail';
// icon
import ChevronRight from '../../../assets/icon/iconmonstr-arrow-66mobile-2.svg';
import ChevronDown from '../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';

class ConnoteDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'Name',
      dataCode : '0',
      _itemDetail: null,
    };
  }
  static getDerivedStateFromProps(props,state){
    const {navigation, manifestList} = props;
    const {dataCode, _itemDetail} = state;
    if(dataCode === '0'){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined) {
        if( manifestList.some((element)=> element.pId === routes[index].params.dataCode)){
          let manifest = manifestList.find((element)=>element.pId === routes[index].params.dataCode);
          return {...state, dataCode: routes[index].params.dataCode, _itemDetail:manifest};    
        }
        return {...state, dataCode: routes[index].params.dataCode};
      }
      return {...state};
    } 
    
    return {...state};
  }

  componentDidMount(){
  }
  navigateSeeReport = () => {
    this.props.navigation.navigate('ItemReportDetail');
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
            <Card containerStyle={styles.cardContainer} style={styles.card}>
             
              <View style={styles.detail}>
              <DetailList title="Container #" value={_itemDetail.container_no} />
               <DetailList title="No. of Pallet" value={_itemDetail.total_pallet} />
               <DetailList title="No. of Carton" value={_itemDetail.total_carton} />
               </View>
                <Divider style={{marginVertical:10}}/>
                <View style={styles.detail}>
                <View style={styles.header}>
                  <Text style={[styles.detailText, {lineHeight: 24, fontWeight: Platform.OS === 'ios' ? '600' : '700'}]}>
                  Delivery Information
                  </Text>
                </View>
                <DetailList title="Delivery Type" value={_itemDetail.delivery_type === 1 ? 'Self Collection' : 'Request Delivery'} />
              </View>
            </Card>
           
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
    paddingHorizontal:0,
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
    paddingHorizontal:20,
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
