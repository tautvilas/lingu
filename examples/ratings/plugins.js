Lingu.plugins.open = (words, parseState) => {
  Lingu.methods.changeScreen(words[0]);
  return {
    parseState,
    cursor: 1,
    stateEvents: []
  };
};
