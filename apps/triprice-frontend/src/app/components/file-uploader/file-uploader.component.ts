import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FilePondComponent } from 'ngx-filepond';
import { ActualFileObject, FilePondOptions } from 'filepond';

@Component({
  selector: 'triprice-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
  private avatar: ActualFileObject;
  @ViewChild('myPond') myPond: FilePondComponent;
  @Output() avatarUploaded = new EventEmitter<ActualFileObject>();

  pondOptions: FilePondOptions = {
    server: {
      load: (source, load) => {
        const myRequest = new Request(source);
        fetch(myRequest).then(function (response) {
          response.blob().then(function (myBlob) {
            load(myBlob);
          });
        });
      },
    },
    onupdatefiles: (fileItems) => {
      const filesObjectArray = fileItems.map((fileItem) => fileItem.file);
      this.avatar = filesObjectArray[0];
      this.avatarUploaded.emit(this.avatar);
    },
    instantUpload: false,
    allowFileTypeValidation: true,
    maxFiles: 1,
    acceptedFileTypes: ['image/*'],
    labelFileTypeNotAllowed: 'קובץ זה אינו בין הפורמטים המורשים.',
    labelButtonProcessItem: 'fsafas',
    allowMultiple: false,
    labelIdle: 'Click here to upload a profile image',
  };

  pondHandleInit() {
    console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log('A file was added', event);
  }

  pondHandleActivateFile(event: any) {
    console.log('A file was activated', event);
  }
}
