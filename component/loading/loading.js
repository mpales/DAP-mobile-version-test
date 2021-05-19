import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
} from 'react-native';

class Loading extends React.Component {
    render() {
        return(
            <View style={styles.container}>
                <ActivityIndicator 
                    size={50} 
                    color="#121C78"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        zIndex: 1
    },
});

export default Loading;