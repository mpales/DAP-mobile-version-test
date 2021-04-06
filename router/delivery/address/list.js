import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {SearchBar, Badge} from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AddressList from '../../../component/extend/ListItem-address';
import IconSearchMobile from '../../../assets/icon/iconmonstr-search-thinmobile.svg';

const exampleData = [...Array(20)].map((d, index) => ({
  key: `item-${index}`, // For example only -- don't use index as your key!
  label: index,
  backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${
    index * 5
  }, ${132})`,
}));

class Example extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: exampleData,
    search: '',
  };

  updateSearch = (search) => {
    this.setState({search});
  };

  render() {
    const {search} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <DraggableFlatList
          data={this.state.data}
          renderItem={(props) => {
            return (
              <AddressList {...props} navigation={this.props.navigation} />
            );
          }}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({data}) => this.setState({data})}
          ListHeaderComponent={() => {
            return (
              <View style={styles.filterContainer}>
                <SearchBar
                  placeholder="Type Here..."
                  onChangeText={this.updateSearch}
                  value={search}
                  lightTheme={true}
                  inputStyle={{backgroundColor: '#fff'}}
                  placeholderTextColor="#2D2C2C"
                  searchIcon={() => (
                    <IconSearchMobile height="20" width="20" fill="#2D2C2C" />
                  )}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    paddingHorizontal: 37,
                    marginVertical: 5,
                  }}
                  inputContainerStyle={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#D5D5D5',
                  }}
                  leftIconContainerStyle={{backgroundColor: 'white'}}
                />
                <View style={styles.sectionSort}>
                  <Badge
                    value="All"
                    status="warning"
                    containerStyle={styles.badgeSort}
                    badgeStyle={{paddingHorizontal: 12, height: 20}}
                    textStyle={{fontSize: 10}}
                  />

                  <Badge
                    value="Time"
                    containerStyle={styles.badgeSort}
                    badgeStyle={{
                      backgroundColor: '#ffffff',
                      borderWidth: 1,
                      borderColor: '#121C78',
                      paddingHorizontal: 12,
                      height: 20,
                    }}
                    textStyle={{fontSize: 10, color: '#121C78'}}
                  />

                  <Badge
                    value="Pickup"
                    containerStyle={styles.badgeSort}
                    badgeStyle={{
                      backgroundColor: '#ffffff',
                      borderWidth: 1,
                      borderColor: '#121C78',
                      paddingHorizontal: 12,
                      height: 20,
                    }}
                    textStyle={{fontSize: 10, color: '#121C78'}}
                  />

                  <Badge
                    value="Company"
                    containerStyle={styles.badgeSort}
                    badgeStyle={{
                      backgroundColor: '#ffffff',
                      borderWidth: 1,
                      borderColor: '#121C78',
                      paddingHorizontal: 12,
                      height: 20,
                    }}
                    textStyle={{fontSize: 10, color: '#121C78'}}
                  />

                  <Badge
                    value="Warehouse"
                    containerStyle={styles.badgeSort}
                    badgeStyle={{
                      backgroundColor: '#ffffff',
                      borderWidth: 1,
                      borderColor: '#121C78',
                      paddingHorizontal: 12,
                      height: 20,
                    }}
                    scrollSpeed={200}
                    textStyle={{fontSize: 10, color: '#121C78'}}
                  />
                </View>
              </View>
            );
          }}
        />
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
};
export default Example;
