import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';

export const SUPPORTED_AUDIO_EXTENSIONS = ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'webm'] as const;

export interface TranscribeOptions {
  apiKey: string;
  audioPath: string;
  model: string;
  language?: string;
}

export interface TranscribeResult {
  text: string;
  outputPath: string;
}

/**
 * Transcribes an audio file using the OpenAI Whisper API and saves the result
 * as a .txt file in the same directory as the audio file.
 */
export async function transcribeAudioFile(
  options: TranscribeOptions
): Promise<TranscribeResult> {
  const { apiKey, audioPath, model, language } = options;

  // Validate the file exists
  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio file not found: ${audioPath}`);
  }

  const ext = path.extname(audioPath).toLowerCase().replace('.', '');
  if (!SUPPORTED_AUDIO_EXTENSIONS.includes(ext as typeof SUPPORTED_AUDIO_EXTENSIONS[number])) {
    throw new Error(
      `Unsupported audio format: .${ext}. Supported formats: ${SUPPORTED_AUDIO_EXTENSIONS.join(', ')}`
    );
  }

  const client = new OpenAI({ apiKey });

  const fileStream = fs.createReadStream(audioPath);

  const transcriptionParams: OpenAI.Audio.TranscriptionCreateParamsNonStreaming = {
    file: fileStream,
    model,
    response_format: 'text',
  };

  if (language && language.trim() !== '') {
    transcriptionParams.language = language.trim();
  }

  const transcription = await client.audio.transcriptions.create(transcriptionParams);

  // The response is plain text when response_format is 'text'
  const text = typeof transcription === 'string' ? transcription : (transcription as { text: string }).text;

  // Save the result next to the audio file
  const baseName = path.basename(audioPath, path.extname(audioPath));
  const outputPath = path.join(path.dirname(audioPath), `${baseName}.txt`);
  fs.writeFileSync(outputPath, text, 'utf8');

  return { text, outputPath };
}
