import os
from dotenv import load_dotenv
load_dotenv()
print('Before load_dotenv()', os.getenv('mysql_password'))