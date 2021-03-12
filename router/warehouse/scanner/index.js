import * as React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {BottomSheet, ListItem} from 'react-native-elements';
import {connect} from 'react-redux';
import BarCode from '../../../component/camera/filter-barcode';

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.renderContent.bind(this);
    this.state = {
      list: [
        {title: 'List Item 1'},
        {title: 'List Item 2'},
        {
          title: 'Cancel',
          containerStyle: {backgroundColor: 'red'},
          titleStyle: {color: 'white'},
          onPress: () => this.setIsVisible(false).bind(this),
        },
      ],
      isVisible: false,
    };
  }
  setIsVisible = () => {
    return this.setState({isVisible: false});
  };
  renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 450,
      }}>
      <Text>Swipe down to close</Text>
    </View>
  );

  render() {
    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: 'papayawhip',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BarCode />
        </View>
        <BottomSheet
          isVisible={this.state.isVisible}
          containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
          {this.state.list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
        ;
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todos,
    textfield: state.todos.name,
    value: state.todos.name,
    userRole: state.userRole,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    decrement: () => dispatch({type: 'DECREMENT'}),
    reset: () => dispatch({type: 'RESET'}),
    onChange: (text) => {
      return {type: 'todos', payload: text};
    },
    //toggleTodo: () => dispatch(toggleTodo(ownProps).todoId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scanner);
