pipeline {
    agent any

    environment {
        DEPLOY_USER = "ubuntu"
        DEPLOY_HOST = "13.205.115.213"
        DEPLOY_PATH = "/var/www/html/cf.novuscap.co"
        SSH_KEY = "/var/lib/jenkins/.ssh/id_ed25519"

        // Increase Node memory for React build
        NODE_OPTIONS = "--max-old-space-size=4096"

        SUCCESS_MESSAGE = "✅ Deployment done"
    }

    triggers {
        // Auto-detect GitHub changes (no webhook)
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

        stage('Install Dependencies & Build') {
            steps {
                echo "Installing dependencies and building React app..."

                sh '''
                    set -e

                    echo "Node version:"
                    node -v
                    npm -v

                    export NODE_OPTIONS=--max-old-space-size=4096

                    echo "Installing dependencies..."
                    npm install --force

                    echo "Building React app (CI disabled)..."
                    CI=false npm run build

                    echo "Verifying build folder..."
                    ls -lah build
                '''
            }
        }

        stage('Deploy Build Folder Only') {
            steps {
                echo "Deploying ONLY build folder to EC2..."

                sh """
                # Prepare server directory
                ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                    echo "Preparing deployment directory..."
                    mkdir -p ${DEPLOY_PATH}
                    rm -rf ${DEPLOY_PATH}/*
                '

                # Copy ONLY build output
                scp -i ${SSH_KEY} -r build/* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/
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
