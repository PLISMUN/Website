export const stages = {
  public: true,
  accountCreation: process.env.NEXT_PUBLIC_STAGE_ACCOUNT_CREATION === "true",
  chairApplication: process.env.NEXT_PUBLIC_STAGE_CHAIR === "true",
  delegateApplication: process.env.NEXT_PUBLIC_STAGE_DELEGATE === "true",
}