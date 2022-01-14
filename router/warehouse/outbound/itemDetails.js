import React from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, Divider} from 'react-native-elements';
import {connect} from 'react-redux';
import mixins from '../../../mixins';
import moment from 'moment';
// component
import DetailList from '../../../component/extend/Card-detail';
import {NavigateTextList, TextList} from '../../../component/extend/Text-list';
import Loading from '../../../component/loading/loading';
// icon
import ChevronDown from '../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
// helper
import {getData} from '../../../component/helper/network';
import Format from '../../../component/helper/format';

class PickListItemDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'Name',
      dataCode: '0',
      bayCode: '0',
      dataActivities: [],
      totalReports: 0,
      _itemDetail: null,
    };
  }
  static getDerivedStateFromProps(props, state) {
    const {navigation} = props;
    const {dataCode} = state;
    if (dataCode === '0') {
      const {routes, index} = navigation.dangerouslyGetState();
      if (
        routes[index].params !== undefined &&
        routes[index].params.dataCode !== undefined
      ) {
        return {...state, dataCode: routes[index].params.dataCode};
      }
      return {...state};
    }

    return {...state};
  }

  async componentDidMount() {
    const {outboundList} = this.props;
    const {dataCode, _itemDetail, bayCode} = this.state;
    if (
      dataCode !== '0' &&
      _itemDetail === null &&
      outboundList.some((element) => element.pick_task_product_id === dataCode)
    ) {
      let list = outboundList.find(
        (element) => element.pick_task_product_id === dataCode,
      );
      this.setState({_itemDetail: list});
      this.getTotalReport();
      this.getProductActivities();
    }
  }

  getTotalReport = async () => {
    const resultTotalReport = await getData(
      '/outboundMobile/pickTask/' +
        this.props.currentTask +
        '/product/' +
        this.state.dataCode +
        '/reports',
    );
    if (
      typeof resultTotalReport === 'object' &&
      resultTotalReport.error === undefined
    ) {
      this.setState({totalReports: resultTotalReport.length});
    }
  };

  getProductActivities = async () => {
    const resultActivities = await getData(
      '/outboundMobile/pickTask/' +
        this.props.currentTask +
        '/product/' +
        this.state.dataCode +
        '/activities',
    );
    if (
      typeof resultActivities === 'object' &&
      resultActivities.error === undefined
    ) {
      this.setState({dataActivities: resultActivities});
    }
  };

  navigateSeeReport = () => {
    const {pick_task_product_id} = this.state._itemDetail;
    this.props.navigation.navigate('ItemReportDetail', {
      number: pick_task_product_id,
    });
  };

  render() {
    const {_itemDetail, dataActivities} = this.state;
    if (_itemDetail === null) {
      return <Loading />;
    }
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.container}>
          <View style={styles.body}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Product Details</Text>
            </View>
            <Card
              containerStyle={[
                styles.cardContainer,
                {paddingHorizontal: 0, paddingVertical: 10},
              ]}
              style={styles.card}>
              <View style={[styles.header, {paddingHorizontal: 20}]}>
                <View>
                  <Text style={[styles.headerTitle, {flex: 0, fontSize: 20}]}>
                    {_itemDetail.product.item_code}
                  </Text>
                </View>
              </View>
              <View style={[styles.detail, {paddingVertical: 10}]}>
                <View style={[styles.detailSection, {paddingBottom: 10}]}>
                  <TextList
                    title="Description"
                    value={_itemDetail.product.description}
                  />
                  <TextList title="UOM" value={_itemDetail.product.uom} />
                  <TextList
                    title="Quantity"
                    value={_itemDetail.detail[0].quantity}
                  />
                  <TextList
                    title="Barcode"
                    value={_itemDetail.product.item_code}
                  />
                  <TextList
                    title="Product Class"
                    value={_itemDetail.detail[0].attributes?.class}
                  />
                  <TextList
                    title="CBM"
                    value={_itemDetail.detail[0].attributes?.cbm}
                  />
                  <TextList
                    title="Weight"
                    value={_itemDetail.detail[0].attributes?.weight}
                  />
                </View>
                <Divider />
                <View style={[styles.detailSection, {paddingVertical: 10}]}>
                  <Text style={styles.reportSectionTitle}>
                    Product Category :{' '}
                    {_itemDetail.detail[0].attributes?.category}
                  </Text>
                  <TextList
                    title="Color"
                    value={_itemDetail.detail[0].attributes?.Color}
                  />
                  <TextList
                    title="EXP Date"
                    value={Format.formatDate(
                      _itemDetail.detail[0].attributes?.expiry_date,
                    )}
                  />
                  <TextList title="Batch" value={_itemDetail.batch_no} />
                </View>
                <View style={[styles.reportSection, {paddingHorizontal: 20}]}>
                  <Text style={styles.reportSectionTitle}>Report:</Text>
                  <NavigateTextList
                    title="Total Report"
                    value={this.state.totalReports}
                    navigate={
                      this.state.totalReports > 0
                        ? this.navigateSeeReport
                        : null
                    }
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
              <View style={{flex: 1}}>
                <Text style={styles.detailText}>Date and Time</Text>
              </View>
              <View style={{flexShrink: 1}}>
                <Text style={[styles.detailText, {textAlign: 'left'}]}>
                  Name
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text style={styles.detailText}>Activities</Text>
              </View>
            </View>
            {dataActivities.map((item, index) => {
              let oddeven = index % 2;
              return (
                <View
                  style={[
                    styles.header,
                    {
                      paddingHorizontal: 10,
                      backgroundColor: oddeven == 0 ? '#EFEFEF' : 'white',
                    },
                  ]}
                  key={index}>
                  <View style={{flex: 1}}>
                    <Text style={styles.detailText}>
                      {Format.formatDateTime(item.date)}
                    </Text>
                  </View>
                  <View style={{flexShrink: 1}}>
                    <Text style={styles.detailText}>
                      {item.user_id.firstName}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={[styles.detailText, {textAlign: 'right'}]}>
                      {item.activity}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    currentTask: state.originReducer.filters.currentTask,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PickListItemDetails);
