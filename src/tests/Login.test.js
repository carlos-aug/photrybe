import React from "react";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import App from "../App";
import renderWithRouter from './mocks/renderWithRouter';
import userEvent from "@testing-library/user-event";
import * as loginAPI from '../helpers/loginAPI';

describe('Ao entrar na raíz da aplicação e a tela de login ser apresentada', () => {
  test('Os componentes de email, senha e botão de logar estão renderizados na tela', () => {
    // Acessar
    renderWithRouter(<App />);
    const emailInput = screen.getByPlaceholderText('Digite seu email');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');;
    const loginButton = screen.getByRole('button', { name: 'Login' });

    // Agir
    
    // Aferir
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('Ao apertar o botão login SEM PREENCHER os inputs, mensagens de erro devem aparecer para email e senha', () => {
    renderWithRouter(<App />);
    const loginButton = screen.getByRole('button', { name: 'Login' });

    userEvent.click(loginButton);

    const emailErrorElement = screen.getByText('Email deve estar no formato correto');
    const passwordErrorElement = screen.getByText('Senha deve conter mais de 8 caracteres');

    expect(emailErrorElement).toBeInTheDocument()
    expect(passwordErrorElement).toBeInTheDocument()
  });

  test('Ao preencher o EMAIL de forma INCORRETA e a senha de forma correta, mensagem de erro deve aparecer apenas para o email', () => {
    renderWithRouter(<App />);
    const emailInput = screen.getByPlaceholderText('Digite seu email');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');;
    const loginButton = screen.getByRole('button', { name: 'Login' });

    userEvent.type(emailInput, 'xablau');
    userEvent.type(passwordInput, '12345678');
    userEvent.click(loginButton);

    const emailErrorElement = screen.getByText('Email deve estar no formato correto');
    expect(emailErrorElement).toBeInTheDocument();

    const passwordErrorElement = screen.queryByText('Senha deve conter mais de 8 caracteres');
    expect(passwordErrorElement).toBeNull();
  });

  test('Ao preencher a SENHA de forma INCORRETA e o email da forma correta, mensagem de erro deve aparecer apenas para a senha', () => {
    renderWithRouter(<App />);

    const emailInput = screen.getByPlaceholderText('Digite seu email');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const loginButton = screen.getByRole('button', { name: 'Login'});

    userEvent.type(emailInput, 'xablau@gmail.com');
    userEvent.type(passwordInput, '1');
    userEvent.click(loginButton);

    const emailErrorElement = screen.queryByText('Email deve estar no formato correto');
    expect(emailErrorElement).toBeNull();
    
    const passwordErrorElement = screen.getByText('Senha deve conter mais de 8 caracteres');
    expect(passwordErrorElement).toBeInTheDocument();
    
  });

  test('Ao logar com sucesso com uma conta normal, deve fazer a rota para "/home"', async () => {
    // Mockar
    const spy = jest.spyOn(loginAPI, 'requestLogin').mockResolvedValue({
      statusCode: 200,
      json: jest.fn().mockResolvedValue({
        email: "xablau@gmail.com",
        isAdmin: false
      })
    });

    // Acessar
    const { history } = renderWithRouter(<App />);

    const emailInput = screen.getByPlaceholderText('Digite seu email');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const loginButton = screen.getByRole('button', { name: 'Login'});

    // Agir
    userEvent.type(emailInput, 'xablau@gmail.com');
    userEvent.type(passwordInput, '12345678');
    userEvent.click(loginButton);

    // Aferir
    await waitForElementToBeRemoved(loginButton);
    expect(history.location.pathname).toBe('/home');
    
    // Resetar o mock
    spy.mockRestore();
  });

  test('Ao logar com sucesso com uma conta admin, deve fazer a rota para "/admin"', async () => {
    const spy = jest.spyOn(loginAPI, 'requestLogin').mockResolvedValue({
      statusCode: 200,
      json: jest.fn().mockResolvedValue({
        email: "xablau.admin@gmail.com",
        isAdmin: true
      })
    });

    const { history } = renderWithRouter(<App />);

    const emailInput = screen.getByPlaceholderText('Digite seu email');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const loginButton = screen.getByRole('button', { name: 'Login'});

    userEvent.type(emailInput, 'xablau.admin@gmail.com');
    userEvent.type(passwordInput, '12345678');
    userEvent.click(loginButton);

    await waitForElementToBeRemoved(loginButton);
    expect(history.location.pathname).toBe('/admin');

    spy.mockRestore();
  });

  test('Ao tentar logar com a senha incorreta, deve aparecer a mensagem de senha incorreta', async () => {
    const spy = jest.spyOn(loginAPI, 'requestLogin').mockResolvedValue({
      statusCode: 401,
      json: jest.fn().mockResolvedValue({
        email: "",
        isAdmin: false
      })
    });

    const { history } = renderWithRouter(<App />);

    const emailInput = screen.getByPlaceholderText('Digite seu email');
    const passwordInput = screen.getByPlaceholderText('Digite sua senha');
    const loginButton = screen.getByRole('button', { name: 'Login'});

    userEvent.type(emailInput, 'xablau@gmail.com');
    userEvent.type(passwordInput, '11111111');
    userEvent.click(loginButton);

    const wrongPasswordElement = await screen.findByText('Senha ou email incorretos!');

    expect(wrongPasswordElement).toBeInTheDocument();
    expect(history.location.pathname).toBe('/');

    spy.mockRestore();
  });

});
