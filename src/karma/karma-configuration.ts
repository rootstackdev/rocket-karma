export type KarmaConfiguration = {
  readonly host: string,
  readonly username: string,
  readonly password: string,
  readonly rooms: string[],

  readonly kudoCommandPattern: RegExp,
  readonly maxKudosPerCommand: number,
  
  readonly kudoAwardMessage: string,
  readonly selfKudoMessage: string,
  readonly botKudoMessage: string,
}
