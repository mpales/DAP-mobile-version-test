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
  Keyboard,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';
import {
  Card,
  SearchBar,
  Image,
  Button,
  ListItem,
  LinearProgress
} from 'react-native-elements';
import {Dimensions, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AnyAction, Dispatch} from 'redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect, Provider} from 'react-redux';
import Mixins from '../../../../mixins';
import {getData,getBlob} from '../../../../component/helper/network';
import RNFetchBlob from 'rn-fetch-blob';
import ImageLoading from '../../../../component/loading/image'
const window = Dimensions.get('window');

class Photos extends React.Component {
  arrayImageReceivedRef = [];
  arrayImageProcessingRef = [];
  constructor(props) {
    super(props);
    this.state = {
      receivingNumber : null,
      data :null,
      receivedPhotoId : null,
      processingPhotoId : null,
    };
  }
  static getDerivedStateFromProps(props,state){
    const {addPhotoProofID, navigation} = props;
    const {receivingNumber} = state;
    // only one instance of multi camera can exist before submited
    if(receivingNumber === null){
        const {routes, index} = navigation.dangerouslyGetState();
       if(routes[index].params !== undefined && routes[index].params.number !== null){
         return {...state,receivingNumber:routes[index].params.number};
       } 
    } 
   
    return {...state};
   }
   shouldComponentUpdate(nextProps, nextState) {
    // if(this.props.keyStack !== nextProps.keyStack){
    //   if(nextProps.keyStack === 'PhotosDraft' && this.props.keyStack ==='CameraMulti'){
    //     this.setState({updateData:true});
    //     return false;
    //   } 
    // }
    return true;
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    
    // if(this.state.updateData === true){
    //   const result = await getData('inboundsMobile/'+this.state.receivingNumber+'/photosIds');
    //   if(typeof result === 'object' && result.error === undefined){
    //     let dumpPath = [];
    //     let dumpreceivedPhotoId =[];
    //     let dumpprocessingPhotoId = [];
    //     for (let index = 0; index < result.inbound_photos.length; index++) {
    //       const element = result.inbound_photos[index].photoId;
    //       if(result.inbound_photos[index].status === 2){
    //         dumpreceivedPhotoId.push(element);
    //       } else if(result.inbound_photos[index].status === 3){
    //         dumpprocessingPhotoId.push(element);
    //       }
    //      // let respath = await getBlob('/inboundsMobile/'+this.state.receivingNumber+'/processingThumb/'+element,{filename:element+'.jpg'});
    //     //  dumpPath.push(respath);
    //     }
    //     this.setState({updateData:false, receivedPhotoId: dumpreceivedPhotoId, processingPhotoId: dumpprocessingPhotoId});
    //   } else {
    //     this.props.navigation.goBack();
    //   }
    // }
    // if(prevState.receivedPhotoId !== this.state.receivedPhotoId && this.state.updateData === prevState.updateData){
    //   this.arrayImageReceivedRef.forEach((element,index) => {
    //     this.arrayImageReceivedRef[index].init();       
    //   });
    // } 
    // if(prevState.processingPhotoId !== this.state.processingPhotoId && this.state.updateData === prevState.updateData) {
    //   this.arrayImageProcessingRef.forEach((element,index) => {
    //     this.arrayImageProcessingRef[index].init();       
    //   });
    // }
    // if(this.state.updateData !== prevState.updateData && this.state.updateData === false) {
    //   this.arrayImageProcessingRef.forEach((element,index) => {
    //     this.arrayImageProcessingRef[index].refresh();       
    //   });
    //   this.arrayImageReceivedRef.forEach((element,index) => {
    //     this.arrayImageReceivedRef[index].refresh();       
    //   });
    // }
  }
  
  async componentDidMount(){
    // const result = await getData('inboundsMobile/'+this.state.receivingNumber+'/photosIds');
    // if(typeof result === 'object' && result.error === undefined){
    //   let dumpPath = [];
    //   let dumpreceivedPhotoId =[];
    //   let dumpprocessingPhotoId = [];
    //   for (let index = 0; index < result.inbound_photos.length; index++) {
    //     const element = result.inbound_photos[index].photoId;
    //     if(result.inbound_photos[index].status === 2){
    //       dumpreceivedPhotoId.push(element);
    //     } else if(result.inbound_photos[index].status === 3){
    //       dumpprocessingPhotoId.push(element);
    //     }
    //   }
    //   this.setState({updateData:false,  receivedPhotoId: dumpreceivedPhotoId, processingPhotoId: dumpprocessingPhotoId});
    // } else {
    //   this.props.navigation.goBack();
    // }
    this.setState({updateData:false,  receivedPhotoId: ['dad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad','sad']});
  }
  
  renderCardImageReceived = ({item,index})=>{ 
    return (<TouchableOpacity 
      style={{width:78,height:78,backgroundColor:'black', marginHorizontal:5, marginVertical:5}}
      onPress={()=>{
        this.props.navigation.navigate('EnlargePhoto', {
          inboundId: 'test',
          photoId: ['asdasd','asdasd','asdasd','asdasddasd'],
          index: 1,
          type: 'AttributePhoto'
        });
      }}
      />)
  }

  render() {
    return (
        <View style={[StyleSheet.absoluteFill,{backgroundColor:'white',paddingHorizontal:40,paddingVertical:20}]}>
            <Card containerStyle={{margin:0}}>
            <Card.Title style={{textAlign:'left',...Mixins.subtitle3,color:'#424141',fontWeight:'600',lineHeight:21}}>View Photo</Card.Title>
           
            <FlatList
            horizontal={false}
            keyExtractor={(item,index)=>index}
            data={this.state.receivedPhotoId}
            renderItem={this.renderCardImageReceived}
            numColumns={3}
            style={{height:500}}
            />
  
            </Card>
        
        </View>
    );
 
  }
}

const styles = {
    deliveryText: {
        ...Mixins.h6,
        lineHeight: 27,
        fontWeight:'600',
        color: '#ffffff',
      },
      navigationButton: {
        backgroundColor: '#F07120',
        borderRadius: 5,
      },
}
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isDrawer: state.originReducer.filters.isDrawer,
    indexBottomBar : state.originReducer.filters.indexBottomBar,
    indexStack : state.originReducer.filters.indexStack,
    keyStack : state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Photos);
