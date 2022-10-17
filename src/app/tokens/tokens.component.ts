import { Component, OnInit } from '@angular/core'

import { GoerliService } from '../goerli.service'
import { ServerService } from '../server.service'

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css'],
})
export class TokensComponent implements OnInit {
  tokenContractAddress: string
  tokenTotalSupply: string

  constructor(
    private goerliService: GoerliService,
    private serverService: ServerService,
  ) {
    this.tokenContractAddress = ''
    this.tokenTotalSupply = ''
  }

  ngOnInit(): void {
    this.serverService.getTotalTokenSupply().subscribe((data) => {
      this.tokenTotalSupply = data['result']
    })
    this.serverService.getTokenGoerliAddress().subscribe(async (data) => {
      this.tokenContractAddress = data['result']
    })
  }
}
