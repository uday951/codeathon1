export const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  error: (message) => {
    console.log(`[ERROR] ${new Date().toISOString()} - ${message}`);
  },
  success: (message) => {
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`);
  }
};