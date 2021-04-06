import React from 'react';
import {Avatar, Text, Button} from 'react-native-elements';
import {View} from 'react-native';
import IconPaperMobile from '../../../assets/icon/iconmonstr-paper-plane-2mobile.svg';
import IconSpeechMobile from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconVector from '../../../assets/icon/Vector.svg';

class Example extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 25}}>
        <View style={styles.sectionHeadPackage}>
          <Text style={styles.headTitle}>Name</Text>
          <Text style={styles.headSubtitle}>#323344567553</Text>
        </View>
        <View style={styles.sectionLegend}>
          <View style={styles.sectionMarker}>
            <Avatar
              size="small"
              rounded
              containerStyle={styles.markerPoint}
              title="A"
              overlayContainerStyle={{backgroundColor: '#F1811C'}}
            />
            <Text style={styles.legendLabel}>Drop off</Text>
          </View>
          <View style={styles.sectionInfo}>
            <View style={styles.markerIcon}>
              <IconPaperMobile height="15" width="15" fill="#7177AE" />
            </View>
            <Text style={styles.markerLabel}>
              Location Company Chang i 26th, Singapore
            </Text>
          </View>
          <View style={styles.sectionInfo}>
            <View style={styles.markerIcon}>
              <IconVector height="15" width="15" fill="#7177AE" />
            </View>
            <Text style={styles.markerLabel}>09.00 -10.00 a.m</Text>
          </View>
          <View style={styles.sectionInfo}>
            <View style={styles.markerIcon}>
              <IconSpeechMobile height="15" width="15" fill="#7177AE" />
            </View>
            <Text style={styles.markerLabel}>
              Delivery Instruction Put in the lobby only
            </Text>
          </View>
        </View>
        <View style={styles.sectionPackage}>
          <Text style={styles.titlePackage}>Package Detail</Text>
          <View style={styles.sectionDividier}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Transfer</Text>
              <Text style={styles.infoPackage}>Van</Text>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Commodity</Text>
              <Text style={styles.infoPackage}>Dry Food</Text>
            </View>
          </View>
          <View style={styles.sectionDividierRight}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Packaging type</Text>
              <Text style={styles.infoPackage}>20 pallet</Text>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Weight</Text>
              <Text style={styles.infoPackage}>23.00 Kg</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionButton}>
          <Button
            buttonStyle={styles.navigationButton}
            titleStyle={styles.deliveryText}
            title="Start delivery"
          />
        </View>
      </View>
    );
  }
}

const styles = {
  filterContainer: {
    flexShrink: 1,
    marginVertical: 15,
    flexDirection: 'column',
  },
  sectionSort: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  badgeSort: {
    paddingHorizontal: 5,
  },
  sectionPackage: {
    flexDirection: 'column',
    flexShrink: 1,
    marginVertical: 24,
    marginHorizontal: 20,
  },
  titlePackage: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 21,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  sectionDividierRight: {
    flexDirection: 'row',
  },
  dividerContent: {
    flexDirection: 'column',
    flex: 1,
    marginVertical: 8,
  },
  labelPackage: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
  },
  infoPackage: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
  },
  buttonDivider: {
    flex: 1,
  },
  deliveryText: {
    fontWeight: '600',
    color: '#ffffff',
    fontSize: 14,
  },
  navigationButton: {
    backgroundColor: '#121C78',
    borderRadius: 5,
  },
  sectionHeadPackage: {
    flexDirection: 'column',
    marginHorizontal: 5,
    marginTop: 25,
  },
  headTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
  headSubtitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  sectionLegend: {
    flexDirection: 'column',
    marginBottom: 30,
    marginTop: 13,
    marginHorizontal: 5,
  },
  legendLabel: {
    flexShrink: 1,
    fontWeight: '700',
    fontSize: 14,
    color: '#6C6B6B',
  },
  sectionInfo: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 5,
  },
  markerIcon: {
    flexShrink: 1,
    marginRight: 20,
  },
  markerLabel: {
    color: '#6C6B6B',
    fontSize: 12,
    fontHeight: 18,
    fontWeight: '400',
  },
  markerPoint: {
    flexShrink: 1,
    marginRight: 10,
  },
  sectionMarker: {
    flexDirection: 'row',
    marginVertical: 15,
  },
};
export default Example;
