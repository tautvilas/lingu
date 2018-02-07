function LinguLocalStore() {
  this.processEvents = function(events, space) {
    events.forEach(event => {
      const object = Lingu.query.one('app ' + event.query);
      object[event.property] = event.value;
    });
  }

  this.getSpace = function() {
    return Lingu.space;
  }
}
