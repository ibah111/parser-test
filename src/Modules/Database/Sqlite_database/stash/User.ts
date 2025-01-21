import { DataTypes, InferAttributes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'Users',
})
export default class User extends Model<InferAttributes<User>> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.INTEGER)
  id: number;
}
