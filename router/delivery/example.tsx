/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// @ts-ignore
import Carousel from '../../component/carousel/carousel';

const Slider = () => {
  return (
    <View style={styles.container}>
      <Carousel
        width={300}
        height={300}
        onScroll={() => console.log('on scroll view')}
        onScrollBegin={() => console.log('scroll begin')}
        onPageChange={(page) => console.log('scroll change', page)}>
        <View style={styles.contentContainer}>
          <Text>Page 1</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text>Page 2</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text>Page 3</Text>
        </View>
      </Carousel>
    </View>
  );
};
export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    borderWidth: 2,
    borderColor: '#CCC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
