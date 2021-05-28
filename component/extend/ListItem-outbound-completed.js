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
 

  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}>
        <View style={[styles.leftList,{backgroundColor:'green'}]}>
        </View>
        <ListItem.Content style={styles.sectionContainer}>
        <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
          SKU
          </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          ISO00012345
          </Text>
          </View>
    
          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
            <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
            Location
            </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          JP2 C05-002
          </Text>
          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
       
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}></Text>
          
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>J R21-15</Text> 
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>J R21-01</Text> 
          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
            <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
          Barcode
          </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          EBV 2BL - TL
          </Text>
          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
            <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
           Description
           </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )
          </Text>
          </View>


          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
            <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
            Category
            </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          -
          </Text>
          </View>

          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
            <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
            Pick By
            </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          Adam
          </Text>
          </View>

       
        </ListItem.Content>
        <View style={styles.rightList}>
        <Badge value="Completed" status="success" textStyle={{...Mixins.small3,fontWeight: '400',lineHeight: 15}} containerStyle={{flexShrink:1, paddingVertical:10}} />
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
