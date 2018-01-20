const assert = require('assert');
const webdriver = require('selenium-webdriver');

const el = {
  newTodo: webdriver.By.className('new-todo'),
  items: webdriver.By.className('todo-list'),
  todos: webdriver.By.className('itemContainer'),
  completedTodos: webdriver.By.className('completed'),
  footer: webdriver.By.className('footer'),
  count: webdriver.By.className('todo-count'),
  filters: webdriver.By.className('filterButton'),
  clear: webdriver.By.className('clearButton'),
  toggle: webdriver.By.className('toggleAllStatus'),
  header: webdriver.By.tagName('h1'),
  todoItem: {
    remove: webdriver.By.className('itemDeletionButton'),
    checkBox: webdriver.By.className('itemCompletionButton'),
    editField: webdriver.By.className('editField'),
    text: webdriver.By.className('itemText')
  }
};

describe('TodoMVC', function() {
  this.timeout(10000);
  let driver, $, $$;

  function addTodo(text) {
    return $(el.newTodo).sendKeys(text + '\n');
  }

  before(async () => {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.navigate().to('http://localhost:8000/todomvc');
    $ = driver.findElement.bind(driver);
    $$ = driver.findElements.bind(driver);
    let todoInput = $(el.newTodo);
    await todoInput.getAttribute('value'); // needed for sync
  });

  it('should add a todo', async () => {
    let todoInput = $(el.newTodo);
    todoInput.sendKeys('to do some stuff');
    const value = await todoInput.getAttribute('value');
    assert.equal(value, 'to do some stuff');
    todoInput.sendKeys('\n');
    let items = $(el.items);
    const todosText = await items.getText();
    assert.equal(todosText, 'This is your first task\nto do some stuff');
  });

  it('should remove all todos and not show footer after that', async () => {
    assert.equal(await $(el.footer).isDisplayed(), true);
    const todos = await $$(el.todos);
    assert.equal(todos.length, 2);
    const removeButton = await todos[1].findElement(el.todoItem.remove);
    assert.equal(await removeButton.isDisplayed(), false);
    await driver.actions().mouseMove(todos[1]).mouseMove(removeButton).click().perform();
    const todosText = await $(el.items).getText();
    assert.equal(todosText, 'This is your first task');
    await driver.actions().mouseMove(todos[0]).mouseMove(todos[0].findElement(el.todoItem.remove)).click().perform();
    assert.equal((await $$(el.todos)).length, 0);
    assert.equal(await $(el.footer).isDisplayed(), false);
  });

  it('should add three more todos and persist them after page refresh', async () => {
    await addTodo('First TODO');
    await addTodo('Second TODO');
    await addTodo('Third TODO');
    await addTodo('Fourth TODO');
    await addTodo('     ');
    await addTodo('Fifth TODO');
    assert.equal((await $$(el.todos)).length, 5);
    driver.navigate().refresh();
    assert.equal((await $$(el.todos)).length, 5);
    assert.equal(await $(el.items).getText(), 'First TODO\nSecond TODO\nThird TODO\nFourth TODO\nFifth TODO');
  });

  it('should mark completed items by pressing on checkbox and reflect items number', async() => {
    const todos = await $$(el.todos);
    assert.equal(await $(el.count).getText(), '5 items left');
    assert.equal((await $$(el.completedTodos)).length, 0);
    await(todos[1].findElement(el.todoItem.checkBox).click());
    await(todos[3].findElement(el.todoItem.checkBox).click());
    assert.equal((await $$(el.completedTodos)).length, 2);
    await(todos[3].findElement(el.todoItem.checkBox).click());
    assert.equal((await $$(el.completedTodos)).length, 1);
    await(todos[3].findElement(el.todoItem.checkBox).click());
    assert.equal(await $(el.count).getText(), '3 items left');
  });

  it('should perform filtering', async() => {
    assert.equal((await $$(el.todos)).length, 5);
    await (await $$(el.filters))[1].click();
    assert.equal((await $$(el.todos)).length, 3);
    await (await $$(el.filters))[2].click();
    assert.equal((await $$(el.todos)).length, 2);
    await (await $$(el.filters))[0].click();
    assert.equal((await $$(el.todos)).length, 5);
  });

  it('should clear completed', async() => {
    await (await $$(el.filters))[2].click();
    assert.equal((await $$(el.todos)).length, 2);
    await $(el.clear).click();
    assert.equal((await $$(el.todos)).length, 0);
    assert.equal(await $(el.footer).isDisplayed(), true);
    await (await $$(el.filters))[0].click();
    assert.equal((await $$(el.todos)).length, 3);
    assert.equal(await $(el.items).getText(), 'First TODO\nThird TODO\nFifth TODO');
  });

  it('should toggle all status', async() => {
    const todos = await $$(el.todos);
    await(todos[1].findElement(el.todoItem.checkBox).click());
    assert.equal((await $$(el.completedTodos)).length, 1);
    await($(el.toggle)).click();
    assert.equal((await $$(el.completedTodos)).length, 3);
    await($(el.toggle)).click();
    assert.equal((await $$(el.completedTodos)).length, 0);
    await($(el.toggle)).click();
    assert.equal((await $$(el.completedTodos)).length, 3);
  });

  it('should edit item and save on enter', async() => {
    const todos = await $$(el.todos);
    assert.equal(todos.length, 3);
    assert.equal(await todos[0].getText(), 'First TODO');
    const editField = todos[0].findElement(el.todoItem.editField);
    assert.equal(await editField.isDisplayed(), false);
    await driver.actions().mouseMove(todos[0].findElement(el.todoItem.text)).doubleClick().perform();
    assert.equal(await editField.isDisplayed(), true);
    await driver.actions().sendKeys('changed item\n').perform();
    assert.equal(await editField.isDisplayed(), false);
    assert.equal(await todos[0].getText(), 'changed itemFirst TODO');
    assert.equal((await $$(el.todos)).length, 3);
  });

  it('should edit item and save on focus out', async() => {
    const todos = await $$(el.todos);
    assert.equal(todos.length, 3);
    assert.equal(await todos[1].getText(), 'Third TODO');
    const editField = todos[1].findElement(el.todoItem.editField);
    assert.equal(await editField.isDisplayed(), false);
    await driver.actions().mouseMove(todos[1].findElement(el.todoItem.text)).doubleClick().perform();
    assert.equal(await editField.isDisplayed(), true);
    await driver.actions().sendKeys('changed ').perform();
    await todos[0].click();
    assert.equal(await editField.isDisplayed(), false);
    assert.equal(await todos[1].getText(), 'changed Third TODO');
    assert.equal((await $$(el.todos)).length, 3);
  });

  it('should delete item if trimmed value is only from spaces', async() => {
    const todos = await $$(el.todos);
    assert.equal(todos.length, 3);
    assert.equal(await todos[2].getText(), 'Fifth TODO');
    const editField = todos[2].findElement(el.todoItem.editField);
    assert.equal(await editField.isDisplayed(), false);
    await driver.actions().mouseMove(todos[2].findElement(el.todoItem.text)).doubleClick().perform();
    assert.equal(await editField.isDisplayed(), true);
    await editField.clear();
    await editField.sendKeys('   ');
    await $(el.header).click();
    assert.equal((await $$(el.todos)).length, 2);
    assert.equal(await $(el.items).getText(), 'changed itemFirst TODO\nchanged Third TODO');
  });

  it('should not change edited item if escape is pressed', async() => {
    const todos = await $$(el.todos);
    assert.equal(todos.length, 2);
    assert.equal(await todos[1].getText(), 'changed Third TODO');
    const editField = todos[1].findElement(el.todoItem.editField);
    assert.equal(await editField.isDisplayed(), false);
    await driver.actions().mouseMove(todos[1].findElement(el.todoItem.text)).doubleClick().perform();
    assert.equal(await editField.isDisplayed(), true);
    await editField.clear();
    await editField.sendKeys('fancy new item');
    await editField.sendKeys(webdriver.Key.ESCAPE);
    assert.equal(await editField.isDisplayed(), false);
    assert.equal((await $$(el.todos)).length, 2);
    assert.equal(await $(el.items).getText(), 'changed itemFirst TODO\nchanged Third TODO');
  });

  it('should add and items and perist all changes after refresh', async() => {
    addTodo('super new todo');
    driver.navigate().refresh();
    assert.equal((await $$(el.todos)).length, 3);
    assert.equal(await $(el.items).getText(), 'changed itemFirst TODO\nchanged Third TODO\nsuper new todo');
    assert.equal((await $$(el.completedTodos)).length, 2);
    assert.equal(await $(el.footer).isDisplayed(), true);
  });

  after(() => {
    driver.quit();
  });
});
