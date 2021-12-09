import React, {useState} from 'react';
import {Card} from 'react-native-elements';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import ArrowDown from '../../assets/icon/iconmonstr-arrow-66mobile-1.svg';
import ArrowUp from '../../assets/icon/iconmonstr-arrow-66mobile-4.svg';
import Mixins from '../../mixins';
// component
import {TextList} from './Text-list';
// helper
import Format from '../helper/format';
import {productGradeToString, reasonCodeToString} from '../helper/string';

const ExpandableCard = ({item, reasonCode, remark}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableWithoutFeedback onPress={handleExpanded}>
      <Card containerStyle={styles.cardContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextList title="Item Code" value={item.product.item_code} />
          {isExpanded ? (
            <ArrowUp fill="#2D2C2C" width="20" height="20" />
          ) : (
            <ArrowDown fill="#2D2C2C" width="20" height="20" />
          )}
        </View>
        <TextList title="Quantity" value={item.quantity} isBold={true} />
        <TextList title="UOM" value={item.productUom.packaging} isBold={true} />
        {isExpanded && (
          <>
            <TextList title="Description" value={item.product.description} />
            <TextList title="Request By" value={item.client.name} />
            <TextList title="Grade" value={productGradeToString(item.grade)} />
            <TextList
              title="Expirty Date"
              value={item.attributes?.expiry_date}
            />
            <TextList title="Batch No" value={item.batchNo} />
            <TextList
              title="Reason Code"
              value={reasonCodeToString(reasonCode)}
            />
            <TextList title="Remarks" value={remark} />
          </>
        )}
      </Card>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default ExpandableCard;
