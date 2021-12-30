import React from 'react';
import {ScrollView, StatusBar, StyleSheet} from 'react-native';
import {Card} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {TextList} from '../../../../component/extend/Text-list';
// helper
import {productGradeToString} from '../../../../component/helper/string';
// style
import Mixins from '../../../../mixins';

class RelocationRequestItemDetails extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <SafeAreaProvider style={{flex: 1}}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body}>
          {this.props.selectedRequestRelocation.map((item) => (
            <Card containerStyle={styles.cardContainer} key={item.id}>
              <TextList title="Warehouse" value={item.warehouse.warehouse} />
              <TextList title="Location" value={item.warehouse.locationId} />
              <TextList title="Client" value={item.client.name} />
              <TextList title="Item Code" value={item.product.item_code} />
              <TextList title="Description" value={item.product.description} />
              <TextList title="Quantity" value={item.quantity} />
              <TextList title="UOM" value={item.productUom.packaging} />
              <TextList
                title="Grade"
                value={productGradeToString(item.grade)}
              />
            </Card>
          ))}
        </ScrollView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    paddingTop: 20,
    flex: 1,
  },
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    marginHorizontal: 20,
    marginTop: 10,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardTitle: {
    ...Mixins.subtitle1,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 5,
  },
  relocateToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
  },
  inputFormContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inputFormTitle: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    paddingHorizontal: 10,
    height: 40,
  },
  inputText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
  },
  button: {
    ...Mixins.bgButtonPrimary,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  smallButton: {
    ...Mixins.bgButtonPrimary,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  dropdownButton: {
    width: '100%',
    maxHeight: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ABABAB',
    backgroundColor: 'white',
    paddingHorizontal: 0,
  },
  dropdownButtonText: {
    paddingHorizontal: 10,
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#424141',
    textAlign: 'left',
    paddingHorizontal: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  navigationText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#121C78',
    textDecorationColor: '#121C78',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  text: {
    ...Mixins.subtitle3,
    lineHeight: 21,
  },
});

function mapStateToProps(state) {
  return {
    selectedRequestRelocation:
      state.originReducer.filters.selectedRequestRelocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RelocationRequestItemDetails);
