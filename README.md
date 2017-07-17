# Lingu

Lingu is extesible programming language that is operating with domain absractions and not their implementation details.

This technology is wip and exploring ideas similar to [concept programming](https://en.wikipedia.org/wiki/Concept_programming)
and [intentional programming](https://en.wikipedia.org/wiki/Intentional_programming).

# Example usage

Check out TodoMVC app implemetation with Lingu [here](https://github.com/tautvilas/lingu/tree/master/todomvc).

# Language components

## Plugins

### context
### add
### set
### remove
### update
### clear
### focus
### show
### hide
### if
### else
### with
### changeValue
### log

## Handlers

### firstRun

triggered on first run of the app

### change [*query*]

triggered when change in data is detected

current implementation is limited: only top-level change detection supported

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

# Extending the language
