export interface StakeSeed {
  clientSeed: string;
  serverSeed: string;
  nonce: number;
  cursor?: number;
}

export interface FloatExplanationStepProps {
  stepNumber: number;
  resultIndex: number;
  float: number;
  seed: StakeSeed;
}
