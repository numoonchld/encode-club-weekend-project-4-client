import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class GoerliService {
  currentAccount: string

  constructor() {
    this.currentAccount = ''
  }

  // get metamask account/signer/address
  checkWalletConnection() {}

  // connect to metamask on button click
  async connectToWallet(ethereum: any): Promise<string> {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })

    const account = accounts[0]
    this.currentAccount = account
    return this.currentAccount
  }
  // delegate
  // vote
  // results
}
