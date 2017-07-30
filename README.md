File saver typescript/angular 2

<b>HOW TO USE</b><br>

import {FileSaver} from "./file-saver"<br>

let fileSaver: any = new FileSaver();<BR>
   fileSaver.responseData = {RESPONSE};<BR>
   fileSaver.strFileName = {FILE NAME};<BR>
   fileSaver.strMimeType = {FILE TYPE};<BR>
   fileSaver.initSaveFile();
