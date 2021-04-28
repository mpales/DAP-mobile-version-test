import React from 'react';
import {Avatar, Text, Button} from 'react-native-elements';
import {View,Switch} from 'react-native';
import IconPaperMobile from '../../../assets/icon/iconmonstr-paper-plane-2mobile.svg';
import IconSpeechMobile from '../../../assets/icon/iconmonstr-speech-bubble-26mobile.svg';
import IconVector from '../../../assets/icon/Vector.svg';
import {connect} from 'react-redux';
import Mixins from '../../../mixins';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 25}}>
        <View style={styles.sectionHeadPackage}>
          <Text style={styles.headTitle}>Settings</Text>
          <Text style={styles.headSubtitle}>lorem ipsum dolor sit amet</Text>
        </View>
      
        <View style={styles.sectionPackage}>
          <Text style={styles.titlePackage}>GPS Related Stuff</Text>
          <View style={styles.sectionDividier}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Traffic</Text>
              <View style={styles.switchWrapper}> 
                  <Switch onValueChange={(value) => this.props.setTraffic(value)}
                    value={this.props.isTraffic}
                />
                </View>

            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Geo Location Fuse</Text>
              <View style={styles.switchWrapper}> 
              <Switch onValueChange={(value) => this.props.setTraffic(value)}
                    value={this.props.isTraffic}
                />
              </View>
            </View>
          </View>
          <View style={styles.sectionDividierRight}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Calculate using API</Text>
              <View style={styles.switchWrapper}> 
                  <Switch onValueChange={(value) => this.setTraffic(value)}
                    value={this.props.isTraffic}
                />
                </View>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Sort by Server</Text>
              <View style={styles.switchWrapper}> 
              <Switch onValueChange={(value) => this.setTraffic(value)}
                    value={this.props.isTraffic}
                />
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
    isTraffic: state.filters.isTraffic,
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
