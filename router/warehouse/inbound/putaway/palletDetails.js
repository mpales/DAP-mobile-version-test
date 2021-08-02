import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, Badge, Avatar} from 'react-native-elements';
import {connect} from 'react-redux';
import Mixins from '../../../../mixins';
// component
import DetailList from '../../../../component/extend/Card-detail';
// icon
import IconBarcodeMobile from '../../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';

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
    const {navigation, putawayList} = props;
    const {dataCode, _itemDetail} = state;
    if(dataCode === '0'){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.dataCode !== undefined) {
        if( putawayList.some((element)=> element.code === routes[index].params.dataCode)){
          let manifest = putawayList.find((element)=>element.code === routes[index].params.dataCode);
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

  renderHeader = () => {
    const {_itemDetail} = this.state;
    return (
      <View style={{backgroundColor:'white'}}>
      
           <View style={styles.header}>
            <Text style={styles.headerTitle}>Product</Text>
         
          </View>
      </View>
    );
  };

  renderInner = (item) => {
    return (
            <Card containerStyle={styles.cardContainer} style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.packageCounterText}>DSP -Dead Sea Premire</Text>
              </View>
              <View style={styles.detail}>
                <DetailList title="Item Code" value="HTM 1234567" />
                <DetailList title="Description" value="Sugar Yum 18gr" />
                <DetailList title="Stock Grade" value="Pick" />
                <DetailList title="UOM" value="Pcs" />
                <DetailList
                  title="Qty"
                  value="12"
                />

              </View>
            </Card>
    );
  };

  render() {
    const {_itemDetail} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Pallet Details</Text>
         
          </View>
          <View style={[styles.headerBody, {flexShrink: 1}]}>
            <Card containerStyle={styles.cardContainer} style={styles.card}>
              <View style={styles.header}>
                <View style={{flexDirection:'column', flexShrink: 1}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#ABABAB', fontWeight: '400'}}>
                    25-07-2021
                  </Text>
                  <Text style={{...Mixins.body1,lineHeight: 21,color: '#424141', fontWeight: '600'}}>
                  {_itemDetail.code}
                  </Text>
                  <Text style={{...Mixins.body1,lineHeight: 21,color: '#424141', fontWeight: '600'}}>
                  {_itemDetail.location}
                  </Text>
                  <Text style={{...Mixins.body1,lineHeight: 21,color: '#424141', fontWeight: '600'}}>
                  Suggested Location : AB-2-5 
                  </Text>
                </View>
                <Badge value={_itemDetail.category} status="warning" textStyle={{...Mixins.small3,fontWeight: '700',lineHeight: 15, paddingHorizontal: 20,}} containerStyle={{alignSelf: 'flex-start'}} badgeStyle={{backgroundColor: '#121C78'}} />
              </View>
            </Card>
          </View>
          <View style={styles.body}>
            
            <FlatList
              data={[1,2,3]}
              keyExtractor = {(item, index) => index.toString()}
              stickyHeaderIndices={[0]}
              ListHeaderComponent={this.renderHeader}
              renderItem={({item}) => this.renderInner(item)}
            />
          </View>
        </View>
          <View style={styles.buttonSticky}>
              <Avatar
                size={75}
                ImageComponent={() => (
                  <IconBarcodeMobile height="40" width="37" fill="#fff" />
                )}
                imageProps={{
                  containerStyle: {
                    ...Mixins.buttonAvatarDefaultIconStyle,
                  },
                }}
                overlayContainerStyle={styles.barcodeButton}
                onPress={() => {
                  this.props.setBarcodeScanner(true);
                  this.props.navigation.navigate({
                    name: 'PalletScanner',
                    params: {
                      inputCode: this.state._itemDetail.code,
                    },
                  });
                }}
                activeOpacity={0.7}
                containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
              />
            </View>
            <View style={styles.bottomTabContainer}>
             
            </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop:20,
    paddingBottom: 0,
    paddingHorizontal:20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Mixins.subtitle3,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#424141',
  },
  buttonSticky: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    elevation: 10,
    zIndex: 10,
    elevation: 12,
    backgroundColor:'transparent',
  },
  barcodeButton: {
    ...Mixins.buttonAvatarDefaultOverlayStyle,
    backgroundColor: '#F07120',
    borderRadius: 100,
  },
  bottomTabContainer: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   flexShrink:1,
   height:42,
   shadowColor: "#000",
   shadowOffset: {
     width: 0,
     height: 5,
   },
   shadowOpacity: 0.36,
   shadowRadius: 6.68,
   
   elevation: 11,
  },
  seeReportButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  seeReportText: {
    ...Mixins.subtitle3,
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
  packageCounterText: {...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '600'},
  detail: {
    flexDirection: 'column',
  },
  detailText: {
    ...Mixins.subtitle3,
    color: '#6C6B6B',
  },
  reportSection: {
    flexDirection: 'column',
  },
  reportSectionTitle: {
    ...Mixins.subtitle3,
    color: '#424141',
    fontWeight: '700',
  },
  reportText: {
    ...Mixins.subtitle3,
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
    putawayList: state.originReducer.putawayList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnoteDetails);
