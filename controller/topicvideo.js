angular.module('AbhyasApp').controller('topicvideo',function($scope,$http,$sce,$filter,$location, $localStorage,$window,$route,$rootScope,apiurl){

    var apiurl = apiurl.getUrl();
    
    if(!$window.localStorage.getItem('studentdata')){
           window.location.href = 'home.html';
       }
       $scope.userdata = JSON.parse($window.localStorage.getItem('studentdata'));
       
      // console.log($scope.userdata.stdMobileNo);
       
       $scope.logountnow =  function(){
            window.localStorage.removeItem('studentdata');
           window.location.href = 'index.html';
        }
           
        $scope.selecttopicinfo = JSON.parse($window.localStorage.getItem('selectopicinfo'));
        //console.log($scope.selecttopicinfo);
        
        
        //console.log($scope.selecttopicinfo);

			$http.get(apiurl+"/videos/"+$scope.selecttopicinfo.subjectId+"/"+$scope.selecttopicinfo.topicName).success((data)=>{
				$scope.videoslist = data.data;
                //console.log($scope.videoslist);
			})
            
            $scope.playvideourl = '';
            $scope.playVideo = function (idx,vdata) {
             //   console.log(vdata)
                    $scope.idxvalue = idx;
                    var videourl = vdata.url.replace("https://youtu.be/", "https://youtube.com/embed/");
                    $scope.playvideourl = $sce.trustAsResourceUrl(videourl+"?showinfo=1&modestbranding=1&rel=0");
                    
                    $scope.videoPlayMongo = {
                        "userId": $scope.userdata.stdMobileNo,
                        "eventCategory": 'Video',
                        "eventDetails": vdata,     
                        "title1":vdata.subject_master_name,
                        "title2":vdata.title,
                        "duration": "45"

                    }
                    //console.log($scope.videoPlayMongo);
                    $http({
                            withCredentials: false,
                            method: 'post',
                            url: apiurl+'/events',
                            headers: { 'Content-Type': 'application/json' },
                            data: $scope.videoPlayMongo
                        }).success(function (data) {
                            //console.log(data);
                        });
    
                }    


            $scope.gotoback=function(){
                window.location.href = 'home.html#/dashboard';
            }      
            $scope.startAssignment=function(x){
                
                // $scope.videoPlayMongo = {
                //     "userId": $scope.userdata.stdMobileNo,
                //     "eventCategory": 'Assignment',
                //     "eventDetails": $scope.selecttopicinfo                
                // }
                // //console.log($scope.videoPlayMongo);
                // $http({
                //         withCredentials: false,
                //         method: 'post',
                //         url: apiurl+'/events',
                //         headers: { 'Content-Type': 'application/json' },
                //         data: $scope.videoPlayMongo
                //     }).success(function (data) {
                //         //console.log(data);
                //     });

                 $scope.selecttopicinfo.tagName = x;    
                $window.localStorage.setItem('selectopicinfo',JSON.stringify($scope.selecttopicinfo));
		 
		        window.location='home.html#/topicassignment';
       
               }	
              
               $scope.startPracticeExam=function(){
                $window.localStorage.setItem('selectopicinfo',JSON.stringify($scope.selecttopicinfo));
                window.location='home.html#/topicpractice';
            }      
        
        $scope.startAskMe=function(){
            
            $scope.videoPlayMongo = {
                "userId": $scope.userdata.stdMobileNo,
                "eventCategory": 'Ask Me',
                "eventDetails": $scope.selecttopicinfo                
            }
            //console.log($scope.videoPlayMongo);
            $http({
                    withCredentials: false,
                    method: 'post',
                    url: apiurl+'/events',
                    headers: { 'Content-Type': 'application/json' },
                    data: $scope.videoPlayMongo
                }).success(function (data) {
                    //console.log(data);
                });


              $window.localStorage.setItem('selectopicinfo',JSON.stringify($scope.selecttopicinfo));
		 
		        window.location='home.html#/topicaskme';
       
        }	 


        $scope.searchTopicFromVideo=function(sub,keyword){
			$scope.topicslist='';
			$scope.loadstatus=true;
		


			var obj={
				"programid": 2,
        		"keyvalue": keyword
			}
		//	console.log(obj);
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
			//	console.log($scope.topicslist)
				$window.localStorage.setItem('selectedtopicsession',JSON.stringify($scope.topicslist));	
                $window.localStorage.setItem('selectopicinfo',JSON.stringify($scope.topicslist));	


				})
				$scope.loadstatus=false;
				window.location='home.html#/dashboard';
				

		}

        $http.get(apiurl+"/events/"+$scope.userdata.stdMobileNo).success((data)=>{	
			
           // console.log($scope.videoslist[0].topicId);
                $scope.topicstudytracker = data.filter(e=>e.title2==$scope.videoslist[0].topicId);
            
                $scope.topicvideotracker = $scope.topicstudytracker.filter(e=>e.eventCategory=='Video');
                $scope.topicassignmenttracker = $scope.topicstudytracker.filter(e=>e.eventCategory=='Assignment');
                $scope.topicpracticetracker = $scope.topicstudytracker.filter(e=>e.eventCategory=='PracticeExam');
                
                
                $scope.topicvideoimespent=Math.round(getSumElements($scope.topicvideotracker, 'duration'))
                $scope.topicassignimespent=Math.round(getSumElements($scope.topicassignmenttracker, 'duration'));
                $scope.topicpracticeimespent=Math.round(getSumElements($scope.topicpracticetracker, 'duration'));
                if (isNaN($scope.topicpracticeimespent)) $scope.topicpracticeimespent = 0;

                $scope.topictotaltimespent=Math.round($scope.topicvideoimespent+$scope.topicassignimespent+$scope.topicpracticeimespent);

                console.log($scope.topicvideoimespent)
                                                    
})
       
       $scope.pagereload = function(){
           location.reload()
       }


       function getSumElements(obj, field) {
        //console.log(obj);
        var total = 0;
        for (var i in obj)
            total += Number(obj[i][field]);
        return total;
    }
});
