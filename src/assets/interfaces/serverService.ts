export interface CreateNewPollPayload {
  question: string
  proposals: string[]
  creator: string
}

export interface Poll {
  question: string
  proposals: string[]
  creator: string
  isDeployed: Boolean
  deploymentHash: string
  deploymentAddress: string
}
