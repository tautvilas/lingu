Lingu.handlers.firstRun = (words) => {
  Lingu.methods.onInit(() => {
    Lingu.methods.parseActionLine(words);
  });
};

Lingu.handlers.change = (words) => {
  const target = words[0];
  Lingu.store.subscribe(target, () => {
    Lingu.methods.parseActionLine(words.slice(1));
  });
};

Lingu.handlers.everyEvent = (words) => {
  Lingu.beforeEachHandlers.push(() => {
    Lingu.methods.parseActionLine(words);
  });
};

Lingu.handlers.click = (words) => {
  Lingu.domEventHandlers.push({
    selector: words[0],
    handler: (event) => {
      const parseState = {
        event: event
      };
      Lingu.methods.parseActionLine(words.slice(1), parseState);
    },
    event: 'click'
  });
};

Lingu.handlers.blur = (words) => {
  Lingu.domEventHandlers.push({
    selector: words[0],
    handler: (event) => {
      const parseState = {
        event: event
      };
      Lingu.methods.parseActionLine(words.slice(1), parseState);
    },
    event: 'blur'
  });
};

Lingu.handlers.missClick = (words) => {
  document.addEventListener('click', (ev) => {
    const elements = Lingu.methods.getElementsByClassName(words[0]);
    elements.forEach(el => {
      const targeted = el === ev.target || el.contains(ev.target);
      if(!targeted) {
        const parseState = {
          event: {
            target: el
          }
        };
        Lingu.methods.parseActionLine(words.slice(1), parseState);
      }
    });
  });
};

Lingu.handlers.doubleClick = (words) => {
  const clickTimeout = 1000;
  let lastClickEvent = +new Date();
  Lingu.domEventHandlers.push({
    selector: words[0],
    handler: (event) => {
      const now = +new Date();
      if (now - lastClickEvent < clickTimeout) {
        const parseState = {
          event: event
        };
        Lingu.methods.parseActionLine(words.slice(1), parseState);
      }
      lastClickEvent = now;
    },
    event: 'click'
  });
};

Lingu.handlers.keyUp = (words) => {
  Lingu.domEventHandlers.push({
    selector: words[0],
    handler: (event) => {
      const parseState = {
        event: event
      };
      Lingu.methods.parseActionLine(words.slice(1), parseState);
    },
    event: 'keyup'
  });
};

Lingu.handlers.escape = (words) => {
  Lingu.domEventHandlers.push({
    selector: words[0],
    handler: (event) => {
      if (event.keyCode === 27) {
        Lingu.methods.parseActionLine(words.slice(1), {event: event});
      }
    },
    event: 'keyup'
  });
};

Lingu.handlers.enter = (words) => {
  Lingu.domEventHandlers.push({
    selector: words[0],
    handler: (event) => {
      if (event.keyCode === 13) {
        Lingu.methods.parseActionLine(words.slice(1), {event: event});
      }
    },
    event: 'keypress'
  });
};

