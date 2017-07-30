export class FileSaver {

    private self: any;
    private currentFileName: string = "download";
    private currentMimeType: string = "application/octet-stream";
    private anchor: any;
    private blob: any;
    private currentBlob: any;
    private reader: any;
    private url: string;

    private _responseData: any = {};
    private _strFileName: string = '';
    private _strMimeType: string = '';

    private toString: any = ( a: any ) => String(a);

    public set responseData ( data: any )
    {
        this._responseData = data;
    }

    public get responseData () : any
    {
        return this._responseData;
    }

    public set strFileName ( strFileName: string )
    {
        this._strFileName = strFileName;
    }

    public get strFileName () : string
    {
        return this._strFileName;
    }

    public set strMimeType ( strMimeType: string )
    {
        this._strMimeType = strMimeType;
    }

    public get strMimeType () : string
    {
        return this._strMimeType;
    }

    public initSaveFile() : void
    {
        this.self = window;
        this.currentBlob = this.self.Blob || this.self.MozBlob || this.self.WebKitBlob || this.toString;
        this.currentBlob = this.currentBlob.call ? this.currentBlob.bind(this.self) : Blob;
        this.anchor = document.createElement("a");

        if ( this.strMimeType.length > 0 )
        {
            this.currentMimeType = this.strMimeType;
        }

        if ( this.strFileName.length > 0 )
        {
            this.currentFileName = this.strFileName;
        }

        if( this.isSafari() &&  this.checkSafariVersion() )
        {
            this.saveSafariFile();
        }
        else
        {
            if( /^this.responseData\:[\w+\-]+\/[\w+\-]+[,;]/.test(this.responseData) )
            {
                if( this.responseData.length > (1024*1024*1.999) && this.currentBlob !== this.toString )
                {
                    this.responseData = this.dataUrlToBlob(this.responseData);
                }
                else
                {
                    if ( navigator.msSaveBlob )
                    {
                        navigator.msSaveBlob(this.dataUrlToBlob(this.responseData), this.currentFileName);
                    }
                    else
                    {
                        this.url = this.responseData;
                        this.saver();
                    }

                    return;
                }
            }

            if ( this.responseData instanceof this.currentBlob )
            {
                this.blob = this.responseData;
            }
            else
            {
                this.blob = new this.currentBlob([this.responseData], {type: this.currentMimeType});
            }

            if ( navigator.msSaveBlob )
            {
                navigator.msSaveBlob(this.blob, this.currentFileName);
                return;
            }

            if( this.self.URL )
            {
                this.url = this.self.URL.createObjectURL(this.blob);
                this.saver(true);
            }
            else
            {
                if( typeof this.blob === "string" || this.blob.constructor === this.toString )
                {
                    try
                    {
                        this.url = "data:" + this.currentMimeType + ";base64," + this.self.btoa(this.blob);
                    }
                    catch(y)
                    {
                        this.url = "data:" + this.currentMimeType + "," + encodeURIComponent(this.blob);
                    }
                }
                else
                {
                    this.reader = new FileReader();

                    this.reader.onload = ( e: any )=> {
                        this.url = e.result;
                    };

                    this.reader.readAsDataURL(this.blob);
                    this.saver();
                }

                return;
            }
        }
    }

    private dataUrlToBlob( strUrl: string ) : any
    {
        let parts: any = strUrl.split(/[:;,]/),
            type: string = parts[1],
            decoder: any = parts[2] == "base64" ? atob : decodeURIComponent,
            binData: string = decoder(parts.pop()),
            mx: number = binData.length,
            i: number = 0,
            uiArr: any = new Uint8Array(mx);

        for( i; i < mx; ++i)
        {
            uiArr[i] = binData.charCodeAt(i);
        }

        return new this.currentBlob([uiArr], {type: type});
    }

    private saver( winMode?: boolean ) : void
    {
        if ( 'download' in this.anchor )
        {
            this.downloadFile(winMode);
        }
        else
        {
            let iframe = document.createElement("iframe");
            document.body.appendChild(iframe);

            if( ! winMode )
            {
                this.url = "data:" + this.url.replace(/^this.responseData:([\w\/\-\+]+)/, this.currentMimeType);
            }

            iframe.src = this.url;

            setTimeout(()=> {
                document.body.removeChild(iframe);
            }, 333);
        }
    }

    private saveSafariFile() : void
    {
        let uInt8Array: any = new Uint8Array(this.responseData),
            i: number = uInt8Array.length,
            binaryString: Array<any> = new Array(i);

        while (i--)
        {
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }

        this.url = "data:"+ this.currentMimeType +";base64," + window.btoa(binaryString.join(''));

        if( ! window.open(this.url) )
        {
            window.location.href = this.url;
        }
    }

    private downloadFile( winMode?: boolean ) : void
    {
        this.anchor.href = this.url;
        this.anchor.setAttribute("download", this.currentFileName);
        this.anchor.className = "download-js-link";
        this.anchor.innerHTML = "downloading...";
        this.anchor.style.display = "none";

        document.body.appendChild(this.anchor);

        setTimeout(()=> {

            this.anchor.click();
            document.body.removeChild(this.anchor);

            if( winMode )
            {
                setTimeout(()=> {
                    this.self.URL.revokeObjectURL(this.anchor.href);
                }, 250);
            }
        }, 66);
    }

    private isSafari() : boolean
    {
        return (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.Safari\//.test(navigator.userAgent)) ? true : false;
    }

    private checkSafariVersion() : boolean
    {
        let version: Array<any> = navigator.userAgent.match(/version\/(\d+).(\d+)/i);

        return (Number(version[1]+version[2]) <= 61) ? true : false;
    }
}
