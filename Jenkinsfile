pipeline {
    agent any

    environment {        
        DOCKERHUB_CREDENTIALS = credentials ('dockerHub')
        SONAR_HOST_URL = "http://192.168.1.228:9000"
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
                sh'node -v' 
                }
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

        stage("Publish to Nexus Repository Manager") {
            steps {
                 script {
            // Récupération des fichiers .js dans le sous-dossier easy-bq du répertoire dist
                    def files = findFiles(glob: "dist/easy-bq/*.js")

                if (files) {
                  files.each { file ->
                    // Récupération du nom et du chemin de l'artefact
                    def fileName = file.name
                    def artifactPath = file.path

                    // Récupération des informations de version et autres données souhaitées
                    def version = "1.0.0" // Remplacez par la version souhaitée
                    def groupId = "com.example" // Remplacez par votre groupId souhaité
                    def artifactId = fileName - ".js"
                    def packaging = "js"

                    echo "*** File: ${artifactPath}, group: ${groupId}, packaging: ${packaging}, version ${version}"
                    nexusArtifactUploader(
                        nexusVersion: "nexus3",
                        protocol: "http",
                        nexusUrl: "192.168.1.228:8081",
                        groupId: groupId,
                        version: version,
                        repository: "maven-nexus-repo",
                        credentialsId: "nexus-user-credentials",
                        artifacts: [
                            [artifactId: artifactId,
                            classifier: '',
                            file: artifactPath,
                            type: packaging]
                        ]
                    )
                }
            } else {
                error "No .js files found in the dist/easy-bq directory"
                }
            }
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

        // Authentification avec votre compte GCP en utilisant les informations d'identification GCP
        withCredentials([file(credentialsId: 'bqls-test217', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
            sh "gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}"

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
