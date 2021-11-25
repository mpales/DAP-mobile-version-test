var Url = require("url")
var assign = require("oolong").assign
var merge = require("oolong").merge
const RNFetchBlob = require('rn-fetch-blob');
var PARSE_QUERY = false
var PROTOCOL_RELATIVE = true // Enable //example.com/models to mimic browsers.

exports = module.exports = function(fetchInstance, rootUrl, defaults) {
  if (typeof rootUrl === "string") rootUrl = parseUrl(rootUrl)
  else defaults = rootUrl, rootUrl = null
  return assign(exports.fetch.bind(null, fetchInstance, rootUrl, defaults), fetchInstance)
}

exports.fetch = async function(fetchInstance, rootUrl, defaults, url, opts, data, UploadProgress, Progress, canceled) {
  if (rootUrl != null) url = rootUrl.resolve(url)
  
  if (typeof defaults === "function") defaults = await defaults();
      if(opts.method === 'POST' || opts.method === 'PUT'){
        let fetchinit = fetchInstance.fetch(opts.method,url, defaults ,data).uploadProgress({ interval : 100 },UploadProgress)
        // listen to download progress event, every 10%
        .progress({ count : 10 }, Progress);
        if(typeof canceled === 'function') canceled(fetchinit.cancel);
        return fetchinit;
      } else {
       let fetchinit = fetchInstance.fetch(opts.method,url, defaults).progress({ interval: 250},Progress);
        // listen to download progress event, every 10%
        if(typeof canceled === 'function') canceled(fetchinit.cancel);
        return fetchinit;
      }
}

function parseUrl(url) {
  return Url.parse(url, PARSE_QUERY, PROTOCOL_RELATIVE)
}