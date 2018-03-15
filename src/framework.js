//localStorage.clear();

const Lingu = {
  spaceDefs: {},
  queries: {},
  translations: {},
  domEventHandlers: [],
  changeHandlers: {},
  beforeEachHandlers: [],
  initHandlers: [],
  parseState: {},
  programParseDone: false,
  methods: {},
  query: {},

  plugins: {},
  evaluators: {},
  handlers: {}
};

Lingu.methods.watchObject = (obj, prop) => new Proxy(obj, {
  set(target, key, value) {
    target[key] = value;
    const changers = Lingu.changeHandlers[prop];
    if (changers) {
      changers.forEach(handler => handler());
    }
  },
  deleteProperty(target, key) {
    delete target[key];
    const changers = Lingu.changeHandlers[prop];
    if (changers) {
      changers.forEach(handler => handler());
    }
  }
});

Lingu.methods.triggerChangeHandlers = () => {
  Object.keys(Lingu.changeHandlers).forEach((handler) => {
    //console.log(handler, space[handler], changeHandlers[handler]);
    if (Lingu.space[handler] && Object.keys(Lingu.space[handler]).length) {
      Lingu.changeHandlers[handler].forEach(handler => handler());
    }
  });
};

Lingu.methods.bindDomEventHandlers = () => {
  Lingu.domEventHandlers.forEach(handler => {
    Lingu.methods.getElementsByClassName(handler.selector).forEach(element => {
      element.addEventListener(handler.event, handler.handler);
    });
  });
};

Lingu.methods.onInit = (handler) => {
  Lingu.initHandlers.push(handler);
};

Lingu.methods.parseQueryDefinition = (line) => {
  const wordLine = line.trim().substr(1, line.length);
  const words = wordLine.split(' ').map(word => {
    return Lingu.methods.normalizeLine(word);
  });
  Lingu.queries[words[0]] = words.slice(1);
};

Lingu.methods.parseLocalizationDefinition = (line) => {
  const wordLine = line.trim().substr(1, line.length);
  const words = wordLine.split(' ').map(word => {
    return Lingu.methods.normalizeLine(word);
  });
  Lingu.translations[words[0]] = words.slice(1).join(' ');
};

Lingu.methods.parseSpaceDefinition = (line) => {
  const words = line.split(' ').map(word => {
    return Lingu.methods.normalizeLine(word);
  });
  Lingu.spaceDefs[words[0]] = words.slice(1).reduce((acc, val) => {
    acc[val] = {};
    return acc;
  }, {});
  Lingu.store.initiateSpaceDef(words[0]);
  //console.log('SPACEDEF', JSON.stringify(Lingu.spaceDefs));
};

Lingu.methods.divideArray = (words, separator) => {
  const arrays = [];
  let activeArray = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i] === separator) {
      arrays.push(activeArray);
      activeArray = [];
    } else {
      activeArray.push(words[i]);
    }
  }
  if (activeArray.length) {
    arrays.push(activeArray);
  }
  return arrays;
};

Lingu.methods.parseActionLine = (words, parseState={event: {}}, prevParse) => {
  const rootParse = !prevParse;
  const space = Lingu.store.getSpace();
  let stateEvents = [];
  //console.log('WORDS', words);
  const masterWord = words[0];
  if (!masterWord) {
    return stateEvents;
  }
  if (masterWord === 'on') {
    Lingu.beforeEachHandlers.forEach(handler => {
      handler();
    });
    const arrays = Lingu.methods.divideArray(words.slice(1), ',');
    let constructs = arrays;
    if (arrays.length > 1) {
      constructs = [];
      for (let i = 0; i < arrays.length -1; i++) {
        constructs.push(arrays[i].concat(arrays[arrays.length - 1]));
      }
    }
    constructs.forEach((construct) => {
      const handler = Lingu.handlers[construct[0]];
      if (!handler) {
        console.error('Handler not found', construct[0]); //eslint-disable-line no-console
      } else {
        handler(construct.slice(1));
      }
    });
  } else if (Lingu.plugins[masterWord]) {
    const origWords = words.concat([]);
    const result = Lingu.plugins[masterWord](words.slice(1), parseState, space);
    // MUTABILITY AHEAD
    if (result.stateEvents) {
      stateEvents = stateEvents.concat(result.stateEvents);
      //console.log('HERE', stateEvents, result.stateEvents);
    }
    Object.assign(parseState, result.parseState);
    const childParseChanges = Lingu.methods.parseActionLine(origWords.slice((result.cursor || 0) + 1), parseState, true);
    stateEvents = stateEvents.concat(childParseChanges);
    if (rootParse) {
      Lingu.store.processEvents(stateEvents);
      if (stateEvents.length) {
        Lingu.methods.render(Lingu.store.getSpace());
      }
      Lingu.store.persistSpace();
      if (Lingu.programParseDone) {
        Lingu.methods.bindDomEventHandlers();
      }
    }
    return stateEvents;
  } else {
    console.error('unrecognized master word', masterWord); //eslint-disable-line no-console
    return stateEvents;
  }
};

