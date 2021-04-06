import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {SearchBar, Badge, Divider, Text} from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import addressList from '../../../component/extend/ListItem-map';
import Map from '../../../component/map/map-address';

const exampleData = [...Array(20)].map((d, index) => ({
  key: `item-${index}`, // For example only -- don't use index as your key!
  label: index,
  backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${
    index * 5
  }, ${132})`,
}));

class Example extends Component {
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
      <View style={{flex: 1}}>
        <DraggableFlatList
          data={this.state.data}
          renderItem={addressList}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({data}) => this.setState({data})}
          ListHeaderComponent={() => {
            return (
              <View style={styles.headerContainer}>
                <View style={{height: 250}}>
                  <Map />
                </View>
                <View
                  style={{
                    backgroundColor: '#F07120',
                    paddingHorizontal: 73,
                    paddingVertical: 10,
                  }}>
                  <Text style={{fontSize: 14, color: 'white'}}>
                    Delivery List
                  </Text>
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
