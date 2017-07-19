Lingu.evaluators.from = (words, parseState) => {
  const {elements, cursor} = Lingu.methods.parseSelector(words, parseState.event.target);
  const value = elements.map(element => {
    return (element.value || element.getAttribute('data-value')).trim();
  });
  return {
    cursor,
    value: value
  };
};

Lingu.evaluators.empty = (words, parseState) => {
  const {elements, cursor} = Lingu.methods.parseSelector(words, parseState.event.target);
  const isEmpty = elements.map(element => {
    return element.value.trim() === '';
  });
  return {
    cursor,
    value: isEmpty
  };
};

Lingu.evaluators.is = (words, parseState) => {
  const comp1 = Lingu.methods.parseQuery(words[0], parseState.event.target);
  const comp2 = Lingu.methods.evalExpression(words.slice(1));
  const result = comp1.map(next => {
    return next === comp2.value[0];
  });
  return {
    cursor: 1 + comp2.cursor,
    value: result
  };
};

Lingu.evaluators.has = (words, parseState) => {
  const objs = Lingu.methods.parseQuery(words[0], parseState.event.target);
  return {
    cursor: 1,
    value: [objs.length !== 0]
  };
};

Lingu.evaluators.not = (...args) => {
  const result = Lingu.methods.evalExpression(...args);
  const newValues = [];
  result.value.forEach(v => {
    newValues.push(!v);
  });
  result.value = newValues;
  return result;
};

Lingu.evaluators.valueOf = (words, parseState) => {
  const objs = Lingu.methods.parseQuery(words[0], parseState.event.target);
  return {
    cursor: 1,
    value: objs
  };
};

