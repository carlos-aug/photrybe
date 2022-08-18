import React from "react";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import Home from "../pages/Home";
import renderWithRouter from './mocks/renderWithRouter';
import userEvent from "@testing-library/user-event";
import mockedPhotos from './mocks/mockedPhotos';

describe('Ao entrar na home da aplicação', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockedPhotos)
    });
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });
  
  test('O componente Menu deve apresentar os links de Home, Favoritos e Sair', async () => {
    renderWithRouter(<Home />);

    const homeElement = screen.getByRole('link', { name: 'Home' });
    const favoritesElement = screen.getByRole('link', { name: 'Favoritos' });
    const signOutElement = screen.getByRole('link', { name: 'Sair' });

    expect(homeElement).toBeInTheDocument();
    expect(favoritesElement).toBeInTheDocument();
    expect(signOutElement).toBeInTheDocument();
  });

  test('O clicar em Buscar sem digitar o termo, uma mensagem de erro deve aparecer', () => {
    renderWithRouter(<Home />);

    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    userEvent.click(searchButton);

    const warningElement = screen.getByText('Campo de busca deve conter um termo!');
    expect(warningElement).toBeInTheDocument();
  });

  test('Depois da mensagem de erro aparecer, ao digitar o termo na busca e clicar em Buscar, a mensagem deve desaparecer', () => {
    renderWithRouter(<Home />);

    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    userEvent.click(searchButton);

    let warningElement = screen.getByText('Campo de busca deve conter um termo!');
    expect(warningElement).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Praia');
    userEvent.type(searchInput, 'moon');
    userEvent.click(searchButton);

    warningElement = screen.queryByText('Campo de busca deve conter um termo!');
    expect(warningElement).toBeNull();
  });

  test('Ao pesquisar por algum termo, Cards devem ser renderizados', async () => {
    renderWithRouter(<Home />);

    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    const searchInput = screen.getByPlaceholderText('Praia');
    userEvent.type(searchInput, 'moon');
    userEvent.click(searchButton);

    const cardElementsList = await screen.findAllByText('Gabriel Oliva');
    expect(cardElementsList).toHaveLength(3);
  });

  test('Ao pesquisar por algum termo, a URL deve ser construida corretamente', async () => {
    renderWithRouter(<Home />);
    const searchedTerm = 'XABLAU';
    const expectedHeader = { headers: { Authorization: "Client-ID xaCqrDBwdW22RHRVuI59lZSeujvhFaBdqyN0onbbRkU"}};

    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    const searchInput = screen.getByPlaceholderText('Praia');
    userEvent.type(searchInput, searchedTerm);
    userEvent.click(searchButton);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`https://api.unsplash.com/search/photos?query=${searchedTerm}`, expectedHeader);
  });

  test('Ao pesquisar por um termo que não tras resultados, um aviso de "Nenhum resultado encontrado" deve aparecer', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ results: [] })
    });

    renderWithRouter(<Home />);

    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    const searchInput = screen.getByPlaceholderText('Praia');
    userEvent.type(searchInput, 'alksdjflk');
    userEvent.click(searchButton);

    const noResultsElement = await screen.findByText('Nenhum resultado encontrado');
    expect(noResultsElement).toBeInTheDocument();
  });

});