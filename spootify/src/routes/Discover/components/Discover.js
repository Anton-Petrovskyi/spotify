import React, { Component } from 'react';
import { getNewReleases, getFeaturedPlaylists, getCategories } from '../../../controllers/SpotifyController/SpotifyController';
import DiscoverBlock from './DiscoverBlock';
import '../styles/_discover.scss';

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  /** 
   * Do you resolve each API request one after the other or in parallel?
   *   By the design we don't see all the items righ away. 
   *   So we can improve User Experience by loading items one by one (starting from the top)
  */
  componentDidMount = async () => {
    await this.getData('newReleases', getNewReleases);
    await this.getData('playlists', getFeaturedPlaylists);
    await this.getData('categories', getCategories);
  };

  getData = async (fieldName, fetchFunction) => {
    const fieldValue = await fetchFunction();
    this.setState({ [fieldName]: fieldValue });
  };

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
