# RHODS Integration Guide

## 🚀 AI Builder CLI - Red Hat OpenShift Data Science Integration

Complete RHODS integration with automated pipelines, model deployment, and cluster automation using your credentials:

**Dashboard**: https://rhods-dashboard-redhat-ods-applications.apps.rm3.7wse.p1.openshiftapps.com/
**Inference**: https://digitalproph8-dev-digitalproph8-dev.apps.rm3.7wse.p1.openshiftapps.com/v2/models/digitalproph8-dev/infer
**Credentials**: superadmin / s)g_U+l|o{u@bzo2i081oe!

## 🎯 Quick Setup

### 1. Clone and Setup
```bash
cd /home/jovyan/work
git clone https://github.com/digitalproph8/ai-builder-cli.git
cd ai-builder-cli
```

### 2. Initialize RHODS
```bash
node rhods-integration.js auth
node rhods-integration.js setup-cluster
```

## 📋 Available Commands

### Authentication & Setup
```bash
# Authenticate with RHODS dashboard
node rhods-integration.js auth

# Setup complete cluster automation
node rhods-integration.js setup-cluster
```

### Pipeline Management
```bash
# Create data science pipeline
node rhods-integration.js create-pipeline ml-pipeline

# Create automated pipeline with scheduling
node rhods-integration.js create-automated daily-ml-pipeline

# List all pipelines
node rhods-integration.js list-pipelines
```

### Model Deployment
```bash
# Deploy model to RHODS
node rhods-integration.js deploy-model my-model tensorflow

# Deploy with different framework
node rhods-integration.js deploy-model my-api python

# List deployed models
node rhods-integration.js list-models

# Check model status
node rhods-integration.js status my-model
```

### Model Inference
```bash
# Run inference with text
node rhods-integration.js infer my-model "Hello, world!"

# Run inference with JSON data
node rhods-integration.js infer my-model '{"prompt": "Explain AI", "max_tokens": 100}'

# Run inference with structured data
node rhods-integration.js infer my-model '{"data": [1, 2, 3, 4, 5]}'
```

## 🔧 Features

### 🤖 Automated Pipeline Creation
- **Multi-stage pipelines** - Data preprocessing → Training → Evaluation → Deployment
- **Scheduled execution** - Daily, weekly, or custom cron schedules
- **Trigger-based** - Webhook, data changes, or manual triggers
- **Resource management** - CPU, memory, and GPU allocation
- **Monitoring** - Real-time pipeline status and health checks

### 🚀 Model Deployment
- **Multiple frameworks** - TensorFlow, PyTorch, Scikit-learn, XGBoost
- **Auto-scaling** - Horizontal pod autoscaling based on load
- **Health monitoring** - Automatic health checks and recovery
- **Version management** - Multiple model versions and A/B testing
- **Endpoint management** - Automatic inference endpoint creation

### 📊 Cluster Automation
- **Resource provisioning** - Automatic CPU/memory allocation
- **Namespace management** - Isolated environments per project
- **Security policies** - RBAC and network policies
- **Backup automation** - Automated model and data backups
- **Notification system** - Email/Slack alerts for pipeline events

## 🎯 Complete Workflow Examples

### Example 1: ML Pipeline Automation
```bash
# 1. Authenticate and setup
node rhods-integration.js auth
node rhods-integration.js setup-cluster

# 2. Create automated ML pipeline
node rhods-integration.js create-automated daily-ml-pipeline

# 3. Deploy model
node rhods-integration.js deploy-model sentiment-analysis tensorflow

# 4. Run inference
node rhods-integration.js infer sentiment-analysis "This product is amazing!"

# 5. Monitor status
node rhods-integration.js status sentiment-analysis
```

### Example 2: Batch Model Deployment
```bash
# Deploy multiple models
node rhods-integration.js deploy-model text-classifier tensorflow
node rhods-integration.js deploy-model image-recognizer pytorch
node rhods-integration.js deploy-model recommendation-engine python

# List all models
node rhods-integration.js list-models

# Run batch inference
node rhods-integration.js infer text-classifier '{"text": "Sample text for classification"}'
node rhods-integration.js infer image-recognizer '{"image_url": "https://example.com/image.jpg"}'
```

### Example 3: Scheduled Pipeline
```bash
# Create pipeline that runs daily at 2 AM
node rhods-integration.js create-automated nightly-retraining

# Create pipeline that runs every Sunday
node rhods-integration.js create-automated weekly-validation

# Check pipeline status
node rhods-integration.js status nightly-retraining
```

## 🏗️ Pipeline Architecture

### Automated ML Pipeline Stages
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Data Collection │ →  │ Data Preprocessing│ →  │ Feature Engineering│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓                        ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Model Training  │ →  │ Model Validation │ →  │ Model Deployment │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓                        ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Monitoring      │ →  │ A/B Testing      │ →  │ Model Retraining │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Model Deployment Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Model Registry  │ →  │ Deployment Pod  │ →  │ Inference API   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ↓                        ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Load Balancer   │ →  │ Autoscaler       │ →  │ Health Monitor  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Advanced Configuration

### Custom Pipeline Configuration
```javascript
// Create custom pipeline with specific stages
const customPipeline = {
  name: 'custom-ml-pipeline',
  stages: [
    {
      name: 'data-ingestion',
      type: 'data-source',
      source: 's3://my-bucket/data/',
      schedule: '0 */6 * * *' // Every 6 hours
    },
    {
      name: 'feature-engineering',
      type: 'transformation',
      notebook_path: '/notebooks/features.ipynb',
      parameters: {
        feature_selection: true,
        scaling_method: 'standard'
      }
    },
    {
      name: 'model-training',
      type: 'training',
      framework: 'tensorflow',
      parameters: {
        epochs: 50,
        batch_size: 64,
        learning_rate: 0.001
      }
    },
    {
      name: 'model-deployment',
      type: 'deployment',
      deployment_config: {
        replicas: 2,
        memory: '4Gi',
        cpu: '2'
      }
    }
  ],
  triggers: ['schedule', 'webhook'],
  schedule: '0 2 * * *', // Daily at 2 AM
  notifications: {
    on_success: ['email'],
    on_failure: ['email', 'slack']
  }
};
```

### Model Deployment with Scaling
```javascript
// Deploy model with auto-scaling
const deploymentConfig = {
  name: 'production-model',
  framework: 'tensorflow',
  model_path: '/models/model.h5',
  scaling: {
    replicas: 2,
    min_replicas: 1,
    max_replicas: 10,
    target_cpu_utilization: 70,
    target_memory_utilization: 80
  },
  resources: {
    requests: {
      cpu: '1',
      memory: '2Gi'
    },
    limits: {
      cpu: '4',
      memory: '8Gi'
    }
  },
  environment: {
    MODEL_VERSION: 'v1.0.0',
    LOG_LEVEL: 'INFO',
    BATCH_SIZE: '32'
  }
};
```

## 📊 Monitoring and Observability

### Pipeline Monitoring
```bash
# Check all pipeline statuses
node rhods-integration.js list-pipelines

# Check specific pipeline
node rhods-integration.js status daily-ml-pipeline

# Monitor pipeline execution
node rhods-integration.js status pipeline-execution-id-123
```

### Model Monitoring
```bash
# List all deployed models
node rhods-integration.js list-models

# Check model health
node rhods-integration.js status my-model

# Monitor inference performance
node rhods-integration.js infer my-model '{"monitor": true}'
```

## 🔐 Security and Access Control

### Built-in Security Features
- ✅ **Authentication** - Auto-configured with your RHODS credentials
- ✅ **Authorization** - Role-based access control (RBAC)
- ✅ **Network Policies** - Isolated network segments
- ✅ **Secret Management** - Encrypted credential storage
- ✅ **Audit Logging** - Complete audit trail

### Access Control Setup
```bash
# The CLI automatically uses your credentials:
# Username: superadmin
# Password: s)g_U+l|o{u@bzo2i081oe!
# Dashboard: https://rhods-dashboard-redhat-ods-applications.apps.rm3.7wse.p1.openshiftapps.com/
```

## 🚀 Integration with JupyterLab

### Use in JupyterLab Notebooks
```python
import subprocess
import json

# Deploy model from notebook
result = subprocess.run([
    'node', 'rhods-integration.js', 
    'deploy-model', 'notebook-model', 'tensorflow'
], capture_output=True, text=True)
print(result.stdout)

# Run inference
inference_result = subprocess.run([
    'node', 'rhods-integration.js',
    'infer', 'notebook-model', 
    '{"prompt": "Analyze this data"}'
], capture_output=True, text=True)
print(inference_result.stdout)

# Create automated pipeline
pipeline_result = subprocess.run([
    'node', 'rhods-integration.js',
    'create-automated', 'notebook-pipeline'
], capture_output=True, text=True)
print(pipeline_result.stdout)
```

### Monitor from JupyterLab
```python
# Monitor all deployments
models = subprocess.run([
    'node', 'rhods-integration.js', 'list-models'
], capture_output=True, text=True)
print(models.stdout)

# Check pipeline status
pipelines = subprocess.run([
    'node', 'rhods-integration.js', 'list-pipelines'
], capture_output=True, text=True)
print(pipelines.stdout)
```

## 🎯 Production Deployment

### Production Setup Checklist
- [ ] Authenticate with RHODS: `node rhods-integration.js auth`
- [ ] Setup cluster automation: `node rhods-integration.js setup-cluster`
- [ ] Create production pipelines: `node rhods-integration.js create-automated production-pipeline`
- [ ] Deploy models: `node rhods-integration.js deploy-model prod-model`
- [ ] Configure monitoring: `node rhods-integration.js status prod-model`
- [ ] Test inference: `node rhods-integration.js infer prod-model "test data"`

### Production Best Practices
1. **Use automated pipelines** for consistent deployments
2. **Monitor model performance** continuously
3. **Set up alerts** for pipeline failures
4. **Version your models** properly
5. **Test thoroughly** before production deployment

---

**🎉 Your RHODS integration is now complete!** The CLI provides full automation for pipelines, model deployment, and cluster management using your Red Hat OpenShift Data Science platform.
