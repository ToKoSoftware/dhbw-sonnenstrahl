import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParameterCodec, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import cookies from 'browser-cookies';
import {filter, map, tap} from 'rxjs/operators';
import isBlank from 'is-blank';
import {environment} from '../../../environments/environment';
import {LoginService} from "../login/login.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly http: HttpClient,
    private readonly login: LoginService
  ) {
  }

  public get<Data>(
    path: string,
    queryParams?: { [key: string]: string | string[] | undefined },
  ): Observable<ApiResponse<Data>> {
    const params = queryParams == null ?
      undefined : new HttpParams({
        fromObject: removeBlank(queryParams) as { [key: string]: string | string[] }
      });

    const jwt = this.getJwt();
    return this.http.get(`${ApiService.getApiBaseUrl()}${path}`, {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params,
    }) as Observable<ApiResponse<Data>>;
  }

  public post<Data>(
    path: string,
    body?: { [key: string]: string | string[] | undefined },
  ): Observable<ApiResponse<Data>> {
    const httpParams = body === undefined ? undefined : new HttpParams({
      fromObject: removeBlank(body) as { [key: string]: string | string[] }
    });
    const jwt = this.getJwt();

    return this.http.post(`${ApiService.getApiBaseUrl()}${path}`, JSON.stringify(body), {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    }) as Observable<ApiResponse<Data>>;
  }

  public put<Data>(
    path: string,
    body?: { [key: string]: string | string[] | undefined },
  ): Observable<ApiResponse<Data>> {
    const jwt = this.getJwt();

    return this.http.put(`${ApiService.getApiBaseUrl()}${path}`, JSON.stringify(body), {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    }) as Observable<ApiResponse<Data>>;
  }

  public delete<Data = boolean>(
    path: string,
    queryParams?: { [key: string]: string | string[] | undefined },
  ): Observable<ApiResponse<Data>> {
    const params = queryParams == null ?
      undefined : new HttpParams({
        fromObject: removeBlank(queryParams) as { [key: string]: string | string[] }
      });

    const jwt = this.getJwt();
    return this.http.delete(`${ApiService.getApiBaseUrl()}${path}`, {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params,
    }) as Observable<ApiResponse<Data>>;
  }

  public upload<Data>(
    path: string,
    data: FormData,
    method: 'post' | 'put' = 'post'
  ): { progress$: Observable<number>, request$: Observable<ApiResponse<Data>> } {
    const handler = (url: string, body: FormData, options: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      observe: 'events';
      reportProgress: true;
    }) => {
      if (method === 'post') {
        return this.http.post(url, body, options);
      } else {
        return this.http.put(url, body, options);
      }
    };

    const jwt = this.getJwt();
    const progress$ = new Subject<number>();
    const request$ = handler(`${ApiService.getApiBaseUrl()}${path}`, data, {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
      },
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            progress$.next(
              event.total === undefined ? 0 : Math.floor(event.loaded / event.total * 100)
            );
            return undefined;

          case HttpEventType.Response:
            progress$.next(100);
            progress$.complete();
            return event.body as ApiResponse<Data>;

          default:
            return undefined;
        }
      }),
      filter(data => data !== undefined),
      tap({error: err => progress$.error(err)}),
    );

    return {
      progress$: progress$.asObservable(),
      request$: request$ as Observable<ApiResponse<Data>>,
    };
  }

  private static getApiBaseUrl(): string {
    return environment.apiUrl;
  }

  private getJwt(): string | null {
    return cookies.get('jwt');
  }
}

function removeBlank(
  input: { [key: string]: string | string[] | undefined }
): { [key: string]: string | string[] } {
  const result: { [key: string]: string | string[] } = {};
  for (const key in input) {
    if (isBlank(input[key])) {
      continue;
    }
    const element = input[key];
    if (Array.isArray(element)) {
      result[`${key}[]`] = element;
    } else {
      result[key] = element as string;
    }
  }
  return result;
}

export interface ApiResponse<Data> {
  success: true;
  data: Data;
  totalCount?: number;
  pageSize?: number;
}

export interface ApiError {
  success: false;
  data: null;
  errorMessage: string;
  statusCode: number;
  errorDetails?: unknown | unknown[];
}
