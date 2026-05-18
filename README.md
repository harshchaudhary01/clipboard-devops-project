# Complete DevOps Project Documentation
## Clipboard File Sharing Application using Jenkins, Docker, AWS ECR, EC2, Prometheus and Grafana

---

# Table of Contents

1. Project Introduction
2. Project Objective
3. Technologies Used
4. Complete Architecture Flow
5. Complete Project Structure
6. Understanding Every Folder and File
7. Backend Application Explanation
8. Understanding server.js Line by Line
9. Understanding package.json
10. Docker Setup
11. Dockerfile Explanation
12. Jenkins CI/CD Pipeline
13. Jenkins Pipeline Stages Explanation
14. AWS ECR Setup
15. EC2 Deployment Process
16. GitHub Webhook Automation
17. Elastic IP Setup
18. Prometheus Monitoring Setup
19. Grafana Dashboard Setup
20. Security Best Practices
21. Common Errors and Solutions
22. Complete Workflow Demonstration
23. Commands Reference
24. Future Improvements
25. Conclusion

---

# 1. Project Introduction

This project is a complete DevOps implementation of a Node.js based Clipboard File Sharing Application.

The application allows users to:

- Upload files
- Share text
- Generate unique codes
- Download shared files
- Store uploaded files inside MongoDB Atlas using GridFS
- Automatically delete expired data using TTL Index

The project is fully integrated with a DevOps pipeline using:

- GitHub
- Jenkins
- Docker
- AWS ECR
- AWS EC2
- Prometheus
- Grafana

Whenever a developer pushes code changes to GitHub, Jenkins automatically triggers the pipeline.

The pipeline performs the following operations:

1. Pull latest code from GitHub
2. Build Docker image
3. Push Docker image to AWS ECR
4. Pull updated image on EC2
5. Deploy updated container automatically
6. Monitor application using Prometheus and Grafana

---

# 2. Project Objective

The main objective of this project is to demonstrate a complete CI/CD (Continuous Integration and Continuous Deployment) pipeline using DevOps tools.

This project helps understand:

- Real-world DevOps workflow
- Docker containerization
- Automated deployment pipeline
- Cloud deployment using AWS
- Monitoring and visualization
- Secure credential handling
- Infrastructure automation concepts

---

# 3. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | Backend Runtime Environment |
| Express.js | Backend Web Framework |
| MongoDB Atlas | Cloud Database |
| GridFS | File Storage in MongoDB |
| Docker | Containerization |
| Jenkins | CI/CD Automation |
| GitHub | Source Code Management |
| AWS EC2 | Virtual Server Hosting |
| AWS ECR | Docker Image Registry |
| Prometheus | Monitoring Tool |
| Grafana | Visualization Dashboard |
| Elastic IP | Static Public IP |

---

# 4. Complete Architecture Flow

```text
Developer Changes Code
            ↓
Push Code to GitHub
            ↓
GitHub Webhook Trigger
            ↓
Jenkins Pipeline Starts
            ↓
Git Checkout
            ↓
Docker Image Build
            ↓
Push Docker Image to AWS ECR
            ↓
EC2 Pulls Latest Image
            ↓
Container Deployment
            ↓
Application Goes Live
            ↓
Prometheus Monitors Metrics
            ↓
Grafana Displays Dashboard
```

---

# 5. Complete Project Structure

```text
clipboard-devops-project/
│
├── app/
│   ├── public/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── jenkins/
│   └── Jenkinsfile
│
├── monitoring/
│   └── prometheus.yml
│
├── README.md
└── .gitignore
```

---

# 6. Understanding Every Folder and File

## app/

This folder contains the complete backend application.

---

## public/

This folder contains frontend static files.

### index.html

Main webpage shown to users.

### script.js

Contains frontend JavaScript logic.

### style.css

Contains styling and design.

---

## server.js

Main backend server file.

Responsibilities:

- Create Express server
- Connect MongoDB Atlas
- Upload files
- Download files
- Generate unique codes
- Delete expired data
- Serve frontend files

---

## package.json

Contains:

