const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const script = fs.readFileSync(
  path.join(__dirname, '..', 'affiliate-parameter.js'),
  'utf8'
);

function createStorage(initialData) {
  const data = Object.assign({}, initialData);

  return {
    data,
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = String(value);
    }
  };
}

function createUnavailableStorage() {
  return {
    getItem() {
      throw new Error('localStorage is unavailable');
    },
    setItem() {
      throw new Error('localStorage is unavailable');
    }
  };
}

function rewriteLinks(pageUrl, linkHrefs, storage) {
  const anchors = linkHrefs.map(function(href) {
    return {
      href: href,
      setAttribute(name, value) {
        if (name === 'href') {
          this.href = value;
        }
      }
    };
  });
  const parsedPageUrl = new URL(pageUrl);

  vm.runInNewContext(script, {
    window: {
      location: {
        search: parsedPageUrl.search
      },
      localStorage: storage
    },
    document: {
      URL: pageUrl,
      getElementsByTagName(tagName) {
        return tagName === 'a' ? anchors : [];
      }
    },
    RegExp,
    decodeURIComponent,
    encodeURIComponent
  });

  return anchors.map(function(anchor) {
    return anchor.href;
  });
}

function getParam(url, key) {
  return new URL(url).searchParams.get(key);
}

function test(name, fn) {
  try {
    fn();
    console.log('ok - ' + name);
  } catch (error) {
    console.error('not ok - ' + name);
    throw error;
  }
}

test('uses gcid and the first landing page URL when gcid exists', function() {
  const storage = createStorage();
  const pageUrl = 'https://example.com/lp?gcid=test123&utm_source=ad';
  const rewritten = rewriteLinks(
    pageUrl,
    ['https://ad.presco.asia/cl/?b_id=tZLrIM4P&t_id=1'],
    storage
  );

  assert.strictEqual(
    getParam(rewritten[0], 'afad_param_1'),
    'test123,' + pageUrl
  );
  assert.strictEqual(storage.data['affiliateParameter.gcid'], 'test123');
  assert.strictEqual(storage.data['affiliateParameter.landingPageUrl'], pageUrl);
});

test('reuses stored gcid and landing page URL after navigating to another page', function() {
  const landingPageUrl = 'https://example.com/lp?gcid=test123&utm_source=ad';
  const storage = createStorage({
    'affiliateParameter.gcid': 'test123',
    'affiliateParameter.landingPageUrl': landingPageUrl
  });
  const rewritten = rewriteLinks(
    'https://example.com/next-page',
    ['https://cl.link-ag.net/click/ab95a7/e7d510c5'],
    storage
  );

  assert.strictEqual(
    getParam(rewritten[0], 'sid'),
    'test123,' + landingPageUrl
  );
});

test('falls back to the current page URL when gcid has never been stored', function() {
  const storage = createStorage();
  const pageUrl = 'https://example.com/no-gcid?x=1';
  const rewritten = rewriteLinks(
    pageUrl,
    ['https://ad.presco.asia/cl/?b_id=tZLrIM4P&t_id=1'],
    storage
  );

  assert.strictEqual(getParam(rewritten[0], 'afad_param_1'), pageUrl);
});

test('overwrites the stored gcid and landing page URL on a new gcid visit', function() {
  const storage = createStorage({
    'affiliateParameter.gcid': 'old123',
    'affiliateParameter.landingPageUrl': 'https://example.com/old-lp?gcid=old123'
  });
  const pageUrl = 'https://example.com/new-lp?gcid=next456';
  const rewritten = rewriteLinks(
    pageUrl,
    ['https://ad.presco.asia/cl/?b_id=tZLrIM4P&t_id=1'],
    storage
  );

  assert.strictEqual(
    getParam(rewritten[0], 'afad_param_1'),
    'next456,' + pageUrl
  );
  assert.strictEqual(storage.data['affiliateParameter.gcid'], 'next456');
  assert.strictEqual(storage.data['affiliateParameter.landingPageUrl'], pageUrl);
});

test('works without localStorage when gcid is on the current URL', function() {
  const pageUrl = 'https://example.com/storage-disabled?gcid=inline789';
  const rewritten = rewriteLinks(
    pageUrl,
    ['https://ad.presco.asia/cl/'],
    createUnavailableStorage()
  );

  assert.strictEqual(
    getParam(rewritten[0], 'afad_param_1'),
    'inline789,' + pageUrl
  );
});

test('uses ampersand for affiliate links that already have query parameters', function() {
  const storage = createStorage();
  const pageUrl = 'https://example.com/lp?gcid=test123';
  const rewritten = rewriteLinks(
    pageUrl,
    ['https://ad.presco.asia/cl/?b_id=tZLrIM4P&t_id=1'],
    storage
  );

  assert.match(rewritten[0], /&afad_param_1=/);
});

test('uses question mark for affiliate links without query parameters', function() {
  const storage = createStorage();
  const pageUrl = 'https://example.com/lp?gcid=test123';
  const rewritten = rewriteLinks(
    pageUrl,
    ['https://cl.link-ag.net/click/ab95a7/e7d510c5'],
    storage
  );

  assert.match(rewritten[0], /\\?sid=/);
});

test('does not modify links for unsupported domains', function() {
  const storage = createStorage();
  const link = 'https://example.net/normal-link';
  const rewritten = rewriteLinks(
    'https://example.com/lp?gcid=test123',
    [link],
    storage
  );

  assert.strictEqual(rewritten[0], link);
});
