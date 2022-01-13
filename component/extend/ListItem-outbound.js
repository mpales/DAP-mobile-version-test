import React from 'react';
import {
  ListItem,
  ThemeProvider,
  Badge,
  Button,
  Text,
} from 'react-native-elements';
import {View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import Mixins from '../../mixins';
import moment from 'moment';
// helper
import {pickTaskStatus} from '../helper/string';
import {pickTaskStatusColor} from '../helper/status-color';

const ListItemOutbound = ({item, index, isActive, ToManifest}) => {
  let warehouses =
    item.warehouses !== undefined ? item.warehouses.join() : null;

  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}
        onPress={ToManifest}>
        <View
          style={[
            styles.leftList,
            {backgroundColor: pickTaskStatusColor(item.status)},
          ]}></View>
        <ListItem.Content style={styles.sectionContainer}>
          <Text style={styles.descText}>
            {moment(item.delivery_date).format('DD MMMM YYYY')}
          </Text>
          <ListItem.Title>{item.pick_task_no}</ListItem.Title>
          <ListItem.Subtitle>{'Warehouse ' + warehouses}</ListItem.Subtitle>
          <Text style={styles.descText}>{item.client_id}</Text>
          <Text style={styles.descText}>
            {'Type : ' + (item.type === 1 ? 'Single' : 'Multiple')}
          </Text>
        </ListItem.Content>
        <View style={styles.labelContainer}>
          <Badge
            value={pickTaskStatus(item.status)}
            textStyle={styles.badgeText}
            containerStyle={{
              alignSelf: 'flex-end',
              marginHorizontal: 7,
            }}
            badgeStyle={{
              backgroundColor: pickTaskStatusColor(item.status),
              borderRadius: 5,
            }}
          />
          <View style={{alignSelf: 'flex-end', flexDirection: 'column'}}>
            <ListItem.Chevron
              size={16}
              color="#2D2C2C"
              containerStyle={styles.chevronButton}
              Component={(props) => (
                <Button
                  {...props}
                  type="clear"
                  icon={
                    <IconArrow66Mobile height="26" width="26" fill="#2D2C2C" />
                  }
                />
              )}
              onPress={ToManifest}
            />
          </View>
          <Text style={[styles.labelText, {marginHorizontal: 20}]}>
            packages: -
          </Text>
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

const styles = {
  sectionContainer: {
    marginHorizontal: 14,
    paddingVertical: 12,
    flexGrow: 1,
  },
  titleText: {
    ...Mixins.body3,
    lineHeight: 18,
    color: '#424141',
    fontWeight: '700',
  },
  subtitleText: {
    ...Mixins.body3,
    fontWeight: '400',
    lineHeight: 18,
    color: '#424141',
  },
  containerList: {
    marginHorizontal: 0,
    marginVertical: 6,
    padding: 0,
    marginBottom: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  labelContainer: {
    flexShrink: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginHorizontal: 0,
    marginVertical: 10,
    padding: 3,
    alignSelf: 'stretch',
  },
  labelText: {
    ...Mixins.small1,
    fontWeight: '400',
    lineHeight: 18,
    color: '#424141',
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
    ...Mixins.body3,
    fontWeight: '400',
    lineHeight: 18,
    color: '#424141',
  },
  badgeText: {
    ...Mixins.small3,
    fontWeight: '400',
    lineHeight: 15,
    paddingHorizontal: 20,
  },
  chevronButton: {
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexShrink: 1,
    padding: 0,
    margin: 0,
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

export default ListItemOutbound;
