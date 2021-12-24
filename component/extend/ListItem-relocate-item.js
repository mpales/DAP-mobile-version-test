import React from 'react';
import {ListItem, ThemeProvider} from 'react-native-elements';
import {StyleSheet, Text, View} from 'react-native';
import Mixins from '../../mixins';
// component
import {TextList} from './Text-list';
// helper
import {productGradeToString} from '../helper/string';

const ListitemRelocate = ({item}) => {
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
          <TextList title="Location" value={item.warehouse.locationId} />
          <TextList title="Client" value={item.client.name} />
          <TextList title="Item Code" value={item.product.item_code} />
          <TextList title="Description" value={item.product.description} />
          <TextList title="Quantity" value={item.quantity} />
          <TextList title="UOM" value={item.productUom.packaging} />
          <TextList title="Grade" value={productGradeToString(item.grade)} />
        </ListItem.Content>
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

export default ListitemRelocate;
