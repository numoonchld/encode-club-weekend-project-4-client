import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'

import { CreateNewPollPayload } from 'src/assets/interfaces/serverService'

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  serverRootURL: string = 'http://localhost:3000'

  constructor(private http: HttpClient) {}

  // create polls
  async createNewPoll(
    createNewPollPayload: CreateNewPollPayload | Object,
  ): Promise<Observable<any>> {
    console.log('post new poll...', createNewPollPayload)
    return this.http.post(
      `${this.serverRootURL}/polls/new-poll`,
      createNewPollPayload,
    )
  }

  // get all polls
  getAllPolls(): Observable<any> {
    return this.http
      .get(`${this.serverRootURL}/polls`)
      .pipe(tap((data) => JSON.stringify(data)))
  }
  // mint tokens
  // record votes
  // read ll votes
}
