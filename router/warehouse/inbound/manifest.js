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
import {Avatar, Card, Overlay, Button, SearchBar} from 'react-native-elements';

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
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    this.state = {
      inboundCode: this.props.route.params?.code ?? '',
      _visibleOverlay : false,
      receivingNumber: routes[index].params.number,
      search: '',
      _manifest: [],
    };
    this.toggleOverlay.bind(this);
    
    this.updateSearch.bind(this);
  }
  static getDerivedStateFromProps(props,state){
    const {manifestList, currentASN,barcodeScanned} = props;
    const {receivingNumber, _manifest, search} = state;
    if(receivingNumber === undefined){
      if(currentASN !== null) {
        return {...state, receivingNumber: currentASN};
      }
      return {...state};
    }
    if(manifestList.length === 0 && search === ''){
      let manifest = manifestDummy.filter((element)=>element.name.indexOf(this.state.search) > -1);
      props.setManifestList(manifest);
      return {...state, _manifest : manifest};
    } else if(manifestList.length > 0 && barcodeScanned.length > 0) {
      let manifest = Array.from({length: manifestList.length}).map((num, index) => {
        return {
            ...manifestList[index],
            scanned: barcodeScanned.includes(manifestList[index].code) ? barcodeScanned.length : 0,
        };
      });
      console.log('test 2')
      props.setItemScanned([]);
      props.setManifestList(manifest);
      return {...state,_manifest : manifest};
    } else if(manifestList.length > 0 && _manifest.length === 0  && search === '' ) {
      return {...state, _manifest: manifestList}
    }
    return {...state};
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {manifestList} = this.props;
    if(prevState.receivingNumber !== this.state.receivingNumber){
      if(this.props.receivingNumber === undefined){
        this.props.navigation.goBack();
      } else {
       this.setState({_manifest: []});
       this.props.setManifestList([]);
      }
    } 
    if(prevState.search !== this.state.search) {
      this.setState({_manifest: manifestList.filter((element)=>element.name.indexOf(this.state.search) > -1)});
    }
  }
  componentDidMount() {
   
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

  updateSearch = (search) => {
    this.setState({search});
  };
  render() {
    const {_visibleOverlay, _manifest} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" /> 
        <SafeAreaProvider>
          <ScrollView style={styles.body}>
            <View style={styles.sectionContent}>
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
              }}
              leftIconContainerStyle={{backgroundColor: 'white'}}
            />
              <Card containerStyle={styles.cardContainer}>
                {_manifest.map((u, i) => (
                  <InboundDetail 
                    key={i} 
                    index={i} 
                    item={u} 
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
          <View style={styles.buttonSticky}>
            <Avatar
              size={75}
              ImageComponent={() => (
                <IconBarcodeMobile height="40" width="37" fill="#fff" />
              )}
              imageProps={{
                containerStyle: {
                  ...Mixins.buttonAvatarDefaultIconStyle,
                },
              }}
              overlayContainerStyle={styles.barcodeButton}
              onPress={() => {
                this.props.setBottomBar(false);
                this.props.setBarcodeScanner(true);
                this.props.navigation.navigate('Barcode')}}
              activeOpacity={0.7}
              containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
            />
          </View>
          <View style={styles.bottomTabContainer}>
            <Button
              containerStyle={{flex:0.4, marginLeft: 20}}
              buttonStyle={styles.reportButton}
              titleStyle={[styles.deliveryText, {color: '#6C6B6B'}]}
              onPress={() => {
                this.props.setBottomBar(true);
                this.props.navigation.navigate('ReportManifest')}}
              title="Report"
            />
            <Button
              containerStyle={{flex:0.4, marginRight: 20,}}
              buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
              titleStyle={styles.deliveryText}
              onPress={this.toggleOverlay}
              title="Complete Receive"
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
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 100,
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
    code: '13140026927104',
    total_package: 2,
    name: 'DETANGLING BRUSH -NEW YORKER',
    color:'blue',
    category: '[N-BR1B]',
    timestamp: moment().unix(),
    scanned: 1,
    CBM: 20.10,
    weight: 115,
    status: 'onProgress',
  },
  {
    code: '13140026927105',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'blue',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 10.10,
    weight: 70
  },
  {
    code: '13140026927106',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'yellow',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 15.10,
    weight: 90,
  },
  {
    code: '13140026927107',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'yellow',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115,
  },
  {
    code: '13140026927108',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'yellow',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 10.10,
    weight: 90
  },
  {
    code: '13140026927109',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'yellow',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 15.10,
    weight: 70
  },
  {
    code: '13140026927110',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'blue',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115
  },
  {
    code: '13140026927111',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'red',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115
  },
  {
    code: '13140026927112',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'red',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115
  },
  {
    code: '13140026927113',
    total_package: 5,
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    color:'black',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115
  },
  {
    code: '13140026927114',
    total_package: 5,
    color:'blue',
    name: 'DETANGLING BRUSH -NEW YORKER',
    category: '[N-BR1B]',
    timestamp: moment().unix(),
    scanned: 0,
    CBM: 20.10,
    weight: 115
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
    // for prototype only
    barcodeScanned: state.originReducer.filters.barcodeScanned,
    completedInboundList: state.originReducer.completedInboundList,
    currentASN : state.originReducer.filters.currentASN,
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
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);
