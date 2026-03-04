import * as vscode from 'vscode';
import { ErrorDetector } from './utils/errorDetector';

let statusBarItem: vscode.StatusBarItem;
let errorDetector: ErrorDetector;

export function activate(context: vscode.ExtensionContext) {
    errorDetector = new ErrorDetector(context);

    // Register Status Bar Item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'errorSoundNotifier.toggle';
    context.subscriptions.push(statusBarItem);

    updateStatusBar();
    statusBarItem.show();

    // Listen to configuration changes globally
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('errorSoundNotifier.enabled')) {
                updateStatusBar();
            }
        })
    );

    // Register Commands
    context.subscriptions.push(
        vscode.commands.registerCommand('errorSoundNotifier.enable', () => {
            vscode.workspace.getConfiguration('errorSoundNotifier').update('enabled', true, true);
            vscode.window.showInformationMessage('Error Sound Notifier Enabled');
        }),
        vscode.commands.registerCommand('errorSoundNotifier.disable', () => {
            vscode.workspace.getConfiguration('errorSoundNotifier').update('enabled', false, true);
            vscode.window.showInformationMessage('Error Sound Notifier Disabled');
        }),
        vscode.commands.registerCommand('errorSoundNotifier.testSound', () => {
            errorDetector.triggerEditorSound(true);
            vscode.window.showInformationMessage('Playing test sound (Editor Error)...');
        }),
        vscode.commands.registerCommand('errorSoundNotifier.toggle', () => {
            const config = vscode.workspace.getConfiguration('errorSoundNotifier');
            const currentState = config.get<boolean>('enabled', true);
            config.update('enabled', !currentState, true);
            vscode.window.showInformationMessage(`Error Sound Notifier ${!currentState ? 'Enabled' : 'Disabled'}`);
        })
    );
}

function updateStatusBar() {
    const config = vscode.workspace.getConfiguration('errorSoundNotifier');
    const enabled = config.get<boolean>('enabled', true);

    if (enabled) {
        statusBarItem.text = '$(unmute) Error Sound ON';
        statusBarItem.tooltip = 'Click to disable Error Sound Notifier';
    } else {
        statusBarItem.text = '$(mute) Error Sound OFF';
        statusBarItem.tooltip = 'Click to enable Error Sound Notifier';
    }
}

export function deactivate() { }