- Project metadata
- Dependencies
- Start commands

---

## Dockerfile

Contains instructions for building Docker image.

---

## Jenkinsfile

Contains complete CI/CD pipeline stages.

---

## prometheus.yml

Contains Prometheus monitoring configuration.

---

# 7. Backend Application Explanation

The backend application is built using Node.js and Express.js.

Main features:

- File upload
- File download
- Text sharing
- Temporary sharing system
- Auto expiration system
- MongoDB GridFS storage
- REST API endpoints

The application runs on:

```text
Port 3000
```

---

# 8. Understanding server.js Line by Line

## Importing Required Modules

```javascript
require('dotenv').config();
```

Explanation:

Loads environment variables from .env file.

Used for:

- MongoDB URI
- Port
- Secret values

Why important:

Sensitive data should never be hardcoded.

---

```javascript
const express = require('express');
```

Imports Express framework.

Express is used to:

- Create APIs
- Handle routes
- Start backend server

---

```javascript
const multer = require('multer');
```

Multer is used for file uploading.

Without Multer:

- File upload handling becomes difficult.

---

```javascript
const cors = require('cors');
```

Allows frontend and backend communication from different origins.

Without CORS:

Browser blocks requests.

---

```javascript
const path = require('path');
```

Used for working with file and folder paths.

---

```javascript
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
```

MongoDB classes used for:

- Database connection
- File storage
- File retrieval

---

## Creating Express App

```javascript
const app = express();
```

Creates Express application instance.

---

## Middleware Setup

```javascript
app.use(cors());
app.use(express.json());
```

Explanation:

- cors() enables cross-origin requests
- express.json() parses JSON body data

---

## MongoDB URI

```javascript
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
```

Reads MongoDB URI from environment variables.

This is important because:

- credentials remain secure
- secrets are not exposed publicly

---

## MongoDB Connection

```javascript
const client = new MongoClient(mongoUri);
```

Creates MongoDB client object.

---

## GridFSBucket

```javascript
bucket = new GridFSBucket(db, { bucketName: 'uploads' });
```

GridFS is used to store files inside MongoDB.

Why GridFS:

MongoDB documents have size limitations.

GridFS splits large files into chunks.

---

## TTL Index

```javascript
await metadataCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 600 });
```

Creates automatic deletion mechanism.

Explanation:

- Data automatically deletes after expiration time
- No manual cleanup required

This improves:

- storage optimization
- temporary file management

---

## Static Frontend Files

```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

Serves HTML, CSS and JavaScript files.

---

## Multer Memory Storage

```javascript
const storage = multer.memoryStorage();
```

Stores uploaded files temporarily in memory.

No physical file storage on disk.

---

## Generate Unique Code

```javascript
async function generateUniqueCode()
```

Generates unique 4-digit code.

Purpose:

- users can retrieve uploaded files using code

---

## API: Upload Files

```javascript
app.post('/api/send')
```

Responsible for:

- file uploads
- text uploads
- metadata storage

---

## API: Receive Files

```javascript
app.get('/api/receive/:code')
```

Retrieves files using unique code.

---

## API: Download File

```javascript
app.get('/api/file/:id')
```

Downloads files from GridFS.

---

## Start Server

```javascript
app.listen(PORT)
```

Starts backend server on:

```text
Port 3000
```

---

# 9. Understanding package.json

```json
"scripts": {
  "start": "node server.js"
}
```

Explanation:

Defines command used to start application.

---

## Dependencies Explanation

| Dependency | Purpose |
|---|---|
| express | Backend framework |
| mongodb | MongoDB driver |
| multer | File uploads |
| dotenv | Environment variables |
| cors | Cross-origin support |
| morgan | Logging |
| compression | Response compression |
| express-rate-limit | API protection |

---

# 10. Docker Setup

## Objective of Docker

Docker is used to containerize the application.

Benefits:

- Same environment everywhere
- Easy deployment
- Faster setup
- Portability
- Isolation

---

# Dockerfile

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

# Dockerfile Explanation

## FROM node:18

Uses official Node.js image.

---

## WORKDIR /app

Creates working directory inside container.

---

## COPY package*.json ./

Copies package files.

Why first:

Improves Docker layer caching.

---

## RUN npm install

Installs dependencies.

---

## COPY . .

Copies complete application code.

---

## EXPOSE 3000

Documents application port.

---

## CMD ["npm", "start"]

Starts backend server.

---

# 11. Jenkins CI/CD Pipeline

## What is CI/CD?

CI = Continuous Integration

Automatically integrate new code changes.

CD = Continuous Deployment

Automatically deploy updated application.

---

# Jenkins Pipeline Flow

```text
GitHub Push
    ↓
