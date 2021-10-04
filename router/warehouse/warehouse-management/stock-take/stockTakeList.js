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
import StockTakeItem from '../../../../component/extend/ListItem-stock-take';
//style
import Mixins from '../../../../mixins';
import moment from 'moment';

class StockTakeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobList: STOCKTAKEJOB,
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

  renderEmpty = () => {
    return (
      <View
        style={{
          marginTop: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{...Mixins.subtitle3}}>No Job List</Text>
      </View>
    );
  };

  render() {
    const {jobList} = this.state;
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
            value="In Progress"
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
            value="Pending Review"
            onPress={() => this.handleFilterStatus('Pending Review')}
            badgeStyle={
              this.state.filterStatus === 'Pending Review'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'Pending Review'
                ? styles.badgeTextSelected
                : styles.badgeText
            }
          />
          <Badge
            value="Reported"
            onPress={() => this.handleFilterStatus('Reported')}
            badgeStyle={
              this.state.filterStatus === 'Reported'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'Reported'
                ? styles.badgeTextSelected
                : styles.badgeText
            }
          />
          <Badge
            value="Recount"
            onPress={() => this.handleFilterStatus('Recount')}
            badgeStyle={
              this.state.filterStatus === 'Recount'
                ? styles.badgeSelected
                : styles.badge
            }
            textStyle={
              this.state.filterStatus === 'Recount'
                ? styles.badgeTextSelected
                : styles.badgeText
            }
          />
          <Badge
            value="Completed"
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
          data={jobList}
          renderItem={({item, index}) => (
            <StockTakeItem item={item} navigate={this.navigateToDetails} />
          )}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={this.renderEmpty}
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
    maxHeight: 25,
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

const STOCKTAKEJOB = [
  {
    date: moment().subtract(1, 'days').unix(),
    jobId: 'JOB ID 1951541',
    clientName: 'WORKEDGE',
    clientCode: 'WE-12323412',
    warehouse: 'Warehouse KEPPEL-GE',
    status: 'Waiting',
  },
  {
    date: moment().subtract(1, 'days').unix(),
    jobId: 'JOB ID 1566741',
    clientName: 'B5SG',
    clientCode: 'GW-3412323412',
    warehouse: 'Warehouse KEPPEL-GE',
    status: 'In Progress',
  },
  {
    date: moment().subtract(1, 'days').unix(),
    jobId: 'JOB ID 1951541',
    clientName: 'WORKEDGE',
    clientCode: 'WE-12323412',
    warehouse: 'Warehouse KEPPEL-GE',
    status: 'Pending Review',
  },
  {
    date: moment().subtract(1, 'days').unix(),
    jobId: 'JOB ID 1951541',
    clientName: 'GINNY',
    clientCode: 'JI-1232653412',
    warehouse: 'Warehouse KEPPEL-GE',
    status: 'Completed',
  },
  {
    date: moment().subtract(1, 'days').unix(),
    jobId: 'JOB ID 1951541',
    clientName: 'WORKEDGE',
    clientCode: 'WE-12323412',
    warehouse: 'Warehouse KEPPEL-GE',
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

export default connect(mapStateToProps, mapDispatchToProps)(StockTakeList);
