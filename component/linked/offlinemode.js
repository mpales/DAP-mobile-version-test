import React from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity, Text, Animated ,Dimensions, Pressable } from 'react-native';
import {Overlay} from 'react-native-elements';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux';
import { offlineActionCreators} from 'react-native-offline';
import Checkmark from '../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import Warning from '../../assets/icon/iconmonstr-warning-6 1mobile.svg';
import Xmark from '../../assets/icon/iconmonstr-x-mark-1 1mobile.svg';
import Mixins from '../../mixins';

const { changeQueueSemaphore } = offlineActionCreators;
const screen = Dimensions.get('window');
class OfflineMode extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOfflineWarning : false,
            isOnlineWarning: false,
            visible:false,
          };
          this.closeBanner.bind(this);
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.isConnected !== this.props.isConnected){
          if(this.props.isConnected){
            this.setState({
              isOnlineWarning: true,
              visible:true
            });
          } else {
            this.setState({
              isOfflineWarning : true,
              visible:true
            });
          }
        }
    }
    closeBanner = () => {
        this.setState({
          isOfflineWarning : false,
          isOnlineWarning: false,
          visible:false,
        });
      }
    render() {
        return(
            <>
            { this.state.visible && (
        <Animated.View style={[styles.overlayBanner, !this.props.position || this.props.position === 'bottom' ? {bottom: !this.props.pixel ? 0 : this.props.pixel }: {top: !this.props.pixel ? 0 : this.props.pixel}]}>
      {this.props.isConnected && this.props.isActionQueue.length > 0 && this.state.isOnlineWarning
      && (<View style={[styles.bannerNetworkMode,styles.onlineMode]}>
                <View style={styles.bannerIcon}>
                  <Checkmark height="36" width="36" fill="#FFFFFF" />
                </View>
                <View style={styles.bannerDetail}>
                  <Text style={styles.bannerTextStyle}>ONLINE MODE , There’s new pending task</Text>
                </View>
                <TouchableOpacity style={styles.bannerClose} onPress={()=>{
                  this.props.setDispatchOnline();
                  this.closeBanner();
                  }}>
                <Xmark width="15" height="15" fill="#FFFFFF"/>
                </TouchableOpacity>
              </View>) }
    {!this.props.isConnected && this.state.isOfflineWarning
      && (<View style={[styles.bannerNetworkMode,styles.offlineMode]}>
                <View style={styles.bannerIcon}>
                  <Warning height="36" width="36" fill="#FFFFFF" />
                </View>
                <View style={styles.bannerDetail}>
                  <Text style={styles.bannerTextStyle}>Theres problem with connection, It will go OFFLINE MODE</Text>
                    <TouchableOpacity style={styles.bannerButton}>
                      <Text style={styles.bannerTextStyle}>TRY AGAIN</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.bannerClose}  onPress={this.closeBanner}>
                <Xmark width="15" height="15" fill="#FFFFFF"/>
                </TouchableOpacity>
              </View>) }
            </Animated.View >          
            )}
            </>
        );
    }
}


const styles = StyleSheet.create({
    overlayBanner: {
        flexShrink:1,
        margin:0,
        padding:0,
        backgroundColor:'transparent',
        elevation:10,
        zIndex:10,
        position:'absolute',
        top:0,
        left:0,
        right:0,
    },
    bannerNetworkMode: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        flexDirection: 'row',
        flexShrink:1,
      
      },
      offlineMode: {
        backgroundColor: '#E03B3B',
      },
      onlineMode: {
        backgroundColor: '#17B055',
      },
      bannerIcon: {
        marginRight: 15,
        flexShrink: 1,
      },
      bannerDetail: {
        flexDirection: 'column',
        flex:1,
      },
      bannerTextStyle : {
        color:'white',
        ...Mixins.small3,
        fontSize: 11,
        lineHeight: 16,
      },
      bannerButton: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        flexShrink:1,
      },
      bannerClose: {
        marginLeft: 15,
      },
});
function mapStateToProps(state) {
    return {
      isConnected : state.network.isConnected,
      isActionQueue: state.network.actionQueue,
    };
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      setDispatchOnline: () => dispatch(changeQueueSemaphore('RED')),
      };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(OfflineMode);
  