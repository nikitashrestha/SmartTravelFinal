from django.shortcuts import render,HttpResponse,get_object_or_404, redirect, reverse
from .models import PlaceDetail, RestDetail
from django.db.models import Q
import collections
from .RegularExpReplacer import Query
import cloudinary
import cloudinary.uploader
import cloudinary.api
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .forms import UserRegistrationForm
from django.contrib.auth.forms import UserCreationForm
import os, csv


from .save import * 
def soo(request):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    filename=os.path.join(BASE_DIR, "Query/restaurants_and_cafe_with_lat_lng.csv")
    data=save(filename )
    run(data)
    return HttpResponseRedirect('/blog/')

cloudinary.config(
  cloud_name = "ddfo4jcn7",
  api_key = "276479899713558",
  api_secret = "gFy1KH-zxzud7fKzohWVbmk-eHM"
)

r1 = ['F', 'PV', 'N']
r2 = ['F', 'N']
r3 = ['PV', 'N']
r4 = ['F', 'PV', 'D']
r5 = ['PV', 'D']
r6 = ['F', 'R', 'N']
r7 = ['R', 'N']
r8 = ['R', 'D']
r9 = ['F', 'L', 'N']
r11 = ['L', 'N']
r10 = ['F', 'L', 'D']
r12 = ['L', 'D']
r13 = ['WH', 'NE']
r14 = ['F', 'H', 'PA', 'N']
r15 = ['F', 'H', 'PA', 'D']
r16 = ['H', 'PA', 'D']
r17 = ['H', 'PA', 'N']
r18 = ['PV', 'F', 'HU', 'D']
r19 = ['PV', 'F', 'HU', 'N']
r20 = ['PV', 'HU', 'N']
r21 = ['PV', 'HU', 'D']
r22 = ['WH', 'HU', 'N']
r23 = ['WH', 'HU', 'D']
r24 = ['F', 'PV', 'C', 'N']
r25 = ['WH', 'C', 'N']
r26 = ['F', 'PV', 'C', 'D']
r27 = ['WH', 'C', 'D']
r28 = ['C', 'D']
r29 = ['C', 'N']
r30 = ['F', 'PV', 'RA', 'N']
r31 = ['WH', 'RA', 'N']
r32 = ['F', 'PV', 'RA', 'D']
r33 = ['WH', 'RA', 'D']
r34 = ['RA', 'D']
r35 = ['RA', 'N']
r36 = ['F', 'PV', 'T', 'N']
r37 = ['WH', 'T', 'N']
r38 = ['F', 'PV', 'T', 'D']
r39 = ['WH', 'T', 'D']
r40 = ['T', 'D']
r41 = ['T', 'N']
r42 = ['F', 'PV', 'PG', 'N']
r43 = ['WH', 'PG', 'N']
r44 = ['F', 'PV', 'PG', 'D']
r45 = ['WH', 'PG', 'D']
r46 = ['PG', 'D']
r47 = ['PG', 'N']
r48 = ['F', 'PV', 'B', 'N']
r49 = ['WH', 'B', 'N']
r50 = ['F', 'PV', 'B', 'D']
r51 = ['WH', 'B', 'D']
r52 = ['B', 'D']
r53 = ['B', 'N']
r54 = ['F', 'H', 'PV', 'N']
r55 = ['PV', 'H', 'N']
r56 = ['F', 'H', 'HH', 'N']
r57 = ['H', 'HH', 'N']
r58 = ['F', 'H', 'PV', 'D']
r59 = ['PV', 'H', 'D']
r60 = ['F', 'H', 'HH', 'D']
r61 = ['H', 'HH', 'D']
r62 = ['NA', 'N']
r63 = ['NA', 'D']
r64 = ['PA', 'NL']
r65 = ['F', 'TE', 'N']
r66 = ['TE', 'N']
r67 = ['RE', 'N', 'PV']
r68 = ['F', 'TE', 'D']
r69 = ['TE', 'D']
r70 = ['F','M','AR','D']

