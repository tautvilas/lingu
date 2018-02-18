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
      } else if (event.type === 'add') {
        const appendTo = Lingu.context;
        const id = event.item.id;
        const abs = event.item.type;
        if (appendTo) {
          if (!Lingu.space[appendTo.type][appendTo.id][abs]) {
            Lingu.space[appendTo.type][appendTo.id][abs] = [];
          }
          Lingu.space[appendTo.type][appendTo.id][abs].push({id: id});
        }
        Lingu.space[abs][id] = {_parent: appendTo, _id: id, _type: abs};
      }
    });
  }

  this.getSpace = function() {
    return Lingu.space;
  }
}
