import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse, ApiService} from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private readonly http: HttpClient) {
  }

  /**
   * Upload files to server
   * @param path Url
   * @param file the file that should be uploaded
   * @param method the http request method
   */
  upload<Data>(
    path: string,
    file: File,
    method: 'put' | 'post' = 'post'): Observable<ApiResponse<Data>> {
    const jwt = ApiService.getJwt();
    const authorizationHeaders = new HttpHeaders({Authorization: 'Bearer ' + jwt});
    const formData = new FormData();
    formData.append('file', file, file.name);
    // Support different upload form methods
    if (method === 'put') {
      return this.http.put(`${ApiService.getApiBaseUrl()}${path}`,
        formData,
        {headers: authorizationHeaders}) as Observable<ApiResponse<Data>>;
    }
    return this.http.post(`${ApiService.getApiBaseUrl()}${path}`,
      formData,
      {headers: authorizationHeaders}) as Observable<ApiResponse<Data>>;
  }
}
