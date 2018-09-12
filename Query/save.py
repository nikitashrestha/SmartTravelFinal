from .models import RestDetail
import csv
def save(filename):
	count=0
	data = []
	#f = open(filename,"r", errors='ignore')
	dataReader = csv.reader(open(filename), delimiter=',')
	for d in dataReader:
		new=RestDetail(Name=d[0], Desc = d[1] ,P_Name=d[2],District=d[3], Zone=d[4], Contact_No=d[5],Opening_Time=d[6], Popular_for=d[7], C_Name=d[8], latitude=d[9], longitude=d[10],Img_Path = "/media/restaurant/"+d[11], charge=d[12])
		new.save()
	'''
	for row in f:
		r = row.split(',')
		e = [str(r[3]), str(r[4]),str(r[5]), str(r[6]), str(r[7]), str(r[8]), str(r[9]), str(r[10]), str(r[11]), str(r[12]), str(r[13]),str(r[14]), str(r[15])]
		data.append(e)
		count=count+1
		print(count)
	return sorted(data)'''

def run(data):
	print("I am running...")
	for d in data:
		new=RestDetail(Name=d.__getitem__(0), Desc = d.__getitem__(1) ,P_Name=d.__getitem__(2),District=d.__getitem__(3), Zone=d.__getitem__(4), Contact_No=d.__getitem__(5),Opening_Time=d.__getitem__(6), Popular_for=d.__getitem__(7), C_Name=d.__getitem__(8), latitude=d.__getitem__(9), longitude=d.__getitem__(10),Img_Path = "/media/restaurant/"+d.__getitem__(11),charge=d.__getitem__(12))
		new.save()

	print("I am ended...")