pipeline {
    agent any

    environment {
        SONAR_SCANNER_HOME = tool 'sonar-scanner'
        REPO_URL           = 'https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git'
    }

    stages {
        stage('Fetch Code base') {
            steps {
                // If the repo is private, add: credentialsId: 'github-creds'
                git branch: 'main', url: "${env.REPO_URL}"
            }
        }

        stage('SonarQube Static Analysis Code Scan') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh """
                    ${env.SONAR_SCANNER_HOME}/bin/sonar-scanner \
                      -Dsonar.projectKey=majisa-garage-app \
                      -Dsonar.projectName=majisa-garage-app \
                      -Dsonar.sources=. \
                      -Dsonar.exclusions=**/node_modules/**,**/dist/** \
                      -Dsonar.javascript.node.maxspace=2048
                    """
                }
            }
        }

        stage('Quality Gate Checklist') {
            options {
                timeout(time: 5, unit: 'MINUTES')
            }
            steps {
                waitForQualityGate abortPipeline: true
            }
        }

        stage('Containerized Build & Deployment') {
            steps {
                echo 'Cleaning up stale runtime cache memories...'
                sh 'docker compose down --remove-orphans || true'
                
                echo 'Building and running application services...'
                sh 'docker compose up -d --build'
                
                echo 'Verifying container status...'
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Deployment Finished Successfully!'
        }
        failure {
            echo 'Pipeline deployment encountered structural faults. Investigating logs.'
        }
    }
}