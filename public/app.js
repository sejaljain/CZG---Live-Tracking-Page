'use strict';

var myApp = angular.module('myApp', ['ngRoute','leaflet-directive']);
myApp.config(['$routeProvider', '$httpProvider',
function($routeProvider, $httpProvider) {
    $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};

	$routeProvider
	.when('/', {
		templateUrl: 'app/app.html',
		controller: 'LiveCtrl'
	})
    .when('/geofence', {
        templateUrl: 'app/geofence.html',
        controller: 'GeoCtrl'
    })
    .when('/poi', {
        templateUrl: 'app/poi.html',
        controller: 'POICtrl'
    })
	.when('/history', {
		templateUrl : 'app/history.html',
		controller : 'HistoryCtrl'
	});

}]);

myApp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);


myApp.controller('LiveCtrl', ['$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
    var truck_icon = {
            iconUrl: 'truck.png',
            iconSize:     [38, 38],
            shadowAnchor: [4, 62]
        };

    angular.extend($scope, {
        bangalore: {
            lat: 12.9716,
            lng: 77.5946,
            zoom: 9
        },
        layers: {
                    baselayers: {
                        openStreetMap: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    }
                },
        geojson : {},
        markers : {'truck1' : {}, 'truck2' : {}}

    });

        $http.get("http://localhost:3000/lastlatlng/355217044868611").success(function(data, status) {
            var address = "";
            $http.get("http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/geocode/77.5946,12.9716.json").success(function(res, status) {
                if (res.results.length>=1) {
                    for(var i = 0; i < res.results[0].length; i++) {
                        address = address + res.results[0][i].name + ", ";
                    }
                    console.log(address, typeof address);
                $scope.markers['truck1'] = {
                    lat: data.geometry.coordinates[1],
                    lng: data.geometry.coordinates[0],
                    message: data.properties.description.concat(address),
                    icon: truck_icon
                    
            };

                } 
                else {
                    console.log("ERROR");
                }
            });

        });
        $http.get("http://localhost:3000/lastlatlng/354678456723764").success(function(data, status) {
            var address = "";
            $http.get("http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/geocode/77.5946,12.9716.json").success(function(res, status) {
                if (res.results.length>=1) {
                    for(var i = 0; i < res.results[0].length; i++) {
                        address = address + res.results[0][i].name + ", ";
                    }
                    console.log(address, typeof address);
                $scope.markers['truck2'] = {
                    lat: data.geometry.coordinates[1],
                    lng: data.geometry.coordinates[0],
                    message: data.properties.description.concat(address),
                    icon: truck_icon
                    
            };

                } 
                else {
                    console.log("ERROR");
                }
            });

        });

        $scope.updateCoord = function() {
            $http.get("http://localhost:3000/lastlatlng/355217044868611").success(function(data, status) {
            var address = "";
            $http.get("http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/geocode/77.5946,12.9716.json").success(function(res, status) {
                if (res.results.length>=1) {
                    for(var i = 0; i < res.results[0].length; i++) {
                        address = address + res.results[0][i].name + ", ";
                    }
                    console.log(address, typeof address);
                $scope.markers['truck1'] = {
                    lat: data.geometry.coordinates[1],
                    lng: data.geometry.coordinates[0],
                    message: data.properties.description.concat(address),
                    icon: truck_icon
                    
            };

                } 
                else {
                    console.log("ERROR");
                }
            });

        });
        $http.get("http://localhost:3000/lastlatlng/354678456723764").success(function(data, status) {
            var address = "";
            $http.get("http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/geocode/77.5946,12.9716.json").success(function(res, status) {
                if (res.results.length>=1) {
                    for(var i = 0; i < res.results[0].length; i++) {
                        address = address + res.results[0][i].name + ", ";
                    }
                    console.log(address, typeof address);
                $scope.markers['truck2'] = {
                    lat: data.geometry.coordinates[1],
                    lng: data.geometry.coordinates[0],
                    message: data.properties.description.concat(address),
                    icon: truck_icon
                    
            };

                } 
                else {
                    console.log("ERROR");
                }
            });

        });
             
        }

        setInterval(function(){
          $scope.updateCoord();
        }, 5000)

    
    $scope.showall = function() {
        $scope.bangalore.lat = 12.9716;
        $scope.bangalore.lng = 77.5946;
        $scope.bangalore.zoom = 9;
    }
    $scope.submit = function(f) {
        var d1 = f.driver
        $http.get("http://localhost:3000/lastlatlng/" + d1).success(function(data, status) {
            var address = "";
            $http.get("http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/geocode/77.5946,12.9716.json").success(function(res, status) {
                if (res.results.length>=1) {
                    for(var i = 0; i < res.results[0].length; i++) {
                        address = address + res.results[0][i].name + ", ";
                    }
                    console.log(address, typeof address);
                $scope.markers.push({
                    lat: data.geometry.coordinates[1],
                    lng: data.geometry.coordinates[0],
                    message: data.properties.description.concat(address),
                    icon: truck_icon
                    
            });

                } 
                else {
                    console.log("ERROR");
                }
            });

            
            $scope.bangalore.lat = data.geometry.coordinates[1];
            $scope.bangalore.lng = data.geometry.coordinates[0];
            $scope.bangalore.zoom = 15;
        });


        
        $scope.updateCoord = function() {
            var d = f.driver;
            $http.get("http://localhost:3000/lastlatlng/" + d).success(function(data, status) {
            var address = "";

            $http.get("http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/geocode/" + data.geometry.coordinates[0] + "," + data.geometry.coordinates[1] + ".json").success(function(res, status) {
                
                if (res.results.length>=1) {
                    for(var i = 0; i < res.results[0].length; i++) {
                        address = address + res.results[0][i].name + " ";
                    }
                    console.log(address, typeof address);
                    var cont = data.properties.description.concat(address)
                    $scope.markers.push({
                        lat: data.geometry.coordinates[1],
                        lng: data.geometry.coordinates[0],
                        message: data.properties.description.concat(address),
                        icon: truck_icon
                        
                });
                } 
                else {
                    console.log("ERROR");
                }

            });
            
            $scope.bangalore.lat = data.geometry.coordinates[1];
            $scope.bangalore.lng = data.geometry.coordinates[0];
        });
             
        }

        setInterval(function(){
          $scope.updateCoord();
        }, 5000)
    }

    
}]);


