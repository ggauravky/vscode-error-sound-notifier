const cp = require('child_process');
const path = require('path');

const filePath = path.join(__dirname, 'media', 'fahhhhh.mp3');
console.log('Testing file:', filePath);

// Windows Presentation Foundation (WPF) MediaPlayer handles mp3 perfectly and doesn't rely
// on the older WMPlayer OCX which can hang if it tries to spawn UI or handles out of session
const script = `
Add-Type -AssemblyName PresentationCore;
$player = New-Object System.Windows.Media.MediaPlayer;
$player.Open('${filePath.replace(/\\/g, '/')}');
$player.Volume = 1.0;
$player.Play();
Start-Sleep -Seconds 2;
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