Lingu.methods.parseSubroutines = (subroutines) => {
  subroutines.forEach(subroutine => {
    const words = subroutine.reduce((allWords, line) => allWords.concat(Lingu.methods.parseLine(line)), []);
    //console.log(words);
    if (words.length) {
      Lingu.methods.parseActionLine(words);
    }
  });
};

Lingu.methods.normalizeLine = (line) => {
  const normalized = line.trim().replace(/ +/g, ' ');
  return normalized;
};

Lingu.methods.parseLine = (line) => {
  //console.log('NORLINE', line);
  if (line.startsWith('*')) {
    Lingu.methods.parseQueryDefinition(line);
  } else if (line.startsWith('~')) {
    Lingu.methods.parseLocalizationDefinition(line);
  } else if (line.startsWith('!')) {
    return [];
  } else {
    const words = line.split(' ').map(word => {
      return Lingu.methods.normalizeLine(word);
    });
    return words;
    //console.log('SPACE', space);
  }
};

Lingu.methods.parseProgram = (text) => {
  const lines = text.split('\n');
  let currentSubroutine = 0;
  const subroutines = [[]];
  lines.forEach(line => {
    const normalized = Lingu.methods.normalizeLine(line.trim());
    if (normalized) {
      if (normalized.startsWith('on ')) {
        currentSubroutine++;
        subroutines.push([]);
      } else if (normalized.startsWith('*')) {
        Lingu.methods.parseLine(normalized);
        return;
      } else if (normalized.startsWith('~')) {
        Lingu.methods.parseLine(normalized);
        return;
      }
      subroutines[currentSubroutine].push(normalized);
    }
  });
  //console.log('SUBROUTINES', subroutines);
  Lingu.methods.parseSubroutines(subroutines);
};

Lingu.methods.print = (text) => {
  console.log('%c' + text, 'background: #222; color: #bada55'); //eslint-disable-line no-console
};

Lingu.methods.findAncestor = (el) => {
  let path;
  while (el) {
    el = el.parentNode;
    path = el.getAttribute('data-path');
    if (path) {
      break;
    }
  }
  return path;
};

Lingu.methods.getElementContext = (target) => {
  const path = Lingu.methods.findAncestor(target);
  let info;
  if (path) {
    info = path.split(' ');
    return Lingu.store.getSpace()[info[0]][info[1]];
  }
};

Lingu.methods.responseObject = (cursor=0, parseState={}, stateEvents=[]) => {
  return {
    cursor,
    parseState,
    stateEvents
  };
};

Lingu.methods.uuid =() => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

Lingu.methods.getElementsByClassName = (selector, root) => {
  const elements = (root || document).getElementsByClassName(selector);
  return [].slice.call(elements);
};

Lingu.methods.evalExpression = (words, parseState, appState) => {
  if (Lingu.evaluators[words[0]]) {
    const result = Lingu.evaluators[words[0]](words.slice(1), parseState, appState);
    return {
      value: result.value,
      parseState: result.parseState,
      cursor: result.cursor + 1
    };
  } else {
    const translation = Lingu.translations[words[0]];
    return {
      value: [translation || words[0]],
      cursor: 1
    };
  }
};

Lingu.methods.initContext = (c) => {
  let context;
  if (!c) {
    context = [Lingu.store.getSpace()];
  } else if (c.constructor !== Array) {
    context = [c];
  } else {
    context = c;
  }
  //console.log(c, context);
  return context;
};

Lingu.query.one = (query, c) => {
  //console.log(query, c);
  const context = Lingu.methods.initContext(c);
  const result = Lingu.methods.readSpace(context, Lingu.store.getSpace(), query);
  return result[0];
};