myApp.controller('HistoryCtrl', ['$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

    var truck_icon = {
            iconUrl: 'truck.png',
            iconSize:     [38, 38],
            shadowAnchor: [4, 62]
        };

    $http.defaults.headers.post['My-Header']='value';
    angular.extend($scope, {
        bangalore: {
            lat: 12.9716,
            lng: 77.5946,
            zoom: 11
        },
        layers: {
                    baselayers: {
                        openStreetMap: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    }
                },
        markers : {}
    });



    $scope.f = {};

    $scope.submit = function(f, callback) {
        var stamp = f.begin;
        var d_begin = stamp.substring(8,10) + stamp.substring(5,7) + stamp.substring(2,4);
        var t_begin = stamp.substring(11).replace(":", "") + "00";


        var end_stamp = f.end;
        var d_end = end_stamp.substring(8,10) + end_stamp.substring(5,7) + end_stamp.substring(2,4);
        var t_end = end_stamp.substring(11).replace(":", "") + "00";
        var url = "http://localhost:3000/route/" + f.driver + "/" + d_begin + "/" + t_begin + "/" + d_end + "/" + t_end; 
        $http.get(url).success(function(data, status) {
            var coords = data;
            console.log(data.geometry.coordinates.length);
            if (coords.geometry.coordinates.length > 100) {
                console.log("Splitting");
                var coords_split = [];
                var i;
                var j = 0;
                while (j+100<coords.geometry.coordinates.length) {
                    coords_split.push(coords.geometry.coordinates.slice(j,j+100));
                    j = j+100
                }
                coords_split.push(coords.geometry.coordinates.slice(j));
                
                var coord_array = []

                for(var i = 0; i < coords_split.length; i++) {
                    
                    var section = JSON.stringify({geometry:{type:"LineString",coordinates:coords_split[i]},type:"Feature",properties:{}});
                    $http.post("https://api.mapbox.com/matching/v4/mapbox.driving.json?access_token=pk.eyJ1Ijoic2VqYWxqYWluIiwiYSI6ImNpcGY5eDRiejAwMnF0am5tZHhjbWppeHcifQ._EQfGUZu8zBRSUSeldBiRA", section,{
                headers : {
                    'Content-Type': 'application/json'
                }
                    }).success(function(res, status) {
                        if (res.code === 'Ok') {
                            console.log(res);
                            console.log("Adding");
                            coord_array = coord_array.concat(res.features[0].geometry.coordinates);
                            console.log(coord_array);
                            var ans = 
                    {
                      "type": "Feature",
                      "geometry": {
                        "type": "LineString",
                        "coordinates": coord_array
                        
                      },
                      "properties": {
                      }
                    }
                 ;
                console.log(ans);

                angular.extend($scope, {
                    geojson: {
                        data: ans
                    }

                });
                $scope.bangalore.lat = ans.geometry.coordinates[ans.geometry.coordinates.length-1][1];
                $scope.bangalore.lng = ans.geometry.coordinates[ans.geometry.coordinates.length-1][0];
                $scope.bangalore.zoom = 25;
                $scope.markers['truck'] = {
                    lat: $scope.bangalore.lat,
                    lng: $scope.bangalore.lng,
                    message: "Truck",
                    icon: truck_icon
                };

                console.log("Mult Snapped");

                
                        
                        } else {
                            console.log(res);
                            console.log(status);
                        }
                        
                    });
                
                }


                
                
                
                   

            }
             else {

            $http.post("https://api.mapbox.com/matching/v4/mapbox.driving.json?access_token=pk.eyJ1Ijoic2VqYWxqYWluIiwiYSI6ImNpcGY5eDRiejAwMnF0am5tZHhjbWppeHcifQ._EQfGUZu8zBRSUSeldBiRA", coords,{
                headers : {
                    'Content-Type': 'application/json'
                }
            }).success(function(res, status) {
                if (res.code == 'OK') {
                    console.log(res);
                    angular.extend($scope, {
                        geojson: {
                            data: res
                        }
                    });
                $scope.bangalore.lat = res.geometry.coordinates[res.geometry.coordinates.length-1][1];
                $scope.bangalore.lng = res.geometry.coordinates[res.geometry.coordinates.length-1][0];
                $scope.bangalore.zoom = 25;
                $scope.markers['truck'] = {
                    lat: $scope.bangalore.lat,
                    lng: $scope.bangalore.lng,
                    message: "Truck"
                };
                    console.log("Single Snapped");
                } else {
                    console.log(res);
                    console.log(status);
                }
                
            });
        }
            
        
        });
        

    }

    $scope.animate = function(f) {
        var stamp = f.begin;
        var d_begin = stamp.substring(8,10) + stamp.substring(5,7) + stamp.substring(2,4);
        var t_begin = stamp.substring(11).replace(":", "") + "00";


        var end_stamp = f.end;
        var d_end = end_stamp.substring(8,10) + end_stamp.substring(5,7) + end_stamp.substring(2,4);
        var t_end = end_stamp.substring(11).replace(":", "") + "00";
        var url = "http://localhost:3000/route/" + f.driver + "/" + d_begin + "/" + t_begin + "/" + d_end + "/" + t_end; 

        

        $http.get(url).success(function(data, status) {
            var coords = data;
            var i = 1, howManyTimes = coords.geometry.coordinates.length;
            function f() {
                angular.extend($scope, {
                    geojson : {
                        data : {
                            "geometry": {
                                "type": "LineString",
                                "coordinates": coords.geometry.coordinates.slice(0,i)
                            },
                            "type": "Feature",
                            "properties": {}
                        }
                    }
                }); 
                $scope.bangalore.lat = coords.geometry.coordinates[i][1];
                $scope.bangalore.lng = coords.geometry.coordinates[i][0];
                $scope.bangalore.zoom = 25;
                $scope.markers['truck'] = {
                    lat: $scope.bangalore.lat,
                    lng: $scope.bangalore.lng,
                    icon: truck_icon
                };
                i++;
                if( i < howManyTimes ){
                    setTimeout(f, 500);
                }
            }
            f();
            
        
        });

    }

    
}]);

