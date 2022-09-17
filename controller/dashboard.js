angular.module('AbhyasApp').controller('Dashboard',function($scope,$http,$sce,$filter, $localStorage,$window,$route,$rootScope,apiurl){

	var apiurl = apiurl.getUrl();
 	if(!$window.localStorage.getItem('studentdata')){
			window.location.href = 'index.html';
		}
		 $scope.userdata = JSON.parse($window.localStorage.getItem('studentdata'));

		console.log($scope.userdata);
		
$scope.getbasicdata=function(){	 
		 if(JSON.parse(localStorage.getItem('examresultjson'))){ 
			$scope.formname='qr';
		   $scope.resultjson = JSON.parse(localStorage.getItem('examresultjson'));
		  // console.log($scope.resultjson[0].TopicsArr[0].Topicname)

	$http.get(apiurl+"/videos/"+$scope.resultjson[0].Subjects[0]+"/"+$scope.resultjson[0].TopicsArr[0].Topicname).success((data)=>{
			
		    $scope.practicevideostopic = $scope.resultjson[0].TopicsArr[0].Topicname;
			$scope.practiceexamvideoimg = data.data[0].videoid;
		})

		}else{
			$scope.resultjson=[];$scope.FinalResult={}; var stdata = '';
			$http.get(apiurl+'/practicetest/student/all/'+$scope.userdata.stdMobileNo).success(function (data) {
				
				  $scope.resultjson[0]  = data[data.length-1]
			      $scope.formname='qr';
				 
				  stdata = data[data.length-1];
				  $scope.stpaper = $scope.resultjson[0].Questions;
				

				  var attempted = $scope.stpaper.filter(e => e.isanswered == 1)
				  var left = $scope.stpaper.filter(g => (g.NewansnewStatus != 'W' && g.isanswered != 1) || g.NewansnewStatus != 'R' && g.isanswered != 1)
				  var totalcorrect = $scope.stpaper.filter(e => e.NewansnewStatus == 'R' && e.isanswered == 1)
				  var totalwrong = $scope.stpaper.filter(t => t.NewansnewStatus == 'W' && t.isanswered == 1)
				  $scope.FinalResult.totalattempted = attempted.length;
				  $scope.FinalResult.totalleft = left.length;
				  $scope.FinalResult.totalcorrect = totalcorrect.length;
				  $scope.FinalResult.totalwrong = totalwrong.length;
				  $scope.FinalResult.attemptdate = stdata.createdAt;
				  $scope.FinalResult.timespend = stdata.summary.Totaltimespent/60
				  $scope.FinalResult.examtime = stdata.ExamTime
				  $scope.FinalResult.totalquestions = $scope.stpaper.length
				  $scope.FinalResult.exampercentage = (totalcorrect.length/$scope.stpaper.length)*100;
				 // $scope.FinalResult=$scope.studentoldrestult.Questions[0].topic_master_name;
				  //$scope.FinalResult=$scope.studentoldrestult.Subjectname;
			   
	  
	  
				  
				 
				  $scope.resultjson[0].FinalResult = $scope.FinalResult;
	  
				//  console.log($scope.resultjson)
				  
				
				
				  
				  var summarypercent = $scope.FinalResult.exampercentage;
				  
							  
				  if(summarypercent>=70){
					  $scope.resultjson[0].FinalResult.bgcolor = '-green';	
					  $scope.resultjson[0].FinalResult.comment = 'Needs Refinement';
					  $scope.resultjson[0].FinalResult.feedback = 'STRONG IN';
				  }else if(summarypercent>=30){
					  $scope.resultjson[0].FinalResult.bgcolor = '-orange';
					  $scope.resultjson[0].FinalResult.comment = 'Needs Practice';
					  $scope.resultjson[0].FinalResult.feedback = 'AVERAGE IN';
				  }else{
					  $scope.resultjson[0].FinalResult.bgcolor = '-red';
					  $scope.resultjson[0].FinalResult.comment = 'Needs Basics';
					  $scope.resultjson[0].FinalResult.feedback = 'WEEK IN';
				  }	
	  
				  localStorage.setItem('examresultjson', JSON.stringify($scope.resultjson));
				  

				$http.get(apiurl+"/videos/"+$scope.resultjson[0].Subjects[0]+"/"+$scope.resultjson[0].TopicsArr[0].Topicname).success((data2)=>{
				
						$scope.practicevideostopic = $scope.resultjson[0].TopicsArr[0].Topicname;
						$scope.practiceexamvideoimg = data2.data[0].videoid;
					})
			})


		}
		 

		$scope.loadstatus=false;	
		$scope.form=1;
		
		if(JSON.parse($window.localStorage.getItem('subjectssession'))!=''){
			$scope.subjectlist = JSON.parse($window.localStorage.getItem('subjectssession'));

		}

	//	console.log($scope.userdata);
		
		$http.get(apiurl+"/topics/sujectwisedata").success((pdata)=>{
			console.log(pdata)
			$scope.alltopicslist = pdata;
			
			if($scope.userdata.stdCourse=='EAMCET'){
			var data = pdata.filter(e => e.Program[0].programname == 'EAMCET');
			}else if($scope.userdata.stdCourse=='JEE MAINS'){
				var data = pdata.filter(e => e.Program[0].programname == 'EAMCET');
			}else if($scope.userdata.stdCourse=='JEE ADV'){
				var data = pdata.filter(e => e.Program[0].programname == 'EAMCET');
			}else if($scope.userdata.stdCourse=='NEET'){
				var data1 = pdata.filter(e => e.Program[0].programname == $scope.userdata.stdCourse);
				var data2 = pdata.filter(e => e.Program[0].programname == 'EAMCET');

				for (var i=0; i<data2.length; i++){
					data1.push(data2[i]);
				}

				var data = data1.filter(e => e.Subjectname != 'MATHEMATICS');
				console.log(data)
			}

			console.log(data)

			var easydata = data.filter(e => e.qLevel == 'Easy');
			var avaragedata = data.filter(e => e.qLevel == 'Average');
			var difficultdata = data.filter(e => e.qLevel == 'Difficulty');
			var verydifficultdata = data.filter(e => e.qLevel == 'Very Difficulty');
			  

			var vcount =$filter('sumByColumn')(easydata,'vCount');
			var vcount =$filter('sumByColumn')(easydata,'vCount');
			var ecount =$filter('sumByColumn')(easydata,'eCount');

			var qcount =$filter('sumByColumn')(data,'qcount');
			var easyqcount =$filter('sumByColumn')(easydata,'qcount');
			var avarageqcount =$filter('sumByColumn')(avaragedata,'qcount');
			var difficultqcount =$filter('sumByColumn')(difficultdata,'qcount');
			var verydifficultqcount =$filter('sumByColumn')(verydifficultdata,'qcount');

			vcount = vcount*45;

			$scope.allsubjectinfo = {
					  "videoCount":vcount.toLocaleString('en-IN'),
					  "exceriseCount": ecount.toLocaleString('en-IN'),
					  "questionCount" : qcount.toLocaleString('en-IN'),
					  "easy" :easyqcount.toLocaleString('en-IN'),
					  "average" :avarageqcount.toLocaleString('en-IN'),
					  "difficult" :(difficultqcount+verydifficultqcount).toLocaleString('en-IN')
						  }


			//console.log($scope.allsubjectinfo);		  


			   $scope.totalsubjectlist = data;
			   var subjects=$filter('unique')($scope.totalsubjectlist,'Subjectname');
			  var maindata=[];
			  for(var i=0;i<subjects.length;i++){
				 // console.log(subjects[i]);
			  var singlesubjectdata = $scope.totalsubjectlist.filter(e => e.Subjectname == subjects[i]);
			
			  
			  var subjecttopics=$filter('unique')(singlesubjectdata,'topicName');

			  var easydata = singlesubjectdata.filter(e => e.qLevel == 'Easy');
			  var avaragedata = singlesubjectdata.filter(e => e.qLevel == 'Average');
			  var difficultdata = singlesubjectdata.filter(e => e.qLevel == 'Difficulty');
			  var verydifficultdata = singlesubjectdata.filter(e => e.qLevel == 'Very Difficulty');
				
			  //console.log(easydata);

			  var vcount =$filter('sumByColumn')(easydata,'vCount');
			  var vcount =$filter('sumByColumn')(easydata,'vCount');
			  var ecount =$filter('sumByColumn')(easydata,'eCount');

			  var qcount =$filter('sumByColumn')(singlesubjectdata,'qcount');
			  var easyqcount =$filter('sumByColumn')(easydata,'qcount');
			  var avarageqcount =$filter('sumByColumn')(avaragedata,'qcount');
			  var difficultqcount =$filter('sumByColumn')(difficultdata,'qcount');
			  var verydifficultqcount =$filter('sumByColumn')(verydifficultdata,'qcount');

			 // console.log(qcount);


			  maindata[i] = {
						"subjectName" : subjects[i],
						"topicCount" : subjecttopics.length.toLocaleString('en-IN'),
						"videoCount":vcount.toLocaleString('en-IN'),
						"exceriseCount": ecount.toLocaleString('en-IN'),
						"questionCount" : qcount.toLocaleString('en-IN'),
						"easy" :easyqcount.toLocaleString('en-IN'),
						"average" :avarageqcount.toLocaleString('en-IN'),
						"difficult" :(difficultqcount+verydifficultqcount).toLocaleString('en-IN')
							}

					
			  }
			  
			  $scope.subjectlist=maindata;
			  $window.localStorage.setItem('subjectssession',JSON.stringify($scope.subjectlist));
			  
			})
			
			
			if(JSON.parse($window.localStorage.getItem('selectedtopicsession'))!=null){
				$scope.topicslist = JSON.parse($window.localStorage.getItem('selectedtopicsession'));
	
			}else{
				$http.get(apiurl+"/topics/sujectwisedata").success((data)=>{
					$scope.totalsubjectlist=data;					

					var selectedsubjectdata = $scope.totalsubjectlist.filter(e => e.Subjectname == $scope.subjectlist[0].subjectName);

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
					  "subjectName":$scope.subjectlist[0].subjectName,
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
			$window.localStorage.setItem('selectedtopicsession',JSON.stringify($scope.topicslist));	

			});
			}
		}
		$scope.getSubjectWiseTopics=function(subid){
			
			var selectedsubjectdata = $scope.totalsubjectlist.filter(e => e.Subjectname == subid);
			$scope.subjectalltopicslist = selectedsubjectdata;
			console.log(selectedsubjectdata);
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
					  "subjectName":subid,
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
			$window.localStorage.setItem('selectedtopicsession',JSON.stringify($scope.topicslist));	


					
		}


		$http.get(apiurl+"/practicetest/student/all/"+$scope.userdata.stdMobileNo).success((data)=>{	
					
					$scope.practicetestresult = data;
					//console.log($scope.practicetestresult)
					var summarypercent=0;

					for(var i=0;i<$scope.practicetestresult.length;i++){
					
					if($scope.practicetestresult[i].summary!=undefined){	
						var summarypercent = $scope.practicetestresult[i].summary.percentage*1;
						
						if(summarypercent>=70){
							$scope.practicetestresult[i].bgcolor = '-green';	
							$scope.practicetestresult[i].comment = 'Needs Refinement';
							$scope.practicetestresult[i].feedback = 'STRONG IN';
						}else if(summarypercent>=30){
							$scope.practicetestresult[i].bgcolor = '-orange';
							$scope.practicetestresult[i].comment = 'Needs Practice';
							$scope.practicetestresult[i].feedback = 'AVERAGE IN';
						}else{
							$scope.practicetestresult[i].bgcolor = '-red';
							$scope.practicetestresult[i].comment = 'Needs Basics';
							$scope.practicetestresult[i].feedback = 'WEEK IN';
						}	
					}	
					}
					//$scope.colorbg = 'orange';
															
		})

		$http.get(apiurl+"/events/"+$scope.userdata.stdMobileNo).success((data)=>{	
				
					$scope.studytracker = data;
					console.log($scope.studytracker);
						$scope.userlastsession=data.filter(e => e.eventCategory =='Video');

					//	console.log(data);
						
						$scope.sampledate = new Date();

						$scope.videotracker = data.filter(e=>e.eventCategory=='Video');
						$scope.assignmenttracker = data.filter(e=>e.eventCategory=='Assignment');
						$scope.practicetracker = data.filter(e=>e.eventCategory=='PracticeExam');

						
						$scope.videoimespent=getSumElements($scope.videotracker, 'duration')
						$scope.assignimespent=getSumElements($scope.assignmenttracker, 'duration')
						$scope.practiceimespent=getSumElements($scope.practicetracker, 'duration')
						if (isNaN($scope.practiceimespent)) $scope.practiceimespent = 0;
						// console.log($scope.practiceimespent)
						$scope.totaltimespent=Math.round($scope.videoimespent+$scope.assignimespent+$scope.practiceimespent);
						// console.log($scope.totaltimespent)
															
		})


		$scope.searchTopic=function(sub,keyword){
			$scope.topicslist='';
			$scope.loadstatus=true;
		


			var obj={
				"programid": 2,
        		"keyvalue": keyword
			}
		
			$http.post(apiurl+"/topics/topicsearch/",obj).success((data)=>{	
				
			  
				
				//var selectedsubjectdata = data.filter(e=>e.Program.programname==$scope.userdata.stdCourse);
				var selectedsubjectdata=data;
				console.log(data);

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



				})
				$scope.loadstatus=false;
				//window.location='home.html#/dashboard';
				

		}
     
	

	$scope.show_videos=function(tpdata){
		 
		 $window.localStorage.setItem('selectopicinfo',JSON.stringify(tpdata));		 
		 window.location='home.html#/topicvideo';

		}	
		$scope.show_practicevideos=function(topics){
			//console.log(topics)
			var singlesubjectdata = $scope.totalsubjectlist.filter(e => e.topicName == topics);
			   
   
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
   
   
   
			maindata = {
					  "subjectId":singlesubjectdata[0].Subjectid,
					  "subjectName":$scope.subjectlist[0].subjectName,
					  "topicId" : singlesubjectdata[0].topicId,	
					  "topicName" : topics,
					  "videoCount":vcount.toLocaleString('en-IN'),
					  "exceriseCount": ecount.toLocaleString('en-IN'),
					  "questionCount" : qcount.toLocaleString('en-IN'),
					  "easy" :easyqcount.toLocaleString('en-IN'),
					  "average" :avarageqcount.toLocaleString('en-IN'),
					  "difficult" :(difficultqcount+verydifficultqcount).toLocaleString('en-IN')
						  }
   
				  
			
			
			$scope.topicslist=maindata;
			$window.localStorage.setItem('selectopicinfo',JSON.stringify($scope.topicslist));
			window.location='home.html#/topicvideo';
   
		   }	
	$scope.show_excercise=function(subid,subname,tpcid,tpcname){
	// 	sestopicobj = {
	// 		"subid":subid,
	// 		"subname": subname,
	// 		"tpcid": tpcid,
	// 		"tpcname" : tpcname
	//  }
	//  $window.localStorage.setItem('selectopicinfo',JSON.stringify(sestopicobj));
	//  window.location='home.html#/topicassignment';
		}		
	
	$scope.show_practice_exam=function(topicdata){
			//console.log(topicdata);	
			$window.localStorage.setItem('selectopicinfo',JSON.stringify(topicdata));
			window.location='home.html#/topicpractice';
		}
	$scope.show_ask_question=function(topicdata){
				
		$window.localStorage.setItem('selectopicinfo',JSON.stringify(topicdata));
			window.location='home.html#/topicaskme';
		}	
	
		$scope.playseenvideourl = '';
		$scope.playSeenVideo = function (idx,vdata) {
		//	console.log(vdata);
				$scope.idxvalue = idx;
				var seenvideourl = vdata[0].url.replace("https://youtu.be/", "https://youtube.com/embed/");
				$scope.playseenvideourl = $sce.trustAsResourceUrl(seenvideourl+"?showinfo=1&modestbranding=1&rel=0");
				
				// $scope.videoPlayMongo = {
				// 	"userId": $scope.userdata.stdMobileNo,
				// 	"eventCategory": 'Video',
				// 	"eventDetails": vdata,                  
				// }
				// //console.log($scope.videoPlayMongo);
				// $http({
				// 		withCredentials: false,
				// 		method: 'post',
				// 		url: apiurl'/events',
				// 		headers: { 'Content-Type': 'application/json' },
				// 		data: $scope.videoPlayMongo
				// 	}).success(function (data) {
				// 		//console.log(data);
				// 	});

			}    

		
		// swiper
	
	$scope.gotoback=function(){
		$scope.form=1;
	}

	


	function getSumElements(obj, field) {
        //console.log(obj);
        var total = 0;
        for (var i in obj)
            total += Number(obj[i][field]);
        return total;
    }
	
	$scope.logoutnow =  function(){

		$scope.videoPlayMongo = {
			"userId": $scope.userdata.stdMobileNo,
			"eventCategory": 'Logout',
			"eventDetails": $scope.userdata,                  
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


		 window.localStorage.removeItem('studentdata');
		window.location.href = 'index.html';
 
		 }
	
		 
		

		var swiper = new Swiper(".mySwiper", {
			slidesPerView: "auto",
			spaceBetween: 30,
			pagination: {
			  el: ".swiper-pagination",
			  clickable: true,
			},
		  });
		  var swiper = new Swiper(".secondswipper", {
			slidesPerView: "auto",
			spaceBetween: 10,
			pagination: {
			  el: ".swiper-pagination",
			  clickable: true,
			},
		  });
		  var swiper = new Swiper(".thirdswipper", {
			slidesPerView: "auto",
			spaceBetween: 10,
			pagination: {
			  el: ".swiper-pagination",
			  clickable: true,
			},
		  });
		  var swiper = new Swiper(".fourthswipper", {
			slidesPerView: "auto",
			spaceBetween: 10,
			pagination: {
			  el: ".swiper-pagination",
			  clickable: true,
			},
		  });
		  var swiper = new Swiper(".fifthswipper", {
			slidesPerView: "auto",
			spaceBetween: 10,
			pagination: {
			  el: ".swiper-pagination",
			  clickable: true,
			},
		  });
		
		  $scope.UpdateMathJax = function () {
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		};	

	
 });
