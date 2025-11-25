#!/usr/bin/env node

/**
 * AI Builder CLI - OpenShift Deployment Integration
 * Integrates with OpenShift model deployment endpoints
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { spawn, exec } = require('child_process');

class OpenShiftDeployment {
  constructor(endpoint = 'https://deploy-digitalproph8-dev.apps.rm3.7wse.p1.openshiftapps.com/v2/models/deploy/infer') {
    this.endpoint = endpoint;
    this.deployments = new Map();
  }

  // Deploy model to OpenShift
  async deployModel(modelConfig) {
    const { name, type, framework, modelPath, requirements } = modelConfig;
    
    console.log(`🚀 Deploying ${name} to OpenShift...`);
    
    try {
      // Prepare deployment payload
      const payload = {
        model_name: name,
        model_type: type,
        framework: framework,
        deployment_config: {
          replicas: 1,
          memory: "2Gi",
          cpu: "1"
        },
        requirements: requirements || []
      };

      // Deploy the model
      const response = await this.makeRequest('POST', '/deploy', payload);
      
      if (response.success) {
        this.deployments.set(name, {
          endpoint: response.endpoint,
          status: 'deploying',
          deployed_at: new Date().toISOString()
        });
        
        console.log(`✅ Model ${name} deployment started`);
        console.log(`📍 Endpoint: ${response.endpoint}`);
        
        // Monitor deployment
        return this.monitorDeployment(name);
      } else {
        throw new Error(response.error || 'Deployment failed');
      }
    } catch (error) {
      console.log(`❌ Deployment failed: ${error.message}`);
      throw error;
    }
  }

  // Monitor deployment status
  async monitorDeployment(modelName) {
    console.log(`📊 Monitoring deployment of ${modelName}...`);
    
    const maxAttempts = 30;
    const delay = 5000; // 5 seconds
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const status = await this.getDeploymentStatus(modelName);
        
        if (status.status === 'ready') {
          console.log(`✅ Model ${modelName} is ready!`);
          console.log(`🌐 Inference endpoint: ${status.endpoint}`);
          return status;
        } else if (status.status === 'failed') {
          throw new Error(`Deployment failed: ${status.error}`);
        }
        
        console.log(`⏳ Deployment status: ${status.status} (${attempt}/${maxAttempts})`);
        await this.sleep(delay);
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        await this.sleep(delay);
      }
    }
    
    throw new Error('Deployment timeout');
  }

  // Get deployment status
  async getDeploymentStatus(modelName) {
    try {
      const response = await this.makeRequest('GET', `/status/${modelName}`);
      return response;
    } catch (error) {
      return { status: 'unknown', error: error.message };
    }
  }

  // Run inference on deployed model
  async runInference(modelName, data) {
    console.log(`🔍 Running inference on ${modelName}...`);
    
    try {
      const deployment = this.deployments.get(modelName);
      if (!deployment) {
        throw new Error(`Model ${modelName} not deployed`);
      }

      const payload = {
        model_name: modelName,
        data: data,
        parameters: {
          temperature: 0.7,
          max_tokens: 1000
        }
      };

      const response = await this.makeRequest('POST', '/infer', payload);
      
      console.log(`✅ Inference completed`);
      console.log(`📊 Result: ${JSON.stringify(response.result, null, 2)}`);
      
      return response;
    } catch (error) {
      console.log(`❌ Inference failed: ${error.message}`);
      throw error;
    }
  }

  // Make HTTP request to OpenShift endpoint
  async makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.endpoint);
      const isHttps = url.protocol === 'https:';
      const httpModule = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENSHIFT_TOKEN || ''}`
        }
      };

      const req = httpModule.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
            } else {
              reject(new Error(response.error || `HTTP ${res.statusCode}`));
            }
          } catch (error) {
            reject(new Error(`Invalid response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class AIBuilderCLIWithOpenShift {
  constructor() {
    this.openShift = new OpenShiftDeployment();
    this.commands = {
      'deploy-model': this.deployModel.bind(this),
      'list-models': this.listModels.bind(this),
      'infer': this.runInference.bind(this),
      'status': this.getDeploymentStatus.bind(this),
      'init-openshift': this.initOpenShift.bind(this),
      'help': this.showHelp.bind(this)
    };
  }

  async deployModel(args) {
    const [modelName, modelType = 'ml'] = args;
    
    if (!modelName) {
      console.log('❌ Usage: ai-builder deploy-model <name> [type]');
      return;
    }

    console.log(`🚀 Deploying model: ${modelName}`);
    
    // Detect model files
    const modelFiles = this.detectModelFiles();
    if (modelFiles.length === 0) {
      console.log('❌ No model files found');
      return;
    }

    const modelConfig = {
      name: modelName,
      type: modelType,
      framework: this.detectFramework(),
      modelPath: modelFiles[0],
      requirements: this.getRequirements()
    };

    try {
      await this.openShift.deployModel(modelConfig);
    } catch (error) {
      console.log(`❌ Deployment failed: ${error.message}`);
    }
  }

  async listModels() {
    console.log('📋 Deployed Models:');
    console.log('==================');
    
    const deployments = this.openShift.deployments;
    if (deployments.size === 0) {
      console.log('No models deployed yet');
      return;
    }

    for (const [name, info] of deployments) {
      console.log(`📊 ${name}`);
      console.log(`   Status: ${info.status}`);
      console.log(`   Endpoint: ${info.endpoint}`);
      console.log(`   Deployed: ${info.deployed_at}`);
      console.log('');
    }
  }

  async runInference(args) {
    const [modelName, ...dataArgs] = args;
    
    if (!modelName) {
      console.log('❌ Usage: ai-builder infer <model-name> <data>');
      return;
    }

    const data = this.parseInferenceData(dataArgs);
    
    try {
      await this.openShift.runInference(modelName, data);
    } catch (error) {
      console.log(`❌ Inference failed: ${error.message}`);
    }
  }

  async getDeploymentStatus(args) {
    const [modelName] = args;
    
    if (!modelName) {
      console.log('❌ Usage: ai-builder status <model-name>');
      return;
    }

    try {
      const status = await this.openShift.getDeploymentStatus(modelName);
      console.log(`📊 Status for ${modelName}:`);
      console.log(`   Status: ${status.status}`);
      console.log(`   Endpoint: ${status.endpoint || 'N/A'}`);
      console.log(`   Error: ${status.error || 'None'}`);
    } catch (error) {
      console.log(`❌ Status check failed: ${error.message}`);
    }
  }

  async initOpenShift() {
    console.log('🔧 Initializing OpenShift integration...');
    
    // Check for required environment variables
    if (!process.env.OPENSHIFT_TOKEN) {
      console.log('⚠️  OPENSHIFT_TOKEN not set');
      console.log('📝 Set it with: export OPENSHIFT_TOKEN=your-token');
    }
    
    // Test connection
    try {
      const response = await this.openShift.makeRequest('GET', '/health');
      console.log('✅ OpenShift connection successful');
    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
      console.log('📝 Check your endpoint and token');
    }
  }

  detectModelFiles() {
    const extensions = ['.pkl', '.joblib', '.h5', '.pb', '.onnx', '.pt', '.pth'];
    const files = [];
    
    function scanDirectory(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
    
    scanDirectory('.');
    return files;
  }

  detectFramework() {
    if (fs.existsSync('requirements.txt')) {
      const requirements = fs.readFileSync('requirements.txt', 'utf8');
      if (requirements.includes('tensorflow')) return 'tensorflow';
      if (requirements.includes('pytorch')) return 'pytorch';
      if (requirements.includes('scikit-learn')) return 'sklearn';
    }
    return 'unknown';
  }

  getRequirements() {
    const reqPath = 'requirements.txt';
    if (fs.existsSync(reqPath)) {
      return fs.readFileSync(reqPath, 'utf8').split('\n').filter(line => line.trim());
    }
    return [];
  }

  parseInferenceData(args) {
    if (args.length === 0) {
      return { prompt: 'Hello, world!' };
    }
    
    try {
      return JSON.parse(args.join(' '));
    } catch (error) {
      return { prompt: args.join(' ') };
    }
  }

  showHelp() {
    console.log(`
🚀 AI Builder CLI - OpenShift Integration
==========================================

COMMANDS:
  ai-builder deploy-model <name> [type]    Deploy model to OpenShift
  ai-builder list-models                  List deployed models
  ai-builder infer <model-name> <data>     Run inference
  ai-builder status <model-name>           Check deployment status
  ai-builder init-openshift                 Initialize OpenShift connection
  ai-builder help                           Show this help

EXAMPLES:
  ai-builder init-openshift
  ai-builder deploy-model my-model ml
  ai-builder list-models
  ai-builder infer my-model '{"prompt": "Hello"}'
  ai-builder status my-model

ENVIRONMENT:
  export OPENSHIFT_TOKEN=your-token
  export OPENSHIFT_ENDPOINT=https://deploy-digitalproph8-dev.apps.rm3.7wse.p1.openshiftapps.com

QUICK START:
  1. ai-builder init-openshift
  2. ai-builder deploy-model my-model
  3. ai-builder infer my-model "Hello world"
    `);
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

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const cli = new AIBuilderCLIWithOpenShift();
  cli.execute(args);
}

module.exports = { AIBuilderCLIWithOpenShift, OpenShiftDeployment };
