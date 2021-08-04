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
import {useSelector} from 'react-redux';
import Mixins from '../../mixins';

const styles = {
  sectionContainer: {
    flexGrow: 1,
    marginHorizontal: 20,
    paddingVertical: 10,
    flexDirection:'column',
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
    marginVertical: 4,
    marginHorizontal: 0,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  rightList: {
    flexDirection: 'column',
    flexShrink: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    alignSelf: 'stretch',
  },
  containerUser: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  inboundUser: {
    ...Mixins.subtitle3,
    color:'#D5D5D5',
    fontWeight: '400',
    lineHeight: 18,
    alignSelf: 'flex-end',
  },
  containerPackage: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  inboundPackage: {
    ...Mixins.subtitle3,
    color:'#D5D5D5',
    fontWeight: '600',
    lineHeight: 21,
  alignSelf: 'flex-end',
  },
  inboundText: {
...Mixins.small1,
fontWeight: '400',
lineHeight: 18,
  },
  
  leftList: {
    backgroundColor: 'grey',
    flexShrink: 1,
    padding: 3,
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight:'400',
    color: '#ffffff',
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
const Manifest = ({item, index, ToManifest}) => {
  let status = 'grey';
  switch (item.status) {
    case 'complete':
      status = 'green';
      break;
      case 'progress':
        status = 'orange';
        break;
        case 'pending':
          status = 'grey';
          break;
          case 'reported':
            status = 'red';
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
                    <Text style={{...Mixins.small1,lineHeight: 18,color: '#ABABAB', fontWeight: '400'}}>
                    25-07-2021
                    </Text>
                    <Text style={{...Mixins.body1,lineHeight: 21,color: '#424141', fontWeight: '600'}}>
                        {item.number}
                    </Text>
                    <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '400'}}>
                    {item.transport}
                    </Text>
                    <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '400'}}>
                    30/50 Lines Complete
                    </Text>
    
        </ListItem.Content>
        <View style={{flexDirection: 'column', paddingHorizontal: 10}}>
        <Badge value={item.status} status="warning" textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15, paddingHorizontal: 20,}} containerStyle={{alignSelf: 'flex-end',marginHorizontal: 7}} badgeStyle={{backgroundColor: status}} />
            <ListItem.Chevron
                  size={16}
                  color="#2D2C2C"
                  containerStyle={{alignSelf: 'flex-end', flexShrink:1, paddingHorizontal:0}}
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
            <Badge value={item.category} status="warning" textStyle={{...Mixins.small3,fontWeight: '700',lineHeight: 15, paddingHorizontal: 20,}} containerStyle={{alignSelf: 'flex-end'}} badgeStyle={{backgroundColor: '#121C78'}} />
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
