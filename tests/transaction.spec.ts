import axios from 'axios';

//skip
describe.skip('transações entre clientes', () => {
  let connectApi: any;
  beforeEach(() => {
    connectApi = axios.create({
      baseURL: "http://172.28.78.61:3000",
      headers: {
        "content-type": "application/json"
      }
    })
  });

  it("Cria transaction", async () => {
    const sender_id = "23c227cb-7763-4022-bd45-1b4867ff59ea";
    const receiver_id = "1727ed99-658a-451f-9e8f-1e85bc8d5840";

    const createTransaction = await connectApi.post('/transaction', {
      sender_id,
      receiver_id,
      "amount": 50
    }).catch((err: any) => {
      console.log("Line: 25 ===>", err.message);
    });

    console.log("Line: 28 ===>", createTransaction)

  });

})