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
  Text
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
    const inboundList = [
      {
        name: 'Lorem ipsum dolor sit',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'amet, consectetur adipiscing elit vivamus turpis mattis ',
        status: 'error'
      },
      {
        name: 'Lorem ipsum dolor sit',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'amet, consectetur adipiscing elit vivamus turpis mattis ',
        status: 'warning'
      },
      {
        name: 'Lorem ipsum dolor sit',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'amet, consectetur adipiscing elit vivamus turpis mattis ',
        status: 'complete'
      },
      {
        name: 'Lorem ipsum dolor sit',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'amet, consectetur adipiscing elit vivamus turpis mattis ',
        status: 'pending'
      },
      
      {
        name: 'Lorem ipsum dolor sit',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'amet, consectetur adipiscing elit vivamus turpis mattis ',
        status: 'pending'
      },
      
      {
        name: 'Lorem ipsum dolor sit',
        avatar_url:
          'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'amet, consectetur adipiscing elit vivamus turpis mattis ',
        status: 'pending'
      },
    ];
    this.state = {
      inboundList,
      _visibleOverlay : false,
    };
    this.toggleOverlay.bind(this);
  }
  toggleOverlay =()=> {
    const {_visibleOverlay} = this.state;
    this.setState({_visibleOverlay: !_visibleOverlay})
  }
  render() {
    const {inboundList,_visibleOverlay} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaProvider>
          
        <Overlay fullScreen={false} overlayStyle={{position:'absolute',bottom:0,right:0,left:0,height:window.height * 0.3,borderTopRightRadius: 20, borderTopLeftRadius: 20}} isVisible={_visibleOverlay} onBackdropPress={this.toggleOverlay}>
          <View style={styles.alert}>
            <Text>Are you sure you want to Submit ?</Text>
          </View>
          <View style={styles.alertButton}>
          <Button
                containerStyle={[styles.buttonDivider, {marginRight: 10}]}
                title="No"
                titleStyle={{color: '#fff', ...Mixins.subtitle3, lineHeight: 21}}
                buttonStyle={{backgroundColor: '#424141'}}
              />

              <Button
                containerStyle={[styles.buttonDivider, {marginLeft: 10}]}
                title="Yes"
                titleStyle={{color: '#fff', ...Mixins.subtitle3, lineHeight: 21}}
                buttonStyle={{backgroundColor: '#424141'}}
                onPress={()=>{
                  this.toggleOverlay();
                  this.props.setBottomBar(true);
                  this.props.navigation.navigate('Home')}}
              />
            
          </View>
        </Overlay>
        <View style={styles.buttonSticky}>
          {!this.props.ManifestCompleted && (   <Avatar
                  size={75}
                  ImageComponent={() => (
                    <IconBarcodeMobile height="25" width="37" fill="#fff" />
                  )}
                  imageProps={{
                    containerStyle: {
                     ...Mixins.buttonAvatarDefaultIconStyle,
                     paddingTop: 25,
                    },
                  }}
                  overlayContainerStyle={styles.barcodeButton}
                  onPress={() => {
                    this.props.setBarcodeScanner(true);
                    this.props.navigation.navigate('Barcode')}}
                  activeOpacity={0.7}
                  containerStyle={Mixins.buttonAvatarDefaultContainerStyle}
                />
     )}
        {this.props.ManifestCompleted && ( 
        <Button
              containerStyle={{flex:1,marginHorizontal: 26,marginVertical:40}}
              buttonStyle={styles.navigationButton}
              titleStyle={styles.deliveryText}
              onPress={()=>{
                
                this.props.dispatchCompleteManifest(false);
                this.toggleOverlay()}}
              title="Complete All Receiving"
            />
     )}
        </View>
          <ScrollView style={styles.body}>
            <View style={styles.sectionContent}>
            <Card containerStyle={styles.cardContainer}>
                  {inboundList.map((u, i) => (
                    <InboundDetail key={i} index={i} item={u} />
                  ))}
              </Card>
             
            </View>
           </ScrollView>
        </SafeAreaProvider>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
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
    marginVertical: 25,
    marginHorizontal: 20,
  },
  buttonSticky: {
    position: 'absolute',
    bottom:40,
    left:0,
    right:0,
    elevation: 10,
    zIndex: 10,
  },
  barcodeButton: {
    ...Mixins.buttonAvatarDefaultOverlayStyle,
    backgroundColor: '#424141',
    borderRadius: 100,

  },
  cardContainer: {
    borderWidth: 0,
    padding: 0,
    marginHorizontal: 0,
    marginVertical: 20,
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
    backgroundColor: '#121C78',
    borderRadius: 5,
  },
  
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
});


function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
    ManifestCompleted: state.filters.manifestCompleted,
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
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);
