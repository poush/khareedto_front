

app = angular.module('Creators', [
	'app.core',
	'app.routes',
	'app.settings'
	]);


 
(function() {
    'use strict';

    angular
        .module('app.core', [
            'ui.router',
            // 'ui.bootstrap',
            // 'ngAnimate' ,
            // 'ngStorage',
            // 'cfp.loadingBar',

        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig);

    coreConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$animateProvider'];
    function coreConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $animateProvider){

      var core = angular.module('app.core');
      // registering components after bootstrap
      core.controller = $controllerProvider.register;
      core.directive  = $compileProvider.directive;
      core.filter     = $filterProvider.register;
      core.factory    = $provide.factory;
      core.service    = $provide.service;
      core.constant   = $provide.constant;
      core.value      = $provide.value;

      // Disables animation on items with class .ng-no-animation
      $animateProvider.classNameFilter(/^((?!(ng-no-animation)).)*$/);

    }

})();
/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('CONFIG', {
          'baseUrl':     'http://'
        })
      ;

})();
(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams',  '$window'];
    
    function appRun($rootScope, $state, $stateParams, $window) {
      
      // Set reference to access them from any scope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;

      // Uncomment this to disable template cache
      /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
            $templateCache.remove(toState.templateUrl);
          }
      });*/

      // cancel click event easily
      $rootScope.cancel = function($event) {
        $event.stopPropagation();
      };

      // Hooks Example
      // ----------------------------------- 

      // Hook not found
      $rootScope.$on('$stateNotFound',
        function(event, unfoundState/*, fromState, fromParams*/) {
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
      // Hook error
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          console.log(error);
        });
      // Hook success
      $rootScope.$on('$stateChangeSuccess',
        function(/*event, toState, toParams, fromState, fromParams*/) {
          // display new view from top
          $window.scrollTo(0, 0);
          // Save the route title
          $rootScope.currTitle = $state.current.title;
        });

      // Load a title dynamically
      $rootScope.currTitle = $state.current.title;
      $rootScope.pageTitle = function() {
        var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
        document.title = title;
        return title;
      };      

    }

})();


(function() {
    'use strict';

    angular
        .module('app.routes', [
            
        ]);
})();
/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider','RouteHelpersProvider', '$urlRouterProvider'];
    function routesConfig($stateProvider, $locationProvider, helper, $urlRouterProvider){

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/index');



        //
        // Application Routes
        // -----------------------------------
        $stateProvider
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('pages/app.html'),
              // resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
          })






          // Index
          // -----------------------------------
          .state('app.index', {
              url: '/index',
              title: 'Home',
              templateUrl: helper.basepath('pages/home.html'),

          })


    } // routesConfig

})();


/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.routes')
        .provider('RouteHelpers', RouteHelpersProvider)
        ;


    function RouteHelpersProvider() {

      /* jshint validthis:true */
      return {
        // provider access level
        basepath: basepath,
        // controller access level
        $get: function() {
          return {
            basepath: basepath,
          };
        }
      };

      // Set here the base of the relative path
      // for all app views
      function basepath(uri) {
        return 'views/' + uri;
      }


    }


})();



(function() {
    'use strict';

    angular
        .module('app.settings', []);
})();
'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('app.routes').controller('HomeController', HomeController);

   function HomeController( $scope, $http, $state, $stateParams,$rootScope ) {

    $scope.formError = '';
    $scope.selectedProduct = '';
    $rootScope.cart = [];
    $scope.cartFill = 1;

    $scope.formFill = {
        name: '',
        email: '',
        phone:'',
        product:{
                id: '',
                quantity:  1
            }
    }


    $scope.load = function(){
      $http({
            method: 'GET',
            url: '../api/products',
        })
        .then(function successCallback(response) {

            $scope.products = response.data.data;

         }, function errorCallback(response) {
                $scope.error = response.data;
                $scope.products = [];
        });

    }

    $scope.addToCartButton = function(product){
        $scope.selectedProduct = product;
    }

    $scope.addToCart = function(){
        $scope.formError = '';

        $rootScope.cart.push({
                    id:  $scope.selectedProduct.product.id,
                    qty: $scope.cartFill,
                    name:$scope.selectedProduct.product.name});

        console.log($rootScope);

    }

    $scope.placeOrder = function() {
        console.log($scope.formFill);
        $http({
            method: 'post',
            url: '../api/orders/place',
            data: $scope.formFill
        })
        .then(function successCallback(response) {

            console.log(response);

         }, function errorCallback(response) {
                $scope.formError = response.data;
                console.log(response.data);
        });
    }
};
'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('app.routes').controller('NavController', NavController);

   function NavController( $scope, $http, $state, $stateParams,$rootScope ) {

    $scope.init = function()
    {
        // $scope.cart = $rootScope.cart;
    }
};
(function() {
    'use strict';

    angular
        .module('app.settings')
        .run(settingsRun);

    settingsRun.$inject = ['$rootScope'];

    function settingsRun($rootScope){

      // Global Settings
      // -----------------------------------
      $rootScope.app = {
        name: 'Creators',
        description: 'Creators by Piyush',
        year: ((new Date()).getFullYear()),
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: "app/css/theme-d.css",
          asideScrollbar: false
        },
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUp'
      };

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h') ;

      // // Restore layout settings
      // if( angular.isDefined($localStorage.layout) )
      //   $rootScope.app.layout = $localStorage.layout;
      // else
      //   $localStorage.layout = $rootScope.app.layout;

      // $rootScope.$watch('app.layout', function () {
      //   $localStorage.layout = $rootScope.app.layout;
      // }, true);

      // // Close submenu when sidebar change from collapsed to normal
      // $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
      //   if( newValue === false )
      //     $rootScope.$broadcast('closeSidebarMenu');
      // });

    }

})();
