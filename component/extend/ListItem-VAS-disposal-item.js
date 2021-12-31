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
    flexDirection:'column',
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
    borderRadius:5,
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
    (state) => state.originReducer.filters.currentDisposal,
  );
  let status = 'grey';
  let textstatus = 'pending';
  switch (item.status) {
    case 1:
      status = '#ABABAB';
      textstatus = 'Waiting';
      break;
      case 2:
      status = '#F1811C';
      textstatus = 'In Progress';
      break;
      case 3:
        status = '#17B055';
      textstatus = 'Completed';
      break;
      case 4:
      status = '#E03B3B';
      textstatus = 'Reported';
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
        pad={0}
        onPress={ToManifest}
        >
       
        <ListItem.Content style={styles.sectionContainer}>
        <View style={[styles.detailContainer,{flexDirection:'row', flexGrow: 1}]}>          
          <View style={{flexDirection: 'column', flex: 1,}}>
          
            <View style={{flexDirection: 'row',flex:1}}>
              <View style={{width:100, flexDirection:'row'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
              Location
              </Text>
              <View style={{flex:1, alignItems:'flex-end'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
              </View>
              </View>

              <View style={{flexDirection:'row', flexShrink:1}}>
              <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
              {item.location_bay}
              </Text>
              </View>
            </View>

       

            <View style={{flexDirection: 'row',flex:1}}>
              <View style={{width:100, flexDirection:'row'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
              Item Code
              </Text>
              <View style={{flex:1, alignItems:'flex-end'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
              </View>
              </View>

              <View style={{flexDirection:'row', flexShrink:1}}>
              <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
              {item.sku}
              </Text>
              </View>
            </View>


            <View style={{flexDirection: 'row',flex:1}}>
              <View style={{width:100, flexDirection:'row'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
             Description
              </Text>
              <View style={{flex:1, alignItems:'flex-end'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
              </View>
              </View>

              <View style={{flexDirection:'row', flexShrink:1}}>
              <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
              {item.description}
              </Text>
              </View>
            </View>
    

            <View style={{flexDirection: 'row',flex:1}}>
              <View style={{width:100, flexDirection:'row'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
              UOM
              </Text>
              <View style={{flex:1, alignItems:'flex-end'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
              </View>
              </View>

              <View style={{flexDirection:'row', flexShrink:1}}>
              <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
              {item.UOM}
              </Text>
              </View>
            </View>
            
            <View style={{flexDirection: 'row',flex:1}}>
              <View style={{width:100, flexDirection:'row'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
              QTY
              </Text>
              <View style={{flex:1, alignItems:'flex-end'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
              </View>
              </View>

              <View style={{flexDirection:'row', flexShrink:1}}>
              <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
              {item.total_qty}
              </Text>
              </View>
            </View>


            <View style={{flexDirection: 'row',flex:1}}>
              <View style={{width:100, flexDirection:'row'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#2D2C2C', fontWeight: '500'}}>
              Category
              </Text>
              <View style={{flex:1, alignItems:'flex-end'}}>
              <Text style={{...Mixins.small1,lineHeight: 18,color: '#6C6B6B', fontWeight: '500',textAlign: 'right',flexShrink: 1, paddingHorizontal: 8}}>:</Text>
              </View>
              </View>

              <View style={{flexDirection:'row', flexShrink:1}}>
              <Text style={{...Mixins.small1, lineHeight: 18, color: '#424141', fontWeight: '400'}}>
              {item.category}
              </Text>
              </View>
            </View>
    
          </View>
          <View style={styles.rightList}>
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
              onPress={()=>{
                navigation.navigate({
                  name: 'ItemDetails',
                  params: {
                      dataCode: item.id,
                  }
                })
              }}
            />
          </View>
          </View>
        
        </ListItem.Content>
      </ListItem>
    </ThemeProvider>
  );
};

export default Manifest;
