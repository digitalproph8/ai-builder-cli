#!/usr/bin/env node

/**
 * AI Builder CLI - Main Entry Point
 * Auto-installation and dependency management
 */

const fs = require('fs');
const path = require('path');

class AutoBootstrap {
  constructor() {
    this.projectRoot = __dirname;
    this.requiredFiles = [
      'package.json',
      'tsconfig.json',
      'node_modules'
    ];
  }

  // Check if setup is needed
  needsSetup() {
    return !this.requiredFiles.every(file => 
      fs.existsSync(path.join(this.projectRoot, file))
    );
  }

  // Run setup if needed
  async ensureSetup() {
    if (this.needsSetup()) {
      console.log('🔧 Running initial setup...');
      
      try {
        // Run the setup script
        const { spawn } = require('child_process');
        
        const setup = spawn('node', [path.join(this.projectRoot, 'setup.js')], {
          stdio: 'inherit',
          cwd: this.projectRoot
        });

        return new Promise((resolve, reject) => {
          setup.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Setup failed with code ${code}`));
            }
          });

          setup.on('error', reject);
        });
      } catch (error) {
        console.log('❌ Setup failed:', error.message);
        process.exit(1);
      }
    }
  }

  // Start the CLI
  startCLI() {
    console.log('🚀 Starting AI Builder CLI...');
    
    try {
      // Import and start the CLI
      require('./lib/index.js');
    } catch (error) {
      console.log('❌ Failed to start CLI:', error.message);
      
      if (error.message.includes('Cannot find module')) {
        console.log('🔧 Running setup first...');
        this.ensureSetup().then(() => {
          console.log('🚀 Retrying CLI startup...');
          this.startCLI();
        }).catch(() => {
          console.log('❌ Setup failed. Please run: node setup.js');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    }
  }
}

// Auto-bootstrap and start
const bootstrap = new AutoBootstrap();

if (require.main === module) {
  bootstrap.ensureSetup().then(() => {
    bootstrap.startCLI();
  }).catch(error => {
    console.log('❌ Bootstrap failed:', error.message);
    process.exit(1);
  });
}

module.exports = AutoBootstrap;
