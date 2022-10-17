import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { PollsComponent } from './polls/polls.component'
import { TokensComponent } from './tokens/tokens.component'
import { DelegationComponent } from './delegation/delegation.component'
import { VotingComponent } from './voting/voting.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'polls', component: PollsComponent },
  { path: 'tokens', component: TokensComponent },
  { path: 'delegation', component: DelegationComponent },
  { path: 'voting/:pollID', component: VotingComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
