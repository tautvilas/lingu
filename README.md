# Lingu

Lingu is extesible programming language that is operating with domain absractions and not their implementation details.

This technology is WIP and exploring ideas similar to [concept programming](https://en.wikipedia.org/wiki/Concept_programming)
and [intentional programming](https://en.wikipedia.org/wiki/Intentional_programming).

# Example usage

Check out TodoMVC app implemetation with Lingu [here](https://github.com/tautvilas/lingu/tree/master/todomvc).

# Lingu in nutshell

Lingu sentences are divided into these categories:

1. Data structure definitions
2. Action sentences
3. Query definitions
4. Translations

Each action sentence is constructed out of words. Each word is either plugin, handler, evaluator, value, query, selector or datatype.

## Authors

* [Tautvilas Mecinskas](https://github.com/tautvilas/) [@tautvilas](https://twitter.com/TautviIas)

# Language components

## Plugins

```(words, parseState, appState) => ({mutateState: (s) => s, parseState, cursor})```

### context [*query*]
### on [*handler* ,*handler* ,]
### add [*datatype*]
### with [*datatype* *value*]
### remove [*query*]
### update [*query*]
### set [*datatype* *value*]
### clear [*selector*]
### focus [*selector*]
### show [*selector*]
### hide [*selector*]
### if [*value*] . 
### else .
### setInputValue [*selector* *value*]
### log [*value*]

## Handlers

```
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
```

### firstRun

triggered on first run of the app

### change [*datatype*]

triggered when change in data is detected

### click [*selector*]

triggered on element click

### blur [*selector*]

triggered on input element blur

### missClick [*selector*]

triggerred when click happens outside element

### doubleClick [*selector*]

triggered on element double click

### keyUp [*selector*]

triggered on keyUp in input

### escape [*selector*]

triggered on escape key in input

### enter [*selector*]

triggered on enter key in input

## Evaluators

```(words, parseState, appState) => ({value: [], parseState, cursor})```

### from [*selector*]

returns value from selected elements

### empty [*selector*]

evaluates to true if selected elements have empty value, otherwise evaluates to false

### is [*query* *value*]

evaluates to true if *query* returns items that equal *value*, otherwise evaluates to false

### has [*query*]

evaluates to true if *query* returns any items, otherwise evaluates to false

### not [*value*]

evalutes to true if *value* is false, otherwise evaluates to false

### valueOf [*query*]

converts *query* result to value

# Extending the language
