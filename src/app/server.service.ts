import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  serverRootURL: string = 'http://localhost:3000/'

  constructor(private http: HttpClient) {}

  // create polls
  // mint tokens
  // record votes
  // read ll votes
}
