import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Card, Button} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
// component
import {TextList} from '../../../../component/extend/Text-list';
import ExpandableCard from '../../../../component/extend/ListItem-relocation-details';
// helper
import Format from '../../../../component/helper/format';
//style
import Mixins from '../../../../mixins';
// icon

class RelocationItemDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relocationDetails: this.props.route.params?.relocationDetails ?? null,
    };
  }

  componentDidMount() {}

  render() {
    const {relocationDetails} = this.state;
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <Card containerStyle={styles.cardContainer}>
            <TextList
              title="Warehouse"
              value={relocationDetails.warehouseNameFroms[0]}
            />
            <TextList
              title="Job Request Date"
              value={Format.formatDate(relocationDetails.createdOn)}
            />
            <TextList
              title="Client"
              value={relocationDetails.clientNameFroms[0]}
            />
            <TextList
              title="Location"
              value={relocationDetails.locationFroms[0]}
            />
          </Card>
          <Text style={styles.title}>Product</Text>
          <View style={{marginBottom: 10}}>
            {relocationDetails.productStorageFroms.map((item, index) => (
              <ExpandableCard
                item={item}
                reasonCode={relocationDetails.reasonCode}
                remark={relocationDetails.remark}
                key={index}
              />
            ))}
          </View>
        </ScrollView>
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
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 23,
    marginHorizontal: 20,
    marginTop: 10,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
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
  button: {
    ...Mixins.bgButtonPrimary,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  reportButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6C6B6B',
  },
  reportButtonText: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
    color: '#E03B3B',
  },
});

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RelocationItemDetails);
