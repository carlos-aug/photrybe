import React, { Component } from 'react'
import Card from './Card'

export default class CardContainer extends Component {
  render() {
    const { photos } = this.props;

    return (
      <div className='is-flex is-justify-content-space-evenly is-flex-wrap-wrap'>
        { 
          photos.map((photo) => {
            return <Card 
              key={photo.id}
              image={photo.urls.small}
              authorName={photo.user.name} 
              authorBio={photo.user.bio} 
            />
          })
        }
      </div>
    );
  }
}
