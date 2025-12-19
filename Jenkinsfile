pipeline {
	agent any

	tools {
		nodejs 'Nodejs'
	}

	environment {
		CI = 'true'
		NODE_ENV = 'test'
		NPM_CONFIG_CACHE = '${WORKSPACE}/.npm'
	}

	stages {
		stage('Checkout SCM') {
			steps {
				checkout scm
			}
		}

		
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

		stage('Lint Code') {
			parallel {
				stage('Frontend Lint') {
					steps {
						dir('frontend') {
							sh "npm run lint"
						}
					}
				}
				stage('Backend Lint') {
					steps {
						dir('backend') {
							// Add linting for backend if eslint is configured
							sh "echo 'Backend linting not configured yet'"
						}
					}
				}
			}
		}

		stage('Run Tests') {
			parallel {
				stage('Frontend Tests') {
					steps {
						dir('frontend') {
							sh "npm run test"
						}
					}
				}
				stage('Backend Tests') {
					steps {
						dir('backend') {
							sh 'npm run test'
						}
					}
				}
			}
		}

		stage('Security Audit') {
			parallel {
				stage('Frontend Audit') {
					steps {
						dir('frontend') {
							sh "npm audit --audit-level moderate || echo 'NPM audit completed with warnings'"
						}
					}
				}
				stage('Backend Audit') {
					steps {
						dir('backend') {
							sh "npm audit --audit-level moderate || echo 'NPM audit completed with warnings'"
						}
					}
				}
			}
		}

		stage("Build Images") {
			parallel {
				stage("Build Frontend Image") {
					steps {
						dir("frontend") {
							sh "docker build -t social-media-frontend ."
						}
					}
				}
				stage("Build Backend Image") {
					steps {
						dir("backend") {
							sh "docker build -t social-media-backend ."
						}
					}
				}
			}
		}
	}

	post {
		always {
			echo 'Archiving Test Results and Cleanup...'

			// Archive test results
			junit testResults: '**/junit.xml', allowEmptyResults: true

			// Archive coverage reports if they exist
			archiveArtifacts artifacts: '**/coverage/**', allowEmptyArchive: true

			// Clean up Docker images to save space
			sh 'docker system prune -f || true'
		}
		success {
			echo ' ✅ Social-media app pipeline completed successfully!'
			echo ' 🎉 All tests passed and images built successfully.'
		}
		failure {
			echo ' ❌ Pipeline failed! Check the logs above for details.'
			echo ' 🔍 Check test results and build logs for issues.'
		}
		unstable {
			echo ' ⚠️  Pipeline completed with test failures or warnings.'
			echo ' 📊 Check test results for failed tests.'
		}
	}
}