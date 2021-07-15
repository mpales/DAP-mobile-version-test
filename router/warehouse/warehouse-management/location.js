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
    Avatar,
    Badge,
    Overlay,
    Button
} from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
//component
import SearchSKU from '../../../component/extend/ListItem-search-sku';
//style
import Mixins from '../../../mixins';
//icon
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
import ScanBarcode from '../../../assets/icon/barcode-scan-mobile.svg';
import MoveIcon from '../../../assets/icon/iconmonstr-delivery-12mobile.svg';
import moment from 'moment';
import { element } from 'prop-types';
const window = Dimensions.get('window');

class Location extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            filtered : 0,
            currentID: null,
            renderGoBack : false,
            _visibleOverlay: false,
        };
    this.toggleOverlay.bind(this);
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
    updateASN = ()=>{
       
    }
    handleConfirm = ({action}) => {
        this.toggleOverlay();
        if(action) {
            this.props.navigation.navigate('Home');
        }
      }
      shouldComponentUpdate(nextProps, nextState) {
        if(this.props.keyStack !== nextProps.keyStack){
          if(nextProps.keyStack === 'Location'){
           this.setState({currentID: null});
            return true;
          }
        }
        return true;
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
                            <Text style={{...Mixins.subtitle1,lineHeight: 21,color:'#424141', paddingHorizontal: 20, marginTop: 15}}>Search SKU</Text>
        
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
                paddingHorizontal: 20,
                marginVertical: 5,
              }}
              inputContainerStyle={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#D5D5D5',
              }}
              leftIconContainerStyle={{backgroundColor: 'white'}}
            />
                    <View style={styles.sectionContent}>
                        <Card containerStyle={styles.cardContainer}>
                        {this.state.search === '' ? (<View style={styles.headingCard}>
                                <View style={styles.sectionContainer}>
                                    <Avatar
                                    size={79}
                                    ImageComponent={() => (
                                        <ScanBarcode height="40" width="40" fill="#fff" />
                                    )}
                                    imageProps={{
                                        containerStyle: {
                                        ...Mixins.buttonAvatarDefaultIconStyle
                                        },
                                    }}
                                    overlayContainerStyle={Mixins.buttonAvatarDefaultOverlayStyle}
                                    onPress={() =>  this.props.navigation.navigate({
                                        name: 'Barcode',
                                        params: {
                                            inputCode: '9780312205195',
                                            palletCode : '8993175536813',
                                        }
                                      })}
                                    activeOpacity={0.7}
                                    containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
                                    />
                                
                                    <Text style={styles.sectionText}>
                                    By Scan Barcode
                                    </Text>
                                </View>

                                <View style={styles.sectionContainer}>
                                    <Avatar
                                    size={79}
                                    ImageComponent={() => (
                                        <MoveIcon height="40" width="40" fill="#fff" />
                                    )}
                                    imageProps={{
                                        containerStyle: {
                                        ...Mixins.buttonAvatarDefaultIconStyle
                                        },
                                    }}
                                    overlayContainerStyle={Mixins.buttonAvatarDefaultOverlayStyle}
                                    onPress={() => console.log('Works!')}
                                    activeOpacity={0.7}
                                    containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
                                    />
                            
                                    <Text style={styles.sectionText}>
                                    Move list
                                    </Text>
                                </View>
                            </View>) : this.state.currentID === null ?(
                                <>
                                {warehouseBlindList.map((data, i, arr) => {
                                return (
                                <SearchSKU 
                                    key={i} 
                                    index={i} 
                                    item={data} 
                                    ToManifest={()=>{
                                      this.setState({currentID: data.id});
                                    }}
                               
                                />
                                )})}
                            </>
                            ) : (<>
                                  <View style={{flexDirection:'column', flexShrink:1}}>
                                    <Text style={{...Mixins.subtitle3, lineHeight: 21,fontWeight: '600'}}>Warehouse</Text>
                                    <Input 
                                    containerStyle={{flex: 1,paddingVertical:0}}
                                    inputContainerStyle={styles.textInput} 
                                        inputStyle={Mixins.containedInputDefaultStyle}
                                        labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                        disabled={true}
                                        placeholder="Building A1"
                                    />
                                </View>
                                <View style={{flexDirection:'column', flexShrink:1}}>
                                    <Text style={{...Mixins.subtitle3, lineHeight: 21,fontWeight: '600'}}>Location</Text>
                                    <Input 
                                    containerStyle={{flex: 1,paddingVertical:0}}
                                    inputContainerStyle={styles.textInput} 
                                        inputStyle={Mixins.containedInputDefaultStyle}
                                        labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                        disabled={true}
                                        placeholder="Jp-0912345"
                                    />
                                </View>
                                <View style={{flexDirection:'column', flexShrink:1}}>
                                    <Text style={{...Mixins.subtitle3, lineHeight: 21,fontWeight: '600'}}>Level</Text>
                                    <Input 
                                    containerStyle={{flex: 1,paddingVertical:0}}
                                    inputContainerStyle={styles.textInput} 
                                        inputStyle={Mixins.containedInputDefaultStyle}
                                        labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                        disabled={true}
                                        placeholder="2"
                                    />
                                </View>
                                <View style={{flexDirection:'column', flexShrink:1}}>
                                    <Text style={{...Mixins.subtitle3, lineHeight: 21,fontWeight: '600'}}>Rack</Text>
                                    <Input 
                                    containerStyle={{flex: 1,paddingVertical:0}}
                                    inputContainerStyle={styles.textInput} 
                                        inputStyle={Mixins.containedInputDefaultStyle}
                                        labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                        disabled={true}
                                        placeholder="231"
                                    />
                                </View>
                                <View style={{flexDirection:'column', flexShrink:1}}>
                                    <Text style={{...Mixins.subtitle3, lineHeight: 21,fontWeight: '600'}}>Qty</Text>
                                    <Input 
                                    containerStyle={{flex: 1,paddingVertical:0}}
                                    inputContainerStyle={styles.textInput} 
                                        inputStyle={Mixins.containedInputDefaultStyle}
                                        labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                        disabled={true}
                                        placeholder="100"
                                    />
                                </View>
                                <View style={{flexDirection:'column', flexShrink:1}}>
                                    <Text style={{...Mixins.subtitle3, lineHeight: 21,fontWeight: '600'}}>Grade</Text>
                                    <Input 
                                    containerStyle={{flex: 1,paddingVertical:0}}
                                    inputContainerStyle={styles.textInput} 
                                        inputStyle={Mixins.containedInputDefaultStyle}
                                        labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 5}]}
                                        disabled={true}
                                        placeholder="01"
                                    />
                                </View>
                                <Button
                                containerStyle={{flex:1, marginRight: 0,}}
                                buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
                                titleStyle={styles.deliveryText}
                                onPress={this.toggleOverlay}
                                title="Confim"
                                />
                            </>)}
                           
                        </Card>
                    </View>
                </ScrollView>
                <Overlay fullScreen={false} overlayStyle={styles.overlayContainerStyle} isVisible={this.state._visibleOverlay} onBackdropPress={this.toggleOverlay}>
                    <Text style={styles.confirmText}>Are you sure you want to Move Goods ? ?</Text>
                    <View style={styles.cancelButtonContainer}>
                    <TouchableOpacity 
                        style={[styles.cancelButton, {borderWidth: 1, borderColor: '#ABABAB'}]}
                        onPress={() => this.handleConfirm({action: false})}
                    >
                    <Text style={[styles.cancelText, {color: '#6C6B6B'}]}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                        onPress={() => this.handleConfirm({action: true})}
                    >
                        <Text style={[styles.cancelText, {color: '#fff'}]}>Yes</Text>
                    </TouchableOpacity>
                    </View>
                </Overlay>
            </SafeAreaProvider>
        )
    }
}

const styles = StyleSheet.create({
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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      confirmText: {
        ...Mixins.h6,
        lineHeight: 27,
        fontWeight: '600',

      },
      cancelButton: {
        width: '40%',
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
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
    sectionContainer: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 10,
        alignItems: 'center',
      },
      sectionText: {
        textAlign: 'center',
        width: 65,
        ...Mixins.subtitle3,
        lineHeight: 21,
        color: '#6C6B6B',
        marginVertical: 16,
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
        keyStack: state.originReducer.filters.keyStack,
    };
  }
  
const mapDispatchToProps = (dispatch) => {
    return { 
        setBottomBar: (toggle) => {
            return dispatch({type: 'BottomBar', payload: toggle});
          },
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Location)