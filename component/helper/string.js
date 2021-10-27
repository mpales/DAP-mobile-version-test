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

export const clientProductStatusEndpoint = (value) => {
  let statusString;
  switch (value) {
    case 1:
      statusString = 'onHand';
      break;
    case 2:
      statusString = 'free';
      break;
    case 3:
      statusString = 'ASN';
      break;
    case 4:
      statusString = 'salesOrder';
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

export const stockTakeJobStatus = (value) => {
  let statusString;
  switch (value) {
    case 2:
      statusString = 'Waiting';
      break;
    case 3:
      statusString = 'In Progress';
      break;
    case 4:
      statusString = 'Completed';
      break;
    default:
      statusString = '';
      break;
  }
  return statusString;
};

export const stockTakeCountStatus = (value) => {
  let statusString;
  switch (value) {
    case 2:
      statusString = 'Waiting';
      break;
    case 3:
      statusString = 'In Progress';
      break;
    case 4:
      statusString = 'Completed';
      break;
    default:
      statusString = '';
      break;
  }
  return statusString;
};
