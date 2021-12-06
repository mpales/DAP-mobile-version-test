import React, {PureComponent} from 'react';
import {ListItem, ThemeProvider, Button, Text} from 'react-native-elements';
import {View, TouchableOpacity} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconTime2Mobile from '../../assets/icon/iconmonstr-time-2 1mobile.svg';
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
// helper
import Mixins from '../../mixins';
import {deliveryStatusColor} from '../helper/status-color';
import FormatHelper from '../helper/format';

class ListAddressMap extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {item, index, drag, isActive, navigation} = this.props;
    return (
      <ThemeProvider theme={theme}>
        <ListItem
          key={index}
          Component={TouchableScale}
          onPress={() => navigation(index)}
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
              style={{
                ...Mixins.body3,
                lineHeight: 18,
                fontWeight: '600',
                color: '#424141',
                textAlign: 'center',
              }}>
              {index + 1 > 9 ? index + 1 : `0${index + 1}`}
            </Text>
          </TouchableOpacity>
          <ListItem.Content>
            <ListItem.Title
              style={{
                ...Mixins.subtitle3,
                lineHeight: 21,
                color: '#000000',
                fontWeight: '600',
              }}>
              {item.named}
            </ListItem.Title>
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
                title={item.status}
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
          </ListItem.Content>
          <View style={styles.rightList}>
            <IconArrow66Mobile height="16" width="26" fill="#2D2C2C" />
          </View>
        </ListItem>
      </ThemeProvider>
    );
  }
}

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
    textAlign: 'center',
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
  listItemTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    right: 10,
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

export default ListAddressMap;