Lingu.query.many = (query, c) => {
  const context = Lingu.methods.initContext(c);
  const result = Lingu.methods.readSpace(context, Lingu.space, query);
  return result;
};

Lingu.methods.readSpace = (sp, space, query) => {
  const words = Lingu.methods.normalizeLine(query).split(' ');
  let locations = sp;
  for (let i = 0; i < words.length; i++) {
    let newLocations = [];
    let filter = {};
    const word = words[i];
    if (word === 'where') {
      filter = {
        property: words[i + 1],
        value: words[i + 2],
      };
      i += 2;
      locations = locations.filter(l => {
        if (!l || !l[filter.property]) return false;
        const propVal = filter.property === '_id' ? l[filter.property] : l[filter.property].join();
        return propVal === filter.value;
      });
      continue;
    }
    //console.warn(word);
    locations.forEach(location => {
      if (!location) return;
      const nextLocation = location[word];

      if (nextLocation) {
        if (nextLocation.constructor === Array) {
          nextLocation.forEach(l => {
            if (l.id) {
              newLocations.push(space[word][l.id]);
            } else {
              newLocations.push(l);
            }
          });
        } else {
          const values = Object.values(nextLocation);
          newLocations = newLocations.concat(values);
        }
      } else {
        //console.warn(word, 'NOT FOUND', word);
        return;
      }
    });
    //console.log(newLocations, word);
    locations = newLocations;
  }
  return locations;
  // TODO add non failing way to read data from state
};

Lingu.methods.parseQuery = (target, eventTarget) => {
  const space = Lingu.store.getSpace();
  let c;
  if (target === 'selected') {
    c = [Lingu.methods.getElementContext(eventTarget)];
    return c;
  } else {
    const query = Lingu.queries[target] || [target];
    const start = query[0] === 'selected' ? [Lingu.methods.getElementContext(eventTarget)] : [space];
    const queryWords = query[0] === 'selected' ? query.slice(1) : query;
    //console.log(start, queryWords);
    const result = Lingu.methods.readSpace(start, space, queryWords.join(' '));
    //console.warn('found query match', start, result, queryWords);
    return result;
  }
};

Lingu.methods.parseSelector = function (words, eventTarget) {
  let elements = [];
  let cursor = 1;
  if (words[0] === 'target') {
    elements = [eventTarget];
  } else if (words.length > 1 && words[1] === 'for') {
    const dataTarget = words[2];
    const data = Lingu.methods.parseQuery(dataTarget, eventTarget);
    data.forEach(d => {
      const els = document.querySelectorAll('[data-path="' + d._type + ' ' + d._id + '"]');
      for (let i = 0; i < els.length; i++) {
        elements = elements.concat(Lingu.methods.getElementsByClassName(words[0], els[i]));
      }
    });
    cursor += 2;
  } else {
    elements = Lingu.methods.getElementsByClassName(words[0]);
  }
  return {cursor, elements};
};

Lingu.methods.init = (render) => {
  Lingu.methods.render = render;
  let spaceResolver;
  const spaceResolutionPromise = new Promise((resolve) => {
    spaceResolver = resolve;
  });

  [].slice.call(document.scripts).map((script) => {
    if (script.type === 'text/lingu') {
      Promise.all([fetch(script.src), spaceResolutionPromise]).then(response => {
        //console.log(response));
        return response[0].text();
      }).then(text => {
        Lingu.methods.parseProgram(text);
        Lingu.programParseDone = true;
        Lingu.methods.bindDomEventHandlers();

        Lingu.methods.render(Lingu.store.getSpace());

        if (!Lingu.firstRun) {
          Lingu.methods.triggerChangeHandlers();
        } else {
          Lingu.initHandlers.forEach(handler => handler());
        }
      });
    } else if (script.type === 'text/spacedef') {
      Lingu.store = new LinguLocalStore();

      fetch(script.src).then(response => {
        //console.log(response));
        return response.text();
      }).then(text => {
        const lines = text.split('\n');
        lines.forEach(line => {
          Lingu.methods.parseSpaceDefinition(Lingu.methods.normalizeLine(line));
        });
        spaceResolver();
      });
    }
  });
};

module.exports = {
  readSpace: Lingu.methods.readSpace
};

Lingu.methods.print('framework loaded');