#compares two list

compare = lambda x, y: collections.Counter(x) == collections.Counter(y)

#views here
story = ""

template_Name =None
template_Name1 = None
category =None

class myQuery():
    def __init__(self):
        self.category=None
        self.category1=None
        self.category2=None

q1 = myQuery()
types_of_encoding = ["utf8", "cp1252"]
def soo(request):
    path="C:/Users/Deepika/SmartTravel/Query"
    os.chdir(path)
    with open("trekking1.csv",encoding='utf-8',errors='replace') as csvfile:
        reader=csv.DictReader(csvfile)
        for row in reader:
            p=PlaceDetail(Name=row['P_Name'], Desc=row['Desc'],Opening_Time='According to Season',C_Name=row['Category'], latitude=row['Latitude'], longitude=row['Longitude'], Img_Path="/media/restaurant/"+row['img_path'], Popularity=row['Popular_for'], P_Name=row['locality'], District=row['Zone'], Zone=row['District'],Entry_fee=row['Charge_Per_Head'])
            p.save()
            print("Success")
    return HttpResponseRedirect('/blog/')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def index(request):
    template_Name='Query/index.html'
    context={}
    res1=[]
    res2=[]
    res3=[]
    user=request.user
    data=readingFile1(os.path.join(BASE_DIR, "Query/result2.csv"))
    for res in data:
        if res.__getitem__(0)==user.id and res.__getitem__(2)>3.0: # 0 for user_id , 1 for place id and 3 for rating 
            res1.append(res.__getitem__(1)) #store place id ranked higher than 3 by user
            if(PlaceDetail.objects.filter(id=res.__getitem__(1)).exists()):
                q1.category1='P'
                place_det=PlaceDetail.objects.get(id=res.__getitem__(1))
                res2.append(place_det) # esma chai places ko details basxa
            if(RestDetail.objects.filter(id=res.__getitem__(1)).exists()):
                q1.category2='R'
                rest=RestDetail.objects.get(id=res.__getitem__(1))
                res3.append(rest)  # esma chai restaurant hruko kinavane hamisnga duita diffrent db hunx 
            
     
    context['places_recommendations']=res2
    context['rest_recommendations']=res3
    return  render(request,template_Name, context)


def readingFile1(filename):
    f = open(filename,"r")
    data = []
    for row in f:
        r = row.split(',')
        e = [int(r[0]), int(r[1]), float(r[2])]
        data.append(e)
    return sorted(data)



