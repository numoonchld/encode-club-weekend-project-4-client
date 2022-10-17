import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
// import { FormControl, FormGroup } from '@angular/forms'
import { ServerService } from '../server.service'

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

  constructor(
    private route: ActivatedRoute,
    private serverService: ServerService,
    private fb: FormBuilder,
  ) {
    this.pollID = ''
    this.poll = {}
    this.pollOptions = []
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
    console.log(this.castBallotForm.value)
  }
}
