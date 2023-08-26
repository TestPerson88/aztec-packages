import { expect } from "@esm-bundle/chai";
import { Barretenberg } from '../../dest/browser/index.js';

describe('env', () => {
  let api: Barretenberg;

  beforeEach(async () => {
    api = await Barretenberg.new(3);
  }, 15000);

  afterEach(async () => {
    await api.destroy();
  });

  it('thread test', async () => {
    // Main thread doesn't do anything in this test, so -1.
    const threads = (await api.getNumThreads()) - 1;
    const iterations = 100000;
    const result = await api.testThreads(threads, iterations);
    expect(result).to.be.eq(iterations);
  });
});
