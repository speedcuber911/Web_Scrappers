import sys

if len(sys.argv)<1:
	print 'Usage: python convert.py file.json'

with open(sys.argv[1]) as file1:
	data = file1.readlines()
with open('new_'+sys.argv[1], 'w') as file2:
	file2.write('[')
	for i in data:
		file2.write(i.replace('} {', '}, {'))
	file2.write(']')