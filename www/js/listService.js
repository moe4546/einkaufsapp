angular.module('listService', [])



.factory('List', function($http) {
    
    var listFactory = {};
    
    
    listFactory.create = function(listData) {
        return $http.post('/api/list', listData);
    }
    
    listFactory.allLists = function() {
        return $http.get('/api/list');
    }
    
    return listFactory;
    
})


.factory('socketio', function($rootScope) {
    
    var socket = io.connect();
    
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        
        emit: function(eventName, data, callack) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.apply(function() {
                    if(callack) {
                        callack.apply(socket, args);
                    }
                });
            });
        }
    };
});