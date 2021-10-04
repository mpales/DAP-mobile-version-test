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
    case 'Waiting':
      color = '#ABABAB';
      break;
    case 'In Progress':
      color = '#F07120';
      break;
    case 'Pending Review':
      color = '#F8B511';
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
