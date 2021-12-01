import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Card, Overlay} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {TextList} from '../../../../component/extend/Text-list';
import Banner from '../../../../component/banner/banner';
//style
import Mixins from '../../../../mixins';

const screen = Dimensions.get('window');

class ReassignStockTakeCount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operatorList: OPERATORLIST,
      selectedOperator: null,
      isShowModal: false,
      errorMessage: '',
    };
  }

  handleShowModal = (data, value) => {
    this.setState({
      selectedOperator: data ?? null,
      isShowModal: value ?? false,
    });
  };

  handleModalAction = (action) => {
    if (action) {
      this.props.navigation.navigate('StockTakeCountList');
    }
    this.handleShowModal();
  };

  render() {
    const {errorMessage, isShowModal, operatorList, selectedOperator} =
      this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        {errorMessage !== '' && (
          <Banner title={error} closeBanner={this.closeBanner} />
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Reassign Job To</Text>
          </View>
          {operatorList !== null &&
            operatorList.map((data, index) => (
              <Card containerStyle={styles.cardContainer} key={index}>
                <TextList title="Operator" value={data.name} />
                <TextList title="Total Job" value={data.totalJob} />
                <Button
                  title="Assign"
                  buttonStyle={styles.button}
                  onPress={() => this.handleShowModal(data, true)}
                />
              </Card>
            ))}
        </ScrollView>
        {isShowModal && selectedOperator !== null && (
          <Overlay
            fullScreen={false}
            overlayStyle={styles.containerStyleOverlay}
            isVisible={isShowModal}>
            <Text style={styles.confirmText}>
              {`Are you sure sure you want to Assign to ${selectedOperator.name}?`}
            </Text>
            <View style={styles.cancelButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {borderWidth: 1, borderColor: '#ABABAB'},
                ]}
                onPress={() => this.handleModalAction(false)}>
                <Text style={[styles.cancelText, {color: '#ABABAB'}]}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, {backgroundColor: '#F07120'}]}
                onPress={() => this.handleModalAction(true)}>
                <Text style={[styles.cancelText, {color: '#FFF'}]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </Overlay>
        )}
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    flex: 1,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    ...Mixins.subtitle3,
    color: '#424141',
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginTop: 10,
    borderRadius: 5,
  },
  containerStyleOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: screen.height * 0.3,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  confirmText: {
    ...Mixins.subtitle3,
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  cancelText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  cancelButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cancelButton: {
    width: '40%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

const OPERATORLIST = [
  {name: 'Joe Cheng', totalJob: 12},
  {name: 'Charles Zoe', totalJob: 9},
];

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReassignStockTakeCount);
