const fs = require('fs/promises');
const path = require('path');
const toml = require('@iarna/toml');

/**
 * Utility function to pause execution for a specified time
 * @param {number} ms - Time to sleep in milliseconds
 * @returns {Promise} Promise that resolves after the specified time
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let appUserDataDir = '';
function getAppUserDataDir() {
    return appUserDataDir;
}
function setAppUserDataDir(dir) {
    appUserDataDir = dir;
}

function generateFilename(prefix = 'speech') {
    const now = new Date();

    // Format: YYMMDD-HHMMSS
    const year = now.getFullYear().toString().slice(-2); // last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const timestamp = `${year}${month}${day}-${hours}${minutes}${seconds}`;
    return `${prefix}_${timestamp}.wav`;
}

async function loadConfig() {
    try {
        // Load base config
        const configPath = path.join(__dirname, 'config.toml');
        const configFile = await fs.readFile(configPath, 'utf8');
        const config = toml.parse(configFile);
        return config;
    } catch (err) {
        console.error('Error loading config:', err);
    }
}

// Read and parse the TOML file
async function updateConfig(config) {
    try {
        // Convert back to TOML format
        const updatedToml = toml.stringify(config);
        const configPath = path.join(__dirname, 'config.toml');
        // Write the updated content back to the file
        await fs.writeFile(configPath, updatedToml, 'utf8');
        return config;
    } catch (err) {
        console.error('Error updating TOML file:', err);
    }
}

module.exports = {
    sleep,
    getAppUserDataDir,
    setAppUserDataDir,
    generateFilename,
    loadConfig,
    updateConfig
};