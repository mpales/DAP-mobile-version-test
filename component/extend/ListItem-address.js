import React, {PureComponent} from 'react';
import {ListItem, Button, Text} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconTime2Mobile from '../../assets/icon/iconmonstr-time-2 1mobile.svg';
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import IconDelivery6Mobile from '../../assets/icon/iconmonstr-delivery-6mobile.svg';
// helper
import Mixins from '../../mixins';
import {deliveryStatusColor} from '../helper/status-color';
import FormatHelper from '../helper/format';

class ListItemAddress extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {item, index, navigation} = this.props;
    return (
      <ListItem
        key={index}
        Component={TouchableScale}
        onPress={() => navigation(index)}
        friction={90}
        tension={100}
        activeScale={0.95}
        containerStyle={styles.listItemContainer}>
        <ListItem.Title style={styles.titleText}>{item.named}</ListItem.Title>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={[
              styles.deliveryIconContainer,
              {backgroundColor: deliveryStatusColor(item.status)},
            ]}>
            <IconDelivery6Mobile height="35" width="35" fill="#fff" />
          </View>
          <ListItem.Content style={{marginLeft: 10}}>
            <View style={styles.listItemTitle}>
              <Button
                title={FormatHelper.ETATime2Current(
                  item.durationAPI,
                 0,
                )}
                type="clear"
                icon={() => (
                  <IconTime2Mobile height="15" width="15" fill="#ABABAB" />
                )}
                disabledStyle={{
                  paddingVertical: 1,
                  paddingHorizontal: 0,
                }}
                disabledTitleStyle={{
                  ...Mixins.small3,
                  marginLeft: 9,
                  lineHeight: 15,
                  fontWeight: '400',
                  color: '#000000',
                }}
                disabled={true}
              />
              <Button
                title={item.deliveryStatus}
                disabledTitleStyle={styles.statusText}
                disabledStyle={[
                  styles.status,
                  {backgroundColor: deliveryStatusColor(item.status)},
                ]}
                disabled={true}
              />
            </View>
            <ListItem.Subtitle style={styles.distance}>
               {"Distance "+FormatHelper.calculateDistance(item.distanceAPI)} Km
            </ListItem.Subtitle>
            <Text style={styles.eta}>
              {"ETA : "+FormatHelper.formatETATime(item.durationAPI, 0)}
            </Text>
            {/* <View style={styles.detail}>
              <Text style={styles.labelDetail}>Packages</Text>
              <Text style={styles.labelInfo}>{item.packages}</Text>
            </View> */}
            <View style={[styles.legend, {width: '100%'}]}>
              <View style={styles.legendLabel}>
                <Text style={styles.label}>{"To"}</Text>
              </View>
              <View style={styles.legendInfo}>
                <Text style={styles.info}>
                  {item.Address}, {"-"}
                </Text>
              </View>
            </View>
            <View style={styles.rightList}>
              <IconArrow66Mobile height="20" width="20" fill="#6C6B6B" />
            </View>
          </ListItem.Content>
        </View>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  listItemContainer: {
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    flexDirection: 'column',
    alignItems: 'flex-start',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  listItemTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
    ...Mixins.subtitle3,
    lineHeight: 15,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 3,
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
    paddingRight: 20,
  },
  label: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#424141',
  },
  info: {
    ...Mixins.small3,
    lineHeight: 12,
    color: '#000000',
  },
  distance: {
    ...Mixins.small3,
    lineHeight: 15,
    color: '#424141',
    fontWeight: '400',
  },
  eta: {
    ...Mixins.small3,
    fontWeight: '400',
    lineHeight: 15,
    color: '#424141',
    marginBottom: 3,
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
  deliveryIconContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#F1811C',
  },
  status: {
    paddingVertical: 0,
  },
  statusText: {
    ...Mixins.small3,
    color: '#FFF',
    fontSize: 10,
    lineHeight: 14,
  },
  flexEnd: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rightList: {
    position: 'absolute',
    right: 0,
  },
});

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

export default ListItemAddress;
