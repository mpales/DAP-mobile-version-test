import React from 'react';
import {ListItem, ThemeProvider} from 'react-native-elements';
import {StyleSheet, Text, View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import Mixins from '../../mixins';
// helper
import {stockTakeJobStatusColor} from '../helper/status-color';
import {stockTakeJobStatus} from '../helper/string';
import Format from '../helper/format';

const ListItemStockTake = ({item, navigate}) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        Component={TouchableScale}
        onPress={() => navigate(item)}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}
        style={{paddingHorizontal: 20, marginBottom: 10}}>
        <View
          style={[
            styles.leftList,
            {
              backgroundColor: stockTakeJobStatusColor(
                stockTakeJobStatus(item.status),
              ),
            },
          ]}
        />
        <ListItem.Content
          style={[styles.sectionContainer, {flexDirection: 'column'}]}>
          <Text style={styles.valueText}>{Format.formatDate(item.date)}</Text>
          <Text style={styles.valueText}>{`JOB ID ${item.jobId}`}</Text>
          <Text style={styles.valueText}>{item.client.name}</Text>
          <Text style={styles.valueText}>{item.client.code}</Text>
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
              backgroundColor: stockTakeJobStatusColor(
                stockTakeJobStatus(item.status),
              ),
            },
          ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginHorizontal: 14,
    paddingVertical: 12,
    flexGrow: 1,
  },
  titleText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#2D2C2C',
    fontWeight: '500',
  },
  statusContainer: {
    position: 'absolute',
    right: 14,
    top: 12,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  statusText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#FFF',
    fontWeight: '400',
  },
  subtitleText: {
    marginVertical: 2,
    color: '#6C6B6B',
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
  containerList: {
    marginHorizontal: 0,
    marginVertical: 6,
    padding: 0,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  leftList: {
    backgroundColor: 'grey',
    flexShrink: 1,
    padding: 3,
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  valueText: {
    flex: 1,
    ...Mixins.small1,
    lineHeight: 18,
    color: '#424141',
    fontWeight: '400',
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
};

export default ListItemStockTake;
