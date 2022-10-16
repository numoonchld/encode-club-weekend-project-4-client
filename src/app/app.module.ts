import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PollsComponent } from './polls/polls.component'
import { TokensComponent } from './tokens/tokens.component'
import { DelegationComponent } from './delegation/delegation.component'
import { VotingComponent } from './voting/voting.component'
import { HomeComponent } from './home/home.component'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    PollsComponent,
    TokensComponent,
    DelegationComponent,
    VotingComponent,
    HomeComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: Window, useValue: window }],
  bootstrap: [AppComponent],
})
export class AppModule {}
