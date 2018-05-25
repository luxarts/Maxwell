import gzip
import shutil
import os

fileList = os.listdir('ESPWebSockets/data')

for f in fileList:
	print ("Comprimiendo "+f)
	with open('ESPWebSockets/data/'+f, 'rb') as f_in:
		with gzip.open('ESPWebSockets/data/'+f+".gz", 'wb', 9) as f_out:
			shutil.copyfileobj(f_replaced, f_out)