import { Injectable } from '@angular/core'
import { ethers } from 'ethers'

import { ServerService } from './server.service'

import * as G11TokenJSON from '../assets/contract-assets/token-contract/G11Token.json'
import * as TokenizedBallotJSON from '../assets/contract-assets/ballot-contract/TokenizedBallot.json'

@Injectable({
  providedIn: 'root',
})
export class GoerliService {
  currentAccount: string
  isLoggedIn: Boolean
  tokenContractAddress: string
  tokenContractJSON: any
  ballotContractJSON: any
  provider: ethers.providers.BaseProvider

  constructor(private serverService: ServerService) {
    this.currentAccount = ''
    this.isLoggedIn = false
    this.tokenContractAddress = ''
    this.tokenContractJSON = G11TokenJSON
    this.ballotContractJSON = TokenizedBallotJSON
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
    // console.log(this.tokenContractJSON.abi)

    const metamaskWalletProvider = new ethers.providers.Web3Provider(ethereum)
    const metamaskSigner = metamaskWalletProvider.getSigner()

    const tokenContract = new ethers.Contract(
      this.tokenContractAddress,
      this.tokenContractJSON.abi,
      this.provider,
    )

    const delegationTxn = await tokenContract
      .connect(metamaskSigner)
      ['delegate'](address)

    const txnConfirm = await delegationTxn.wait()

    return txnConfirm
  }

  // vote
  async votingForPoll(
    pollContractAddress: string,
    optionIndex: number,
    votingTokenFraction: string,
    ethereum: any,
  ) {
    // console.log(this.ballotContractJSON.abi)

    const metamaskWalletProvider = new ethers.providers.Web3Provider(ethereum)
    const metamaskSigner = metamaskWalletProvider.getSigner()

    const ballotContract = new ethers.Contract(
      pollContractAddress,
      this.ballotContractJSON.abi,
      this.provider,
    )

    const votingTxn = await ballotContract
      .connect(metamaskSigner)
      ['vote'](optionIndex, ethers.utils.parseEther(votingTokenFraction), {
        gasLimit: 1000000,
      })

    const txnConfirm = await votingTxn.wait()

    return txnConfirm
  }

  // results
  async pollLeader(pollContractAddress: string, ethereum: any) {
    // console.log(this.ballotContractJSON.abi)

    const metamaskWalletProvider = new ethers.providers.Web3Provider(ethereum)
    const metamaskSigner = metamaskWalletProvider.getSigner()

    const ballotContract = new ethers.Contract(
      pollContractAddress,
      this.ballotContractJSON.abi,
      this.provider,
    )

    const winnerTxn = await ballotContract.connect(metamaskSigner)['winnerName']
    console.log(winnerTxn)
    return winnerTxn
  }
}
