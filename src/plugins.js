Lingu.plugins.remove = (words, parseState) => {
  const target = words[0];
  const data = Lingu.methods.parseQuery(target, parseState.event.target);
  return {
    parseState,
    cursor: 1,
    mutateState: s => {
      data.forEach(c => {
        const parent = c._parent;
        if (parent) {
          const parentList = s[parent.type][parent.id][c._type];
          const index = parentList.findIndex((v) => {return v.id === c._id;});
          if (index !== -1) {
            parentList.splice(index, 1);
          }
        }
        delete s[c._type][c._id];
      });
    }
  };
};

Lingu.plugins.set = (words, parseState, appState) => {
  const prop = words[0];
  const evaluation = Lingu.methods.evalExpression(words.slice(1), parseState, appState);
  return {
    parseState,
    cursor: 1 + evaluation.cursor,
    mutateState: s => {
      parseState.updateTo.forEach(d => {
        const target = s[d._type][d._id];
        target[prop] = [evaluation.value];
        s[d._type][d._id] = Object.assign({}, target); // trigger change handlers
      });
    }
  };
};

Lingu.plugins.update = (words, parseState) => {
  const target = words[0];
  const data = Lingu.methods.parseQuery(target, parseState.event.target);
  return {
    parseState: {
      updateTo: data
    },
    cursor: 1
  };
};

Lingu.plugins.add = (words) => {
  const abs = words[0];
  if (!Lingu.spaceDefs[abs]) {
    console.error('Space abstraction', abs, 'not found'); // eslint-disable-line no-console
  }
  const id = Lingu.methods.uuid();
  return {
    parseState: {construct: {type: abs, id: id}},
    mutateState: s => {
      const appendTo = Lingu.context;
      if (appendTo) {
        if (!s[appendTo.type][appendTo.id][abs]) {
          s[appendTo.type][appendTo.id][abs] = [];
        }
        s[appendTo.type][appendTo.id][abs].push({id: id});
      }
      /*
      if (!s[parseState]) {
        s[abs] = [];
      }*/
      s[abs][id] = {_parent: appendTo, _id: id, _type: abs};
    },
    cursor: 1
  };
};

Lingu.plugins.clear = (words, parseState) => {
  const {elements, cursor} = Lingu.methods.parseSelector(words, parseState.event.target);
  (elements).forEach((el) => {
    el.value = '';
  });
  return Lingu.methods.responseObject(cursor);
};

Lingu.plugins.focus = (words, parseState) => {
  const {elements, cursor} = Lingu.methods.parseSelector(words, parseState.event.target);
  elements.forEach((el) => {
    el.focus();
  });
  return Lingu.methods.responseObject(cursor);
};

Lingu.plugins.show = (words, parseState) => {
  const {elements, cursor} = Lingu.methods.parseSelector(words, parseState.event.target);
  elements.forEach((el) => {
    el.style.display = 'block';
  });
  return Lingu.methods.responseObject(cursor);
};

Lingu.plugins.hide = (words, parseState) => {
  const {elements, cursor} = Lingu.methods.parseSelector(words, parseState.event.target);
  elements.forEach((el) => {
    el.style.display = 'none';
  });
  return Lingu.methods.responseObject(cursor);
};

Lingu.plugins.context = (words) => {
  const abs = words[0];
  let id = Lingu.methods.uuid();
  let mutateState = () => {};
  if (Object.keys(Lingu.space[abs]).length) {
    id = Object.keys(Lingu.space[abs])[0];
  } else {
    mutateState = s => {
      s[abs][id] = {
        _type: abs,
        _id: id
      };
    };
  }
  Lingu.context = {
    type: abs,
    id: id
  };
  return {
    cursor: 1,
    mutateState
  };
};

Lingu.plugins.else = (words, parseState) => {
  if (parseState.ifValue) {
    return {
      parseState,
      cursor: words.indexOf('.') === -1 ? words.length : words.indexOf('.')
    };
  } else {
    return {
      cursor: 0,
      parseState
    };
  }
};

Lingu.plugins.if = (words, parseState, appState) => {
  const result = Lingu.methods.evalExpression(words, parseState, appState);
  const resultParseState = Object.assign({}, result.parseState, {ifValue: result.value});
  if (result.value === true) {
    return {
      cursor: result.cursor,
      parseState: resultParseState
    };
  } else {
    const elseLocation = words.indexOf('else');
    const nextCursor = elseLocation === -1 ? (words.indexOf('.') === -1 ? words.length : words.indexOf('.')) : elseLocation;
    return {
      cursor: nextCursor,
      parseState: resultParseState
    };
  }
};

Lingu.plugins.with = (words, parseState) => {
  const prop = words[0];
  const valueResult = Lingu.methods.evalExpression(words.slice(1), parseState);
  const construct = parseState.construct;
  return {
    cursor: 1 + valueResult.cursor,
    parseState: {},
    mutateState: s => {
      s[construct.type][construct.id][prop] = [valueResult.value];
    }
  };
};

Lingu.plugins.setInputValue = (words, parseState) => {
  const {cursor, elements} = Lingu.methods.parseSelector(words, parseState.event.target);
  const data = Lingu.methods.evalExpression(words.slice(cursor), parseState);
  elements.forEach((el, i) => {
    el.value = data.value;
  });
  return {
    cursor: cursor + data.cursor
  };
};

Lingu.plugins.log = (words, parseState) => {
  const valueResult = Lingu.methods.evalExpression(words, parseState);
  Lingu.methods.print('LOG: ' + valueResult.value);
  return {
    cursor: valueResult.cursor
  };
};

Lingu.plugins.and = () => ({});
Lingu.plugins['.'] = () => ({});
Lingu.plugins.then = () => ({});

