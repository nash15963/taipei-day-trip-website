
from flask import *
from flask_cors import CORS
app=Flask(__name__)
CORS(app)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

###line####
import pymysql
import os
from dotenv import load_dotenv #python-dotenv
import json



load_dotenv()

connection  = pymysql.connect(host='127.0.0.1',
                              user='root',
                              port= 3306 ,
                              password= os.getenv('mysql_password'),
                              database='taipeitrip',
                              charset='utf8',
                              cursorclass=pymysql.cursors.DictCursor)
cursor = connection.cursor()

@app.route("/api/attraction/<attractionId>")
def attractionId(attractionId):
    print('id : ',attractionId)
    sql = "SELECT id,name,category,description,address,transport,mrt,latitude,longitude,img FROM location where id = %s; "
    sql_run = cursor.execute(sql,(attractionId))
    result = cursor.fetchone()          
    if sql_run == 1:
        result['img'] = result['img'].split(',')
        result_JSON = json.dumps({"data":result,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'},ensure_ascii=False)	    
    else :
        result_JSON = json.dumps({"error": bool(True) ,
        "message": "自訂的錯誤訊息",
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'},
        ensure_ascii=False)
    # result_JSON.headers["Access-Control-Allow-Origin"] = "*"
    return Response(result_JSON)

@app.route('/api/attractions', methods=['GET'])
def api_attraction():
    args = request.args
    page = args.get('page')
    print(page)
    keyword = args.get("keyword", default="", type=str)
    now_page = int(page)*12
    now_keyword = '%'+keyword+'%'
    if keyword == '' :
        sql = "SELECT id,name,category,description,address,transport,mrt,latitude,longitude,img FROM location limit %s,12;"
        sql_run = cursor.execute(sql,now_page) 
    else:
        sql = "SELECT id,name,category,description,address,transport,mrt,latitude,longitude,img FROM location where name like %s limit %s,12;"
        sql_run = cursor.execute(sql,(now_keyword,now_page))
    result = cursor.fetchall()
    if sql_run < 12 :
        page_now = None
    else :
        page_now = int(page)+1
    if sql_run > 0 :
        for i in range(len(result)):
            result[i]['img'] = result[i]['img'].split(',') 
        result_JSON = json.dumps({'nextPage':page_now,
        "data":result,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'},ensure_ascii=False)
        
    else :
        result_JSON = json.dumps({"error": bool(True) ,
        "message": "自訂的錯誤訊息",
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'},ensure_ascii=False)
    return Response(result_JSON)












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



