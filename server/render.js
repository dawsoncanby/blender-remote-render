const { spawn} = require('child_process')
const path = require('path')

exports.render = (filePath, dataCallback, errCallback, closeCallback) => {
    console.log('really running')
	const command = `DISPLAY=:0.0 blender -b ${filePath} -o //../rendering/${path.basename(filePath)}_tmp -a`
	const blender = spawn(command, { shell: true })
        
    blender.stdout.on('data', data => dataCallback(data.toString()))
    blender.stderr.on('data', data => errCallback(data.toString()))
    blender.stderr.on('close', code => closeCallback(code))
}