def result(request):
        query_search = request.GET.get('place',None)

        q=Query()
        q.makefile()
        to_lower = query_search.lower()

        result = q.Process_Query(to_lower)
        list1 = ['CH','DI','RE','ST']

        bool_value = True
        print(result)
        for tag_words in result:
            if tag_words in list1:
                bool_value = False

        if(bool_value):
            category='P'
            q1.category='P'
            template_Name = 'Query/query_result.html'
            if compare(result,r1) or compare(result,r3):
                Place_Name = PlaceDetail.objects.filter(Popularity__gt='3')
            elif compare(result,['D']):
                Place_Name = PlaceDetail.objects.filter(Popularity__gt='3')
            elif compare(result,r2):
                Place_Name= PlaceDetail.objects.filter(Popularity__gt='3')
            elif compare(result,r4) or compare(result,r5):
                res1 = q.get_tag_name('D')
                Place_Name =PlaceDetail.objects.filter(District__icontains = res1)
            elif compare(result,['A','REL','PV','N']) or compare (result,['F','A','REL','PV']) or compare (result,['A','REL','PV']):
                res1 = q.get_tag_name('A')
                res2 = q.get_tag_name('REL')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2))
            elif compare(result,['A','REL','PV','D']) or compare (result,['F','A','REL','PV','D']) or compare (result,['A','REL','PV','D']):
                res1 = q.get_tag_name('A')
                res2 = q.get_tag_name('REL')
                res3 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2),District__icontains= res3)
            elif compare(result,['T','REL','PV','D']) or compare (result,['F','T','REL','PV','D']) or compare (result,['T','REL','PV','D']):
                res1 = q.get_tag_name('T')
                res2 = q.get_tag_name('REL')
                res3 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2),District__icontains=res3)
            elif compare(result,['T','REL','PV','N']) or compare (result,['F','T','REL','PV','N']) or compare (result,['T','REL','PV']):
                res1 = q.get_tag_name('T')
                res2 = q.get_tag_name('REL')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2))
            elif compare(result,r6):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='river',Popularity__gt='3')
            elif compare(result,r7):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='river')
            elif compare(result,r8):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(District__icontains=res1,C_Name__icontains = 'river')
            elif compare(result, r10) or compare(result,r12):
                res1 = q.get_tag_name('D')
                Place_Name= PlaceDetail.objects.filter(District__icontains=res1,C_Name__icontains='lake')
            elif compare(result,r9):
                Place_Name =  PlaceDetail.objects.filter( C_Name__icontains='lake',Popularity__gt='3')
            elif compare(result, r11):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='lake')
            elif compare(result,r13):
                res1 = q.get_tag_name('NE')
                Place_Name = PlaceDetail.objects.filter(Name__icontains=res1)
            elif compare(result, r14):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='National Park',Popularity__gt='2')
            elif compare(result,r15) or compare (result,r16):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='National Park',District__icontains=res1)
            elif compare(result,r17) or compare(result,['H','PA']):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='National Park')
            elif compare(result,r19) or compare(result,r20) or compare(result,r22) or compare(result,['F','PV','HU']):
                res1 = q.get_tag_name('HU')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res1)
            elif compare(result,r18) or compare(result,r21) or compare(result,r23):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='hunt',District__icontains=res1)
            elif compare(result, r24) or compare(result, r25) or compare(result,['PV','C','N']):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='mountain',Popularity__gt='1')
            elif compare(result, r26) or compare(result, r27) or compare(result,r28) or compare(result,['PV','C','D']):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='mountain',District__icontains=res1)
            elif compare (result,r29):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='mountain')
            elif compare(result, r30) or compare(result,r31):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='rafting',Popularity__gt='1')
            elif compare(result, r32) or compare(result, r33) or compare(result,r34):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='rafting',District__icontains=res1)
            elif compare(result,r35):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains = 'rafting')
            elif compare(result, r36) or compare(result, r37):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='treking',Popularity__gt='1')
            elif compare(result, r38) or compare(result, r39) or compare(result, r40):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='treking',District__icontains=res1)
            elif compare(result, r41):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='treking')
            elif compare(result, r42) or compare(result, r43):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='paragliding',Popularity__gt='1')
            elif compare(result, r44) or compare(result, r45) or compare(result, r46):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='paragliding',District__icontains=res1)
            elif compare(result, r47):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='paragliding')
            elif compare(result, r48) or compare(result, r49):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='bunje',Popularity__gt='1')
            elif compare(result, r50) or compare(result, r52) or compare(result, r51):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='bunje',District__icontains=res1)
            elif compare(result, r53):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='bunje')
            elif compare(result,r54) or compare(result,r56):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='historical',Popularity__gt='1')
            elif compare(result, r55) or compare(result, r57) or compare(result,['H','PV']):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='historical')
            elif compare(result,['H','PV','NL']) or compare(result,['H','HH','NL']):
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='historical',District__icontains='patan')
            elif compare(result, r58) or compare(result, r59) or compare(result, r60) or compare(result, r61):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains='historical',District__icontains=res1)
            elif compare(result,r62) or compare(result,['NA','PV','N']):
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains='river') | Q(C_Name__icontains='lake')|Q(C_Name__icontains='National Park') | Q(C_Name__icontains=Park)|Q(C_Name__icontains='Garden') | Q(C_Name__icontains='mountain'))
            elif compare(result, r63) or compare(result,['NA','PV','D']):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains='river') | Q(C_Name__icontains='lake')|Q(C_Name__icontains='National Park') | Q(C_Name__icontains=Park)|Q(C_Name__icontains='Garden') | Q(C_Name__icontains='mountain'),District__icontains=res1)
                   
            elif compare(result,r64):
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains = 'park')|Q(C_Name__icontains = 'garden'),P_Name__icontains='Patan') or PlaceDetail.objects.filter(C_Name__icontains = 'park',District__icontains='Lalitpur') 
            elif compare(result,r65):
                x= q.get_tag_name('TE')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains = x,Popularity__gt='1')
            elif compare(result,r66) or compare(result,r67):
                x= q.get_tag_name('TE')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=x)
            elif compare(result, r68) or compare(result, r69):
                res1 = q.get_tag_name('D')
                x= q.get_tag_name('TE')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=x,District__icontains=res1)
            elif compare(result,['REL','PV','NL']):
                 res1 = q.get_tag_name('REL')
                 Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains= 'temple') | Q(C_Name__icontains ='gumba'),P_Name__icontains='patan')
            elif compare(result,['REL','PV','N']) or compare(result,['REL','PV']):
                 res1 = q.get_tag_name('REL')
                 Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains= 'temple') | Q(C_Name__icontains ='gumba')) 
            elif compare(result,['REL','PV','D']):
                 res1 = q.get_tag_name('REL')
                 x = q.get_tag_name('D')
                 Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains= 'temple') | Q(C_Name__icontains ='gumba'),District__icontains=x) 
        
            elif compare(result,['T','A','N']) or compare(result,['T','A','PV']) or compare(result,['T','A']) or compare(result,['A','PV']):
                res1 = q.get_tag_name('A')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains= 'treking'))  
            elif compare(result,['W','H','PA','N']) or compare(result,['W','H','PA']):
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains='wildlife') | Q(C_Name__icontains= 'National Park')) 
            elif compare(result,['W','H','PA','D']):
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains='wildlife') | Q(C_Name__icontains= 'National Park'),District__icontains=res1)
            elif compare(result,['F','M', 'D']) or compare(result,['M', 'D']):
                res1 = q.get_tag_name('D')
                x= q.get_tag_name('M')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=x,District__icontains=res1)
            elif compare(result,r70) or compare(result,['M','AR','D']):
                res1 = q.get_tag_name('D')
                x= q.get_tag_name('M')
                y = q.get_tag_name('AR')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=x) | Q(C_Name__icontains= y),District__icontains=res1) 
            elif compare(result,['F','M','N']) or compare(result,['M','N']) or compare(result,['M','NL']):
                x= q.get_tag_name('M')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=x)
            elif compare(result,['F','M','AR' 'NL']) or compare(result,['M','AR' 'NL']):
                x= q.get_tag_name('M')
                y = q.get_tag_name('AR')
                Place_Name = PlaceDetail.objects.filter(Q(District__icontains='patan')| Q(District__icontains='kathmandu'),C_Name__icontains='x' )
            elif compare(result,['M','H','PV']) or compare(result,['M','H','PV','N']) or compare(result,['F','M','H','PV']):
                res1 = q.get_tag_name('M')
                res2 = q.get_tag_name('H')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2))

            elif compare(result,['M','H','PV','D']) or compare(result,['F','M','H','PV','D']):
                res1 = q.get_tag_name('M')
                res2 = q.get_tag_name('H')
                res3 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2),District__icontains=res3)

            elif compare(result,['F','AR','N']) or compare(result,['AR','N']) or compare(result,['AR','NL']):
                x= q.get_tag_name('AR')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=x)
            elif compare(result,['F','REL','H','PV','N']) or compare(result,['REL','H','PV','N']) or compare(result,['REL','H','PV']):
                res2 = q.get_tag_name('REL')
                res1 = q.get_tag_name('H')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res2)| Q(C_Name__icontains=res1) | Q(C_Name__icontains='temple'))
            
            elif compare(result,['F','REL','H','PV','D']) or compare(result,['REL','H','PV','D']):
                res1 = q.get_tag_name('REL')
                res2 = q.get_tag_name('H')
                res3 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)| Q(C_Name__icontains = res2 )| Q(C_Name__icontains='temple'),District__icontains=res3) 
           
            elif compare(result,['H','HH','AR','N']) or compare(result,['H','HH','AR']):
                res1 =q.get_tag_name('H')
                res2 =q.get_tag_name('HH') 
                res3 =q.get_tag_name('AR')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains= res1) | Q(C_Name__icontains = res2) | Q(C_Name__icontains =  res3))

            elif compare(result,['H','HH','AR','D']) or compare(result,['H','HH','AR','D']):
                res1 = q.get_tag_name('H')
                res2 = q.get_tag_name('AR')
                res3 = q.get_tag_name('HH')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) |Q(C_Name__icontains =res2) |Q(C_Name__icontains = res3) ,District__icontains=q.get_tag_name('D')) 

            elif compare(result,['H','PV','AR','N']) or compare(result,['H','PV','AR']):
                res1 = q.get_tag_name('H')
                res2 = q.get_tag_name('AR')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains =res2)) 

            elif compare(result,['H','PV','AR','D']):
                res1 = q.get_tag_name('H')
                res2 = q.get_tag_name('AR')
                res3 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2)  ,District__icontains=res3) 
            elif compare(result,['F','TE','TE','N']) or compare(result,['TE','TE','N']) or compare(result,['F','TE','TE']):
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains='temple') | Q(C_Name__icontains='gumba') |Q(C_Name__icontains='monastery'))

            elif compare(result,['F','TE','TE','D']) or compare(result,['TE','TE','D']):
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains='temple') | Q(C_Name__icontains='gumba') |Q(C_Name__icontains='monastery'),District__icontains=q.get_tag_name('D')) 

            elif compare(result,['TE','REL','PV','N']) or compare(result,['F','TE','REL','PV','N']) or compare(result,['TE','REL','PV']):
                res1 = q.get_tag_name('TE')
                res2 = q.get_tag_name('REL')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2)) 
            
            elif compare(result,['AR','M','N']) or compare(result,['F','AR','M','N']) or compare(result,['AR','M']):
                res1 = q.get_tag_name('AR')
                res2 = q.get_tag_name('M')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2))
            elif compare(result,['AR','M','D']) or compare(result,['F','AR','M','D']) :
                res1 = q.get_tag_name('AR')
                res2 = q.get_tag_name('M')
                res3 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2),District__icontains=res3)
            elif compare(result,['TE','M','N']) or compare(result,['F','TE','M','N']) or compare(result,['TE','M']):
                res1 = q.get_tag_name('M')
                res2 = q.get_tag_name('TE')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2))
            elif compare(result,['TE','M','D']) or compare(result,['F','TE','M','D']):
                res1 = q.get_tag_name('T')
                res2 = q.get_tag_name('M')
                res3 =q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2),District__icontains=res3)
            elif compare(result,['TE','M','NL']) or compare(result,['F','TE','M','NL']):
                res1 = q.get_tag_name('TE')
                res2 = q.get_tag_name('M')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2),District__icontains='patan')
            elif compare(result,['AR','M','NL']) or compare(result,['F','AR','M','NL']) :
                res1 = q.get_tag_name('AR')
                res2 = q.get_tag_name('M')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains=res2),District__icontains='patan')
            elif compare(result,['TE','REL','PV','D']) or compare(result,['F','TE','REL','PV','D']):
                res1 = q.get_tag_name('TE')
                res2 = q.get_tag_name('REL')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2),District__icontains=q.get_tag_name('D')) 
            elif compare(result,['TE','REL','PV','NL']) or compare(result,['F','TE','REL','PV','NL']):
                res1 = q.get_tag_name('TE')
                res2 = q.get_tag_name('REL')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2),District__icontains='patan') 
            elif compare(result,['REL','PV','H','HH']) or compare(result,['F','REL','PV','H','HH']) or compare(result,['REL','PV','H','HH','N']) or compare(result,['F','REL','PV','H','HH','N']):
                res1 = q.get_tag_name('REL')
                res2 =q.get_tag_name('H')
                res3 = q.get_tag_name('HH')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2)|Q(C_Name__icontains=res3))
            elif compare(result,['REL','PV','H','HH','D']) or compare(result,['F','REL','PV','H','HH','D']):
                res1 = q.get_tag_name('REL')
                res2 =q.get_tag_name('H')
                res3 = q.get_tag_name('HH')
                x = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2)|Q(C_Name__icontains=res3),District__icontains=x)
            
            elif compare(result,['M','H','HH']) or compare(result,['F','H','HH','M']) or compare(result,['F','M','H','HH','N']) or compare(result,['M','H','HH','N']):
                res1 = q.get_tag_name('M')
                res2 =q.get_tag_name('H')
                res3 = q.get_tag_name('HH')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2)|Q(C_Name__icontains=res3))

            elif compare(result,['M','H','HH','D']) or compare(result,['F','H','HH','M','D']) :
                res1 = q.get_tag_name('M')
                res2 =q.get_tag_name('H')
                res3 = q.get_tag_name('HH')
                x= q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2)|Q(C_Name__icontains=res3),District__icontains=x)

            elif compare(result,['M','H','HH','NL']) or compare(result,['F','H','HH','M','NL']) :
                res1 = q.get_tag_name('M')
                res2 =q.get_tag_name('H')
                res3 = q.get_tag_name('HH')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2)|Q(C_Name__icontains=res3),District__icontains='patan')    
            elif compare(result,['REL','PV','H','HH','NL']) or compare(result,['F','REL','PV','H','HH','NL']):
                res1 = q.get_tag_name('REL')
                res2 =q.get_tag_name('H')
                res3 = q.get_tag_name('HH')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2)|Q(C_Name__icontains=res3),District__icontains='patan')    
            elif compare(result,['REL','PV','M','N']) or compare(result,['REL','PV','M']) or compare(result,['F','REL','PV','M','N']) or compare(result,['F','REL','PV','M']):
                res1 = q.get_tag_name('REL')
                res2 = q.get_tag_name('M')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1)|Q(C_Name__icontains=res2))
            elif compare(result,['TE','NL']):
                res1 = q.get_tag_name('TE')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res1,District__icontains='patan') 
            elif compare(result,['A']):
                res2 = q.get_tag_name('A')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['B']):
                res2 = q.get_tag_name('B')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['HU']):
                res2 = q.get_tag_name('HU')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['T']):
                res2 = q.get_tag_name('T')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['A']):
                res2 = q.get_tag_name('A')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['TE']):
                res2 = q.get_tag_name('TE')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['AR']):
                res2 = q.get_tag_name('AR')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['M']):
                res2 = q.get_tag_name('M')
                Place_Name = PlaceDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['A','B']):
                res2 = q.get_tag_name('A')
                res3 = q.get_tag_name('B')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res2) | Q(C_Name__icontains=res3))
            elif compare(result,['A','T']):
                res2 = q.get_tag_name('A')
                res3 = q.get_tag_name('T')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res2) | Q(C_Name__icontains=res3))
            elif compare(result,['A','T','D']):
                res2 = q.get_tag_name('A')
                res3 = q.get_tag_name('T')
                res1 = q.get_tag_name('D')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res2) | Q(C_Name__icontains=res3),District__icontains=res1)
            elif compare(result,['H','PV']):
                res1 = q.get_tag_name('H')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains='historical')|Q(C_Name__icontains='durbar'))
            
            elif compare(result,['REL','H','PV','NL']):
                res1 = q.get_tag_name('REL')
                res2 = q.get_tag_name('H')
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains=res1) | Q(C_Name__icontains = res2) | Q(C_Name__icontains = 'temple') | Q(C_Name__icontains = 'gumba'),District__icontains='lalitpur' )
            elif compare(result,['PA','PA']) or compare(result,['PA','N']) or compare(result,['PA','GA','N']) or compare(result,['F','PA','N']) or compare(result,['F','PA']):
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains = 'park') | Q(C_Name__icontains= 'garden'),Popularity__gt=1)
            elif compare(result,['TR','TR']):
                Place_Name = PlaceDetail.objects.filter(Q(C_Name__icontains = q.get_tag_name('TR')))
            else:
                Place_Name = None
            Result=Place_Name

        else:
            category='R'
            q1.category='R'
            template_Name = 'Query/query_result.html'
            if compare(result,['F','RE','N']) or compare(result,['RE','N']) or compare(result,['RE','RE','N']) or compare(result,['WH','RE','N']):
                res2 = q.get_tag_name('RE')
                Rest_Detail = RestDetail.objects.filter(C_Name__icontains = res2)
            elif compare(result,['RE','RE']):
                res2 = q.get_tag_name('RE')
                Rest_Detail = RestDetail.objects.filter(C_Name__icontains = res2)

            elif compare(result, ['F', 'RE', 'D']) or compare(result, ['RE', 'D']) or compare(result, ['WH', 'RE', 'D']) or compare(result,['RE','RE','D']):
                res2 = q.get_tag_name('RE')
                res3 = q.get_tag_name('D')
                Rest_Detail = RestDetail.objects.filter(C_Name__icontains=res2,District__icontains=res3)
            elif compare(result,['F','CH','RE']):
                res2 = q.get_tag_name('RE')
                res3 = q.get_tag_name('CH')
                Rest_Detail = RestDetail.objects.filter(Q(C_Name__icontains=res2)|Q(C_Name__icontains=res3))
            
            elif compare(result,['F','CH','RE','NL']) or compare(result,['CH','RE','NL']):
                res2 = q.get_tag_name('RE')
                res3 = q.get_tag_name('CH')
                Rest_Detail = RestDetail.objects.filter(Q(C_Name__icontains=res2)|Q(C_Name__icontains=res3),Q(P_Name__icontains='patan')|Q(P_Name__icontains='jhamsikhel'))
            
            elif compare(result,['RE','NL']) or compare(result,['F','RE','NL']):
                res2 = q.get_tag_name('RE')
                Rest_Detail = RestDetail.objects.filter(Q(P_Name__icontains='patan')|Q(P_Name__icontains='Jawalakhel')|Q(P_Name__icontains='Jhamsikhel'),C_Name__icontains=res2)
            elif compare(result,['F','CH','RE','N']) or compare(result,['CH','RE','N']) or compare(result,['CH','F','PV']) or compare(result,['DI','CH','RE','N']) or compare(result,['DI','CH','RE']) or compare(result,['CH','RE']):
                res2 = q.get_tag_name('CH')
                Rest_Detail = RestDetail.objects.filter(Popular_for__icontains=res2)
            elif compare(result,['F','CH','RE','D']) or compare(result,['CH','RE','D']) or compare(result,['CH','F','PV','D']) or compare(result,['DI','CH','RE','D']):
                res2 = q.get_tag_name('CH')
                res3 = q.get_tag_name('D')
                Rest_Detail = RestDetail.objects.filter(Popular_for__icontains=res2,District__icontains=res3)
            elif compare(result,['PV','DI']) or compare(result,['DI']) or  compare(result,['PV','DI','F']):
                Rest_Detail = RestDetail.objects.filter(C_Name__iexact='Restaurant')
            elif compare(result,['CHI','PV']):
                Rest_Detail = RestDetail.objects.filter(Q(C_Name__icontains='cafe') |Q(C_Name__icontains='pub') |   Q(C_Name__icontains='restaurant'))

            elif compare(result,['DI','CH']) or compare(result,['CH']):
                res2 = q.get_tag_name('CH')
                Rest_Detail = RestDetail.objects.filter(C_Name__icontains='Restaurant', Popular_for__icontains=res2)        
            elif compare(result,['RE']):
                res2 = q.get_tag_name('RE')
                Rest_Detail = RestDetail.objects.filter(C_Name__icontains=res2)
            elif compare(result,['PV','ST','N']) or compare(result,['PV','ST','NL']) or compare(result,['PV','ST']) or compare(result,['ST','N']):
                Rest_Detail = RestDetail.objects.filter(Q(C_Name__icontains='hotel')|Q(C_Name__icontains='lodge'))
            elif compare(result,['PV','ST','D']) or compare(result,['ST','D']):
                Rest_Detail = RestDetail.objects.filter(Q(C_Name__icontains='hotel') | Q(C_Name__icontains='lodge'),District__icontains=q.get_tag_name('D'))
            else:
                Rest_Detail = None
           # cwz=q1.category
            Result = Rest_Detail

        return render(request, template_Name, {'result':Result,'res':category})


        


