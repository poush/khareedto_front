// var baseUrl = "http://localhost:8000/api/web/";
var baseUrl = "http://api.khareedto.com/api/web/";
app = angular.module('Creators', [
	'app.core',
	'angular-loading-bar',
	'app.routes',
	'app.settings',
	]);


 
(function() {
    'use strict';

    angular
        .module('app.core', [
            'ui.router',
            // 'ui.bootstrap',
            'ngAnimate' ,
            'ngStorage',
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

    appRun.$inject = ['$rootScope', '$state', '$stateParams',  '$window', "$localStorage"];
    
    function appRun($rootScope, $state, $stateParams, $window, $localStorage) {
      
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

      if(!$localStorage.version)
        {
          $localStorage.cart = ""
          $localStorage.version = 0.1;
        }
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

    routesConfig.$inject = ['$stateProvider', '$locationProvider', 'RouteHelpersProvider', '$urlRouterProvider'];

    function routesConfig($stateProvider, $locationProvider, helper, $urlRouterProvider) {

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(true);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/home');



        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                templateUrl: helper.basepath('pages/app.html'),
                controller: function() {

                    }
                    // resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
            })






        // Index
        // -----------------------------------
        .state('app.index', {
            url: '/home',
            title: 'Home',
            templateUrl: helper.basepath('pages/home.html?v=3'),

        })

        .state('app.privacy', {
            url: '/privacy',
            title: 'Privacy Policy',
            templateUrl: helper.basepath('pages/privacy.html')
        })

        .state('app.aboutus', {
            url: '/aboutus',
            title: 'About Us',
            templateUrl: helper.basepath('pages/aboutus.html')
        })

        .state('app.mycart', {
            url: '/mycart',
            title: 'My Cart',
            templateUrl: helper.basepath('pages/mycart.html')
        })

        .state('app.product', {
            url: '/product/:product',
            title: 'Product',
            templateUrl: helper.basepath('pages/product.html')
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
 *
 * @package: Kharidto
 * @author: Piyush[alltimepresent@gmail.com]
 * @copyright: KharidTo 2016
 *
 */

angular.module('app.routes')

.factory('cartService', ['$rootScope', '$localStorage', function($localStorage, $rootScope) {

    var cart = [];
    var empty = 0;

    var inCart = [];

    var total = 0;

    var totalQty = 0;

    var findIndex = function(search) {
        var found = -1;
        inCart.forEach(function(product, index) {

            if (product.code == search.code)
                found = index;

        });

        return found;
    }

    return {

        start: function(data) {
            cart = [];

            if (data)
                cart = data;

            if (cart.length)
                cart.forEach(function(product, index) {
                    if (product.qty > 0) {
                        inCart.push(product);

                        total += product.qty * product.sprice;

                        totalQty += product.qty;
                    }

                });



            return {
                cart: inCart,
                cartTotal: total,
                totalQuantity: totalQty
            };
        },

        object: function() {
            return {
                cart: inCart,
                cartTotal: total,
                totalQuantity: totalQty
            };
        },

        add: function(product) {
            var index = findIndex(product);
            if (index == -1) {
                inCart.push(product);
                totalQty += 1;
                product.qty = 1;
                total += product.sprice;
            } else {
                inCart[index].qty += 1;
                totalQty += 1;
                total += product.sprice;
            }



            $localStorage.cart = JSON.stringify(inCart);

        },

        removeQty: function(product) {
            var index = findIndex(product);
            if (index == -1)
                return;

            else {
                if (inCart[index].qty == 1) {
                    var tempCart = [];

                    inCart.forEach(function(element) {
                        if (element.code !== product.code)
                            tempCart.push(element);
                    });

                    inCart = tempCart;

                } else
                    inCart[index].qty -= 1;

                totalQty -= 1;
                total -= product.sprice;
            }

            $localStorage.cart = JSON.stringify(inCart);

        },

        remove: function(product) {
            var tempCart = [];
            inCart.forEach(function(element) {
                if (element.code !== product.code)
                    tempCart.push(element);
            })

            total -= product.qty * product.sprice;
            totalQty -= product.qty;
            inCart = tempCart;

            $localStorage.cart = JSON.stringify(inCart);
        },

        clearAll : function(){
            inCart = [];
            total = 0;
            totalQty = 0
        }

    }


}])

.controller('HomeController', HomeController);

function HomeController($scope, $http, $state, $stateParams, $rootScope, $localStorage, cartService) {


    $scope.formError = '';
    $scope.selectedProduct = '';
    $scope.cartFill = 1;

    // Contact form
    $scope.contact = {
        email: '',
        message: '',
        failed: 0,
        sent: 0
    }


    // Products List
    $scope.products = {};

    // Order Not Placed yet
    $scope.orderPlaced = 0;
    $scope.checkoutMessage = '#Order';

    // Current states
    $scope.placingOrder = 0;

    $scope.formFill = {
        name: '',
        email: '',
        phone: ''
    }

    // Run cartService
    if(cartService.object().cart.length == 0)
    {
        $scope.initData = cartService.start($localStorage.cart);

        $scope.data = {
            cart: $scope.initData.cart
        };
        $scope.totalQuantity = $scope.initData.totalQuantity;
        $scope.cartTotal = $scope.initData.cartTotal;
    }


    //Cart Modified Event Handling
    $rootScope.$on("cartModified", function() {
        $scope.data = cartService.object();
        $scope.cartTotal = $scope.data.cartTotal;
        $scope.totalQuantity = $scope.data.totalQuantity;
        $localStorage.cart= $scope.data.cart;
        console.log($scope.data.cart)
    });

    // Testing cartService
    // console.log($rootScope.totalQuantity);   

    var init = function() {}


    /**
     *
     * @description Load the products lists from Api and them to AngularJS Model
     *
     */

    $scope.load = function() {

        $http({
                method: 'GET',
                url: baseUrl + 'products',
            })
            .then(function successCallback(response) {

                $scope.products = response.data.data;



            }, function errorCallback(response) {
                $scope.error = response.data;
                $scope.products = [];
            });

    }


    /**
     *
     * @param {OBJECT} product   Contains Selected product on which
     *                           "Add To cart" button is pressed
     * @return {void}     
     * @description Add product to $rootScope.cart variable
     * 
     */

    $scope.addToCart = function(product) {
        cartService.add(product);
        $rootScope.$emit("cartModified");
    }

    $scope.addOneQuantity = function(product) {
        cartService.add(product);
        $rootScope.$emit("cartModified")
    }

    $scope.minusOneQuantity = function(product) {
        cartService.removeQty(product);
        $rootScope.$emit("cartModified")
    }

    $scope.resetAddedToCart = function() {
        $rootScope.cart.forEach(function(product) {
            product.addedToCart = 0;
            product.qty = 0;
        });
        $scope.calculateTotal();
        $localStorage.cart = JSON.stringify([]);
        init();
        // JSON.stringify($rootScope.cart);

    }
    $scope.removeFromCart = function(product) {

        cartService.remove(product);
        $rootScope.$emit("cartModified");
    }
        /**
         * [placeOrder description]
         * @return {[type]} [description]
         */
    $scope.placeOrder = function() {
        $scope.formError = '';
        $scope.placingOrder = 1;
        $http({
                method: 'post',
                url: baseUrl + 'orders/place',
                data: {
                    form: $scope.formFill,
                    products: $scope.data.cart
                }
            })
            .then(function successCallback(response) {

                console.log(response);
                $scope.orderPlaced = 1;
                $scope.checkoutMessage = '#ThankYou'
                $scope.placingOrder = 0;
                cartService.clearAll();
                $rootScope.$emit("cartModified");


            }, function errorCallback(response) {
                $scope.formError = response.data.errors;
                console.log(response.data);
                $scope.placingOrder = 0;

            });
    }

    $scope.calculateTotal = function() {
        var sum = 0;
        var quantity = 0;
        $rootScope.cart.forEach(function(product, key) {
            if (product.addedToCart == 1) {
                quantity = quantity + product.qty;
                sum = sum + (product.qty * product.sprice);
            }
        });
        $rootScope.cartTotal = sum;
        $rootScope.totalQuantity = quantity;
    }

    $scope.sendContact = function() {
        $scope.contact.action = 'Please Wait...';
        $scope.errors = '';
        $http({
                url: baseUrl + 'sendContact',
                method: 'post',
                data: {
                    email: $scope.contact.email,
                    message: $scope.contact.message
                }
            })
            .then(function successCallback() {
                    $scope.contact.sent = 1;
                },
                function errorCallback(response) {
                    $scope.contact.action = "";
                    $scope.contact.failed = 1;
                    $scope.contact.errors = response.data.errors;
                })
    }
};

'use strict';
/**
 *
 * @package: Kharidto
 * @author: Piyush[alltimepresent@gmail.com]
 * @copyright: KharidTo 2016
 *
 */

angular.module('app.routes')

.controller('myCartController', myCartController);

function myCartController($scope, $http, $state, $stateParams, $rootScope, $localStorage, cartService) {

    // Order Not Placed yet
    $scope.orderPlaced = 0;
    $scope.checkoutMessage = '#Order';

    // Current states
    $scope.placingOrder = 0;

    $scope.formFill = {
        name: '',
        email: '',
        phone: ''
    }

    // Run cartService
    if(cartService.object().cart.length == 0)
    {
        $scope.initData = cartService.start($localStorage.cart);

        $scope.data = {
            cart: $scope.initData.cart
        };
        $scope.totalQuantity = $scope.initData.totalQuantity;
        $scope.cartTotal = $scope.initData.cartTotal;
    }
    //Cart Modified Event Handling
    $rootScope.$on("cartModified", function() {
        $scope.data = cartService.object();
        $scope.cartTotal = $scope.data.cartTotal;
        $scope.totalQuantity = $scope.data.totalQuantity;
        $localStorage.cart= $scope.data.cart;
        console.log($scope.data.cart)
    });

    $rootScope.$emit("cartModified");
    
    $scope.placeOrder = function() {
        $scope.formError = '';
        $scope.placingOrder = 1;
        $http({
                method: 'post',
                url: baseUrl + 'orders/place',
                data: {
                    form: $scope.formFill,
                    products: $scope.data.cart
                }
            })
            .then(function successCallback(response) {

                console.log(response);
                $scope.orderPlaced = 1;
                $scope.checkoutMessage = '#ThankYou'
                $scope.placingOrder = 0;
                cartService.clearAll();
                $rootScope.$emit("cartModified");


            }, function errorCallback(response) {
                $scope.formError = response.data.errors;
                console.log(response.data);
                $scope.placingOrder = 0;

            });
    }






    /**
     *
     * @param {OBJECT} product   Contains Selected product on which
     *                           "Add To cart" button is pressed
     * @return {void}     
     * @description Add product to $rootScope.cart variable
     * 
     */

    $scope.addToCart = function(product) {
        cartService.add(product);
        $rootScope.$emit("cartModified");
    }

    $scope.addOneQuantity = function(product) {
        cartService.add(product);
        $rootScope.$emit("cartModified")
    }

    $scope.minusOneQuantity = function(product) {
        cartService.removeQty(product);
        $rootScope.$emit("cartModified")
    }

    $scope.removeFromCart = function(product) {

        cartService.remove(product);
        $rootScope.$emit("cartModified");
    }

    $scope.calculateTotal = function() {
        var sum = 0;
        var quantity = 0;
        $rootScope.cart.forEach(function(product, key) {
            if (product.addedToCart == 1) {
                quantity = quantity + product.qty;
                sum = sum + (product.qty * product.sprice);
            }
        });
        $rootScope.cartTotal = sum;
        $rootScope.totalQuantity = quantity;
    }

    $scope.sendContact = function() {
        $scope.contact.action = 'Please Wait...';
        $scope.errors = '';
        $http({
                url: baseUrl + 'sendContact',
                method: 'post',
                data: {
                    email: $scope.contact.email,
                    message: $scope.contact.message
                }
            })
            .then(function successCallback() {
                    $scope.contact.sent = 1;
                },
                function errorCallback(response) {
                    $scope.contact.action = "";
                    $scope.contact.failed = 1;
                    $scope.contact.errors = response.data.errors;
                })
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

   function NavController( $scope, $http, $state, $stateParams,$rootScope, cartService ) {

    $scope.data = cartService.object();
    $scope.cartTotal = $scope.data.cartTotal;
    $scope.totalQuantity = $scope.data.totalQuantity;

    $rootScope.$on("cartModified" , function(){
        $scope.data = cartService.object();
        $scope.cartTotal = $scope.data.cartTotal;
        $scope.totalQuantity = $scope.data.totalQuantity;
    });


    $scope.init = function()
    {
        $scope = $rootScope;
    }

    $scope.print = function(){
        console.log($rootScope.cart);
    }

    $scope.removeProduct = function(key){
    	console.log(key);

    	console.log($rootScope.cart.splice(key,1));


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
        name: 'KhareedTo',
        url : 'http://khareedto.com',
        description: 'Grab Your needs with one click',
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

'use strict';
/**
 *
 * @package: Kharidto
 * @author: Piyush[alltimepresent@gmail.com]
 * @copyright: KharidTo 2016
 *
 */

angular.module('app.routes').controller('ProductController', ProductController);

   function ProductController( $scope, $http, $state, $stateParams,$rootScope, $localStorage ) {


};

