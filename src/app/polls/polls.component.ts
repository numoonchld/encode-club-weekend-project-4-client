import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'

import { NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { ServerService } from '../server.service'
import { GoerliService } from '../goerli.service'

import { Poll } from '../../assets/interfaces/serverService'

declare var window: any

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css'],
})
export class PollsComponent implements OnInit {
  showMetamaskConnectButton: Boolean
  latestPollCreated: Poll
  undeployedPolls: any[]
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
    private ngZone: NgZone,
    private router: Router,
  ) {
    this.showMetamaskConnectButton = !this.goerliService.isLoggedIn

    this.latestPollCreated = {
      question: '',
      proposals: [''],
      creator: '',
      isDeployed: new Boolean(),
      deploymentHash: '',
      deploymentAddress: '',
    }

    this.undeployedPolls = []
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

    // load undeployed polls
    this.serverService.getAllPolls().subscribe((polls: Poll[]) => {
      this.undeployedPolls = polls.filter((poll) => poll.isDeployed !== true)
    })
  }

  // connect to metamask wallet on button click
  async connectMetamaskWallet() {
    const { ethereum } = window
    await this.goerliService.connectToWallet(ethereum)
    this.refreshButtonDisplay()
  }

  async onSubmit() {
    if (this.goerliService.isLoggedIn) {
      const { question, options } = this.createPollForm.value

      const proposals = Object.values({ ...options }).filter(
        (value): Boolean => value !== '',
      )

      const creator = this.goerliService.currentAccount

      const newPollRequestBody: Object = {
        question,
        proposals,
        creator,
      }

      await (
        await this.serverService.createNewPoll(newPollRequestBody)
      ).subscribe((poll: { result: Poll }) => console.log(poll.result))

      this.ngZone.run(() => this.router.navigate(['/']))
    } else {
      window.alert('Connect site to MetaMask account to use this page!')
    }
    return
  }
}
