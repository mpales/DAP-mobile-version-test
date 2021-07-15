import React from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    Card,
    Input,
    SearchBar,
    Badge,
    Overlay
} from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
//component
import BlindList from '../../../component/extend/ListItem-blind';
//style
import Mixins from '../../../mixins';
//icon
import ChevronDown from '../../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import moment from 'moment';
import { element } from 'prop-types';
const window = Dimensions.get('window');

class ListSKU extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filtered : 0,
            renderGoBack : false,
            _visibleOverlay: false,
        };
    this.toggleOverlay.bind(this);
    this.updateASN.bind(this);
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
    this.handleConfirm.bind(this);
    }
    toggleOverlay =()=> {
      const {_visibleOverlay} = this.state;
      this.setState({_visibleOverlay: !_visibleOverlay})
    }
    updateSearch = (search) => {
        this.setState({search});
      };
    setFiltered = (num)=>{
        this.setState({filtered:num});
    }
    handleConfirm = ({action}) => {
      this.toggleOverlay();
      if(action) {
     
      }
    }
    updateASN = ()=>{
       
    }
    

    componentDidUpdate(prevProps, prevState, snapshot) {
      
    }
    componentDidMount() {

     
    }
    render() {
        return(
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                <ScrollView 
                    style={styles.body} 
                    showsVerticalScrollIndicator={false}
                >
                            <Text style={{...Mixins.subtitle1,lineHeight: 21,color:'#424141', paddingHorizontal: 20, marginTop: 15}}>GCPL STOCK TAKE 20 02 20</Text>
            <View style={{flexDirection:'row',paddingHorizontal: 20}}>
            <SearchBar
              placeholder="Type Here..."
              onChangeText={this.updateSearch}
              value={this.state.search}
              lightTheme={true}
              inputStyle={{backgroundColor: '#fff'}}
              placeholderTextColor="#2D2C2C"
              searchIcon={() => (
                <IconSearchMobile height="20" width="20" fill="#2D2C2C" />
              )}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                marginRight: 10,
                marginVertical: 5,
                flex:1,
              }}
              inputContainerStyle={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#D5D5D5',
              }}
              leftIconContainerStyle={{backgroundColor: 'white'}}
            />
             <View style={styles.sortContainer}>
                <Text style={{...Mixins.subtitle3, fontWeight: '700'}}>
                Sort By Exp Date
                </Text>
                <View style={styles.sortIconWrapper}>
                <ChevronDown width="15" height="15" fill="#6C6B6B" />
                </View>
            </View>
            </View>
                    <View style={styles.sectionContent}>
                        <Card containerStyle={styles.cardContainer}>
                        <View style={styles.headingCard}>
                        <Badge
                    value="All"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(0)}
                    badgeStyle={this.state.filtered === 0 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 0 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                      <Badge
                    value="Reported"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(4)}
                    badgeStyle={this.state.filtered === 4 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 4 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Pending"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Progress"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Complete"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                            </View>
                            {warehouseBlindList.map((data, i, arr) => {
                                return (
                                <BlindList 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                     this.toggleOverlay();
                                    }}
                                    navigation={this.props.navigation}
                                />
                            )})}
                        </Card>
                    </View>
                </ScrollView>
                <Overlay fullScreen={false} overlayStyle={styles.overlayContainerStyle} isVisible={this.state._visibleOverlay} onBackdropPress={this.toggleOverlay}>
            <Text style={styles.confirmText}>Input Quantity ?</Text>
                    <View style={[styles.sectionDividier,{flexDirection:'row',marginTop:15, paddingHorizontal: 40}]}>
                          <View style={[styles.dividerContent,{marginRight: 35}]}>
                            <Text style={styles.qtyTitle}>Qty</Text>
                          </View>
                          <View style={styles.dividerInput}>
                          <Badge value="+" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: 37}} onPress={()=>{
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          />
                          <Input 
                            containerStyle={{flex: 1,paddingVertical:0}}
                            inputContainerStyle={styles.textInput} 
                            inputStyle={[Mixins.containedInputDefaultStyle,{...Mixins.h4,fontWeight: '600',lineHeight: 27,color:'#424141'}]}
                            labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                            placeholder="0"
                            disabled={true}
                            />
                           <Badge value="-" status="error" textStyle={{...Mixins.h1, fontSize:32,lineHeight: 37}} onPress={()=>{
                          }}  
                          containerStyle={{flexShrink:1, marginVertical: 5}}
                          badgeStyle={{backgroundColor:'#F07120',width:30,height:30, justifyContent: 'center',alignItems:'center', borderRadius: 20}}
                          />
                          </View>
                        </View>
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity 
                style={[styles.cancelButton, {borderWidth: 1, borderColor: '#ABABAB'}]}
                onPress={() => this.handleConfirm({action: true})}
              >
              <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                onPress={() => this.handleConfirm({action: false})}
              >
                <Text style={[styles.cancelText, {color: '#fff'}]}>Back</Text>
              </TouchableOpacity>
            </View>
          </Overlay>
            </SafeAreaProvider>
        )
    }
}

