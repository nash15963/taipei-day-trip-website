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
app.config['SECRET_KEY'] = os.getenv('secret_key')

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


#會員登入SQL_table = member
#取得當前使用者的資料
@app.route('/api/user', methods=['GET']) 
def user_get():
    if "id" in session :
        id = session['id']
        email = session['email'] 
        name = session['name'] 
        data = {'id':id,'email':email,'name':name}
        result_JSON = json.dumps({"data":data}) 
    else :
        result_JSON = json.dumps({"data":None}) 
    return Response(result_JSON, mimetype='application/json')

#註冊帳戶
#文字篩選功能(未新增)
@app.route('/api/user', methods=['POST']) 
def user_signup():
    req_data = request.get_json()
    name =req_data['Name']
    email = req_data['Email']
    password = req_data['Password']
    if name == '' or email == '' or password == '' : #篩選填入資料不得為空
        result_JSON = json.dumps({"error": bool(True) ,"message": "填入資料不得為空"})
    else:
        conn = POOL.connection()
        cursor = conn.cursor()
        sql = "SELECT COUNT(*) FROM member WHERE email = %s"
        cursor.execute(sql, (email))
        result = cursor.fetchone() #不得重複ID_name，如果result大於1則表示，此帳號已被註冊
        #判斷是否被註冊
        if result['COUNT(*)'] > 0:
            result_JSON = json.dumps({"error": bool(True) ,"message": "此帳號已被註冊"})
        else :
            sql = "INSERT INTO member (name, email, password) VALUES (%s,%s,%s)"
            cursor.execute(sql, (name, email, password))
            conn.commit()
            print("Done")
            result_JSON = json.dumps({"ok": bool(True)})
        conn.close()
        cursor.close()
    return Response(result_JSON, mimetype='application/json')

#登入帳戶
@app.route('/api/user', methods=['PATCH']) 
def user_signin():
    req_data = request.get_json()
    # return json.dumps({"data": req_data})
    email =req_data['Email']
    password = req_data['Password']
    conn = POOL.connection()
    cursor = conn.cursor()
    sql = "SELECT id ,email,name,password FROM member WHERE email = %s and password = %s;"
    cursor.execute(sql, (email,password))
    result = cursor.fetchone()
    conn.close()
    cursor.close()
    if result != None :
        session['id']= result['id']
        session['email'] = result['email']
        session['name'] = result['name']
        result_JSON = json.dumps({"ok": bool(True)})
    else :
        result_JSON = json.dumps({"error": bool(True) ,"message": "帳號或密碼錯誤"})
    return Response(result_JSON, mimetype='application/json')
        

#登出帳戶
@app.route('/api/user', methods=['DELETE']) 
def user_logout():
    session.clear()
    result_JSON = json.dumps({"ok": bool(True)})
    return Response(result_JSON, mimetype='application/json')

###boking api###
@app.route('/api/booking', methods=['GET'])
def  booking_get():
    if "id" in session :
        userid = session['id']
        conn = POOL.connection()
        cursor = conn.cursor()
        sql = "select BookingID,UserID,AttractionId FROM taipeitrip.book where (UserID = '%s') ;"
        sql_run =  cursor.execute(sql, (userid))
        result_from_order = cursor.fetchone()
        if sql_run == True: #有訂購資料
            sql = "select A.BookingID,A.UserID,A.AttractionId,A.Date,A.Time,A.Price,\
            B.id,B.name,B.address,B.img\
            FROM taipeitrip.book as A inner join taipeitrip.location as B\
            on A.AttractionId = B.id\
            where (UserID = '%s') ;"  
            cursor.execute(sql, (userid))
            result = cursor.fetchone()
            conn.close()
            cursor.close()
            attraction ={
                'id':result['id'],
                'name':result['name'],
                'address':result['address'],
                'image':result['img'].split(',')[0]
                }
            result_JSON = json.dumps({'data':attraction,
                                      'date':result['Date'],
                                      'time':result['Time'],
                                      'price':result['Price']},ensure_ascii=False)
        elif sql_run == False: #沒有訂購資料
            result_JSON = json.dumps({"data": None,"message": "沒有訂購資料"})
    else:
        result_JSON = json.dumps({"error": True,"message": "沒有登入帳戶"})
    return Response(result_JSON, mimetype='application/json')


#booking POST api 編寫邏輯
#如果訂單有重複使用者ID則delete掉，一個使用者最多一筆訂單(本網頁邏輯，因為沒有設計訂購清單)
#步驟如下:
#1.先搜尋此使用者訂單有幾筆(正常來說應該最多一筆或沒有訂單)
#當個人訂單數量清空後才能掛上新單
@app.route('/api/booking', methods=['POST'])
def  booking_post():
    req_data = request.get_json()
    id = session['id']
    AttractionId = req_data['attractionId']
    Date =req_data['Date']
    Price = req_data['Price']
    Time = req_data['Time']
    if Date == '' or Price == '' or Time == '' : #篩選填入資料不得為空
        result_JSON = json.dumps({"error": bool(True) ,"message": "填入資料不得為空"})
    elif id == '':
        result_JSON = json.dumps({"error": bool(True) ,"message": "需要登入會員"})
    else:
        conn = POOL.connection()
        cursor = conn.cursor()
        sql = "select UserID FROM taipeitrip.book where (UserID = '%s') ;"
        sql_run =  cursor.execute(sql, (id))
        if sql_run !=0:
            cursor.execute("SET SQL_SAFE_UPDATES=0;")
            cursor.execute("DELETE FROM `taipeitrip`.`book` WHERE (UserID = '%s');",(id))
            cursor.execute("SET SQL_SAFE_UPDATES=1;")
        sql = "INSERT INTO book (UserID,AttractionID,Date, Price, Time) VALUES (%s,%s,%s,%s,%s)"
        sql_run =  cursor.execute(sql, (id,AttractionId, Date, Price, Time))
        # print('sql_run :',sql_run)   #成功執行結果等於1
        conn.commit()
        conn.close()
        cursor.close()
        if sql_run == True :
            result_JSON = json.dumps({"ok": bool(True)})
        else :
            result_JSON = json.dumps({"error": bool(True) ,"message": "資料上傳錯誤"})
    return Response(result_JSON, mimetype='application/json')


@app.route('/api/booking', methods=['DELETE'])
def  booking_DELETE():
    if "id" in session :
        userid = session['id']
        conn = POOL.connection()
        cursor = conn.cursor()
        cursor.execute("SET SQL_SAFE_UPDATES=0;")
        result = cursor.execute("DELETE FROM `taipeitrip`.`book` WHERE (UserID = '%s');",(userid))
        cursor.execute("SET SQL_SAFE_UPDATES=1;")
        conn.commit()
        conn.close()
        cursor.close()
        if result ==True :
            result_JSON = json.dumps({"ok": bool(True)})
        else :
            result_JSON = json.dumps({"error": bool(True),"message": "刪除失敗"})
        return Response(result_JSON, mimetype='application/json')
    else :
        result_JSON = json.dumps({"error": bool(True) ,"message": "刪除資料方式錯誤"})
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