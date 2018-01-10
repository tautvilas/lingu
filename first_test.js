var assert = require('assert'),

webdriver = require('selenium-webdriver');

describe('TodoMVC', function() {
  this.timeout(10000);
  let driver;

  before(async () => {
    driver = new webdriver.Builder().
    forBrowser('chrome').build();
    driver.navigate().to('http://localhost:8000/todomvc');
    let searchBox = driver.findElement(webdriver.By.className('new-todo'));
    const value = await searchBox.getAttribute('value');
  });

  it('should add a todo', async () => {
    let searchBox = driver.findElement(webdriver.By.className('new-todo'));
    searchBox.sendKeys('to do some stuff');
    const value = await searchBox.getAttribute('value');
    assert.equal(value, 'to do some stuff');
    searchBox.sendKeys('\n');
  });

  after(() => {
    driver.quit();
  });
});
