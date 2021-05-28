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
import Mixins from '../../mixins';

const styles = {
  sectionContainer: {
    marginHorizontal: 14,
    paddingVertical: 12,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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

const Manifest = ({item, index, isActive, ToManifest}) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}>
        <View style={styles.leftList}>
        </View>
        <ListItem.Content style={styles.sectionContainer}>
        <ListItem.Title style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
        {item.code}
        </ListItem.Title>
        <ListItem.Subtitle style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
        {item.warehouse_code}
        </ListItem.Subtitle>
        <Text>{item.company}</Text>
        </ListItem.Content>
        <View style={{flexDirection:'column',marginHorizontal: 10, justifyContent: 'space-evenly'}}>
        <Badge value={item.status} status="warning" textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15}} containerStyle={{alignSelf: 'flex-start'}} />
        <Text style={{alignSelf:'flex-end'}}>SKU: {item.sku}</Text>
        </View>
        <ListItem.Chevron
            size={26}
            color="#2D2C2C"
            Component={(props)=>(
              <Button
                {...props}
                type="clear"
                icon={
                  <IconArrow66Mobile height="16" width="26" fill="#2D2C2C"/>
                }
              />)}
            onPress={ToManifest}
          />
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
