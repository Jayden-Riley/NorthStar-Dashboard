# Northstar client workspace

A responsive business dashboard for managing customer contacts, invoices, and recorded payments. Dashboard metrics, analytics, and exports use Kenyan shillings (KSh) and update from the workspace records.

## Run locally

```sh
npm install
npm run dev
```

Open the local address printed by Vite.

## Explore the demo

- Email: `demo@northstar.app`
- Password: `northstar`

The demo opens with sample customers and invoices. New accounts start with an empty workspace. Account sessions, demo account details, customers, invoices, and payment records are saved in the current browser and isolated by account email.

## Client workflow

1. Add a customer with their contact details.
2. Create an invoice draft and choose the customer, description, amount, and due date.
3. Send the draft to move it into the awaiting-payment list.
4. When a client pays, record the payment method. Revenue, customer analytics, and reports update from that record.
5. Export the invoice register as CSV from Reports.

## Demo scope

Authentication and records are stored locally in the browser. Passwords are hashed before local storage, but this is not secure server-side authentication. Sending an invoice changes its local status; it does not email the client. Recording an M-Pesa, bank, cash, or card payment is a bookkeeping action; it does not move money. Production use needs a server-side account system, database, verified email delivery, backups, and a supported payment integration.
