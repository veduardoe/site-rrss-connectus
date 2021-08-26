import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENV } from "src/environments/environment";

@Injectable()
export class PostsService {

    constructor(
        private http: HttpClient
    ) { }

    getPosts(fullPosts = 'true', typepost = 'POST', idPost = null) {
        const queryAdd = idPost ? '&idPost=' + idPost : '';
        return this.http.get(ENV.BACKEND + '/posts?fullPosts=' + fullPosts + '&typepost=' + typepost + queryAdd).toPromise();
    }

    crearPost(data) {
        return this.http.post(ENV.BACKEND + '/posts/crear-post', data).toPromise();
    }

    actualizarPost(data) {
        return this.http.put(ENV.BACKEND + '/posts/actualiza-post/' + data.id, data).toPromise();
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

    deletePost(idPost) {
        return this.http.delete(ENV.BACKEND + '/posts/' + idPost).toPromise();
    }

}