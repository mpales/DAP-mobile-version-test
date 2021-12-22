import React from 'react';
import {ListItem, ThemeProvider, Text} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import Mixins from '../../mixins';
// component
import {TextList} from './Text-list';
// helper
import {productGradeToString} from '../helper/string';

const ListItemRelocationResult = ({item, navigate}) => {
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        Component={TouchableScale}
        onPress={() => navigate(item)}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}
        style={{marginBottom: 10}}>
        <ListItem.Content
          style={[styles.sectionContainer, {flexDirection: 'column'}]}>
          <TextList title="Client" value={item.client.name} />
          <TextList title="Item Code" value={item.product.item_code} />
          <TextList title="Description" value={item.product.description} />
          <TextList title="Quantity" value={item.quantity} />
          <TextList title="UOM" value={item.productUom.packaging} />
          <TextList title="Grade" value={productGradeToString(item.grade)} />
        </ListItem.Content>
        <ListItem.Chevron
          size={16}
          color="#2D2C2C"
          containerStyle={styles.chevronContainer}
          Component={() => (
            <IconArrow66Mobile height="26" width="26" fill="#2D2C2C" />
          )}
        />
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
  contentTitle: {
    ...Mixins.subtitle3,
    fontWeight: 'bold',
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
    flex: 1,
    ...Mixins.small1,
    lineHeight: 18,
    color: '#424141',
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
    color: '#ABABAB',
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
    ...Mixins.small1,
    fontWeight: '400',
    lineHeight: 18,
    color: '#ABABAB',
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

export default ListItemRelocationResult;
