import './App.css';
import Test from "./Test";
import Test2 from "./Test2";

function App() {

  return (
    <div className="App">
      <header className="App-header">
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>

              <div>
                  TypeScript+Class
                  <Test/>
              </div>
              <div>
                  TypeScript+Hook
                  <Test2/>
              </div>
          </div>
      </header>
    </div>
  );
}

export default App;
