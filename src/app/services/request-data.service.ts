import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export enum LoadingState {
  Default,
  Loading,
  Loaded,
  Error,
}

@Injectable({
  providedIn: 'root',
})
export class RequestDataService {
  data: WritableSignal<any | null> = signal(null);
  state: WritableSignal<LoadingState> = signal(LoadingState.Default);
  timeTakenMilliseconds: WritableSignal<number | null> = signal(null);
  sizeBytes: WritableSignal<number | null> = signal(null);

  constructor(private http: HttpClient) {}

  async sendRequest(
    method: string,
    url: string,
    headers?: { [key: string]: string },
    params?: { [key: string]: string },
    body?: string
  ) {
    this.state.set(LoadingState.Loading);
    this.data.set(null);
    this.timeTakenMilliseconds.set(null);
    this.sizeBytes.set(null);

    const startTime = new Date();
    try {
      const r = this.http.request<any>(method, url, {
        headers: headers,
        params: params,
        body: body ? (body.length > 0 ? body : undefined) : undefined,
        observe: 'response',
        reportProgress: true,
      });

      r.subscribe((res) => {
        console.log({ res });
      });

      const response = await firstValueFrom(r);

      console.log({ response, headers: response?.headers?.keys() });
      this.data.set(response);
      this.state.set(LoadingState.Loaded);
      this.sizeBytes.set(this.roughSizeOfObject(response));
    } catch (error) {
      console.error('Error occurred:', error);
      this.data.set(error);
      this.state.set(LoadingState.Error);
      this.sizeBytes.set(null);
    } finally {
      const now = new Date();
      this.timeTakenMilliseconds.set(now.getTime() - startTime.getTime());
    }
  }

  roughSizeOfObject(object: any) {
    return JSON.stringify(object).length;
  }
}
