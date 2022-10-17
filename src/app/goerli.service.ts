import { Injectable } from '@angular/core'
import { ethers } from 'ethers'

import { ServerService } from './server.service'

import * as G11TokenJSON from '../assets/contract-assets/token-contract/G11Token.json'

@Injectable({
  providedIn: 'root',
})
export class GoerliService {
  currentAccount: string
  isLoggedIn: Boolean
  tokenContractAddress: string
  contractJSON: any
  provider: ethers.providers.BaseProvider

  constructor(private serverService: ServerService) {
    this.currentAccount = ''
    this.isLoggedIn = false
    this.tokenContractAddress = ''
    this.contractJSON = G11TokenJSON
    this.provider = ethers.getDefaultProvider('goerli')
    this.serverService.getTokenGoerliAddress().subscribe((data) => {
      this.tokenContractAddress = data['result']
    })
  }

  // get metamask account/signer/address
  async checkWalletConnection(ethereum: any) {
    try {
      if (!ethereum) {
        console.log('Install MetaMask!')
        window.alert('MetaMask needed to use this site!')
      } else {
        console.log('Ethereum object found!', ethereum)
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found authorized account!', account)
        this.currentAccount = account

        this.isLoggedIn = true
        return true
      } else {
        console.log('No authorized account found!')
        this.isLoggedIn = false
        window.alert('Connect site to MetaMask account to use this page!')
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  // connect to metamask on button click
  async connectToWallet(ethereum: any): Promise<string> {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })

    const account = accounts[0]
    this.currentAccount = account
    this.isLoggedIn = true
    return this.currentAccount
  }

  // delegate
  async delegateToAddress(address: string, ethereum: any) {
    // console.log(this.contractJSON.abi)

    const metamaskWalletProvider = new ethers.providers.Web3Provider(ethereum)
    const metamaskSigner = metamaskWalletProvider.getSigner()

    const tokenContract = new ethers.Contract(
      this.tokenContractAddress,
      this.contractJSON.abi,
      this.provider,
    )

    const delegationTxn = await tokenContract
      .connect(metamaskSigner)
      ['delegate'](address)

    const txnConfirm = await delegationTxn.wait()

    return txnConfirm
  }
  // vote
  // results
}
