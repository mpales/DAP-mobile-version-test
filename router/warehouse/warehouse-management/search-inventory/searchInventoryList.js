import React from 'react';
import {FlatList, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
//component
import ListItemSearchInventory from '../../../../component/extend/ListItem-search-inventory-result';
//style
import Mixins from '../../../../mixins';

class SearchInventoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouse: this.props.route.params?.warehouse ?? null,
      locationId: this.props.route.params?.locationId ?? null,
      selectedSortBy: null,
      searchResult: SEARCHRESULT,
    };
  }

  navigateToDetails = () => {
    this.props.navigation.navigate('SearchInventoryDetails');
  };

  render() {
    const {warehouse, locationId, searchResult, selectedSortBy} = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.headerContainer}>
          <Text style={styles.text}>Sort By</Text>
          <View style={styles.pickerContainer}>
            <Picker
              mode="dialog"
              selectedValue={selectedSortBy}
              onValueChange={(value) => this.setState({selectedSortBy: value})}
              style={{maxWidth: 150}}>
              <Picker.Item
                label="Location"
                value="Location"
                style={styles.text}
              />
              <Picker.Item
                label="Quantity"
                value="Quantity"
                style={styles.text}
              />
            </Picker>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexShrink: 1,
              }}>
              <Text style={styles.text}>Results</Text>
              <Text
                style={[
                  styles.text,
                  styles.textBlue,
                  {marginLeft: 20, flexWrap: 'wrap'},
                ]}>
                {`${warehouse} ${locationId}`}
              </Text>
            </View>
            <Text style={[styles.text, styles.textBlue]}>
              {`${searchResult === null ? 0 : searchResult.length} Result`}
            </Text>
          </View>
        </View>
        {searchResult === null ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.title}>No result</Text>
          </View>
        ) : (
          <FlatList
            data={searchResult}
            renderItem={({item, index}) => (
              <ListItemSearchInventory
                item={item}
                navigate={this.navigateToDetails}
              />
            )}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
          />
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
  headerContainer: {
    padding: 20,
  },
  title: {
    ...Mixins.subtitle3,
    fontSize: 18,
    lineHeight: 25,
  },
  text: {
    ...Mixins.subtitle3,
    fontSize: 14,
    lineHeight: 21,
  },
  textBlue: {
    color: '#2A3386',
  },
  pickerContainer: {
    width: 150,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D5D5D5',
    marginTop: 5,
    marginBottom: 10,
  },
});
const SEARCHRESULT = [
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L145',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L146',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L147',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L148',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L149',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L110',
  },
  {
    warehouse: 'KEPPEL',
    location: 'JP4 B-L150',
  },
];

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchInventoryList);
