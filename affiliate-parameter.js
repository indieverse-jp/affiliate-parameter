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
    'fam-ad.com': 'suid',
    // affiliate_ad
    //'ra.excite.co.jp': 'uix',
    //'gro-fru.net': 'uix',
    //'bizmotion.jp': 'uix',
    //'m-ads.jp': 'uix',
    'aff.partners.io': 'afp',
  };
  
  var links = [].slice.call(document.getElementsByTagName('a'));
  links.forEach(function(e) {
    var url = e.href;

    for (var domain in domainParamPairs) {
      if (url.indexOf(domain) !== -1) {
        var paramKey = domainParamPairs[domain];
        var redirectIndex = url.indexOf('?redirect_to=');
        var newParam = paramKey + '=' + encodeURIComponent(document.URL);
        if (redirectIndex !== -1) {
          var baseUrl = url.substring(0, redirectIndex);
          var redirectParam = url.substring(redirectIndex);
          var newUrl = baseUrl + '?' + newParam + '&' + redirectParam.substring(1); // remove the initial '?' from redirectParam
          e.setAttribute('href', newUrl);
        } else {
          if (url.indexOf('?') === -1) {
            url += '?' + newParam;
          } else {
            url += '&' + newParam;
          }
          e.setAttribute('href', url);
        }
        break;
      }
    }
  });