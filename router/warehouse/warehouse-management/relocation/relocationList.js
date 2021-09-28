import React from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Badge, Button, SearchBar} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
//component
import Relocation from '../../../../component/extend/ListItem-relocation';
//style
import Mixins from '../../../../mixins';
import moment from 'moment';

class RelocationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      filterStatus: 'All',
    };
    this.handleFilterStatus.bind(this);
    this.updateSearch.bind(this);
  }

  updateSearch = (search) => {
    this.setState({search});
  };

  handleFilterStatus = (value) => {
    this.setState({filterStatus: value});
  };

  navigateToDetails = () => {
    this.props.setBottomBar(false);
    this.props.navigation.navigate('RelocationDetails');
  };

  navigateToRequestRelocation = () => {
    this.props.setBottomBar(false);
    this.props.navigation.navigate('RequestRelocation');
  };

  render() {
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 15,
            paddingHorizontal: 20,
          }}>
          <Text style={styles.searchTitle}>Search</Text>
          <Button
            buttonStyle={{
              ...Mixins.bgButtonPrimary,
              paddingTop: 0,
              paddingBottom: 0,
            }}
            title="Request Relocation"
            titleStyle={{...Mixins.subtitle3, lineHeight: 20}}
            onPress={this.navigateToRequestRelocation}
          />
        </View>
        <SearchBar
          onChangeText={this.updateSearch}
          value={this.state.search}
          lightTheme={true}
          inputStyle={styles.searchInputText}
          searchIcon=""
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
        />
        <ScrollView
          style={styles.badgeContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <Badge
            value="All"
            onPress={() => this.handleFilterStatus('All')}
            badgeStyle={
              this.state.filterStatus === 'All'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'All'
                ? styles.badgeTextSelected
                : styles.badgeText
            }
          />
          <Badge
            value="Waiting"
            onPress={() => this.handleFilterStatus('Waiting')}
            badgeStyle={
              this.state.filterStatus === 'Waiting'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'Waiting'
                ? styles.badgeTextSelected
                : styles.badgeText
            }
          />
          <Badge
            value="Received"
            onPress={() => this.handleFilterStatus('In Progress')}
            badgeStyle={
              this.state.filterStatus === 'In Progress'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'In Progress'
                ? styles.badgeTextSelected
                : styles.badgeText
            }
          />
          <Badge
            value="Processing"
            onPress={() => this.handleFilterStatus('Completed')}
            badgeStyle={
              this.state.filterStatus === 'Completed'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'Completed'
                ? styles.badgeTextSelected
                : styles.badgeText
            }
          />
        </ScrollView>
        <FlatList
          data={STOCK}
          renderItem={({item, index}) => (
            <Relocation item={item} navigate={this.navigateToDetails} />
          )}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
        />
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
  searchTitle: {
    ...Mixins.subtitle3,
    lineHeight: 20,
    color: '#424141',
  },
  searchInputText: {
    ...Mixins.subtitle3,
    lineHeight: 14,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D5D5D5',
    height: 35,
  },
  search: {
    alignItems: 'flex-end',
  },
  badgeContainer: {
    flex: 1,
    minHeight: 25,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 20,
    minHeight: 25,
  },
  badge: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#121C78',
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 50,
  },
  badgeSelected: {
    flex: 1,
    backgroundColor: '#F07120',
    marginHorizontal: 2,
    paddingHorizontal: 5,
    borderRadius: 50,
  },
  badgeText: {
    ...Mixins.subtitle3,
    color: '#121C78',
  },
  badgeTextSelected: {
    ...Mixins.subtitle3,
    color: 'white',
  },
});
const STOCK = [
  {
    jobId: '09123',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
    status: 'Waiting',
  },
  {
    jobId: '09123',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
    status: 'Waiting',
  },
  {
    jobId: '09123',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
    status: 'Waiting',
  },
  {
    jobId: '09123',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
    status: 'Waiting',
  },
  {
    jobId: '09123',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
    status: 'Waiting',
  },
  {
    jobId: '09123',
    jobDate: moment().subtract(1, 'days').unix(),
    client: 'BG5G',
    warehouse: 'KEPPEL',
    itemCode: '342035002',
    description: 'ERGOBLOM V2 BLUE DESK',
    quantity: 30,
    fromLocation: 'JP2 C05-002',
    toLocation: 'JP1-0004',
    status: 'Waiting',
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

export default connect(mapStateToProps, mapDispatchToProps)(RelocationList);