Webhook Trigger
    ↓
Jenkins Build
    ↓
Docker Build
    ↓
Push to ECR
    ↓
Deploy on EC2
```

---

# Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "YOUR_AWS_ACCOUNT_ID"
        AWS_REGION = "ap-south-1"
        ECR_REPO = "clipboard-devops"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Git Checkout') {
            steps {
                git branch: 'main',
                url: 'YOUR_GITHUB_REPO_URL'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $ECR_REPO:$IMAGE_TAG ./app
                '''
            }
        }

        stage('Configure AWS Credentials') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']
                ]) {
                    sh 'aws sts get-caller-identity'
                }
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']
                ]) {
                    sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS \
                    --password-stdin \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                docker tag $ECR_REPO:$IMAGE_TAG \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']
                ]) {
                    sh '''
                    docker push \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy Container on EC2') {
            steps {
                withCredentials([
                    string(credentialsId: 'mongo-uri', variable: 'MONGO_URI'),
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds']
                ]) {

                    sh '''
                    docker rm -f clipboard-container || true

                    docker pull \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG

                    docker run -d \
                    --name clipboard-container \
                    -p 3000:3000 \
                    -e MONGODB_URI=$MONGO_URI \
                    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }

        failure {
            echo 'Pipeline Failed!'
        }
    }
}
```

---

# 12. Jenkins Pipeline Stages Explanation

## Stage 1: Git Checkout

Pulls latest source code from GitHub repository.

---

## Stage 2: Build Docker Image

Builds Docker image from Dockerfile.

---

## Stage 3: Configure AWS Credentials

Verifies AWS credentials.

---

## Stage 4: Login to AWS ECR

Authenticates Docker with AWS ECR.

---

## Stage 5: Tag Docker Image

Adds ECR repository tag to image.

---

## Stage 6: Push Docker Image to ECR

Uploads image to AWS ECR repository.

---

## Stage 7: Deploy Container on EC2

Removes old container and deploys updated container.

---

# 13. AWS ECR Setup

## What is ECR?

Amazon Elastic Container Registry.

Purpose:

- Stores Docker images securely.
- Acts as cloud Docker registry.

---

## Create ECR Repository

```bash
aws ecr create-repository --repository-name clipboard-devops --region ap-south-1
```

---

# 14. EC2 Deployment Process

## Why EC2?

EC2 is used as cloud virtual machine.

Purpose:

- Host Jenkins
- Run Docker containers
- Deploy application

---

## Run Container

```bash
docker run -d \
--name clipboard-container \
-p 3000:3000 \
-e MONGODB_URI=YOUR_MONGODB_URI \
IMAGE_NAME
```

---

# 15. GitHub Webhook Automation

## Purpose

Automatically trigger Jenkins pipeline whenever code is pushed.

---

## Webhook Flow

```text
Git Push
   ↓
GitHub Webhook
   ↓
Jenkins Trigger
```

---

## Webhook URL

```text
http://YOUR_ELASTIC_IP:8080/github-webhook/
```

---

# 16. Elastic IP Setup

## Why Elastic IP?

Without Elastic IP:

- Public IP changes after restart.

With Elastic IP:

- Permanent public IP remains same.

Benefits:

- Stable Jenkins URL
- Stable website URL
- Stable webhook URL

---

# 17. Prometheus Monitoring Setup

## What is Prometheus?

Prometheus is a monitoring and metrics collection tool.

Purpose:

