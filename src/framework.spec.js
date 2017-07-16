var assert = require('assert');

global.document = {scripts: []};

const fr = require('./framework');

const spaceMap = {
  item: {
    1: {title: ['A']},
    2: {title: ['B']}
  },
  app: {
    1: {
      post: [{id: 1}, {id: 2}]
    },
    2: {
      post: [{id: 3}, {id: 4}]
    }
  },
  post: {
    1: {status: ['posted']},
    2: {status: ['posted', 'unposted']},
    3: {status: ['unposted']},
    4: {status: ['posted']},
    5: {status: ['posted']},
  }
};

describe('Query language', () => {
  it('should get items property according to query', () => {
    const titles = fr.readSpace([spaceMap], spaceMap, 'item title');
    assert.deepEqual(titles, ['A', 'B']);
  });

  it('shoud support partial querying', () => {
    const items = fr.readSpace([spaceMap], spaceMap, 'item');
    const titles = fr.readSpace(items, spaceMap, 'title');
    assert.deepEqual(titles, ['A', 'B']);
  });

  it('shoud support 0 level querying', () => {
    const items = fr.readSpace([spaceMap], spaceMap, 'item');
    assert.deepEqual(items, [{title: ['A']}, {title: ['B']}]);
  });

  it('should support where clause', () => {
    let posts = fr.readSpace([spaceMap], spaceMap, 'app post status');
    assert.deepEqual(posts, ['posted', 'posted', 'unposted', 'unposted', 'posted']);
    posts = fr.readSpace([spaceMap], spaceMap, 'app post');
    assert.deepEqual(posts[0], {status: ['posted']});
    posts = fr.readSpace([spaceMap], spaceMap, 'app post where status posted status');
    assert.deepEqual(posts, ['posted', 'posted']);
  });

});