myApp.controller('GeoCtrl', ['$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
    var bgr_icon = {
            iconUrl: 'bgr.png',
            iconSize:     [20, 20],
        };

    angular.extend($scope, {
        bangalore: {
            lat: 12.9703524,
            lng: 77.6414929,
            zoom: 15
        },
        layers: {
                    baselayers: {
                        openStreetMap: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    },
                },
        paths : {},
    });

    $scope.markers = []

    $http.get("bgrs.json").success(function(data, status) {
            var points = data.features;
            for (var i = 0; i<points.length; i++) {
                var name = points[i].properties.title;
                $scope.paths[name] = {         
                        weight: 2,
                        color: '#ff612f',
                        latlngs: [points[i].geometry.coordinates[1],points[i].geometry.coordinates[0]] ,
                        radius: 15,
                        type: 'circle',
                        message: name
                    };
          
                $scope.markers.push({
                    lat: points[i].geometry.coordinates[1],
                    lng: points[i].geometry.coordinates[0],
                    message: name,
                    icon: bgr_icon
                });
            }
            console.log($scope.paths)    
            
        });

    

    
    /*$http.get("bgrs.json").success(function(data, status) {
            var bgr_list = data.features;
            for (var i = 0; i<bgr_list.length; i++) {
                    paths.extend({
                                        weight: 2,
                                        color: '#ff612f',
                                        lat: bgr_list[i].latitude,
                                        lng: bgr_list[i].longitude
                                        radius: 50, //in meters
                                        type: 'circle'
                                    });
                    
                });
            angular.extend($scope,{paths})
        });*/


}]);

