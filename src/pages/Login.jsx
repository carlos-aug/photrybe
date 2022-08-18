import { Component } from 'react';
import { requestLogin } from '../helpers/loginAPI';

export default class Login extends Component {

  state = {
    email: '',
    password: '',
    shouldShowEmailWarning: false,
    shouldShowPasswordWarning: false,
    isLoading: false,
    requestReturnedWrongPassword: false
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState(({ email, password }) => {
      const showEmailWarning = !(email.includes('@') && email.toLowerCase().includes(".com"));
      const showPasswordWarning = !(password.length >= 8);

      return {
        shouldShowEmailWarning: showEmailWarning,
        shouldShowPasswordWarning: showPasswordWarning
      }
    }, this.requestLoginIfPossible);
  }

  requestLoginIfPossible = () => {
    const { shouldShowEmailWarning, shouldShowPasswordWarning } = this.state;
    const canRequestLogin = !shouldShowEmailWarning && !shouldShowPasswordWarning;

    if (canRequestLogin) {
      this.setState({ isLoading: true }, this.requestLogin);
    }
  }

  requestLogin = async () => {
    const { email, password } = this.state;
    const response = await requestLogin(email, password);
    const data = await response.json();

    this.setState({ isLoading: false }, () => {
      response.statusCode === 401
        ? this.loginFailed()
        : this.routePage(data.isAdmin)
    });
  }

  loginFailed = () => {
    this.setState({ requestReturnedWrongPassword: true });
  }

  routePage = (isAdmin) => {
    isAdmin
      ? this.props.history.push('/admin')
      : this.props.history.push('/home')
  }

  render() {
    const { 
      email, 
      password, 
      shouldShowEmailWarning,
      shouldShowPasswordWarning,
      isLoading,
      requestReturnedWrongPassword
    } = this.state;

    return (
      <div className='login-form-container'>
        <form className='form login-form box' onSubmit={ this.handleSubmit }>

          <h4 className='heading login-form-container-title'>Boas vindas ao Photrybe! 📸</h4>

          { requestReturnedWrongPassword &&
              <div className="notification is-danger">
                Senha ou email incorretos!
              </div>
          }

          <div className='field control has-icons-left'>
            <input 
              className='input is-medium' 
              type="text" 
              name="email"
              id="email" 
              placeholder="Digite seu email" 
              onChange={this.handleChange} 
              value={email}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
            { shouldShowEmailWarning && 
              <p className="help is-danger">Email deve estar no formato correto</p> 
            }
          </div>

          <div className='field control has-icons-left'>
            <input className='input is-medium'
              type="password"
              name="password"
              id="password"
              placeholder="Digite sua senha"
              onChange={this.handleChange}
              value={password}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
            { shouldShowPasswordWarning && 
              <p className="help is-danger">Senha deve conter mais de 8 caracteres</p> 
            }
          </div>

          <div className="field is-grouped is-grouped-right">
            <p className="control">
              <button className={`button is-primary ${isLoading && "is-loading"}`}>Login</button>
            </p>
          </div>
        </form>
      </div>
    )
  }
}
