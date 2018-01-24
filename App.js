angular.module('colorBlender', [])

angular.module('colorBlender').controller('colorCtrl', function ($scope) {
    $scope.base = "#CCCCCC"
    $scope.color1 = "#FF0000"
    $scope.color2 = "#00FF00"
    $scope.color3 = "#0000FF"
    $scope.opacity1 = 0.5
    $scope.opacity2 = 0.5
    $scope.opacity3 = 0    
})
