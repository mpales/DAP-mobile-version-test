import React from 'react';
import {
  ListItem,
  ThemeProvider,
  Badge,
  Button,
  Text,
} from 'react-native-elements';
import {View, PixelRatio} from 'react-native';
import TouchableScale from 'react-native-touchable-scale'; // https://github.com/kohver/react-native-touchable-scale
import IconArrow66Mobile from '../../assets/icon/iconmonstr-arrow-66mobile-6.svg';
import {useSelector} from 'react-redux';
import Mixins from '../../mixins';
// helper
import {pickTaskProductStatus} from '../helper/string';
import {pickTaskProductStatusColor} from '../helper/status-color';

const Manifest = ({item, index, currentList, ToManifest, navigation}) => {
  const isCurrentManifest = useSelector(
    (state) => state.originReducer.filters.currentList,
  );
  let populated_location = Array.from({length: item.detail.length}).map(
    (num, index) => {
      return item.detail[index].warehouse_storage_container_id;
    },
  );
  let categoryArr = Array.from({length: item.detail.length}).map(
    (num, index) => {
      if (
        typeof item.detail[index] !== 'object' ||
        (item.detail[index].attributes === undefined &&
          item.detail[index].attributes.category === undefined)
      )
        return null;
      return item.detail[index].attributes.category;
    },
  );
  let categoryFiltered = categoryArr.filter((o) => o !== null);
  let wholeArr = Array.from({length: item.detail.length}).map((num, index) => {
    if (item.detail[index].quantity === undefined) return null;
    return item.detail[index].quantity;
  });
  let wholeFiltered = wholeArr.filter((o) => o !== null);
  let uomArr = Array.from({length: item.detail.length}).map((num, index) => {
    if (item.detail[index].uom === undefined) return null;
    return item.detail[index].uom;
  });
  let uomFiltered = uomArr.filter((o) => o !== null);

  const TextList = ({title, value}) => {
    return (
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={{width: 100, flexDirection: 'row'}}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={styles.separatorText}>:</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', flexShrink: 1}}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      </View>
    );
  };

  const CustomTextList = ({title, value}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          marginRight: PixelRatio.get() > 2.75 ? 90 : 80,
        }}>
        <View style={{width: 100, flexDirection: 'row'}}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={styles.separatorText}>:</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', flexShrink: 1}}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <ListItem
        key={index}
        Component={TouchableScale}
        friction={90} //
        tension={100} // These props are passed to the parent component (here TouchableScale)
        activeScale={0.95}
        pad={0}
        onPress={() => {
          currentList(item.pick_task_product_id);
        }}>
        <View
          style={[
            styles.leftList,
            {backgroundColor: pickTaskProductStatusColor(item.status)},
          ]}></View>
        <ListItem.Content style={styles.sectionContainer}>
          <View style={styles.flagContainer}>
            {item.rework === 1 && (
              <View style={styles.flag}>
                <Text style={styles.flagText}>Rework</Text>
              </View>
            )}
          </View>
          <View style={styles.detailContainer}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <CustomTextList title="Location" value={populated_location[0]} />
              <CustomTextList
                title="Item Code"
                value={item.product.item_code}
              />
              <TextList title="Description" value={item.product.description} />
              <TextList
                title="UOM"
                value={uomFiltered.length > 0 ? uomFiltered[0] : '-'}
              />
              <TextList
                title="QTY"
                value={wholeFiltered.length > 0 ? wholeFiltered[0] : '-'}
              />
              <TextList
                title="Category"
                value={
                  categoryFiltered.length > 0 &&
                  categoryFiltered[0] !== undefined
                    ? categoryFiltered[0]
                    : '-'
                }
              />
            </View>
            <ListItem.Chevron
              containerStyle={styles.chevronButton}
              size={26}
              color="#2D2C2C"
              Component={(props) => (
                <Button
                  {...props}
                  type="clear"
                  icon={
                    <IconArrow66Mobile height="16" width="26" fill="#2D2C2C" />
                  }
                />
              )}
              onPress={() => {
                navigation.navigate({
                  name: 'ItemDetail',
                  params: {
                    dataCode: item.pick_task_product_id,
                  },
                });
              }}
            />
          </View>
          <Badge
            value={pickTaskProductStatus(item.status)}
            status="warning"
            textStyle={styles.badgeText}
            containerStyle={styles.badgeContainer}
            badgeStyle={{
              backgroundColor: pickTaskProductStatusColor(item.status),
              borderRadius: 5,
            }}
          />
          {isCurrentManifest === item.pick_task_product_id && (
            <View
              style={{
                width: '100%',
                marginVertical: 10,
                flexDirection: 'column',
              }}>
              <Button
                containerStyle={styles.buttonContainer}
                buttonStyle={[styles.navigationButton]}
                titleStyle={[styles.deliveryText, {paddingHorizontal: 10}]}
                onPress={ToManifest}
                title="Scan Barcode"
                disabled={item.status === 3 || item.status === 4 ? true : false}
              />
              <Button
                containerStyle={styles.buttonContainer}
                buttonStyle={[
                  styles.navigationButton,
                  {
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#D5D5D5',
                  },
                ]}
                titleStyle={[
                  styles.deliveryText,
                  {color: '#E03B3B', paddingHorizontal: 10},
                ]}
                onPress={() => {
                  navigation.navigate({
                    name: 'ReportManifest',
                    params: {
                      dataCode: item.pick_task_product_id,
                    },
                  });
                }}
                disabled={false}
                title="Report Item"
              />
            </View>
          )}
        </ListItem.Content>
      </ListItem>
    </ThemeProvider>
  );
};

const styles = {
  sectionContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    marginHorizontal: 14,
    paddingVertical: 10,
  },
  titleText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#2D2C2C',
    fontWeight: '500',
  },
  separatorText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#6C6B6B',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    paddingHorizontal: 8,
  },
  valueText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#424141',
    fontWeight: '400',
  },
  subtitleText: {
    marginVertical: 2,
    color: '#6C6B6B',
  },
  containerList: {
    marginVertical: 8,
    marginHorizontal: 0,
    padding: 0,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
    elevation: 5,
  },
  leftList: {
    backgroundColor: 'grey',
    flexShrink: 1,
    padding: 3,
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },
  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    fontWeight: '400',
    color: '#ffffff',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  badgeText: {
    ...Mixins.small3,
    fontWeight: '400',
    lineHeight: 15,
    paddingHorizontal: 20,
  },
  detailContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    paddingRight: PixelRatio.get() > 2.75 ? 60 : 50,
  },
  chevronButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    marginVertical: 5,
  },
  flagContainer: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  flag: {
    flexDirection: 'row',
    flexShrink: 1,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    paddingHorizontal: 10,
    marginRight: 5,
  },
  flagText: {
    ...Mixins.small1,
    lineHeight: 18,
    color: '#F07120',
    fontWeight: '500',
  },
};
const theme = {
  ListItem: {
    containerStyle: styles.containerList,
    titleStyle: {
      color: 'red',
    },
  },
  ListItemTitle: {
    style: styles.titleText,
  },
  ListItemSubtitle: {
    style: styles.subtitleText,
  },
  Avatar: {
    size: 70,
    containerStyle: styles.avatarContainer,
    overlayContainerStyle: styles.avatarOverlay,
  },
  ListItemContent: {
    containerStyle: styles.sectionContainer,
  },
};

export default Manifest;
