import { ProducerIntervalDto } from "./producer-interval.dto";

export interface ProducerIntervalResponseProps {
  min: ProducerIntervalDto[];
  max: ProducerIntervalDto[];
}

export class ProducerIntervalResponseDto {
  min: ProducerIntervalDto[];
  max: ProducerIntervalDto[];

  constructor(props: Partial<ProducerIntervalResponseProps>) {
    this.min = props.min || [];
    this.max = props.max || [];
  }

  static fromEntity(entity: Partial<ProducerIntervalResponseProps>) {
    return new ProducerIntervalResponseDto(entity);
  }
}