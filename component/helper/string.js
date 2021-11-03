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
    let arrayString = newString
      .split(' ')
      .map((string) => string.charAt(0).toUpperCase() + string.slice(1));
    return arrayString.join(' ');
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

export const productGradeToString = (value) => {
  let gradeString;
  switch (value) {
    case 1:
      gradeString = 'PICK';
      break;
    case 2:
      gradeString = 'BUFFER';
      break;
    case 3:
      gradeString = 'DAMAGE';
      break;
    case 4:
      gradeString = 'DEFECTIVE';
      break;
    case 5:
      gradeString = 'SHORT EXPIRY';
      break;
    case 6:
      gradeString = 'EXPIRED';
      break;
    case 7:
      gradeString = 'NO STOCK';
      break;
    case 8:
      gradeString = 'RESERVE';
    default:
      gradeString = '';
      break;
  }
  return gradeString;
};
