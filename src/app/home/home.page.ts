import { Component } from '@angular/core';

import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';

import { Base64} from '@ionic-native/base64/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  croppedImagepath = '';
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 100,
    heigth: 150,
    width: 150
  };

  base64String: string;

  constructor(
    private crop: Crop,
    private imagePicker: ImagePicker,
    private file: File,
    private base64: Base64
  ) { }

  pickImage() {
    this.imagePicker.getPictures(this.imagePickerOptions).then((results) => {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < results.length; i++) {
        this.cropImage(results[i]);
      }
    }, (err) => {
      alert(err);
    });
  }

  cropImage(imgPath) {
    this.crop.crop(imgPath, { quality: 50, targetHeight: 300, targetWidth: 500 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0]);
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
    }

    showCroppedImage(ImagePath) {
    this.isLoading = true;
    const copyPath = ImagePath;
    const splitPath = copyPath.split('/');
    const imageName = splitPath[splitPath.length - 1];
    const filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
        this.croppedImagepath = base64;
        this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });

    const rutaArchivo = 'file://';
    this.base64.encodeFile(rutaArchivo).then((base64File) => {
      this.base64String = base64File;
    });
  }
}
