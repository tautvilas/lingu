function LinguLocalStore() {
  this.processEvents = function(events, space) {
    events.forEach(event => {
      if (event.type === 'update') {
        const object = Lingu.query.one(Lingu.context.type + ' ' + event.query);
        object[event.property] = event.value;
      } else if (event.type === 'remove') {
        event.items.forEach(c => {
          const parent = c._parent;
          if (parent) {
            const parentList = Lingu.space[parent.type][parent.id][c._type];
            const index = parentList.findIndex((v) => {return v.id === c._id;});
            if (index !== -1) {
              parentList.splice(index, 1);
            }
          }
          delete Lingu.space[c._type][c._id];
        });
      }
    });
  }

  this.getSpace = function() {
    return Lingu.space;
  }
}
