angular.module('newsApp').controller('NewsController', [ '$scope','leafletData', 'NewsService', function($scope, leafletData, NewsService) {

	$scope.countries = [];
	$scope.myInterval = 10000;
	/* $scope.thumbnailSize = 5;
	$scope.thumbnailPage = 1;
	 */
	$scope.points = [];
	$scope.showModal = false;
	$scope.selectedNews = {};
		
	function init(){
		NewsService.getCountries().then(function(res) {
				if (res != null) {
				   $scope.countries = res[0].features;
				   //console.log($scope.countries);
				} else {
					console.log("Error");
				}
		});
	}

	init();
	
	$scope.closeModal = function(){
		$('#newsModal').modal('hide');
	}
	
	/* $scope.prevPage = function(){
		if ($scope.thumbnailPage > 1){
		  $scope.thumbnailPage--;
		}
		$scope.showThumbnails = $scope.points.slice(($scope.thumbnailPage-1)*$scope.thumbnailSize,$scope.thumbnailPage*$scope.thumbnailSize);
	  }
	  
	  $scope.nextPage = function(){
		if ($scope.thumbnailPage <= Math.floor($scope.points.length/$scope.thumbnailSize)){
		  $scope.thumbnailPage++;
		}
		$scope.showThumbnails = $scope.points.slice(($scope.thumbnailPage-1)*$scope.thumbnailSize,$scope.thumbnailPage*$scope.thumbnailSize);
	}

	$scope.showThumbnails = $scope.points.slice(($scope.thumbnailPage-1)*$scope.thumbnailSize,$scope.thumbnailPage*$scope.thumbnailSize);

	 $scope.setActive = function(idx) {
		$scope.points[idx].active=true;
	  } */
	
	$scope.closeSearch = function(){
		$('#searchModal').modal('hide');
	}

	$scope.searchNews = function(keyEvent){
		if (keyEvent.which === 13){
			NewsService.getNewsBySearchKey($scope.searchKey).then(function(res) {
				if (res != null) {
				   $scope.searchRes = $scope.points; //remove later
				   $('#searchModal').modal('show');
				} else {
					$scope.searchRes = $scope.points; //remove later
					$('#searchModal').modal('show'); // remove later
					console.log("Error");
				}
			});
			$scope.searchKey = "";
		}	
	}

	$scope.getMarkers = function() {
		var markArray = {};
		var i = {
					type: 'awesomeMarker',
					icon: 'tag',
					markerColor: 'blue'
				}
		angular.forEach($scope.points, function(value, key) {
			var cords = value.coord;
			var lonv = cords[0];
			var latv = cords[1];
			var id = value._id;
			markArray[id] = {lat: latv, lng:lonv, focus:true, draggable:false, loc: value.locn[0], msg:value.title, txt:value.text, layer:'clusterGroup', icon : i};
		});
		$scope.markers = markArray;
		console.log("markers:")
		console.log($scope.markers);
    };
	
	angular.extend($scope, {
		center: {
			lat: 40.8471,
			lng: 14.0625,
			zoom: 2
		},
		defaults: {
			tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
			zoomControlPosition: 'topright',
			tileLayerOptions: {
				opacity: 0.9,
				detectRetina: true,
				reuseTiles: true,
			},
			scrollWheelZoom: false
		},
		markers: {	},
		events: {},
		layers: {
				baselayers: {
					 osm: {
						name: 'OpenStreetMap',
						type: 'xyz',
						url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
						layerOptions: {
							subdomains: ['a', 'b', 'c'],
							attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
							continuousWorld: true
						}
					}
				},
				overlays: {
					clusterGroup: {
						name: 'clusterGroup',
						type: 'markercluster',
						visible: true
					}
				}
			}
    });
	
	$scope.centerMap = function() {
        $scope.center = {lat: $scope.selectedRegion.lat, lng: $scope.selectedRegion.lng, zoom: 8};
    };
	
	$scope.selectCountry = function(selectedCountry) {
		
		leafletData.getMap().then(function(map) {
			var latlngs = [];
			if(selectedCountry.geometry.type == "Polygon"){
				for (var i in selectedCountry.geometry.coordinates) {
					var coord = selectedCountry.geometry.coordinates[i];
					for (var j in coord) {
						var points = coord[j];
							latlngs.push(L.GeoJSON.coordsToLatLng(points));
					}
				} 
			}
			else {
				for (var i in selectedCountry.geometry.coordinates) {
					var coord = selectedCountry.geometry.coordinates[i];
					for (var j in coord) {
						var points = coord[j];
						for (var k in points)
							latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
					}
				} 
			}
			map.fitBounds(latlngs);
		});
		
		NewsService.getNewsForCountry(selectedCountry.geometry).then(function(res) {
			if (res != null) {
			   $scope.points = res;
			   console.log($scope.points);
			   $scope.getMarkers();
			} else {
				console.log("Error");
			}
		});
		
    };
			
	$scope.$on("leafletDirectiveMarker.mouseover", function(event, args){
		var leafEvent = args.leafletEvent;
		leafEvent.target.bindPopup(leafEvent.target.options.msg + " news");
		leafEvent.target.openPopup();
	});
	
	$scope.$on("leafletDirectiveMarker.mouseout", function(event, args){
		var leafEvent = args.leafletEvent;
		leafEvent.target.closePopup();
	});
	
	$scope.$on("leafletDirectiveMarker.click", function(event, args){
		var leafEvent = args.leafletEvent;
		$scope.selectedNews = leafEvent.target.options;
		$('#newsModal').modal('show');
	});

}]);