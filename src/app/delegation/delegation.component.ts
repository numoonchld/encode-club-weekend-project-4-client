import { Component, OnInit } from '@angular/core'

import { GoerliService } from '../goerli.service'

declare var window: any

@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.css'],
})
export class DelegationComponent implements OnInit {
  isDelegating: Boolean

  constructor(private goerliService: GoerliService) {
    this.isDelegating = false
  }

  ngOnInit(): void {}

  async delegateVotingToSelf() {
    this.isDelegating = true

    const { ethereum } = window
    await this.goerliService.checkWalletConnection(ethereum)

    if (this.goerliService.isLoggedIn) {
      const selfDelegationRequest = await this.goerliService.delegateToAddress(
        this.goerliService.currentAccount,
        ethereum,
      )

      if (selfDelegationRequest.status === 1) {
        window.alert(
          'Self-delegation successful!',
          `Txn Hash (Goerli): ${selfDelegationRequest.transactionHash}`,
        )
        this.isDelegating = false
        return
      }

      window.alert('Self-delegation failed!')
      this.isDelegating = false
      return
    }
  }
}
