import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ServerService } from '../server.service'
import { GoerliService } from '../goerli.service'

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css'],
})
export class PollsComponent implements OnInit {
  createPollForm = this.fb.group({
    question: [''],
    options: this.fb.group({
      option1: [''],
      option2: [''],
      option3: [''],
      option4: [''],
      option5: [''],
    }),
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit() {}
}
