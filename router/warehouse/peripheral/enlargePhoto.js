import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
// icons
import ImageZoom from 'react-native-image-pan-zoom';
import TrashCan16Mobile from '../../../assets/icon/iconmonstr-trash-can-16mobile.svg';

import OfflineMode from '../../../component/linked/offlinemode';
import ImageLoading from '../../../component/loading/image';
import {getBlob, deleteData} from '../../../component/helper/network';
import Mixins from '../../../mixins';
const window = Dimensions.get("window");

class EnlargeImage extends React.Component {
    viewerImageRef = [];
    constructor(props) {
        super(props);
        this.state = ({
            pictureData: null,
            convertedPictureData: [],
            currentPictureIndex: 0,
            isShowDelete: false,
            typeGallery:null,
            productID : null,
            photoId : null,
            data : null,
            inboundId: null,
            respondBackend :'',
            updateLoadImage: false,
        });
        this.handleOnChangeImage.bind(this);
        this.renderImage.bind(this);
        this.handleDelete.bind(this);
    }
    static getDerivedStateFromProps(props,state){
        const {addPhotoProofID, navigation} = props;
        const {pictureGallery, inboundId} = state;
        // only one instance of multi camera can exist before submited
        if(inboundId === null){
            const {routes, index} = navigation.dangerouslyGetState();
            if(routes[index].params !== undefined && routes[index].params.inboundId !== undefined && routes[index].params.photoId !== undefined){
                return {...state,inboundId:routes[index].params.inboundId, data:routes[index].params.receivedPhotoId, photoId : routes[index].params.photoId,currentPictureIndex:routes[index].params.index, productID: routes[index].params.productId };
             } 
        } 
        console.log(state.currentPictureIndex);
        return {...state};
       }
       shouldComponentUpdate(nextProps, nextState) {
        if(this.state.currentPictureIndex !== nextState.currentPictureIndex && nextState.updateLoadImage === false){
            return false;
        }
        return true;
      }
    componentDidUpdate(prevProps, prevState){
        // if(this.state.pictureData === null){
        //     this.props.navigation.navigate('SingleCamera');
        // } else if(this.state.pictureData.length === 0) {
        //     this.props.addPhotoProofPostpone(null);
        //     this.props.navigation.navigate('SingleCamera');
        // } else {
        //     if(prevState.pictureData.length !== this.state.pictureData.length){
        //         this.props.addPhotoProofUpdate(this.state.pictureData);
        //     }
        // }
      if(prevState.updateLoadImage !== this.state.updateLoadImage && this.state.updateLoadImage === true){
        if(this.state.convertedPictureData.length > 0){
            if(this.viewerImageRef[  this.state.currentPictureIndex] !== undefined)
            this.viewerImageRef[  this.state.currentPictureIndex].init(); 
            this.flatlist.scrollToIndex({index:this.state.currentPictureIndex,animated:true});
        } else {
            this.props.navigation.goBack();
        }
        // if(this.viewerImageRef[  this.state.currentPictureIndex] !== undefined && this.viewerImageRef[  this.state.currentPictureIndex].checkPreload() === true)
        // this.viewerImageRef[  this.state.currentPictureIndex].init(); 
        this.setState({updateLoadImage:false});
      }
    }
    async componentDidMount() {

        let galleryDump = [];
        for (let index = 0; index < this.state.data.length; index++) {
            const element = this.state.data[index];
            galleryDump.push(element);
        }
        this.setState({convertedPictureData: galleryDump});
        // if(this.props.route.params.index !== undefined) {
        //     this.setState({
        //         currentPictureIndex: this.props.route.params.index ,
        //     });     
        // }
      
    }


    handleShowDelete = () => {
        this.setState({isShowDelete: !this.state.isShowDelete})
    }

    handleDelete = async () => {
        let respondbackend = '';
        const {pictureData, convertedPictureData, currentPictureIndex} = this.state;
        // let typeAPI = this.state.typeGallery === 'received' ? 'receivePhoto' : 'processingPhoto';
        console.log(convertedPictureData[currentPictureIndex]);
        const result = await deleteData('/inboundsMobile/'+this.state.inboundId+'/'+this.state.productID+'/product-photos/'+convertedPictureData[currentPictureIndex]);
        if(typeof result === 'object' && result.error === undefined){
             respondbackend = result;
           } else {
             respondbackend = result.error;
           }
           console.log(convertedPictureData.filter((element,index) => index !== currentPictureIndex));
        this.setState({
            respondBackend: respondbackend,
            convertedPictureData : convertedPictureData.filter((element,index) => index !== currentPictureIndex),
            currentPictureIndex: currentPictureIndex > 0 ? currentPictureIndex -1 : 0,
            updateLoadImage: true,
        });     
         this.handleShowDelete();
    }

    handleOnChangeImage = ({viewableItems, changed}) => {
        const {currentPictureIndex} = this.state;
        viewableItems.forEach(element => {
            if(this.viewerImageRef[  element.index] !== undefined && this.viewerImageRef[  element.index].checkPreload() === true)
            this.viewerImageRef[  element.index].init(); 
            this.setState({currentPictureIndex:element.index === currentPictureIndex ? currentPictureIndex: element.index});
        });
    }
    renderImage = ({item,index}) => {
         
        return(   
        <ImageZoom cropWidth={window.width}
        cropHeight={window.height/2}
        imageWidth={window.width}
        imageHeight={window.height/2}>
            <ImageLoading 
            ref={ ref => {
                this.viewerImageRef[index] = ref;
            }} 
            callbackToFetch={async (indicatorTick)=>{
                return await getBlob('/inboundsMobile/'+this.state.inboundId+'/'+this.state.productID+'/product-photos/'+item+'/full',(received, total) => {
                    // if(this.viewerImageRef[index] !== null)
                    // this.viewerImageRef[index].
                    indicatorTick(received)
                })
            }}
            containerStyle={{width: window.width, height: window.height/2}}
            style={{width: '100%', height: '100%',backgroundColor:'black'}}
            imageStyle={{}}
            imageContainerStyle={{width: '100%', height: '100%'}}
            />  
            <Image style={{backgroundColor:'black', flex:1}}/>
        </ImageZoom>
        );
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
                    <View style={styles.respondContainer}>
                            <Text style={{...Mixins.subtitle3,lineHeight:21,fontWeight: '400',color:'red'}}>{this.state.respondBackend}</Text>
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
        paddingBottom:60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    respondContainer: {
        paddingVertical:20,
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
        photoProofList: state.originReducer.photoProofList,
        photoProofPostpone: state.originReducer.photoProofPostpone,
    };
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        reset: () => dispatch({type: 'RESET'}),
        photoProofSubmittedHandler : (proof) => dispatch({type:'PhotoProof',payload:proof}),
        addPhotoProofList: (uri) => dispatch({type: 'PhotoProofList', payload: uri}),
        addPhotoProofPostpone: (uri) => dispatch({type: 'PhotoProofPostpone', payload: uri}),
        addPhotoProofUpdate: (data) => dispatch({type: 'PhotoProofUpdate', payload: data}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnlargeImage);