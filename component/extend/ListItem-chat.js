import React from 'react';
import {View, Text} from 'react-native';
import {ListItem, Avatar, ThemeProvider, Badge} from 'react-native-elements';

const styles = {
  sectionContainer: {
    marginHorizontal: 21,
    padding: 0,
  },
  avatarContainer: {
  },
  avatarOverlay: {
    backgroundColor: '#E7E8F2',
    borderRadius: 10,
  },
  titleText: {
    color: '#6C6B6B',
    fontWeight: '600',
  },
  subtitleText: {
    marginVertical: 2,
    color: '#ABABAB',
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
const Manifest = ({item, index}) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItem key={index}>
        <Avatar size={50} rounded source={{uri: item.avatar_url}} />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.desc}</ListItem.Subtitle>
        </ListItem.Content>
        <View style={styles.rightList}>
          <Text style={styles.indicatorTime}>{item.last_timestamp}</Text>
          <Badge value={item.unread} status="warning" />
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
