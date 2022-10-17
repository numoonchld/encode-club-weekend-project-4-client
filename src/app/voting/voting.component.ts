import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
import { ServerService } from '../server.service'
import { GoerliService } from '../goerli.service'

declare var window: any

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent implements OnInit {
  pollID: string
  poll: any
  pollOptions: any
  castBallotForm = this.fb.group({
    selectedOption: ['', [Validators.required]],
    tokenAmount: ['', [Validators.required]],
  })
  isVoting: Boolean

  constructor(
    private route: ActivatedRoute,
    private goerliService: GoerliService,
    private serverService: ServerService,
    private fb: FormBuilder,
  ) {
    this.pollID = ''
    this.poll = {}
    this.pollOptions = []
    this.isVoting = false
  }

  ngOnInit(): void {
    this.pollID = this.route.snapshot.paramMap.get('pollID')!

    this.serverService.getPollByID(this.pollID).subscribe((poll) => {
      // console.log(poll)
      this.poll = poll
      this.pollOptions = poll.proposals
    })
  }

  async voteSubmit() {
    this.isVoting = true

    const { selectedOption, tokenAmount } = this.castBallotForm.value
    const pollContractDeployedAtAddress = this.poll.deploymentAddress

    try {
      const { ethereum } = window
      await this.goerliService.checkWalletConnection(ethereum)

      if (this.goerliService.isLoggedIn) {
        const voteRequest = await this.goerliService.votingForPoll(
          pollContractDeployedAtAddress,
          parseInt(selectedOption!),
          tokenAmount!,
          ethereum,
        )

        if (voteRequest.status === 1) {
          const voterAddress = this.goerliService.currentAccount
          const creationEpoch = Math.floor(new Date().getTime() / 1000.0)
          const voteForQuestion = this.poll.question
          const selection = this.pollOptions[parseInt(selectedOption!)]

          await (
            await this.serverService.recordVoteOnServer({
              voterAddress,
              creationEpoch,
              voteForQuestion,
              selection,
            })
          ).subscribe((response) => {
            if (response.result) {
              window.alert(
                'Voting successful - has been recorded on server!',
                `Txn Hash (Goerli): ${voteRequest.transactionHash}`,
              )
              this.isVoting = false
              return
            }

            window.alert(
              'Voting successful - has failed to be recorded on server!',
            )
            this.isVoting = false
          })

          return
        }

        window.alert('Voting to ballot contract failed!')
        this.isVoting = false
        return
      }
    } catch (error) {
      console.error(error)
      window.alert(error)
      this.isVoting = false
    }
  }
}
