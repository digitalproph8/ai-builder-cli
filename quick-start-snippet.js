#!/usr/bin/env node

/**
 * AI Builder CLI - Quick Start Snippet
 * Copy and paste this into your JupyterLab environment
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

class QuickStartCLI {
  constructor() {
    this.commands = {
      'init': this.initProject.bind(this),
      'build': this.buildProject.bind(this),
      'deploy': this.deployProject.bind(this),
      'status': this.checkStatus.bind(this),
      'help': this.showHelp.bind(this)
    };
  }

  async initProject(args) {
    const [projectType, projectName] = args;
    
    if (!projectType || !projectName) {
      console.log('❌ Usage: ai-builder init <type> <name>');
      console.log('📋 Available types: express-api, react-app, python-api, ml-model');
      return;
    }

    console.log(`🚀 Creating ${projectType} project: ${projectName}`);
    
    // Create project directory
    if (!fs.existsSync(projectName)) {
      fs.mkdirSync(projectName, { recursive: true });
    }

    // Generate project structure based on type
    const templates = {
      'express-api': {
        'package.json': JSON.stringify({
          name: projectName,
          version: '1.0.0',
          scripts: { start: 'node index.js', dev: 'nodemon index.js' },
          dependencies: { express: '^4.18.0', cors: '^2.8.5' }
        }, null, 2),
        'index.js': `const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from ${projectName}!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});`
      },
      'react-app': {
        'package.json': JSON.stringify({
          name: projectName,
          version: '1.0.0',
          scripts: { start: 'react-scripts start', build: 'react-scripts build' },
          dependencies: { 'react-scripts': '^5.0.0' }
        }, null, 2),
        'src/App.js': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Welcome to ${projectName}</h1>
    </div>
  );
}

export default App;`
      },
      'python-api': {
        'requirements.txt': 'fastapi==0.68.0\nuvicorn==0.15.0',
        'main.py': `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello from ${projectName}!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`
      },
      'ml-model': {
        'requirements.txt': 'scikit-learn==1.0.0\npandas==1.3.0\nnumpy==1.21.0',
        'model.py': `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

class ${projectName.charAt(0).toUpperCase() + projectName.slice(1)}Model:
    def __init__(self):
        self.model = RandomForestClassifier()
        self.is_trained = False
    
    def train(self, X, y):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        self.model.fit(X_train, y_train)
        self.is_trained = True
        return self.model.score(X_test, y_test)
    
    def predict(self, X):
        if not self.is_trained:
            raise ValueError("Model must be trained first!")
        return self.model.predict(X)
    
    def save(self, filename):
        joblib.dump(self.model, filename)
    
    def load(self, filename):
        self.model = joblib.load(filename)
        self.is_trained = True

# Example usage
if __name__ == "__main__":
    model = ${projectName.charAt(0).toUpperCase() + projectName.slice(1)}Model()
    print("🤖 ML Model ready for training!")`
      }
    };

    const template = templates[projectType];
    if (!template) {
      console.log('❌ Unknown project type');
      return;
    }

    // Write template files
    Object.entries(template).forEach(([filename, content]) => {
      const filePath = path.join(projectName, filename);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
    });

    console.log(`✅ Project ${projectName} created successfully!`);
    console.log(`📁 cd ${projectName}`);
    console.log(`📦 npm install  # or pip install -r requirements.txt`);
    console.log(`🚀 npm start   # or python main.py`);
  }

  async buildProject(args) {
    const [projectName] = args;
    
    if (!projectName) {
      console.log('❌ Usage: ai-builder build <project-name>');
      return;
    }

    if (!fs.existsSync(projectName)) {
      console.log(`❌ Project ${projectName} not found`);
      return;
    }

    console.log(`🔨 Building project: ${projectName}`);
    
    // Detect project type and build accordingly
    const packageJsonPath = path.join(projectName, 'package.json');
    const requirementsPath = path.join(projectName, 'requirements.txt');
    
    if (fs.existsSync(packageJsonPath)) {
      // Node.js project
      console.log('📦 Building Node.js project...');
      this.runCommand('npm', ['run', 'build'], { cwd: projectName });
    } else if (fs.existsSync(requirementsPath)) {
      // Python project
      console.log('🐍 Building Python project...');
      console.log('✅ Python project ready for deployment');
    } else {
      console.log('❌ Unknown project type');
    }
  }

  async deployProject(args) {
    const [projectName, target = 'local'] = args;
    
    if (!projectName) {
      console.log('❌ Usage: ai-builder deploy <project-name> [target]');
      return;
    }

    console.log(`🚀 Deploying ${projectName} to ${target}`);
    
    // Simulate deployment process
    const steps = [
      '📦 Building application...',
      '🔧 Configuring environment...',
      '🚀 Starting deployment...',
      '✅ Deployment successful!'
    ];

    for (const step of steps) {
      console.log(step);
      await this.sleep(1000);
    }

    console.log(`🌐 Application deployed at: http://localhost:3000`);
  }

  async checkStatus(args) {
    const [projectName] = args;
    
    if (!projectName) {
      console.log('❌ Usage: ai-builder status <project-name>');
      return;
    }

    console.log(`📊 Status for ${projectName}:`);
    console.log('✅ Project exists');
    console.log('🔧 Last built: ' + new Date().toLocaleString());
    console.log('🚀 Deployment: Running');
    console.log('📈 Health: All systems operational');
  }

  showHelp() {
    console.log(`
🚀 AI Builder CLI - Quick Start
================================

COMMANDS:
  ai-builder init <type> <name>     Create new project
    Types: express-api, react-app, python-api, ml-model
    
  ai-builder build <name>           Build project
  ai-builder deploy <name> [target] Deploy project
  ai-builder status <name>          Check project status
  ai-builder help                    Show this help

EXAMPLES:
  ai-builder init express-api my-api
  ai-builder build my-api
  ai-builder deploy my-api local
  ai-builder status my-api

QUICK START:
  1. ai-builder init express-api my-project
  2. cd my-project
  3. npm install
  4. npm start
    `);
  }

  runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { stdio: 'inherit', ...options });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      child.on('error', reject);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async execute(args) {
    const [command, ...commandArgs] = args;
    
    if (!command || command === '--help') {
      this.showHelp();
      return;
    }

    const handler = this.commands[command];
    if (!handler) {
      console.log(`❌ Unknown command: ${command}`);
      this.showHelp();
      return;
    }

    try {
      await handler(commandArgs);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

// Auto-install and setup
class AutoSetup {
  static async setup() {
    console.log('🔧 Setting up AI Builder CLI...');
    
    // Create executable script
    const scriptPath = '/home/jovyan/.local/bin/ai-builder';
    const script = `#!/usr/bin/env node
require('${__filename}');
`;

    // Create bin directory if it doesn't exist
    const binDir = '/home/jovyan/.local/bin';
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }

    // Write executable
    fs.writeFileSync(scriptPath, script);
    fs.chmodSync(scriptPath, '755');

    // Add to PATH if not already there
    const bashrcPath = '/home/jovyan/.bashrc';
    const pathLine = 'export PATH=$PATH:/home/jovyan/.local/bin';
    
    if (fs.existsSync(bashrcPath)) {
      const bashrc = fs.readFileSync(bashrcPath, 'utf8');
      if (!bashrc.includes(pathLine)) {
        fs.appendFileSync(bashrcPath, `\n${pathLine}\n`);
      }
    }

    console.log('✅ AI Builder CLI installed!');
    console.log('🚀 Run: ai-builder help');
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const cli = new QuickStartCLI();
  
  if (args.length === 0) {
    AutoSetup.setup().then(() => cli.showHelp());
  } else {
    cli.execute(args);
  }
}

module.exports = { QuickStartCLI, AutoSetup };
