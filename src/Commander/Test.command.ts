import { Command, CommandRunner } from 'nest-commander';

@Command({ name: 'test', options: {} })
export class TestCommand extends CommandRunner {
  async run(): Promise<void> {
    console.log('Test command runned');
  }
}
