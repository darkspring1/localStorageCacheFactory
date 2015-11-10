/**
 * Created by eolt on 08.10.2015.
 */

    angular.module('components', ['localStorageCacheFactory'])
        .config([function () {

        }])
        .run([ function() {

        }])
        .controller('mainCtrl', [ '$scope', 'localStorageCacheFactory', '$cacheFactory', function($scope, localStorageCacheFactory, $cacheFactory) {

            var memCache = $cacheFactory('memCache');
            var lsCache = localStorageCacheFactory('lsCache');

            memCacheInfo = memCache.info();

            $scope.lsCacheInfo = lsCache.info();

            $scope.addItems = function (count) {
                var size = lsCache.info().size;
                for (var i = 0; i < count; i++) {
                    var key = size + i;
                    lsCache.put('' + key, i);
                }
                $scope.lsCacheInfo = lsCache.info();
            }

            $scope.getItem = function (key) {

                var value = lsCache.get(key);

                if(value) {
                    $scope.itemInfo = {
                        key: key,
                        value: value
                    };
                }
                else {
                    $scope.itemInfo = null;
                }
            }
        }]);