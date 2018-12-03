#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# author: xu3352@gmail.com
# desc: a file share(upload/download) server

import os
import time

from flask import Flask, request, redirect, url_for, render_template, jsonify, send_file
from werkzeug import secure_filename

WORK_DIR = os.getcwd()
UPLOAD_FOLDER = WORK_DIR + '/uploads'
ALLOWED_EXTENSIONS = set(['txt', 'zip', 'tar.gz', 'rar', 'xlsx'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024  # 1G


def allowed_file(filename):
    return True
    # return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def human_filesize(size):
    """ 可读性较好的文件大小 """
    if size < 1024:
        return '%d B' % size
    if size < 1024 * 1024:
        return "%.1f K" % (size / 1024)
    if size < 1024 * 1024 * 1024:
        return "%.1f M" % (size / 1024 / 1024)
    if size < 1024 * 1024 * 1024 * 1024:
        return "%.1f G" % (size / 1024 / 1024 / 1024)
    return '%d B' % size


@app.route('/')
def index():
    """ 文件列表展示 """
    file_list = []
    files = [f for f in os.listdir(UPLOAD_FOLDER)]
    # 按时间倒序排列
    files.sort(key=lambda x: os.path.getmtime(UPLOAD_FOLDER + "/" + x), reverse=True)

    for filename in files:
        st = os.stat(UPLOAD_FOLDER + "/" + filename)
        file_vo = {
            'filename': filename,
            'size': human_filesize(st.st_size),
            'mtime': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(st.st_mtime)),
        }
        file_list.append(file_vo)
    return render_template("index.html", file_list=file_list)


@app.route('/download_file/<filename>')
def download_file(filename=None):
    """ 下载文件 """
    if filename is None:
        return "404"
    try:
        return send_file(UPLOAD_FOLDER + "/" + filename, as_attachment=True)
    except Exception as e:
        return "404"


@app.route('/upload_file', methods=['GET', 'POST'])
def upload_file():
    """ 文件上传 """
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            # filename = secure_filename(file.filename) # 中文会被忽略
            filename = file.filename.replace(' ', '')
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(save_path)
    return redirect(url_for('index'))


if __name__ == "__main__":
    # server start up
    app.run(host='0.0.0.0', port=8080, debug=True)

