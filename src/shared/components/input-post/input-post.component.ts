import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PostsService } from 'src/shared/services/posts.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from 'src/shared/services/common.service';
import { ENV } from 'src/environments/environment';
import * as $ from 'jquery';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Ln } from 'src/shared/services/language.service';

@Component({
  selector: 'app-input-post',
  templateUrl: './input-post.component.html',
  styleUrls: ['./input-post.component.scss']
})
export class InputPostComponent implements OnInit, OnChanges {

  @Input() placeholder;
  @Input() isArticle = false;
  @Input() data;

  routeFicheros = ENV.FICHEROS;

  publishText = '';
  publishTitulo = '';
  publishCategoria = '';
  listadoImagenes: any = [];
  imagenes: any = [];
  listadoFicheros: any = [];
  ficheros: any = [];
  loading = false;
  limitText;
  loadedEditor = false;
  categorias = [];
  displayEmoji = false;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: false,
    showToolbar: true,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons:[ 
      ['fontName', 'outdent','indent', 'heading'],
      ['fontSize', 'textColor', 'backgroundColor', 'insertVideo',
      'customClasses','toggleEditorMode','removeFormat', 'insertImage']]
  };

  @Output() postSaved: EventEmitter<any> = new EventEmitter();

  constructor(
    public utils: UtilsService,
    private sanitizer: DomSanitizer,
    private postService: PostsService,
    private commonService: CommonService,
    public ln:Ln
  ) { }


  ngOnChanges() {
    this.limitText = this.isArticle ? null : 1000;
    this.setDataToUpdate();
    
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  openInputFile(id) {
    document.getElementById(id).click();
  }

  setDataToUpdate() {

    if (this.data) {

      this.publishText = this.data.detalle;
      this.publishTitulo = this.data.titulo;
      this.publishCategoria = this.data.idCategoria;

      let imagenes = this.data.ficheros.filter(item => {
        return item.type === 'pic';
      });

      imagenes = imagenes.map(item => {
        item.displayImg = this.routeFicheros + item.file + '?alt=media';
        item.uploaded = true;
        return item;
      });

      this.listadoImagenes = imagenes;

    }
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

  getCategorias() {
    this.commonService.getCategorias().then((res: any) => {
      this.categorias = res.data;
    });
  }
  prepareFile(file: any, id) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;
    const idtxt = id === 'imagenes' ? 'imágenes' : 'ficheros';

    if (size < 6000) {

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
              type: 'pic',
              uploaded: false
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
      this.utils.fnMessage("Some " + idtxt + " couldn't be loaded because of size over 6MB");
    }

  }

  borrarFichero(data: any, tipo: any, tipoFichero = 'FOTOS') {

    const idtxt = tipoFichero === 'FOTOS' ? 'image' : 'file';
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
      delete val.displayImg;
      delete val.image;
      delete val.thumbImage;
      delete val.filex;
      delete val.index;
    });

    if (this.publishText.trim().length == 0) {
      this.utils.fnMainDialog('Error', "You need to write something to share.", 'message')
      return;
    }

    if (this.isArticle && this.publishCategoria.trim() === '') {
      this.utils.fnMainDialog('Error', "You must select a category", 'message')
      return;
    }

    if (this.isArticle && this.publishTitulo.trim() === '') {
      this.utils.fnMainDialog('Error', "You must write a title of article", 'message')
      return;
    }

    const data: any = {
      detalle: this.publishText,
      tipoPost: this.isArticle ? 'ARTICLE' : 'POST',
      ficheros: fich,
      idCategoria: this.isArticle ? this.publishCategoria : null,
      titulo: this.isArticle ? this.publishTitulo : null,
      id: this.data?._id
    };

    this.loading = true;

    const request = this.data ? this.postService.actualizarPost(data) : this.postService.crearPost(data);

    request.then((res: any) => {

      if (!res.response) {
        this.utils.fnMainDialog('Error', "Post can't be posted.", 'message')
      }

      setTimeout(() => {
        this.loading = false;
        this.clearInputPost();
        this.postSaved.emit(true);
        this.displayEmoji = false;
      }, 1500);

    }).catch(err => {

      this.utils.fnMainDialog('Error', "Post can't be posted.", 'message')

      setTimeout(() => {
        this.loading = false;
      }, 1500);

    });
  }

  clearInputPost() {
    this.publishText = '';
    this.listadoImagenes = [];
    this.listadoFicheros = [];
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.listadoImagenes, event.previousIndex, event.currentIndex);
  }

  emojiSelected(e) {
    const cursorPosition = $('#inputText').prop("selectionStart");
    const nStrText = this.publishText.length;
    this.publishText = this.publishText.substr(0, cursorPosition) + e + this.publishText.substr(cursorPosition, nStrText);
    $('#inputText').focus();
  }

}  

