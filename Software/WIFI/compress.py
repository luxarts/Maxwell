import gzip
import shutil
import os

fileList = os.listdir('ESPWebSockets-WEBUI/')

for f in fileList:
	print ("Comprimiendo "+f)
	with open('ESPWebSockets-WEBUI/'+f, 'rb') as f_in:
		with gzip.open('ESPWebSockets/data/'+f+".gz", 'wb', 9) as f_out:
			shutil.copyfileobj(f_in, f_out)