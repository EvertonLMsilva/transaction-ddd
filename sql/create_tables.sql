CREATE TABLE IF NOT EXISTS transactions_bank.clients
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    cpf character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions_bank.accounts
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id uuid NOT NULL,
    amount numeric,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions_bank.transactions
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    amount numeric,
    status character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'pending'::character varying,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

END;