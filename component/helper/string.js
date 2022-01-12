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
      gradeString = 'DAMAGED';
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
      gradeString = 'NS';
      break;
    case 8:
      gradeString = 'RESERVED';
      break;
    case 9:
      gradeString = 'SIT';
      break;
    case 10:
      gradeString = 'REWORKS';
      break;
    default:
      gradeString = '-';
      break;
  }
  return gradeString;
};

export const reasonCodeToString = (value) => {
  let reasonString;
  switch (value) {
    case 1:
      reasonString = 'BATCHADJ';
      break;
    case 2:
      reasonString = 'CANCEL';
      break;
    case 3:
      reasonString = 'DAMAGED';
      break;
    case 4:
      reasonString = 'EXPADJ';
      break;
    case 5:
      reasonString = 'EXTRA';
      break;
    case 6:
      reasonString = 'LOTADJ';
      break;
    case 7:
      reasonString = 'OC';
      break;
    case 8:
      reasonString = 'PC';
      break;
    case 9:
      reasonString = 'QA INSPECT';
      break;
    case 10:
      reasonString = 'RELOCATION';
      break;
    case 11:
      reasonString = 'STK COUNT';
      break;
    case 12:
      reasonString = 'WE';
      break;
    default:
      reasonString = '';
      break;
  }
  return reasonString;
};
