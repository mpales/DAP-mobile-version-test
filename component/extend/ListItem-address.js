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
  let secDiffinTraffic = item.duration_in_trafficAPI - item.durationAPI;
  let translateFromTraffic = item.chrono + secDiffinTraffic;
  var durationAPI = "";
  if (translateFromTraffic >= 3600) durationAPI += Math.floor(translateFromTraffic / 3600) + "h";
  translateFromTraffic %= 3600;
  if (translateFromTraffic >= 60) durationAPI += Math.floor(translateFromTraffic / 60) + "m";
  translateFromTraffic %= 60;
  durationAPI += Math.round(translateFromTraffic) + "s";
  
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        onLongPress={drag}
        containerStyle={{
          paddingHorizontal: 35,
          paddingVertical: 23,
          borderBottomWidth: isActive ? 0 : 1,
          borderBottomColor: '#ABABAB',
          backgroundColor: isActive ? '#cccccc' : 'transparent',
        }}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}>
        <TouchableOpacity style={styles.leftList}>
          <Text
            style={{...Mixins.body3,lineHeight: 18,fontWeight: '600', color: '#424141', textAlign: 'center'}}>
            {index}
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
          <ListItem.Title style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
            {index}
          </ListItem.Title>
          <ListItem.Subtitle style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
            Distant Location {item.distance} Km
          </ListItem.Subtitle>
          <Text style={styles.eta}>ETA : {(item.hasOwnProperty('durationAPI') ?  durationAPI : item.eta)}</Text>
          <View style={styles.detail}>
            <Text style={styles.labelDetail}>Packages</Text>
            <Text style={styles.labelInfo}>3 box</Text>
          </View>
          <View style={styles.legend}>
            <View style={styles.legendLabel}>
              <Text style={styles.label}>Current</Text>
              <Text style={styles.label}>To</Text>
            </View>
            <View style={styles.legendInfo}>
            <Text style={styles.info}>{item.current}</Text>
              <Text style={styles.info}>{item.to}</Text>
            </View>
          </View>

          <Button
            containerStyle={{marginTop: 12}}
            titleStyle={{...Mixins.small3,lineHeight:12}}
            buttonStyle={{
              paddingHorizontal: 34,
              paddingVertical: 6,
              backgroundColor: '#2A3386',
            }}
            title="Start Delivering"
          />
        </ListItem.Content>
        <View style={styles.rightList}>
          <Badge
            value="delivering"
            status="warning"
            badgeStyle={{paddingHorizontal: 16, height: 16}}
            textStyle={{...Mixins.small3,lineHeight: 12,}}
          />
          <Button
            title={item.hour}
            type="clear"
            titleStyle={{...Mixins.small3, marginLeft: 9,lineHeight: 15, fontWeight: '400', color: '#000000'}}
            icon={() => (
              <IconTime2Mobile height="15" width="15" fill="#ABABAB" />
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
            onPress={() => navigation.navigate('Navigation')}
          />
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
