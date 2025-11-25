#!/usr/bin/env node

/**
 * AI Builder CLI - Auto-Installer Version
 * Automatically detects and installs all dependencies
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class AutoInstaller {
  constructor() {
    this.platform = process.platform;
    this.arch = process.arch;
  }

  // Execute command with promise
  execCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  // Check if command exists
  async commandExists(command) {
    try {
      await this.execCommand(`which ${command}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Download file
  downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      const file = fs.createWriteStream(destination);
      
      protocol.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (error) => {
        fs.unlink(destination, () => reject(error));
      });
    });
  }

  // Install Node.js
  async installNodeJS() {
    console.log('📦 Installing Node.js...');
    
    if (this.platform === 'linux') {
      // Try NVM first
      try {
        console.log('🔄 Installing via NVM...');
        await this.execCommand('curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash');
        
        // Add NVM to current session
        process.env.NVM_DIR = `${process.env.HOME}/.nvm`;
        await this.execCommand(`[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm install 18`);
        
        console.log('✅ Node.js installed via NVM');
      } catch (error) {
        console.log('🔄 NVM failed, trying direct download...');
        
        const nodeUrl = 'https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.xz';
        const homeDir = process.env.HOME;
        const nodePath = path.join(homeDir, 'node-v18.18.0-linux-x64.tar.xz');
        
        await this.downloadFile(nodeUrl, nodePath);
        await this.execCommand(`cd ${homeDir} && tar -xf node-v18.18.0-linux-x64.tar.xz && mv node-v18.18.0-linux-x64 node`);
        
        // Add to PATH
        const bashrcPath = path.join(homeDir, '.bashrc');
        fs.appendFileSync(bashrcPath, '\nexport PATH=~/node/bin:$PATH\n');
        
        console.log('✅ Node.js installed via direct download');
      }
    } else if (this.platform === 'darwin') {
      // macOS
      try {
        await this.execCommand('brew install node');
        console.log('✅ Node.js installed via Homebrew');
      } catch (error) {
        console.log('❌ Homebrew not found, please install Node.js manually from https://nodejs.org');
        process.exit(1);
      }
    } else {
      console.log('❌ Unsupported platform. Please install Node.js from https://nodejs.org');
      process.exit(1);
    }
  }

  // Create package.json
  createPackageJson() {
    const packageJson = {
      name: 'ai-builder-cli',
      version: '1.0.0',
      description: 'AI Builder CLI with auto-deployment, database integration, and chat capabilities',
      main: 'lib/index.js',
      bin: {
        'ai-builder': './bin/ai-builder'
      },
      scripts: {
        start: 'node lib/index.js',
        build: 'tsc',
        dev: 'ts-node src/index.ts',
        test: 'jest',
        'install:all': 'npm install && npm run build',
        setup: 'node setup.js'
      },
      dependencies: {
        'commander': '^9.4.1',
        'inquirer': '^9.1.4',
        'chalk': '^5.2.0',
        'ws': '^8.11.0',
        'crypto': '^1.0.1',
        'fs-extra': '^11.1.0',
        'axios': '^1.3.4'
      },
      devDependencies: {
        'typescript': '^4.9.5',
        '@types/node': '^18.14.6',
        '@types/ws': '^8.5.4',
        '@types/inquirer': '^9.0.3',
        '@types/fs-extra': '^9.0.13',
        'jest': '^29.4.3',
        '@types/jest': '^29.4.0',
        'ts-node': '^10.9.1'
      }
    };

    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('📝 Created package.json');
  }

  // Create tsconfig.json
  createTsConfig() {
    const tsConfig = {
      compilerOptions: {
        target: 'es2020',
        lib: ['es2020'],
        module: 'commonjs',
        declaration: true,
        outDir: './lib',
        rootDir: './src',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        moduleResolution: 'node',
        baseUrl: '.',
        esModuleInterop: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'lib', 'tests']
    };

    fs.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2));
    console.log('📝 Created tsconfig.json');
  }

  // Create executable script
  createExecutable() {
    if (!fs.existsSync('bin')) {
      fs.mkdirSync('bin');
    }

    const script = '#!/usr/bin/env node\nrequire(\'../lib/index.js\');';
    fs.writeFileSync('bin/ai-builder', script);
    
    // Make executable on Unix systems
    if (this.platform !== 'win32') {
      fs.chmodSync('bin/ai-builder', '755');
    }

    console.log('📝 Created executable script');
  }

  // Install dependencies
  async installDependencies() {
    console.log('📦 Installing Node.js dependencies...');
    
    try {
      await this.execCommand('npm install');
      console.log('✅ Node.js dependencies installed');
    } catch (error) {
      console.log('❌ Failed to install Node.js dependencies:', error.message);
      throw error;
    }
  }

  // Build project
  async buildProject() {
    console.log('🔨 Building project...');
    
    try {
      await this.execCommand('npm run build');
      console.log('✅ Project built successfully');
    } catch (error) {
      console.log('❌ Failed to build project:', error.message);
      throw error;
    }
  }

  // Verify installation
  async verifyInstallation() {
    console.log('✅ Verifying installation...');
    
    try {
      const nodeVersion = await this.execCommand('node --version');
      console.log(`✅ Node.js: ${nodeVersion.trim()}`);
    } catch (error) {
      console.log('❌ Node.js not found');
      return false;
    }

    try {
      const npmVersion = await this.execCommand('npm --version');
      console.log(`✅ npm: ${npmVersion.trim()}`);
    } catch (error) {
      console.log('❌ npm not found');
      return false;
    }

    if (fs.existsSync('lib/index.js')) {
      console.log('✅ Project built successfully');
    } else {
      console.log('❌ Project not built');
      return false;
    }

    return true;
  }

  // Main installation process
  async install() {
    console.log('🚀 AI Builder CLI Auto-Installer');
    console.log('==================================');
    console.log('');

    // Check Node.js
    const nodeExists = await this.commandExists('node');
    if (!nodeExists) {
      console.log('❌ Node.js not found, installing...');
      await this.installNodeJS();
    } else {
      const nodeVersion = await this.execCommand('node --version');
      console.log(`✅ Node.js found: ${nodeVersion.trim()}`);
    }

    // Check npm
    const npmExists = await this.commandExists('npm');
    if (!npmExists) {
      console.log('❌ npm not found');
      process.exit(1);
    } else {
      const npmVersion = await this.execCommand('npm --version');
      console.log(`✅ npm found: ${npmVersion.trim()}`);
    }

    // Setup project files
    console.log('🔧 Setting up project files...');
    this.createPackageJson();
    this.createTsConfig();
    this.createExecutable();

    // Install dependencies
    await this.installDependencies();

    // Build project
    await this.buildProject();

    // Verify installation
    const success = await this.verifyInstallation();
    
    if (success) {
      console.log('');
      console.log('🎉 AI Builder CLI installed successfully!');
      console.log('');
      console.log('📋 Available commands:');
      console.log('  npm start          - Run the CLI');
      console.log('  npm run dev        - Run in development mode');
      console.log('  npm test           - Run tests');
      console.log('  npm run build      - Build the project');
      console.log('');
      console.log('🚀 To start the CLI now, run: npm start');
      console.log('');

      // Start CLI automatically
      console.log('🚀 Starting AI Builder CLI...');
      const cli = spawn('npm', ['start'], { stdio: 'inherit' });
      cli.on('error', (error) => {
        console.log('❌ Failed to start CLI:', error.message);
      });
    } else {
      console.log('❌ Installation verification failed');
      process.exit(1);
    }
  }
}

// Run installer
if (require.main === module) {
  const installer = new AutoInstaller();
  installer.install().catch(error => {
    console.log('❌ Installation failed:', error.message);
    process.exit(1);
  });
}

module.exports = AutoInstaller;
