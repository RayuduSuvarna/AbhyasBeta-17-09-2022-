angular.module('AbhyasApp').controller('topicpractice',function($scope,$http,$filter,$timeout,$location, $localStorage,$window,$route,$rootScope,apiurl){

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
        
     $scope.selecttopicinfo = JSON.parse($window.localStorage.getItem('selectopicinfo'));
     
     console.log($scope.selecttopicinfo);
     $scope.topicidname=$scope.selecttopicinfo.title;

     $scope.str_replace = function (str) {
        var v = str.replace(/&quot;/g, '');
        return v.replace(/uploads/g, 'https://touchstone.aditya.ac.in/uploads/');
    }
    
    $scope.UpdateMathJax = function () {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    };

    $scope.formname = 'selection';
    //localStorage.clear();
    //var url = new URL(window.location.href);
    var stopped;
    
    
  
    $scope.loading=false;
    //Sumary report
    

   
    $http.get(apiurl + '/practicetest/levels').success(function (data) {
        $scope.levels = data;
    });

    
    $scope.studentoldrestult = JSON.parse(localStorage.getItem('spaper'));
    
    if($scope.studentoldrestult){ 
        $scope.showresults='';
        var stdata = '';

        //clearTimeout(myTimeout);
        $http.get(apiurl+'/practicetest/' + $scope.studentoldrestult.suc + '/' + $scope.studentoldrestult.uid).success(function (data) {
            console.log(data);
            $scope.formname = 'qr';

            stdata = data[0];
            $scope.stpaper = stdata.Questions;

            console.log(stdata.createdAt);

            $scope.Resobj = { 'totalattempted': '', 'totalwrong': '', 'totalcorrect': '', 'totalleft': '' }
            var attempted = $scope.stpaper.filter(e => e.isanswered == 1)
            var left = $scope.stpaper.filter(g => (g.NewansnewStatus != 'W' && g.isanswered != 1) || g.NewansnewStatus != 'R' && g.isanswered != 1)
            var totalcorrect = $scope.stpaper.filter(e => e.NewansnewStatus == 'R' && e.isanswered == 1)
            var totalwrong = $scope.stpaper.filter(t => t.NewansnewStatus == 'W' && t.isanswered == 1)
            $scope.Resobj.totalattempted = attempted.length;
            $scope.Resobj.totalleft = left.length;
            $scope.Resobj.totalcorrect = totalcorrect.length;
            $scope.Resobj.totalwrong = totalwrong.length;
            $scope.Resobj.attemptdate = stdata.createdAt;
            $scope.Resobj.timespend = stdata.summary.Totaltimespent/60
            $scope.Resobj.examtime = stdata.ExamTime
            $scope.topic_master_name=$scope.studentoldrestult.Questions[0].topic_master_name;
            $scope.subject_name=$scope.studentoldrestult.Subjectname;
            $scope.paper = $scope.stpaper;
            
            var summarypercent = $scope.studentoldrestult.summary.percentage*1;
            
						
            if(summarypercent>=70){
                $scope.bgcolor = '';	
                $scope.comment = 'Needs Refinement';
                $scope.feedback = 'STRONG IN';
            }else if(summarypercent>=30){
                $scope.bgcolor = '-orange';
                $scope.comment = 'Needs Practice';
                $scope.feedback = 'AVERAGE IN';
            }else{
                $scope.bgcolor = '-red';
                $scope.comment = 'Needs Basics';
                $scope.feedback = 'WEEK IN';
            }	
            
        });
    }

  
    $scope.showdiv = 1;
    //show question in exam
    $scope.Showquestions = function () {
        $scope.loading=true;
    $scope.showresults='';
        $scope.showdiv = 0;
        $scope.qerrmsg = '';
        $scope.topic_id = $(".select2").val();
               
        $scope.topic_id=[];
        $scope.topic_id.push($scope.selecttopicinfo.topicId);
        $scope.topic_array ={
            "Topicid" : $scope.selecttopicinfo.topicId,
            "Topicname" : $scope.selecttopicinfo.topicName
        }

        $scope.Sendobj = {
            "ExamType": "Chapter Type",
            "Subjects": [],
            "Subjectname": $scope.selecttopicinfo.subjectName,
            "TopicsArr": $scope.topic_array,
            "Topics": $scope.topic_id,
            "Level": $scope.level_id,
            "NoOfQueSub": $scope.limit,
            "ExamTime": $scope.timedurataion = 1,
            "examstatus": 'started',
            "Questions": [],
            "suc": $scope.userdata.stdMobileNo,
            "branch": 'ABHYAS',
            "section": $scope.userdata.stdCourse,
            "name": $scope.userdata.stdName,
        };

        
        console.log($scope.Sendobj)
        
        $scope.Sendobj.Subjects.push($scope.selecttopicinfo.subjectId);
        console.log($scope.Sendobj);
       // return false;
        $http.post(apiurl +'/practicetest', $scope.Sendobj).success(function (data) {
            console.log(data);
            if (data.status == 'No Questions found') {
                $scope.showdiv = 1;
                $scope.level_id = null;
                $scope.qerrmsg = 'There is no questions found !';
            } else {

                $scope.inserteddata = data;
                console.log($scope.inserteddata);
                //return false
                $scope.formname = 'exam';


                //data inserted
                $scope.counter = $scope.inserteddata.ExamTime * 1 * 60;
                console.log($scope.counter);


                localStorage.setItem('spaper', JSON.stringify($scope.inserteddata));
                $scope.studentpaper = JSON.parse(localStorage.getItem('spaper'));

                $scope.fpaper = $scope.studentpaper.Questions;
                console.log($scope.fpaper);
                //console.log(localStorage.getItem('time_left'));
                //return false;

               // $scope.counter = $scope.inserteddata.ExamTime * 1 * 60;
                console.log($scope.counter)
                $scope.countdown();
                $scope.StartExam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');


                $scope.previous_index = -1;
                $scope.currentindex = 0;
                $scope.selectedNumber = 0;
                $scope.fpaper[0].question_onscreen_time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

                for (var i = 0; i < $scope.fpaper.length; i++) {

                    if ($scope.fpaper[i].isanswered == undefined) {
                        $scope.fpaper[i].isanswered = 0;
                        $scope.fpaper[i].ingernewans = '';

                    }
                    for (var j = 0; j < $scope.fpaper[i].ans.length; j++) {
                        if ($scope.fpaper[i].ans[j].isanswered == undefined) {
                            $scope.fpaper[i].ans[j].isanswered = 0;
                        }
                    }
                }
                $scope.loading=false;
                //$scope.storingDefaultValue();


            }



        });


    }



    $scope.onNextFun = function (next) {
        $scope.selectedNumber = next + 1;
        $scope.CaliculateTime($scope.selectedNumber);
    }

    $scope.onPrevious = function (prev) {
        $scope.selectedNumber = prev - 1;
        $scope.CaliculateTime($scope.selectedNumber);
    }

    $scope.myfun = function (obj, idx, qtype, intval = '') {

        if ($scope.fpaper[$scope.selectedNumber].question_master_type == 1 || $scope.fpaper[$scope.selectedNumber].question_master_type == 2) {
            for (var i = 0; i < $scope.fpaper[$scope.selectedNumber].ans.length; i++) {
                $scope.fpaper[$scope.selectedNumber].ans[i].my_answer = 0;
            }
        }
        if (qtype == 4) {
            $scope.fpaper[$scope.selectedNumber].ingernewans = intval;
            var ansArrys = $scope.fpaper[$scope.selectedNumber].ans;
            for (var p = 0; p < ansArrys.length; p++) {
                $scope.fpaper[$scope.selectedNumber].ans[p].my_answer = 0;
                if (fixed2digit(ansArrys[p].answer_master_desc) == fixed2digit(intval) && ansArrys[p].answer_master_isright == 1) {
                    //console.log([ansArrys[p].answer_master_desc, fixed2digit(ansArrys[p].answer_master_desc), fixed2digit(intval)]);

                    //console.log(fixed2digit(ansArrys[p].answer_master_desc) + '==' + fixed2digit(intval));
                    $scope.fpaper[$scope.selectedNumber].ans[p].isanswered = 1;

                } else {
                    var danskey = p;
                }
            }
        } else if (qtype == 12) {
            $scope.fpaper[$scope.selectedNumber].ingernewans = intval;
            var ansArrys = $scope.fpaper[$scope.selectedNumber].ans;
            if (ansArrys[0].answer_master_desc == 'Single') {
                if (fixed2digit(ansArrys[1].answer_master_desc) == fixed2digit(intval)) {
                    $scope.fpaper[$scope.selectedNumber].ans[1].isanswered = 0;
                    $scope.fpaper[$scope.selectedNumber].ans[1].isanswered = 1;

                }
                else if (fixed2digit(ansArrys[2].answer_master_desc) == fixed2digit(intval)) {
                    $scope.fpaper[$scope.selectedNumber].ans[2].isanswered = 0;
                    $scope.fpaper[$scope.selectedNumber].ans[2].isanswered = 1;

                }
                else {
                    //console.log('wrong');
                    $scope.fpaper[$scope.selectedNumber].ans[0].isanswered = 1;
                    var danskey = p;

                }

            }
            else if (ansArrys[0].answer_master_desc == 'Range') {

                if (fixed2digit(ansArrys[1].answer_master_desc) * 1 <= fixed2digit(intval) && fixed2digit(ansArrys[2].answer_master_desc) * 1 >= fixed2digit(intval)) {
                    //console.log('Correct');
                    $scope.fpaper[$scope.selectedNumber].ans[1].isanswered = 1;

                } else {

                    var danskey = p;
                    //console.log('wrong');
                    $scope.fpaper[$scope.selectedNumber].ans[0].isanswered = 1;
                    var danskey = p;


                }

            }

        }
        //STORING MY_ANSWER VALUE AS ONE FOR CHECKED ANSWERS//

        if ($scope.fpaper[$scope.selectedNumber].ans[idx].my_answer == 1) {
            $scope.fpaper[$scope.selectedNumber].ans[idx].my_answer = 0;
        } else {
            $scope.fpaper[$scope.selectedNumber].ans[idx].my_answer = 1;
        }
        $scope.fpaper[$scope.selectedNumber].newpoints = $scope.calculatenewpoints($scope.fpaper[$scope
            .selectedNumber].ans, $scope.selectedNumber, $scope.fpaper);
        $scope.fpaper[$scope.selectedNumber].newpoints = parseInt(this.fpaper[$scope.selectedNumber]
            .newpoints);
        $scope.fpaper[$scope.selectedNumber].isanswered = 1;
        //console.log($scope.fpaper[$scope.selectedNumber]);
        if ($scope.selectedNumber == 0) {
            $scope.fpaper[$scope.selectedNumber].question_offscreen_time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

            var d1 = new Date($scope.fpaper[$scope.selectedNumber].question_offscreen_time).getTime();
            var d2 = new Date($scope.fpaper[$scope.selectedNumber].question_onscreen_time).getTime();

            //console.log($scope.fpaper[$scope.selectedNumber].question_onscreen_time, $scope.fpaper[0].question_offscreen_time)
            //console.log(d2,d1)  
            $scope.fpaper[$scope.selectedNumber].time_spent = (d1 - d2) / 1000;
        }
        var Sendobj = {
            "suc": $scope.studentpaper.suc,
            "uid": $scope.studentpaper.uid,
            "questionid": $scope.fpaper[$scope.selectedNumber].question_master_id,
            "ans": $scope.fpaper[$scope.selectedNumber].ans,
            "time_spent": $scope.fpaper[$scope.selectedNumber].time_spent,
            "TimeLeft": $scope.inserteddata.TimeLeft,
            "newpoints": $scope.fpaper[$scope.selectedNumber].newpoints,
            "NewansnewStatus": $scope.fpaper[$scope.selectedNumber].NewansnewStatus,
            "examstatus": 'continue'
        }
        console.log(Sendobj);
        // localStorage.setItem($scope.getdata.uid + 'fpaper', JSON.stringify($scope.fpaper));
        // $scope.fpaper = JSON.parse(localStorage.getItem($scope.getdata.uid + 'fpaper'));

        $scope.updateQuestion(Sendobj);

    }

    $scope.updateQuestion = function (Sendobj) {
        console.log(Sendobj);
        //localStorage.setItem($scope.getdata.uid + 'pract_paper', JSON.stringify($scope.getdata));
        //	$scope.inserteddata = JSON.parse(localStorage.getItem($scope.getdata.uid + 'pract_paper'));
        //	console.log($scope.inserteddata);

        $http.post(apiurl+'/practicetest/updatequestion', Sendobj).success(function (data) {
            console.log(data);
            $scope.inserteddata = data;
            //localStorage.setItem($scope.getdata.uid + 'fpaper', JSON.stringify(data.Questions));
            localStorage.setItem('spaper', JSON.stringify($scope.inserteddata));
                $scope.studentpaper = JSON.parse(localStorage.getItem('spaper'))
                //console.log($scope.studentpaper);
        });
        
        console.log('Initially ' + (window.navigator.onLine ? 'on' : 'off') + 'line');
        $scope.checkinternet = window.navigator.onLine ? 'on' : 'off'
    }
    $scope.CaliculateTime = function (selectque) {
        //console.log(selectque);

        $scope.fpaper[selectque - 1].time_spent = 0;
        // STORING ONSCREEN TIME TO THE QUESTION PAPER ARRYA //

        $scope.fpaper[selectque].question_onscreen_time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        // STORING OFFSCREEN TIME TO THE QUESTION PAPER ARRYA //
        $scope.fpaper[selectque].question_offscreen_time = $scope.fpaper[selectque - 1].question_onscreen_time;

        var d1 = new Date($scope.fpaper[selectque].question_offscreen_time).getTime();
        var d2 = new Date($scope.fpaper[selectque].question_onscreen_time).getTime();

        $scope.fpaper[selectque].time_spent = parseFloat($scope.fpaper[selectque - 1].time_spent) + (d2 - d1) / 1000;

        //var Difference_In_Time = d2-d1;
        //$scope.fpaper[selectque].time_spent=Difference_In_Time / (1000 * 3600 * 24);
        //console.log(d1-d2);
        //console.log(selectque);
        //console.log($scope.fpaper[selectque].time_spent);

        //localStorage.setItem($scope.getdata.uid + 'fpaper', JSON.stringify($scope.fpaper));
        //$scope.fpaper = JSON.parse(localStorage.getItem($scope.getdata.uid + 'fpaper'));

    }
    $scope.calculatenewpoints = function (ans, selectedquestion, fpaper) {
        var newpoints = 0;

        var is_master_rightss = $filter('filter')(ans, { answer_master_isright: 1 });

        var wrong = $filter('filter')(ans, { answer_master_isright: 0, my_answer: 1 });

        var right = $filter('filter')(ans, { answer_master_isright: 1, my_answer: 1 });
        if (wrong.length > 0) {
            fpaper[selectedquestion].NewansnewStatus = 'W';
            return newpoints = 0;
        }


        if (wrong.length == 0) {

            if (is_master_rightss.length == right.length) {
                fpaper[selectedquestion].NewansnewStatus = 'R';
                newpoints = 1;
                return newpoints

            } else {
                var rightLength = right.length;
                fpaper[selectedquestion].NewansnewStatus = 'R';
                newpoints = (1 * parseFloat(rightLength));

                return newpoints

            }

        }



    }

    $scope.btnClick = function (i = '', qtype = '', getVCal = '', bval) {
        console.log(i + '--' + qtype + '--' + getVCal + '--' + bval);
        if (bval >= 0) {
            if ($scope.intergerQue == '' || $scope.intergerQue == undefined) {
                $scope.intergerQue = '';
            }
            $scope.intergerQue = $scope.intergerQue + bval;

        } else if (bval == '.') {

            if ($scope.intergerQue.indexOf('.') > -1) {

            } else {
                var pos = f1(document.getElementById('intinput'));
                //alert(pos);
                if (pos == 0) {
                    $scope.intergerQue = $scope.intergerQue + bval;
                } else {
                    var x = $scope.intergerQue.toString();

                    $scope.intergerQue = $scope.intergerQue.substr(0, pos) + '.' + $scope.intergerQue.substr(pos);
                }
            }


            //$scope.intergerQue = $scope.intergerQue+bval;
        } else if (bval == '-') {

            if ($scope.intergerQue.indexOf('-') > -1) {
                //alert("hello found inside your_string");
            } else {
                var charpos = f1(document.getElementById('intinput'));
                if (charpos == 0) {
                    $scope.intergerQue = bval + $scope.intergerQue;
                }
            }

        }

        if (bval == '3') {
            $scope.intergerQue = '';
            $scope.clearresp(i);
        } else if (bval == 'back') {
            //$scope.intergerQue = $scope.intergerQue.slice(0, -1);

            var pos = f1(document.getElementById('intinput'));

            if (pos == 0) {
                $scope.intergerQue = $scope.intergerQue.slice(0, -1);
            }

            if (pos != 0) {
                var x = $scope.intergerQue.toString();

                $scope.intergerQue = x.slice(0, pos - 1) + x.slice(pos);
                // setCaretToPos($("#intinput")[0], 4);

            }

        }

        $scope.myfun($scope.fpaper[i], i, qtype, $scope.intergerQue);
    }

    $scope.submitexam = function (arg, ind) {
        //$scope.inserteddata = JSON.parse(localStorage.getItem($scope.getdata.uid + 'pract_paper'));
        // console.log($scope.fpa)
console.log($scope.studentpaper.Questions);
            
        var attempted = $scope.fpaper.filter(e => e.isanswered == 1)
        var left = $scope.fpaper.filter(g => (g.NewansnewStatus != 'W' && g.isanswered != 1) || g.NewansnewStatus != 'R' && g.isanswered != 1)
        var totalcorrect = $scope.fpaper.filter(e => e.NewansnewStatus == 'R' && e.isanswered == 1)
        var totalwrong = $scope.fpaper.filter(t => t.NewansnewStatus == 'W' && t.isanswered == 1)

        console.log(attempted.length, '-', totalcorrect.length, '-', totalwrong.length)
        //return false;
        var noofattempted=$scope.studentpaper.Questions.filter(e => e.isanswered == 1);
        console.log(noofattempted);
        $scope.Totaltimespent=getSumElements(noofattempted, 'time_spent')
        
        //prepare summary object
        //$scope.EndExam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        //console.log($scope.EndExam, $scope.StartExam);
        //var d1 = new Date($scope.EndExam).getTime();
        //var d2 = new Date($scope.StartExam).getTime();

        //$scope.Totaltimespent = (d1 - d2) / 1000;


        var studentsummary = {
            "suc": $scope.inserteddata.suc,
            "uid": $scope.inserteddata.uid,
            "subject": $scope.studentpaper.Questions[0].subject_master_name,
            "Topics": $scope.topic_array,
            "nofque": $scope.fpaper.length,
            "R": totalcorrect.length,
            "W": totalwrong.length,
            "L": left.length,
            "Marks": (totalcorrect.length) * 1,
            "Totaltimespent": $scope.Totaltimespent,
            "percentage": ((totalcorrect.length) * 1 / ($scope.inserteddata.Questions.length)) * 100,
        };
        console.log(studentsummary);
        console.log($scope.fpaper[ind]);
        if (ind != undefined && ind != '' && ind != null && ind != 'null' && $scope.fpaper[ind].isanswered == 1) {
            var Sendobj = {
                "suc": $scope.studentpaper.suc,
                "uid": $scope.studentpaper.uid,
                "questionid": $scope.fpaper[ind].question_master_id,
                "ans": $scope.fpaper[ind].ans,
                "time_spent": $scope.fpaper[ind].time_spent,
                "TimeLeft": $scope.inserteddata.TimeLeft,
                "newpoints": $scope.fpaper[ind].newpoints,
                "NewansnewStatus": $scope.fpaper[ind].NewansnewStatus,
                "examstatus": 'completed',
                "summary": studentsummary
            }

            $http.post(apiurl+'/practicetest/updatequestion', Sendobj).success(function (data) {
                //console.log(data);
                $scope.inserteddata = data;
                localStorage.setItem('spaper', JSON.stringify($scope.inserteddata));
                $scope.studentpaper = JSON.parse(localStorage.getItem('spaper'))
                //localStorage.setItem($scope.getdata.uid + 'fpaper', JSON.stringify(data.Questions));
                //$scope.fpaper = JSON.parse(localStorage.getItem($scope.getdata.uid + 'fpaper'));
                //console.log($scope.fpaper);
            });


        }
        if (arg == 'test') {
            $scope.leftquestions = $scope.fpaper.filter(g => (g.NewansnewStatus != 'W' && g.isanswered != 1) || g.NewansnewStatus != 'R' && g.isanswered != 1)
            //console.log($scope.leftquestions);

        } else if (arg == false) {
            return false;
        } else if (arg == true) {

            console.log('submited exam' + ind);
            console.log($scope.studentpaper.Questions);
            var attempted = $scope.fpaper.filter(e => e.isanswered == 1)
            var left = $scope.fpaper.filter(g => (g.NewansnewStatus != 'W' && g.isanswered != 1) || g.NewansnewStatus != 'R' && g.isanswered != 1)
            var totalcorrect = $scope.fpaper.filter(e => e.NewansnewStatus == 'R' && e.isanswered == 1)
            var totalwrong = $scope.fpaper.filter(t => t.NewansnewStatus == 'W' && t.isanswered == 1)

            console.log(attempted.length, '-', totalcorrect.length, '-', totalwrong.length)
            //return false;

            //prepare summary object
            //$scope.EndExam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            //console.log($scope.EndExam, $scope.StartExam);
            //var d1 = new Date($scope.EndExam).getTime();
            //var d2 = new Date($scope.StartExam).getTime();

            //$scope.Totaltimespent = (d1 - d2) / 1000;
            console.log(getSumElements(totalcorrect, 'time_spent'), '---', getSumElements(totalwrong, 'time_spent'), '----', getSumElements(left, 'time_spent'))
            //$scope.Totaltimespent = getSumElements(totalcorrect, 'time_spent') + getSumElements(totalwrong, 'time_spent') + getSumElements(left, 'time_spent');
            //console.log($scope.Totaltimespent);
            var noofattempted=$scope.studentpaper.Questions.filter(e => e.isanswered == 1);
            console.log(noofattempted);
            $scope.Totaltimespent=getSumElements(noofattempted, 'time_spent')
            var studentsummary = {
                "suc": $scope.inserteddata.suc,
                "uid": $scope.inserteddata.uid,
                "subject": $scope.studentpaper.Questions[0].subject_master_name,
                "Topics": $scope.topic_array,
                "nofque": $scope.fpaper.length,
                "R": totalcorrect.length,
                "W": totalwrong.length,
                "L": left.length,
                "Marks": (totalcorrect.length) * 1,
                "Totaltimespent": $scope.Totaltimespent,
                "percentage": ((totalcorrect.length) * 1 / ($scope.inserteddata.Questions.length)) * 100,
            };
            console.log(studentsummary);
            if(ind==''){
                ind=$scope.selectedNumber;
            }
            //console.log($scope.fpaper[ind]);
            //if (ind != undefined && ind != '' && ind != null && ind != 'null' && $scope.fpaper[ind].isanswered == 1) {
            var Sendobj = {
                "suc": $scope.studentpaper.suc,
                "uid": $scope.studentpaper.uid,
                "questionid": $scope.fpaper[ind].question_master_id,
                "ans": $scope.fpaper[ind].ans,
                "time_spent": $scope.fpaper[ind].time_spent,
                "TimeLeft": $scope.inserteddata.TimeLeft,
                "newpoints": $scope.fpaper[ind].newpoints,
                "NewansnewStatus": $scope.fpaper[ind].NewansnewStatus,
                "examstatus": 'completed',
                "summary": studentsummary
            }
            console.log(Sendobj);
            $http.post(apiurl+'/practicetest/updatequestion', Sendobj).success(function (data) {
                //console.log(data);
                $scope.inserteddata = data;
                $scope.showqr($scope.studentpaper.suc, $scope.studentpaper.uid)
                //localStorage.clear();
                localStorage.setItem('time_left', '');
                $scope.formname = 'qr';
                //localStorage.setItem($scope.getdata.uid + 'fpaper', JSON.stringify(data.Questions));
                //$scope.fpaper = JSON.parse(localStorage.getItem($scope.getdata.uid + 'fpaper'));
                //console.log($scope.fpaper);
            });


            //}




        }


    }

    

    $scope.showqr = function (suc, uuserid) {
        
        $scope.showresults='';
        var stdata = '';
        $timeout.cancel(stopped);
        $scope.counter = 0;
        $scope.inserteddata = '';
        localStorage.setItem('time_left', '');

        //clearTimeout(myTimeout);
        $http.get(apiurl+'/practicetest/' + suc + '/' + uuserid).success(function (data) {
            console.log(data);
            $scope.formname = 'qr';

            stdata = data[0];

            $scope.topic_master_name=stdata.Questions[0].topic_master_name;
            $scope.subject_name=stdata.Subjectname;
            
            $scope.stpaper = stdata.Questions;
            //console.log($scope.stpaper);
            $scope.Resobj = { 'totalattempted': '', 'totalwrong': '', 'totalcorrect': '', 'totalleft': '' }
            var attempted = $scope.stpaper.filter(e => e.isanswered == 1)
            var left = $scope.stpaper.filter(g => (g.NewansnewStatus != 'W' && g.isanswered != 1) || g.NewansnewStatus != 'R' && g.isanswered != 1)
            var totalcorrect = $scope.stpaper.filter(e => e.NewansnewStatus == 'R' && e.isanswered == 1)
            var totalwrong = $scope.stpaper.filter(t => t.NewansnewStatus == 'W' && t.isanswered == 1)
            $scope.Resobj.totalattempted = attempted.length;
            $scope.Resobj.totalleft = left.length;
            $scope.Resobj.totalcorrect = totalcorrect.length;
            $scope.Resobj.totalwrong = totalwrong.length;
            $scope.Resobj.attemptdate = stdata.createdAt;
            $scope.Resobj.timespend = stdata.summary.Totaltimespent/60
            $scope.Resobj.examtime = stdata.ExamTime
            $scope.topic_master_name=$scope.studentoldrestult.Questions[0].topic_master_name;
            $scope.subject_name=$scope.studentoldrestult.Subjectname;
            $scope.paper = $scope.stpaper;
            
            var summarypercent = $scope.studentoldrestult.summary.percentage*1;
            
						
            if(summarypercent>=70){
                $scope.bgcolor = '';	
                $scope.comment = 'Needs Refinement';
                $scope.feedback = 'STRONG IN';
            }else if(summarypercent>=30){
                $scope.bgcolor = '-orange';
                $scope.comment = 'Needs Practice';
                $scope.feedback = 'AVERAGE IN';
            }else{
                $scope.bgcolor = '-red';
                $scope.comment = 'Needs Basics';
                $scope.feedback = 'WEEK IN';
            }	
        });
    }


  
    //CountDown for Exam Time Left

    $scope.countdown = function () {
        stopped = $timeout(function () {
            if ($scope.counter == 0) {
                $scope.submitexam(true, '');
                $scope.stop();
                return;
            }
            $scope.counter--;
            localStorage.setItem('time_left', $scope.counter);
            $scope.inserteddata.TimeLeft = $scope.counter;
            $scope.countdown();
        }, 1000);

    };

    //Stoper
    $scope.stop = function () {
        $timeout.cancel(stopped);
        localStorage.setItem('time_left', '');
        //localStorage.clear();
    }
    //Converting Time to HH:MM:SS	
    $scope.secondsToTime = function (secs) {
      //  console.log(secs);
      if(secs!=undefined){
        const sec = parseInt(secs, 10); // convert value to number if it's string
        let hours = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        if (!isNaN(secs))
            $scope.fpaper.time_left = secs;
        console.log(secs);
        localStorage.setItem('time_left', $scope.fpaper.time_left);
        return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
      }

    }




//show all results end 
    function fixed2digit(x) {
        return Number.parseFloat(x.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]).toFixed(2);
    }
    


    function getSumElements(obj, field) {
        //console.log(obj);
        var total = 0;
        for (var i in obj)
            total += Number(obj[i][field]);
        return total;
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



            })
            $scope.loadstatus=false;
            window.location='home.html#/dashboard';
            

    }

});
