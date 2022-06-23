import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  scannedOutput: any;
  scannedData: any;

  constructor(
    private platform: Platform,
    private router: Router,
    private wifiwizard: WifiWizard2,
    private barcodeScanner: BarcodeScanner,
    private nativeStorage: Storage,
  ) {}

  ngOnInit() {}

  scanBarcode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
      orientation: 'landscape',
    };
    this.barcodeScanner.scan(options)
    .then(barcodeData => {
      console.log('Barcode data', barcodeData);
      const myArray = barcodeData.text.split(';');
      const net = {ssid:myArray[0], password:myArray[1]};
      this.scannedData = net.ssid;
      const env=this;
      //if ios
      if (this.platform.is('ios')) {
        this.wifiwizard
        .iOSConnectNetwork(net.ssid, net.password)
        .then((con) => {
          console.log('wifi ok');
          console.log(con);
          //save to memory
          env.nativeStorage.set('network', net);
          env.router.navigate(['/home']);
        });
      }
      //if android
      else if (this.platform.is('android')) {
        this.wifiwizard
        .connect(net.ssid, true, net.password, 'WPA')
        .then((con) => {
          console.log('wifi ok');
          console.log(con);
          //save to memory
          env.nativeStorage.set('network', net);
          env.router.navigate(['/home']);
        });
      }
    })
    .catch(err => {
      console.log('Error', err);
    });
  }

}
