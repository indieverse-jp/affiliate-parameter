/*!
 * Media Analytics Affiliate Parameter
 * https://media-analytics.jp
 *
 * Copyright Indieverse
 * https://media-analytics.jp
 *
 * Date: 2023-09-20
 */

var domainParamPairs = {
    'presco.asia': 'afad_param_1',
    'moshimo.com': 's_v',
    'link-ag.net': 'sid',
    'felmat.net': 'pb',
    'rentracks.jp': 'uix',
    'medipartner.jp': 'userID',
    // affilicode
    'affi-plus.com': 'pb',
    'rsmok.jp': 'pb',
    'matching-affi.jp': 'pb',
    'ratel-ad.com': 'pb',
    // famm
    'ver-net.jp': 'suid',
    'ad-track.jp': 'suid',
    'adplushome.com': 'suid',
    // affiliate_ad
    //'ra.excite.co.jp': 'uix',
    //'gro-fru.net': 'uix',
    //'bizmotion.jp': 'uix',
    //'m-ads.jp': 'uix',
  };
  
  var links = [].slice.call(document.getElementsByTagName('a'));
  links.some(function(e) {
    var url = e.href;
  
    for (var domain in domainParamPairs) {
      if (url.indexOf(domain) !== -1) {
        var paramKey = domainParamPairs[domain];
        if (url.indexOf('?') === -1) {
          url += '?' + paramKey + '=' + document.URL;
        } else {
          url += '&' + paramKey + '=' + document.URL;
        }
        e.setAttribute('href', url);
        return;
      }
    }
});