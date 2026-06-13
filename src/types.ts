/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  photoUrl: string;
  email: string;
  age: string;
  gender: string;
  city: string;
  profession: string;
  emotionalGoals: string;
}

export interface EmotionalNote {
  id: string;
  date: string;
  mood: 'feliz' | 'ansioso' | 'triste' | 'com_raiva' | 'sem_energia';
  emotions: string[];
  text: string;
  isFavorite: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface DailyMoodRecord {
  date: string; // YYYY-MM-DD
  happiness: number; // 1-5
  anxiety: number; // 1-5
  sadness: number; // 1-5
  anger: number; // 1-5
  energy: number; // 1-5
}

export interface TherapistAudio {
  id: string;
  title: string;
  category: 'depressao' | 'ansiedade' | 'sono';
  subcategory: string;
  duration: string;
  synthType: 'soundscape_rain' | 'soundscape_forest' | 'soundscape_ocean' | 'guidance_calm' | 'guidance_hope' | 'guidance_crisis';
  description: string;
}

export interface TherapyCategory {
  id: string;
  title: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
    instruction: string;
  }>;
}

export interface ExerciseVideo {
  id: string;
  category: 'respiracao' | 'alongamento' | 'relaxamento' | 'meditacao';
  title: string;
  duration: string;
  description: string;
  thumbnailUrl: string;
  instructionType: 'breath_444' | 'breath_diaphragm' | 'stretch_neck' | 'stretch_shoulders' | 'relax_muscle' | 'meditation_5m' | 'meditation_10m';
}
