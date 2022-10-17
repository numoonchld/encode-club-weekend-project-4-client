import { Component, OnInit } from '@angular/core'

import { GoerliService } from '../goerli.service'
import { ServerService } from '../server.service'

declare var window: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  allPolls: any[]

  constructor(
    private goerliService: GoerliService,
    private serverService: ServerService,
  ) {
    this.allPolls = []
  }

  ngOnInit(): void {
    this.serverService.getAllPolls().subscribe({
      next: (polls) => {
        this.allPolls = polls
      },
    })
    console.log(this.allPolls)
    // this.allPolls =
  }

  // connect to metamask wallet on button click
  connectMetamaskWallet() {
    const { ethereum } = window
    this.goerliService.connectToWallet(ethereum)
  }
}
