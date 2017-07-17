# Lingu

Lingu is extesible programming language that is operating with domain absractions and not their implementation details.

This technology is wip and exploring ideas similar to [concept programming](https://en.wikipedia.org/wiki/Concept_programming)
and [intentional programming](https://en.wikipedia.org/wiki/Intentional_programming).

# Example usage

Check out TodoMVC app implemetation with Lingu [here](https://github.com/tautvilas/lingu/tree/master/todomvc).

# Language components

## plugins

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

## handlers

### firstRun
### change
### click
### blur
### missClick
### doubleClick
### keyUp
### escape
### enter

## evaluators

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
