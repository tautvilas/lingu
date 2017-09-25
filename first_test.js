var assert = require('assert'),
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver');
 
test.describe('TodoMVC', function() {
  test.it('should work', function() {
    var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();
    driver.get('http://localhost:8000/todomvc');
    var searchBox = driver.findElement(webdriver.By.className('new-todo'));
    searchBox.sendKeys('to do some stuff');
    searchBox.getAttribute('value').then(function(value) {
      assert.equal(value, 'to do some stuff');
    });
    driver.quit();
  });
});
