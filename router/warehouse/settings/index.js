import React from 'react';
import {Avatar, Text, Button} from 'react-native-elements';
import {View,Switch} from 'react-native';
import {connect} from 'react-redux';
import Mixins, {themeStoreContext} from '../../../mixins';
import {observer} from 'mobx-react';
import OfflineMode from '../../../component/linked/offlinemode';

@observer
class Settings extends React.Component {
  static contextType = themeStoreContext;
  constructor(props) {
    super(props);
    this.state = {
      dark : false,
    };
    
  }
  componentDidMount() {
    if(this.context.theme === 'light'){
      this.setState({dark:false})
    } else {
      this.setState({dark:true})
    }
  }
  changeThemeDefault = (value)=> {
    if(value){
      this.context.setDefaultThemes('dark');
      this.setState({dark: true});
    } else {
      this.context.setDefaultThemes('light');
      this.setState({dark: false});
    }
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: this.context._Scheme5, paddingHorizontal: 25}}>
           <OfflineMode/>
        <View style={styles.sectionHeadPackage}>
          <Text style={{...styles.headTitle,color:this.context._Scheme7}}>Settings</Text>
          <Text style={{...styles.headSubtitle,color:this.context._Scheme7}}>lorem ipsum dolor sit amet</Text>
        </View>
      
        <View style={styles.sectionPackage}>
          <Text style={{...styles.titlePackage,color:this.context._Scheme7}}>Theme Options</Text>
          <View style={styles.sectionDividier}>
            <View style={styles.dividerContent}>
              <Text style={{...styles.labelPackage,color:this.context._Scheme7}}>dark</Text>
              <View style={styles.switchWrapper}> 
                  <Switch onValueChange={this.changeThemeDefault}
                    value={this.state.dark}
                />
                </View>

            </View>
            <View style={styles.dividerContent}>
              <Text style={{...styles.labelPackage,color:this.context._Scheme7}}>Others</Text>
              <View style={styles.switchWrapper}> 
            
              </View>
            </View>
          </View>
        
        </View>
        <View style={styles.sectionButton}>
          <Button
            buttonStyle={styles.navigationButton}
            titleStyle={styles.deliveryText}
            title="Submit"
          />
        </View>
      </View>
    );
  }
}

const styles = {
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
    marginVertical: 24,
    marginHorizontal: 20,
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
    marginHorizontal: 5,
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
    marginHorizontal: 5,
  },
  legendLabel: {
    flexShrink: 1,
...Mixins.subtitle1,
lineHeight: 16,
    color: '#6C6B6B',
  },
  sectionInfo: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 5,
  },
  markerIcon: {
    flexShrink: 1,
    marginRight: 20,
  },
  markerLabel: {
    color: '#6C6B6B',
    ...Mixins.body3,
    fontHeight: 18,
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
  switchWrapper: {alignItems:'flex-start'}
};

function mapStateToProps(state) {
  return {
    isTraffic: state.originReducer.filters.isTraffic,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTraffic: (toggle) => {
      return dispatch({type: 'TrafficToggle', payload: toggle});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
