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
import {Avatar, Card, Overlay, Button} from 'react-native-elements';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect, Provider} from 'react-redux';
import Mixins from '../../../mixins';
import InboundDetail from '../../../component/extend/ListItem-inbound-detail';
import IconBarcodeMobile from '../../../assets/icon/iconmonstr-barcode-3 2mobile.svg';
const window = Dimensions.get('window');

class Warehouse extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      inboundCode: this.props.route.params?.code ?? '',
      _visibleOverlay : false,
    };
    this.toggleOverlay.bind(this);
  }

  componentDidMount() {
    this.props.setManifestList(manifestList);
    // for prototype only
    this.props.navigation.addListener(
      'focus',
      payload => {
        this.forceUpdate();
      }
    );
    // end
  }

  toggleOverlay =()=> {
    const {_visibleOverlay} = this.state;
    this.setState({_visibleOverlay: !_visibleOverlay})
  }

  handleConfirm = ({action}) => {
    this.toggleOverlay();
    if(action) {
      this.props.navigation.popToTop();
      this.props.setBottomBar(true);
      // for prototype only
      this.props.completedInboundList.push(this.state.inboundCode);
      // end
    }
  }

  render() {
    const {_visibleOverlay} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" /> 
        <SafeAreaProvider>
          <ScrollView style={styles.body}>
            <View style={styles.sectionContent}>
              <Text style={styles.code}>{this.state.inboundCode}</Text>
              <Card containerStyle={styles.cardContainer}>
                {this.props.manifestList.map((u, i) => (
                  <InboundDetail 
                    key={i} 
                    index={i} 
                    item={u} 
                    // for prototype only
                    barcodeScanned={this.props.barcodeScanned} 
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
              onPress={() => this.props.navigation.navigate('ReportManifest')}
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
    marginVertical: 10,
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
    marginBottom: 25,
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

const manifestList = [
  {
    code: '13140026927104',
    total_package: 2,
    scanned: 1,
    CBM: 20.10,
    weight: 115,
    status: 'onProgress',
  },
  {
    code: '13140026927105',
    total_package: 5,
    scanned: 0,
    CBM: 10.10,
    weight: 70
  },
  {
    code: '13140026927106',
    total_package: 5,
    scanned: 0,
    CBM: 15.10,
    weight: 90,
  },
  {
    code: '13140026927107',
    total_package: 5,
    scanned: 0,
    CBM: 20.10,
    weight: 115,
  },
  {
    code: '13140026927108',
    total_package: 5,
    scanned: 0,
    CBM: 10.10,
    weight: 90
  },
  {
    code: '13140026927109',
    total_package: 5,
    scanned: 0,
    CBM: 15.10,
    weight: 70
  },
  {
    code: '13140026927110',
    total_package: 5,
    scanned: 0,
    CBM: 20.10,
    weight: 115
  },
  {
    code: '13140026927111',
    total_package: 5,
    scanned: 0,
    CBM: 20.10,
    weight: 115
  },
  {
    code: '13140026927112',
    total_package: 5,
    scanned: 0,
    CBM: 20.10,
    weight: 115
  },
  {
    code: '13140026927113',
    total_package: 5,
    scanned: 0,
    CBM: 20.10,
    weight: 115
  },
  {
    code: '13140026927114',
    total_package: 5,
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
    barcodeScanned: state.originReducer.barcodeScanned,
    completedInboundList: state.originReducer.completedInboundList,
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
    }
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);
