#!/usr/bin/env node
const { program } = require('commander');
const packageInfo = require('./package.json');

// program.option('-c --color', 'add color')

program.version(packageInfo.version)

program.command('init').alias('i').description("初始化vue项目").action(() => {
    require('./cmd/init')()
})

program.command('list').alias('l').description("查看模板列表").action(() => {
    // require('./cmd')
})

// programnpm i
//     .command('hello <name>')
//     .option('-c, --count <count>', 'Repeat the message', parseInt)
//     .usage('<name> [options]')
//     .description('Say hello to someone')
//     .action((name, options) => {
//         const message = `Hello, ${name}!`;
//         if (options.count) {
//             for (let i = 0; i < options.count; i++) {
//                 console.log(message);
//             }
//         } else {
//             console.log(message);
//         }
//     });


program.parse(process.argv);