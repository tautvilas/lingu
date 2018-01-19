var assert = require('assert'),

webdriver = require('selenium-webdriver');

const el = {
  newTodo: webdriver.By.className('new-todo'),
  items: webdriver.By.className('todo-list'),
};

describe('TodoMVC', function() {
  this.timeout(10000);
  let driver;

  before(async () => {
    driver = new webdriver.Builder().
    forBrowser('chrome').build();
    driver.navigate().to('http://localhost:8000/todomvc');
    let todoInput = driver.findElement(el.newTodo);
    const value = await todoInput.getAttribute('value'); // needed for sync
  });

  it('should add a todo', async () => {
    let todoInput = driver.findElement(el.newTodo);
    todoInput.sendKeys('to do some stuff');
    const value = await todoInput.getAttribute('value');
    assert.equal(value, 'to do some stuff');
    todoInput.sendKeys('\n');
    let items = driver.findElement(el.items);
    const todosText = await items.getText();
    assert.equal(todosText, 'This is your first task\nto do some stuff');
  });

  after(() => {
    driver.quit();
  });
});
