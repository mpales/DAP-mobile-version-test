import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import mixins from '../../mixins';

const DetailItemList = ({title, value, report, labelStyle}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.detailText, {width: '40%'}, labelStyle]}>{title}</Text>
      <Text style={styles.detailText}>:</Text>
      <Text
        style={
          report
            ? [
                styles.detailText,
                styles.valueText,
                {
                  color: '#E03B3B',
                },
              ]
            : [styles.detailText, styles.valueText]
        }>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  detailText: {
    ...mixins.subtitle3,
    color: '#6C6B6B',
  },
  valueText: {
    flexGrow: 1,
    marginLeft: 5,
    flexWrap: 'wrap',
    flexBasis:1,
    maxWidth: '65%',
  },
});

export default DetailItemList;
