var domainParamPairs = {
    'presco.asia': 'afad_param_1',
    'moshimo.com': 's_v'
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