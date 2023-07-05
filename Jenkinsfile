pipeline {
    agent any


    environment {        
        DOCKERHUB_CREDENTIALS = credentials ('dockerHub')
        SONAR_HOST_URL = "http://192.168.131.228:9000"

        NEXUS_VERSION = "nexus3"
        NEXUS_PROTOCOL = "http"
        NEXUS_URL = "http://192.168.131.228:9000"
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

        stage('ExcuteSonarQubeReport') { //Installer les dépendances du projet
            steps {
                sh 'npm run sonar-scanner'
            }
        }

        stage('Build') {
            steps {    
                sh 'ng build'
                }
                }

        stage('UploadArtifactNexusRAW') {
            steps {
                // Reste des étapes de déploiement des artefacts
                /*sh 'npm config set registry http://192.168.1.122:8081'*/
                sh 'npm install'
                sh 'npm run build'

                // Déployer les fichiers JS
                sh 'find dist -name "*.js" -exec curl -v -u admin:bouhmidenaey97 --upload-file {} http://192.168.1.228:8081/repository/npm-repo/ \\;'

                // Déployer les fichiers HTML
                sh 'find dist -name "*.html" -exec curl -v -u admin:bouhmidenaey97 --upload-file {} http://192.168.1.228:8081/repository/npm-repo/ \\;'

                // Déployer les fichiers CSS
                sh 'find dist -name "*.css" -exec curl -v -u admin:bouhmidenaey97 --upload-file {} http://192.168.1.228:8081/repository/npm-repo/ \\;'

                sh 'curl -v -u admin:bouhmidenaey97 --upload-file angular.json http://192.168.1.228:8081/repository/npm-repo/'
            }
        }


        stage('BuildDockerImage') {
                steps {
                    script {
                        def dockerImage = docker.build('bouhmiid/easybb789', '.')
                    }
                }
            }

        /*stage ('loginDockerhub') {
            steps{
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('PushDocker') {
            steps {
               sh 'docker push bouhmiid/easybb789:latest'
               }
               }

        stage('RunDockerContainer') {
            steps {
                script {
                    docker.image('bouhmiid/easybb789').run('-p 2202:4200')
                }
            }
        }*/

        stage('Deploy to GKE') {
            steps {
                // Configuration du projet GCP
                sh 'gcloud config set project bqls-test217'

                // Création du cluster GKE
                sh 'gcloud container clusters create easytest --num-nodes=2'

                // Récupération des informations d'authentification pour le cluster GKE
                sh 'gcloud container clusters get-credentials easytest --zone us-central1-a'

                // Déploiement de l'application sur le cluster GKE
                sh 'kubectl create deployment easytest --image=bouhmiid/easybb789:latest --replicas=1'

                // Exposition du service pour accéder à l'application
                sh 'kubectl expose deployment/easytest --type=LoadBalancer --port=4200 --target-port=4200'
            }
        }

        /*stage('Set Environment Variables') {
            steps {
                script {
                env.GOOGLE_APPLICATION_CREDENTIALS = 'easybqahmed-2b00c9c723aa.json'
                }
            }
            }*/

        /*stage ('security scan') {
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
         }}*/


                }
    
	post {
    	always {
    		step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: 'wertani.ahmed9977@gmail.com', sendToIndividuals: true])
		}
	}
}
