#  使用 AVOS Cloud JavaScript SDK 和 AngularJS 创建 一个 Todo Demo
## 为什么选择这两个库做 Todo
AVOS Cloud JavaScript SDK 负责把数据存储在服务器，提供了 数据查询，保存，更新等常用操作的方法。AngularJS 对于增删改查类型的应用场景非常合适。这块主要用到了 AngularJS的 模板和绑定方面的特性。
## 分工
AVOS Cloud JavaScript SDK 负责数据交互，angular 负责其它。通过 JSON 进行数据转化。 JS SDK 请求完数据，然后  result.toJSON() 变成一个 plain js object。
```
success: function (result) {
          var obj =result.toJSON();
          //再遍历 JSON 进行 AVObject 的属性设置
```           
          
## Step By Step 入门
这里主要说下 AVOS cloud Javascript SDK 与 AngularJS 结合使用的部分
### 初始化 AVOS Cloud JavaScript SDK
```
AV.initialize("5kjccy0bb5dbwkz7bnhzpi189y8yljro8mdszjc8oqwpn3jg", "6kk41eo4lbv0yydm6qsc0ax0tol52qpijm3zx413eou2xliz");
```
既然是与 AngularJS，这里可以有更优雅的写法，对于angular 来说初始化可以放在 模块初始化的配置里面。

```
var module = angular.module("todoMod",[]);
	module.run(function() {
	    AV.initialize("5kjccy0bb5dbwkz7bnhzpi189y8yljro8mdszjc8oqwpn3jg", "6kk41eo4lbv0yydm6qsc0ax0tol52qpijm3zx413eou2xliz");
	});
```

### 保存一个对象

```
        var Todo = AV.Object.extend("Todo");
	  	var todo = new Todo();
	  	todo.set("text",$scope.newTodo.text);
	  	todo.set("done",$scope.newTodo.done)
	  	todo.save(null, {
	  		success: function(result){
	  			$scope.$apply(function(){//使 angular 知道数据发生了变化
	  				$scope.todos.push(todo.toJSON());
	  			});
	  		}
	  	});
```
我们知道一个 AngularJs 的model是一个 plain JavaScript Object，对于 AV Object， 需要用 `set`来设置属性。注意 AV Object并不是一个 key,value的值组合，比如有 todo.save()方法，所以不能 `todo[prop]`这样获取属性。需要走setter,getter方式。还有其他更优雅的结合方式 下面再说。

这里还有一点需要注意，就是 `$scope.$apply` 这一行，因为数据的保存请求是通过AV Object 进行的，所以angular 并不知道发送了什么，需要告知angular todo数据发生了变化。

`todo.toJSON()`，`todo` 是一个 `AVObject` 类型实例，需要转换成 angular 需要的数据格式。

### 查询 Todo 列表
```
		var Todo = AV.Object.extend("Todo");
	  	var query = new AV.Query(Todo);
	  	query.find({
	  		success:function (results){
	  			$scope.$apply(function(){
	  				$scope.todos = JSON.parse(JSON.stringify(results));;
	  			})
	  		}
	  	})
```

这里需要注意 `JSON.parse(JSON.stringify(results))`, `results` 是一个普通的 js Array，但里面的元素都是 `AVObject` 类型的实例，需要转化成 angular需要的数据格式。

### 一个简单的模型就建立起来了
[查看源码](https://github.com/sunchanglong/AV-Angular-Todo) ，下载下来直接打开 `index.html` 就可以看到效果了。

通过 [AVOS Cloud](https://cn.avoscloud.com) 数据管理平台查看，管理数据。需要创建一个自己的 `应用`，并在初始化的时候 替换掉 AV.initialize 里的 `AppId` `AppKey`。


## 关于 AV Object 数据与 Angular的转化。
除了通过`JSON`方式，还可以用

```
Object.defineProperty(Todo.prototype, "title", {
      get: function() {
        return this.get("text");
      },
      set: function(aValue) {
        this.set("text", aValue);
      }
    });
```
这样可以在 `html` 里直接通过 {{todo.text}} 访问。

## 关于通知 Angular 发生变化
除了通过 `$scope.$apply`
还可以借助 `$timeout`
或者 $promise

```
var defer = $q.defer();
        var query = new AV.Query(Todo);
        query.find({
          success : function(results) {
            defer.resolve(results);
          },
          error : function(aError) {
            defer.reject(aError);
          }
        });

        return defer.promise;
```
## 结合 [AVOS Cloud](https:/cn.avoscloud.com) JS SDK 和 AngularJS 可以实现 MEAN 的全栈开发。其中 M(Mongo) E(Express) N(node) 由 AVOS Cloud 完成。