const styles = StyleSheet.create({
  qtyTitle: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 40,
  },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    body: {
        backgroundColor: Colors.white,
        flexDirection: 'column',
        flex: 1,
    },
    headingCard: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    badgeSort: {
        marginRight: 5,
      },
    sectionContent: {
        marginHorizontal: 20,
        marginBottom: 0,
    },
    headerBeranda: {
        flexDirection: 'column',
        height: window.width * 0.16,
        backgroundColor: '#121C78',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    ccmText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    berandaBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        maxHeight: 30,
    },
    barSection: {
        flex: 1,
    },
    breadcrumb : {
        alignItems: 'flex-start',
    },
    search: {
        alignItems: 'flex-end',
    },
    navSection: {
        flex: 1,
    },
    toggleDrawer: {
        alignItems: 'flex-start',
    },
    logoWrapper: {
        alignItems: 'center',
    },
    navWrapper: {
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    cardContainer: {
        borderWidth: 0,
        padding: 0,
        marginHorizontal: 0,
        marginBottom:20,
        marginTop:0,
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: {height: 0, width: 0},
        shadowOpacity: 0, //default is 1
        shadowRadius: 0, //default is 1
        elevation: 0,
        backgroundColor: '#ffffff',
    },
    sectionDividier: {
      flexDirection: 'column',
    },
    dividerContent: {
      flexDirection: 'row',
      flexShrink: 1,
      marginVertical: 3,
    },
    dividerInput: {
      flexDirection: 'row',
      flex: 1,
      marginVertical: 8,
    },
    badgeActive: {    
        backgroundColor: '#F1811C',
        borderWidth: 1,
        borderColor: '#F1811C',
        paddingHorizontal: 12,
        height: 20,
      
        },
        badgeActiveTint: {
          ...Mixins.small3,
          lineHeight: 12,
          color: '#ffffff'
        },
        badgeInactive: {
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#121C78',
          paddingHorizontal: 12,
          height: 20,
        },
        badgeInactiveTint: {
          ...Mixins.small3,
          lineHeight: 12,
          color: '#121C78'
        },
        sortContainer: {
            borderWidth: 1,
            borderColor: '#ADADAD',
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
            marginLeft: 10,
            flexShrink:1,
            marginVertical:15,
          },
          sortIconWrapper: {
            backgroundColor: '#C5C5C5',
            borderRadius: 3,
            padding: 5,
            marginLeft: 5,
          },
          overlayContainerStyle: {
            position:'absolute',
            bottom:0,
            right:0,
            left:0,
            height:window.height * 0.3,
            borderTopRightRadius: 20, 
            borderTopLeftRadius: 20,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          },
          cancelButtonContainer: {
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            paddingHorizontal:40,
          },
          confirmText: {
            ...Mixins.h6,
            lineHeight: 27,
            fontWeight: '600',

          },
          cancelButton: {
            width: '100%',
            marginVertical:5,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
          },
});
const warehouseBlindList = [
    {
        id: 1,
       sku : 'ISO00012345',
       location_bay: '8993175536820',
       location_rack: ['J R21-15', 'J R21-01'],
       barcode: '9780312205195',
       description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
       category: '-',
       grade : '01',
       UOM : 'PCS',
       packaging : 'PC 1 of 6',
       total_qty: 100,
       whole_qty: '1 pallet',
       phoneNumber: '0123456774',
       name: 'Yan Ting',
       address: 'Blk 110 Pasir Ris Street 11 #11-607',
       zipcode: 'Zip Code',
       scanned: 100,
       timestamp: moment().add(1, 'days').unix(),
       status: 'pending'
    },
    {
      id: 2,
        sku : 'ISO00034434',
        location_bay: '9780312205195',
       location_rack: ['J R21-15', 'J R21-01'],
       barcode: '8993175536820',
       description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
       category: '-',
       grade : '01',
       UOM : 'PCS',
       packaging : 'PC 1 of 6',
       total_qty: 1,
       phoneNumber: '0123456774',
       name: 'Yan Ting',
       address: 'Blk 110 Pasir Ris Street 11 #11-607',
       zipcode: 'Zip Code',
       scanned: 0,
       whole_qty: '1 pallet',
       timestamp: moment().add(1, 'days').unix(),
       status: 'pending'
    },
    {
      id: 3,
        sku : 'ISO0004353453',
        location_bay: 'JP2 C05-003',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TC',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 100,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(2, 'days').unix(),
        status: 'pending'
    },
    {
      id: 4,
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-004',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TD',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 100,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(2, 'days').unix(),
        status: 'pending'
    },
    {
      id: 5,
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-005',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TF',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 50,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(4, 'days').unix(),
        status: 'pending'
    },
    {
      id: 6,
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-006',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TG',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 50,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(1, 'days').unix(),
        status: 'pending'
    },
    {
      id: 7,
        sku : 'ISO00012345',
        location_bay: 'JP2 C05-008',
        location_rack: ['J R21-15', 'J R21-01'],
        barcode: 'EBV 2BL - TH',
        description: 'ERGOBLOM V2 BLUE DESK  (HTH-512W LARGE TABLE/SHELF )',
        category: '-',
        grade : '01',
        UOM : 'PCS',
        packaging : 'PC 1 of 6',
        total_qty: 30,
        phoneNumber: '0123456774',
        name: 'Yan Ting',
        address: 'Blk 110 Pasir Ris Street 11 #11-607',
        zipcode: 'Zip Code',
        scanned: 0,
        whole_qty: '1 pallet',
        timestamp: moment().add(10, 'days').unix(),
        status: 'pending'
    },
];

function mapStateToProps(state) {
    return {
   
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return { 
      setBottomBar: (toggle) => {
        return dispatch({type: 'BottomBar', payload: toggle});
      },
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(ListSKU)