import * as vscode from 'vscode';
import * as path from 'path';
import { playSound } from './audioPlayer';

export class ErrorDetector {
    private lastEditorSoundTime = 0;
    private lastTerminalSoundTime = 0;
    private editorSoundPath = '';
    private terminalSoundPath = '';

    constructor(private context: vscode.ExtensionContext) {
        const fs = require('fs');
        const mediaPath = path.join(context.extensionPath, 'media');

        if (fs.existsSync(mediaPath)) {
            const files = fs.readdirSync(mediaPath) as string[];

            // Look specifically for the files requested by the user
            const sound2 = files.find(f => f.toLowerCase() === 'sound2.mp3');
            const fahhhhh = files.find(f => f.toLowerCase() === 'fahhhhh.mp3');

            // Assign explicitly if found, otherwise just grab any audio file as a fallback
            const fallbackAudio = files.find(f => f.endsWith('.mp3') || f.endsWith('.wav')) || 'alert.wav';

            this.editorSoundPath = sound2 ? path.join(mediaPath, sound2) : path.join(mediaPath, fallbackAudio);
            this.terminalSoundPath = fahhhhh ? path.join(mediaPath, fahhhhh) : path.join(mediaPath, fallbackAudio);
        } else {
            this.editorSoundPath = path.join(context.extensionPath, 'media', 'alert.wav');
            this.terminalSoundPath = path.join(context.extensionPath, 'media', 'alert.wav');
        }

        // Listen for diagnostics (Editor errors)
        context.subscriptions.push(
            vscode.languages.onDidChangeDiagnostics((e) => this.onDiagnosticsChange(e))
        );

        // Terminal listening workaround:
        // Since VS Code strictly blocks extensions from reading raw terminal text without proposed APIs,
        // we can robustly detect errors by listening to Task completions (like npm scripts, compile steps, etc.)
        context.subscriptions.push(
            vscode.tasks.onDidEndTaskProcess((e) => {
                const config = this.getConfig();
                if (!config.get<boolean>('listenToTerminal', true)) return;

                // If a task ends with a non-zero exit code, it means it failed/errore!
                if (e.exitCode !== undefined && e.exitCode !== 0) {
                    this.triggerTerminalSound();
                }
            })
        );

        // Terminal Shell Integration (Interactive Terminal Commands)
        // Supported in VS Code 1.86+. Detects when a command typed into the shell finishes.
        context.subscriptions.push(
            vscode.window.onDidEndTerminalShellExecution((e) => {
                const config = this.getConfig();
                if (!config.get<boolean>('listenToTerminal', true)) return;

                // If the terminal command exited with an error code (non-zero)
                if (e.exitCode !== undefined && e.exitCode !== 0) {
                    this.triggerTerminalSound();
                }
            })
        );

        // Listen to terminal output stream for running tasks (e.g., watch scripts that never exit)
        context.subscriptions.push(
            vscode.window.onDidStartTerminalShellExecution(async (e) => {
                try {
                    let buffer = '';
                    if (typeof e.execution.read === 'function') {
                        const stream = e.execution.read();
                        for await (const data of stream) {
                            buffer = this.processTerminalData(data, buffer);
                        }
                    }
                } catch (err) {
                    // Ignore stream read errors
                }
            })
        );
    }


    private getConfig() {
        return vscode.workspace.getConfiguration('errorSoundNotifier');
    }

    private canPlayEditorSound(): boolean {
        const config = this.getConfig();
        if (!config.get<boolean>('enabled', true)) return false;

        const cooldownMs = config.get<number>('cooldownMs', 3000);
        const now = Date.now();
        if (now - this.lastEditorSoundTime < cooldownMs) return false;

        return true;
    }

    private canPlayTerminalSound(): boolean {
        const config = this.getConfig();
        if (!config.get<boolean>('enabled', true)) return false;

        const now = Date.now();
        // Separate 1.5s terminal cooldown prevents duplicate sounds when
        // streams and exit-codes trigger back-to-back, but prevents
        // terminal sounds from being blocked by the global editor cooldown.
        if (now - this.lastTerminalSoundTime < 1500) return false;

        return true;
    }

    public triggerEditorSound(force: boolean = false) {
        if (!force && !this.canPlayEditorSound()) return;

        const config = this.getConfig();
        const volume = config.get<number>('volume', 100);

        this.lastEditorSoundTime = Date.now();
        playSound(this.editorSoundPath, volume);
    }

    public triggerTerminalSound() {
        if (!this.canPlayTerminalSound()) return;

        const config = this.getConfig();
        const volume = config.get<number>('volume', 100);

        this.lastTerminalSoundTime = Date.now();
        playSound(this.terminalSoundPath, volume);
    }

    public getEditorSoundPath(): string {
        return this.editorSoundPath;
    }

    private errorCounts = new Map<string, number>();

    private onDiagnosticsChange(e: vscode.DiagnosticChangeEvent) {
        const config = this.getConfig();
        if (!config.get<boolean>('listenToDiagnostics', true)) return;

        let shouldPlaySound = false;

        for (const uri of e.uris) {
            const uriString = uri.toString();
            const diagnostics = vscode.languages.getDiagnostics(uri);
            const currentErrorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;

            const previousErrorCount = this.errorCounts.get(uriString) || 0;

            if (currentErrorCount > previousErrorCount) {
                // Number of errors increased, we should alert!
                shouldPlaySound = true;
            }

            if (currentErrorCount === 0) {
                this.errorCounts.delete(uriString);
            } else {
                this.errorCounts.set(uriString, currentErrorCount);
            }
        }

        if (shouldPlaySound) {
            this.triggerEditorSound();
        }
    }

    private processTerminalData(data: string, buffer: string): string {
        const config = this.getConfig();
        if (!config.get<boolean>('listenToTerminal', true)) return buffer;

        // Strip ANSI escape codes and lowercase
        const cleanData = data.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').toLowerCase();
        buffer += cleanData;

        // Create a copy of the buffer to check for errors, from which we remove known false-positive phrases
        // This prevents the extension from triggering itself when the working directory path is printed
        const checkBuffer = buffer
            .replace(/error-sound-notifier/g, '')
            .replace(/error sound notifier/g, '');

        const errorPatterns = [
            /\berror\b/,
            /\bfailed\b/,
            /\bexception\b/,
            /\btraceback\b/,
            /\berr!/ // Removed \b at the end because ! is a non-word character
        ];

        // Check if the current buffer matches any error pattern
        if (errorPatterns.some(pattern => pattern.test(checkBuffer))) {
            this.triggerTerminalSound();
            return ''; // clear buffer after matching to prevent spam and repeated sounds
        }

        // Keep buffer size manageable (last 500 chars) for the next streaming chunk
        // We only do this AFTER checking the buffer so we don't truncate early errors
        if (buffer.length > 500) {
            buffer = buffer.slice(buffer.length - 500);
        }

        return buffer;
    }
}
