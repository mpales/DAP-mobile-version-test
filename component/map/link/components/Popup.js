/**
 * React Native Map Link
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

import {getAvailableApps, checkNotSupportedApps} from '../utils';
import {showLocation} from '../index';
import {generateTitles, icons, generatePrefixes} from '../constants';

import Mixins from '../../../../mixins';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

const colors = {
  black: '#464646',
  gray: '#BBC4CC',
  lightGray: '#ACBBCB',
  lightBlue: '#ECF2F8',
};

export default class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apps: [],
      loading: true,
      titles: generateTitles(props.appTitles),
    };

    this._renderAppItem = this._renderAppItem.bind(this);
  }

  componentDidMount() {
    this.loadApps();
  }

  async loadApps() {
    const {appsWhiteList, options} = this.props;
    let apps = await getAvailableApps(generatePrefixes(options));
    if (appsWhiteList && appsWhiteList.length) {
      checkNotSupportedApps(appsWhiteList);
      apps = apps.filter((appName) =>
        this.props.appsWhiteList.includes(appName),
      );
    }

    this.setState({apps, loading: false});
  }

  _renderHeader() {
    const {showHeader, customHeader, options} = this.props;
    if (!showHeader) {
      return null;
    }
    if (customHeader) {
      return customHeader;
    }

    const dialogTitle =
      options.dialogTitle && options.dialogTitle.length
        ? options.dialogTitle
        : 'Open in Maps';
    const dialogMessage =
      options.dialogMessage && options.dialogMessage.length
        ? options.dialogMessage
        : 'What app would you like to use?';

    return (
      <View style={[styles.headerContainer, this.props.style.headerContainer]}>
        <Text style={[styles.titleText, this.props.style.titleText]}>
          {dialogTitle}
        </Text>
        {dialogMessage && dialogMessage.length ? (
          <Text style={[styles.subtitleText, this.props.style.subtitleText]}>
            {dialogMessage}
          </Text>
        ) : null}
      </View>
    );
  }

  _renderApps() {
    return (
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separatorStyle, this.props.style.separatorStyle]}
          />
        )}
        data={this.state.apps}
        renderItem={this._renderAppItem}
        keyExtractor={(item) => item}
      />
    );
  }

  _renderAppItem({item}) {
    return (
      <TouchableOpacity
        key={item}
        style={[styles.itemContainer, this.props.style.itemContainer]}
        onPress={() => this._onAppPressed({app: item})}>
        <View>
          <Image
            style={[styles.image, this.props.style.image]}
            source={icons[item]}
          />
        </View>
        <Text style={[styles.itemText, this.props.style.itemText]}>
          {this.state.titles[item]}
        </Text>
      </TouchableOpacity>
    );
  }

  _renderCancelButton() {
    const {options} = this.props;
    const cancelText =
      options.cancelText && options.cancelText.length
        ? options.cancelText
        : 'Cancel';
    return (
      <View style={styles.cancelView}>
      <TouchableOpacity
        style={[
          styles.cancelButtonContainer,
          this.props.style.cancelButtonContainer,
        ]}
        onPress={this.props.onCancelPressed}>
        <Text
          style={[styles.cancelButtonText, this.props.style.cancelButtonText]}>
          {cancelText}
        </Text>
      </TouchableOpacity>
      </View>
    );
  }

  _renderFooter() {
    const {customFooter} = this.props;
    if (customFooter) {
      return customFooter;
    }
    return this._renderCancelButton();
  }

  _onAppPressed({app}) {
    showLocation({...this.props.options, app});
    this.props.onAppPressed(app);
  }

  render() {
    const {loading} = this.state;
    return (
      <Modal
        isVisible={this.props.isVisible}
        backdropColor={colors.black}
        animationIn="slideInUp"
        hideModalContentWhileAnimating
        useNativeDriver
        onBackButtonPress={this.props.onBackButtonPressed}
        {...this.props.modalProps}>
        <View style={[styles.container, this.props.style.container]}>
          {this._renderHeader()}
          {loading ? (
            <ActivityIndicator
              style={[
                styles.activityIndicatorContainer,
                this.props.style.activityIndicatorContainer,
              ]}
            />
          ) : (
            this._renderApps()
          )}
          {this._renderFooter()}
        </View>
      </Modal>
    );
  }
}

Popup.propTypes = {
  isVisible: PropTypes.bool,
  showHeader: PropTypes.bool,
  customHeader: PropTypes.element,
  customFooter: PropTypes.element,
  onBackButtonPressed: PropTypes.func,
  onAppPressed: PropTypes.func,
  onCancelPressed: PropTypes.func,
  style: PropTypes.object,
  modalProps: PropTypes.object,
  options: PropTypes.object.isRequired,
  appsWhiteList: PropTypes.array,
};

Popup.defaultProps = {
  isVisible: false,
  showHeader: true,
  customHeader: null,
  customFooter: null,
  style: {
    container: {},
    itemContainer: {},
    image: {},
    itemText: {},
    headerContainer: {},
    titleText: {},
    subtitleText: {},
    cancelButtonContainer: {},
    cancelButtonText: {},
    separatorStyle: {},
    activityIndicatorContainer: {},
  },
  modalProps: {},
  options: {},
  appsWhiteList: null,
  onBackButtonPressed: () => {},
  onCancelPressed: () => {},
  onAppPressed: () => {},
};

const styles = StyleSheet.create({
  container: {
    width: 331,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemText: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight: '400',
    color: '#6C6B6B',
    marginLeft: 27,
  },
  headerContainer: {
    borderBottomWidth:1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'transparent',
    borderBottomColor: '#cccccc',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
  },
  titleText: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight: '400',
    color: '#6C6B6B',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 12,
    color: colors.lightGray,
    textAlign: 'center',
    marginTop: 10,
  },
  cancelView: {
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    paddingLeft: 25,
    paddingRight: 25,
  },
  cancelButtonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderWidth: 1,
    backgroundColor: '#F1811C',
    borderColor: 'transparent',
    borderRadius: 5,
  },
  cancelButtonText: {
    ...Mixins.h6,
    lineHeight: 27,
    fontWeight: '400',
    color: '#fff',
  },
  separatorStyle: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightBlue,
  },
  activityIndicatorContainer: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
