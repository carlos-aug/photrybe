import { Component } from 'react';
import Menu from '../components/Menu';
import CardContainer from '../components/CardContainer';
import { fetchPhotos } from '../helpers/photoAPI';

export default class Home extends Component {

  state = {
    photos: [],
    isLoading: false,
    searchTerm: '',
    shouldShowEmptySearchWarning: false,
    noResultsFound: false
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClick = () => {
    const { searchTerm } = this.state;
    
    searchTerm
      ? this.setState({ isLoading: true, shouldShowEmptySearchWarning: false }, () => this.requestPhotos(searchTerm))
      : this.showEmptySearchWarning();
  }

  requestPhotos = async (searchTerm) => {
    const photos = await fetchPhotos(searchTerm);
    this.setState({ 
      isLoading: false, 
      searchTerm: '', 
      photos,
      noResultsFound: !(photos.length > 0)
    });
  }

  showEmptySearchWarning = () => {
    this.setState({ shouldShowEmptySearchWarning: true });
  }

  render() {
    const { 
      photos, 
      isLoading,
      searchTerm, 
      shouldShowEmptySearchWarning,
      noResultsFound 
    } = this.state;

    return (
      <div>
        <Menu />

        <div className="field has-addons is-flex is-justify-content-center mt-4">
          <div className="control">
            <input 
              className={`input ${shouldShowEmptySearchWarning && 'is-danger'}`}
              name="searchTerm"
              type="text" 
              placeholder="Praia"
              value={searchTerm}
              onChange={this.handleChange} 
            />
          </div>
          <div className="control">
            <button className={`button is-info ${isLoading && "is-loading"}`} onClick={ this.handleClick }>
              Buscar
            </button>
          </div>

        </div>

        { noResultsFound &&
          <div className="is-flex is-justify-content-center">
            <div className="notification is-warning">
              Nenhum resultado encontrado
            </div>
          </div>
        }

        { shouldShowEmptySearchWarning && 
          <p className="help is-danger is-flex is-justify-content-center mt-4">Campo de busca deve conter um termo!</p>
        }

        { !isLoading && 
          <CardContainer photos={photos} />
        }
      </div>
    )
  }
}
