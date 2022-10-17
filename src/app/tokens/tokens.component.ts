import { Component, OnInit } from '@angular/core'

import { GoerliService } from '../goerli.service'
import { ServerService } from '../server.service'

declare var window: any

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css'],
})
export class TokensComponent implements OnInit {
  tokenContractAddress: string
  tokenTotalSupply: string
  metamaskAccountTokenBalance: string
  isMinting: Boolean

  constructor(
    private goerliService: GoerliService,
    private serverService: ServerService,
  ) {
    this.tokenContractAddress = ''
    this.tokenTotalSupply = ''
    this.metamaskAccountTokenBalance = ''
    this.isMinting = false
  }

  ngOnInit(): void {
    this.serverService.getTotalTokenSupply().subscribe((data) => {
      this.tokenTotalSupply = data['result']
    })
    this.serverService.getTokenGoerliAddress().subscribe((data) => {
      this.tokenContractAddress = data['result']
    })
  }

  async getMetamaskWalletAccountBalance() {
    const { ethereum } = window
    await this.goerliService.checkWalletConnection(ethereum)

    if (this.goerliService.isLoggedIn) {
      this.serverService
        .getAccountTokenBalance(this.goerliService.currentAccount)
        .subscribe((data) => {
          this.metamaskAccountTokenBalance = data['result']
        })
    }
  }

  async mintTokensToMetamaskWalletAccount() {
    const { ethereum } = window
    await this.goerliService.checkWalletConnection(ethereum)

    if (this.goerliService.isLoggedIn) {
      this.isMinting = true
      const mintRequest = await this.serverService.requestVotingTokens(
        this.goerliService.currentAccount,
      )
      mintRequest.subscribe((data) => {
        console.log(data.result)
        this.isMinting = false
        if (data.result) {
          window.alert('Minting was successful!')
        } else {
          window.alert('Minting failed - try again sometime later!')
        }
      })
    }
  }
}
