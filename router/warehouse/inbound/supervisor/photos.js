/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  FlatList
} from 'react-native';
import {
  Card,
  SearchBar,
  Image,
  Button,
} from 'react-native-elements';
import {Dimensions, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AnyAction, Dispatch} from 'redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect, Provider} from 'react-redux';
import Mixins from '../../../../mixins';


const window = Dimensions.get('window');

class Photos extends React.Component {
  constructor(props) {
    super(props);
  }
  renderCardImage = ({item})=>{
    return (
        <Image
        source={{ uri: 'image' }}
        style={{ width: 78, height: 78 }}
        containerStyle={{padding:5}}
        />
    );
  }
  render() {
    return (
        <View style={[StyleSheet.absoluteFill,{backgroundColor:'white',paddingHorizontal:40,paddingVertical:20}]}>
            <Card>
            <Card.Title style={{textAlign:'left',...Mixins.subtitle3,color:'#424141',fontWeight:'600',lineHeight:21}}>Receiving Photo</Card.Title>
            <FlatList
            horizontal={false}
            keyExtractor={this.keyExtractor}
            data={[1,2,3,4,5,6]}
            renderItem={this.renderCardImage}
            numColumns={3}
            />
            <Button
                        containerStyle={{flexShrink:1, marginRight: 0,}}
                        buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
                        titleStyle={styles.deliveryText}
                title='Update Photos' />
            </Card>
            <Card containerStyle={{marginVertical:20}}>
            <Card.Title style={{textAlign:'left',...Mixins.subtitle3,color:'#424141',fontWeight:'600',lineHeight:21}}>Pre-Processing Photo</Card.Title>
            <FlatList
            horizontal={false}
            keyExtractor={this.keyExtractor}
            data={[1,2,3,4,5,6]}
            renderItem={this.renderCardImage}
            numColumns={3}
            />
            <Button
                        containerStyle={{flexShrink:1, marginRight: 0,}}
                        buttonStyle={[styles.navigationButton, {paddingHorizontal: 0}]}
                        titleStyle={styles.deliveryText}
                title='Update Photos' />
            </Card>
        </View>
    );
 
  }
}

const styles = {
    deliveryText: {
        ...Mixins.h6,
        lineHeight: 27,
        fontWeight:'600',
        color: '#ffffff',
      },
      navigationButton: {
        backgroundColor: '#F07120',
        borderRadius: 5,
      },
}
function mapStateToProps(state) {
  return {
    todos: state.originReducer.todos,
    textfield: state.originReducer.todos.name,
    value: state.originReducer.todos.name,
    userRole: state.originReducer.userRole,
    isDrawer: state.originReducer.filters.isDrawer,
    indexBottomBar : state.originReducer.filters.indexBottomBar,
    indexStack : state.originReducer.filters.indexStack,
    keyStack : state.originReducer.filters.keyStack,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    setCurrentStackKey: (string) => {
      return dispatch({type: 'keyStack', payload: string});
    },
    setCurrentStackIndex: (num) => {
      return dispatch({type: 'indexStack', payload: num});
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Photos);
