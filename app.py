from ast import dump
from flask import *
app=Flask(__name__)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

###line####
import pymysql
import os
from dotenv import load_dotenv #python-dotenv
import json
from dbutils.pooled_db import PooledDB
load_dotenv()

POOL = PooledDB(
    creator=pymysql,  # 負責連結的python模組
    maxconnections=6,  # 連接池的最大連接數，0和None表示不限制連接次數
    mincached=2,  # 初始化时，連接池中至少創建的個數
    maxcached=5,  # 連接池中最大的連接個數
    maxshared=3,  # 連接池中最多共享的連接数量。
    blocking=True,  # 連接池中如果没有可用連接後，進行等待:True，等待；False，不等待然後error
    maxusage=None,  # 一個鍊結最多被重複使用的次數
    setsession=[],  # 開始會話前的命令列。如：["set datestyle to ...", "set time zone ..."]
    ping=0, #自己看文件(好麻煩)
    host='127.0.0.1',
    user='root',
    port=3306 ,
    password= os.getenv('mysql_password'),
    database='taipeitrip',
    charset='utf8',
    cursorclass=pymysql.cursors.DictCursor
)



@app.route("/api/attraction/<attractionId>")
def attractionId(attractionId):
    # print('id : ',attractionId)
    conn = POOL.connection()
    cursor = conn.cursor()
    sql = "SELECT id,name,category,description,address,transport,mrt,latitude,longitude,img FROM location where id = %s; "
    sql_run = cursor.execute(sql,(attractionId))
    result = cursor.fetchone() 
    conn.close()
    cursor.close()       
    if sql_run == 1:
        result['img'] = result['img'].split(',')
        result_JSON = json.dumps({"data":result},ensure_ascii=False)	    
    else :
        result_JSON = json.dumps({"error": bool(True) ,"message": "自訂的錯誤訊息"},ensure_ascii=False)
    return Response(result_JSON, mimetype='application/json')

@app.route('/api/attractions', methods=['GET'])
def api_attraction():
    args = request.args
    page = args.get('page')
    print(page)
    keyword = args.get("keyword", default="", type=str)
    now_page = int(page)*12
    now_keyword = '%'+keyword+'%'
    conn = POOL.connection()
    cursor = conn.cursor()
    if keyword == '' :
        sql = "SELECT id,name,category,description,address,transport,mrt,latitude,longitude,img FROM location limit %s,12;"
        sql_run = cursor.execute(sql,now_page) 
    else:
        sql = "SELECT id,name,category,description,address,transport,mrt,latitude,longitude,img FROM location where name like %s limit %s,12;"
        sql_run = cursor.execute(sql,(now_keyword,now_page))
    result = cursor.fetchall()
    conn.close()
    cursor.close() 
    if sql_run < 12 :
        page_now = None
    else :
        page_now = int(page)+1
    if sql_run > 0 :
        for i in range(len(result)):
            result[i]['img'] = result[i]['img'].split(',') 
        result_JSON = json.dumps({'nextPage':page_now,"data":result},ensure_ascii=False)
        
    else :
        result_JSON = json.dumps({"error": bool(True) ,"message": "自訂的錯誤訊息"},ensure_ascii=False)
    return Response(result_JSON, mimetype='application/json')











###line###
# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


app.run(host="0.0.0.0",port=3000)



# http://15.165.73.175:3000/api/attraction/1
# http://15.165.73.175:3000/api/attraction/99
# http://15.165.73.175:3000/api/attractions?page=0
# http://15.165.73.175:3000/api/attractions?page=0&keyword=公園
# http://15.165.73.175:3000/api/attractions?page=0&keyword=小貓

# note :
# 1.測試第一個api可以運行
# 2.測試第一個api的error狀態
# 3.測試第二個api可以篩選page
# 4.測試第二個api可以篩選page+keyword
# 5.測試第二個api的error狀態