import { Injectable, Inject } from '@angular/core';

import { Http, Response } from "@angular/http";
import { RollerResponse } from "../../models";
import { APP_CONFIG, AppConfig } from "../app-config";


@Injectable()
export class RollerService {
  config: any;


  plug: number = 6;
  constructor(private http: Http, @Inject(APP_CONFIG) config: AppConfig) {
    this.config.apiEndpoint = config.apiEndpoint + '/rlrls';
  }

  getRllrs(): Promise<RollerResponse> {
    return this.http.get(this.config.apiEndpoint)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

}
