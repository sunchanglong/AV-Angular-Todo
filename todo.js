(function(){
	var module = angular.module("todoMod",[]);
	module.run(function() {
	    AV.initialize("5kjccy0bb5dbwkz7bnhzpi189y8yljro8mdszjc8oqwpn3jg", "6kk41eo4lbv0yydm6qsc0ax0tol52qpijm3zx413eou2xliz");
	});
	module.controller("todoCtrl",['$http', '$scope', function($http, $scope){
	  $scope.todos = [];
	  $scope.newTodo = {text:"", done: false};


	  $scope.getTodos = function() {
	  	var Todo = AV.Object.extend("Todo");
	  	var query = new AV.Query(Todo);
	  	query.find({
	  		success:function (results){
	  			$scope.$apply(function(){
	  				$scope.todos = JSON.parse(JSON.stringify(results));;
	  			})
	  		}
	  	})
	  }


	  $scope.addTodo = function () {
	  	var Todo = AV.Object.extend("Todo");
	  	var todo = new Todo();
	  	todo.set("text",$scope.newTodo.text);
	  	todo.set("done",$scope.newTodo.done)
	  	todo.save(null, {
	  		success: function(result){
	  			$scope.$apply(function(){
	  				$scope.todos.push(todo.toJSON());
	  			});
	  		}
	  	});
	  };
	  $scope.updateTodoState = function(todoParam) {
	  	var Todo = AV.Object.extend("Todo");
	  	var todo = new Todo();
	  	todo.set("objectId",todoParam.objectId);
	  	todo.set("done",todoParam.done);
	  	todo.save(null, {
	  		success: function(result){
	  		}
	  	});
	  }

    $scope.getTodos();

	}]);



})();