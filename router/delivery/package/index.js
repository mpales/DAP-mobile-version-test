import React from 'react';
import {Avatar, Text, Button} from 'react-native-elements';
import {View, ScrollView} from 'react-native';
import IconPaperMobile from '../../../assets/icon/iconmonstr-paper-plane-2mobile.svg';
import IconSpeechMobile from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconVector from '../../../assets/icon/Vector.svg';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';

class Packages extends React.Component {
  constructor(props) {
    super(props);
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    const singleData = this.props.dataPackage[routes[index].params.index];
    this.state = {
      singleData: singleData,
      indexPackage : routes[index].params.index,
    };
  }
  componentDidMount(){
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    const singleData = this.props.dataPackage[routes[index].params.index];
    this.setState({singleData:singleData,indexPackage:routes[index].params.index});
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    const {routes, index} = this.props.navigation.dangerouslyGetState();
    const singleData = this.props.dataPackage[routes[index].params.index];
    if(this.state.indexPackage !== routes[index].params.index)
    this.setState({singleData:singleData,indexPackage:routes[index].params.index});
  }

  render() {
    const {named,packages,Address,list} = this.state.singleData;
    console.log(this.state.singleData);
    return (
      <ScrollView style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 10}}>
       {!this.props.startDelivered && (
         <>
              <View style={styles.sectionHeadPackage}>
              <Text style={styles.headTitle}>{named}</Text>
              </View>
              <View style={styles.sectionLegend}>
              <View style={styles.sectionMarker}>
                <Avatar
                  size="small"
                  rounded
                  containerStyle={styles.markerPoint}
                  title="A"
                  overlayContainerStyle={{backgroundColor: '#F1811C'}}
                />
                <Text style={styles.legendLabel}>Drop off</Text>
              </View>
              <View style={styles.sectionInfo}>
                <View style={styles.markerIcon}>
                  <IconPaperMobile height="15" width="15" fill="#7177AE" />
                </View>
                <Text style={styles.markerLabel}>
                 {Address}
                </Text>
              </View>
              <View style={styles.sectionInfo}>
                <View style={styles.markerIcon}>
                  <IconVector height="15" width="15" fill="#7177AE" />
                </View>
                <Text style={styles.markerTime}>09.00 -10.00 a.m</Text>
              </View>
              <View style={styles.sectionInfo}>
                <View style={styles.markerIcon}>
                  <IconSpeechMobile height="15" width="15" fill="#7177AE" />
                </View>
                <Text style={styles.markerLabel}>
                  Delivery Instruction Put in the lobby only
                </Text>
              </View>
              </View>
              </>
       )}
         { list.map((element, i) => 
                <View style={styles.sectionPackage}>
                  <Text style={styles.headSubtitle}>{element.id}</Text>
                    <Text style={styles.titlePackage}>Package Detail</Text>
                    <View style={styles.sectionDividier}>
                      <View style={[styles.dividerContent,{flex:2}]}>
                        <Text style={styles.labelPackage}>Package Number</Text>
                        <Text style={styles.infoPackage}>{element.package}</Text>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>Weight</Text>
                        <Text style={styles.infoPackage}>{element.weight}</Text>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelPackage}>CBM</Text>
                        <Text style={styles.infoPackage}>{element.CBM}</Text>
                      </View>
                    </View>
            
                  </View>
          )}
       
        {!this.props.startDelivered && (
        <View style={styles.sectionButton}>
          <Button
            buttonStyle={styles.navigationButton}
            titleStyle={styles.deliveryText}
            title="Start delivery"
          />
        </View>)}
      </ScrollView>
    );
  }
}

const styles = {
  sectionButton: {
    marginVertical: 25,
  },
  filterContainer: {
    flexShrink: 1,
    marginVertical: 15,
    flexDirection: 'column',
  },
  sectionSort: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  badgeSort: {
    paddingHorizontal: 5,
  },
  sectionPackage: {
    flexDirection: 'column',
    flexShrink: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    
    elevation: 6,
  },
  titlePackage: {
    ...Mixins.h4,
    lineHeight: 21,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  sectionDividierRight: {
    flexDirection: 'row',
  },
  dividerContent: {
    flexDirection: 'column',
    flex: 1,
    marginVertical: 8,
  },
  labelPackage: {
    ...Mixins.subtitle3,
    color: '#424141',
  },
  infoPackage: {
    ...Mixins.body3,
    fontWeight: '400',
    lineHeight: 18,
  },
  buttonDivider: {
    flex: 1,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  navigationButton: {
    backgroundColor: '#121C78',
    borderRadius: 5,
  },
  sectionHeadPackage: {
    flexDirection: 'column',
    marginHorizontal: 25,
    marginTop: 25,
  },
  headTitle: {
    ...Mixins.h4,
    lineHeight: 21,
  },
  headSubtitle: {
    ...Mixins.subtitle1,
  lineHeight: 16,
  },
  sectionLegend: {
    flexDirection: 'column',
    marginBottom: 30,
    marginTop: 13,
    marginHorizontal: 25,
  },
  legendLabel: {
    flexShrink: 1,
...Mixins.subtitle1,
lineHeight: 16,
    color: '#6C6B6B',
  },
  sectionInfo: {
    flexDirection: 'row',
    marginHorizontal: 35,
    marginVertical: 5,
  },
  markerIcon: {
    flexShrink: 1,
    marginRight: 20,
  },
  markerLabel: {
    color: '#6C6B6B',
    ...Mixins.body3,
    lineHeight: 18,
    fontWeight: '400',
  },
  markerTime: {
    color: '#F07120',
    ...Mixins.body3,
    lineHeight: 18,
    fontWeight: '400',
  },
  markerPoint: {
    flexShrink: 1,
    marginRight: 10,
  },
  sectionMarker: {
    flexDirection: 'row',
    marginVertical: 15,
  },
};

function mapStateToProps(state) {
  return {
    bottomBar: state.originReducer.filters.bottomBar,
    startDelivered : state.originReducer.filters.onStartDelivered,
    dataPackage: state.originReducer.route.dataPackage,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Packages);