- Collect application metrics
- Monitor server performance
- Store time-series data

---

# Prometheus Configuration

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
```

---

## Run Prometheus Container

```bash
docker run -d \
--name prometheus \
-p 9090:9090 \
-v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
prom/prometheus
```

---

# 18. Grafana Dashboard Setup

## What is Grafana?

Grafana is a visualization tool.

Purpose:

- Display graphs
- Create dashboards
- Visualize metrics

---

## Run Grafana Container

```bash
docker run -d \
--name grafana \
-p 3001:3000 \
grafana/grafana
```

---

## Default Login

```text
Username: admin
Password: admin
```

---

# 19. Security Best Practices

## Never Push Secrets to GitHub

Do not push:

- AWS Access Keys
- MongoDB URI
- Passwords
- Tokens

---

## Use Jenkins Credentials

Store secrets inside Jenkins credentials manager.

Benefits:

- Secure storage
- Hidden values
- Better security

---

## Use Environment Variables

Avoid hardcoding secrets.

---

# 20. Common Errors and Solutions

## Jenkins GPG Error

Error:

```text
NO_PUBKEY
```

Solution:

Use direct Jenkins .deb installation.

---

## Docker Permission Denied

Solution:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

## Container Already Exists

Solution:

```bash
docker rm -f container-name
```

---

## Port Already In Use

Solution:

```bash
docker ps
```

Stop conflicting container.

---

## GitHub Webhook Not Triggering

Check:

- Jenkins URL
- Security group
- Webhook URL
- GitHub delivery logs

---

# 21. Complete Workflow Demonstration

## Step 1

Developer changes source code.

---

## Step 2

Push updated code:

```bash
git add .
git commit -m "updated code"
git push origin main
```

---

## Step 3

GitHub webhook triggers Jenkins automatically.

---

## Step 4

Jenkins pipeline starts.

---

## Step 5

Docker image builds.

---

## Step 6

Docker image pushes to ECR.

---

## Step 7

EC2 deploys latest container.

---

## Step 8

Website updates automatically.

---

## Step 9

Prometheus collects metrics.

---

## Step 10

Grafana displays dashboards.

---

# 22. Commands Reference

## Docker Commands

### Build Image

```bash
docker build -t image-name .
```

### Run Container

```bash
docker run -d -p 3000:3000 image-name
```

### List Containers

```bash
docker ps
```

### Stop Container

```bash
docker stop container-id
```

### Remove Container

```bash
docker rm -f container-id
```

---

## Jenkins Commands

### Check Status

```bash
sudo systemctl status jenkins
```

### Restart Jenkins

```bash
sudo systemctl restart jenkins
```

---

## AWS Commands

### Configure AWS CLI

```bash
aws configure
```

### Create ECR Repository

```bash
aws ecr create-repository --repository-name clipboard-devops
```

---

# 23. Future Improvements

Possible future enhancements:

- Kubernetes deployment
- Terraform automation
- SonarQube integration
- Trivy security scanning
- HTTPS setup
- NGINX reverse proxy
- Auto scaling
- Load balancer
- Multi-stage Docker builds
- CI/CD notifications

---

# 24. Conclusion

This project demonstrates a complete DevOps CI/CD workflow using modern cloud and automation tools.

The project successfully implements:

- Source code management
- Docker containerization
- Automated CI/CD pipeline
- Cloud deployment
- Monitoring and visualization
- Secure credential management

The pipeline enables developers to deploy application updates automatically with minimal manual intervention.

This project also provides hands-on understanding of:

- Jenkins automation
- AWS cloud services
- Docker container lifecycle
- Monitoring systems
- DevOps best practices

---

# Final Project URLs

## Jenkins Dashboard

```text
http://YOUR_ELASTIC_IP:8080
```

---

## Application URL

```text
http://YOUR_ELASTIC_IP:3000
```

---

## Prometheus Dashboard

```text
http://YOUR_ELASTIC_IP:9090
```

---

## Grafana Dashboard

```text
http://YOUR_ELASTIC_IP:3001
```

---

# End of Documentation

