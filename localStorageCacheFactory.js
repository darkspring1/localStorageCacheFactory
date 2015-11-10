

angular
    .module('localStorageCacheFactory', [])
    .factory('localStorageCacheFactory', ['$log', function($log) {


        function debug(message)
        {
            $log.debug('localStorageCacheFactory >> ' + message)
        }

        /* при первом обращении кешь из локал стораджа помещается в memoryStorage */
        var memoryStorage = {};

        function getCacheFromLocalStorage(cacheId) {
            debug('Loading cache from local storage. CacheId: ' + cacheId);
            var json = localStorage[cacheId];
            return json ? JSON.parse(json) : null;
        };

        function putCacheToLocalStorage(cacheId, cacheObject){
            var json = JSON.stringify(cacheObject);
            localStorage[cacheId] = json;
            debug('Put cache to local storage. CacheId: ' + cacheId);
        };


        function getCache(cacheId) {
            if(!memoryStorage[cacheId]) {
                memoryStorage[cacheId] = new cacheCtor(cacheId);
            }
            return memoryStorage[cacheId];
        }

        function cacheCtor(cacheId) {
            var me = this;
            var _cacheObj = getCacheFromLocalStorage(cacheId);
            if(!_cacheObj)
            {
                _cacheObj = {};
                debug('No cache in local storage. CacheId: ' + cacheId);
                debug('Create new cache in local storage. CacheId: ' + cacheId);
                putCacheToLocalStorage(cacheId, _cacheObj);
            }

            /*
            * Методы для работы с $http в качесве кеша
            * */
            me.put = function(key, value){
                _cacheObj[key] = value;
                putCacheToLocalStorage(cacheId, _cacheObj);
                return _cacheObj[key]
            }

            me.get = function(key){
                debug('Get item from cache. Key: ' + key + ' CacheId: ' + cacheId);
                return _cacheObj[key];
            };

            me.remove = function(key){
                delete _cacheObj[key];
                putCacheToLocalStorage(cacheId, _cacheObj);
            }

            me.info = function() {
                return {
                    size: Object.keys(_cacheObj).length,
                    id: cacheId
                };
            }

            /*
            * другие полезные методы
            * */
            me.getKeys = function() {
                return Object.keys(_cacheObj);
            }

            me.getFirst = function() {
                var keys = Object.keys(_cacheObj);
                if(keys.length == 0) {
                    return null;
                }
                return {
                    key: keys[0],
                    value: me.get(keys[0])
                };
            }

            me.getAll = function(){
                var result = [];
                angular.forEach(_cacheObj, function(value, key){
                    result.push( {
                        key: key,
                        value: value
                    } )
                })
                return result;
            }

            me.removeAll = function(){
                _cacheObj = {};
                putCacheToLocalStorage(cacheId, _cacheObj);
            }

            return me;
        }

        return function(cacheId) {
            return getCache(cacheId);
        };
}]);