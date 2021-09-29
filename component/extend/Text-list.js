import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Mixins from '../../mixins';

export const TextList = ({title, value}) => (
  <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
    <View style={{width: 100}}>
      <Text style={styles.titleText}>{title}</Text>
    </View>
    <Text style={styles.separatorText}>:</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

export const TextListBig = ({title, value, fontSize}) => (
  <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
    <View style={{width: 100}}>
      <Text
        style={
          fontSize === undefined
            ? styles.titleTextBig
            : [styles.titleText, {fontSize: fontSize}]
        }>
        {title}
      </Text>
    </View>
    <Text style={styles.separatorText}>:</Text>
    <Text
      style={
        fontSize === undefined
          ? styles.titleTextBig
          : [styles.titleText, {fontSize: fontSize}]
      }>
      {value}
    </Text>
  </View>
);

export const CustomTextList = ({title, value, separateQuantity}) => {
  let quantityArr = [];
  if (separateQuantity) {
    if (typeof value === 'string') {
      quantityArr = value.split('-');
    } else {
      quantityArr = value.toString().split('-');
    }
  }
  return (
    <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
      <View style={{width: 100}}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <Text style={styles.separatorText}>:</Text>
      {separateQuantity ? (
        <>
          <Text style={[styles.valueText, styles.valueTextRedBold, {flex: 0}]}>
            {quantityArr[0]}
          </Text>
          <Text style={[styles.valueText, {flex: 0}]}>{` -> `}</Text>
          <Text style={[styles.valueText, styles.valueTextRedBold, {flex: 0}]}>
            {quantityArr[quantityArr.length - 1]}
          </Text>
        </>
      ) : (
        <Text
          style={
            title === 'Quantity' || (title === 'Grade' && value === 'expired')
              ? [styles.valueText, {color: '#E03B3B', fontWeight: 'bold'}]
              : styles.valueText
          }>
          {title === 'Grade' ? value.toUpperCase() : value}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#2D2C2C',
    fontWeight: '500',
  },
  titleTextBig: {
    ...Mixins.subtitle1,
    fontSize: 18,
    lineHeight: 25,
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
  valueTextRedBold: {
    fontWeight: 'bold',
    color: '#E03B3B',
  },
});
