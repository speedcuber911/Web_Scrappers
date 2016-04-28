from selenium import webdriver
import json
import csv

driver = webdriver.Firefox();
info = {"comapnyname" : "" , "Manufacturers" : ""}
target = open("learn.csv" , "w");
target.write("companyname ," "Manufacturers\n" );
url = "http://www.cicuindia.org/show_member_directory.php?s=0&ii=1&q=";
driver.get(url);
data = driver.find_elements_by_class_name("dir");
for i in data:
	info['companyname'] = i.find_element_by_class_name("heading1").text;
	info['companyname']= info['companyname'].replace("," , " ");
	info['Manufacturers'] = i.find_element_by_class_name("shortdes").text;
	info['Manufacturers']= info['Manufacturers'].replace("," , " ");
	print info['companyname'];
	target.write(info['companyname'] + ",");
	target.write(info['Manufacturers'] + "\n");




driver.close();	




