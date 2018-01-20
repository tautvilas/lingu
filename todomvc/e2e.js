var assert = require('assert'),

webdriver = require('selenium-webdriver');

const el = {
  newTodo: webdriver.By.className('new-todo'),
  items: webdriver.By.className('todo-list'),
  todos: webdriver.By.className('itemContainer'),
  footer: webdriver.By.className('footer'),
  todoItem: {
    remove: webdriver.By.className('itemDeletionButton')
  }
};

describe('TodoMVC', function() {
  this.timeout(10000);
  let driver, $, $$;

  function addTodo(text) {
    return $(el.newTodo).sendKeys(text + '\n');
  }

  before(async () => {
    driver = new webdriver.Builder().
    forBrowser('chrome').build();
    driver.navigate().to('http://localhost:8000/todomvc');
    $ = driver.findElement.bind(driver);
    $$ = driver.findElements.bind(driver);
    let todoInput = $(el.newTodo);
    const value = await todoInput.getAttribute('value'); // needed for sync
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
    let todos = await $$(el.todos);
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
    await addTodo('Fifth TODO');
    assert.equal((await $$(el.todos)).length, 5);
    driver.navigate().refresh();
    assert.equal((await $$(el.todos)).length, 5);
    assert.equal(await $(el.items).getText(), 'First TODO\nSecond TODO\nThird TODO\nFourth TODO\nFifth TODO');
  });

  after(() => {
    driver.quit();
  });
});
