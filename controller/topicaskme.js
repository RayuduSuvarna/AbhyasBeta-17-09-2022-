angular.module('AbhyasApp').controller('topicaskme',function($scope,$http,$filter,$location, $localStorage,$window,$route,$rootScope,apiurl){

    var apiurl = apiurl.getUrl();
    if(!$window.localStorage.getItem('studentdata')){
           window.location.href = 'home.html';
       }
       $scope.userdata = JSON.parse($window.localStorage.getItem('studentdata'));
       
      // console.log($scope.userdata);
       
       $scope.logountnow =  function(){
            window.localStorage.removeItem('studentdata');
           window.location.href = 'index.html';
        }

        // Image Upload Script
        $scope.SelectFile = function (e) {

            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.PreviewImage = e.target.result;
                $scope.$apply();
            };
            reader.readAsDataURL(e.target.files[0]);
        };


        $scope.selecttopicinfo = JSON.parse($window.localStorage.getItem('selectopicinfo'));
       $scope.pagereload = function(){
           location.reload()
       }
       $scope.gotoback=function(){
        window.location.href = 'home.html#/dashboard';
    } 

   
    $http.get(apiurl+"/askme/"+$scope.userdata.stdMobileNo).success((data)=>{
        $scope.askedquestions = data;
       // console.log($scope.askedquestions);
    })

    
       $scope.upload_question=function(qmsg){
        // console.log(qmsg)
         //  console.log('welcome')
           var fd = new FormData();
           var files = document.getElementById('upload').files[0];
          console.log(files);
           fd.append('file',files);
           
           $http({ method: 'post', url: 'controller/qrupload.php',data: fd, headers: {'Content-Type': undefined},}).then(function successCallback(response) { 
           
             var imgpath = response.data.name;
              //    console.log(imgpath);
                  $scope.userdata = JSON.parse($window.localStorage.getItem('studentdata'));
                  $scope.subjectdata = JSON.parse($window.localStorage.getItem('selectopicinfo'));
                //  console.log($scope.userdata);
                //  console.log($scope.subjectdata);
                  var obj={
                      userId: $scope.userdata.stdMobileNo,
                      topicId: $scope.subjectdata.topicId,
                      subjectId: $scope.subjectdata.subjectId,
                      questionImg : imgpath,
                      questionDesc : qmsg
                  }
                 console.log(obj);
                      $http.post(apiurl+"/askme/", obj).success((data)=>{
                        //  console.log(data);
                          location.reload();
                      
                          
                      })
                   });
         
       } 



       $scope.searchTopic=function(sub,keyword){
        $scope.topicslist='';
        $scope.loadstatus=true;
    


        var obj={
            "programid": 2,
            "keyvalue": keyword
        }
       // console.log(obj);
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
          //  console.log($scope.topicslist)
            $window.localStorage.setItem('selectedtopicsession',JSON.stringify($scope.topicslist));	



            })
            $scope.loadstatus=false;
            window.location='home.html#/dashboard';
            

    }

        

        /*  ==========================================
            SHOW UPLOADED IMAGE
        * ========================================== */
        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                   
                    $('#imageResult')
                        .attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        $(function () {
            $('#upload').on('change', function () {
                readURL(input);
            });
        });

        /*  ==========================================
            SHOW UPLOADED IMAGE NAME
        * ========================================== */
  
        var input = document.getElementById( 'upload' );
        
        $scope.infoArea = document.getElementById( 'upload-label' );

        input.addEventListener( 'change', showFileName );
        $scope.activeupload = 0;
        function showFileName( event ) {

            var input = event.srcElement;
            var fileName = input.files[0].name;
            // console.log(fileName);
            // if(fileName==null){
            //     $scope.bfilename = 'Upload File';

            // }else{
            //     $scope.bfilename = 'File Uploaded';

            // }
            $scope.infoArea.textContent = 'File Uploaded';
            $scope.activeupload = 1;
        }
        
        







});
