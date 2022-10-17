import { Component, OnInit } from '@angular/core'

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

  constructor(
    private goerliService: GoerliService,
    private serverService: ServerService,
  ) {
    this.allDeployedPolls = []
    this.recentVotes = []
  }

  async ngOnInit(): Promise<void> {
    this.serverService.getAllPolls().subscribe((polls: Poll[]) => {
      this.allDeployedPolls = polls.filter((poll) => poll.isDeployed === true)
    })

    await (await this.serverService.getAllVotes()).subscribe(
      (response: { result: [] }) => {
        console.log(response)
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
}
