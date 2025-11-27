pipeline {
	agent any

	stages {
		stage("frontend step"){
			steps{
				dir("frontend"){sh "npm install"}
			}
		}
		stage("backend step") {
			steps{
				dir("backend"){sh "npm install"}
			}
		}
		stage('Test & Lint') {
			parallel {
				stage('React') {
					steps {
						dir('frontend') {
							sh 'npm run lint'
							sh 'CI=true npm test -- --coverage --watchAll=false'
						}
					}
				}
				stage('Node') {
					steps {
						dir('backend') {
							sh 'npm run lint'
							sh 'npm test'
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
		failure{
			emailtext(
				subject : "buidl failed ${env.JOB_NAME} #${env.BUILD_NUMBER}",
				body: "Console: ${env.BUILD_URL}console",
				to: '${DEFAULT_RECIPIENTS}'
			)
		}
		success{
			echo ' ✅ Social-media app deployed successfully.'
		}
	}
}