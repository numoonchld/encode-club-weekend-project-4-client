import { Component, OnInit } from '@angular/core'
import { ethers } from 'ethers'
import { GoerliService } from '../goerli.service'
import { ServerService } from '../server.service'

import { Poll } from '../../assets/interfaces/serverService'

declare var window: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  allDeployedPolls: any[]
  recentVotes: any[]
  isFetchingWinner: Boolean

  constructor(
    private goerliService: GoerliService,
    private serverService: ServerService,
  ) {
    this.allDeployedPolls = []
    this.recentVotes = []
    this.isFetchingWinner = false
  }

  async ngOnInit(): Promise<void> {
    this.serverService.getAllPolls().subscribe((polls: Poll[]) => {
      this.allDeployedPolls = polls.filter((poll) => poll.isDeployed === true)
    })

    await (await this.serverService.getAllVotes()).subscribe(
      (response: { result: [] }) => {
        this.recentVotes = response.result.filter(
          (vote, voteIndex) => voteIndex < 10,
        )
      },
    )
  }

  // connect to metamask wallet on button click
  connectMetamaskWallet() {
    const { ethereum } = window
    this.goerliService.connectToWallet(ethereum)
  }

  // get winning proposal for ballot contract
  async getBallotLeader(deploymentAddress: string) {
    this.isFetchingWinner = true
    const { ethereum } = window
    const winnerRequest = await this.goerliService.pollLeader(
      deploymentAddress,
      ethereum,
    )

    window.alert(
      'Winning proposal is:',
      ethers.utils.formatBytes32String(winnerRequest),
    )

    this.isFetchingWinner = false
  }
}
