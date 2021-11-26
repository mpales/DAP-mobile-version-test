import React from 'react';
import {ListItem, ThemeProvider} from 'react-native-elements';
import {StyleSheet, Text, View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import Mixins from '../../mixins';
// helper
import {stockTakeJobStatusColor} from '../helper/status-color';
import Format from '../helper/format';

const ListItemStockTake = ({item}) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        Component={View}
        style={styles.container}
        containerStyle={{
          borderRadius: 5,
          paddingVertical: 5,
          paddingHorizontal: 20,
        }}>
        <ListItem.Content
          style={[styles.sectionContainer, {flexDirection: 'column'}]}>
          <Text style={styles.valueText}>{Format.formatDate(item.date)}</Text>
          <Text style={styles.valueText}>{item.poId}</Text>
          <Text style={styles.valueText}>{item.client.name}</Text>
        </ListItem.Content>
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: stockTakeJobStatusColor(item.status),
            },
          ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionContainer: {
    flexGrow: 1,
  },
  titleText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#2D2C2C',
    fontWeight: '500',
  },
  statusContainer: {
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
  valueText: {
    flex: 1,
    ...Mixins.small1,
    lineHeight: 19,
    color: '#424141',
    fontWeight: '400',
    marginVertical: 2,
  },
});

const theme = {
  ListItem: {
    containerStyle: styles.containerList,
  },
  ListItemTitle: {
    style: styles.titleText,
  },
  ListItemSubtitle: {
    style: styles.subtitleText,
  },
  ListItemContent: {
    containerStyle: styles.sectionContainer,
  },
};

export default ListItemStockTake;
