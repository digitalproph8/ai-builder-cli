# OpenShift Integration Guide

## 🚀 AI Builder CLI with OpenShift Deployment

I've created a specialized version of the AI Builder CLI that integrates directly with your OpenShift deployment endpoint at:
```
https://deploy-digitalproph8-dev.apps.rm3.7wse.p1.openshiftapps.com/v2/models/deploy/infer
```

## 📋 Quick Setup

### 1. Set Environment Variables
```bash
export OPENSHIFT_TOKEN=your-auth-token
export OPENSHIFT_ENDPOINT=https://deploy-digitalproph8-dev.apps.rm3.7wse.p1.openshiftapps.com
```

### 2. Initialize OpenShift Connection
```bash
node openshift-integration.js init-openshift
```

## 🎯 Available Commands

### Model Deployment
```bash
# Deploy a model to OpenShift
node openshift-integration.js deploy-model my-model ml

# Deploy with specific type
node openshift-integration.js deploy-model my-api api

# List all deployed models
node openshift-integration.js list-models

# Check deployment status
node openshift-integration.js status my-model
```

### Model Inference
```bash
# Run inference with text prompt
node openshift-integration.js infer my-model "Hello, world!"

# Run inference with JSON data
node openshift-integration.js infer my-model '{"prompt": "Explain AI", "max_tokens": 100}'

# Run inference with structured data
node openshift-integration.js infer my-model '{"data": [1, 2, 3, 4, 5]}'
```

## 🔧 Features

### Automatic Model Detection
- ✅ **Framework Detection** - TensorFlow, PyTorch, Scikit-learn
- ✅ **Model File Detection** - .pkl, .joblib, .h5, .pb, .onnx, .pt, .pth
- ✅ **Requirements Parsing** - Auto-reads requirements.txt

### Deployment Management
- ✅ **Real-time Monitoring** - Track deployment progress
- ✅ **Status Tracking** - Check deployment health
- ✅ **Endpoint Management** - Auto-manage inference endpoints

### Inference Capabilities
- ✅ **Multiple Data Types** - Text, JSON, structured data
- ✅ **Error Handling** - Robust error management
- ✅ **Response Parsing** - Clean result formatting

## 📁 Project Structure

### ML Model Project
```
my-model/
├── model.pkl              # Trained model
├── requirements.txt       # Dependencies
├── preprocessing.py      # Data preprocessing
└── openshift-integration.js # CLI tool
```

### API Project
```
my-api/
├── main.py               # FastAPI app
├── requirements.txt      # Dependencies
├── Dockerfile           # Container config
└── openshift-integration.js # CLI tool
```

## 🚀 Usage Examples

### Example 1: Deploy Scikit-learn Model
```bash
# Create model project
mkdir ml-classifier
cd ml-classifier

# Create model
echo "scikit-learn==1.0.0
pandas==1.3.0" > requirements.txt

# Save your model (example)
python -c "
import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression

# Train simple model
X = np.array([[1, 2], [3, 4], [5, 6]])
y = np.array([0, 1, 0])
model = LogisticRegression().fit(X, y)

# Save model
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
"

# Deploy to OpenShift
node openshift-integration.js deploy-model ml-classifier ml

# Run inference
node openshift-integration.js infer ml-classifier '{"data": [[2, 3]]}'
```

### Example 2: Deploy API Service
```bash
# Create API project
mkdir user-api
cd user-api

# Create requirements
echo "fastapi==0.68.0
uvicorn==0.15.0" > requirements.txt

# Create API
cat > main.py << 'EOF'
from fastapi import FastAPI
import json

app = FastAPI()

@app.post("/predict")
async def predict(data: dict):
    # Your prediction logic here
    return {"prediction": "success", "input": data}

@app.get("/health")
async def health():
    return {"status": "healthy"}
EOF

# Deploy to OpenShift
node openshift-integration.js deploy-model user-api api

# Check status
node openshift-integration.js status user-api
```

### Example 3: Batch Inference
```bash
# Deploy model first
node openshift-integration.js deploy-model text-generator ml

# Run multiple inferences
node openshift-integration.js infer text-generator '{"prompt": "Once upon a time"}'
node openshift-integration.js infer text-generator '{"prompt": "The future of AI is"}'
node openshift-integration.js infer text-generator '{"prompt": "Innovation happens when"}'
```

## 🔍 Monitoring

### Check All Deployments
```bash
node openshift-integration.js list-models
```

Output:
```
📋 Deployed Models:
==================
📊 text-generator
   Status: ready
   Endpoint: https://deploy-digitalproph8-dev.apps.rm3.7wse.p1.openshiftapps.com/v2/models/text-generator/infer
   Deployed: 2024-01-15T10:30:00.000Z

📊 user-api
   Status: ready
   Endpoint: https://deploy-digitalproph8-dev.apps.rm3.7wse.p1.openshiftapps.com/v2/models/user-api/infer
   Deployed: 2024-01-15T10:25:00.000Z
```

### Individual Model Status
```bash
node openshift-integration.js status text-generator
```

## 🔧 Advanced Configuration

### Custom Deployment Config
```javascript
// Modify the deployModel method for custom configs
const modelConfig = {
  name: modelName,
  type: modelType,
  framework: this.detectFramework(),
  modelPath: modelFiles[0],
  requirements: this.getRequirements(),
  deployment_config: {
    replicas: 2,        // More replicas for scaling
    memory: "4Gi",      // More memory for large models
    cpu: "2",           # More CPU for faster inference
    gpu: 1              # GPU acceleration (if available)
  }
};
```

### Environment-Specific Configs
```bash
# Development
export OPENSHIFT_ENV=development
export OPENSHIFT_ENDPOINT=https://dev-api.example.com

# Production
export OPENSHIFT_ENV=production
export OPENSHIFT_ENDPOINT=https://prod-api.example.com
```

## 🚀 Integration with JupyterLab

### Use in Notebooks
```python
import subprocess
import json

# Deploy model from notebook
result = subprocess.run([
    'node', 'openshift-integration.js', 
    'deploy-model', 'notebook-model', 'ml'
], capture_output=True, text=True)
print(result.stdout)

# Run inference
inference_result = subprocess.run([
    'node', 'openshift-integration.js',
    'infer', 'notebook-model', 
    '{"prompt": "Analyze this data"}'
], capture_output=True, text=True)
print(inference_result.stdout)
```

### Monitor Deployments
```python
# List all models
models = subprocess.run([
    'node', 'openshift-integration.js', 'list-models'
], capture_output=True, text=True)
print(models.stdout)

# Check specific model
status = subprocess.run([
    'node', 'openshift-integration.js', 'status', 'my-model'
], capture_output=True, text=True)
print(status.stdout)
```

## 🎯 Quick Start Workflow

1. **Initialize**: `node openshift-integration.js init-openshift`
2. **Create Model**: Train and save your model
3. **Deploy**: `node openshift-integration.js deploy-model my-model`
4. **Test**: `node openshift-integration.js infer my-model "test data"`
5. **Monitor**: `node openshift-integration.js status my-model`

---

**🎉 Your OpenShift endpoint is now integrated with the AI Builder CLI!**
