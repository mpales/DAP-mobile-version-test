def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]

def build_url = "http://128.199.103.60:8080/blue/organizations/jenkins/${env.JOB_NAME}/detail/${env.JOB_NAME}/${env.BUILD_NUMBER}/pipeline"

def download_url = "http://128.199.103.60:8080/job/${env.JOB_NAME}/lastSuccessfulBuild/artifact/android/app/build/outputs/apk/release/app-release.apk"

def verRegexs = ".*?(<<.*>>).*" 

pipeline {
    agent any
    parameters {
        //string(name: 'buildEnv', defaultValue: 'staging')
        string(name: 'pr_title', defaultValue: '<< no_version >>')
    }
    triggers {
       GenericTrigger(
            genericVariables: [
                 [key: 'pr_title', value:'$.pullrequest.title'],
            ],
            token: '89F2D34E1ECA49D11DA7P58BM1F8E',
            causeString: 'Merge Pull Request',
        )
    }  
    environment {
        TEMP = "$pr_title".replaceAll(verRegexs, '$1')
        VERSION = "$env.TEMP".replaceAll("<", "").replaceAll(">", "")
        //DEPLOY = "$buildEnv"
    }
    stages {
        stage ('pre-build'){
            steps{            
                echo "PR: ${pr_title}"     
                echo "Version: ${env.VERSION}"            
                //echo "Enviroment: ${buildEnv}"            
                script {
                    if(env.VERSION != 'no-build'){
                        def slackResponsePre = slackSend(channel: '#dev-notice-logistic',
                            color: "#0763a6",
                            message: "*STARTING:* Job ${env.JOB_NAME} build <<${env.VERSION}>> is starting. More info at: <${build_url}|Log>")
                            slackResponsePre.addReaction("wrench")
                    }
                }
            }
        }
        stage ('Checkout Repo') {
            //please setup git repo and credential on pipeline config
            //checkout scm
            steps {
                catchError {
                    checkout scm
                }
            }
        }
        
        stage ('Install Dependencies') {
        //this will Install Necessary & Required Dependencies
            steps {
                echo "Install Necessary Dependencies"
                catchError {
                    sh "npm install"
                    sh "npx react-native-asset"
                    sh "npx patch-package"
                    sh "node ./node_modules/@darron1217/react-native-background-geolocation/scripts/postlink.js"
                    sh "npx jetify"
                }
            }
        }
        

        stage ('Clean-Build-Archive') {
        //this will do a Clean & New Build
            steps {
                echo "Install Necessary Dependencies"
                catchError {
                    dir("android") {
                        sh "chmod +x gradlew"
                        sh "./gradlew clean"
                        sh "./gradlew assembleRelease"
                        //sh "./gradlew bundleRelease"
                    }
                    archiveArtifacts artifacts: '**/*.apk', followSymlinks: false
                    //archiveArtifacts artifacts: '**/*.apk', '**/*.aab', followSymlinks: false
                }
            }
        }
    }
    
    post {
        success {            
            script {                                        
                if(env.VERSION != 'no-build'){
                    def slackResponseSuccess = slackSend(channel: '#dev-notice-logistic',
                        color: COLOR_MAP[currentBuild.currentResult],
                        message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build <<${env.VERSION}>> is success. Download Android APK File here: <${download_url}|DAP-AndroidApp>")
                    slackResponseSuccess.addReaction("robot_face")
                }
            }
        }
        failure {            
            script {                                        
                if(env.VERSION != 'no-build'){
                    def slackResponsFail = slackSend(channel: '#dev-notice-logistic',
                        color: COLOR_MAP[currentBuild.currentResult],
                        message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build <<${env.VERSION}>> is failed. More info at: <${build_url}|Log>")
                    slackResponsFail.addReaction("scream")
                }
            }
        }
        aborted {            
            script {                                        
                if(env.VERSION != 'no-build'){
                    def slackResponseAbort = slackSend(channel: '#dev-notice-logistic',
                        color: COLOR_MAP[currentBuild.currentResult],
                        message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build <<${env.VERSION}>> is aborted. More info at: <${build_url}|Log>")
                    slackResponseAbort.addReaction("warning")
                }
            }
        }
    }
}