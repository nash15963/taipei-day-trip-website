import json
import pymysql
import pandas as pd
from sqlalchemy import create_engine
import numpy as np
from copy import deepcopy
import os


input_file = open ('taipei-attractions.json' , encoding='UTF-8')
data = json.load(input_file)
data_dict = data['result']['results']

for i in range(0,58):
    data_dict[i]['file'] = data_dict[i]['file'].lower()
    temstr = data_dict[i]['file'].split('https')
    em = []
    for j in temstr:
        comstr = 'https' + j
        if j.endswith("jpg") == True or j.endswith("png") == True :
            em.append(comstr)
    data_dict[i]['img'] = str(em)



exp_all = pd.DataFrame()

for i in range(len(data_dict)):
    exp1 = pd.DataFrame([data_dict[i]])
    exp_all = exp_all.append(exp1)

exp_all = exp_all.sort_values(by=['_id'])
exp_all = exp_all.reset_index(drop=True)


exp_all = exp_all.drop(['xpostDate'] ,axis =1)
exp_all = exp_all.drop(['REF_WP'] ,axis =1)
exp_all = exp_all.drop(['avBegin'] ,axis =1)
exp_all = exp_all.drop(['langinfo'] ,axis =1)
exp_all = exp_all.drop(['SERIAL_NO'] ,axis =1)
exp_all = exp_all.drop(['RowNumber'] ,axis =1)
exp_all = exp_all.drop(['POI'] ,axis =1)
exp_all = exp_all.drop(['file'] ,axis =1)
exp_all = exp_all.drop(['idpt'] ,axis =1)
exp_all = exp_all.drop(['avEnd'] ,axis =1)
exp_all = exp_all.drop(['CAT1'] ,axis =1)


exp_all.rename(columns={'stitle':'name',
                       'CAT2':'category',
                       'xbody':'description',
                       'info':'transport',
                       'MRT':'mrt'
                       }, inplace=True)



engine = create_engine("mysql+pymysql://root:xu3t;3u4xl3-4284@localhost:3306/taipeitrip",encoding='utf8')
exp_all.to_sql(name = 'location' , con = engine)



