pipeline {
    agent any

    environment {
        JMETER_PATH = 'C:\\apache-jmeter-5.6.3\\bin\\jmeter.bat'
        JMETER_TEST = 'jmeter/performance-test.jmx'
        JMETER_RESULT = 'result.jtl'
        JIRA_ISSUE = 'G5-1'
        DOCKER_IMAGE_NAME = 'sc-project1-image'
        DOCKER_IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'SC_PROJECT_GITHUB', url: 'https://github.com/Alvinleow/wt_project.git', branch: 'main'
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies
                    sh 'npm install'
                }
            }
        }
        stage('Build Vue.js') {
            steps {
                script {
                    // Build the Vue.js project
                    sh 'npm run build'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image using the Dockerfile
                    sh "docker build -t ${DOCKER_HUB_USER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'SC_PROJECT_DOCKER', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        // Log in to Docker Hub and push the image securely
                        sh "echo ${DOCKERHUB_PASS} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Build and push to Docker Hub successful!"
        }
        failure {
            echo "Build failed!"
        }
    }
}
