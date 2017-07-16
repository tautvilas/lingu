Lingu.react = {};
Lingu.react.render = (query, Comp, c) => {
  const context = Lingu.methods.initContext(c);
  const data = Lingu.methods.readSpace(context, Lingu.space, query);
  if (!Comp) {
    return data.join(' ');
  } else {
    return data.map((result) => {
      const r = result || {};
      const domProps = {'data-path': r._type + ' ' + r._id};
      return (<Comp item={r} attributes={domProps} key={r._id}/>);
    });
  }
};

