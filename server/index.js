const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  // Private key: b92439358edc5eac48ce63597c3aaabbebc88103a6e8a4b4a367043a178b0e34
  "027ebdf0ccf71edb52f6ee1fc0349a82db77cb1fc19d94a2913d823666101e3aed": 100,
  // Private key: c07af90cb0600e92e9f7ec23dafe6ecd3919b6b35e7d19207c91468621e6fd70
  "024dc1e9248a828b8c30bad5e878745027ea3e2b6c9122e3d50c3b90794c35ec1a": 50,
  // Private key: 619e5135dd74a8a0754e589253a93f0b2429dc737a469553a26bc22f567c3531
  "0300ac5c556b966b7fd57a48700009eb3cdda9f425742a326a0612222cb3b7d4b4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
