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
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  rightList: {
    flexDirection: 'column',
    flexShrink: 1,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
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
const Manifest = ({item, index, currentList, ToManifest, navigation}) => {
  const isCurrentManifest = useSelector(
    (state) => state.originReducer.filters.currentList,
  );
  let status = 'grey';
  let textstatus = 'pending';
  if(item.scanned < item.total_qty && item.scanned >= 0) {
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

  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}
        onPress={()=>{
          currentList(item.barcode)
        }}
        >
        <View style={[styles.leftList,{backgroundColor:status}]}>
        </View>
        <ListItem.Content style={styles.sectionContainer}>
        <View style={[styles.detailContainer,{flexDirection:'row', flexGrow: 1}]}>          
          <View style={{flexDirection: 'column', flex: 1,}}>
          <View style={{flexDirection: 'row',flex:1}}>
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

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:60}}>
       
          </View>
          <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}></Text>
       
          {item.location_rack.map((element,index)=>{
            return (
              <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>{element}</Text>  );
          })}
        
          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:60}}>
            <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
          SKU
          </Text>
          </View>
          <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
        
          <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
          {item.sku}
          </Text>
 
          </View>


          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:60}}>
            <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
            Barcode
            </Text>
          </View>
          <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
     
          <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
          {item.barcode}
          </Text>

          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:60}}>
            <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
           Description
           </Text>
          </View>
          <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
          <View style={{width:200}}>
          <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
          {item.description}
          </Text>
          </View>
          </View>


          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:60}}>
            <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
        Category
        </Text>
          </View>
          <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
          <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
          {item.category}
          </Text>
          </View>
          </View>
          <View style={styles.rightList}>
          <Badge value={textstatus} status="warning" textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15, paddingHorizontal: 20,}} containerStyle={{alignSelf: 'flex-end'}} badgeStyle={{backgroundColor: status}} />
            <ListItem.Chevron
            containerStyle={{flexGrow:1,justifyContent: 'center', alignSelf: 'flex-end'}}
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
          </View>
          {isCurrentManifest === item.barcode  && (
          <View style={[styles.groupbutton,{flexShrink: 1, flexDirection: 'row'}]}>
            <Button
              containerStyle={{flexShrink:1, paddingVertical: 4, paddingHorizontal: 0}}
              buttonStyle={[styles.navigationButton, {backgroundColor: '#fff', borderWidth: 1, borderColor: '#D5D5D5'}]}
              titleStyle={[styles.deliveryText,{color:'#E03B3B',paddingHorizontal: 10}]}
              onPress={()=>{
                navigation.navigate({
                  name: 'ReportManifest',
                  params: {
                      dataCode: item.barcode,
                      bayCode : item.location_bay,
                  }
                })
              }}
              disabled={item.scanned !== -1 ? false : true}
              title="Report Item"
            />
            <Button
              containerStyle={{flexShrink:1, paddingVertical: 4, paddingHorizontal: 0, marginHorizontal: 10}}
              buttonStyle={[styles.navigationButton]}
              titleStyle={[styles.deliveryText,{paddingHorizontal: 10}]}
              onPress={()=>{
                navigation.navigate({
                  name: 'ItemDetail',
                  params: {
                      dataCode: item.barcode,
                      bayCode : item.location_bay,
                  }
                })
              }}
              title="See Detail"
            />
            </View>)}
        </ListItem.Content>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