myApp.controller('POICtrl', ['$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

    var center_icon = {
            iconUrl: 'dwcc.png',
            iconSize:     [20, 20],
        };

    var center_icon_red = {
            iconUrl: 'dwcc_red.png',
            iconSize:     [20, 20],
        };

    $scope.markers = [];


    $http.get("http://localhost:3000/poi/centers").success(function(data, status) {
            var points = data.features;
            for (var i = 0; i<points.length; i++) {
                var name = points[i].properties.description;
          
                $scope.markers.push({
                    lat: points[i].geometry.coordinates[1],
                    lng: points[i].geometry.coordinates[0],
                    message: name,
                    icon: center_icon
                });
            }
        });

    angular.extend($scope, {
        bangalore: {
            lat: 12.9716,
            lng: 77.5946,
            zoom: 13
        },
        layers: {
                    baselayers: {
                        openStreetMap: {
                            name: 'OpenStreetMap',
                            type: 'xyz',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        }
                    }
                }
        });

    

    $scope.f = {};
    $scope.getAdd = function() {
        $http.get("http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/geocode/" + $scope.position.lng.toString() + "," + $scope.position.lat.toString() + ".json").success(function(res, status) {
            var a = ""
            if (res.results.length>=1) {
                for(var i = 0; i < res.results[0].length; i++) {
                    a = a + res.results[0][i].name + ", ";
                }
            } 
            else {
                a = "ERROR";
            }
            $scope.address.address = a;

        });
    }

    $scope.addMarker = function() {
        var mainMarker = {
                lat: 12.9716,
                lng: 77.5946,
                focus: true,
                message: "Drag marker to desired location.",
                draggable: true,
                icon : center_icon_red
            };

        $scope.markers.push(mainMarker);
        angular.extend($scope, {
            
            position: {
                lat: 12.9716,
                lng: 77.5946,
            },
            events: {
                markers: { enable : ['dragend']
                }
            },
            address: {address: ""}
        });

    }

    

    $scope.submit = function(f) {
        $scope.f['lat'] = $scope.position.lat;
        $scope.f['lng'] = $scope.position.lng;

        $scope.markers.push({
                    lat: $scope.position.lat,
                    lng: $scope.position.lng,
                    message: $scope.f.n,
                    icon: center_icon
                });

        var url = "http://localhost:3000/poi/add";
        var parameter = JSON.stringify({Name : $scope.f.n, Type : $scope.f.t, Latitude : $scope.f.lat, Longitude : $scope.f.lng});

        $http.post(url, parameter, {'headers' : {'Content-Type':'application/json'}}).success(function(res, status) {
            $scope.message = res;
            console.log(res);
            console.log(status);
        });

        $scope.position.lat = 12.9716;
        $scope.position.lng = 77.5946;
        $scope.address.address = "";



    }

        
    $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
                $scope.position.lat = args.model.lat;
                $scope.position.lng = args.model.lng;
                $scope.getAdd();
            });

  

} ]);

