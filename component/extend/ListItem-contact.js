import React from 'react';
import {View, Text} from 'react-native';
import {ListItem, Avatar, ThemeProvider, Badge} from 'react-native-elements';
import Mixins from '../../mixins';


const styles = {
  sectionContainer: {
    marginHorizontal: 21,
    padding: 0,
  },
  avatarContainer: {
  },
  avatarOverlay: {
    backgroundColor: '#E7E8F2',
    borderRadius: 100,
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
    padding: 0,
    marginBottom: 18,
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
const Manifest = ({item, index, toContact}) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItem key={index} onPress={toContact}>
        <Avatar size={50} containerStyle={styles.avatarContainer} overlayContainerStyle={styles.avatarOverlay} source={{uri: item.avatar_url}} />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
