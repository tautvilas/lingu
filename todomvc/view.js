function TodoApp(props) { //eslint-disable-line no-unused-vars
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

