from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Firefox()
driver.get("http://www.mca.gov.in")
serviceLink = driver.find_element_by_link_text("MCA SERVICES")
serviceLink.click()
link1 = driver.find_element_by_link_text("View Company or LLP Master Data")
link1.click()
link2 = driver.find_element_by_link_text("View Company Master Data")
link2.click()
driver.switch_to_window(driver.window_handles[1])
link3 = driver.find_element_by_id("companyName")
link3.send_keys("Reliance")
link4 = driver.find_element_by_id("cinLookup")
link4.click()
driver.switch_to_window(driver.window_handles[2])
companyName = driver.find_element_by_id("strCompanyName0")
cinNumber = driver.find_element_by_id("strCin0")

# try:
#     companyName = WebDriverWait(driver,5).until(
#         EC.presence_of_element_located(By.ID,"strCompanyName0"))
#     cinNumber = driver.find_element_by_id("strCin0")
# finally:
#     print("Quit")
#     driver.quit()

print(companyName.get_attribute("value"))
print(cinNumber.get_attribute("value"))
