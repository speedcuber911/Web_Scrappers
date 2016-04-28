from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Firefox()
driver.get("https://www.facebook.com)
startUpClick = driver.find_element_by_link_text("Startups")
startUpClick.click()
companyName  = driver.find_element_by_class_name("name")
print(companyName)
