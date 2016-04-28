from selenium import webdriver
from selenium.webdriver.firefox.webdriver import FirefoxProfile
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, WebDriverException
from selenium.webdriver.common.keys import Keys
import time
import os
import sys
import json
from flask import Flask

app = Flask(__name__)

#for m in range(1,62):
#print m
	#a = driver.find_element_by_id('btn_' + m)
	##print a.text
	#a.click()
	#time.sleep(6)

@app.route('/apis/get/ccicu')
def ccicu():
	driver = webdriver.Firefox()
	alp = ['A']
	info = {}
	final = []
	l = 1
	for m in alp:
		driver.get('http://www.cicuindia.org/show_member_directory.php?s=0&ii=1&q='+m)
		pageno = driver.find_elements_by_id('aa')
		for n in range(0, len(pageno)*20+1, 20):
			driver.get('http://www.cicuindia.org/show_member_directory.php?s='+str(n)+'&ii=1&q='+m)
			data = driver.find_elements_by_class_name('dir')
			for i in data:
				j = i.find_elements_by_class_name('shortdes')
				#for i in block:
					#j = i.find_elements_by_class_name('style6')
				if(j):
					info['company_name'] = i.find_element_by_class_name('heading1').text
					info['sno'] = l
					info['manufacture'] = j[0].text
					info['name_designation_no.'] = j[1].text
					info['contact'] = j[2].text
					# print info
					#doc.append(info)
					l+=1
					return json.dumps(info)
				else:
					print 'empty'
	return final
	driver.quit()


if __name__ == '__main__':
	app.run(debug=True)
