/**
 * Created by 574473 on 9/28/2016.
 */
import { Component } from '@angular/core';
import { UploadService } from "./Upload.service";

@Component({
    selector: 'upload',
    templateUrl:'app/modules/upload/upload.html',
    providers:[UploadService]
})
export class UploadComponent {
	uploadedFiles: any[] = [];
		
    constructor(private service:UploadService) {
        this.service.progress$.subscribe(
            data => {
                console.log('progress = '+data);
            });
    }
	
	uploadFiles_prime(event) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }
    onChange(event) {
        console.log('onChange');
        var files = event.srcElement.files;
        console.log(files);
        this.service.makeFileRequest('http://localhost:8080/forecast-1.0.0-SNAPSHOT/uploadController/upload', [], files).subscribe(() => {
            console.log('sent');
        });
    }
}


