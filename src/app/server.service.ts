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
    return this.http.post(
      `${this.serverRootURL}/polls/new-poll`,
      createNewPollPayload,
    )
  }

  // get a single poll
  getPollByID(pollID: string): Observable<any> {
    return this.http
      .get(`${this.serverRootURL}/polls/${pollID}`)
      .pipe(tap((data) => JSON.stringify(data)))
  }

  // get all polls
  getAllPolls(): Observable<any> {
    return this.http
      .get(`${this.serverRootURL}/polls`)
      .pipe(tap((data) => JSON.stringify(data)))
  }

  // deploy poll contracts
  async deployPollContract(pollID: string): Promise<Observable<any>> {
    return this.http.post(`${this.serverRootURL}/polls/deploy-poll-contract`, {
      pollID,
    })
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
  async requestVotingTokens(address: string): Promise<Observable<any>> {
    return this.http.post(`${this.serverRootURL}/request-voting-tokens`, {
      address,
    })
  }

  // record vote

  // read all votes
}
