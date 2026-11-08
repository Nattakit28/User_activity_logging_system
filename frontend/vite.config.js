
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // Local development ใช้ /
  // GitLab Pages ใช้ /task_management_app/
  base: command === 'build'
    ? '/task_management_app/'
    : '/',

  plugins: [react()],
}));
