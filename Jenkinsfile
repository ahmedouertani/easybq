pipeline {
    agent any

    environment {        
        DOCKERHUB_CREDENTIALS = credentials ('bouhmiid-dockerhub')
        SONAR_HOST_URL = "http://192.168.1.122:9000"

        NEXUS_VERSION = "nexus3"
        NEXUS_PROTOCOL = "http"
        NEXUS_URL = "http://192.168.1.122:8081"
        NEXUS_REPOSITORY = "raw-repo"
        NEXUS_CREDENTIAL_ID = "nexustanitlab"
    }

    stages {

        stage('CheckoutGit') {   //Récupération du code source
            steps {
                echo 'checking GitHub Repo'
                git branch: 'main',
                url: 'https://github.com/ahmedouertani/easybq.git'
            }
        }

        stage('UseNode.js') { //Installation de Node.JS
            steps {
                script {
                    nodejs = tool 'nodejs-16'
                    env.PATH = "${nodejs}/bin:${env.PATH}"
                }
            }
        }
        stage('SetNpmRegistry') {
    steps {
        sh 'npm config set registry https://registry.npmjs.org/'
    }
}


stage('Vérifier la configuration du registre npm') {
    steps {
        sh 'npm config list'
    }
}

        stage('InstallDependencies') { //Installer les dépendances du projet
            steps {
                sh 'npm install'
            }
        }

                stage('NodeVersion') {
            steps {
                sh'node -v' }
                }

        /*stage('ExcuteSonarQubeReport') { //Installer les dépendances du projet
            steps {
                //nodejs(nodeJSInstallationName: 'nodejs-14'){
                sh 'npm run sonar-scanner'
            }
        }*/

        stage('Build') {
            steps {    
                sh 'ng build'
                }
                }

 

/*stage('UploadArtifactNexusRAW') {
    steps {
        // Reste des étapes de déploiement des artefacts
        sh 'npm config set registry http://192.168.1.122:8081'
        sh 'npm install'
        sh 'npm run build'

        // Déployer l'artefact sur Nexus
        sh 'curl -v -u admin:bouhmidenaey97 --upload-file C:/Users/Ameni AKKERI/Documents/GitHub/easybq/dist/easy-bq/* http://192.168.1.122:8081/repository/raw-repo/'
    }
}*/

/*stage('DeploytoNexus 2') {
  steps {

      sh 'npm config set registry http://192.168.1.122:8081'
      sh 'npm install'
      sh 'npm run build'

        // Déployer l'artefact sur Nexus
      sh 'curl -v -u admin:bouhmidenaey97 --upload-file C:/Users/Ameni AKKERI/Documents/GitHub/easybq/tanitlab-1.0.0.tgz http://192.168.1.122:8081/repository/npm-repo/'
    
  }
}*/

       /*stage('BuildDockerImage') {
            steps {
                script {
                    def dockerImage = docker.build('bouhmiid/easybq99', '.')
                }
            }
        }*/

        stage ('loginDockerhub') {
            steps{
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('PushDocker') {
            steps {
               sh 'docker push bouhmiid/easybq99:latest'
               }
               }

        stage('RunDockerContainer') {
            steps {
                script {
                    docker.image('bouhmiid/easybq99').run('-p 1200:4200')
                }
            }
        }

        stage('Set Environment Variables') {
  steps {
    script {
      env.GOOGLE_APPLICATION_CREDENTIALS = 'easybqahmed-2b00c9c723aa.json'
    }
  }
}

            /*stage('Deploy') {
      steps {
        // Étape de déploiement de votre application
        sh "gcloud auth activate-service-account --key-file=${env.GOOGLE_APPLICATION_CREDENTIALS}"
        sh 'gcloud app deploy --project=easybqahmed'
      }
    }

    stage('Build and Deploy') {
            steps {
                script {
                    // Installe les dépendances et construit le projet Angular
                    sh 'gcloud builds submit --config=cloudbuild.yaml .'
                }
            }
        }*/



        stage ('security scan') {
            steps {
                echo ("Perform a security scan using OWASP ZAB")

            }
         post {
            success { 
                emailext attachLog: true,
                    body: 'Scan was successful',
                    subject: 'Scan status email',
                    to: 'ahmed.ouertani.2@esprit.tn'
            }

            failure { 
                emailext attachLog: true,
                    body: 'Scan was Failed',
                    subject: 'Scan status email',
                    to: 'ahmed.ouertani.2@esprit.tn'
            }
         }}


                }
    
    post {
        success {
            echo 'Success'
        }
        failure {
            echo 'Failure'
        }
    }
}
