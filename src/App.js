import './App.css';
import Header from './components/Header';
import { Route, Switch } from "wouter";
import HomePage from "./pages/HomePage";
import Comprar from "./pages/Comprar";
import ReclamarPremios from "./pages/ReclamarPremios";
import Intercambiar from './pages/Intercambiar';
import Deploy from './pages/Desplegar';
import ObtenerBeneficios from './pages/ObtenerBeneficios';
import Administrar from './pages/Administrar';


function App() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route component={Comprar} path="/comprar/:lotteryAddress" />
          <Route component={ReclamarPremios} path="/reclamarPremios/:lotteryAddress" />
          <Route component={Intercambiar} path="/intercambiar/:lotteryAddress" />
          <Route component={Deploy} path="/deploy" />
          <Route component={ObtenerBeneficios} path="/obtenerBeneficios/:lotteryAddress" />
          <Route component={Administrar} path="/administrar" />
          <Route component={HomePage} path="/:redirectTo" />
          <Route component={HomePage} path="/" />
        </Switch>
      </div>
    );
}

export default App;
