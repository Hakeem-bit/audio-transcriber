# Audio Transcriber

A VS Code extension that transcribes audio files to text using OpenAI's Whisper API.

## Features

- 🎙️ Transcribe **MP3, WAV, M4A, OGG, FLAC** audio files to text
- ⚡ Powered by **OpenAI Whisper** — fast and highly accurate
- 📄 Results open automatically in a new VS Code editor tab
- 💾 Transcription saved as a **.txt file** next to your audio file
- 🌍 Optional **language hint** to improve accuracy
- 🔒 Your API key is stored securely in VS Code settings

## Requirements

- Visual Studio Code **1.85** or newer
- An **OpenAI API key** — get one free at <https://platform.openai.com/api-keys>
- Node.js **18+** (for building from source)

## Quick Start

### 1. Install dependencies

```bash
git clone https://github.com/Hakeem-bit/audio-transcriber.git
cd audio-transcriber
npm install
```

### 2. Build the extension

```bash
npm run compile
```

### 3. Launch in VS Code

Open the project in VS Code and press **F5** to start a new Extension Development Host window.

### 4. Configure your API key

In the Extension Development Host window:

1. Open **Settings** (`Ctrl+,` / `Cmd+,`)
2. Search for **`transcriber.apiKey`**
3. Paste your OpenAI API key

### 5. Transcribe an audio file

1. Open the **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type **`Transcribe Audio File`** and press Enter
3. Select an audio file from the file picker
4. Wait for the transcription — a progress notification will appear
5. The transcribed text opens in a new editor tab and is saved as a `.txt` file

## Extension Settings

| Setting | Default | Description |
|---|---|---|
| `transcriber.apiKey` | *(empty)* | Your OpenAI API key (required) |
| `transcriber.model` | `whisper-1` | Whisper model to use |
| `transcriber.language` | *(auto)* | Audio language code, e.g. `en`, `fr`, `es`. Leave blank for auto-detection. |

## Supported Audio Formats

MP3 · WAV · M4A · OGG · FLAC · WebM

## Privacy

Your audio is sent to OpenAI's API for transcription. Please review [OpenAI's privacy policy](https://openai.com/policies/privacy-policy) before transcribing sensitive recordings.

## License

MIT
