routerApp.service('notifications', ['ngToast', '$mdDialog', function(ngToast, $mdDialog) {

    this.toast = function(msgType, content) {
        ngToast.dismiss();
        var _className;
        if (msgType == '0') {
            _className = 'danger';
        } else if (msgType == '1') {
            _className = 'success';
        }
        ngToast.create({
            className: _className,
            content: content,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            dismissOnClick: true,
            dismissButton: true
        });
    }

    this.alertDialog = function(title, content) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('input[name="editForm"]')))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(content)
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
        );
    }

    this.startLoading = function(displayText) {
        $mdDialog.show({
            template: '<md-dialog ng-cloak style="max-width:400px;">' +
                ' <md-dialog-content style="padding:20px;">' +
                '   <div layout="row" layout-align="start center">' +
                '     <md-progress-circular class="md-accent" md-mode="indeterminate" md-diameter="40" style=" padding-right: 45px"></md-progress-circular>' +
                '     <span style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">' + displayText + '</span>' +
                '   </div>' +
                ' </md-dialog-content>' +
                '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })
    }
    this.finishLoading = function() {
        $mdDialog.hide();
    }
}]);