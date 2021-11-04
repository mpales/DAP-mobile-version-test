import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {Card, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import mixins from '../../../mixins';
// component
import DetailList from '../../../component/extend/Card-detail';
import ImageLoading from '../../../component/loading/image';
import {getData, getBlob} from '../../../component/helper/network';
import moment from 'moment';

const window = Dimensions.get('screen');
class ConnoteReportDetails extends React.Component {
  overlayThumb = null;
  arrayImageProcessingRef = {};
  constructor(props) {
    super(props);
    this.state = {
      receivingNumber: null,
      title: 'Damage Item',
      note: 'Theres some crack on packages',
      dataReports : null,
      overlayImage : false,
      overlayImageString: null,
      overlayImageFilename : null,
    };
    this.renderPhotoProof.bind(this);
    this.renderInner.bind(this)
  }
  static getDerivedStateFromProps(props,state){
    const {navigation} = props;
    const {receivingNumber} = state;
    if(receivingNumber === null){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.number !== undefined) {
        return {...state, receivingNumber: routes[index].params.number};
      }
      return {...state};
    } 
    
    return {...state};
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
   if(prevState.dataReports !== this.state.dataReports){
    for (const [key, value] of Object.entries(this.arrayImageProcessingRef)) {
      if(value !== undefined){
        value.init();
      }
    }
   } 
   if(prevState.overlayImage !== this.state.overlayImage && this.state.overlayImage === true){
    if(this.overlayThumb !== null && this.overlayThumb !== undefined){
      this.overlayThumb.refresh();
    }
   } 
  }
  async componentDidMount(){
    const {receivingNumber} = this.state;
    const {currentASN} = this.props;
    const result = await getData('/inboundsMobile/'+currentASN+'/'+receivingNumber+'/reports');
    if(typeof result === 'object' && result.error === undefined){
      this.setState({dataReports:result})
    } else {
      this.props.navigation.goBack();
    }
  }
  toggleOverlay = (item)=>{
    const {overlayImage} = this.state;
    this.setState({
      overlayImage: !overlayImage,
      overlayImageString : item !== undefined ? '/inboundsMobile/'+item.inbound_id+'/'+item.inbound_product_id+'/reports/'+item.report_id+'/photo/'+item.id : null,
      overlayImageFilename: item !== undefined ? ''+item.inbound_id+''+item.inbound_product_id+''+item.report_id+''+item.id+'.png' : null,
    });
  }
  renderPhotoProof = ({item,index})=>{
  return (<TouchableOpacity onPress={()=>this.toggleOverlay(item)}><ImageLoading 
      ref={ ref => {
        this.arrayImageProcessingRef[item.id] = ref
      }} 
      callbackToFetch={async (indicatorTick)=>{
        return await getBlob('/inboundsMobile/'+item.inbound_id+'/'+item.inbound_product_id+'/reports/'+item.report_id+'/thumb/'+item.id,{filename:''+item.inbound_id+''+item.inbound_product_id+''+item.report_id+''+item.id+'.jpg'},(received, total) => {
          // if(this.arrayImageProcessingRef.length > 0 && this.arrayImageProcessingRef[item.id] !== undefined && this.arrayImageProcessingRef[item.id] !== null)
          // this.arrayImageProcessingRef[item.id].
          indicatorTick(received)
        })
      }}
      containerStyle={{width:65,height:65, margin:5}}
      style={{width:65,height:65,backgroundColor:'black'}}
      imageStyle={{width:65,height:65}}
      imageContainerStyle={{}}
      /></TouchableOpacity>)
  }
  renderInner = (item) =>{
    let photoData = Array.from({length:item.inbound_report_photos.length}).map((num,index)=>{
      return {...item.inbound_report_photos[index],report_id:item.id,inbound_id:item.inbound_id,inbound_product_id:item.inbound_product_id}
    });
    let report_title = 'Other';
    switch (item.report) {
      case 1:
        report_title = 'Damage Item'
        break;
        case 2:
          report_title = 'Item Missing'
          break;
          case 3:
            report_title = 'Excess Item'
            break;
            case 4:
              report_title = 'Others'
              break;
              case 5:
                report_title = 'Expired Item'
                break;
                        
      default:
        break;
    }
    return (<Card containerStyle={styles.cardContainer} style={styles.card}>
    <View style={styles.header}>
      <Text
        style={[
          styles.headerTitle,
          {marginBottom: 10, color: '#E03B3B', fontSize: 20},
        ]}>
        {report_title }
      </Text>
    </View>
    <View style={styles.detail}>
      <DetailList title="Report By" value={item.reported_by.firstName} />
      <DetailList title="Date and Time" value={moment(item.reported_on).format('DD/MM/YYY h:mm a')} />
      <DetailList title="Photo Proof" value={''} />
      <FlatList
            horizontal={true}
            keyExtractor={(item,index)=>index}
            data={photoData}
            renderItem={this.renderPhotoProof}
      />
      <Text style={styles.detailText}>Note</Text>
      <TextInput
        style={styles.note}
        multiline={true}
        numberOfLines={3}
        textAlignVertical="top"
        value={item.description}
        editable={false}
      />
    </View>
  </Card>);
  }
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={[styles.header,{   paddingHorizontal:10,}]}>
            <Text style={styles.headerTitle}>Report Details</Text>
          </View>
          <Overlay isVisible={this.state.overlayImage} onBackdropPress={this.toggleOverlay}>
            <ImageLoading 
            ref={ ref => {
              this.overlayThumb = ref
            }} 
            callbackToFetch={async (indicatorTick)=>{
              return await getBlob(this.state.overlayImageString,{filename:this.state.overlayImageFilename},(received, total) => {
                // if(this.overlayThumb !== undefined)
                // this.overlayThumb.indicatorTick(received)
                indicatorTick(received)
              })
            }}
            containerStyle={{width:window.width * 0.8,height:window.width * 0.8,}}
            style={{width:window.width * 0.8,height:window.width * 0.8,backgroundColor:'black'}}
            imageStyle={{width:window.width * 0.8,height:window.width * 0.8}}
            imageContainerStyle={{}}
            />
          </Overlay>
          <View style={styles.body}>
          <FlatList
            keyExtractor={(item,index)=>index}
              data={this.state.dataReports}
              renderItem={({item}) => this.renderInner(item)}
              contentContainerStyle={{paddingHorizontal:10}}
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
    paddingHorizontal:10,
    paddingVertical:20,
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
  detailText: {
    ...mixins.subtitle3,
    color: '#6C6B6B',
  },
  note: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    color: '#6C6B6B',
  },
  changeButton: {
    backgroundColor: '#F07120',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  changeButtonText: {
    ...mixins.subtitle3,
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
});

const mapStateToProps = (state) => {
  return {
    currentASN : state.originReducer.filters.currentASN,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnoteReportDetails);
