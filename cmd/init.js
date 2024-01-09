#!/usr/bin/env node
'use strict'
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { execSync, exec } = require('child_process');
const config = require('../config/index')
const { readFile, writeFile } = require('../utils/fileHelper')

// 当前目录路径  
const currentDirectory = process.cwd();



// 下载仓库
const downloadGitRespository = () => {
    return new Promise(async (resolve) => {
        try {
            // 仓库名称
            const respositoryName = 'marathon'
            // 检查当前目录是否存在同名仓库文件夹
            const respositoryPath = path.join(currentDirectory, respositoryName);
            if (fs.existsSync(respositoryPath)) {
                await inquirer.prompt([{
                    type: 'confirm',
                    name: 'download',
                    message: `目标路径 ${currentDirectory} 已存在，是否替换？`
                }]).then(res => {
                    if (res.download) {
                        // 删除已存在的文件夹
                        rimraf.sync(respositoryPath)
                    } else {
                        process.exit()
                    }
                })
            }

            // 下载
            console.log('Initializing git respository...');
            const cmd = `git clone http://git.minrow.com/adsdesk/adsdesk-fe/${respositoryName}.git`
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    throw new Error(error)
                } else {
                    console.log('Git download success')
                    resolve(true)
                }
            })

        } catch (error) {
            console.log(error)
            process.exit()
        }
    })
}

// 替换文件内容
const replaceFileContent = (params) => {

    const fileExec = (fileName, filePath, searchValue, replaceValue) => {
        // 读取文件
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('读取文件出错:', err);
                return;
            }
            // 替换内容
            const replaceContent = data.replace(searchValue, replaceValue)
            // 写入文件
            fs.writeFile(filePath, replaceContent, 'utf8', (err) => {
                if (err) {
                    console.error('写入文件出错:', err);
                    return;
                }
                console.log(`文件${fileName}内容已成功修改`);
            });

        });
    }

    Object.keys(config.files).forEach(key => {
        config.files[key].forEach(item => {
            const { fileName, filePath } = item
            const fullPath = path.join(currentDirectory, filePath)
            fileExec(fileName, fullPath, key, params[key])
        })
    })
}

module.exports = () => {
    // 问题
    var config_question = [
        {
            type: 'list',
            name: 'template',
            message: '请选择一个模板?',
            choices: [
                '创编模板',
                '报表模板'
            ]
        },
        {
            type: 'input',
            name: 'mediaName',
            message: '请输入媒体名称(如头条)?',
            validate: (val) => {
                if (val.length > 0) {
                    return true
                } else {
                    return '媒体名称不能为空'
                }

            }
        },
        {
            type: 'input',
            name: 'mediaCode',
            message: '请输入媒体编码(如toutiao)?',
            validate: (val) => {
                if (val.length > 0) {
                    return true
                } else {
                    return '媒体编码不能为空'
                }
            }
        },
        {
            type: 'input',
            name: 'port',
            message: '请输入APP启动端口号?',
            validate: (val) => {
                // 四位数字，且开头非0
                var regex = /^[1-9]\d{3}$/;
                if (regex.test(val)) {
                    return true
                } else {
                    return '端口号必须4位数字,且开头非0'
                }
            }
        },
    ];

    // 提示用户回答问题
    inquirer.prompt(config_question).then(answers => {
        downloadGitRespository().then(res => {
            if (res) {
                replaceFileContent(answers)
            }
        })
    });



}