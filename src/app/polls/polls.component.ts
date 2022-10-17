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
  isPollDeploying: Boolean
  isNewPollCreating: Boolean
  currentlyDeployingPollID: string

  constructor(
    private fb: FormBuilder,
    private goerliService: GoerliService,
    private serverService: ServerService,
    private ngZone: NgZone,
    private router: Router,
  ) {
    this.isPollDeploying = false
    this.isNewPollCreating = false
    this.currentlyDeployingPollID = ''

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

  // new poll form submit
  async onSubmit() {
    if (this.goerliService.isLoggedIn) {
      this.isNewPollCreating = true

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
      ).subscribe((poll: { result: Poll }) => {
        console.log('poll result', poll.result)

        if (poll.result) {
          this.isNewPollCreating = false
          return
        }

        window.alert('Poll creation failed!')
        this.isNewPollCreating = false
        return
      })
    } else {
      window.alert('Connect site to MetaMask account to use this page!')
    }
    return
  }

  async deployPollContract(pollID: string): Promise<void> {
    this.isPollDeploying = true
    this.currentlyDeployingPollID = pollID

    const pollContractDeployResponse = await this.serverService.deployPollContract(
      pollID,
    )

    pollContractDeployResponse.subscribe((response) => {
      console.log('poll deploy response: ', response)

      if (response.result) {
        this.isPollDeploying = false
        this.currentlyDeployingPollID = ''
        this.ngZone.run(() => this.router.navigate(['/']))
        return
      }

      window.alert('Poll deploy failed!')
      this.isPollDeploying = false
      this.currentlyDeployingPollID = ''
      return
    })
  }
}
