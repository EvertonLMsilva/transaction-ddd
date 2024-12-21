import axios from 'axios';

//skip
describe('transações entre clientes', () => {
  let connectApi: any;
  let sender_id: string = "";
  let receiver_id: string = "";
  beforeAll(async () => {
    connectApi = axios.create({
      baseURL: "http://172.28.78.61:3000",
      headers: {
        "content-type": "application/json"
      }
    });

    await connectApi.post('/client', {
      name: "Test01",
      cpf: "3236.177.550-62"
    }).then((dataValues: any) => {
      sender_id = dataValues.data.id
    });
    await connectApi.post('/client', {
      name: "teste02",
      cpf: "333.956.250-44"
    }).then((dataValues: any) => {
      receiver_id = dataValues.data.id
    });
    await connectApi.put(`/account/${sender_id}`, {
      amount: 200,
    });
  });


  it("Cria transaction", async () => {
    const { status } = await connectApi.post('/transaction', {
      sender_id,
      receiver_id,
      amount: 50
    });

    expect(status).toBe(200);
  });

  afterAll(async () => {
    await connectApi.delete(`/client/${sender_id}/delete`);
    await connectApi.delete(`/client/${receiver_id}/delete`);
  });
})