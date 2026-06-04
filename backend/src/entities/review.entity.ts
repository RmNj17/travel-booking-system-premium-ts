import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TravelPackage } from './travel-package.entity';
import { User } from './user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => TravelPackage, (travelPackage) => travelPackage.reviews)
  package: TravelPackage;

  @Column('integer')
  rating: number;

  @Column('text')
  comment: string;
}
