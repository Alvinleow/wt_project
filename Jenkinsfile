pipeline {
    agent any

    environment {
        JMETER_PATH = 'C:\\apache-jmeter-5.6.3\\bin\\jmeter.bat'
        JMETER_TEST = 'jmeter/performance-test.jmx'
        JMETER_RESULT = 'result.jtl'
        JMETER_REPORT_DIR = 'jmeter/report'
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
                    // Install Node.js dependencies using bat for Windows
                    bat 'npm install'
                }
            }
        }
        stage('Build Vue.js') {
            steps {
                script {
                    // Build the Vue.js project using bat for Windows
                    bat 'npm run build'
                }
            }
        }
        stage('Run JMeter Performance Test') {
            steps {
                script {
                    // Run JMeter Test in non-GUI mode
                    bat "\"${JMETER_PATH}\" -n -t ${JMETER_TEST} -l ${JMETER_RESULT} -e -o ${JMETER_REPORT_DIR}"
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image using bat for Windows
                    bat "docker build -t alvin0816/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'SC_PROJECT_DOCKER', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        // Log in to Docker Hub and push the image using bat for Windows
                        bat "echo ${DOCKERHUB_PASS} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                        bat "docker push ${DOCKERHUB_USER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    }
                }
            }
        }
        stage('Update Jira Issue') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'SC_PROJECT_JIRA', usernameVariable: 'JIRA_USERNAME', passwordVariable: 'JIRA_API_TOKEN')]) {
                    script {
                        // Add a comment to the Jira issue using the jiraAddComment step
                        jiraAddComment(
                            site: 'SC_Project1',
                            idOrKey: "${JIRA_ISSUE}", 
                            comment: "Docker image build and push successful. Image is available at Docker Hub."
                        )

                        // Transition the issue to 'Done' using the jiraTransitionIssue step
                        jiraTransitionIssue(
                            site: 'SC_Project1',
                            idOrKey: "${JIRA_ISSUE}",
                            input: [transition: [id: '31']]
                        )
                    }
                }
            }
        }
        stage('Publish JMeter Performance Report') {
            steps {
                script {
                    // Publish the JMeter performance testing reports in Jenkins
                    perfReport(
                        sourceDataFiles: '**/*.jtl',
                        errorFailedThreshold: 2000, 
                        errorUnstableThreshold: 1000,
                        showTrendGraphs: true,
                        generatePerformanceTrend: true
                    )
                }
            }
        }
    }

    post {
        success {
            echo "Build completed successfully!"
        }
        failure {
            echo "Build failed!"
        }
    }
}
