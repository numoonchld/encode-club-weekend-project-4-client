import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { GoerliService } from '../goerli.service'
import { ethers } from 'ethers'

declare var window: any

@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.css'],
})
export class DelegationComponent implements OnInit {
  isSelfDelegating: Boolean
  isDelegating: Boolean
  delegationForm = this.fb.group({
    accountAddress: [''],
  })

  constructor(private goerliService: GoerliService, private fb: FormBuilder) {
    this.isSelfDelegating = false
    this.isDelegating = false
  }

  ngOnInit(): void {}

  async delegateVotingToSelf() {
    this.isSelfDelegating = true

    try {
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
          this.isSelfDelegating = false
          return
        }

        window.alert('Self-delegation failed!')
        this.isSelfDelegating = false
        return
      }
    } catch (error) {
      window.alert(error)
      this.isSelfDelegating = false
    }
  }

  async submitDelegation() {
    const { accountAddress } = this.delegationForm.value
    const extractedAddress: string = accountAddress!

    if (!ethers.utils.isAddress(extractedAddress)) {
      window.alert('Address seems to not be valid - please try again!')
      return
    }

    console.log({ extractedAddress })

    this.isDelegating = true

    try {
      const { ethereum } = window
      await this.goerliService.checkWalletConnection(ethereum)

      if (this.goerliService.isLoggedIn) {
        const delegationRequest = await this.goerliService.delegateToAddress(
          extractedAddress,
          ethereum,
        )

        if (delegationRequest.status === 1) {
          window.alert(
            'Delegation successful!',
            `Txn Hash (Goerli): ${delegationRequest.transactionHash}`,
          )
          this.isDelegating = false
          return
        }

        window.alert('Delegation failed!')
        this.isDelegating = false
        return
      }
    } catch (error) {
      window.alert(error)
      this.isDelegating = false
    }
  }
}
