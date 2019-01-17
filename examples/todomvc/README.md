# TodoMVC implementation with [Lingu](https://github.com/tautvilas/lingu)

The idea of Lingu programming language is to separate pure domain logic from implementation details and make program code as clear and simple as possible. If there is something that programmer lacks in default language syntax set he can easily extend the language with his own syntactic constructs.

Check out [live demo](https://tautvilas.github.io/lingu/todomvc/) of the app.

## Domain logic code

```
!!! Data structure definitions in format [#object property property ...] !!!
#app item statusFilter statusType
#item title status
#statusType title value

context app

!!! Event handlers !!!

on firstRun
  add item
    with title todo.first.item
    with status doing
  add statusType with title status.all with value all
  add statusType with title status.active with value doing
  add statusType with title status.completed with value completed
  update app set statusFilter all

on enter titleInput
  if not empty titleInput
    add item with title from titleInput with status doing
    then focus titleInput and clear titleInput

on click itemDeletionButton
  remove selected

on click itemCompletionButton
  if is selectedStatus completed
    update selected set status doing
  else
    update selected set status completed

on doubleClick itemText
  show editField for selected
  hide view for selected
  and focus editField for selected

on escape editField
  hide editField for selected
  show view for selected
  setInputValue editField for selected valueOf selectedTitle

on enter editField , blur editField ,
  hide editField for selected
  show view for selected
  if empty editField for selected remove selected
  else update selected set title from editField for selected

on click toggleAllStatus
  if has doingItems
    update allItems set status completed
  else
    update allItems set status doing

on click clearButton
  remove completedItems

on click filterButton
  update app set statusFilter from target

on change item
  if has item
    show bodySection
  else hide bodySection .
  if has completedItems
    show clearButton
  else hide clearButton

!!! Data query aliases !!!

*selectedStatus selected status
*selectedTitle selected title
*completedItems app item where status completed
*doingItems app item where status doing
*allItems app item

!!! Text translations !!!

~todo.first.item This is your first task
~status.all All
~status.active Active
~status.completed Completed
```

## Presentation code

```javascript
function TodoApp(props) {
  const currentFilter = Lingu.query.one('app statusFilter');
  const uncompletedItemsLength = Lingu.query.many('app item where status doing').length;
  const uncompletedText = uncompletedItemsLength < 2 ? 'item left' : 'items left';
  const query = currentFilter === 'all' ? 'app item' : `app item where status ${currentFilter}`;

  const items = Lingu.react.render(query, Item);
  const statuses = Lingu.react.render('app statusType', StatusType);
  const allChecked = uncompletedItemsLength === 0;

  return (
    <section className="todoapp" {...props.attributes}>
      <header className="header">
        <h1>todos</h1>
        <input className="new-todo titleInput" placeholder="What needs to be done?" autoFocus />
      </header>
      <section className="bodySection">
        <section className="main">
          <input className="toggle-all" type="checkbox" checked={allChecked} />
          <label className="toggleAllStatus">Mark all as complete</label>
          <ul className="todo-list">
            {items}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count"><strong>{uncompletedItemsLength}</strong> {uncompletedText}</span>
          <ul className="filters">
            {statuses}
          </ul>
          <button className="clear-completed clearButton">Clear completed</button>
        </footer>
      </section>
    </section>
  );
}

function StatusType(props) {
  const title = Lingu.query.one('title', props.item);
  const value = Lingu.query.one('value', props.item);
  const currentFilter = Lingu.query.one('app statusFilter');
  const className = currentFilter === value ? 'selected filterButton' : 'filterButton';

  return (
    <li {...props.attributes}>
      <a href="#" className={className} data-value={value}>{title}</a>
    </li>
  );
}

function Item(props) {
  const className = Lingu.query.one('status', props.item);
  const title = Lingu.query.one('title', props.item);
  const itemChecked = className === 'completed' ? true : false;

  return (
    <li className={className} {...props.attributes}>
      <div className="itemContainer">
        <div className="view">
          <input className="toggle itemCompletionButton" type="checkbox" checked={itemChecked} />
          <label className="itemText">{title}</label>
          <button className="destroy itemDeletionButton"></button>
        </div>
        <input className="edit editField" defaultValue={title}/>
      </div>
    </li>
  );
}
````
