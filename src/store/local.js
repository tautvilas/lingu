function LinguLocalStore() {
  this.changeHandlers = {};

  this.watchObject = function(obj, prop) {
    const changeHandlers = this.changeHandlers;
    return new Proxy(obj, {
      set(target, key, value) {
        target[key] = value;
        const changers = changeHandlers[prop];
        if (changers) {
          changers.forEach(handler => handler());
        }
      },
      deleteProperty(target, key) {
        delete target[key];
        const changers = changeHandlers[prop];
        if (changers) {
          changers.forEach(handler => handler());
        }
      }
    });
  };

  const storage = (typeof localStorage !== 'undefined') ? localStorage.getItem('appStorage') : undefined;
  Lingu.firstRun = storage ? false : true;
  Lingu.space = Lingu.firstRun ? {} : JSON.parse(storage);

  this.processEvents = function(events) {
    events.forEach(event => {
      if (event.type === 'update') {
        const objects = Lingu.query.many(Lingu.context.type + ' ' + event.query);
        objects.forEach(object => {
          const target = Lingu.space[object._type][object._id];
          target[event.property] = event.value;
          Lingu.space[object._type][object._id] = Object.assign({}, target); // trigger change handlers
        });
      } else if (event.type === 'set') {
        event.items.forEach(d => {
          const target = Lingu.space[d._type][d._id];
          target[event.property] = event.value;
          Lingu.space[d._type][d._id] = Object.assign({}, target); // trigger change handlers
        });
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
      } else if (event.type === 'init') {
        const entity = event.entity;
        Lingu.space[entity.type][entity.id] = {
          _type: entity.type,
          _id: entity.id
        };
      }
    });
  }

  this.initiateSpaceDef = function(type) {
    if (!Lingu.space[type]) {
      Lingu.space[type] = this.watchObject({}, type);
    } else {
      Lingu.space[type] = this.watchObject(Lingu.space[type], type);
    }
    this.changeHandlers[type] = [];
  }

  this.getSpace = function() {
    return JSON.parse(JSON.stringify(Lingu.space));
  }

  this.persistSpace = function() {
    localStorage.setItem('appStorage', JSON.stringify(Lingu.space));
  }

  this.subscribe = function(target, callback) {
    this.changeHandlers[target].push(callback);
  }

  this.initDone = function() {
    Object.keys(this.changeHandlers).forEach((handler) => {
      //console.log(handler, space[handler], changeHandlers[handler]);
      if (Lingu.space[handler] && Object.keys(Lingu.space[handler]).length) {
        this.changeHandlers[handler].forEach(handler => handler());
      }
    });
  }
}
