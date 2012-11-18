'use strict';

/*
 * Main Controller
 * create a global scope with routing information
**/
function MainCtrl($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.route = $route;
}

/*
 * General Controller
 * Controlling general settings
**/
function GeneralCtrl($scope){

}

/*
 * User Controller
 * Controlling user settings
 * getState()
 * getUser()
 * edit()
 * cancel()
 * addUser()
 * updateUser()
 * reset()
 * deleteUser()
**/
function UsersCtrl($scope,$resource,$filter){
	$scope.Users = $resource('/rest/users/:userId', {}, { update: { method: 'PUT' } });
	var orderByFilter = $filter('orderBy');
	$scope.Users.get(function(r){ $scope.users = {data: orderByFilter(r.data, 'dateCreated', true)} });

	$scope.$on('updateUserImage', function(e, a){
		$scope.$apply(function(){
			$scope.user.image[a.target]= a.result;
		});
	})

	$scope.user = {_id: null}
	$scope.master = {};
	$scope.state = 'Closed';
	$scope.editState = false;

	$scope.getState = function(_userId){
		if ($scope.user._id == _userId){
			return 'selected';
		}
	}

	$scope.getUser = function(_userId, index){
		$scope.files = [];
		if ($scope.state == 'Open' && $scope.user._id == _userId) {
			$scope.state = 'Closed';
			$scope.user._id = null;
		 } else {
			$scope.Users.get({userId:_userId},function(resp){
				$scope.user = resp.data;
				$scope.state = 'Open';
				$scope.index = index;
				var tmp = 0;
				resp.data.meta.rates.forEach(function(key, value){
					tmp = tmp + value.rate;
				});
				$scope.average = (resp.data.meta.rates.length > 0 ) ? tmp / resp.data.meta.rates.length : 0;
				$scope.editState = false;
			});
		}
	}

	$scope.edit = function(data){
		$scope.master = angular.copy(data);
		$scope.editState = !$scope.editState;
	}

	$scope.cancel = function(){
		$scope.master = {};
		$scope.editState = !$scope.editState;
	}

	$scope.addUser = function(){
		$scope.Users.save({}, function(resp){
			$scope.users.data.unshift(resp.data);
		});
	}

	$scope.updateUser = function(_userId,_data,_index){
		$scope.master = angular.copy(_data);
		var obj = {
			meta: {
				timer: _data.meta.timer
			},
			name: {
				first: _data.name.first,
				last: _data.name.last
			},
			description: _data.description
		}
		$scope.Users.update({userId:_userId}, obj, function(resp){
			console.log($scope.users.data);
			angular.extend($scope.users.data[_index], _data);
			$scope.editState = false;
		});
	}

	$scope.reset = function(){
		$scope.files = [];
		$scope.user = $scope.master;
	}

	$scope.deleteUser = function(_userId){
		$scope.Users.delete({userId:_userId}, function(resp){
			return $scope.users.data.splice($scope.index,1);
		});
	}
}

