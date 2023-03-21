```python
import pandas as pd
import pymysql

# 连接本地 MySQL 数据库
conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='password',
    database='database_name'
)

# 读取 Excel 文件数据
data = pd.read_excel('excel_file.xlsx')

# 获取数据库操作游标
cursor = conn.cursor()

# 写入数据到 MySQL 数据库表中（转换为整型）
for i in range(len(data)):
    cursor.execute("INSERT INTO table_name (column1, column2, column3) VALUES (%s, %s, %s)", (
        int(data.iloc[i, 0]), 
        int(data.iloc[i, 1]), 
        int(data.iloc[i, 2])
    ))

# 提交事务
conn.commit()

# 写入数据到 MySQL 数据库表中（转换为浮点型）
for i in range(len(data)):
    cursor.execute("INSERT INTO table_name (column1, column2, column3) VALUES (%s, %s, %s)", (
        float(data.iloc[i, 0]), 
        float(data.iloc[i, 1]), 
        float(data.iloc[i, 2])
    ))

# 提交事务
conn.commit()
```