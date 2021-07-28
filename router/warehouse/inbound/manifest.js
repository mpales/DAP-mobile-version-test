/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Card, Overlay, Button, SearchBar, Badge, Input} from 'react-native-elements';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect, Provider} from 'react-redux';
import Mixins from '../../../mixins';
import InboundDetail from '../../../component/extend/ListItem-inbound-detail';
import IconBarcodeMobile from '../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';
import moment from 'moment';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';
const window = Dimensions.get('window');

class Warehouse extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      inboundCode: this.props.route.params?.code ?? '',
      _visibleOverlay : false,
      receivingNumber: null,
      search: '',
      filtered : 0,
      _manifest: [],
      updated: false,
    };
    this.goToIVAS.bind(this);
    this.toggleOverlay.bind(this);
    this.setFiltered.bind(this);
    this.updateSearch.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {navigation,manifestList, currentASN,barcodeScanned, ReportedManifest, barcodeGrade} = props;
    const {receivingNumber, _manifest, search, filtered} = state;
    if(manifestList.length === 0 && search === ''){
      let manifest = manifestDummy.filter((element)=>element.name.indexOf(search) > -1);
      props.setManifestList(manifest);
      return {...state, _manifest : manifest};
    } else if(manifestList.length > 0 && barcodeScanned.length > 0) {
      let manifest = Array.from({length: manifestList.length}).map((num, index) => {
        return {
            ...manifestList[index],
            grade : barcodeScanned.includes(manifestList[index].code) ? barcodeGrade : manifestList[index].grade,
            scanned: barcodeScanned.includes(manifestList[index].code) ? barcodeScanned.length : manifestList[index].scanned,
        };
      });
      props.setItemGrade(null);
      props.setItemScanned([]);
      props.setManifestList(manifest);
      return {...state,_manifest : manifest};
    } else if(manifestList.length > 0 && ReportedManifest !== null ) {
      let manifest = Array.from({length: manifestList.length}).map((num, index) => {
        return {
            ...manifestList[index],
            scanned: ReportedManifest === manifestList[index].code ? -1 : manifestList[index].scanned,
        };
      });
      props.setReportedManifest(null);
      props.setManifestList(manifest);
      return {...state, _manifest: manifest}
    } else if(manifestList.length > 0 && _manifest.length === 0  && search === '' && filtered === 0 ) {
      return {...state, _manifest: manifestList}
    }
    return {...state};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.keyStack !== nextProps.keyStack){
      if(nextProps.keyStack === 'Manifest' && this.props.keyStack ==='newItem'){
        this.setState({updated: true});
        return true;
      } else if(nextProps.keyStack === 'Manifest'){
        return true;
      }
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {manifestList} = this.props;
    
    if(prevState.receivingNumber !== this.state.receivingNumber){
      if(this.props.receivingNumber === null){
        this.props.navigation.goBack();
      } else {
        this.setState({_manifest: []});
       this.props.setManifestList([]);
      }
    } 
    let filtered = prevState.filtered !== this.state.filtered || prevState.search !== this.state.search || prevState.updated !== this.state.updated ? this.state.filtered : null;
   
    if(filtered === 0) {
      this.setState({_manifest: manifestList.filter((element)=> element.name.indexOf(this.state.search) > -1), updated: false});
      } else if(filtered === 1){
        this.setState({_manifest: manifestList.filter((element)=> element.scanned === -1).filter((element)=> element.name.indexOf(this.state.search) > -1), updated: false});
      } else if(filtered === 2){
        this.setState({_manifest: manifestList.filter((element)=>  element.scanned === 0).filter((element)=> element.name.indexOf(this.state.search) > -1), updated: false});
      }else if(filtered === 3){
        this.setState({_manifest: manifestList.filter((element)=>  element.scanned < element.total_package && element.scanned > 0).filter((element)=> element.name.indexOf(this.state.search) > -1), updated: false});
      }else if(filtered === 4){
        this.setState({_manifest: manifestList.filter((element)=>  element.scanned === element.total_package).filter((element)=> element.name.indexOf(this.state.search) > -1), updated: false});
      } 
   
  }
  componentDidMount() {
    const {navigation,manifestList, currentASN,barcodeScanned, ReportedManifest} = this.props;
    const {receivingNumber, _manifest, search} = this.state;
    if(receivingNumber === null){
      const {routes, index} = navigation.dangerouslyGetState();
      if(routes[index].params !== undefined && routes[index].params.number !== undefined) {
        this.setState({receivingNumber: routes[index].params.number})
      } else if(currentASN !== null) {
        this.setState({receivingNumber: currentASN})
      } else {
        navigation.popToTop();
      }
    }
  }
  setFiltered = (num)=>{
    this.setState({filtered:num});
}
  toggleOverlay =()=> {
    const {_visibleOverlay} = this.state;
    this.setState({_visibleOverlay: !_visibleOverlay})
  }

  handleConfirm = ({action}) => {
    const {currentASN} = this.props;
    this.toggleOverlay();
    if(action) {
      this.props.setBottomBar(true);
      // for prototype only
      this.props.addCompleteASN(currentASN);
      this.props.completedInboundList.push(this.state.inboundCode);
      // end

      this.props.navigation.navigate('containerDetail');
    }
  }
  goToIVAS =() =>{
    this.props.navigation.navigate('IVAS');
  }
  updateSearch = (search) => {
    this.setState({search});
  };
  render() {
    const {_visibleOverlay, _manifest,receivingNumber} = this.state;
    const {inboundList} = this.props;
    let currentASN = inboundList.find((element) => element.number === receivingNumber);
    return (
      <>
        <StatusBar barStyle="dark-content" /> 
        <SafeAreaProvider>
          <ScrollView style={styles.body}>
            <View style={[styles.sectionContent,{marginTop: 20}]}>
            <View style={[styles.sectionContentTitle, {flexDirection: 'row'}]}>
            <View style={[styles.titleHead,{flexShrink :1,minWidth: 120}]}>
            <Text style={{...Mixins.subtitle1,lineHeight: 21,color:'#424141'}}>{receivingNumber}</Text>
            <Text style={{...Mixins.small1,lineHeight: 18,color:'#424141',fontWeight:'bold'}}>{currentASN !== undefined ? currentASN.transport : null}</Text>
            </View>
            <View style={[styles.contentHead,{flexShrink: 1,alignSelf:'flex-end', flexDirection: 'column'}]}>
            <View style={[styles.headPallet,{flexDirection:'row', flexShrink:1}]}>
              <Text style={{...Mixins.subtitle3,color:'#424141',lineHeight: 21,fontWeight: '600'}}>Pallet ID : </Text>
              <Input 
                                 containerStyle={{flexShrink:1,maxHeight:30}}
                                 inputContainerStyle={{...Mixins.containedInputDefaultContainer,maxHeight:20, paddingHorizontal: 0,
                                  paddingVertical: 0}} 
                                 inputStyle={{...Mixins.containedInputDefaultStyle,marginHorizontal: 0}}
            labelStyle={[Mixins.containedInputDefaultLabel,{marginBottom: 0}]}
            placeholder="PLDAP 0000091"
                disabled={true}
            />
            </View>
            <Button
              containerStyle={{width: '100%',justifyContent: 'center',height:30}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={[styles.deliveryText,{lineHeight:16}]}
              onPress={this.toggleOverlay}
              title="Generate"
            />
            </View>
            </View>
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
                paddingHorizontal: 0,
                marginVertical: 5,
              }}
              inputContainerStyle={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#D5D5D5',
                maxHeight:40,
              }}
              leftIconContainerStyle={{backgroundColor: 'white'}}
            />
             <View style={{flexDirection:'row',marginVertical: 10}}>
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
                    onPress={()=> this.setFiltered(1)}
                    badgeStyle={this.state.filtered === 1 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 1 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Pending"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(2)}
                    badgeStyle={this.state.filtered === 2 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 2 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Progress"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(3)}
                    badgeStyle={this.state.filtered === 3 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 3 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
                          <Badge
                    value="Completed"
                    containerStyle={styles.badgeSort}
                    onPress={()=> this.setFiltered(4)}
                    badgeStyle={this.state.filtered === 4 ? styles.badgeActive : styles.badgeInactive }
                    textStyle={this.state.filtered === 4 ? styles.badgeActiveTint : styles.badgeInactiveTint }
                    />
            </View>
            <View style={[styles.tabList, {flexDirection: 'row', flexShrink: 1}]}>
            <Button
              containerStyle={{flexShrink:1, marginRight:10}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 40}]}
              titleStyle={styles.deliveryText}
       
              title="GRN"
            />
            <Button
              containerStyle={{flexShrink:1}}
              buttonStyle={[styles.navigationButton, {backgroundColor:'white',paddingHorizontal: 40,borderWidth:1,borderColor:'#6C6B6B'}]}
              titleStyle={[styles.deliveryText,{color:'black'}]}

              title="ASN"
            />
            </View>
              <Card containerStyle={styles.cardContainer}>
                {_manifest.map((u, i) => (
                  <InboundDetail 
                    key={i} 
                    index={i} 
                    item={u} 
                    navigation={this.props.navigation}
                    currentManifest={this.props.setCurrentManifest}
                    // for prototype only
                    // end
                  />
                ))}
              </Card>
            </View>
          </ScrollView>
          <Overlay fullScreen={false} overlayStyle={styles.overlayContainerStyle} isVisible={_visibleOverlay} onBackdropPress={this.toggleOverlay}>
            <Text style={styles.confirmText}>Are you sure you want to Submit ?</Text>
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
         
          <View style={styles.bottomTabContainer}>
          <Button
              containerStyle={{flex:1, marginRight:10}}
              buttonStyle={[styles.navigationButton, {paddingVertical: 20, backgroundColor: '#121C78'}]}
              titleStyle={styles.deliveryText}
              onPress={this.goToIVAS}
              title="IVAS"
            />
            <Button
              containerStyle={{flex:1}}
              buttonStyle={[styles.navigationButton, {paddingVertical: 10}]}
              titleStyle={styles.deliveryText}
              onPress={this.toggleOverlay}
              title="Complete all Receiving"
            />
          </View>
        </SafeAreaProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  badgeSort: {
    marginRight: 5,
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
  code: {
    fontSize: 20,
    color: '#424141',
    marginVertical: 0,
  },
  body: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
  },
  headingCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionContent: {
    marginBottom: 0,
    marginHorizontal: 20,
  },
  buttonSticky: {
    position: 'absolute',
    bottom:60,
    left:0,
    right:0,
    elevation: 10,
    zIndex: 10,
  },
  barcodeButton: {
    ...Mixins.buttonAvatarDefaultOverlayStyle,
    backgroundColor: '#F07120',
    borderRadius: 100,
  },
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 20,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0, //default is 1
    shadowRadius: 0, //default is 1
    elevation: 0,
    backgroundColor: '#ffffff',
  },
  alertButton: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  alert: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDivider: {
    flex:1,
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  confirmText: {
    fontSize: 20,
    textAlign: 'center',
  },
  cancelButton: {
    width: '40%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  bottomTabContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical:10,
  },
  reportButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ABABAB',
  }
});