def placeDetail(request,placeId):
    context={}
    template_Name = 'Query/Individual_result_view.html'   
    Place_Info = PlaceDetail.objects.get(pk=placeId)
    lat=23.213
    lng=89.31
       
    context = { 'Place_Info':Place_Info ,'lat': lat, 'lng':lng}
    return render(request, template_Name, context)


def restDetail(request,placeId):
    context={}
    template_Name = 'Query/Individual_result_view.html'   
    Place_Info = RestDetail.objects.get(pk=placeId)
    lat=29
    lng=89.31
   
    context = { 'Place_Info':Place_Info ,'lat': lat, 'lng':lng}
    return render(request, template_Name, context)

def RetaurantandBar(request,placeName):
    template_Name1 = 'Query/query_result.html'
    Rest_Detail1 = RestDetail.objects.filter(C_Name__icontains=placeName)
    return render(request, template_Name1, {'result': Rest_Detail1, 'res': "R"})


def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST or None)
        if form.is_valid():
            userObj = form.cleaned_data
            username = userObj['username']
            email =  userObj['email']
            password =  userObj['password']
            if not (User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists()):
                User.objects.create_user(username, email, password)
                user = authenticate(username = username, password = password)
                login(request, user)
                return HttpResponseRedirect('/blog/')
            else:
                raise form.ValidationError('Looks like a username with that email or password already exists')
    else:
        form = UserRegistrationForm()
    return render(request, 'Query/register.html', {'form' : form})


def registeri(request):
    '''Register a new user.'''

    if request.method != 'POST':
        form = UserCreationForm()
    else:
        form = UserCreationForm(data=request.POST)
        
        if form.is_valid():
            new_user = form.save()
            authenticated_user = authenticate(username=new_user.username,
                password=request.POST['password1'])
            login(request, authenticated_user)
            return HttpResponseRedirect(reverse('Query:login'))

    context = {'form':form}
    return render(request, 'Query/register.html', context)


    # form=UserRegistrationForm(request.POST or None)
    # if form.is_valid():
    #     form.save()
    #     return HttpResponseRedirect('/blog/')
    # return render(request, 'Query/register.html', {'form' : form})

def map(request):
    template_name="Query/MAP_QUERY.html"
    text="123"
    context={'map':text}
    return render(request, template_name, context)



