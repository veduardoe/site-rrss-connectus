import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostsService } from 'src/shared/services/posts.service';
import { UtilsService } from 'src/shared/services/utils.service';
@Component({
  selector: 'app-input-post',
  templateUrl: './input-post.component.html',
  styleUrls: ['./input-post.component.scss']
})
export class InputPostComponent implements OnInit {

  @Input() placeholder;

  publishText = '';
  listadoImagenes: any = [];
  imagenes: any = [];
  listadoFicheros: any = [];
  ficheros: any = [];
  loading = false;

  @Output() postSaved: EventEmitter<any> = new EventEmitter();

  constructor(
    public utils: UtilsService,
    private sanitizer: DomSanitizer,
    private postService: PostsService
  ) { }

  ngOnInit(): void {

  }

  openInputFile(id) {

    document.getElementById(id).click();
  }

  fileChange(e, id) {

    const files: File[] = e.target.files;
    const maxImages = 6;
    const maxFicheros = 5;
    const validateImagenes = (this.listadoImagenes.length + files.length) > maxImages;
    const validateFicheros = (this.listadoFicheros.length + files.length) > maxFicheros;

    if ((id === 'ficheros' && validateFicheros) || (id === 'imagenes' && validateImagenes)) {
      const tx = id === 'ficheros' ? 'files' : 'images';
      const nMAx = id === 'ficheros' ? maxFicheros : maxImages;
      this.utils.fnMainDialog("Error", "Max " + nMAx + " " + tx + " by post.", "message");
    } else {
      Object.keys(files).forEach(a => {
        this.prepareFile(files[a], id);
      });
      let val: any = document.getElementById(id);
      val.value = null;
    }
  }

  prepareFile(file: any, id) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;
    const idtxt = id === 'imagenes' ? 'imágenes' : 'ficheros';

    if (size < 1000) {

      reader.readAsDataURL(file);
      reader.onload = () => {

        let file64 = String(reader.result).split(";");
        let fichero = String(reader.result);
        let mimetype = file64[0].split(":")[1];
        const mimeTypeImagenes = mimetype == "image/jpg" || mimetype == "image/jpeg" || mimetype == "image/gif" || mimetype == "image/png";
        const mimeTypeDocumentos = mimetype == "application/pdf" || mimetype == "application/msword" || mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          || mimetype == "application/vnd.ms-excel" || mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        if ((mimeTypeImagenes && id === 'imagenes') || (mimeTypeDocumentos && id === 'ficheros')) {

          if (id === 'imagenes') {
            this.listadoImagenes.push({
              file: fichero,
              image: fichero,
              nombre: file.name,
              type: 'pic'
            });
          }

          if (id === 'ficheros') {
            this.listadoFicheros.push({
              file: fichero,
              filex: this.sanitizer.bypassSecurityTrustResourceUrl(fichero),
              nombre: file.name,
              type: 'doc'
            });
          }

        } else {
          this.utils.fnMessage("Some " + idtxt + " couldn't be loaded.");
        }
      };
    } else {
      this.utils.fnMessage("Some " + idtxt + " couldn't be loaded because of size over 1MB");
    }

  }

  borrarFichero(data: any, tipo: any, tipoFichero = 'FOTOS') {

    const idtxt = tipoFichero === 'FOTOS' ? 'imagen' : 'fichero';
    this.utils.fnMainDialog("Confirmation", "Are you sure to delete the " + idtxt + ". This action can't be reverted.", "confirm").subscribe(r => {
      if (r) {
        this[tipo].splice(data, 1);
        this.utils.fnMessage("" + idtxt + " deleted successfully.");
      }
    });

  }

  postItem() {

    const fich: any = this.listadoFicheros.concat(this.listadoImagenes);
    fich.forEach((val, key) => {
      delete val.image;
      delete val.thumbImage;
      delete val.filex;
      delete val.index;
    });

    if(this.publishText.trim().length == 0){
      this.utils.fnMainDialog('Error', "You need to write something to share.", 'message')
      return;
    }

    const data = {
      detalle: this.publishText,
      tipoPost: 'POST',
      ficheros: fich
    };

    this.loading = true;
    this.postService.crearPost(data).then((res: any) => {

      if (!res.response) {
        this.utils.fnMainDialog('Error', "Post can't be posted.", 'message')
      }

      setTimeout(() => {
        this.loading = false;
        this.clearInputPost();
        this.postSaved.emit(true);
      }, 1500);

    }).catch(err => {

      this.utils.fnMainDialog('Error', "Post can't be posted.", 'message')

      setTimeout(() => {
        this.loading = false;
      }, 1500);

    });
  }

  clearInputPost(){
    this.publishText = '';
    this.listadoImagenes = [];
    this.listadoFicheros = [];
  }


}
