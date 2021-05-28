import React from 'react';
import {Avatar, Text, Button} from 'react-native-elements';
import {View, ScrollView} from 'react-native';
import IconPaperMobile from '../../../assets/icon/iconmonstr-paper-plane-2mobile.svg';
import IconSpeechMobile from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconVector from '../../../assets/icon/Vector.svg';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';

import OfflineMode from '../../../component/linked/offlinemode';

class Packages extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount(){
   
  }
  componentDidUpdate(prevProps, prevState, snapshot){
 
  }

  render() {
 
    return (
      <>
      <ScrollView style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 20}}>

              <View style={styles.sectionHeadPackage}>
              <Text style={styles.headTitle}>Reported</Text>
              </View>
           
          
  
        <View style={styles.sectionDetail}>
     
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
            <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}> Location</Text>
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


          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
            <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
            Report
            </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          <Text style={{...Mixins.small3, lineHeight: 15, color: '#6C6B6B', fontWeight: '400'}}>
          Adam
          </Text>
          </View>


        
          <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
            <Text style={{...Mixins.subtitle1,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
            Pick By
            </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          </View>
            <Text style={{...Mixins.subtitle2}}>Items Mising</Text>

            <View style={{flexDirection: 'row',flex:1}}>
            <View style={{width:100}}>
            <Text style={{...Mixins.subtitle1,lineHeight: 21,color: '#000000', fontWeight: '600'}}>
            Descriptions
            </Text>
          </View>
          <Text style={{...Mixins.subtitle3,lineHeight: 21,color: '#000000', fontWeight: '600',textAlign: 'right',flexShrink: 1}}>:</Text>
          </View>
            <Text style={{...Mixins.small1}}>item on the rack is less </Text>

        
        </View>
       
        
      
      </ScrollView>
      </>
    );
  }
}

const styles = {
  sectionButton: {
    marginVertical: 25,
  },
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
  sectionDetail: {
    flexDirection: 'column',
    flexShrink: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    
    elevation: 6,
  },
  titlePackage: {
    ...Mixins.h4,
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
    ...Mixins.subtitle3,
    color: '#424141',
  },
  infoPackage: {
    ...Mixins.body3,
    fontWeight: '400',
    lineHeight: 18,
  },
  buttonDivider: {
    flex: 1,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#121C78',
    borderRadius: 5,
  },
  sectionHeadPackage: {
    flexDirection: 'column',
    marginHorizontal: 15,
    marginVertical: 25,
  },
  headTitle: {
    ...Mixins.h1,
    lineHeight: 27,
  },
  headSubtitle: {
    ...Mixins.subtitle1,
  lineHeight: 16,
  },
  sectionLegend: {
    flexDirection: 'column',
    marginBottom: 30,
    marginTop: 13,
    marginHorizontal: 25,
  },
  legendLabel: {
    flexShrink: 1,
...Mixins.subtitle1,
lineHeight: 16,
    color: '#6C6B6B',
  },
  sectionInfo: {
    flexDirection: 'row',
    marginHorizontal: 35,
    marginVertical: 5,
  },
  markerIcon: {
    flexShrink: 1,
    marginRight: 20,
  },
  markerLabel: {
    color: '#6C6B6B',
    ...Mixins.body3,
    lineHeight: 18,
    fontWeight: '400',
  },
  markerTime: {
    color: '#F07120',
    ...Mixins.body3,
    lineHeight: 18,
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

function mapStateToProps(state) {
  return {
    bottomBar: state.originReducer.filters.bottomBar,
    startDelivered : state.originReducer.filters.onStartDelivered,
    dataPackage: state.originReducer.route.dataPackage,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Packages);
