import React from 'react';
import {
  Animated,
  StyleSheet,
  Easing,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import {Button, Input, Divider} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';
import BarCode from '../../../component/camera/filter-barcode';
import CheckmarkIcon from '../../../assets/icon/iconmonstr-check-mark-8mobile.svg';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import XMarkIcon from '../../../assets/icon/iconmonstr-x-mark-7mobile.svg';
import Mixins from '../../../mixins';
import moment from 'moment';
import {postData} from '../../../component/helper/network';
import {connect} from 'react-redux';
import {
  default as Reanimated,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Incremental from '../../../assets/icon/plus-mobile.svg';
import Decremental from '../../../assets/icon/min-mobile.svg';
import Banner from '../../../component/banner/float-banner';
const screen = Dimensions.get('screen');

class Example extends React.Component {
  animatedValue = new Animated.Value(0);
  callbackNode = new Reanimated.Value(1);
  constructor(props) {
    super(props);
    this.state = {
      dataCode: '0',
      qty: 0,
      indexData: null,
      dataItem: null,
      bayCode: null,
      itemCode: null,
      scanItem: null,
      scannedCode: null,
      keyboardState: 'hide',
      heightBottom: 320,
      backendReponsse: false,
      errorAttr: '',
    };
    this.handleResetAnimation.bind(this);
    this.handleZoomInAnimation.bind(this);
    this.renderBarcode.bind(this);
    this.modalizeRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    const {
      outboundList,
      currentASN,
      navigation,
      setBarcodeScanner,
      detectBarcode,
    } = props;
    const {bayCode, itemCode, scanItem} = state;
    const {routes, index} = navigation.dangerouslyGetState();
    if (bayCode === null) {
      if (
        routes[index].params !== undefined &&
        routes[index].params.inputCode !== undefined
      ) {
        //from input code
        setBarcodeScanner(true);
        let pick_task_product_id = routes[index].params.inputCode;
        let item = outboundList.find(
          (element, index) =>
            element.pick_task_product_id === pick_task_product_id,
        );

        return {
          ...state,
          bayCode: item.detail[0].warehouse_storage_container_id,
          dataItem: item,
          indexData: routes[index].params.inputCode,
        };
      } else if (
        routes[index].params !== undefined &&
        routes[index].params.manualCode !== undefined
      ) {
        //from manual code
        setBarcodeScanner(false);
        let manualCode = routes[index].params.manualCode;
        let pick_task_product_id = routes[index].params.indexData;
        let item = outboundList.find(
          (element, index) =>
            element.product.item_code === manualCode &&
            element.pick_task_product_id === pick_task_product_id,
        );
        return {
          ...state,
          dataCode: item.detail[0].warehouse_storage_container_id,
          bayCode: item.detail[0].warehouse_storage_container_id,
          dataItem: item,
          itemCode: routes[index].params.manualCode,
          indexData: routes[index].params.indexData,
        };
      }
    } else if (
      bayCode !== null &&
      scanItem !== null &&
      itemCode === null &&
      routes[index].params !== undefined &&
      routes[index].params.manualCode !== undefined &&
      scanItem === routes[index].params.manualCode
    ) {
      setBarcodeScanner(false);
      let manualCode = routes[index].params.manualCode;
      let pick_task_product_id = routes[index].params.indexData;
      let item = outboundList.find(
        (element, index) =>
          element.product.item_code === manualCode &&
          element.pick_task_product_id === pick_task_product_id,
      );
      return {
        ...state,
        dataCode: item.detail[0].warehouse_storage_container_id,
        bayCode: item.detail[0].warehouse_storage_container_id,
        dataItem: item,
        itemCode: routes[index].params.manualCode,
        indexData: routes[index].params.indexData,
      };
    }
    return {...state};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.dataCode !== '0' &&
      nextState.bayCode !== null &&
      nextState.scanItem === null &&
      nextProps.detectBarcode === false
    ) {
      if (nextState.dataCode === nextState.bayCode) {
        this.confirmBayScanning();
        return true;
      } else if (nextState.dataCode !== nextState.bayCode) {
        nextProps.setBarcodeScanner(true);
        return false;
      }
    } else if (
      nextState.dataCode !== '0' &&
      nextState.bayCode !== null &&
      nextState.scanItem !== null &&
      nextState.itemCode === null &&
      nextProps.detectBarcode === false
    ) {
      if (nextState.dataCode === nextState.scanItem) {
        this.setState({itemCode: nextState.scanItem});
        return true;
      } else if (nextState.dataCode !== nextState.scanItem) {
        nextProps.setBarcodeScanner(true);
        return false;
      }
    }

    return true;
  }

  async componentDidUpdate(prevProps, prevState) {
    const {detectBarcode} = this.props;
    if (prevProps.detectBarcode !== detectBarcode) {
      if (detectBarcode) {
        this.handleResetAnimation();
      } else {
        this.handleZoomInAnimation();
      }
    }
    if (
      prevProps.keyStack !== this.props.keyStack &&
      prevProps.keyStack === 'ManualInput'
    ) {
      if (this.props.route.params?.inputBayBarcode) {
        this.props.setBarcodeScanner(false);
        this.setState({
          dataCode: this.props.route.params?.manualCode,
        });
        this.confirmBayScanning();
      }
    }
  }

  confirmBayScanning = async () => {
    const result = await postData(
      'outboundMobile/pickTask/' +
        this.props.currentTask +
        '/product/' +
        this.state.indexData,
    );
    if (typeof result === 'object' && result.error !== undefined) {
      this.props.setItemError(result.error);
      this.props.navigation.goBack();
    } else if (result === "Pick product status changed to 'In Progress'") {
      this.setState({
        backendReponsse: true,
      });
      this.setState({
        scannedCode: this.state.dataCode,
        dataCode: '0',
        scanItem: this.state.dataItem.product.item_code,
      });
    } else {
      this.setState({
        dataCode: '0',
        scanItem: null,
      });
    }
  };

  keyboardDidShowHandle = () => {
    this.setState({keyboardState: 'show'});
  };

  keyboardDidHideHandle = () => {
    this.setState({keyboardState: 'hide'});
  };

  handleResetAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 0,
    }).reset();
  };
  handleZoomInAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this.keyboardDidShowHandle);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHideHandle);
  }
  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this.keyboardDidShowHandle);
    Keyboard.removeListener('keyboardDidHide', this.keyboardDidHideHandle);
  }

  navigateToProcessItem = () => {
    this.props.navigation.navigate('ProcessItem', {
      dataItem: this.state.dataItem,
      indexData: this.state.indexData,
    });
  };

  navigateToManualInput = () => {
    this.props.setBottomBar(true);
    this.props.navigation.navigate({
      name: 'ManualInput',
      params: {
        dataCode:
          this.state.scanItem === null
            ? this.state.dataItem.detail[0]?.warehouse_storage_container_id
            : this.state.scanItem,
        indexData: this.state.indexData,
        inputBayBarcode: this.state.scanItem === null,
      },
    });
  };

  handleInput = (text) => {
    this.setState({
      qty: isNaN(text)
        ? 0
        : /\s/g.test(text)
        ? ''
        : text === ''
        ? text
        : parseInt(text),
    });
  };

  handlePlus = () => {
    this.setState({
      qty: this.state.qty + 1,
    });
  };

  handleMinus = () => {
    if (this.state.qty > 0) {
      this.setState({
        qty: this.state.qty - 1,
      });
    }
  };

  renderModal = (props) => {
    const {dataItem, dataCode, qty, itemCode} = this.state;

    let gradeArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (dataItem.detail[index].grade === undefined) return null;
        return dataItem.detail[index].grade;
      },
    );
    let gradeFiltered = gradeArr.filter((o) => o !== null);
    let grade = '';
    switch (gradeFiltered[0]) {
      case 1:
        grade = 'PICK';
        break;
      case 2:
        grade = 'BUFFER';
        break;
      case 3:
        grade = 'DAMAGED';
        break;
      case 4:
        grade = 'DEFECTIVE';
        break;
      case 5:
        grade = 'SHORT EXPIRY';
        break;
      case 6:
        grade = 'EXPIRED';
        break;
      case 7:
        grade = 'NS';
        break;
      case 8:
        grade = 'RESERVED';
        break;
      case 9:
        grade = 'SIT';
        break;
      case 10:
        grade = 'REWORKS';
        break;
      default:
        break;
    }

    let uomArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (dataItem.detail[index].uom === undefined) return null;
        return dataItem.detail[index].uom;
      },
    );
    let uomFiltered = uomArr.filter((o) => o !== null);

    let packagingArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (
          typeof dataItem.detail[index] !== 'object' ||
          dataItem.detail[index].attributes.packaging === undefined
        )
          return null;
        return dataItem.detail[index].attributes.packaging;
      },
    );
    let packagingFiltered = packagingArr.filter((o) => o !== null);

    let qtyPickArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (
          typeof dataItem.detail[index] !== 'object' ||
          dataItem.detail[index].attributes.qtyToPick === undefined
        )
          return null;
        return dataItem.detail[index].attributes.qtyToPick;
      },
    );
    let qtyPickArrFiltered = qtyPickArr.filter((o) => o !== null);

    let wholeArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (dataItem.detail[index].quantity === undefined) return null;
        return dataItem.detail[index].quantity;
      },
    );
    let wholeFiltered = wholeArr.filter((o) => o !== null);

    let categoryArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (
          typeof dataItem.detail[index] !== 'object' ||
          dataItem.detail[index].attributes.category === undefined
        )
          return null;
        return dataItem.detail[index].attributes.category;
      },
    );
    let categoryFiltered = categoryArr.filter((o) => o !== null);

    let banchArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (dataItem.detail[index].batch_no === undefined) return null;
        return dataItem.detail[index].batch_no;
      },
    );
    let banchFiltered = banchArr.filter((o) => o !== null);

    let expArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (
          typeof dataItem.detail[index] !== 'object' ||
          dataItem.detail[index].attributes.expiry_date === undefined
        )
          return null;
        return dataItem.detail[index].attributes.expiry_date;
      },
    );
    let expFiltered = expArr.filter((o) => o !== null);

    const {inset} = props;
    return (
      <ScrollView
        style={styles.modalOverlay}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          paddingTop:
            this.state.keyboardState === 'hide'
              ? itemCode !== null
                ? 60 + inset.top
                : 120 + inset.top
              : 0 + inset.top,
        }}>
        <Animated.View
          style={
            itemCode !== null
              ? [
                  styles.modalContainerAll,
                  {
                    transform: [
                      {
                        scaleX: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        scaleY: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]
              : [
                  styles.modalContainerSmall,
                  {
                    transform: [
                      {
                        scaleX: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                      {
                        scaleY: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]
          }>
          <View
            style={[
              styles.sectionSheetDetail,
              {marginHorizontal: 0, marginTop: 0},
            ]}>
            <View style={styles.modalHeader}>
              <CheckmarkIcon height="24" width="24" fill="#17B055" />
              {itemCode !== null ? (
                <Text style={styles.modalHeaderText}>Success Scan Item</Text>
              ) : (
                <Text style={styles.modalHeaderText}>Success Scan Bay</Text>
              )}
            </View>
            <Divider color="#D5D5D5" />
            {itemCode !== null ? (
              <View
                style={[
                  styles.sheetPackages,
                  {marginHorizontal: 32, marginTop: 20},
                ]}>
                <View
                  style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Pallet</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.detail[0].warehouse_storage_container_id}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Item Code</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.product.item_code}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Description</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.product.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>UOM</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {uomFiltered.length > 0 ? uomFiltered[0] : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Barcode</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>{dataCode}</Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Stock Grade </Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {grade ? grade : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Packaging </Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {packagingFiltered.length > 0
                          ? packagingFiltered[0]
                          : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Qty to pick</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.qtytoPick}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Whole Qty</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>-</Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Category</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {categoryFiltered.length > 0
                          ? categoryFiltered[0]
                          : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Batch Number</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {banchFiltered.length > 0 ? banchFiltered[0] : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>EXP Date</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {expFiltered.length > 0
                          ? moment(expFiltered[0]).format('DD/MM/YY')
                          : '-'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.quantityContainer}>
                  <Text style={styles.qtyTitle}>Qty</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Decremental
                      height="30"
                      width="30"
                      style={{flexShrink: 1, marginVertical: 5}}
                      onPress={() => {
                        this.handleMinus;
                      }}
                    />
                    <TextInput
                      value={this.state.qty.toString()}
                      textAlign="center"
                      style={styles.inputStyle}
                      keyboardType="number-pad"
                      onChangeText={(text) => this.handleInput(text)}
                    />
                    <Incremental
                      height="30"
                      width="30"
                      style={{flexShrink: 1, marginVertical: 5}}
                      onPress={this.handlePlus}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.sheetPackages,
                  {marginHorizontal: 32, marginTop: 20},
                ]}>
                <View
                  style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Location</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {this.state.bayCode}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Item Code</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.product.item_code}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Pallet</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>-</Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Description</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.product.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>UOM</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {uomFiltered.length > 0 ? uomFiltered[0] : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>QTY</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {wholeFiltered.length > 0 ? wholeFiltered[0] : '-'}
                      </Text>
                    </View>
                  </View>
                  {/* <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Barcode</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {this.state.scannedCode}
                      </Text>
                    </View>
                  </View> */}
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Category</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {categoryFiltered.length > 0
                          ? categoryFiltered[0]
                          : '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            <View style={[styles.buttonSheetContainer]}>
              <View style={[styles.buttonSheet, {flexDirection: 'column'}]}>
                {itemCode !== null ? (
                  <Button
                    containerStyle={{flex: 1, marginTop: 10}}
                    buttonStyle={styles.navigationButton}
                    titleStyle={styles.deliveryText}
                    onPress={() => this.onSubmit()}
                    title="Confirm"
                  />
                ) : (
                  <>
                    <Button
                      containerStyle={{flex: 1, marginTop: 10}}
                      buttonStyle={[
                        styles.navigationButton,
                        {backgroundColor: '#121C78'},
                      ]}
                      titleStyle={styles.deliveryText}
                      onPress={this.navigateToProcessItem}
                      title="Process"
                    />
                    <Button
                      containerStyle={{flex: 1, marginTop: 10}}
                      buttonStyle={styles.navigationButton}
                      titleStyle={styles.deliveryText}
                      onPress={() => {
                        this.props.setBarcodeScanner(true);
                      }}
                      title="Scan item"
                    />
                  </>
                )}
              </View>
              <View style={styles.buttonSheet}>
                <Button
                  containerStyle={{flex: 1, marginTop: 10, marginRight: 5}}
                  buttonStyle={styles.cancelButton}
                  titleStyle={styles.backText}
                  onPress={() => this.makeGoBackProcess()}
                  title="Back"
                />
                <Button
                  containerStyle={{flex: 1, marginTop: 10, marginLeft: 5}}
                  buttonStyle={styles.cancelButton}
                  titleStyle={styles.reportText}
                  onPress={() => {
                    this.props.setBottomBar(true);
                    this.props.navigation.navigate({
                      name: 'ReportManifest',
                      params: {
                        dataCode: this.state.dataItem.barcode,
                      },
                    });
                  }}
                  title="Report Item"
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    );
  };

  renderInner = () => {
    const {dataItem} = this.state;
    let gradeArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (dataItem.detail[index].grade === undefined) return null;
        return dataItem.detail[index].grade;
      },
    );
    let gradeFiltered = gradeArr.filter((o) => o !== null);
    let grade = '';
    switch (gradeFiltered[0]) {
      case 1:
        grade = 'PICK';
        break;
      case 2:
        grade = 'BUFFER';
        break;
      case 3:
        grade = 'DAMAGED';
        break;
      case 4:
        grade = 'DEFECTIVE';
        break;
      case 5:
        grade = 'SHORT EXPIRY';
        break;
      case 6:
        grade = 'EXPIRED';
        break;
      case 7:
        grade = 'NS';
        break;
      case 8:
        grade = 'RESERVED';
        break;
      case 9:
        grade = 'SIT';
        break;
      case 10:
        grade = 'REWORKS';
        break;
      default:
        break;
    }

    let uomArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (dataItem.detail[index].uom === undefined) return null;
        return dataItem.detail[index].uom;
      },
    );
    let uomFiltered = uomArr.filter((o) => o !== null);
    let packagingArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (
          typeof dataItem.detail[index] !== 'object' ||
          dataItem.detail[index].attributes.packaging === undefined
        )
          return null;
        return dataItem.detail[index].attributes.packaging;
      },
    );
    let packagingFiltered = packagingArr.filter((o) => o !== null);

    let qtyPickArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (
          typeof dataItem.detail[index] !== 'object' ||
          dataItem.detail[index].attributes.qtyToPick === undefined
        )
          return null;
        return dataItem.detail[index].attributes.qtyToPick;
      },
    );
    let qtyPickArrFiltered = qtyPickArr.filter((o) => o !== null);

    let wholeArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (dataItem.detail[index].quantity === undefined) return null;
        return dataItem.detail[index].quantity;
      },
    );
    let wholeFiltered = wholeArr.filter((o) => o !== null);

    let categoryArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (
          typeof dataItem.detail[index] !== 'object' ||
          dataItem.detail[index].attributes.category === undefined
        )
          return null;
        return dataItem.detail[index].attributes.category;
      },
    );
    let categoryFiltered = categoryArr.filter((o) => o !== null);

    let banchArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (dataItem.detail[index].batch_no === undefined) return null;
        return dataItem.detail[index].batch_no;
      },
    );
    let banchFiltered = banchArr.filter((o) => o !== null);
    let expArr = Array.from({length: dataItem.detail.length}).map(
      (num, index) => {
        if (
          typeof dataItem.detail[index] !== 'object' ||
          dataItem.detail[index].attributes.expiry_date === undefined
        )
          return null;
        return dataItem.detail[index].attributes.expiry_date;
      },
    );
    let expFiltered = expArr.filter((o) => o !== null);

    return (
      <View
        style={styles.sheetContainer}
        onLayout={(e) =>
          this.setState({heightBottom: e.nativeEvent.layout.height})
        }>
        <View style={[styles.sectionSheetDetail, {marginBottom: 40}]}>
          <View style={styles.sheetPackages}>
            <View style={[styles.sectionDividier, {alignItems: 'flex-start'}]}>
              {this.state.scanItem !== null ? (
                <>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Pallet</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>s</Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Item Code</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.product.item_code}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Description</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.product.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>UOM</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {uomFiltered.length > 0 ? uomFiltered[0] : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>QTY</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {wholeFiltered.length > 0 ? wholeFiltered[0] : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.groupDivider, {flexDirection: 'row'}]}>
                    <View style={[styles.sectionDividier, {flex: 1}]}>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelNotFound}>Barcode</Text>
                        <View style={{flexDirection: 'row', flexShrink: 1}}>
                          <Text style={styles.dotLabel}>:</Text>
                          <Text style={styles.infoNotFound}>-</Text>
                        </View>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelNotFound}>Stock Grade</Text>
                        <View style={{flexDirection: 'row', flexShrink: 1}}>
                          <Text style={styles.dotLabel}>:</Text>
                          <Text style={styles.infoNotFound}>
                            {grade ? grade : '-'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.dividerContent}>
                        <Text style={styles.labelNotFound}>Packaging</Text>
                        <View style={{flexDirection: 'row', flexShrink: 1}}>
                          <Text style={styles.dotLabel}>:</Text>
                          <Text style={styles.infoNotFound}>
                            {packagingFiltered.length > 0
                              ? packagingFiltered[0]
                              : '-'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelNotFound}>Category</Text>
                        <View style={{flexDirection: 'row', flexShrink: 1}}>
                          <Text style={styles.dotLabel}>:</Text>
                          <Text style={styles.infoNotFound}>
                            {categoryFiltered.length > 0
                              ? categoryFiltered[0]
                              : '-'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={(styles.sectionDividier, {flex: 1})}>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelNotFound}>Batch Number</Text>
                        <View style={{flexDirection: 'row', flexShrink: 1}}>
                          <Text style={styles.dotLabel}>:</Text>
                          <Text style={styles.infoNotFound}>
                            {banchFiltered.length > 0 ? banchFiltered[0] : '-'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.dividerContent}>
                        <Text style={styles.labelNotFound}>EXP Date</Text>
                        <View style={{flexDirection: 'row', flexShrink: 1}}>
                          <Text style={styles.dotLabel}>:</Text>
                          <Text style={styles.infoNotFound}>
                            {expFiltered.length > 0
                              ? moment(expFiltered[0]).format('DD/MM/YY')
                              : '-'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              ) : this.state.dataItem !== null ? (
                <>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Location</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {this.state.bayCode}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Item Code</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.product.item_code}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Pallet</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>-</Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Description</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {dataItem.product.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>UOM</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {uomFiltered.length > 0 ? uomFiltered[0] : '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>QTY</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {wholeFiltered.length > 0 ? wholeFiltered[0] : '-'}
                      </Text>
                    </View>
                  </View>
                  {/* <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Barcode</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {this.state.dataCode}
                      </Text>
                    </View>
                  </View> */}
                  <View style={styles.dividerContent}>
                    <Text style={styles.labelNotFound}>Category</Text>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                      <Text style={styles.dotLabel}>:</Text>
                      <Text style={styles.infoNotFound}>
                        {categoryFiltered.length > 0
                          ? categoryFiltered[0]
                          : '-'}
                      </Text>
                    </View>
                  </View>
                </>
              ) : null}
            </View>
          </View>
          <View style={[styles.buttonSheet, {marginVertical: 10}]}>
            <Button
              containerStyle={{flex: 1, marginTop: 10, marginRight: 5}}
              buttonStyle={styles.cancelButton}
              titleStyle={styles.reportText}
              onPress={() => {
                this.props.setBottomBar(true);
                this.props.navigation.navigate({
                  name: 'ReportManifest',
                  params: {
                    dataCode: this.state.dataItem.barcode,
                  },
                });
              }}
              title="Report Item"
            />
            <Button
              containerStyle={{flex: 1, marginTop: 10, marginLeft: 5}}
              buttonStyle={styles.navigationButton}
              titleStyle={styles.deliveryText}
              onPress={this.navigateToManualInput}
              title="Input Manual"
            />
          </View>
        </View>
      </View>
    );
  };

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  renderBarcode = (barcode) => {
    if (barcode.length > 0 && barcode[0].data.length > 0) {
      this.setState({dataCode: barcode[0].data});
    }
  };
  makeScannedItem = (dataCode, qty) => {
    return Array.from({length: qty}).map((num, index) => {
      return dataCode;
    });
  };
  makeGoBackProcess = () => {
    const {scanItem, itemCode} = this.state;
    if (itemCode !== null) {
      const {routes, index} = this.props.navigation.dangerouslyGetState();
      this.props.navigation.setParams({
        ...routes[index].params,
        manualCode: undefined,
        indexData: undefined,
        inputCode: this.state.indexData,
      });
      this.setState({dataCode: '0', itemCode: null, backendReponsse: false});
    } else if (scanItem !== null) {
      this.setState({dataCode: '0', scanItem: null, backendReponsse: false});
    }
    this.props.setBarcodeScanner(true);
  };
  onSubmit = async () => {
    const {dataCode, qty, dataItem, indexData} = this.state;
    const {currentTask} = this.props;
    if (parseInt(qty) !== qty) {
      this.props.navigation.setOptions({headerShown: false});
      this.setState({
        errorAttr: 'Qty only in integer',
      });
    } else {
      let getConfirmation = await postData(
        '/outboundMobile/pickTask/' +
          currentTask +
          '/product/' +
          indexData +
          '/confirm',
        {quantity: qty},
      );
      if (
        typeof getConfirmation === 'object' &&
        getConfirmation.error !== undefined
      ) {
        this.props.navigation.setOptions({headerShown: false});
        this.setState({
          errorAttr: getConfirmation.error,
        });
        // this.props.setItemError(getConfirmation.error);
      } else {
        this.props.navigation.setOptions({headerShown: true});
        this.props.setItemSuccess(getConfirmation);
        this.props.setBarcodeScanner(true);
        this.props.navigation.navigate('List');
      }
    }
  };

  render() {
    const {detectBarcode} = this.props;
    return (
      <View style={styles.container}>
        {this.state.errorAttr !== '' && (
          <Banner
            title={this.state.errorAttr}
            backgroundColor="#F1811C"
            closeBanner={() => {
              this.props.navigation.setOptions({headerShown: true});
              this.setState({errorAttr: ''});
            }}
          />
        )}
        {detectBarcode === false && this.state.backendReponsse ? (
          <SafeAreaInsetsContext.Consumer>
            {(inset) => <this.renderModal inset={inset} />}
          </SafeAreaInsetsContext.Consumer>
        ) : (
          <>
            <BottomSheet
              ref={this.modalizeRef}
              initialSnap={2}
              snapPoints={[30, 110, this.state.heightBottom]}
              enabledBottomClamp={false}
              enabledContentTapInteraction={false}
              renderContent={this.renderInner}
              renderHeader={this.renderHeader}
              callbackNode={this.callbackNode}
              enabledInnerScrolling={false}
              enabledBottomInitialAnimation={false}
            />
          </>
        )}
        <TouchableWithoutFeedback onPress={() => {}}>
          <BarCode
            renderBarcode={this.renderBarcode}
            navigation={this.props.navigation}
            useManualMenu={false}
            barcodeContext={
              this.state.scanItem === null
                ? 'Scan bay barcode Here'
                : 'Scan Item Barcode Here'
            }
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 5,
    maxHeight: 40,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  search: {
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: screen.height * 0.6,
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: 'white',
    height: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0,
    marginBottom: -1,
    borderBottomColor: 'white',
    borderBottomWidth: 0,
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  panelHandle: {
    width: 120,
    height: 7,
    backgroundColor: '#C4C4C4',
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  sheetContainer: {
    backgroundColor: 'white',
  },
  sectionSheetDetail: {
    flexGrow: 1,
    flexDirection: 'column',
    marginHorizontal: 32,
    marginTop: 20,
  },
  detailContent: {
    flexShrink: 1,
    flexDirection: 'column',
    marginTop: 19,
  },
  barcodeText: {
    ...Mixins.h1,
    lineHeight: 27,
    maxWidth: '80%',
  },
  barcodeDesc: {
    color: '#6C6B6B',
    fontSize: 36,
    maxWidth: '20%',
  },
  sectionDividier: {
    flexDirection: 'column',
  },
  dividerContent: {
    flexDirection: 'row',
    flexShrink: 1,
    marginVertical: 3,
  },
  dividerInput: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 8,
  },

  labelNotFound: {
    minWidth: 100,
    ...Mixins.small1,
    color: '#2D2C2C',
    fontWeight: '500',
    lineHeight: 18,
  },
  infoNotFound: {
    paddingHorizontal: 10,
    ...Mixins.small1,
    color: '#424141',
    fontWeight: '400',
    lineHeight: 18,
  },

  dotLabel: {
    ...Mixins.small1,
    color: '#6C6B6B',
    fontWeight: '500',
    lineHeight: 18,
    paddingRight: 0,
    paddingLeft: 0,
  },
  labelPackage: {
    minWidth: 100,
    ...Mixins.small1,
    color: '#2D2C2C',
    fontWeight: '500',
    lineHeight: 18,
  },
  infoPackage: {
    paddingHorizontal: 10,
    ...Mixins.small1,
    color: '#424141',
    fontWeight: '400',
    lineHeight: 18,
  },

  navigationButton: {
    backgroundColor: '#F07120',
    borderRadius: 5,
  },

  deliveryText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#ffffff',
  },
  sheetPackages: {
    flexShrink: 1,
  },
  buttonSheetContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonSheet: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  deliverTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '700',
  },
  qtyTitle: {
    ...Mixins.h3,
    fontWeight: '600',
    lineHeight: 36,
    color: '#424141',
  },
  deliverText: {
    fontSize: 20,
    lineHeight: 40,
  },
  modalContainerAll: {
    flexShrink: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 65) / 100,
    borderRadius: 10,
  },
  modalContainerSmall: {
    flexShrink: 1,
    backgroundColor: 'white',
    width: (screen.width * 90) / 100,
    minHeight: (screen.height * 50) / 100,
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  modalHeaderText: {
    color: '#17B055',
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#6C6B6B',
    borderRadius: 5,
  },
  cancelText: {
    ...Mixins.subtitle3,
    lineHeight: 21,
    color: '#6C6B6B',
  },
  reportText: {
    color: '#E03B3B',
  },
  backText: {
    color: '#F1811C',
  },
  quantityContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  inputStyle: {
    width: 100,
    height: 40,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ABABAB',
  },
});

function mapStateToProps(state) {
  return {
    ManifestCompleted: state.originReducer.filters.manifestCompleted,
    detectBarcode: state.originReducer.filters.isBarcodeScan,
    // for prototype only
    barcodeScanned: state.originReducer.filters.barcodeScanned,
    // end
    outboundList: state.originReducer.outboundList,
    keyStack: state.originReducer.filters.keyStack,
    currentTask: state.originReducer.filters.currentTask,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setBarcodeScanner: (toggle) => {
      return dispatch({type: 'ScannerActive', payload: toggle});
    },
    setItemIDScanned: (id) => {
      return dispatch({type: 'ListIDScanned', payload: id});
    },
    setItemScanned: (item) => {
      return dispatch({type: 'BarcodeScanned', payload: item});
    },
    setBottomBar: (toggle) => {
      return dispatch({type: 'BottomBar', payload: toggle});
    },
    setItemError: (error) => {
      return dispatch({type: 'TaskError', payload: error});
    },
    setItemSuccess: (error) => {
      return dispatch({type: 'TaskSuccess', payload: error});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
