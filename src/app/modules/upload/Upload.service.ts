/**
 * Created by 574473 on 9/28/2016.
 */

import {Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class UploadService {
    progress$: Observable<number>;
    private progressObserver: any;
    private progress: number = 0;
    private boundary:String = Math.random().toString().substr(8);
    constructor () {
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
    }
    public makeFileRequest (url: string, params: string[], files: File[]): Observable<number> {
        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            for (let i = 0; i < files.length; i++) {
                formData.append("userFile", files[i], files[i].name);
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        //document.getElementById("path").innerHTML = JSON.parse(xhr.response).toString;
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                this.progressObserver.next(this.progress);
            };
            xhr.open('POST',url);
            xhr.setRequestHeader("content-type","multipart/form-data;boundary="+this.boundary);
            xhr.send(formData);
        });
    }
}
