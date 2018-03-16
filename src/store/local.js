function LinguLocalStore() {
  const changeHandlers = {};
  const storage = (typeof localStorage !== 'undefined') ? localStorage.getItem('appStorage') : undefined;
  Lingu.firstRun = storage ? false : true;
  const _space_ = Lingu.firstRun ? {} : JSON.parse(storage);


  const _watchObject = function(obj, prop) {
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

  this.processEvents = function(events) {
    events.forEach(event => {
      if (event.type === 'update') {
        const objects = Lingu.query.many(Lingu.context.type + ' ' + event.query);
        objects.forEach(object => {
          const target = _space_[object._type][object._id];
          target[event.property] = event.value;
          _space_[object._type][object._id] = Object.assign({}, target); // trigger change handlers
        });
      } else if (event.type === 'set') {
        event.items.forEach(d => {
          const target = _space_[d._type][d._id];
          target[event.property] = event.value;
          _space_[d._type][d._id] = Object.assign({}, target); // trigger change handlers
        });
      } else if (event.type === 'remove') {
        event.items.forEach(c => {
          const parent = c._parent;
          if (parent) {
            const parentList = _space_[parent.type][parent.id][c._type];
            const index = parentList.findIndex((v) => {return v.id === c._id;});
            if (index !== -1) {
              parentList.splice(index, 1);
            }
          }
          delete _space_[c._type][c._id];
        });
      } else if (event.type === 'add') {
        const appendTo = Lingu.context;
        const id = event.item.id;
        const abs = event.item.type;
        if (appendTo) {
          if (!_space_[appendTo.type][appendTo.id][abs]) {
            _space_[appendTo.type][appendTo.id][abs] = [];
          }
          _space_[appendTo.type][appendTo.id][abs].push({id: id});
        }
        _space_[abs][id] = {_parent: appendTo, _id: id, _type: abs};
      } else if (event.type === 'init') {
        const entity = event.entity;
        _space_[entity.type][entity.id] = {
          _type: entity.type,
          _id: entity.id
        };
      }
    });
  }

  this.initiateSpaceDef = function(type) {
    if (!_space_[type]) {
      _space_[type] = _watchObject({}, type);
    } else {
      _space_[type] = _watchObject(_space_[type], type);
    }
    changeHandlers[type] = [];
  }

  this.getSpace = function() {
    return JSON.parse(JSON.stringify(_space_));
  }

  this.persistSpace = function() {
    localStorage.setItem('appStorage', JSON.stringify(_space_));
  }

  this.subscribe = function(target, callback) {
    changeHandlers[target].push(callback);
  }

  this.initDone = function() {
    Object.keys(changeHandlers).forEach((handler) => {
      //console.log(handler, space[handler], changeHandlers[handler]);
      if (_space_[handler] && Object.keys(_space_[handler]).length) {
        changeHandlers[handler].forEach(handler => handler());
      }
    });
  }
}