const manifestDummy = [
  {
    code: '9780312205195',
    total_package: 2,
    name: 'Bear Brand Milk',
    color:'white',
    category: '[N-BR1B]',
    timestamp: moment().unix(),
    scanned: 1,
    CBM: 20.10,
    weight: 115,
    status: 'onProgress',
    sku: '221314123',
    grade: 'Pick'
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'Lotte Milkis',
    category: '',
    color:'blue',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 10.10,
    weight: 70,
    sku: '412321412',
    grade: 'Pick'
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'LG TwinWash',
    category: '[A-CCR1]',
    color:'grey',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 15.10,
    weight: 90,
    sku: '1241231231',
    grade: 'Pick'
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'Midea U Inverter',
    category: '[A-DD1B]',
    color:'white',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115,
    sku : '12454634545',
    grade: 'Pick'
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'TEODORES',
    category: '[G-CCD1]',
    color:'white',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 10.10,
    weight: 90,
    sku: '430344390',
    grade: 'Pick'
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'FIXA 7.2V',
    category: '[A-CCR1]',
    color:'black',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 15.10,
    weight: 70,
    sku: '430958095',
    grade: 'Pick'
  },
  {
    code: '9780312205195',
    total_package: 5,
    name: 'Hock Stove Gas',
    category: '[D-RR1B]',
    color:'black',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115,
    sku: '430950345',
    grade: 'Pick'
  },
  {
    code: '9780099582113',
    total_package: 5,
    name: 'Philips Bulb E27',
    category: '[D-BB1B]',
    color:'white',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115,
    sku: '250345345',
    grade: 'Pick'
  },
  {
    code: '13140026927112',
    total_package: 5,
    name: 'bosch gws 5-100',
    category: '[A-DD1B]',
    color:'blue',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115,
    sku: '4309583049',
    grade: 'Pick'
  },
  {
    code: '13140026927113',
    total_package: 5,
    name: 'Bosch Xenon H11',
    category: '[D-BR1B]',
    color:'blue',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115,
    sku: '3405934095',
    grade: 'Pick'
  },
  {
    code: '13140026927114',
    total_package: 5,
    color:'black',
    name: '4 Way Terminal',
    category: '[D-CC2B]',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115,
    sku: '4059304034',
    grade: 'Pick'
  },
];

