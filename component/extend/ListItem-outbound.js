import React from 'react';
import {ListItem, ThemeProvider, Text} from 'react-native-elements';
import {View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import Mixins from '../../mixins';
// helper
import Format from '../helper/format';
import {pickTaskStatus} from '../helper/string';
import {pickTaskStatusColor} from '../helper/status-color';

const ListItemOutbound = ({item, index, isActive, ToManifest}) => {
  let warehouses =
    item.warehouses !== undefined ? item.warehouses.join() : null;

  const TextList = ({title, value}) => {
    return (
      <View style={{flexDirection: 'row', flex: 1, marginBottom: 3}}>
        <View style={{width: 100, flexDirection: 'row'}}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={styles.separatorText}>:</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', flexShrink: 1}}>
          <Text style={styles.valueText}>{value ?? '-'}</Text>
        </View>
      </View>
    );
  };

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
          <TextList
            title="Date"
            value={
              typeof item.delivery_date === 'string'
                ? Format.formatDate(item.delivery_date)
                : '-'
            }
          />
          <TextList title="Pick Task ID" value={item.pick_task_no} />
          <TextList title="Warehouse" value={warehouses} />
          <TextList title="Client Code" value={item.client_id} />
          <TextList
            title="Type"
            value={item.type === 1 ? 'Single' : 'Multiple'}
          />
        </ListItem.Content>
        <ListItem.Chevron
          size={16}
          color="#2D2C2C"
          containerStyle={styles.chevronContainer}
          Component={() => (
            <IconArrow66Mobile height="26" width="26" fill="#2D2C2C" />
          )}
        />
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: pickTaskStatusColor(item.status),
            },
          ]}>
          <Text style={styles.badgeText}>{pickTaskStatus(item.status)}</Text>
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

const styles = {
  sectionContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    marginHorizontal: 14,
    paddingVertical: 10,
  },
  titleText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#2D2C2C',
    fontWeight: '500',
  },
  separatorText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#6C6B6B',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    paddingHorizontal: 8,
  },
  valueText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#424141',
    fontWeight: '400',
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
    backgroundColor: 'red',
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
    color: '#FFF',
    textAlign: 'center',
  },
  chevronContainer: {
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexShrink: 1,
    padding: 0,
    margin: 0,
    marginRight: 5,
  },
  statusContainer: {
    width: 100,
    position: 'absolute',
    right: 14,
    top: 10,
    borderRadius: 5,
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
