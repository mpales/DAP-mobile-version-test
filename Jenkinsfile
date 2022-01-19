pipeline {
    agent any
    environment {
        //TEMP = "$pr_title".replaceAll(verRegexs, '$1')
        VERSION = "dapmobile-1.0.0-beta"
    }
    stages {
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
}
