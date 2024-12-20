import express, { Request, Response } from "express";
import pgp from "pg-promise";

const app = express();
app.use(express.json());

const db = pgp({
  schema: "transactions_bank"
})("postgres://admin:admin%40123@localhost:5432/transaction_db");

//client
app.get('/client', async (req: Request, res: Response): Promise<any> => {
  try {
    const listClient = await db.query(`select * from clients;`);

    res.status(200).json({ data: listClient });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching clients' });
  }
});

app.post('/client', async (req: Request, res: Response): Promise<any> => {
  const { body } = req;
  try {
    const findClient = await db.query(`SELECT id FROM clients WHERE cpf = '${body.cpf}'`)
      .then((dataValues) => dataValues[0]);
    if (!findClient) {
      await db.query(`INSERT INTO clients (name, cpf) VALUES ('${body.name}', '${body.cpf}')`)
        .catch((error: any) => { throw new Error(error.message) });
    } else {
      return res.status(404).json({
        Err: "User already registered"
      })
    }

    const findNewClient = await db.query(`SELECT id, name FROM clients WHERE cpf = '${body.cpf}'`)
      .then((dataValues) => dataValues[0]);

    const findAccount = await db.query(`SELECT id FROM accounts WHERE client_id = '${findNewClient.id}'`)
      .then((dataValues) => dataValues[0]);
    if (!findAccount) {
      await db.query(`INSERT INTO accounts (client_id, amount) VALUES ('${findNewClient.id}', 0)`)
        .catch((error: any) => { throw new Error(error.message) });
    }
    const findNewAccount = await db.query(`SELECT amount FROM accounts WHERE client_id = '${findNewClient.id}'`)
      .then((dataValues) => dataValues[0]);

    res.status(200).json({
      data: {
        ...findNewClient,
        amount: findNewAccount.amount
      }
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }

});

//account client
app.get('/account/:client_id', async (req: Request, res: Response): Promise<any> => {
  const { params } = req;
  try {

    if (!params.client_id) return res.status(400).json({ err: "Id required!" })

    const findAccount = await db.query(`
    SELECT * FROM accounts 
    WHERE client_id = '${params.client_id}'
    `);

    res.status(200).json({ data: findAccount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
})

app.post('/account', async (req: Request, res: Response): Promise<any> => {
  const { body } = req;

  try {
    const findAccount = await db.query(`
      SELECT * FROM accounts 
      WHERE client_id = '${body.client_id}'
      `).then((dataValues) => dataValues[0]);

    if (!findAccount) {
      return res.status(404).json({ err: "Client not found!" })
    }

    const parseAmount = (parseFloat(findAccount.amount) + parseFloat(body.amount)).toFixed(2)

    await db.query(`
        UPDATE accounts
        SET amount = ${parseFloat(parseAmount)}
        WHERE client_id = '${body.client_id}'
        `);

    res.status(200).json({ message: "Update success!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
})

//transaction client
app.post('/transaction', async (req: Request, res: Response): Promise<any> => {
  const { body } = req;
  try {
    if (!body.sender_id) return res.status(400).send({ err: "Sender_id required!" });
    if (!body.receiver_id) return res.status(400).send({ err: "Receiver_id required!" });
    if (!body.amount || body.amount <= 0) return res.status(400).send({ err: "Amount required and cannot be negative!" });

    const { sender_id, receiver_id, amount } = req.body;

    const sender = await db.query(`
      SELECT C.name, C.cpf, C.created_at, A.amount FROM clients C
      INNER JOIN accounts A 
        ON A.client_id = C.id
      WHERE A.client_id = '${sender_id}'
      GROUP BY C.name, C.cpf, C.created_at, A.amount;
      `)
      .then((dataValues) => {
        if (dataValues.length <= 0) return undefined;
        dataValues[0].amount = parseFloat(dataValues[0].amount)
        return dataValues[0];
      });

    if (!sender) return res.status(400).send({ err: "Sender invalid!" });

    const receiver = await db.query(`
      SELECT C.name, C.cpf, C.created_at, A.amount FROM clients C
      INNER JOIN accounts A 
        ON A.client_id = C.id
      WHERE A.client_id = '${receiver_id}'
      GROUP BY C.name, C.cpf, C.created_at, A.amount;
      `)
      .then((dataValues) => {
        if (dataValues.length <= 0) return undefined;
        dataValues[0].amount = parseFloat(dataValues[0].amount)
        return dataValues[0]
      });

    if (!receiver) res.status(400).send({ err: "Receiver invalid!" });
    if (parseFloat(sender.amount) <= 0 || parseFloat(sender.amount) < amount) {
      return res.status(400).send({ err: "Insufficient value!" });
    }

    const totalWithdraw = parseFloat((sender.amount - amount).toFixed(2));

    await db.query(`
      UPDATE accounts 
      SET amount = ${totalWithdraw}
      WHERE client_id = '${sender_id}'
      `);

    const totalDeposit = parseFloat((receiver.amount + amount).toFixed(2));

    await db.query(`
      UPDATE accounts 
      SET amount = ${totalDeposit}  
      WHERE client_id = '${receiver_id}'
    `);

    await db.query(
      `INSERT INTO transactions (sender_id, receiver_id, amount) 
      VALUES('${sender_id}', '${receiver_id}', '${amount}')`
    )

    res.status(200).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
})

app.listen(3000, '0.0.0.0', () => {
  console.warn('Listening on 0.0.0.0:3000');
});