function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    ManifestCompleted: state.originReducer.filters.manifestCompleted,
    manifestList: state.originReducer.manifestList,
    inboundList: state.originReducer.inboundList,
    // for prototype only
    barcodeScanned: state.originReducer.filters.barcodeScanned,
    barcodeGrade: state.originReducer.filters.barcodeGrade,
    completedInboundList: state.originReducer.completedInboundList,
    currentASN : state.originReducer.filters.currentASN,
    ReportedManifest : state.originReducer.filters.ReportedManifest,
    keyStack: state.originReducer.filters.keyStack,
    // end
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    toggleDrawer: (bool) => {
      return dispatch({type: 'ToggleDrawer', payload: bool});
    },
    dispatchCompleteManifest: (bool) => {
      return dispatch({type: 'ManifestCompleted', payload: bool});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    setManifestList: (data) => {
      return dispatch({type: 'ManifestList', payload: data});
    },
    addCompleteASN : (data)=>{
      return dispatch({type:'addCompleteASN', payload: data})
    },
    setItemScanned : (item) => {
      return dispatch({type: 'BarcodeScanned', payload: item});
    },
    setReportedManifest: (data) => {
      return dispatch({type:'ReportedManifest', payload: data});
    },
    setCurrentManifest: (data) => {
      return dispatch({type:'setCurrentManifest', payload: data});
    },
    setItemGrade : (grade)=>{
      return dispatch({type:'BarcodeGrade', payload: grade});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);
