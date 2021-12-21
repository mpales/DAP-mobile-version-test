import React from 'react';
import {
  ListItem,
  Avatar,
  ThemeProvider,
  withBadge,
  Badge,
  Button,
  Text,
} from 'react-native-elements';
import {View, TouchableOpacity} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconCursor20Mobile from '../../assets/icon/iconmonstr-cursor-20 1mobile.svg';
import IconTime2Mobile from '../../assets/icon/iconmonstr-time-2 1mobile.svg';
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import moment from 'moment';
import Mixins from '../../mixins';

const styles = {
  sectionContainer: {
    marginHorizontal: 14,
    paddingVertical: 12,
    flexGrow: 1,
  },
  titleText: {
    color: '#6C6B6B',
    fontWeight: '600',
  },
  subtitleText: {
    marginVertical: 2,
    color: '#6C6B6B',
  },
  containerList: {
    marginHorizontal: 0,
    marginVertical: 6,
    padding: 0,
    marginBottom: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  labelContainer : {
    flexShrink: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginHorizontal: 0,
    marginVertical: 10,
    padding:3,
    alignSelf: 'stretch',
  },
  labelText: {
    ...Mixins.small1,
    fontWeight: '400',
    lineHeight: 18,
    color:'#ABABAB',
    alignSelf: 'flex-end',
  },
  leftList: {
    backgroundColor: 'grey',
    flexShrink: 1,
    padding: 3,
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  descText: {
    ...Mixins.small1,
    fontWeight: '500',
    lineHeight: 18,
    color:'#424141'
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  detailText: {
    ...Mixins.small1,
    color: '#424141',
  },
  valueText: {
    flexGrow: 1,
    marginLeft: 5,
    flexWrap: 'wrap',
    flexBasis:1,
    maxWidth: '65%',
  },
};
const theme = {
  ListItem: {
    containerStyle: styles.containerList,
    titleStyle: {
      color: 'red',
    },
  },
  ListItemTitle: {
    style: styles.titleText,
  },
  ListItemSubtitle: {
    style: styles.subtitleText,
  },
  Avatar: {
    size: 70,
    containerStyle: styles.avatarContainer,
    overlayContainerStyle: styles.avatarOverlay,
  },
  ListItemContent: {
    containerStyle: styles.sectionContainer,
  },
 

};
const Manifest = ({item, index, isActive, ToManifest}) => {
  let status = 'grey';
  let labelstatus = '';
  switch (item.status) {
    case 3:
      status = '#ABABAB';
      labelstatus = 'Waiting';
      break;
      case 4:
        status = '#F8B511';
        labelstatus = 'Received';
        break;
        case 5:
          status = '#F1811C';
          labelstatus = 'Processing';
          break;
          case 6:
            status = '#17B055';
            labelstatus = 'Processed'
            break;
            case 7:
              status = '#E03B3B';
              labelstatus = 'Cancelled'
              break;
              case 8:
                status = '#17B055';
                labelstatus = 'Putaway'
                break;
                case 9:
                  status = '#17B055';
                  labelstatus = 'Completed'
                  break;
              default:
      break;
  }
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}
        onPress={ToManifest}
        >
        <View style={[styles.leftList,{backgroundColor:status}]}>
        </View>
        <ListItem.Content style={styles.sectionContainer}>
        <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '55%'}]}>ETA Date</Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {moment(item.eta).format("DD-MM-YYYY")}
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '55%'}]}>Client ID  </Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {item.client}
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '55%'}]}>Inbound ID  </Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {item.inbound_number}
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '55%'}]}>Ref #   </Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
              {item.reference_id ? item.reference_id : '-'}
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '55%'}]}>Shipment type  </Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
             {item.shipment_type === 2 ? 'FCL': 'LCL'}
            </Text>
          </View>
          {item.shipment_type === 2 && (          
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '55%'}]}>Container  #  </Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
             {item.container_no}
            </Text>
          </View>)}
        <Text style={styles.descText}>{item.total_product_processed+'/'+item.total_product+' Lines Complete'}</Text>
        </ListItem.Content>
        <View style={styles.labelContainer}>
        <Badge value={labelstatus} status="warning" textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15, paddingHorizontal: 20,}} containerStyle={{alignSelf: 'flex-end',marginHorizontal: 7}} badgeStyle={{backgroundColor: status}} />
        <View style={{alignSelf:'flex-end',flexDirection: 'column', flex:1, justifyContent:'center', alignItems:'center'}}>
           
        <ListItem.Chevron
            size={16}
            color="#2D2C2C"
            containerStyle={{alignContent:'flex-end',justifyContent:'flex-end',alignItems:'flex-end',flexShrink:1,padding:0,margin:0}}
            Component={(props)=>(
              <Button
                {...props}
                type="clear"
                icon={
                  <IconArrow66Mobile height="26" width="26" fill="#2D2C2C"/>
                }
              />)}
            onPress={ToManifest}
          />
          </View>
       
        </View>
        
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
