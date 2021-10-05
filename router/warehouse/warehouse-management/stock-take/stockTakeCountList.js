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
import StockTakeCountItem from '../../../../component/extend/ListItem-stock-take-count';
//style
import Mixins from '../../../../mixins';

class StockTakeCountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobData: this.props.route.params?.jobData ?? null,
      stockTakeCountList: STOCKTAKECOUNT,
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
    const {stockTakeCountList, jobData} = this.state;
    return (
      <SafeAreaProvider style={styles.body}>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
            paddingHorizontal: 20,
          }}>
          {jobData !== null && (
            <>
              <View>
                <Text style={styles.text}>{jobData.jobId}</Text>
                <Text style={styles.text}>{jobData.clientName}</Text>
                <Text style={styles.text}>{jobData.warehouse}</Text>
              </View>
              <View>
                <Text style={styles.text}>{jobData.date}</Text>
                <Text style={styles.text}>{jobData.clientCode}</Text>
              </View>
            </>
          )}
        </View>
        <SearchBar
          placeholder="Search"
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
          data={stockTakeCountList}
          renderItem={({item, index}) => (
            <StockTakeCountItem item={item} navigate={this.navigateToDetails} />
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
  text: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#424141',
    fontWeight: '500',
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

const STOCKTAKECOUNT = [
  {
    warehouse: 'KEPPEL',
    status: 'Waiting',
    location: 'JP2 C05-002',
    pallet: 'JP2 C05-002',
    itemCode: '561961',
    description: 'DAP ITEMS',
    quantity: '2000',
    UOM: 'PCS',
    grade: '01',
  },
  {
    warehouse: 'KEPPEL',
    status: 'In Progress',
    location: 'JP2 C05-002',
    pallet: 'JP2 C05-002',
    itemCode: '561961',
    description: 'DAP ITEMS',
    quantity: '2000',
    UOM: 'PCS',
    grade: '01',
  },
  {
    warehouse: 'KEPPEL',
    status: 'Waiting',
    location: 'JP2 C05-002',
    pallet: 'JP2 C05-002',
    itemCode: '561961',
    description: 'DAP ITEMS',
    quantity: '2000',
    UOM: 'PCS',
    grade: '01',
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

export default connect(mapStateToProps, mapDispatchToProps)(StockTakeCountList);