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

  constructor(
    private goerliService: GoerliService,
    private serverService: ServerService,
  ) {
    this.allDeployedPolls = []
  }

  ngOnInit(): void {
    this.serverService.getAllPolls().subscribe((polls: Poll[]) => {
      this.allDeployedPolls = polls.filter((poll) => poll.isDeployed === true)
    })
  }

  // connect to metamask wallet on button click
  connectMetamaskWallet() {
    const { ethereum } = window
    this.goerliService.connectToWallet(ethereum)
  }
}
