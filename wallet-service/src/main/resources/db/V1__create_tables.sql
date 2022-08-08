CREATE TABLE IF NOT EXISTS wallet
(
    id                 uuid       not null,
    taager_id          bigint     not null,
    currency_iso_code3 varchar(3) not null,
    primary key (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS Idx_wallet_taager_id_currency on wallet (taager_id, currency_iso_code3);
CREATE TABLE IF NOT EXISTS transaction_type
(
    id    varchar(50)  not null, -- CR (CREDITOR), DR (DEBTOR)
    value varchar(255) not null, -- CREDIT, DEBIT
    primary key (id)
);
INSERT INTO transaction_type
values ('CR', 'CREDIT'),
       ('DR', 'DEBIT');
CREATE TABLE IF NOT EXISTS amount_type
(
    id    varchar(255) not null, -- 'ELIGIBLE', 'EXPECTED'
    value varchar(255) not null, -- 'ELIGIBLE', 'EXPECTED'
    primary key (id)
);
INSERT INTO amount_type
values ('ELIGIBLE', 'ELIGIBLE'),
       ('EXPECTED', 'EXPECTED');
CREATE TABLE IF NOT EXISTS transaction
(
    id                     uuid           not null,
    wallet_id              uuid           not null,
    amount                 numeric(15, 2) not null,
    amount_type            varchar(255)   not null,
    type                   varchar(50)    not null, -- CR/DR
    service_type           varchar(255)   not null,
    service_sub_type       varchar(50),
    service_transaction_id varchar(50)    not null,
    operation_id           uuid           not null,
    created_at             timestamp      not null,
    primary key (id),
    constraint Fk_transaction_wallet_id
        foreign key (wallet_id)
            references wallet,
    constraint Fk_transaction_transaction_type
        foreign key (type)
            references transaction_type,
    constraint Fk_transaction_amount_type
        foreign key (amount_type)
            references amount_type
);
