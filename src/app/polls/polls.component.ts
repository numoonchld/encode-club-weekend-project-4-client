import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'

import { ServerService } from '../server.service'
import { GoerliService } from '../goerli.service'

declare var window: any

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css'],
})
export class PollsComponent implements OnInit {
  showMetamaskConnectButton: Boolean
  createPollForm = this.fb.group({
    question: [''],
    options: this.fb.group({
      option1: [''],
      option2: [''],
      option3: [''],
      option4: [''],
      option5: [''],
    }),
  })

  constructor(
    private fb: FormBuilder,
    private goerliService: GoerliService,
    private serverService: ServerService,
  ) {
    this.showMetamaskConnectButton = !this.goerliService.isLoggedIn
    console.log(this.showMetamaskConnectButton)
  }

  refreshButtonDisplay() {
    this.showMetamaskConnectButton = !this.goerliService.isLoggedIn
  }

  async ngOnInit(): Promise<void> {
    // check wallet connection

    if (!this.goerliService.isLoggedIn) {
      const { ethereum } = window
      await this.goerliService.checkWalletConnection(ethereum)
      this.refreshButtonDisplay()
    }
  }

  // connect to metamask wallet on button click
  async connectMetamaskWallet() {
    const { ethereum } = window
    await this.goerliService.connectToWallet(ethereum)
    this.refreshButtonDisplay()
  }

  onSubmit() {
    if (this.goerliService.isLoggedIn) {
      const { question, options } = this.createPollForm.value

      const proposals = Object.values({ ...options }).filter(
        (value) => value !== '',
      )

      console.log({ question, proposals })
    } else {
      window.alert('Connect site to MetaMask account to use this page!')
    }
  }
}