function UploadCtrl($scope){
	$scope.fd = {};
	$scope.xhr = {};
	$scope.fileBuffer = [];
	$scope.files = [];
	$scope.progress = {
		small: 0,
		thumb: 0,
		large: 0
	};
	$scope.progressVisible = {
		small: true,
		large: true,
		thumb: true
	}
	$scope.uploadVisible = {
		small: false,
		large: false,
		thumb: false
	}

	$scope.prepareUpload = function(_file,_target){
		var imageType = /image.*/
		if(!_file.type.match(imageType)){ 
			return alert('only images allowed');
		} else {
			var reader = new FileReader();
			reader.onload = (function (file){
				return function (env){
					$scope.$emit('updateUserImage', {
						result: env.target.result, 
						target: _target
					});
				}
			}(_file))
			reader.readAsDataURL(_file);
		}
	}

	$scope.setFiles = function (_element,_target) {
		$scope.$apply(function ($scope) {
			for (var i=0;i<_element.files.length;i++){
				var obj = {
					file: _element.files[i],
					target: _target
				};
				$scope.fileBuffer[_target] = obj;
				$scope.files[_target] = obj;
				$scope.prepareUpload(_element.files[i], _target);
				$scope.uploadVisible[_target] = true;
			}
		});
	};

	$scope.upload = function(_userId,_target){
		$scope.fd[_target] = new FormData();
		$scope.fd[_target].append('userId', _userId);
		$scope.fd[_target].append('target', _target);
		$scope.fd[_target].append(_target, $scope.fileBuffer[_target].file);
		$scope.xhr[_target] = new XMLHttpRequest();
        $scope.xhr[_target].upload.addEventListener("progress", function(e){
        	$scope.progressVisible[_target] = true;
        	$scope.uploadVisible[_target] = false;
        	uploadProgress(e,_target);
        }, false);
        $scope.xhr[_target].addEventListener( "load", function(e){
        	uploadComplete(JSON.parse(e.target.responseText),_userId,_target);
        }, false);
        $scope.xhr[_target].addEventListener( "error", function(e){
        	uploadFailed(JSON.parse(e.target.responseText),_target);
        }, false);
        $scope.xhr[_target].addEventListener("abort", function(e){
        	uploadCanceled(e,_target);
        }, false);
        $scope.xhr[_target].open("POST", "api/fileUpload", true);
       	$scope.xhr[_target].send($scope.fd[_target]);
	}

	$scope.cancelUpload = function(_target){
		$scope.uploadVisible[_target] = false;
		$scope.uploadProgress[_target] = false;
		$scope.xhr[_target].abort();
	}

	$scope.reset = function(_target){
		$scope.uploadVisible[_target] = false;
	}

	function uploadProgress(evt,_target) {
		$scope.$apply(function(){
			if (evt.lengthComputable) {
				$scope.progress[_target] = Math.round(evt.loaded * 100 / evt.total);
			} else {
				console.log('unable to compute');
			}
		});
	}
	function uploadComplete(response,_userId,_target) {
		var obj = {image:{}};
		obj.image[_target] = response.writeFolder + response.name;
		$scope.Users.update({userId:_userId}, obj, function(resp){
			//$scope.progressVisible[_target] = false;
			return console.log('image uploaded');
		}); 
	}

	function uploadFailed(evt,_target) {
		alert("There was an error attempting to upload the file.")
	}

	function uploadCanceled(evt,_target) {
		// scope.$apply(function(){
		// 	//scope.progressVisible = false
		// })
		alert("The upload has been canceled by the user or the browser dropped the connection.")
	}
}

/*
 * Controller
**/
function RecipesCtrl($scope,$resource){
	var Recipes = $resource('/rest/recipes/:itemId', {}, {});
	$scope.items = Recipes.get(function(resp){});
	$scope.state = 'Closed';
	$scope.getItem = function(_itemId){
		if ($scope.state == 'Open' && $scope.item._id == _itemId)
			$scope.state = 'Closed'
		else {
			Recipes.get({itemId:_itemId},function(resp){
				$scope.item = resp.data;
				$scope.state = 'Open';
			});
		}
	}
}

/*
 * Controller
**/
function TipsCtrl($scope,$resource){
	var Tips = $resource('/rest/tips/:itemId', {}, {});
	$scope.items = Tips.get(function(resp){});
	$scope.state = 'Closed';
	$scope.getItem = function(_itemId){
		if ($scope.state == 'Open' && $scope.item._id == _itemId)
			$scope.state = 'Closed'
		else {
			Tips.get({itemId:_itemId},function(resp){
				$scope.item = resp.data;
				$scope.state = 'Open';
			});
		}
	}	
}

/*
 * Controller
**/
function TickerCtrl($scope,$resource){
	var Ticks = $resource('/rest/ticks/:itemId', {}, {});
	$scope.items = Ticks.get(function(resp){});
	$scope.state = 'Closed';
	$scope.getItem = function(_itemId){
		if ($scope.state == 'Open' && $scope.item._id == _itemId)
			$scope.state = 'Closed'
		else {
			Ticks.get({itemId:_itemId},function(resp){
				$scope.item = resp.data;
				$scope.state = 'Open';
			});
		}
	}
}

/*
 * Controller
**/
function StatsCtrl($scope){
	
}