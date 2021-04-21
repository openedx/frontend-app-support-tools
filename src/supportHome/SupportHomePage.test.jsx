import { shallow } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import SupportHomePage from './SupportHomePage';

const SupportHomePageWrapper = () => (
  <MemoryRouter>
    <SupportHomePage />
  </MemoryRouter>
);

describe('SupportLinksPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SupportHomePage />);
  });

  it('correctly renders support links', () => {
    expect(wrapper.find('li')).toHaveLength(1);
  });
  it('has search users link', () => {
    const searchUsersText = wrapper.find('#search-users').text();

    expect(searchUsersText).toEqual('Search Users');
  });
  it('has correct page heading', () => {
    const supportToolsText = wrapper.find('h3').text();

    expect(supportToolsText).toEqual('Support Tools');
  });
  it('matches snapshot', () => {
    const tree = renderer.create(<SupportHomePageWrapper />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
