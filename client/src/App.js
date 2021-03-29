import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'
import Messages from './components/Messages/Messages'
import { SocketProvider } from './socketContext'
import { MainProvider } from './mainContext'
import './App.css'
import { UsersProvider } from './usersContext'
import DefaultPage from './components/DefaultPage'

function App() {
  return (
      <MainProvider>
        <UsersProvider>
          <SocketProvider>
            
              <Router>
                <Switch>
                  <Route exact path='/' component={Login} />
                  <Route path="/messages/:id" component={Messages} />
                  <Route path='/chat' component={Chat} />
                  <Route component={DefaultPage} />
                </Switch>
              </Router>
      
          </SocketProvider>
        </UsersProvider>
      </MainProvider>
  );
}

export default App;