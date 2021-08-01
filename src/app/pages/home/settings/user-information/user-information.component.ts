import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENV } from 'src/environments/environment';
import { UserService } from 'src/shared/services/user.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonService } from 'src/shared/services/common.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {

  routeFotoPerfil = ENV.FOTOS_PERFIL;
  fotoPerfil;
  selectable = true;
  removable = true;
  loading = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl();
  filteredCategories: Observable<string[]>;
  categoriesAdded: string[] = [];
  categories: any[] = [];
  fullCategories = [];

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @Input() from = 'ui';

  mainForm = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl(''),
    confirmarClave: new FormControl(''),
    summary: new FormControl(''),
    categorias: new FormControl([]),
    foto: new FormControl(null),
    telefono: new FormControl(null),
    fechaNacimiento: new FormControl(null),
  });

  constructor(
    public utils: UtilsService,
    private userService: UserService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getMisDatos();
    this.setFilteredCategories();
  }

  get mf() {
    return this.mainForm.controls;
  }

  setFilteredCategories() {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      map((category: string | null) => category ? this._filter(category) : this.categories.slice()));
  }

  getMisDatos() {
    this.loading = true;
    this.userService.getMisDatos().then(async (res: any) => {
      await this.getCategorias();
      this.mainForm.patchValue(res.data[0]);
      if(res.data[0]){
        this.categoriesAdded = res.data[0].categorias.map( cat => {
          const checkCat = this.fullCategories.find(fc => {
            return cat === fc._id
          });
          return checkCat.detalle;
        });
      }
      setTimeout(()=> {
        this.loading = false;
      },1000);
    });
  }

  getCategorias() {
    return new Promise((resolve) => {
      this.commonService.getCategorias().then((res: any) => {
        this.fullCategories = res.data;
        res.data.forEach((val, idx) => {
          this.categories.push(val.detalle);
          resolve(true);
        });
      });
    });

  }

  openInputFile() {
    document.getElementById("fotoperfil").click();
  }

  fileChange(e) {
    const files: File[] = e.target.files;
    Object.keys(files).forEach(a => {
      this.prepareFile(files[a]);
    });
    let val: any = document.getElementById("fotoperfil");
    val.value = null;
  }

  prepareFile(file: any) {

    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;

    if (size < 1000) {

      reader.readAsDataURL(file);
      reader.onload = () => {

        let file64 = String(reader.result).split(";");
        let fichero = String(reader.result);
        let mimetype = file64[0].split(":")[1];
        const mimeTypeImagenes = mimetype == "image/jpg" || mimetype == "image/jpeg" || mimetype == "image/gif" || mimetype == "image/png";

        if (mimeTypeImagenes) {

          this.fotoPerfil = fichero;
          this.mainForm.patchValue({ foto: fichero });
        } else {
          this.utils.fnMessage("Illegal file type");
        }
      };
    } else {
      this.utils.fnMessage("The profile picture should not be larger than 1MB");
    }

  }

  removerImagen() {
    this.utils.fnMainDialog('Notification', 'are you sure to remove profile picture?', 'confirm').subscribe(res => {
      if (res) {
        this.mainForm.patchValue({ foto: null });
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.categoriesAdded.push(value);
    }
    event.chipInput!.clear();
    this.categoryCtrl.setValue(null);
  }

  remove(category: string): void {
    const index = this.categoriesAdded.indexOf(category);
    if (index >= 0) {
      this.categoriesAdded.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const check = this.categoriesAdded.find(item => item.toUpperCase() === event.option.viewValue.toUpperCase());
    if (!check) {
      this.categoriesAdded.push(event.option.viewValue);
    } else {
      this.utils.fnMainDialog('Error adding a category', 'The category has been already added', 'message');
    }
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(category => category.toLowerCase().includes(filterValue));
  }

  save() {

    this.triggedValidation(true);

    if (this.mainForm.valid) {
      const data = this.mainForm.getRawValue();
      if (!this.utils.validateEmail(data.email)) {
        this.utils.fnMainDialog('Error', 'The email is invalid. Review and try again.', 'message');
        return;
      }

      data.categorias = this.categoriesAdded.map(cat => {
        const cct = this.fullCategories.find(fcat => {
          return cat.toUpperCase() === fcat.detalle.toUpperCase();
        });
        return cct._id;
      });


      if(this.from === 'security'){
        if(!data.clave){
          this.utils.fnMainDialog('Error', 'Please, write your password', 'message');
          return;
        }

        if(!data.confirmarClave){
          this.utils.fnMainDialog('Error', 'Please, confirm your password', 'message');
          return;
        }
        
        if(data.clave !== data.confirmarClave){
          this.utils.fnMainDialog('Error', 'The passwords do not match. Review and try again.', 'message');
          return;
        }

        if(data.clave.length < 8 || data.clave.length > 15){
          this.utils.fnMainDialog('Error', 'Password must contain between 8 and 15 characters.', 'message');
          return;
        }

      }

      this.loading = true;


      this.userService.putActualizarPerfil(data).then((res: any) => {

        if (res.response) {

          this.utils.fnMainDialog('Notification', 'The information has been updated successfully.', 'message');

          if(this.from === 'security'){
            this.mainForm.patchValue({ clave: '', confirmarClave: ''})
          }

        } else {

          if (res.code === 'ARCHIVO_ERROR') {
            this.utils.fnMainDialog('Error', 'Profile picture format is not allowed.', 'message');
          } else {
            this.utils.fnMainDialog('Error', 'The information cannot be updated. Try again later.', 'message');
          }
        }

        setTimeout(()=> {
          this.loading = false;
        },1000);

      }).catch(err => {

        if (err.error.code === 'CORREO_EXISTE') {
          this.utils.fnMainDialog('Error', 'Email address is already used.', 'message');
        } else {
          this.utils.fnMainDialog('Error', 'The information cannot be updated. Try again later.', 'message');
        }

        setTimeout(()=> {
          this.loading = false;
        },1000);

      });
    }

  }

  triggedValidation(touched) {
    const obj = this.mainForm.value;
    Object.keys(obj).forEach(key => {
      touched ? this.mainForm.get(key).markAsTouched() : this.mainForm.get(key).markAsUntouched()
    });
  }

}
