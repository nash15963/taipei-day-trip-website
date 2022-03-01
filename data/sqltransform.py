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
        em.append(comstr)
    em.remove(em[0])
    for k in em:
        if k.endswith("jpg") == False or k.endswith("png") == False :
            em.remove(k)
            data_dict[i]['img'] = em


exp_all = pd.DataFrame()

for i in range(len(data_dict)):
    exp1 = pd.DataFrame([data_dict[i]])
    exp_all = exp_all.append(exp1)

exp_all = exp_all.sort_values(by=['_id'])
exp_all = exp_all.reset_index(drop=True)



def split_col(data, column):
  data = deepcopy(data)
  max_len = max(list(map(len, data[column].values))) 
  new_col = data[column].apply(lambda x: x + [None]*(max_len - len(x))) 
  new_col = np.array(new_col.tolist()).T 
  for i, j in enumerate(new_col):
    data[column + str(i)] = j
  return data
 
 
new_df = split_col(data = exp_all, column='img')
new_df = new_df.drop(['img'] ,axis =1)


engine = create_engine("mysql+pymysql://root:xxx@localhost:3306/taipeitrip",encoding='utf8')
new_df.to_sql(name = 'taipei_trip' , con = engine)