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
  TouchableOpacity,
} from 'react-native';
import {Card, CheckBox, Button, Overlay, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import Mixins from '../../../../mixins';
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
// component
import DetailList from '../../../../component/extend/Card-detail';
import ImageLoading from '../../../../component/loading/image';
import Loading from '../../../../component/loading/loading';
import Banner from '../../../../component/banner/banner';
import Incremental from '../../../../assets/icon/plus-mobile.svg';
import Decremental from '../../../../assets/icon/min-mobile.svg';
import {getData, getBlob,postData, postBlob} from '../../../../component/helper/network';
import moment from 'moment';
const window = Dimensions.get('screen');
class ConnoteReportDetails extends React.Component {
  overlayThumb = null;
  arrayImageProcessingRef = {};
  constructor(props) {
    super(props);
    this.state = {
      receivingNumber: null,
      inboundID : null,
      reportID : null,
      acknowledged:false,
      title: 'Damage Item',
      note: 'Theres some crack on packages',
      resolution: '',
      dataReports : null,
      arrayPhotoID: null,
      photoData : null,
      overlayImage : false,
      overlayImageString: null,
      overlayImageFilename : null,
      error: '',
      qtyreported : "0",
    };
    this.toggleOverlay.bind(this);
    this.renderPhotoProof.bind(this);
    this.acknowledgedReport.bind(this);
    this.toggleCheckBox.bind(this);
    this.changeResolutionToReports.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation} = props;
    const {receivingNumber} = state;
    if(receivingNumber === null){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.number !== undefined) {
        const photoData = Array.from({length:routes[index].params.arrayPhotoID.length}).map((num,i)=>{
          return {...routes[index].params.arrayPhotoID[i],report_id:routes[index].params.reportID,inbound_id:routes[index].params.number,inbound_product_id: routes[index].params.productID}
        });
        return {
          ...state, 
          inboundID: routes[index].params.number, 
          receivingNumber:  routes[index].params.productID, 
          reportID: routes[index].params.reportID,
          arrayPhotoID:  routes[index].params.arrayPhotoID,
          photoData:photoData,
        };
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
    const {receivingNumber, inboundID, reportID} = this.state;
    const {currentASN} = this.props;
    const result = await getData('/inboundsMobile/'+inboundID+'/'+receivingNumber+'/reports/'+reportID);
    if(typeof result === 'object' && result.error === undefined){
      this.setState({dataReports:result, qtyreported : ''+result.qty})
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
        containerStyle={{width:105,height:105, margin:5}}
        style={{width:105,height:105,backgroundColor:'black'}}
        imageStyle={{width:105,height:105}}
        imageContainerStyle={{}}
        /></TouchableOpacity>)
    }
   
  checkedIcon = () => {
    return (
      <View
        style={
          styles.checked
        }>
        <Checkmark height="14" width="14" fill="#FFFFFF" />
      </View>
    );
  };
  
  uncheckedIcon = () => {
    return <View style={styles.unchecked} />;
  };
  acknowledgedReport = async ()=>{
    const {receivingNumber, inboundID, reportID, acknowledged,resolution, qtyreported} = this.state;
    let data = {
      acknowledge: acknowledged >>> 0,
      spvRemarks: resolution,
      qty:  qtyreported,
    };
    let result = await postData('/inboundsMobile/'+inboundID+'/'+receivingNumber+'/reports/'+reportID,data); 
    if(result !== 'object'){
      this.props.navigation.navigate('ReportDetailsSPV', {
        isShowBannerSuccess : true,
        isShowBanner : result,
      });
    } else {
      if(result.errors !== undefined){
        let dumpError = '';
        result.errors.forEach(element => {
          dumpError += element.msg + ' ';
        });
        this.setState({error:dumpError});
      } else if(result.error !== undefined){
        this.setState({error:result.error});
      }
    }
  }
  toggleCheckBox = () => {
    this.setState({
      acknowledged: !this.state.acknowledged,
    });
  };
  changeResolutionToReports = (text) =>{
    this.setState({
      resolution: text,
    });
  };
  closeBanner = () => {
    this.setState({
      isShowBannerSuccess: false,
      error: '',
    });
  };
  render() {
    const {dataReports, photoData} = this.state;
    console.log(dataReports);
    if(dataReports === null)
    return (<Loading />);
    let report_title = 'Other';
    switch (dataReports.report) {
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
    return (
      <>
        <StatusBar barStyle="dark-content" />
        {this.state.error !== '' && (
          <Banner title={this.state.error} closeBanner={this.closeBanner} backgroundColor="#F1811C" />
        )}
        <ScrollView style={styles.container}>
          <View style={[styles.header,{paddingHorizontal:10,marginTop:20}]}>
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
                // this.overlayThumb.
                indicatorTick(received)
              })
            }}
            containerStyle={{width:window.width * 0.8,height:window.width * 0.8,}}
            style={{width:window.width * 0.8,height:window.width * 0.8,backgroundColor:'black'}}
            imageStyle={{width:window.width * 0.8,height:window.width * 0.8}}
            imageContainerStyle={{}}
            />
          </Overlay>
          <View style={[styles.body,{paddingHorizontal:10}]}>
            <Card containerStyle={styles.cardContainer} style={styles.card}>
                <View style={styles.header}>
                  <Text
                    style={[
                      styles.headerTitle,
                      {marginBottom: 10, color: '#E03B3B', fontSize: 20, color: dataReports.acknowledged === 1 ? '#17B055' : '#E03B3B'},
                    ]}>
                    {report_title}
                  </Text>
                </View>
                <View style={styles.detail}>
                  <DetailList title="Report By" value={dataReports.reported_by.firstName} />
                  <DetailList title="Date and Time" value={moment(dataReports.reported_on).format('DD/MM/YYY h:mm a')} />
                  {dataReports.acknowledged === 1 && (<DetailList title="Affected Quantity" value={dataReports.qty} />)}
                  <DetailList title="Photo Proof" value={''} />
                  <FlatList
                        horizontal={true}
                        keyExtractor={(item,index)=>index}
                        data={photoData}
                        renderItem={this.renderPhotoProof}
                  />
                  <Text style={styles.detailText}>Remarks</Text>
                  <TextInput
                    style={styles.note}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={dataReports.description}
                    editable={false}
                  />
                    {dataReports.acknowledged === 1 && (<View style={{marginVertical:20}}><Text style={styles.detailText}>Supervisor Remarks</Text>
                  <TextInput
                    style={styles.note}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={dataReports.spvRemarks}
                    editable={false}
                  /></View>)}
                </View>
              </Card>
              {dataReports.acknowledged === 0 && (
              <>
              <View style={{marginBottom:5, flexDirection:'row', paddingHorizontal:10}}>
                    <View style={{flexDirection:'column', marginRight:35, marginTop:30}}>
                        <Text style={{...Mixins.body1, lineHeight:20, fontWeight:'700',color:'#424141'}}>Affected Quantity</Text>
                    </View>
                    <Input
                    containerStyle={{paddingHorizontal:0,marginHorizontal:0, flexShrink:1, paddingTop:15}}
                        inputContainerStyle={{borderBottomWidth:0}}
                            style={{...Mixins.h6, lineHeight:27, fontWeight:'700',color:'#424141',margin:0,textAlignVertical:'center',textAlign:'center'}}
                            keyboardType='number-pad'
                            inputStyle={{...Mixins.containedInputDefaultStyle,borderColor:'#ABABAB',borderWidth:1, borderRadius:5}}
                            onChangeText={(val)=>{
                                this.setState({qtyreported:  val});
                            }}
                            multiline={false}
                            numberOfLines={1}
                            value={this.state.qtyreported}
                            rightIcon={()=>{
                                return (
                                    <View style={{flexDirection:'column', backgroundColor:'transparent', flex:1, marginTop:0, marginLeft:10, justifyContent:'center', alignContent:'center',}}>
                                        <Incremental height="30" width="30" style={{flexShrink:1,}}
                                         onPress={()=>{
                                            const {qtyreported} = this.state;
                                            let qty = parseInt(qtyreported)
                                            this.setState({qtyreported: (qtyreported === '' || isNaN(qty) === true) || (qty < 0) ? '0' : ''+ (qty+1) });
                                        }}
                                        />
                                      
                                    </View>
                                );
                            }}
                            leftIcon={()=>{
                                return (
                                    <View style={{flexDirection:'column', backgroundColor:'transparent', flex:1,marginTop:0, marginRight:10, justifyContent:'center', alignContent:'center'}}>
                                         <Decremental height="30" width="30" style={{flexShrink:1, }}
                                          onPress={()=>{
                                            const {qtyreported} = this.state;
                                            let qty = parseInt(qtyreported)
                                            this.setState({qtyreported:  (qtyreported === '' || isNaN(qty) === true) || (qty <= 0) ? '0' : ''+ (qty-1) });
                                        }}
                                        />
                                      
                                    </View>
                                );
                            }}
                        />
                    </View>
              <Text style={[styles.detailText,{paddingHorizontal:10}]}>Supervisor Remarks</Text>
                <TextInput
                  style={[styles.note,{marginHorizontal:10}]}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  onChangeText={this.changeResolutionToReports}
                  value={this.state.resolution}
                />
                <CheckBox
                      title="I Acknowledge Item Report"
                      textStyle={styles.textCheckbox}
                      containerStyle={[styles.checkboxContainer,{paddingHorizontal:10}]}
                      checked={this.state.acknowledged}
                      onPress={this.toggleCheckBox}
                      checkedIcon={this.checkedIcon()}
                      uncheckedIcon={this.uncheckedIcon()}
                    />
                <Button
                    containerStyle={{flex:1, marginHorizontal: 10,}}
                    buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
                    titleStyle={styles.deliveryText}
                    title="Confirm"
                    onPress={this.acknowledgedReport}
                    disabled={(this.state.acknowledged === false || this.state.resolution.length === 0)}
                  />
                  </>
                  )}
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
    paddingVertical: 0,
    paddingHorizontal:10,
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
    ...Mixins.subtitle3,
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
    ...Mixins.subtitle3,
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
  textCheckbox: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#6C6B6B',
    textAlign: 'center',
  },
  checkboxContainer: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    margin: 0,
    paddingHorizontal: 0,
  },
  checked: {
    backgroundColor: '#2A3386',
    padding: 5,
    borderRadius: 2,
    marginRight: 5,
    marginVertical: 3,
  },
  unchecked: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#6C6B6B',
    padding: 5,
    marginRight: 5,
    marginVertical: 3,
  },
  deliveryText: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight:'600',
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnoteReportDetails);
