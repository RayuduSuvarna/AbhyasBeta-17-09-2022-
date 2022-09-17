angular.module('AbhyasApp').controller('topicassignment',function($scope,$http,$filter,$location, $localStorage,$window,$route,$rootScope,apiurl){

    var apiurl = apiurl.getUrl();
    if(!$window.localStorage.getItem('studentdata')){
        window.location.href = 'home.html';
    }
    $scope.userdata = JSON.parse($window.localStorage.getItem('studentdata'));
    
    console.log($scope.userdata);
    
    $scope.logountnow =  function(){
         window.localStorage.removeItem('studentdata');
        window.location.href = 'index.html';
     }
     
     $scope.form=1;
     $scope.selecttopicinfo = JSON.parse($window.localStorage.getItem('selectopicinfo'));
     
     console.log($scope.selecttopicinfo);
     $scope.topicidname=$scope.selecttopicinfo.topicName;
     $scope.topicmastername=$scope.selecttopicinfo.subjectName;
     $scope.previous_index = -1;
     $scope.currentindex = 0;
     $scope.selectedNumber = 0;

    $http.get(apiurl+'/exercise/'+$scope.selecttopicinfo.tagName).success(function (data) {
        console.log(data.data);
        $scope.fpaper = data.data;
        $scope.storingDefaultValue();
    });
    $scope.UpdateMathJax = function () {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    };	
   
    

         $scope.gotoback=function(){
             window.location.href = 'home.html#/topicvideo';
         }      
    
         $scope.storingDefaultValue = function () {
            //STORING DEFAULT VALUE ZERO FOR ISANSWERD AND MY_ANSWER//
    
            for (var i = 0; i < $scope.fpaper.length; i++) {
                if ($scope.fpaper[i].isanswerd == undefined) {
                    $scope.fpaper[i].isanswerd = 0;
                }
                for (var j = 0; j < $scope.fpaper[i].ans.length; j++) {
                    if ($scope.fpaper[i].ans[j].my_answer == undefined) {
                        $scope.fpaper[i].ans[j].my_answer = 0;
                    }
                }
            }
        }
    
        $scope.onNextFun = function (next) {
            console.log(next);
            $scope.selectedNumber = next + 1;
            console.log($scope.selectedNumber);
            console.log($scope.fpaper[$scope.selectedNumber].question_master_desc);
    
            // $scope.StoringResult($scope.fpaper[$scope.previous_index])
        }
    
        $scope.onPrevious = function (prev) {
            console.log(prev);
            $scope.selectedNumber = prev - 1;
            console.log($scope.selectedNumber);
            console.log($scope.fpaper[$scope.selectedNumber].question_master_desc);
    
        }
    
        $scope.myfun = function (obj, idx) {
    
            console.log(obj);
            console.log(idx);
            // MAKING ALL MY_ANSWER ZERO FOR REVISIT  OF PREVIOUS QUESTION FOR SINGLE ANSWER TYPE QUESTION //
    
            if ($scope.fpaper[$scope.selectedNumber].question_master_type == 1) {
                for (var i = 0; i < $scope.fpaper[$scope.selectedNumber].ans.length; i++) {
    
                    $scope.fpaper[$scope.selectedNumber].ans[i].my_answer = 0;
                }
            }
    
            //STORING MY_ANSWER VALUE AS ONE FOR CHECKED ANSWERS//
    
            if ($scope.fpaper[$scope.selectedNumber].ans[idx].my_answer == 1) {
                $scope.fpaper[$scope.selectedNumber].ans[idx].my_answer = 0;
    
            } else {
                $scope.fpaper[$scope.selectedNumber].ans[idx].my_answer = 1;
    
            }
            $scope.fpaper[$scope.selectedNumber].points = $scope.calculatePoints($scope.fpaper[$scope.selectedNumber].ans, $scope.selectedNumber, $scope.fpaper);
            $scope.fpaper[$scope.selectedNumber].points = parseInt(this.fpaper[$scope.selectedNumber].points);
            $scope.fpaper[$scope.selectedNumber].isanswerd = 1;
            console.log($scope.fpaper[$scope.selectedNumber]);
        }
        $scope.calculatePoints = function (ans, selectedquestion, fpaper) {
            var points = 0;
            for (var x in ans) {
                if (ans[x].answer_master_isright == 1 && ans[x].my_answer == 1) {
                    fpaper[selectedquestion].ansStatus = 'R'
                    points = 1;
                    break;
                }
                if (ans[x].answer_master_isright == 0 && ans[x].my_answer == 1) {
                    fpaper[selectedquestion].ansStatus = 'W'
                    break;
                }
            }
    
            return points
        }		 
        
        $scope.submitexam = function () {
            
					
                      
                      $scope.Resobj = { 'totalattempted': '', 'totalwrong': '', 'totalcorrect': '', 'totalleft': '' }
                      var attempted = $scope.fpaper.filter(e => e.isanswerd == 1)
                      var left = $scope.fpaper.filter(e => e.isanswerd == 0)
                      var totalcorrect = this.fpaper.filter(e => e.ansStatus == 'R' && e.isanswerd == 1)
                      var totalwrong = this.fpaper.filter(e => e.ansStatus == 'W' && e.isanswerd == 1)
                      $scope.Resobj.totalattempted = attempted.length;
                      $scope.Resobj.totalleft = left.length;
                      $scope.Resobj.totalcorrect = totalcorrect.length;
                      $scope.Resobj.totalwrong = totalwrong.length;
                      console.log($scope.Resobj);
                      $scope.PostingObj = {
                          "attemptedJson": $scope.fpaper,
                          "Subjectid": $scope.selecttopicinfo.subjectId,
                          "SubjectName": $scope.selecttopicinfo.subjectName,
                          "Topicname": $scope.selecttopicinfo.topicName,
                          "Studentid": $scope.userdata.stdMobileNo,
                          "ResultJson": $scope.Resobj,
                          "StudentName": $scope.userdata.stdName,
                          "branch": "ADITYA",
                          "groupid": 2,
                          "groupName": $scope.userdata.stdCourse                        
                      }
                      console.log($scope.PostingObj);
                      $scope.paper = $scope.fpaper;
                      $scope.form=2;
                      $http({
                          withCredentials: false,
                          method: 'post',
                          url: apiurl+'/studentattempts/',
                          headers: { 'Content-Type': 'application/json' },
                          data: $scope.PostingObj
                      }).success(function (data) {
                       console.log(data);
                      });

                      var resultpercent = ($scope.PostingObj.ResultJson.totalcorrect/$scope.PostingObj.ResultJson.totalattempted)*100;

                      $scope.videoPlayMongo = {
                        "userId": $scope.userdata.stdMobileNo,
                        "eventCategory": 'Assignment',
                        "eventDetails": $scope.PostingObj,     
                        "title1": $scope.selecttopicinfo.subjectName,
                        "title2":$scope.selecttopicinfo.topicName,
                        "duration": "10",
                        "result" : resultpercent

                    }
                    $http({
                            withCredentials: false,
                            method: 'post',
                            url: apiurl+'/events',
                            headers: { 'Content-Type': 'application/json' },
                            data: $scope.videoPlayMongo
                        }).success(function (data) {
                            console.log(data);
                        });
                      return true;
                  
              

        }
        $scope.searchTopic=function(sub,keyword){
			$scope.topicslist='';
			$scope.loadstatus=true;
		


			var obj={
				"programid": 2,
        		"keyvalue": keyword
			}
			console.log(obj);
			$http.post(apiurl+"/topics/topicsearch/",obj).success((data)=>{	
						
				
				var selectedsubjectdata = data;

				var topics=$filter('unique')(selectedsubjectdata,'topicName');
				var maindata=[];
				for(var i=0;i<topics.length;i++){
				var singlesubjectdata = selectedsubjectdata.filter(e => e.topicName == topics[i]);
				
	
				var easydata = singlesubjectdata.filter(e => e.qLevel == 'Easy');
				var avaragedata = singlesubjectdata.filter(e => e.qLevel == 'Average');
				var difficultdata = singlesubjectdata.filter(e => e.qLevel == 'Difficulty');
				var verydifficultdata = singlesubjectdata.filter(e => e.qLevel == 'Very Difficulty');
				  
	
				var vcount =$filter('sumByColumn')(easydata,'vCount');
				var vcount =$filter('sumByColumn')(easydata,'vCount');
				var ecount =$filter('sumByColumn')(easydata,'eCount');
	
				var qcount =$filter('sumByColumn')(singlesubjectdata,'qcount');
				var easyqcount =$filter('sumByColumn')(easydata,'qcount');
				var avarageqcount =$filter('sumByColumn')(avaragedata,'qcount');
				var difficultqcount =$filter('sumByColumn')(difficultdata,'qcount');
				var verydifficultqcount =$filter('sumByColumn')(verydifficultdata,'qcount');
	
	
	
				maindata[i] = {
						  "subjectId":singlesubjectdata[0].Subjectid,
						  "subjectName":singlesubjectdata[0].Subjectname,
						  "topicId" : singlesubjectdata[0].topicId,	
						  "topicName" : topics[i],
						  "videoCount":vcount.toLocaleString('en-IN'),
						  "exceriseCount": ecount.toLocaleString('en-IN'),
						  "questionCount" : qcount.toLocaleString('en-IN'),
						  "easy" :easyqcount.toLocaleString('en-IN'),
						  "average" :avarageqcount.toLocaleString('en-IN'),
						  "difficult" :(difficultqcount+verydifficultqcount).toLocaleString('en-IN')
							  }
	
					  
				}
				
				$scope.topicslist=maindata;
				console.log($scope.topicslist)
				$window.localStorage.setItem('selectedtopicsession',JSON.stringify($scope.topicslist));	
                $window.localStorage.setItem('selectopicinfo',JSON.stringify($scope.topicslist));	



				})
				$scope.loadstatus=false;
                location.reload();
				window.location='home.html#/dashboard';
                
				

		}
     
    $scope.pagereload = function(){
        location.reload()
    }

});
