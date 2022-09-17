var app = angular.module("AbhyasApp", ['ngRoute','ngStorage','oc.lazyLoad']);

 app.service('apiurl', function () {
    var apipath = "api"; 
    var apipath = 'https://abhyas.aditya.ac.in/beta/api';
    //var apipath = 'http://10.60.1.22:3400/api';
    // var apipath = 'http://10.70.3.94:3400/api';
      
		return {
			getUrl: function() {
				return apipath;
			}
		} 
    });
     
    
      app.filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

	

  app.filter('unique', function() {
   return function(collection, keyname) {
      var output = []; 
        angular.forEach(collection, function(item) {
			if(output.indexOf(item[keyname]) === -1) 
				output.push(item[keyname]);
      });
      return output;
   };
});
  

app.filter('capitalize', function() {
  return function(input) {
    return (angular.isString(input) && input.length > 0) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : input;
  }
});


  app.filter('sumByColumn', function () {
      return function (collection, column) {
        var total = 0;

        collection.forEach(function (item) {
          total += parseInt(item[column]);
        });

        return total;
      };
    });
app.config([ "$ocLazyLoadProvider", function($ocLazyLoadProvider) {
		$ocLazyLoadProvider.config({
		    'debug': true, // For debugging 'true/false'
		    'events': true, // For Event 'true/false'
		    'modules': [{ // Set modules initially
		        name : 'dashboard', // State1 module
		        files: ['controller/dashboard.js']
		    },
        { // Set modules initially
              name : 'usermaster', 
              files: ['controller/usermaster.js']
          },
        { // Set modules initially
              name : 'studentprofile', 
              files: ['controller/studentprofile.js']
          },
          { // Set modules initially
                name : 'topicvideo', 
                files: ['controller/topicvideo.js']
            }
            ,
            { // Set modules initially
                  name : 'topicassignment', 
                  files: ['controller/topicassignment.js']
              }
              ,
          { // Set modules initially
                name : 'topicpractice', 
                files: ['controller/topicpractice.js']
            }
            ,
          { // Set modules initially
                name : 'topicaskme', 
                files: ['controller/topicaskme.js']
            } ,
            { // Set modules initially
              name : 'askmeupload', 
              files: ['controller/askmeupload.js']
          }
          
        
     ]
		});
   }]);
app.config(function($routeProvider) {
	$routeProvider
		.when('/dashboard', {
			templateUrl: 'html/dashboard.html',
			controller: 'Dashboard',
      resolve: {
            LazyLoadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('dashboard'); // Resolve promise and load before view 
            }]
         }
		})
    .when('/usermaster', {
			templateUrl: 'html/usermaster.html',
			controller: 'usermaster',
      resolve: {
            LazyLoadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('usermaster'); // Resolve promise and load before view 
            }]
         }
		})
	 .when('/studentprofile', {
			templateUrl: 'html/studentprofile.html',
			controller: 'studentprofile',
      resolve: {
            LazyLoadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('studentprofile'); // Resolve promise and load before view 
            }]
         }
		})
    .when('/topicvideo', {
			templateUrl: 'html/topicvideo.html',
			controller: 'topicvideo',
      resolve: {
            LazyLoadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('topicvideo'); // Resolve promise and load before view 
            }]
         }
		})
    .when('/topicassignment', {
			templateUrl: 'html/topicassignment.html',
			controller: 'topicassignment',
      resolve: {
            LazyLoadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('topicassignment'); // Resolve promise and load before view 
            }]
         }
		})
    .when('/topicpractice', {
			templateUrl: 'html/topicpractice.html',
			controller: 'topicpractice',
      resolve: {
            LazyLoadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('topicpractice'); // Resolve promise and load before view 
            }]
         }
		})
    .when('/topicaskme', {
			templateUrl: 'html/topicaskme.html',
			controller: 'topicaskme',
      resolve: {
            LazyLoadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('topicaskme'); // Resolve promise and load before view 
            }]
         }
		})
    .when('/askmeupload', {
			templateUrl: 'html/askmeupload.html',
			controller: 'askmeupload',
      resolve: {
            LazyLoadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load('askmeupload'); // Resolve promise and load before view 
            }]
         }
		})
		.otherwise({
			redirectTo: '/dashboard'
		});
}).run(['$rootScope', '$location', function($rootScope, $location){
   var path = function() { return $location.path();};
   $rootScope.$watch(path, function(newVal, oldVal){
     $rootScope.activetab = newVal;
   });
   }]);
