from flask import *
import pymysql
import os
from dotenv import load_dotenv
app=Flask(__name__)

load_dotenv()
connection  = pymysql.connect(host='127.0.0.1',
                              user='root',
                              password=os.getenv('mysql_password'),
                              database='taipeitrip',
                              charset='utf8',
                              cursorclass=pymysql.cursors.DictCursor)
cursor = connection.cursor()
# Pages
@app.route("/")
def index():
	return render_template("index.html")

#取得景點資料api
@app.route('/attractions', methods=['GET'])
def api_attraction():
    args = request.args
    page = args.get('page')
    page_now = int(page)+1
    keyword = args.get("keyword", default="", type=str)
    if keyword == '' :
        sql = "SELECT `index`,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,img0 FROM taipei_trip where `index` = %s; " 
        sql_run = cursor.execute(sql,(page))
        result = cursor.fetchone()
    else:
        sql = "SELECT `index`,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,img0 FROM taipei_trip where `idenx` = %s and CAT2 = %s" 
        sql_run = cursor.execute(sql,(page,keyword))
        result = cursor.fetchone()
    if sql_run == 1:
        result_JSON = json.dumps({'nextPage':page_now,"data":[result]},ensure_ascii=False)	    
    else :
        result_JSON = json.dumps({"error": bool(True) ,"message": "自訂的錯誤訊息"},ensure_ascii=False)
    return result_JSON


@app.route("/attraction/<id>")
def attraction(id):
    print('id : ',id)
    sql = "SELECT `index`,stitle,CAT2,xbody,address,info,MRT,latitude,longitude,img0 FROM taipei_trip where `index` = %s; " 
    sql_run = cursor.execute(sql,(id))
    result = cursor.fetchone()
    if sql_run == 1:
        result_JSON = json.dumps({"data":[result]},ensure_ascii=False)	    
    else :
        result_JSON = json.dumps({"error": bool(True) ,"message": "自訂的錯誤訊息"},ensure_ascii=False)
    return render_template("attraction.html" ,string=result_JSON)

@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")



app.run(port=3000)


####
# http://127.0.0.1:3000/attraction/1
