const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const optionDefinitions = [
     
    { name: 'serialport', type: String, multiple: false, defaultValue: [ "com5" ], description: 'Which serial port to open. See examples area.' },
    { name: 'wwwport', type: Number, multiple: false, defaultValue: [ 80 ], description: 'Allows you to change server port to 8080 if default port is in use or you can not run as root on linux' },
    { name: 'verbose', alias: 'v', type: Boolean, description: 'Display debug print outs' },
    { name: 'debug', alias: 'd', type: Boolean, description: 'For debugging app' },
    { name: 'help', alias: 'h', type: Boolean, description: 'Display this usage guide.' }
  ]

const options = commandLineArgs(optionDefinitions)
  

const sections = [
    {
      header: 'LAPS',
      content: 'Web based app (nodejs) for showing lap data coming from RC HourGlass DIY lap timing system hardware.'
    },
    {
      header: 'Options',
      hide: [ 'debug' ],
      optionList: optionDefinitions
    },
    {
        header: 'Examples',
        content: [
          {
            desc: '1. win32 serial ',
            example: '$ node laps --serialport com2'
          },
          {
            desc: '2. linux serial ',
            example: '$ node laps --serialport /dev/ttyACM0'
          },
          {
            desc: '3. Find Linux serial port',
            example: '$ ls /dev/serial/by-id'
          }
        ]
    },
    {
      content: 'Project home: {underline https://github.com/snowblind/LAPS}'
    }    
]
const usage = commandLineUsage(sections)

module.exports = {
    options: options,
    printUsage: function () {
        console.log(usage)
      }
};