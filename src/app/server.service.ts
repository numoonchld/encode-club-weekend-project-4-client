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

  // get total supply
  getTotalTokenSupply(): Observable<any> {
    return this.http
      .get(`${this.serverRootURL}/token-total-supply`)
      .pipe(tap((data) => JSON.stringify(data)))
  }

  // get token address
  getTokenGoerliAddress(): Observable<any> {
    return this.http
      .get(`${this.serverRootURL}/token-contract-address`)
      .pipe(tap((data) => JSON.stringify(data)))
  }

  // enquire token balance of address
  getAccountTokenBalance(accountAddress: string): Observable<any> {
    return this.http
      .get(`${this.serverRootURL}/token-balance/${accountAddress}`)
      .pipe(tap((data) => JSON.stringify(data)))
  }

  // mint tokens

  // record votes

  // read all votes
}
