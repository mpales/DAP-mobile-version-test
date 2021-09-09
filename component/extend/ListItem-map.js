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
import FormatHelper from '../helper/format';

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
    ...Mixins.small3,
    lineHeight: 12,
    color: '#C4C4C4',
  },
  info: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#000000',
  },
  eta: {
    ...Mixins.small3,
    fontWeight: '400',
    lineHeight: 15,
        color: '#424141',
    textAlign: 'center',
  },
  detail: {
    flexDirection: 'row',
  },
  labelDetail: {
    ...Mixins.small3,
    fontWeight: '400',
    lineHeight: 15,
    color: '#6C6B6B',
    marginRight: 5,
  },
  labelInfo: {
    ...Mixins.small3,
    fontWeight: '400',
    lineHeight: 15,
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
const Manifest = ({item, index, drag, isActive, navigation}) => {

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
        <View style={styles.leftList}>
          <Text
            style={{...Mixins.body3,lineHeight: 18,fontWeight: '600', color: '#424141', textAlign: 'center'}}>
            {index+1}
          </Text>
        </View>
        <ListItem.Content>
        <ListItem.Title style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
        {item.named}
          </ListItem.Title>
          <ListItem.Subtitle style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          Distant Location {FormatHelper.calculateDistance(item.distanceAPI)} Km
          </ListItem.Subtitle>
          <View style={styles.legend}>
            <View style={styles.legendLabel}>
              <Text style={styles.label}>To</Text>
            </View>
            <View style={styles.legendInfo}>
              <Text style={styles.info}>{item.Address}</Text>
            </View>
          </View>
        </ListItem.Content>
        <View style={styles.rightList}>
          <Text style={styles.eta}>ETA : {' '}
              {FormatHelper.formatETATime(item.durationAPI, 0)}</Text>
          <Button
            title={FormatHelper.ETATime2Current(
              item.durationAPI,
            0,
            )}
            type="clear"
            titleStyle={{marginLeft: 9, fontSize: 10, color: '#000000'}}
            icon={() => (
              <IconTime2Mobile height="15" width="15" fill={"#ABABAB"} />
            )}
          />
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
            onPress={() => navigation(index)}
          />
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
