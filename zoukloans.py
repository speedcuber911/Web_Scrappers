from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Firefox()
driver.get('https://www.zoukloans.com')
assert "ZoukLoans" in driver.title
driver.find_element_by_class_name('navRight').click()
assert "Login" in driver.title
