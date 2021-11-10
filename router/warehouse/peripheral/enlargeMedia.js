import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
// icons
import ImageZoom from 'react-native-image-pan-zoom';
import Video from 'react-native-video'
import TrashCan16Mobile from '../../../assets/icon/iconmonstr-trash-can-16mobile.svg';

import OfflineMode from '../../../component/linked/offlinemode';
const window = Dimensions.get("window");

class EnlargeImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            pictureData: null,
            convertedPictureData: [],
            currentPictureIndex: 0,
            isShowDelete: false,
            rootIDType : '',
        });
        this.convertPictureData.bind(this);
        this.handleDelete.bind(this);
    }

    static getDerivedStateFromProps(props,state){
        // only one instance of multi camera can exist before submited
        if(props.route.params.index !== undefined && state.rootIDType === '') {
            return {...state,currentPictureIndex: props.route.params.index,  rootIDType :  props.route.params.rootIDType,  pictureData:props.route.params.rootIDType === 'ItemDisposalDetail' ? props.disposalPostpone : null,}
         
        }
      
       
        return {...state};
       }
    componentDidUpdate(prevProps, prevState){
        if(this.state.pictureData === null){
            this.props.navigation.navigate('DisposalCamera');
        } else if(this.state.pictureData.length === 0) {
            if(this.state.rootIDType === 'ItemDisposalDetail'){
                this.props.addMediaProofPostpone(null);
                this.props.addMediaDisposalID(null);
            } 
            this.props.navigation.navigate('DisposalCamera');
        } else {
            if(prevState.pictureData.length !== this.state.pictureData.length){
                if(this.state.rootIDType === 'ItemDisposalDetail'){
                    this.props.addMediaProofUpdate(this.state.pictureData);
                } 
            }
        }
    }
    componentDidMount() {
        if(this.props.route.params.index !== undefined) {
      
            this.convertPictureData();
        }
      
    }

    convertPictureData = () => {
        const {pictureData} = this.state;
        let convertedPictureData = Array.from({length:pictureData.length}).map((num,index)=>{
            return { url: pictureData[index] };
          });
        this.setState({
            convertedPictureData: convertedPictureData,
        });
    }

    handleShowDelete = () => {
        this.setState({isShowDelete: !this.state.isShowDelete})
    }

    handleDelete = () => {
        const {pictureData, convertedPictureData, currentPictureIndex} = this.state;

        this.setState({
            pictureData: pictureData.filter((element,index) => index !== currentPictureIndex),
            convertedPictureData : convertedPictureData.filter((element,index) => index !== currentPictureIndex),
            currentPictureIndex: currentPictureIndex > 0 ? currentPictureIndex -1 : 0,
        });     
        this.handleShowDelete();
    }

    handleOnChangeImage = (index) => {
        this.setState({
            currentPictureIndex: index,
        });
    }
    handleOnChangeImage = ({viewableItems, changed}) => {
        const {currentPictureIndex} = this.state;
        viewableItems.forEach(element => {
            this.setState({currentPictureIndex:element.index === currentPictureIndex ? currentPictureIndex: element.index});
        });
    }
    renderImage = ({item,index}) => {
      if(item.url.toString().endsWith("mp4") === true){
       console.log('test video');
        return(    <Video
        source={{uri:item.url}}
        style={{width:window.width, height: window.height/2}}
        paused={false}
        resizeMode="cover"
        posterResizeMode="cover"
        allowsExternalPlayback={false}
        automaticallyWaitsToMinimizeStalling={false}
        disableFocus={true}
        repeat={true}
        useTextureView={false}
        controls={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
      />);
      } else {
        return(   
            <ImageZoom cropWidth={window.width}
            cropHeight={window.height/2}
            imageWidth={window.width}
            imageHeight={window.height/2}>
                <Image key={index} style={{width:window.width, height: window.height/2}} source={{uri: item.url}} />
            </ImageZoom>
            );
      }
    }

    render() {
        return (
            <>
                <View style={styles.container}>
                <OfflineMode/>
                    <View style={styles.pictureContainer}>
                    {this.state.convertedPictureData.length > 0 &&
                         <FlatList
                         ref={(ref)=>this.flatlist = ref}
                         horizontal={true}
                         keyExtractor={(item,index)=> index}
                         data={this.state.convertedPictureData}
                         renderItem={this.renderImage}
                         initialScrollIndex={this.state.currentPictureIndex}
                         onViewableItemsChanged={this.handleOnChangeImage}
                        />
                        }
                        {/* {this.state.pictureData.map((value, index) => {
                            return <Image key={index} style={styles.picture} source={{uri: value}} />
                        })} */}
                    </View>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={this.handleShowDelete}
                    >
                        <TrashCan16Mobile height="30" width="25" fill="#fff" />
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                {this.state.isShowDelete &&
                    <View style={styles.transparentOverlay}>
                        <View style={styles.deleteContainer}>
                            <Text>Delete this image ?</Text>
                            <View style={styles.confirmButtonContainer}>
                                <TouchableOpacity
                                    onPress={this.handleShowDelete}
                                    style={[styles.confirmButton, {backgroundColor: '#fff', borderWidth: 1, borderColor: '#ABABAB'}]}
                                >
                                     <Text style={styles.cancelText}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.handleDelete}
                                    style={[styles.confirmButton, {backgroundColor: '#F07120'}]}
                                >
                                     <Text style={styles.confirmText}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </>
        )
    } 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2D2C2C',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pictureContainer: {
        height: window.height - (window.height * 40 / 100),
        flexDirection: 'row',
    },
    picture: {
        width: '100%',
    },
    transparentOverlay: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
    },
    deleteContainer: {
        width: '100%',
        height: window.height - (window.height * 80 / 100),
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    confirmButtonContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    confirmButton: {
        width: '40%',
        height: 40,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '700',
    },
    cancelText: {
        color: '#6C6B6B',
        fontWeight: '700',
    },
    deleteButton: {
        position: 'absolute',
        bottom: 0,
        paddingVertical: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: '#fff',
    }
})

function mapStateToProps(state) {
    return {
        disposalPostpone: state.originReducer.disposalPostpone,
    };
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        reset: () => dispatch({type: 'RESET'}),
        addMediaDisposalID: (id) => dispatch({type:'addDisposalProofID', payload: id}),
        addMediaProofPostpone: (uri) => dispatch({type: 'disposalPostpone', payload: uri}),
        addMediaProofUpdate: (data) => dispatch({type: 'DisposalMediaUpdate', payload: data}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnlargeImage);