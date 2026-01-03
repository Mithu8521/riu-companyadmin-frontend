pipeline {
    agent any

    environment {
        DEPLOY_USER = "ubuntu"
        DEPLOY_HOST = "13.205.115.213"
        DEPLOY_PATH = "/var/www/html/cf.novuscap.co"
        SSH_KEY = "/var/lib/jenkins/.ssh/id_ed25519"

        // 🔥 FIX: Increase Node.js memory
        NODE_OPTIONS = "--max-old-space-size=4096"

        SUCCESS_MESSAGE = "✅ Deployment done"
    }

    triggers {
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
                echo "Deploying React frontend to EC2 as ubuntu user..."

                sh """
                # Prepare directory on server
                ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                    echo "Preparing deployment directory..."
                    mkdir -p ${DEPLOY_PATH}
                    rm -rf ${DEPLOY_PATH}/*
                '

                # Copy code to server
                scp -i ${SSH_KEY} -r . ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

                # Install & build on server with increased heap
                ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                    cd ${DEPLOY_PATH}

                    echo "Installing dependencies..."
                    export NODE_OPTIONS=--max-old-space-size=4096
                    npm install --force

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
