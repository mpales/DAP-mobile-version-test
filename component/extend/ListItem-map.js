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

const BadgedIcon = withBadge((props) => {
  return {bottom: props.value};
})(IconCursor20Mobile);

const styles = {
  sectionContainer: {
    marginHorizontal: 21,
    padding: 0,
  },
  avatarContainer: {},
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
    color: '#6C6B6B',
  },
  containerList: {
    marginHorizontal: 0,
    padding: 0,
    marginBottom: 0,
  },
  legend: {
    flexDirection: 'row',
  },
  label: {
    color: '#C4C4C4',
  },
  info: {
    color: '#000000',
  },
  eta: {
    fontSize: 10,
    color: '#424141',
    textAlign: 'center',
  },
  detail: {
    flexDirection: 'row',
  },
  labelDetail: {
    color: '#6C6B6B',
    marginRight: 5,
  },
  labelInfo: {
    color: '#000000',
  },
  legendLabel: {
    marginRight: 8,
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
  rightList: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  badgeDeliver: {
    paddingVertical: 2,
    paddingHorizontal: 16,
  },
  buttonDeliver: {
    paddingVertical: 12,
  },
};
const Manifest = ({item, index, drag, isActive}) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        onLongPress={drag}
        containerStyle={{
          paddingHorizontal: 28,
          paddingVertical: 15,
          borderBottomWidth: isActive ? 0 : 1,
          borderBottomColor: '#ABABAB',
          backgroundColor: isActive ? '#cccccc' : 'transparent',
        }}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}>
        <TouchableOpacity style={styles.leftList}>
          <Text
            style={{fontWeight: '600', color: '#424141', textAlign: 'center'}}>
            {item.label}
          </Text>
          <Button
            icon={() => (
              <IconCursor20Mobile height="9" width="15" fill="#6C6B6B" />
            )}
            onLongPress={drag}
            type="clear"
          />
        </TouchableOpacity>
        <ListItem.Content>
          <ListItem.Title style={{color: '#000000', fontWeight: '600'}}>
            {item.label}
          </ListItem.Title>
          <ListItem.Subtitle style={{color: '#6C6B6B', fontWeight: '400'}}>
            {item.label}
          </ListItem.Subtitle>
          <View style={styles.legend}>
            <View style={styles.legendLabel}>
              <Text style={styles.label}>Current</Text>
              <Text style={styles.label}>To</Text>
            </View>
            <View style={styles.legendInfo}>
              <Text style={styles.info}>Chinese town no.23</Text>
              <Text style={styles.info}>Chinese town no.23</Text>
            </View>
          </View>
        </ListItem.Content>
        <View style={styles.rightList}>
          <Text style={styles.eta}>ETA : 30 minute</Text>
          <Button
            title="01.00-2.00 p.m"
            type="clear"
            titleStyle={{marginLeft: 9, fontSize: 10, color: '#000000'}}
            icon={() => (
              <IconTime2Mobile height="15" width="15" fill="#ABABAB" />
            )}
          />
          <ListItem.Chevron size={26} color="#2D2C2C" />
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
