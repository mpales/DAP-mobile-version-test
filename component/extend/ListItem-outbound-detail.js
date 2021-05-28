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
import Location from '../../assets/icon/iconmonstr-location-1 1mobile.svg';
import Barcode from '../../assets/icon/iconmonstr-barcode-3 1mobile.svg';
import Note from '../../assets/icon/iconmonstr-file-22mobile.svg';
import Delivery from '../../assets/icon/iconmonstr-delivery-12mobile.svg';
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import Mixins from '../../mixins';

const styles = {
  sectionContainer: {
    marginHorizontal: 0,
    paddingVertical: 10,
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
    marginVertical: 8,
    marginHorizontal: 0,
    padding: 0,
    marginBottom: 0,
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
    alignSelf: 'flex-start',
  },
  inboundDate: {
    color: '#D5D5D5',
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
const Manifest = ({item, index, drag, isActive, ToManifest}) => {
  let status = 'grey';

  switch (item.status) {
    case 'warning':
      status = "red";
      break;
    case 'error':
      status = "orange";
      break;
    case 'complete':
      status = "green";
      break;
    case 'pending':
      status = "grey";
      break;
    default:
      status = "grey";
      break;
  }

  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}>
        <View style={[styles.leftList,{backgroundColor:status}]}>
        </View>
        <ListItem.Content style={styles.sectionContainer}>

          <View style={{flexDirection: 'row',flex:1}}>
          <View style={{width:40}}>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
          SKU
          </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          {item.sku}
          </Text>
          </View>
    
          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:40}}>
          <Location width="15" height="20" fill="#000"/>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          {item.location_bay}
          </Text>
          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:40}}>
       
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}></Text>
          
          {item.location_rack.map((element,index)=>{
            return (
              <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>{element}</Text>  );
          })}
          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:40}}>
            <Barcode width="15" height="20" fill="#000"/>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          {item.barcode}
          </Text>
          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:40}}>
            <Note width="15" height="20" fill="#000"/>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          {item.description}
          </Text>
          </View>


          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:40}}>
            <Delivery width="15" height="20" fill="#000"/>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          -
          </Text>
          </View>

       
        </ListItem.Content>
        <View style={styles.rightList}>
        <Badge value={item.status} status="warning"  textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15}} containerStyle={{flexShrink:1, paddingVertical:10}} />
         <ListItem.Chevron
          containerStyle={{flexGrow:1,justifyContent: 'center'}}
            size={26}
            color="#2D2C2C"
            Component={(props)=>(
              <Button
                {...props}
                type="clear"
                icon={
                  <IconArrow66Mobile height="16" width="26" fill="#2D2C2C"/>
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
