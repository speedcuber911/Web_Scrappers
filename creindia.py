from selenium import webdriver
from selenium.webdriver.common.keys import Keys


driver = webdriver.Firefox()
driver.get('http://www.mca.gov.in/DCAPortalWeb/dca/MyMCALogin.do?method=setDefaultProperty&mode=31')
e = driver.find_element_by_id("companyName")
e.send_keys("zouk")
b = driver.find_element_by_id("cinLookup")
b.click()
alert = driver.switch_to_alert()
companyName = alert.find_element_by_id("strCompanyName0")
cinNumber = alert.find_element_by_id("strCin0")
print(companyName)
print(cinNumber)
d = driver.get_cookies()
print(d)
