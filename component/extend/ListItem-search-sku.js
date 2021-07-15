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
import Mixins from '../../mixins';

const styles = {
  sectionContainer: {
    marginHorizontal: 14,
    paddingVertical: 12,
    flexGrow: 1,
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
    marginHorizontal: 0,
    marginVertical: 6,
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
  labelContainer : {
    flexShrink: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginHorizontal: 0,
    marginVertical: 10,
    padding:3,
    alignSelf: 'stretch',
  },
  labelText: {
    ...Mixins.small1,
    fontWeight: '400',
    lineHeight: 18,
    color:'#ABABAB',
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
    color:'#ABABAB'
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
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
const Manifest = ({item, index, isActive, ToManifest}) => {
  let status = 'grey';
  switch (item.status) {
    case 'complete':
      status = 'green';
      break;
      case 'progress':
        status = 'orange';
        break;
        case 'pending':
          status = 'grey';
          break;
          case 'reported':
            status = 'red';
            break;
    default:
      break;
  }
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}>
        <View style={[styles.leftList,{backgroundColor:status}]}>
        </View>
        <ListItem.Content style={[styles.sectionContainer, {flexDirection: 'column'}]}>

            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                <View style={{width:60}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                Location
                </Text>
                </View>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                {item.location_bay}
                </Text>
            </View>

            
            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                <View style={{width:60}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                Item Code
                </Text>
                </View>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                {item.barcode}
                </Text>
            </View>


            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                <View style={{width:60}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                Descript
                </Text>
                </View>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                {item.description}
                </Text>
            </View>

       
            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                <View style={{width:60}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                Expiry Date
                </Text>
                </View>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
         
                </Text>
            </View>

            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                <View style={{width:60}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                Batch No
                </Text>
                </View>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                {item.location_bay}
                </Text>
            </View>


            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                <View style={{width:60}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                Quantity
                </Text>
                </View>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                {item.total_qty}
                </Text>
            </View>

            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                <View style={{width:60}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                UOM
                </Text>
                </View>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                {item.UOM}
                </Text>
            </View>

            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                <View style={{width:60}}>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                Grade
                </Text>
                </View>
                <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                {item.grade}
                </Text>
            </View>

        <View style={[styles.groupbutton,{width:'100%',flexDirection:'column',marginVertical: 10}]}>
        <Button
            containerStyle={{flex:1, paddingVertical: 4, paddingHorizontal: 0, marginHorizontal: 10}}
            buttonStyle={[styles.navigationButton]}
            titleStyle={[styles.deliveryText,{paddingHorizontal: 10}]}
         onPress={ToManifest}
         title="Move To" />
        </View>
        </ListItem.Content>
      
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
