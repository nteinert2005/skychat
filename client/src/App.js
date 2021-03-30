import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Components 
import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'
import Home from './components/Home/Home';

// Providers 
import { SocketProvider } from './socketContext'
import { MainProvider } from './mainContext'
import { UsersProvider } from './usersContext'

// Styles 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

if(process.env.NODE_ENV != 'production'){
  process.env.SERVER = "http://localhost:5151"
} else {
  process.env.SERVER = "http://skywriterapp.herokuapp.com"
}

function App() {
  return (
      <MainProvider>
        <UsersProvider>
          <SocketProvider>  
              <Router>
                <Switch>
                  <Route path="/chat" component={Chat} />
                  <Route path="/" exact component={Home} />
                  {/* <Route exact path='/' component={Login} />
                  <Route path='/chat' component={Chat} />
                  <Route component={DefaultPage} /> */}
                </Switch>
              </Router>
          </SocketProvider>
        </UsersProvider>
      </MainProvider>
  );
}

export default App;