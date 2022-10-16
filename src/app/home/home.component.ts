import { Component, OnInit } from '@angular/core'
import { GoerliService } from '../goerli.service'
declare var window: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private goerliService: GoerliService) {}

  ngOnInit(): void {}

  // connect to metamask wallet on button click
  connectMetamaskWallet() {
    const { ethereum } = window
    this.goerliService.connectToWallet(ethereum)
  }
}
