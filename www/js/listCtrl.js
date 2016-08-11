angular.module('listCtrl', ['listService'])



.controller('ListController', function($scope, List, $ionicPopup, $ionicListDelegate, socketio) {
    
    var vm = this;
    vm.listData = {};
    
    
    List.allLists().success(function(data) {
        vm.lists = data;
    });
    
    
    vm.createList = function() {
        
        vm.message = '';
        
        List.create(vm.listData).success(function(data) {
                
            //Clear up the form
            vm.listData = '';
            
            vm.message = data.message;
        });
    };
    
    
    socketio.on('list', function(data) {
        vm.lists.push(data);
    });
    
    
    //Dialog to create new list
    vm.newList = function() {
        
        $ionicPopup.prompt({
            
            title: "Neue Liste",
            template: "Name der Liste",
            okText: 'erstellen'
        }).then(function(res) {
            if(res) {
                
                vm.listData.listname = res;
                vm.createList();
            }
        });
    };
    
    
    vm.update = function(list) {
        
        console.log(list);
        vm.actlistname = list.listname;
        vm.actlist = list;
        console.log(vm.actlistname);
        vm.actproducts = [];
        
        for( var i = 0; i < list.products.length; i++)
            {
                vm.actproducts.push(list.products[i]);
            }
        console.log(vm.actproducts);
        
    };
    
    
    
    
//    
//    $scope.edit = function(list) {
//        
//        $scope.data = { response: list.listname};
//        
//        $ionicPopup.prompt({
//            
//            title: "Liste umbenennen",
//            scope: $scope
//            
//        }).then(function(res) {
//            if (res !== undefined) list.listname = $scope.data.response;
//            $ionicListDelegate.closeOptionButtons();
//        });  
//    };
    
    
    
});