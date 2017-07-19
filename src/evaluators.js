Lingu.evaluators.from = (words, parseState) => {
  const {elements, cursor} = Lingu.methods.parseSelector(words, parseState.event.target);
  const value = elements.reduce((prev, next) => {
    return (prev + (next.value || next.getAttribute('data-value'))).trim();
  }, '');
  return {
    cursor,
    value: value
  };
};

Lingu.evaluators.empty = (words, parseState) => {
  const {elements, cursor} = Lingu.methods.parseSelector(words, parseState.event.target);
  const isEmpty = elements.reduce((prev, next) => {
    return (next.value.trim() === '') && prev;
  }, true);
  return {
    cursor,
    value: isEmpty
  };
};

Lingu.evaluators.is = (words, parseState) => {
  const comp1 = Lingu.methods.parseQuery(words[0], parseState.event.target);
  const comp2 = words[1];
  const result = comp1.reduce((prev, next) => {
    return prev && next === comp2;
  }, true);
  return {
    cursor: 2,
    value: result
  };
};

Lingu.evaluators.has = (words, parseState) => {
  const objs = Lingu.methods.parseQuery(words[0], parseState.event.target);
  return {
    cursor: 1,
    value: objs.length !== 0
  };
};

Lingu.evaluators.not = (...args) => {
  const result = Lingu.methods.evalExpression(...args);
  result.value = !result.value;
  return result;
};

Lingu.evaluators.valueOf = (words, parseState) => {
  const objs = Lingu.methods.parseQuery(words[0], parseState.event.target);
  return {
    cursor: 1,
    value: objs.join('')
  }
};

