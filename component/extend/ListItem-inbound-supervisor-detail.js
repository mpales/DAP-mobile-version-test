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
    marginHorizontal: 14,
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
const Manifest = ({item, index, drag, currentManifest, navigation}) => {
  const isCurrentManifest = useSelector(
    (state) => state.originReducer.filters.currentManifest,
  );
  let addAttribute = item.category !== '' ? false : true;
  let status = 'grey';
  let textstatus = 'pending';
  if(item.scanned < item.total_package && item.scanned >= 0) {
    if(item.scanned === 0) {
      status = 'grey';
      textstatus = 'Pending';
    } else {
      status = 'orange'
      textstatus = 'Progress'
    }
  } else if(item.scanned === -1){
    status = 'red';
    textstatus = 'Reported'
  } else {
    textstatus = 'Completed'
    status = 'green';
  }
  let category = 'default';
  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}
        >
        <View style={[styles.leftList,{backgroundColor:status}]}>
        </View>
        <ListItem.Content style={styles.sectionContainer}>
          <View style={[styles.detailContainer,{flexDirection:'row', flex: 1}]}>
              <View style={[styles.detail,{flexDirection:'column',flexGrow: 1, paddingVertical: 15}]}>

                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:60}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                        Product Code
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={addAttribute ? {width: 100} : {width: 150} }>
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                            {item.code}
                        </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:60}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                       Descript
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={addAttribute ? {width: 100} : {width: 150} }>
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        {item.name}
                        </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:60}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                       UOM
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={addAttribute ? {width: 100} : {width: 150} }>
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        {item.UOM}
                        </Text>
                        </View>
                    </View>
                    
                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:60}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                        QTY
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={addAttribute ? {width: 100} : {width: 150} }>
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        {item.total_package}
                        </Text>
                        </View>
                    </View>
                       
                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:60}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                        Pallet ID
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={addAttribute ? {width: 100} : {width: 150} }>
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        P00091
                        </Text>
                        </View>
                    </View>
              </View>

              
              <View style={[styles.anchor,{flexDirection: 'column',flexShrink: 1, alignSelf: 'stretch', alignItems: 'flex-end'}]}>
              <Badge value={textstatus} status="warning" textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15, paddingHorizontal: 20,}} containerStyle={{alignSelf: 'flex-end'}} badgeStyle={{backgroundColor: status}} />
              <View style={{alignSelf:'flex-end',flexDirection: 'column', marginTop: 30}}>
              <ListItem.Chevron
                  size={16}
                  color="#2D2C2C"
                  containerStyle={{alignSelf: 'flex-end'}}
                  Component={(props)=>(
                    <Button
                      {...props}
                      type="clear"
                      icon={
                        <IconArrow66Mobile height="26" width="26" fill="#2D2C2C"/>
                      }
                    />)}
                    onPress={()=>{
                      navigation.navigate('ReportDetailsSPV')
                    }}
                />

                </View>
              </View>
          </View>
     
        </ListItem.Content>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
