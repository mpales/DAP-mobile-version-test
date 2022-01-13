export const receivingStatusColor = (status) => {
  let color = '';
  switch (status) {
    // manifest status
    case 'Assigned':
      color = '#ABABAB';
      break;
    case 'Shipment Received':
      color = '#ABABAB';
      break;
    case 'Warehouse Processing':
      color = '#F1811C';
      break;
    case 'Warehouse Processed':
      color = '#17B055';
      break;
    // connote status
    case 'Pending':
      color = '#ABABAB';
      break;
    case 'Processing':
      color = '#F1811C';
      break;
    case 'Processed':
      color = '#17B055';
      break;
    case 'Reported':
      color = '#E03B3B';
      break;
    default:
      color = '#ABABAB';
      break;
  }
  return color;
};

export const deliveryStatusColor = (status) => {
  let color = '';
  switch (status) {
    case 'Complete':
      color = '#17B055';
      break;
    case 'Pending':
      color = '#ABABAB';
      break;
    case 'On Delivery':
      color = '#F1811C';
      break;
    case 'Postponed':
      color = '#E03B3B';
      break;
    default:
      color = '#ABABAB';
      break;
  }
  return color;
};

export const requestRelocationJobStatusColor = (status) => {
  let color = '';
  switch (status) {
    case 'Processing':
      color = '#F07120';
      break;
    case 'Completed':
      color = '#17B055';
      break;
    case 'Pending':
      color = '#ABABAB';
      break;
    case 'Reported':
      color = '#E03B3B';
      break;
    default:
      color = '#ABABAB';
      break;
  }
  return color;
};

export const stockTakeJobStatusColor = (status) => {
  let color = '';
  switch (status) {
    case 'Completed':
      color = '#17B055';
      break;
    case 'Pending':
      color = '#ABABAB';
      break;
    case 'Processing':
      color = '#F07120';
      break;
    case 'Recount':
      color = '#F8B511';
      break;
    case 'Pending Review':
      color = '#F8B511';
      break;
    case 'Reported':
      color = '#E03B3B';
      break;
    case 'Processed':
      color = '#17B055';
      break;
    default:
      color = '#ABABAB';
      break;
  }
  return color;
};

export const pickTaskStatusColor = (status) => {
  let color = '';
  switch (status) {
    case 2:
      color = '#ABABAB';
      break;
    case 3:
      color = '#F07120';
      break;
    case 4:
      color = '#17B055';
      break;
    case 5:
      color = '#E03B3B';
      break;
    default:
      color = '#ABABAB';
      break;
  }
  return color;
};

export const pickTaskProductStatusColor = (status) => {
  let color = '';
  switch (status) {
    case 1:
      color = '#ABABAB';
      break;
    case 2:
      color = '#F07120';
      break;
    case 3:
      color = '#17B055';
      break;
    case 4:
      color = '#E03B3B';
      break;
    default:
      color = '#ABABAB';
      break;
  }
  return color;
};
