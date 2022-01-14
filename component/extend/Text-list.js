import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Mixins from '../../mixins';

export const TextList = ({title, value, color, isBold}) => (
  <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
    <View style={{width: 100}}>
      <Text
        style={
          !!isBold ? [styles.titleText, {fontWeight: '700'}] : styles.titleText
        }>
        {title}
      </Text>
    </View>
    <Text style={styles.separatorText}>:</Text>
    {!!color ? (
      <Text style={[styles.valueText, {color: color, marginLeft: 10}]}>
        {value}
      </Text>
    ) : (
      <>
        {title.toLowerCase() === 'barcode' ? (
          <Text style={styles.valueText}>
            {Array.isArray(value) ? (
              <>
                {value.length > 0
                  ? value.map((data, index) =>
                      index + 1 === value.length ? data : `${data} \n`,
                    )
                  : '-'}
              </>
            ) : !!value ? (
              value
            ) : (
              '-'
            )}
          </Text>
        ) : (
          <Text
            style={
              !!isBold
                ? [styles.valueText, {fontWeight: '700'}]
                : styles.valueText
            }>
            {!!value ? value : '-'}
          </Text>
        )}
      </>
    )}
  </View>
);

export const TextListBig = ({title, value, fontSize}) => (
  <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
    <View>
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
      quantityArr = value.split('/');
    } else {
      quantityArr = value.toString().split('-');
    }
  }
  return (
    <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
      <View style={{width: 100}}>
        <Text
          style={
            title.includes('Grade')
              ? [styles.titleText, {fontWeight: '700'}]
              : styles.titleText
          }>
          {title}
        </Text>
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
            title.includes('Quantity') || title.includes('Grade')
              ? [styles.valueText, {color: '#E03B3B', fontWeight: 'bold'}]
              : styles.valueText
          }>
          {title === 'Grade' ? value.toUpperCase() : value}
        </Text>
      )}
    </View>
  );
};

export const NavigateTextList = ({title, value, navigate}) => (
  <View style={{flexDirection: 'row', flexShrink: 1, marginVertical: 5}}>
    <View style={{width: 100}}>
      <Text style={styles.titleText}>{title}</Text>
    </View>
    <Text style={styles.separatorText}>:</Text>
    <TouchableOpacity onPress={navigate}>
      <Text
        style={{
          ...styles.valueText,
          color: '#E03B3B',
          textDecorationLine: 'underline',
        }}>
        {`${value} Report(s)`}
      </Text>
    </TouchableOpacity>
  </View>
);

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
