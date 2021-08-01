import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class PostsService {

    constructor(
        private http: HttpClient
    ) { }

    getPosts() {
        return this.http.get(ENV.BACKEND + '/posts').toPromise();
    }

    crearPost(data) {
        return this.http.post(ENV.BACKEND + '/posts/crear-post', data).toPromise();
    }

    setLike(idPost) {
        return this.http.post(ENV.BACKEND + '/posts/process-like', { idPost }).toPromise();
    }

    crearComentario(data) {
        return this.http.post(ENV.BACKEND + '/posts/crear-comentario', data).toPromise();
    }

    getComentarios(idPost) {
        return this.http.get(ENV.BACKEND + '/posts/comentarios?idPost=' + idPost).toPromise();
    }

}