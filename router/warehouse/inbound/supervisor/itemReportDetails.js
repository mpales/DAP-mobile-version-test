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
import {Card, CheckBox, Button, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import Mixins from '../../../../mixins';
import Checkmark from '../../../../assets/icon/iconmonstr-check-mark-7 1mobile.svg';
// component
import DetailList from '../../../../component/extend/Card-detail';
import ImageLoading from '../../../../component/loading/image';
import {getData, getBlob,postData, postBlob} from '../../../../component/helper/network';
import moment from 'moment';
const window = Dimensions.get('screen');
class ConnoteReportDetails extends React.Component {
  overlayThumb = null;
  arrayImageProcessingRef = [];
  constructor(props) {
    super(props);
    this.state = {
      receivingNumber: null,
      inboundID : null,
      acknowledged:false,
      title: 'Damage Item',
      note: 'Theres some crack on packages',
      resolution: '',
      dataReports : null,
      overlayImage : false,
      overlayImageString: null,
      overlayImageFilename : null,
    };
    this.toggleOverlay.bind(this);
    this.renderPhotoProof.bind(this);
    this.renderInner.bind(this)
    this.acknowledgedReport.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation} = props;
    const {receivingNumber} = state;
    if(receivingNumber === null){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.number !== undefined) {
        return {...state, inboundID: routes[index].params.number, receivingNumber:  routes[index].params.productID};
      }
      return {...state};
    } 
    
    return {...state};
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.dataReports !== this.state.dataReports){
      this.arrayImageProcessingRef.forEach(element => {
        if(element !== undefined){
          element.init();
        }
      });
    } 
    if(prevState.overlayImage !== this.state.overlayImage && this.state.overlayImage === true){
     if(this.overlayThumb !== null && this.overlayThumb !== undefined){
       this.overlayThumb.refresh();
     }
    } 
   }
   async componentDidMount(){
    const {receivingNumber, inboundID} = this.state;
    const {currentASN} = this.props;
    const result = await getData('/inbounds/'+inboundID+'/'+receivingNumber+'/reports');
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
      overlayImageString : item !== undefined ? '/inbounds/'+item.inbound_id+'/'+item.inbound_product_id+'/reports/'+item.report_id+'/photo/'+item.id : null,
      overlayImageFilename: item !== undefined ? ''+item.inbound_id+''+item.inbound_product_id+''+item.report_id+''+item.id+'.png' : null,
    });
  }
  renderPhotoProof = ({item,index})=>{
    return (<TouchableOpacity onPress={()=>this.toggleOverlay(item)}><ImageLoading 
        ref={ ref => {
          this.arrayImageProcessingRef[item.id] = ref
        }} 
        callbackToFetch={async (indicatorTick)=>{
          return await getBlob('/inbounds/'+item.inbound_id+'/'+item.inbound_product_id+'/reports/'+item.report_id+'/thumb/'+item.id,{filename:''+item.inbound_id+''+item.inbound_product_id+''+item.report_id+''+item.id+'.jpg'},(received, total) => {
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
      return (<Card containerStyle={styles.cardContainer} style={styles.card}>
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            {marginBottom: 10, color: '#E03B3B', fontSize: 20},
          ]}>
          {item.report}
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
    const {receivingNumber, inboundID,dataReports, resolution, acknowledged} = this.state;
    let data = {acknowledge: acknowledged >>> 0};
    for (let index = 0; index < dataReports.length; index++) {
      const element = dataReports[index];
      let result = await postBlob('/inbounds/'+inboundID+'/'+receivingNumber+'/reports/'+element.id,data); 
      console.log(result);
    }
    this.props.navigation.goBack();
  }
  renderFooter = () =>{
    return (<>
     <Text style={styles.detailText}>Resolution</Text>
                <TextInput
                  style={styles.note}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={this.state.resolution}
                />
           <CheckBox
                title="I Acknowledge"
                textStyle={styles.textCheckbox}
                containerStyle={styles.checkboxContainer}
                checked={this.state.acknowledged}
                onPress={this.toggleCheckBox}
                checkedIcon={this.checkedIcon()}
                uncheckedIcon={this.uncheckedIcon()}
              />
          <Button
              containerStyle={{flex:1, marginRight: 0,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              title="Confirm"
              onPress={this.acknowledgedReport}
              disabled={(this.state.acknowledged === false && this.state.resolution.length === 0)}
            /></>);
  }
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={styles.header}>
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
          <View style={styles.body}>
          <FlatList
            keyExtractor={(item,index)=>index}
              data={this.state.dataReports}
              renderItem={({item}) => this.renderInner(item)}
              ListFooterComponent={this.renderFooter}
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
