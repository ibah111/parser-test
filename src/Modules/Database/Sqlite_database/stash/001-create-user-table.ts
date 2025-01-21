import { DataTypes, QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = ({ context }) =>
  context.sequelize.transaction((transaction) =>
    Promise.all([
      context.createTable(
        'Users',
        {
          id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
          },
        },
        {
          transaction,
        },
      ),
    ]),
  );
