import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Card} from 'react-native-elements';
import {connect} from 'react-redux';
import mixins from '../../../mixins';
// component
import DetailList from '../../../component/extend/Card-detail';
import {TouchableOpacity} from 'react-native-gesture-handler';

class ConnoteReportDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Damage Item',
      note: 'Theres some crack on packages',
    };
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Report Details</Text>
          </View>
          <View style={styles.body}>
            <Card containerStyle={styles.cardContainer} style={styles.card}>
              <View style={styles.header}>
                <Text
                  style={[
                    styles.headerTitle,
                    {marginBottom: 10, color: '#E03B3B', fontSize: 20},
                  ]}>
                  {this.state.title}
                </Text>
              </View>
              <View style={styles.detail}>
                <DetailList title="Report By" value="Kim Tan" />
                <DetailList title="Date and Time" value="12/03/21 13:05 P.M" />
                <Text style={styles.detailText}>Note</Text>
                <TextInput
                  style={styles.note}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={this.state.note}
                />
              </View>
            </Card>
          </View>
          <TouchableOpacity style={styles.changeButton} disabled={true}>
            <Text style={styles.changeButtonText}>Change Total Quantity</Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...mixins.subtitle3,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#424141',
  },
  body: {
    flex: 1,
  },
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 0,
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
  detailText: {
    ...mixins.subtitle3,
    color: '#6C6B6B',
  },
  note: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    color: '#6C6B6B',
  },
  changeButton: {
    backgroundColor: '#F07120',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  changeButtonText: {
    ...mixins.subtitle3,
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnoteReportDetails);
