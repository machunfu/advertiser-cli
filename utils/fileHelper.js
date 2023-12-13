const fs = require("fs");

const readFile = (filePath) => {
    debugger
    // 读取文件内容  
    fs.readFile(filePath, 'utf8', (err, data) => {
        console.log('data:', err, data)
        if (err) {
            console.error('读取文件出错:', err);
            return;
        }
        return data
    });
}

const writeFile = (filePath, content) => {
    // 写回文件内容  
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            console.error('写入文件出错:', err);
            return;
        }
        console.log('文件内容已成功修改！');
    });
}

module.exports = {
    readFile,
    writeFile
}
