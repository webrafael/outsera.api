export interface ProducerIntervalProps {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export class ProducerIntervalDto {

  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;

  constructor(props: Partial<ProducerIntervalProps>) {
    this.producer = props.producer || '';
    this.interval = props.interval || 0;
    this.previousWin = props.previousWin || 0;
    this.followingWin = props.followingWin || 0;
  }

  static fromEntity(entity: Partial<ProducerIntervalProps>) {
    return new ProducerIntervalDto(entity);
  }
}
