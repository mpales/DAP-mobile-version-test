import React from 'react';
import {
  ListItem,
  Avatar,
  ThemeProvider,
  withBadge,
  Badge,
  Button,
  Text,
} from 'react-native-elements';
import {View, TouchableOpacity} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconCursor20Mobile from '../../assets/icon/iconmonstr-cursor-20 1mobile.svg';
import IconTime2Mobile from '../../assets/icon/iconmonstr-time-2 1mobile.svg';
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import moment from 'moment';
import {useSelector} from 'react-redux';
import Mixins from '../../mixins';

const styles = {
  sectionContainer: {
    flexGrow: 1,
    marginLeft: 20,
    paddingVertical: 10,
    flexDirection:'column',
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
    marginVertical: 4,
    marginHorizontal: 0,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  rightList: {
    flexDirection: 'column',
    flexShrink: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    alignSelf: 'stretch',
  },
  containerUser: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  inboundUser: {
    ...Mixins.subtitle3,
    color:'#D5D5D5',
    fontWeight: '400',
    lineHeight: 18,
    alignSelf: 'flex-end',
  },
  containerPackage: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  inboundPackage: {
    ...Mixins.subtitle3,
    color:'#D5D5D5',
    fontWeight: '600',
    lineHeight: 21,
  alignSelf: 'flex-end',
  },
  inboundText: {
...Mixins.small1,
fontWeight: '400',
lineHeight: 18,
  },
  
  leftList: {
    backgroundColor: 'grey',
    flexShrink: 1,
    padding: 3,
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight:'400',
    color: '#ffffff',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  detailText: {
    ...Mixins.small1,
    color: '#424141',
    fontWeight:'500',
  },
  valueText: {
    flexGrow: 1,
    marginLeft: 5,
    flexWrap: 'wrap',
    flexBasis:1,
    maxWidth: '65%',
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
  
};
const Manifest = ({item, index, ToManifest}) => {

  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}
        onPress={ToManifest}
        >
          <ListItem.Content style={styles.sectionContainer}>
          <Badge value={item.type === 1 ? 'ASN' : item.type === 2 ? 'GRN' : item.type === 3 ? 'TRANSIT' : 'OTHERS'} status="warning" textStyle={{...Mixins.small3,fontWeight: '700',lineHeight: 15, paddingHorizontal: 20,}} containerStyle={{alignSelf: 'flex-start',marginBottom:10}} badgeStyle={{backgroundColor: item.type === 1 ? '#121C78' : item.type === 2 ? '#F07120' : item.type === 3 ? 'white' : '#17B055', borderColor:'#ABABAB', borderWidth:item.type === 1 ? 0 : item.type === 2 ? 0 : item.type === 3 ? 1 : 0, borderRadius:5}} />
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '45%'}]}>Received Date</Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {item.receivedDate ? moment(item.receivedDate).format("DD-MM-YYYY") : '-'}
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '45%'}]}>Client ID</Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {item.clientId}
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '45%'}]}>Inbound ID</Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {item.jobId}
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '45%'}]}>Ref #</Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {item.ref}
            </Text>
          </View>
          {item.type === 3 && (
          <><View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '45%'}]}>Warehouse</Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {item.warehouse}
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={[styles.detailText, {width: '45%'}]}>Pallet</Text>
            <Text style={styles.detailText}>:</Text>
            <Text
              style={
                [styles.detailText, styles.valueText]
              }>
            {item.pallet}
            </Text>
          </View>
          </>)}
      
                 
                    
    
        </ListItem.Content>
        <View style={{flexDirection: 'column', paddingRight: 10, flexShrink:1}}>
            <ListItem.Chevron
                  size={16}
                  color="#2D2C2C"
                  containerStyle={{alignSelf: 'flex-end', flexShrink:1, paddingHorizontal:0}}
                  Component={(props)=>(
                    <Button
                      {...props}
                      type="clear"
                      icon={
                        <IconArrow66Mobile height="26" width="26" fill="#2D2C2C"/>
                      }
                    />)}
                    onPress={ToManifest}
                />
        </View>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
