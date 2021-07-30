import crossFetch from 'cross-fetch';
import {SERVER_DOMAIN} from '../../constant/server';
import fetchDefaults from './network-mixins';
import fetchBlobDefault from './network-blob-mixins';
import AsyncStorage from '@react-native-community/async-storage';
import {getUserAgent} from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
/**
 * Created on Tue May 11 2021
 *
 * fetching data from API
 *
 * function get called and will return response
 *
 * @param key
 * @return token
 * @throws null
 * @todo need to install @react-native-async-storage/async-storage
 * @author Daniel Lim (daniel@grip-principle.com)
 */
const getDeviceSignature = async () => {
  return AsyncStorage.getItem('persist:originReducer').then((store) => {
    return JSON.parse(store)['deviceSignature'];
  });
};

const getToken = async (key) => {
  // buffer in js because sometimes, we want to make sure the storage are ready
  return AsyncStorage.getItem('persist:originReducer').then((store) => {
    return JSON.parse(store)[key];
  });
};

var apiFetch = fetchDefaults(crossFetch, SERVER_DOMAIN, async (url, opt) => {
  let token = null;
  let signature = null;
  let UA = null;
  //replace quotes from storage string
  await getToken('jwtToken').then((test) => {
    token = test.replace(/^"(.+(?="$))"$/, '$1');
  });
 
  await getDeviceSignature().then((test) => {
    signature = test.replace(/^"(.+(?="$))"$/, '$1');
  });
  console.log(signature);

  await getUserAgent().then((userAgent) => {
    UA = userAgent;
    // iOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143"
    // tvOS: not available
    // Android: ?
    // Windows: ?
  });

  return {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UA,
      fingerprint: signature,
      authToken: token,
    },
  };
});
var blobFetch = fetchBlobDefault(RNFetchBlob, SERVER_DOMAIN, async () => {
  let token = null;
  let signature = null;
  let UA = null;
  //replace quotes from storage string
  await getToken('jwtToken').then((test) => {
    token = test.replace(/^"(.+(?="$))"$/, '$1');
  });
 
  await getDeviceSignature().then((test) => {
    signature = test.replace(/^"(.+(?="$))"$/, '$1');
  });
  console.log(signature);

  await getUserAgent().then((userAgent) => {
    UA = userAgent;
    // iOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143"
    // tvOS: not available
    // Android: ?
    // Windows: ?
  });

  return {
      'Content-Type': 'multipart/form-data',
      'User-Agent': UA,
      fingerprint: signature,
      authToken: token,
    };
});

export const getData = (path) => {
  let result = (async () => {
    try {
      const res = await apiFetch(path, {
        method: 'GET',
      });
      if (res.headers.map['content-type'].includes('text/plain')) {
        return res.text();
      } else if (res.headers.map['content-type'].includes('text/html')) {
        return responseHandler(res);
      }
      return res.json();
    } catch (err) {
      return err;
    }
  })();
  return result;
};


export const postBlob = (path, data, callbackUploadProgress, callbackProgress) => {
  let result = (async () => {
    try {
      const res = await blobFetch(path,{method:'POST'},data,callbackUploadProgress,callbackProgress);
      if (res.respInfo.headers['Content-Type'].includes('text/plain')) {
        return res.data;
      } else if (res.respInfo.headers['Content-Type'].includes('text/html')) {
        return responseBlobHandler(res);
      }
      return res.json();
    } catch (err) {
      return err;
    }
  })();
  return new Promise((resolve, reject) => {
    resolve(result);
  });;
};

export const postData = (path, data) => {
  let result = (async () => {
    try {
      const res = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.headers.map['content-type'].includes('text/plain')) {
        return res.text();
      } else if (res.headers.map['content-type'].includes('text/html')) {
        return responseHandler(res);
      }
      return res.json();
    } catch (err) {
      return err;
    }
  })();
  return result;
};

export const putData = (path, data) => {
  let result = (async () => {
    try {
      const res = await apiFetch(path, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return res.json();
    } catch (err) {
      return err;
    }
  })();
  return result;
};

const responseHandler = (response) => {
  const {status} = response;
  switch (status) {
    case 200:
      return response.text();
    case 404:
      return 'Not found';
    case 403:
      return response.text();
    case 504:
      return 'Bad gateway';
    default:
      return 'Something went wrong';
  }
};

const responseBlobHandler = (response) => {
  const {status} = response.respInfo;
  switch (status) {
    case 200:
      return response.text();
    case 404:
      return 'Not found';
    case 403:
      return response.text();
    case 504:
      return 'Bad gateway';
    default:
      return 'Something went wrong';
  }
};
