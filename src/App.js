import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { useEffect, useState } from "react";

const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState(0.1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getManager = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.allPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    };
    getManager();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await web3.eth.getAccounts();
    setLoading(true);
    await lottery.methods.enter().send({
      from: user[0],
      value: web3.utils.toWei(value, "ether"),
    });
    setLoading(false);
    setMessage("Bet accepted !");
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setLoading(true);
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setLoading(false);
    setMessage("A winner has been picked !");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lottery App</h1>
        <p>This contract is managed by: {manager}.</p>
        <p>
          There arre currently {players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={(event) => handleSubmit(event)}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value.toString())}
            ></input>
            <button className="Bet">Bet {value} ehter?</button>
          </div>
        </form>
        <hr />
        <h4>Pick a winner?</h4>
            <button className="Pick" onClick={(e) => pickWinner()}>Pick a winner</button>
        <hr />
        {loading 
        ? (<div className="Loader-container">
          <h3 className="Loader">{"Waiting for confirmation"}</h3>
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          </div>) 
        : (<h3 >{message}</h3>
        
        )}
      </header>
    </div>
  );
};

export default App;
