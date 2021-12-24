var Url = require('url');
var assign = require('oolong').assign;
var merge = require('oolong').merge;
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
var PARSE_QUERY = false;
var PROTOCOL_RELATIVE = true; // Enable //example.com/models to mimic browsers.

exports = module.exports = function (fetchInstance, rootUrl, defaults) {
  if (typeof rootUrl === 'string') rootUrl = parseUrl(rootUrl);
  else (defaults = rootUrl), (rootUrl = null);
  return assign(
    exports.fetch.bind(null, fetchInstance, rootUrl, defaults),
    fetchInstance,
  );
};

exports.fetch = async function (
  fetchInstance,
  rootUrl,
  defaults,
  url,
  opts,
  data,
  UploadProgress,
  Progress,
  canceled,
) {
  if (rootUrl != null) url = rootUrl.resolve(url);

  if (typeof defaults === 'function') defaults = await defaults();
  // get photos and signature to return blob data for ios

  if (opts.method === 'POST' || opts.method === 'PUT') {
    if (Platform.OS === 'ios') {
      let rawSignatureBlob;
      for (let i = 0; i < data.length; i++) {
        if (
          (data[i].name === 'photos' || data[i].name === 'signature') &&
          (data[i].type.includes('image/jpg') ||
            data[i].type.includes('image/png'))
        ) {
          rawSignatureBlob = await RNFetchBlob.fs
            .readFile(data[i].data, 'base64')
            .then((blob) => {
              return blob;
            });
          data[i].data = rawSignatureBlob;
        }
      }
    }
    let fetchinit = fetchInstance
      .fetch(opts.method, url, defaults, data)
      .uploadProgress({interval: 100}, UploadProgress)
      // listen to download progress event, every 10%
      .progress({count: 10}, Progress);
    if (typeof canceled === 'function') canceled(fetchinit.cancel);
    return fetchinit;
  } else {
    let fetchinit = fetchInstance
      .fetch(opts.method, url, defaults)
      .progress({interval: 250}, Progress);
    // listen to download progress event, every 10%
    if (typeof canceled === 'function') canceled(fetchinit.cancel);
    return fetchinit;
  }
};

function parseUrl(url) {
  return Url.parse(url, PARSE_QUERY, PROTOCOL_RELATIVE);
}
