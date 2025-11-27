pipeline {
	agent any
	environment {
		CI = 'true'
	}
	tools {
		// Updated to match the name 'Nodejs' from your screenshot
		nodejs 'Nodejs'
	}
	stages {
		stage('Checkout SCM') {
			steps {
				// GitHub/GitLab se latest code pull karega
				checkout scm
			}
		}
		stage("frontend step"){
			steps{
				dir("frontend"){
					sh "npm ci"
				}
			}
		}
		stage("backend step") {
			steps{
				dir("backend"){
					sh "npm ci"
				}
			}
		}
		stage('Test with jest-junit') {
			parallel {
				stage('React') {
					steps {
						dir('frontend') {
							sh "npm test -- --reporters=default --reporters=jest-junit"
						}
					}
				}
				stage('Node') {
					steps {
						dir('backend') {
							sh 'npm run test'
						}
					}
				}
			}
		}
		stage("build image"){
			steps{
				dir("frontend"){
					sh "docker build -t social-media-frontened ."
				}
			}
		}
		stage("build frontend image"){
			steps{
				dir("backend"){
					sh "docker build -t social-media-backend ."
				}
			}
		}

	}

	post{
		always{
			echo 'Archiving Test Results .. '
			junit '**/junit.xml'





			f
				re{
			ema
					t(
				subject : "buidl failed ${env.JOB_NAME} #${env.BUILD_NUMBER}
					",
				body: "Console: ${env.BUILD_URL}
					console",
				to: '${DEF
				_
			I
			NTS}'
			)
				}
		success{
			echo ' ✅ Social-media app deplo

		c
	essfully.'
		}
	}
}
}