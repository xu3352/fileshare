# Fileshare
一个精简的Python版 上传/下载 的Web服务器

a simple python file upload/download web server

上传的文件会放到 `uploads` 目录下, 按照创建时间倒序展示

# Change port

`filesserver.py` : chang the `port` as you like

```py
if __name__ == "__main__":
    # server start up
    app.run(host='0.0.0.0', port=8080, debug=True)
```

# Start Server

依赖包: `flask`
```bash
# 安装 flask 等依赖包
$ python -m pip install -r requirements.txt
```

启动服务
```bash
# start server
$ python filesserver.py
```

# Snapshot

[浏览器访问: 127.0.0.1:8080](http://127.0.0.1:8080/)

![效果图](https://xu3352.github.io/assets/archives/20181203031332_fileserver_snapshot.png)


