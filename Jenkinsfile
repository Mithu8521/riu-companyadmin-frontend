pipeline {
    agent any

    environment {
        DEPLOY_USER = "ubuntu"
        DEPLOY_HOST = "13.205.115.213"
        DEPLOY_PATH = "/var/www/html/cf.novuscap.co"
        SSH_KEY = "/var/lib/jenkins/.ssh/id_ed25519"
        SUCCESS_MESSAGE = "✅ Deployment done"
    }

    triggers {
        // Jenkins will check GitHub every 2 minutes
        pollSCM('H/2 * * * *')
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "Checking out STAGING branch (Frontend)..."
                git branch: 'staging',
                    url: 'git@github.com:Mithu8521/riu-companyadmin-frontend.git',
                    credentialsId: 'ubuntu-ssh'
            }
        }

        stage('Deploy Code') {
            steps {
                echo "Deploying React frontend to EC2..."

                sh """
                # Prepare directory on server
                ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                    echo "Preparing deployment directory..."
                    mkdir -p ${DEPLOY_PATH}
                    rm -rf ${DEPLOY_PATH}/*
                '

                # Copy source code to server
                scp -i ${SSH_KEY} -r * ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

                # Build React app on server
                ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                    cd ${DEPLOY_PATH}

                    echo "Installing dependencies..."
                    npm install

                    echo "Building React app..."
                    npm run build
                '
                """
            }
        }

        stage('Post Deployment') {
            steps {
                echo "${SUCCESS_MESSAGE}"
            }
        }
    }

    post {
        success {
            echo "🎉 Frontend deployment successful"
        }
        failure {
            echo "❌ Frontend deployment failed"
        }
    }
}
