import './App.css';
import Header from './components/Header';
import { Route, Switch } from "wouter";
import HomePage from "./pages/HomePage";
import Comprar from "./pages/Comprar";
import ReclamarPremios from "./pages/ReclamarPremios";
import Intercambiar from './pages/Intercambiar';
import IntercambiarBoleto from './pages/IntercambiarBoleto';
import GenerarGanadores from './pages/GenerarGanadores';
import GenerarGanadoresLoteria from './pages/GenerarGanadoresLoteria';
import ReclamarPremiosLoteria from './pages/ReclamarPremiosLoteria';
import Deploy from './pages/Desplegar';
import ObtenerBeneficios from './pages/ObtenerBeneficios';


function App() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route component={HomePage} path="/" />
          <Route component={Comprar} path="/comprar/:lotteryAddress" />
          <Route component={ReclamarPremios} path="/reclamarPremios" />
          <Route component={ReclamarPremiosLoteria} path="/reclamarPremiosLoteria/:lotteryAddress" />
          <Route component={Intercambiar} path="/intercambiar" />
          <Route component={IntercambiarBoleto} path="/intercambiarBoleto/:lotteryAddress" />
          <Route component={GenerarGanadores} path="/generarGanadores" />
          <Route component={GenerarGanadoresLoteria} path="/generarGanadoresLoteria/:lotteryAddress" />
          <Route component={Deploy} path="/deploy" />
          <Route component={ObtenerBeneficios} path="/obtenerBeneficios" />
        </Switch>
      </div>
    );
}

export default App;
