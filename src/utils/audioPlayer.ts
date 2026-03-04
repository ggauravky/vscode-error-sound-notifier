import * as cp from 'child_process';
import * as os from 'os';
import * as vscode from 'vscode';

import * as fs from 'fs';

export function playSound(filePath: string, volume: number = 100) {
    if (!fs.existsSync(filePath)) {
        console.error(`Sound file not found: ${filePath}`);
        vscode.window.showErrorMessage(`Error Sound Notifier: Sound file not found at ${filePath}`);
        return;
    }

    const platform = os.platform();

    // Ensure volume is between 0 and 100
    volume = Math.max(0, Math.min(100, volume));
    if (volume === 0) return; // Muted

    try {
        if (platform === 'darwin') {
            // Mac uses afplay (built-in). Volume flag ranges from 0 to 255. 1.0 is normal.
            const macVol = volume / 100;
            cp.exec(`afplay -v ${macVol} "${filePath}"`);
        } else if (platform === 'linux') {
            // Linux uses paplay or aplay
            // paplay volume uses 0-65536
            const linuxVol = Math.round((volume / 100) * 65536);
            cp.exec(`paplay --volume=${linuxVol} "${filePath}" || aplay "${filePath}"`);
        } else if (platform === 'win32') {
            // Windows: Starting a background PowerShell process and loading the .NET framework 
            // introduces a 1.5 - 2.5 second delay.
            // Using a lightweight pre-compiled node package `sound-play` plays the file instantly natively.
            const soundPlay = require('sound-play');
            soundPlay.play(filePath, volume / 100).catch((err: any) => {
                console.error('Failed to play sound (Windows OS):', err);
            });
        } else {
            vscode.window.showWarningMessage('Error Sound Notifier: OS not supported for audio playback.');
        }
    } catch (err) {
        console.error('Failed to play sound:', err);
    }
}
