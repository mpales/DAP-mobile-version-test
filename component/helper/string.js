import {string} from 'prop-types';

export const clientProductStatus = (value) => {
  let statusString;
  switch (value) {
    case 1:
      statusString = 'On Hand';
      break;
    case 2:
      statusString = 'Free';
      break;
    case 3:
      statusString = 'ASN/Transit';
      break;
    case 4:
      statusString = 'Sales Order';
      break;
    default:
      statusString = '';
      break;
  }
  return statusString;
};

export const cleanKeyString = (value) => {
  let newString = value.replace('_', ' ');
  if (newString.toLowerCase() === 'uom') {
    return newString.toUpperCase();
  } else {
    return newString.charAt(0).toUpperCase() + newString.slice(1);
  }
};
