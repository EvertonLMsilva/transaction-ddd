import axios from 'axios';

describe('Testando metodos do Client', () => {
  let connectApi: any;
  let client_id: string = "";
  beforeEach(() => {
    connectApi = axios.create({
      baseURL: "http://172.28.78.61:3000",
      headers: {
        "content-type": "application/json"
      }
    })
  });

  test("Deveria criar novo cliente", async () => {
    const { status, data } = await connectApi.post('/client', {
      name: "Isabela",
      cpf: "327.332.780-45"
    });
    console.log("Line: 20", data.id);

    client_id = data.id
    expect(status).toBe(200);
  });

  test("Deverias retornar um array de clientes", async () => {
    const { status, data } = await connectApi.get('/client');
    console.log("Line: 28", status, data);
    expect(status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test("Deveria retornar um cliente", async () => {
    const { status, data } = await connectApi.get(`/client/${client_id}`);
    console.log("Line: 36", status, data);
    expect(status).toBe(200);
    expect(typeof data).toBe("object");
    expect(Object.keys(data)).toHaveLength(6);
    expect(Object.keys(data)).toEqual(["id", "name", "cpf", "active", "created_at", "updated_at"]);
  });

  test("Deveria atualizar o client", async () => {
    const updateClient = await connectApi.put(`/client/${client_id}`, {
      name: "Isabela Sousa Moraes",
      cpf: "793.543.040-36",
      active: "false"
    });
    const { status, data } = await connectApi.get(`/client/${client_id}`);
    console.log("Line: 50", status, data);

    expect(updateClient.status).toBe(200);
    expect(status).toBe(200);
    expect(data.name).toBe("Isabela Sousa Moraes");
    expect(data.cpf).toBe("793.543.040-36");
    expect(data.active).toBe(false);
  });

  test("Deveria desativar cliente", async () => {
    const { status } = await connectApi.delete(`/client/${client_id}`);
    const findClient = await connectApi.get(`/client/${client_id}`);

    console.log("Line: 63", findClient.data);
    expect(status).toBe(200);
    expect(findClient?.data.active).toBe(false);
  });

  test("Deveria deletear cliente", async () => {
    const { status } = await connectApi.delete(`/client/${client_id}/delete`);
    expect(status).toBe(200);
  });
});