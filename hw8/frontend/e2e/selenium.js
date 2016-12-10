const webdriver = require('selenium-webdriver')

const url = 'http://127.0.0.1:8080/'

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

exports.driver = driver
exports.By = webdriver.By
exports.findId = id => driver.findElement(webdriver.By.id(id))
exports.findCSS = css => driver.findElement(webdriver.By.css(css))
exports.findClass = cName => driver.findElements(webdriver.By.className(cName))
exports.go = _ => driver.navigate().to(url)
exports.sleep = millis => driver.sleep(millis)
