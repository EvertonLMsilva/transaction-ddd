import { test, before, describe } from 'node:test';
import assert, { } from 'node:assert'
import Client from '../src/domain/entities/Client.tentity';

describe('Testando metodos do Client', () => {
  let newClient: any;
  before(() => {
    newClient = new Client("Test", "038.724.210-42");
  });

  test("Busca estados do cliente", () => {
    const dataClient = newClient.getStates();

    assert.strictEqual(dataClient.getStates(), {
      name: "Test",
      cpf: "038.724.210-42",
    });
  })
});