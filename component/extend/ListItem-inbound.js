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
    justifyContent: 'space-evenly',
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
    fontWeight: '400',
    lineHeight: 18,
    color:'#ABABAB'
  }
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
        status = '#F1811C';
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
              labelstatus = 'Reported'
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
        pad={0}>
        <View style={[styles.leftList,{backgroundColor:status}]}>
        </View>
        <ListItem.Content style={styles.sectionContainer}>
        <ListItem.Title style={{...Mixins.body3,lineHeight: 18,color: '#ABABAB', fontWeight: '600'}}>
        {moment(item.eta).format("DD-MM-YYYY")}
        </ListItem.Title>
        <ListItem.Subtitle style={{...Mixins.body1, lineHeight: 21, color: '#424141', fontWeight: '600'}}>
        {item.reference_id}
        </ListItem.Subtitle>
        <Text style={styles.descText}>{item.client}</Text>
        <Text style={styles.descText}>{item.total_product_processed+'/'+item.total_product+' Lines Complete'}</Text>
        </ListItem.Content>
        <View style={styles.labelContainer}>
        <Badge value={labelstatus} status="warning" textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15, paddingHorizontal: 20,}} containerStyle={{alignSelf: 'flex-end',marginHorizontal: 7}} badgeStyle={{backgroundColor: status}} />
        <View style={{alignSelf:'flex-end',flexDirection: 'column'}}>
           
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
