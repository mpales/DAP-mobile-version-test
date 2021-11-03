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
const Manifest = ({item, index, drag, toReportDetail, navigation, currentManifest}) => {
  const isCurrentManifest = useSelector(
    (state) => state.originReducer.filters.currentManifest,
  );
  let addAttribute = item.is_transit === undefined && item.basic !== undefined && item.barcodes.length > 0 && item.basic.length !== null && item.basic.weight !== null && item.basic.width !== null && item.basic.height !== null && item.basic.volume !== null && item.basic.carton_pcs !== null ? false : item.is_transit !== undefined ? false : true;
   let status = 'grey';
  let textstatus = 'pending';
  switch (item.status) {
    case 1:
      status = '#ABABAB';
      textstatus = 'Pending';
      break;
      case 2:
      status = '#F1811C';
      textstatus = 'Processing';
      break;
      case 3:
        status = '#17B055';
      textstatus = 'Processed';
      break;
      case 4:
      status = '#E03B3B';
      textstatus = 'Reported';
      break;
    default:
      break;
  }
  let category = item.is_transit === 1 ? 'transit' : 'default';
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
          currentManifest(item.pId)
        }}
        >
        <View style={[styles.leftList,{backgroundColor:status}]}>
        </View>
        <ListItem.Content style={styles.sectionContainer}>
        <Badge value={textstatus} status="warning" textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15, paddingHorizontal: 15,}} containerStyle={{alignSelf: 'flex-end'}} badgeStyle={{backgroundColor: status}} />
          <View style={[styles.detailContainer,{flexDirection:'row', flex: 1}]}>
              <View style={[styles.detail,{flexDirection:'column',flexGrow: 1, paddingVertical: 0}]}>
              {addAttribute && ( <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5, borderRadius: 5,borderWidth:1,borderColor:'#D5D5D5', width:50,paddingHorizontal:10}}>
                  <Text style={{...Mixins.small1,lineHeight: 18,color: '#F07120', fontWeight: '500'}}>
                        New
                        </Text>
                    </View>)}
                    {category !== 'default' && (<View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5, borderRadius: 5,borderWidth:1,backgroundColor:'#F07120', width:97,paddingHorizontal:10}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#FFFFFF', fontWeight: '500'}}>
                        Transit Item
                        </Text>
                    </View>)}
              {category === 'transit'? (
                      <>
  <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
  <View style={{width:100}}>
  <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
  Container #
  </Text>
  </View>
  <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
  <View style={{flexDirection:'row', flex: 1}}> 
  <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
      {item.container_no}
  </Text>
  </View>
</View>
<View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
  <View style={{width:100}}>
  <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
  No. of Pallet
  </Text>
  </View>
  <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
  <View style={{flexDirection:'row', flex: 1}}> 
  <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
      {item.total_pallet}
  </Text>
  </View>
</View>
<View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
  <View style={{width:100}}>
  <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
  No. of Carton
  </Text>
  </View>
  <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
  <View style={{flexDirection:'row', flex: 1}}> 
  <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
      {item.total_carton}
  </Text>
  </View>
</View>
</>
                    ) : (
            <> 
            <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:100}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                        Product Code
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={{flexDirection:'row', flex: 1}}> 
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        {item.item_code}
                        </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:100}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                       Description
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={{flexDirection:'row', flex: 1}}> 
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        {item.description}
                        </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:100}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                       UOM
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={{flexDirection:'row', flex: 1}}> 
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        {item.uom}
                        </Text>
                        </View>
                    </View>
                    
                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:100}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                        QTY
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={{flexDirection:'row', flex: 1}}> 
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        {item.qty_processed+ '/' +item.qty}
                        </Text>
                        </View>
                    </View>
                       
                    <View style={{flexDirection: 'row',flexShrink:1, marginVertical: 5}}>
                        <View style={{width:100}}>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
                        Pallet ID
                        </Text>
                        </View>
                        <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
                        <View style={{flexDirection:'row', flex: 1}}> 
                        <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
                        P00091
                        </Text>
                        </View>
                    </View>
                    </>
                    )}
              </View>

              
              <View style={[styles.anchor,{flexDirection: 'column',flexShrink: 1, justifyContent:'center', alignItems: 'center'}]}>
              <View style={{alignSelf:'flex-end',flexDirection: 'column'}}>
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
                    onPress={toReportDetail}
                />

                </View>
              </View>
          </View>
          {(isCurrentManifest === item.pId) && (
            <View style={[styles.buttonContainer,{flexDirection:'column',flex: 1,width:'100%'}]}>
            <Button
              containerStyle={{flex:1, paddingVertical: 4, paddingHorizontal: 0,}}
              buttonStyle={[styles.navigationButton]}
              titleStyle={[styles.deliveryText,{paddingHorizontal: 10}]}
              onPress={toReportDetail}
              title="Report Details"
            />
            <Button
              containerStyle={{flexShrink:1, paddingVertical: 4, paddingHorizontal: 0}}
              buttonStyle={[styles.navigationButton, {backgroundColor: '#fff', borderWidth: 1, borderColor: '#D5D5D5'}]}
              titleStyle={[styles.deliveryText,{color:'#E03B3B',paddingHorizontal: 10}]}
              onPress={()=>{
                navigation.navigate('Inbound',{
                  screen: 'ReportManifest',
                  params: {
                      dataCode: item.pId,
                  }
                })
              }}
              title="Report Item"
            />
           
          </View>)}
        
        </ListItem.Content>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
