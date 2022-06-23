import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  urljpg: any;
  loading: any;

  constructor(private sanitize: DomSanitizer,
      public loadingController: LoadingController,
      private insomnia: Insomnia,
      private platform: Platform) {
      this.platform.ready().then(() => {
        const env=this;
        this.insomnia.keepAwake()
        .then(
          () => {
            env.presentLoading();
            env.urljpg = this.sanitize.bypassSecurityTrustResourceUrl('http://192.168.4.1');
            env.reload();
            console.log('wake success');
          },
          () => {
            console.log('error');
          }
        );
      });
  }

  ngOnInit() {
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Connexion ...',
    });
    await this.loading.present();
  }

  reload(){
    setTimeout(() => {
      this.loading.dismiss();
      console.log('site started');
      this.urljpg = this.sanitize.bypassSecurityTrustResourceUrl('http://192.168.4.1');
    }, 10000);
  }

}
