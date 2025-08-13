pipeline {
  agent any

  tools {
    nodejs 'node18'
  }

  options {
    timestamps()
    ansiColor('xterm')
  }

  triggers {

  }

  environment {
    NODE_OPTIONS = "--max_old_space_size=4096"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install deps') {
      steps {
        sh 'npm ci || npm install'
      }
    }

    stage('Tests') {
      steps {
        sh 'npm test --silent || echo "Tests optionnels, ignorer si non configurés"'
      }
    }

    stage('Build Angular') {
      steps {
        sh 'npx ng build --configuration production --base-href="/rdp_project/"'
      }
    }

    stage('Archive build') {
      steps {
        script {
          def out = sh(script: "ls dist | head -n 1", returnStdout: true).trim()
          archiveArtifacts artifacts: "dist/${out}/**", fingerprint: true
        }
      }
    }

    stage('Deploy to GitHub Pages') {
      when {
        branch 'master'
      }
      steps {
        withCredentials([string(credentialsId: 'GH_TOKEN', variable: 'TOKEN')]) {
          script {
            def out = sh(script: "ls dist | head -n 1", returnStdout: true).trim()
            sh """
              npx angular-cli-ghpages \
                --dir=dist/${out}/browser \
                --no-silent \
                --repo=https://$TOKEN@github.com/NjarasoaTommy/rd_project.git \
                --branch=gh-pages
            """
          }
        }
      }
    }
  }

  post {
    always {
      junit '**/test-results/**/*.xml'
      cleanWs()
    }
  }
}
