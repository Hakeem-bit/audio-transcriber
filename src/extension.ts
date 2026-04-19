import * as path from 'path';
import * as vscode from 'vscode';
import { transcribeAudioFile, SUPPORTED_AUDIO_EXTENSIONS } from './transcriber';

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    'audioTranscriber.transcribe',
    async () => {
      // Validate API key first
      const config = vscode.workspace.getConfiguration();
      const apiKey = config.get<string>('transcriber.apiKey', '');

      if (!apiKey || apiKey.trim() === '') {
        const action = await vscode.window.showErrorMessage(
          'OpenAI API key is not configured. Please add your API key in VS Code settings under "transcriber.apiKey".',
          'Open Settings'
        );
        if (action === 'Open Settings') {
          await vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'transcriber.apiKey'
          );
        }
        return;
      }

      // Open file picker for audio files
      const fileUris = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: 'Transcribe',
        title: 'Select an Audio File to Transcribe',
        filters: {
          'Audio Files': [...SUPPORTED_AUDIO_EXTENSIONS],
        },
      });

      if (!fileUris || fileUris.length === 0) {
        return; // User cancelled
      }

      const audioUri = fileUris[0];
      const audioPath = audioUri.fsPath;

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Audio Transcriber',
          cancellable: false,
        },
        async (progress) => {
          try {
            progress.report({ message: `Transcribing ${path.basename(audioUri.fsPath)}…` });

            const language = config.get<string>('transcriber.language', '') || undefined;
            const model = config.get<string>('transcriber.model', 'whisper-1');

            const { text, outputPath } = await transcribeAudioFile({
              apiKey: apiKey.trim(),
              audioPath,
              model,
              language,
            });

            progress.report({ message: 'Opening result…', increment: 90 });

            // Show the transcription in a new editor tab
            const doc = await vscode.workspace.openTextDocument({
              language: 'plaintext',
              content: text,
            });
            await vscode.window.showTextDocument(doc);

            vscode.window.showInformationMessage(
              `Transcription complete! Saved to: ${outputPath}`
            );
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`Transcription failed: ${message}`);
          }
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // No resources to release
}
