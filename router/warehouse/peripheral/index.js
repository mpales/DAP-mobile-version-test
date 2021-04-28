import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import {
Button
} from 'react-native-elements'
import BottomSheet from 'reanimated-bottom-sheet';
import BarCode from '../../../component/camera/filter-barcode';
import Mixins from '../../../mixins';
import {connect} from 'react-redux';
const screen = Dimensions.get('screen');

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
    };
    this.renderBarcode.bind(this);
  }

  renderInner = () => (
    <View style={styles.sheetContainer}>
    <View style={styles.sectionSheetDetail}>
      <View style={styles.detailContent}>
      <Text style={styles.barcodeText}>{this.state.dataCode}</Text>
      <Text style={styles.barcodeDesc}>大包号 : 01487595</Text>
      </View>
      <View style={styles.sheetPackages}>
          <View style={styles.sectionDividier}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Name</Text>
              <Text style={styles.infoPackage}>Yan Ting</Text>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Number Packages</Text>
              <Text style={styles.infoPackage}>2</Text>
            </View>
          </View>
          <View style={styles.sectionDividier}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Description</Text>
              <Text style={styles.infoPackage}>Chair</Text>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Qty</Text>
              <Text style={styles.infoPackage}>8/20</Text>
            </View>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>KG</Text>
              <Text style={styles.infoPackage}>10 kg</Text>
            </View>
          </View>
          <View style={styles.sectionDividier}>
            <View style={styles.dividerContent}>
              <Text style={styles.labelPackage}>Deliver To</Text>
              <Text style={styles.infoPackage}>A1</Text>
            </View>
          </View>
      </View>
      <View style={styles.buttonSheet}>
      <Button
              containerStyle={{flex:1,alignSelf: 'flex-start', marginVertical:40}}
              buttonStyle={styles.navigationButton}
              titleStyle={styles.deliveryText}
              onPress={()=>{
                this.props.dispatchCompleteManifest(true);
                this.props.navigation.navigate('List')
              }}
              title="Confirm"
            />
      </View>
    </View>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
    <View style={styles.panelHeader}>
      <View style={styles.panelHandle} />
    </View>
  </View>
  );

  renderBarcode = (barcode) => {
    if (barcode.length > 0 && barcode[0].data.length > 0) {
      this.setState({dataCode: barcode[0].data});
      return this.bs.current.snapTo(2);
    }
    if (this.state.dataCode !== '0') {
      return this.bs.current.snapTo(2);
    }
    return this.bs.current.snapTo(0);
  };
  bs = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[screen.height * 0.1, screen.height * 0.5, screen.height * 0.2]}
          enabledGestureInteraction={true}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={1}
        />
        <TouchableWithoutFeedback onPress={() => this.bs.current.snapTo(1)}>
          <BarCode renderBarcode={this.renderBarcode} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
  search: {
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: screen.height * 0.6,
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 120,
    height: 7,
    backgroundColor: '#C4C4C4',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  sheetContainer: {
    backgroundColor: 'white',
   
    height: screen.height * 0.5,
  },
  sectionSheetDetail: {
    flexGrow: 1,
    flexDirection: 'column',
    marginHorizontal: 32,
  },
  detailContent: {
    flexShrink: 1,
    flexDirection: 'column',
    marginTop: 19,
  },
  barcodeText: {
    ...Mixins.h5,
    lineHeight: 27,
  },
  barcodeDesc: {
    ...Mixins.body3,
    fontWeight: '400',
    lineHeight: 21,
  },
  sectionDividier: {
    flexDirection: 'row',
  },
  dividerContent: {
    flexDirection: 'column',
    flex: 1,
    marginVertical: 8,
  },
  
  labelPackage: {
    ...Mixins.subtitle3,
    color: '#000000',
    lineHeight: 21,
  },
  infoPackage: {
    ...Mixins.subtitle3,
    fontWeight: '400',
    lineHeight: 21,
    color: '#ABABAB',
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
  sheetPackages: {
    flexShrink: 1,
  },
  buttonSheet: {
    flexGrow: 1,
    flexDirection:'row',
  }
});

function mapStateToProps(state) {
  return {
    ManifestCompleted: state.filters.manifestCompleted,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchCompleteManifest: (bool) => {
      return dispatch({type: 'ManifestCompleted', payload: bool});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
