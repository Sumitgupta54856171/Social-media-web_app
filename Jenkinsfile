pipeline {
	agent any

	tools {
		nodejs 'Nodejs'
	}

	environment {
		// VERY IMPORTANT: Iske bina React tests atak jayenge
		CI = 'true'
	}

	stages {
		stage('Checkout SCM') {
			steps {
				checkout scm
			}
		}

		// Dependencies install - Parallel (Optional but faster)
		stage("Install Dependencies") {
			parallel {
				stage("Frontend Install") {
					steps {
						dir("frontend"){ sh "npm ci" }
					}
				}
				stage("Backend Install") {
					steps {
						dir("backend"){ sh "npm ci" }
					}
				}
			}
		}

		stage('Test with jest-junit') {
			parallel {
				stage('React Tests') {
					steps {
						dir('frontend') {
							// React mein jest-junit config package.json ya command line mein honi chahiye
							sh "npm test -- --reporters=default --reporters=jest-junit"
						}
					}
				}
				stage('Node Tests') {
					steps {
						dir('backend') {
							// Make sure backend package.json also has jest-junit config
							sh 'npm run test'
						}
					}
				}
			}
		}

		stage("Build Frontend Image"){
			steps{
				dir("frontend"){
					// Fixed spelling: frontened -> frontend
					sh "docker build -t social-media-frontend ."
				}
			}
		}

		stage("Build Backend Image"){
			steps{
				dir("backend"){
					// Fixed stage name typo
					sh "docker build -t social-media-backend ."
				}
			}
		}
	}

	post {
		always {
			echo 'Archiving Test Results .. '
			// Corrected Path: '**' ka matlab kisi bhi sub-folder mein dhoondo
			junit '**/junit.xml'
		}
		failure {
			// 'emailtext' typo tha, usually 'emailext' plugin use hota hai
			emailext (
				subject : "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
				body: "Console Logs: ${env.BUILD_URL}console",
				to: "${DEFAULT_RECIPIENTS}"
			)
		}
		success {
			echo ' ✅ Social-media app deployed successfully.'
		}
	}
}