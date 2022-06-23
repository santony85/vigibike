import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Router } from '@angular/router';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2/ngx';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isconnected = 0;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private router: Router,
    private wifiwizard: WifiWizard2,
    private statusBar: StatusBar,
    private nativeStorage: Storage,
  ) {
    this.nativeStorage.create();
    const env=this;
    this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.nativeStorage.get('network')
        .then(
          data => {
            if(data == null){
              env.router.navigate(['/config']);
            }
            else{
              if(!this.isconnected){
                //if ios
                if (this.platform.is('ios')) {
                  this.wifiwizard
                  .iOSConnectNetwork(data.ssid, data.password)
                  .then((con) => {
                    console.log('wifi ok');
                    console.log(con);
                    this.isconnected=1;
                    env.router.navigate(['/home']);
                  });
                }
                //if android
                else if (this.platform.is('android')) {
                  this.wifiwizard
                  .connect(data.ssid, true, data.password, 'WPA')
                  .then((con) => {
                    console.log('wifi ok');
                    console.log(con);
                    this.isconnected=1;
                    env.router.navigate(['/home']);
                  });
                }
              }
            }
          },
          error => {
            env.router.navigate(['/config']);
          }
        );

    });
  }
}
