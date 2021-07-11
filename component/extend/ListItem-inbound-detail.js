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
    flexGrow: 1,
    marginHorizontal: 14,
    paddingVertical: 10,
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
    marginVertical: 8,
    marginHorizontal: 0,
    padding: 0,
    marginBottom: 0,
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
const Manifest = ({item, index, drag, isActive}) => {
  let status = 'grey';
  if(item.scanned < item.total_package) {
    if(item.scanned === 0) {
      status = 'grey';
    } else {
      status = 'orange'
    }
  } else {
    status = 'green';
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
          <Text style={{...Mixins.subtitle3,fontWeight: '600',lineHeight: 21,color:'#6C6B6B'}}>
            {item.category}
          </Text>
        <ListItem.Title style={{...Mixins.subtitle3,lineHeight: 21,color: '#6C6B6B', fontWeight: '600'}}>
        {item.name}
        </ListItem.Title>
        <ListItem.Subtitle style={{...Mixins.small3, lineHeight: 18, color: '#D5D5D5', fontWeight: '400'}}>
         {moment.unix(item.timestamp).format('DD-MMM-Y')}
        </ListItem.Subtitle>
        </ListItem.Content>
        <View style={styles.rightList}>
          <View style={styles.containerPackage}>
          <Text style={styles.inboundPackage}>
            {item.total_package + ' box'}
          </Text>
          </View>
          <View style={styles.containerUser}>
          <Text style={styles.inboundUser}>
          Checked by : Adam
          </Text>
          </View>
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
