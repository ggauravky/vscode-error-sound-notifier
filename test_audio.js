const cp = require('child_process');
const path = require('path');

const filePath = path.join(__dirname, 'media', 'fahhhhh.mp3');
console.log('Testing file:', filePath);

const script = `
    $player = New-Object -ComObject WMPlayer.OCX;
    $player.settings.volume = 100;
    $player.URL = '${filePath.replace(/\\/g, '/')}';
    $player.controls.play();
    while ($player.playState -ne 1) { Start-Sleep -Milliseconds 100 }
`.replace(/\n/g, '');

console.log('Executing:', `powershell -c "${script}"`);

cp.exec(`powershell -c "${script}"`, (error, stdout, stderr) => {
    if (error) {
        console.error('ERROR:', error);
    }
    if (stderr) {
        console.error('STDERR:', stderr);
    }
    if (stdout) {
        console.log('STDOUT:', stdout);
    }
    console.log('Done.');
});
