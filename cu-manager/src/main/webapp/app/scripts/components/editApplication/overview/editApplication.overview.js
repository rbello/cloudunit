/*
 * LICENCE : CloudUnit is available under the Affero Gnu Public License GPL V3 : https://www.gnu.org/licenses/agpl-3.0.html
 *     but CloudUnit is licensed too under a standard commercial license.
 *     Please contact our sales team if you would like to discuss the specifics of our Enterprise license.
 *     If you are not sure whether the GPL is right for you,
 *     you can always test our software under the GPL and inspect the source code before you contact us
 *     about purchasing a commercial license.
 *
 *     LEGAL TERMS : "CloudUnit" is a registered trademark of Treeptik and can't be used to endorse
 *     or promote products derived from this project without prior written permission from Treeptik.
 *     Products or services derived from this software may not be called "CloudUnit"
 *     nor may "Treeptik" or similar confusing terms appear in their names without prior written permission.
 *     For any questions, contact us : contact@treeptik.fr
 */

(function(){
  "use strict";
  angular.module('webuiApp.editApplication')
    .directive('editAppOverview', Overview);

  function Overview () {
    return {
      restrict: 'E',
      templateUrl: 'scripts/components/editApplication/overview/editApplication.overview.html',
      scope: {
        app: '='
      },
      controller: [
        '$scope',
        'ApplicationService',
        'ModuleService',
        '$filter',
        OverviewCtrl
      ],
      controllerAs: 'overview',
      bindToController: true
    };
  }

  function OverviewCtrl($scope, ApplicationService, ModuleService, $filter){

    var vm = this;

    vm.toggleServer = toggleServer;
    vm.getTplUrl = getTplUrl;
    vm.removeModule = removeModule;
    
    $scope.$on ( 'application:ready', function ( e, data ) {
      vm.app = data.app;
      ApplicationService.getVariableEnvironment(data.app.name, data.app.servers[0].containerID)
      .then ( function (data) {
        vm.app.env = data;
      } )    
    });
    
    $scope.$on ( 'application:addModule', function () {
      ApplicationService.getVariableEnvironment(vm.app.name, vm.app.servers[0].containerID)
      .then ( function (data) {
        vm.app.env = data;
      } )
    });
    
    
    init();

    function init() {
      if(vm.app) {
      ApplicationService.getVariableEnvironment(vm.app.name, vm.app.servers[0].containerID)
        .then ( function (data) {
          vm.app.env = data;
        } ) 
      }
    }
    
    ///////////////////////////////////////////

    function toggleServer(application) {
      if (application.status === 'START') {
        stopApplication(application.name)
      } else if (application.status === 'STOP') {
        startApplication(application.name);
      }
    }

    // Démarrage de l'application
    function startApplication(applicationName) {
      ApplicationService.start(applicationName);
      $scope.$emit('workInProgress', {delay: 3000});
    }

    // Arrêt de l'application
    function stopApplication(applicationName) {
      ApplicationService.stop(applicationName);
      $scope.$emit('workInProgress', {delay: 3000});
    }

    function getTplUrl(tpl){
      var moduleName = $filter('truncatestringfilter')(tpl);
      return 'scripts/components/editApplication/overview/templates/_' + moduleName + '-module.html';
    }

    // Suppression d'un module
    function removeModule ( applicationName, moduleName ) {
      return ModuleService.removeModule ( applicationName, moduleName );
    }
  }
})();
