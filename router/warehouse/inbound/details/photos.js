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
} from 'react-native';
import {
  Card,
  SearchBar,
  Image,
  Button,
} from 'react-native-elements';
import {Dimensions, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AnyAction, Dispatch} from 'redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect, Provider} from 'react-redux';
import Mixins from '../../../../mixins';
import {getData,getBlob} from '../../../../component/helper/network';
import RNFetchBlob from 'rn-fetch-blob';
const window = Dimensions.get('window');

class Photos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivingNumber : null,
      data :null,
      dataPhotoId : null,
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
  async componentDidUpdate(prevProps, prevState, snapshot) {
    
    if(this.state.updateData === true){
      const result = await getData('inbounds/'+this.state.receivingNumber+'/photosIds');
      if(typeof result === 'object' && result.error === undefined){
        let dumpPath = [];
        let dumpPhotoId =[];
        for (let index = 0; index < result.inbound_photos.length; index++) {
          const element = result.inbound_photos[index].photoId;
          let respath = await getBlob('/inbounds/'+this.state.receivingNumber+'/processingThumb/'+element);
          dumpPhotoId.push(element);
          dumpPath.push(respath);
        }
        this.setState({updateData:false,data: dumpPath, dataPhotoId: dumpPhotoId});
      } else {
        this.props.navigation.goBack();
      }
    } 
  }
  
  async componentDidMount(){
    const result = await getData('inbounds/'+this.state.receivingNumber+'/photosIds');
    if(typeof result === 'object' && result.error === undefined){
      let dumpPath = [];
      let dumpPhotoId =[];
      for (let index = 0; index < result.inbound_photos.length; index++) {
        const element = result.inbound_photos[index].photoId;
        let respath = await getBlob('/inbounds/'+this.state.receivingNumber+'/processingThumb/'+element);
        dumpPhotoId.push(element);
        dumpPath.push(respath);
      }
      this.setState({updateData:false,data:dumpPath,  dataPhotoId: dumpPhotoId});
    } else {
      this.props.navigation.goBack();
    }
  }
  
  renderCardImage = ({item})=>{ 
    if(typeof item === 'object' && item.error !== undefined){
      return (<View style={{width: 78, height: 78,margin:5, backgroundColor:'#ccc'}}>
      <Text>{item.error}</Text>
    </View>);
    } else {
      console.log(item);
    
      return <Image
      source={{ uri:  Platform.OS === 'android' ? 'file://' + item : '' + item }}
      style={{ width: 78, height: 78 }}
      containerStyle={{padding:5}}
      />
    }
   
  }
  render() {
    console.log(this.state.data)
    return (
        <View style={[StyleSheet.absoluteFill,{backgroundColor:'white',paddingHorizontal:40,paddingVertical:20}]}>
            <Card>
            <Card.Title style={{textAlign:'left',...Mixins.subtitle3,color:'#424141',fontWeight:'600',lineHeight:21}}>Receiving Photo</Card.Title>
        
            <FlatList
            horizontal={false}
            keyExtractor={this.keyExtractor}
            data={this.state.data}
            renderItem={this.renderCardImage}
            numColumns={3}
            />
        <Button
                        containerStyle={{flexShrink:1, marginRight: 0,}}
                        buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
                        titleStyle={styles.deliveryText}
                        onPress={()=>{
                          this.props.navigation.navigate('UpdatePhotos',{
                            photoId: this.state.dataPhotoId,
                            inboundId : this.state.receivingNumber,
                          });
                        }}
                title='Update Photos' />
            </Card>
            {/* <Card containerStyle={{marginVertical:20}}>
            <Card.Title style={{textAlign:'left',...Mixins.subtitle3,color:'#424141',fontWeight:'600',lineHeight:21}}>Pre-Processing Photo</Card.Title>
            <FlatList
            horizontal={false}
            keyExtractor={this.keyExtractor}
            data={[1,2,3,4,5,6]}
            renderItem={this.renderCardImage}
            numColumns={3}
            />
            <Button
                        containerStyle={{flexShrink:1, marginRight: 0,}}
                        buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
                        titleStyle={styles.deliveryText}
                title='Update Photos' />
            </Card> */}
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
