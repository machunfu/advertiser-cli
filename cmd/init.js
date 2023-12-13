#!/usr/bin/env node
'use strict'
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { execSync, exec } = require('child_process');

// 当前目录路径  
const currentDirectory = process.cwd();




const download = () => {
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

module.exports = () => {
    // 初始化问题
    var config_question = [
        {
            type: 'list',
            name: 'template',
            message: '请选择一个模板?',
            choices: [
                'toutiao-app',
                'kuaishou-app',
                'gdt-app'
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
    inquirer.prompt(config_question).then(config_answers => {
        // 下载
        download().then(res => {
            console.log('download finished', res)
        })
        // if (download_res) {
        //     inquirer.prompt(install_question).then(install_answers => {
        //         console.log(install_answers)
        //     })
        // }

        // const currentPath = process.cwd();
        // console.log(`当前路径：${currentPath}`);




    });



}