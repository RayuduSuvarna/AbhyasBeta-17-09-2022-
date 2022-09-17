angular.module('AbhyasApp').controller('studentprofile',function($scope,$http,$filter,$location, $localStorage,$window,$route,$rootScope,apiurl){

    var apiurl = apiurl.getUrl();
    if(!$window.localStorage.getItem('studentdata')){
           window.location.href = 'home.html';
       }
       $scope.userdata = JSON.parse($window.localStorage.getItem('studentdata'));
       console.log($scope.userdata.stdCourse);
       $scope.studentcourse = $scope.userdata.stdCourse;

            
            
            $scope.updateprofile = function(dt){
               
                console.log("welcome is working")
                 console.log(dt)
                var obj={

                        "stdName": dt.stdName,
                        "stdMobileNo": dt.stdMobileNo,
                        "stdCourse": dt.stdCourse,
                        "stdEmail": dt.stdEmail,
                        "stdCity": dt.stdCity,
                        "stdCollege": dt.stdCollege,
                        "parentName": dt.parentName,
                        "parentMobile": dt.parentMobile,
                        "stdGender": dt.stdGender,
                        "stdBoard": dt.stdBoard,
                        "stdClass": dt.stdClass,
                    }
                   console.log(obj);
               
                    $http.patch(apiurl+'/profile/updateprofile/'+dt.stdMobileNo,obj).success((data) => {
                        console.log(data);

                       localStorage.setItem('studentdata',  JSON.stringify(obj));
                       console.log(JSON.parse($window.localStorage.getItem('studentdata')))
                      location.reload(); 
                    });

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
            $scope.radioaditya = function(){
                $scope.showdiv=1;
            }
            $scope.radioother = function(){
                $scope.showdiv=2;
            }

            $scope.getsuc = function(suc,ch){
                if(suc==1234){
                    $scope.showdiv=2;
                }else{
                    $scope.error="wrong SUC code";
                }
                // alert(ch);
            }


       $scope.pagereload = function(){
           location.reload()
       }

});
