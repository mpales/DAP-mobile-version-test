import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {ListItem, Avatar, ThemeProvider, Badge} from 'react-native-elements';
import Mixins from '../../mixins';
const window = Dimensions.get('window');
const styles = {
  sectionContainer: {
    marginHorizontal: 21,
    padding: 0,
    flexGrow: 1,
  },
  avatarContainer: {
  },
  avatarOverlay: {
    backgroundColor: '#E7E8F2',
    borderRadius: 10,
  },
  titleText: {
    ...Mixins.subtitle3,
   color: '#000000',
   lineHeight: 21,
  },
  subtitleText: {
    ...Mixins.body3,
    color: '#000000',
    lineHeight: 18,
    marginVertical: 2,
  },
  containerList: {
    marginHorizontal: 0,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 20,
    flexDirection: 'column',
    flex: 0.5,
  },
  selfContainer : {
    backgroundColor: '#E7E8F2',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'flex-start',
  },
  otherContainer : {
    backgroundColor: '#414993',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'flex-end',
  },
  rightList: {
    flexShrink: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  indicatorTime: {
    ...Mixins.body3,
    fontWeight: '400',
    lineHeight: 18,
  },
};
const theme = {
  ListItem: {
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
const Manifest = ({item, index}) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItem key={index} containerStyle={[styles.containerList,
        item.role > 0 ? styles.otherContainer : styles.selfContainer]}>
        <ListItem.Content>
          <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
        </ListItem.Content>
        <View style={styles.rightList}>
          <Text style={styles.indicatorTime}>{item.timestamp}</Text>
          </View>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
