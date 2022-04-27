import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './file.component.html',
    providers: [MessageService]
})
export class FileComponent {

    uploadedFiles: any[] = [];

    constructor(private messageService: MessageService) {}

    onUpload(event) {
        console.log("HOLKA MUNDO");

        for (const file of event.files) {
            this.uploadedFiles.push(file);
            console.log("HOLA");

        }

        this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }


}
